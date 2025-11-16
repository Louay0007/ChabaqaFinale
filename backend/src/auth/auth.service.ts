import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { User, UserDocument } from '../schema/user.schema';
import { LoginDto } from '../dto-user/login.dto';
import { LoginResponseDto } from '../dto-user/login-response.dto';
import { EmailService } from '../common/services/email.service';
import { VerificationCodeSchema } from '../schema/verification-code.schema';
import { TokenBlacklistService } from '../common/services/token-blacklist.service';
import { UserLoginActivityService } from '../user-login-activity/user-login-activity.service';
import { RegisterDto } from '../dto-user/register.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private emailService: EmailService,
    private tokenBlacklistService: TokenBlacklistService,
    private userLoginActivityService: UserLoginActivityService,
  ) {}

  async loginWithGoogle(oauthUser: {
    provider: 'google';
    providerId: string;
    email?: string;
    name?: string;
    photo?: string;
  }): Promise<LoginResponseDto> {
    if (!oauthUser.email) {
      throw new BadRequestException('Adresse e-mail Google introuvable');
    }

    let user = await this.userModel.findOne({ email: oauthUser.email.toLowerCase() });

    if (!user) {
      const baseName = oauthUser.name || 'Google User';
      const passwordHash = await this.hashPassword(`google:${oauthUser.providerId}:${Date.now()}`);
      let attempt = 0;
      let candidateName = baseName;
      while (await this.userModel.findOne({ name: candidateName })) {
        attempt++;
        candidateName = `${baseName} ${attempt}`;
      }
      user = await this.userModel.create({
        name: candidateName,
        email: oauthUser.email.toLowerCase(),
        role: 'user',
        password: passwordHash,
      });
    }

    const { accessToken, refreshToken } = this.generateTokens(user, true);

    await this.userLoginActivityService.trackUserLoginForAllCommunities(user._id.toString());

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: this.toUserDto(user),
      rememberMe: true,
      message: 'Connexion réussie avec Google',
    };
  }

  async loginWithGoogleMobile(idToken: string): Promise<LoginResponseDto> {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      throw new UnauthorizedException('Invalid Google ID token');
    }
    const googleUser = {
      provider: 'google' as const,
      providerId: payload.sub,
      email: payload.email,
      name: payload.name,
      photo: payload.picture,
    };
    return this.loginWithGoogle(googleUser);
  }

  async validateUser(email: string, password: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }
    return user;
  }

  private generateTokens(user: UserDocument, rememberMe: boolean = false) {
    const accessTokenPayload = { sub: user._id, email: user.email, role: user.role, jti: new Types.ObjectId().toHexString() };
    const refreshTokenPayload = { sub: user._id, jti: new Types.ObjectId().toHexString() };

    const accessToken = this.jwtService.sign(accessTokenPayload, {
      expiresIn: rememberMe ? '4h' : '2h',
      secret: process.env.JWT_SECRET || 'your-secret-key',
    });
    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      expiresIn: rememberMe ? '90d' : '30d',
      secret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    });

    return { accessToken, refreshToken, rememberMe };
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    const { accessToken, refreshToken } = this.generateTokens(user, loginDto.remember_me || false);
    await this.userLoginActivityService.trackUserLoginForAllCommunities(user._id.toString());
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: this.toUserDto(user),
      rememberMe: loginDto.remember_me || false,
      message: 'Connexion réussie',
    };
  }

  async refreshToken(refreshToken: string): Promise<{ access_token: string; expires_in: number }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
      });
      
      // Check if refresh token is revoked
      const isRevoked = await this.tokenBlacklistService.isTokenRevoked(payload.jti, payload.sub);
      if (isRevoked) {
        throw new UnauthorizedException('Token de rafraîchissement révoqué');
      }
      
      const user = await this.userModel.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Utilisateur non trouvé');
      }
      
      // Generate new access token with proper JTI
      const newAccessTokenPayload = { 
        sub: user._id, 
        email: user.email, 
        role: user.role, 
        jti: new Types.ObjectId().toHexString() 
      };
      
      const newAccessToken = this.jwtService.sign(newAccessTokenPayload, {
        expiresIn: '2h',
        secret: process.env.JWT_SECRET || 'your-secret-key',
      });
      
      return {
        access_token: newAccessToken,
        expires_in: 2 * 60 * 60,
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token de rafraîchissement expiré');
      } else if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token de rafraîchissement invalide');
      }
      throw error;
    }
  }

  async getUserById(userId: string): Promise<UserDocument | null> {
    return this.userModel.findById(userId).select('-password').exec();
  }
  
  async logout(accessToken?: string, refreshToken?: string): Promise<void> {
    if (accessToken) {
      const accessPayload = this.jwtService.decode(accessToken) as any;
      if(accessPayload && accessPayload.sub) {
        await this.tokenBlacklistService.revokeToken(new Types.ObjectId(accessPayload.sub), accessPayload.jti, 'access', new Date(accessPayload.exp * 1000));
      }
    }
    if (refreshToken) {
      const refreshPayload = this.jwtService.decode(refreshToken) as any;
      if(refreshPayload && refreshPayload.sub) {
        await this.tokenBlacklistService.revokeToken(new Types.ObjectId(refreshPayload.sub), refreshPayload.jti, 'refresh', new Date(refreshPayload.exp * 1000));
      }
    }
  }

  async revokeAllTokens(userId: string): Promise<void> {
    await this.tokenBlacklistService.revokeAllUserTokens(new Types.ObjectId(userId));
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message?: string; error?: string }> {
    const user = await this.userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return { success: false, error: "Aucun utilisateur trouvé avec cet email." };
    }
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); 
    const verificationCodeModel = this.userModel.db.model('VerificationCode', VerificationCodeSchema);
    await verificationCodeModel.deleteMany({ userId: user._id, type: 'password_reset' });
    await verificationCodeModel.create({
      userId: user._id,
      code: resetCode,
      type: 'password_reset',
      expiresAt,
    });
    await this.emailService.send2FACode(user.email, resetCode, user.name);
    return { success: true, message: "Code de réinitialisation envoyé par email." };
  }

  async resetPassword(email: string, code: string, newPassword: string): Promise<{ success: boolean; message?: string; error?: string }> {
    const user = await this.userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return { success: false, error: "Aucun utilisateur trouvé avec cet email." };
    }
    const verificationCodeModel = this.userModel.db.model('VerificationCode', VerificationCodeSchema);
    const verificationRecord = await verificationCodeModel.findOne({
      userId: user._id,
      code,
      type: 'password_reset',
      expiresAt: { $gt: new Date() },
    });
    if (!verificationRecord) {
      return { success: false, error: "Code de réinitialisation invalide ou expiré." };
    }
    user.password = await this.hashPassword(newPassword);
    if (user.role) {
      user.role = user.role.toLowerCase() as any;
    }
    await user.save();
    await verificationCodeModel.deleteOne({ _id: verificationRecord._id });
    return { success: true, message: "Mot de passe réinitialisé avec succès." };
  }

  async register(registerDto: RegisterDto): Promise<{ success: boolean; message: string; user?: any; error?: string }> {
    const { name, email, password, numtel, date_naissance } = registerDto;
    const existingUser = await this.userModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new BadRequestException('Un utilisateur avec cet email existe déjà.');
    }
    const hashedPassword = await this.hashPassword(password);
    const newUser = await this.userModel.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      numtel,
      date_naissance,
      role: 'user',
    });
    return {
      success: true,
      message: 'Utilisateur créé avec succès.',
      user: this.toUserDto(newUser),
    };
  }

  async registerCreator(registerDto: RegisterDto): Promise<{ success: boolean; message: string; user?: any; error?: string }> {
    const { name, email, password, numtel, date_naissance } = registerDto;
    const existingUser = await this.userModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new BadRequestException('Un utilisateur avec cet email existe déjà.');
    }
    const hashedPassword = await this.hashPassword(password);
    const newUser = await this.userModel.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      numtel,
      date_naissance,
      role: 'creator',
    });
    return {
      success: true,
      message: 'Créateur créé avec succès.',
      user: this.toUserDto(newUser),
    };
  }

  private toUserDto(user: UserDocument) {
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}