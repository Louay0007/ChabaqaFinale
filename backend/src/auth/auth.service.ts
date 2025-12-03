import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import * as crypto from 'crypto';
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
  ) { }

  // Helper to create device fingerprint (UA + IP)
  private createFingerprint(req: any): string {
    const userAgent = req.headers?.['user-agent'] || 'unknown';
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    return crypto.createHash('sha256').update(userAgent + ip).digest('hex');
  }

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

    const { accessToken, refreshToken } = this.generateTokens(user, true, '');

    await this.userLoginActivityService.trackUserLoginForAllCommunities(user._id.toString());

    const userDto = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: userDto,
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
    const user = await this.userModel.findOne({ email }).select('+password +twoFactorEnabled');
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }
    return user;
  }

  private generateTokens(user: UserDocument, rememberMe: boolean = false, fingerprint: string = '') {
    const accessTokenPayload = {
      sub: user._id,
      email: user.email,
      role: user.role,
      jti: new Types.ObjectId().toHexString(),
      fingerprint
    };
    const refreshTokenPayload = {
      sub: user._id,
      jti: new Types.ObjectId().toHexString(),
      fingerprint
    };

    const accessToken = this.jwtService.sign(accessTokenPayload, {
      expiresIn: rememberMe ? '15m' : '15m', // Always 15min for security
      secret: process.env.JWT_SECRET || 'your-secret-key',
    });
    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      expiresIn: rememberMe ? '90d' : '30d',
      secret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    });

    return { accessToken, refreshToken, rememberMe };
  }

  async verifyTwoFactorCode(userId: string, code: string, rememberMe: boolean = false, req?: any): Promise<LoginResponseDto> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    const verificationCodeModel = this.userModel.db.model('VerificationCode', VerificationCodeSchema);
    const verificationRecord = await verificationCodeModel.findOne({
      userId: user._id,
      code,
      type: '2fa_login',
      expiresAt: { $gt: new Date() },
    });

    if (!verificationRecord) {
      throw new UnauthorizedException('Code de vérification invalide ou expiré.');
    }

    await verificationCodeModel.deleteOne({ _id: verificationRecord._id });

    const fingerprint = req ? this.createFingerprint(req) : '';
    const { accessToken, refreshToken } = this.generateTokens(user, rememberMe, fingerprint);
    await this.userLoginActivityService.trackUserLoginForAllCommunities(user._id.toString());

    const userDto = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: userDto,
      rememberMe: rememberMe,
      message: 'Vérification 2FA réussie',
    };
  }

  async login(loginDto: LoginDto): Promise<{ requires2FA: boolean; userId: string; accessToken?: string; refreshToken?: string; user?: any }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    // Check if 2FA is enabled for this user
    if (user.twoFactorEnabled) {
      await this.send2FACodeToUser(user._id.toString());
      return { requires2FA: true, userId: user._id.toString() };
    }

    // If 2FA is not enabled, generate tokens immediately
    const { accessToken, refreshToken } = this.generateTokens(user, loginDto.remember_me);
    await this.userLoginActivityService.trackUserLoginForAllCommunities(user._id.toString());

    const userDto = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    return {
      requires2FA: false,
      userId: user._id.toString(),
      accessToken,
      refreshToken,
      user: userDto
    };
  }

  async resend2FACode(userId: string): Promise<{ success: boolean; message?: string; error?: string }> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      return { success: false, error: "Utilisateur non trouvé." };
    }

    await this.send2FACodeToUser(userId);
    return { success: true, message: "Code de vérification renvoyé par email." };
  }

  private async send2FACodeToUser(userId: string): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const verificationCodeModel = this.userModel.db.model('VerificationCode', VerificationCodeSchema);

    // Delete old codes for this user
    await verificationCodeModel.deleteMany({ userId: user._id, type: '2fa_login' });

    // Create new code (always create, even if email fails)
    await verificationCodeModel.create({
      userId: user._id,
      code,
      type: '2fa_login',
      expiresAt,
    });

    // Send email (non-blocking - don't fail login if email fails)
    const emailSent = await this.emailService.send2FACode(user.email, code, user.name);

    if (!emailSent) {
      // Log warning but don't throw - code is still valid and logged in dev
      this.logger.warn(`⚠️ Code 2FA créé pour ${user.email} mais l'email n'a pas pu être envoyé.`);
      this.logger.warn(`⚠️ Le code ${code} est valide et disponible dans les logs (mode développement).`);
    }
  }

  async refreshToken(refreshToken: string, req?: any): Promise<{ access_token: string; refresh_token: string; expires_in: number }> {
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

      // Validate fingerprint (anti-theft)
      const currentFingerprint = req ? this.createFingerprint(req) : '';
      if (payload.fingerprint && payload.fingerprint !== currentFingerprint) {
        // Fingerprint mismatch → revoke all tokens
        await this.revokeAllTokens(user._id.toString());
        throw new UnauthorizedException('Appareil ou navigateur non reconnu - toutes les sessions ont été déconnectées');
      }

      // Revoke old refresh token (rotation)
      await this.tokenBlacklistService.revokeToken(
        new Types.ObjectId(payload.sub),
        payload.jti,
        'refresh',
        new Date(payload.exp * 1000)
      );

      // Generate new tokens
      const fingerprint = currentFingerprint || payload.fingerprint || '';
      const newAccessTokenPayload = {
        sub: user._id,
        email: user.email,
        role: user.role,
        jti: new Types.ObjectId().toHexString(),
        fingerprint
      };
      const newRefreshTokenPayload = {
        sub: user._id,
        jti: new Types.ObjectId().toHexString(),
        fingerprint
      };

      const newAccessToken = this.jwtService.sign(newAccessTokenPayload, {
        expiresIn: '15m',
        secret: process.env.JWT_SECRET || 'your-secret-key',
      });
      const newRefreshToken = this.jwtService.sign(newRefreshTokenPayload, {
        expiresIn: payload.exp > Date.now() / 1000 + 30 * 24 * 60 * 60 ? '90d' : '30d',
        secret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
      });

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        expires_in: 15 * 60, // 15 minutes
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
      if (accessPayload && accessPayload.sub) {
        await this.tokenBlacklistService.revokeToken(new Types.ObjectId(accessPayload.sub), accessPayload.jti, 'access', new Date(accessPayload.exp * 1000));
      }
    }
    if (refreshToken) {
      const refreshPayload = this.jwtService.decode(refreshToken) as any;
      if (refreshPayload && refreshPayload.sub) {
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
    const userDto = {
      _id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };
    return {
      success: true,
      message: 'Utilisateur créé avec succès.',
      user: userDto,
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
    const userDto = {
      _id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };
    return {
      success: true,
      message: 'Créateur créé avec succès.',
      user: userDto,
    };
  }
}