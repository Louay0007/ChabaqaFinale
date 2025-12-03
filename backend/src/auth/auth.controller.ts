import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto-user/login.dto';
import { LoginResponseDto } from '../dto-user/login-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto } from '../dto-user/register.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User Login',
    description: 'Authenticate user credentials. 2FA is optional based on user settings.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful or 2FA required.',
    schema: {
      type: 'object',
      properties: {
        requires2FA: { type: 'boolean', example: true },
        userId: { type: 'string', example: '64a1b2c3d4e5f6789abcdef0' },
        user: { type: 'object' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(loginDto);

    if (!result.requires2FA && result.accessToken && result.refreshToken) {
      // Set HttpOnly cookies
      this.setCookies(res, result.accessToken, result.refreshToken, loginDto.remember_me);
    }

    return result;
  }

  @Post('verify-2fa')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify 2FA Code',
    description: 'Verify the 2FA code and complete the login process.',
  })
  @ApiBody({ schema: { type: 'object', properties: { userId: { type: 'string' }, code: { type: 'string' }, rememberMe: { type: 'boolean' } } } })
  async verifyTwoFactorCode(@Body() body: { userId: string; code: string; rememberMe?: boolean }, @Req() req, @Res({ passthrough: true }) res: Response): Promise<LoginResponseDto> {
    const result = await this.authService.verifyTwoFactorCode(body.userId, body.code, body.rememberMe || false, req);

    // Set HttpOnly cookies
    this.setCookies(res, result.access_token, result.refresh_token, body.rememberMe);

    return result;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh Access Token',
    description: 'Refresh expired access token using refresh token from cookie or body.',
  })
  @ApiBody({ type: require('./dto/refresh-token.dto').RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refreshToken(@Body() body: { refreshToken?: string }, @Req() req, @Res({ passthrough: true }) res: Response) {
    // Try to get refresh token from cookie first, then body
    const refreshToken = req.cookies?.refreshToken || body.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token manquant');
    }

    const result = await this.authService.refreshToken(refreshToken, req);

    // Update cookies with new tokens
    this.setCookies(res, result.access_token, result.refresh_token);

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({
    summary: 'Get Current User Profile',
    description: 'Get current authenticated user profile information.',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Req() req) {
    try {
      // The user object is attached to the request by the JwtAuthGuard
      if (!req.user || !req.user._id) {
        throw new UnauthorizedException('Token non valide ou expiré');
      }

      const user = await this.authService.getUserById(req.user._id);

      if (!user) {
        throw new UnauthorizedException('Utilisateur non trouvé');
      }

      return {
        success: true,
        data: user,
        message: 'Token valide',
      };
    } catch (error) {
      // Re-throw UnauthorizedException as-is
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      // For any other error, return a generic unauthorized message
      throw new UnauthorizedException('Erreur lors de la récupération du profil');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User Logout',
    description: 'Logout user and revoke tokens.',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    try {
      const userId = req.user._id;
      const accessToken = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.accessToken;

      // Extract refresh token from cookie or request body
      const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

      // Revoke both tokens
      await this.authService.logout(accessToken, refreshToken);

      // Clear cookies
      this.clearCookies(res);

      return {
        success: true,
        message: 'Déconnexion réussie.',
      };
    } catch (error) {
      // Even if revocation fails, clear cookies
      this.clearCookies(res);
      return {
        success: true,
        message: 'Déconnexion réussie.',
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('revoke-all-tokens')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Revoke All User Tokens',
    description: 'Revoke all tokens for the current user across all devices.',
  })
  @ApiResponse({ status: 200, description: 'All tokens revoked successfully' })
  async revokeAllTokens(@Req() req, @Res({ passthrough: true }) res: Response) {
    const userId = req.user._id;
    await this.authService.revokeAllTokens(userId);

    // Clear cookies for current device
    this.clearCookies(res);

    return {
      success: true,
      message: 'Tous les tokens de l\'utilisateur ont été révoqués.',
    };
  }

  private setCookies(res: Response, accessToken: string, refreshToken: string, rememberMe: boolean = false) {
    const isProduction = process.env.NODE_ENV === 'production';

    // Access Token Cookie (15 min)
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax', // Allow navigation from external sites
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
    });

    // Refresh Token Cookie (30 days or 90 days)
    const refreshMaxAge = rememberMe ? 90 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: refreshMaxAge,
      path: '/',
    });
  }

  private clearCookies(res: Response) {
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,
      path: '/',
    };

    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Forgot Password', description: 'Send password reset code to user email.' })
  @ApiBody({ schema: { type: 'object', properties: { email: { type: 'string' } } } })
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset Password', description: 'Reset password using code sent to email.' })
  @ApiBody({ type: require('../dto-user/reset-password.dto').ResetPasswordDto })
  async resetPassword(@Body() body: import('../dto-user/reset-password.dto').ResetPasswordDto) {
    return this.authService.resetPassword(body.email, body.verificationCode, body.newPassword);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Start Google OAuth 2.0 login' })
  async googleAuth() {
    // Redirects to Google for authentication
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth 2.0 callback' })
  async googleAuthCallback(@Req() req) {
    const result = await (this.authService as any).loginWithGoogle(req.user);
    return result;
  }

  @Post('google/mobile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mobile Google Sign-In' })
  @ApiBody({ schema: { type: 'object', properties: { idToken: { type: 'string' } } } })
  async googleMobileAuth(@Body() body: { idToken: string }) {
    return this.authService.loginWithGoogleMobile(body.idToken);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'User Registration' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('register-creator')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Creator Registration' })
  @ApiBody({ type: RegisterDto })
  async registerCreator(@Body() registerDto: RegisterDto) {
    return this.authService.registerCreator(registerDto);
  }

  @Post('resend-2fa')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Resend 2FA Code',
    description: 'Resend a new 2FA verification code to the user\'s email.',
  })
  @ApiBody({ schema: { type: 'object', properties: { userId: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: '2FA code resent successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async resend2FACode(@Body() body: { userId: string }) {
    return this.authService.resend2FACode(body.userId);
  }
}
