import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto-user/login.dto';
import { LoginResponseDto } from '../dto-user/login-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CookieUtil } from '../common/utils/cookie.util';
import { RegisterDto } from '../dto-user/register.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User Login',
    description: 'Authenticate user and return JWT tokens.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response): Promise<LoginResponseDto> {
    const result = await this.authService.login(loginDto);
    if (result.access_token && result.refresh_token) {
      CookieUtil.setTokenCookies(res, result.access_token, result.refresh_token, result.rememberMe || false);
    }
    return result;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh Access Token',
    description: 'Refresh expired access token using refresh token.',
  })
  @ApiBody({ type: require('./dto/refresh-token.dto').RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refreshToken(@Body() body: { refreshToken?: string }, @Req() req, @Res({ passthrough: true }) res: Response) {
    const refreshToken = body.refreshToken || req.cookies[CookieUtil.COOKIE_NAMES.REFRESH_TOKEN];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token manquant');
    }
    
    const result = await this.authService.refreshToken(refreshToken);
    if (result.access_token) {
      CookieUtil.setAccessTokenCookie(res, result.access_token, false);
    }
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
    // The user object is attached to the request by the JwtAuthGuard
    const user = await this.authService.getUserById(req.user._id);
    return {
      success: true,
      data: user,
      message: 'Token valide',
    };
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
      const accessToken = req.headers.authorization?.replace('Bearer ', '');
      const refreshToken = req.cookies[CookieUtil.COOKIE_NAMES.REFRESH_TOKEN];
      
      // Revoke both tokens
      await this.authService.logout(accessToken, refreshToken);
      
      // Clear cookies from response
      CookieUtil.clearTokenCookies(res);
      
      return {
        success: true,
        message: 'Déconnexion réussie.',
      };
    } catch (error) {
      // Still clear cookies even if revocation fails
      CookieUtil.clearTokenCookies(res);
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
    CookieUtil.clearTokenCookies(res);
    return {
      success: true,
      message: 'Tous les tokens de l\'utilisateur ont été révoqués.',
    };
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
  async googleAuthCallback(@Req() req, @Res({ passthrough: true }) res: Response) {
    const result = await (this.authService as any).loginWithGoogle(req.user);
    if (result.access_token && result.refresh_token) {
      CookieUtil.setTokenCookies(res, result.access_token, result.refresh_token, true);
    }
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
}
 