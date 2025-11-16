import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiExcludeEndpoint } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto-user/login.dto';
import { LoginResponseDto } from '../dto-user/login-response.dto';
import { Verify2FADto } from '../dto-user/verify-2fa.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CookieUtil } from '../common/utils/cookie.util';
import { RegisterDto } from '../dto-user/register.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint de connexion avec envoi automatique du code 2FA
   * POST /auth/login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User Login with 2FA',
    description: 'Authenticate user and send 2FA code to email. Use /auth/verify-2fa to complete login.',
    tags: ['Authentication']
  })
  @ApiBody({
    type: LoginDto,
    description: 'User login credentials',
    examples: {
      'Basic Login': {
        summary: 'Basic login example',
        value: {
          email: 'user@example.com',
          password: 'password123',
          remember_me: false
        }
      },
      'Remember Me Login': {
        summary: 'Login with remember me option',
        value: {
          email: 'user@example.com',
          password: 'password123',
          remember_me: true
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: '2FA code sent successfully',
    type: LoginResponseDto,
    content: {
      'application/json': {
        example: {
          access_token: "",
          refresh_token: "",
          requires2FA: true,
          message: "Code de vérification envoyé par email. Utilisez /auth/verify-2fa pour compléter la connexion."
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    content: {
      'application/json': {
        example: {
          statusCode: 401,
          message: 'Email ou mot de passe incorrect',
          error: 'Unauthorized'
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation errors',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: ['email must be an email', 'password must be longer than or equal to 8 characters'],
          error: 'Bad Request'
        }
      }
    }
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    content: {
      'application/json': {
        example: {
          statusCode: 500,
          message: 'Internal server error',
          error: 'Internal Server Error'
        }
      }
    }
  })
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response): Promise<LoginResponseDto> {
    const result = await this.authService.login(loginDto);
    
    // Si la connexion est réussie (pas de 2FA requis), on définit les cookies
    if (!result.requires2FA && result.access_token && result.refresh_token) {
      CookieUtil.setTokenCookies(res, result.access_token, result.refresh_token);
    }
    
    return result;
  }

  /**
   * Endpoint de vérification du code 2FA
   * POST /auth/verify-2fa
   */
  @Post('verify-2fa')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify 2FA Code',
    description: 'Complete authentication by verifying the 2FA code sent to email.',
    tags: ['Authentication']
  })
  @ApiBody({
    type: Verify2FADto,
    description: '2FA verification code',
    examples: {
      '2FA Verification': {
        summary: 'Verify 2FA code',
        value: {
          email: 'user@example.com',
          verificationCode: '123456'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Authentication successful',
    type: LoginResponseDto,
    content: {
      'application/json': {
        example: {
          access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          user: {
            _id: "64a1b2c3d4e5f6789abcdef0",
            name: "John Doe",
            email: "user@example.com",
            role: "user",
            createdAt: "2023-07-01T10:00:00.000Z"
          },
          rememberMe: false,
          message: "Connexion réussie avec authentification à deux facteurs"
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired verification code',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'Code de vérification invalide ou expiré',
          error: 'Bad Request'
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    content: {
      'application/json': {
        example: {
          statusCode: 404,
          message: 'Email invalide',
          error: 'Not Found'
        }
      }
    }
  })
  async verify2FA(@Body() verify2FADto: Verify2FADto, @Res({ passthrough: true }) res: Response): Promise<LoginResponseDto> {
    const result = await this.authService.verify2FA(verify2FADto);
    
    // Après une vérification 2FA réussie, on définit les cookies
    if (result.access_token && result.refresh_token) {
      // Le "Remember Me" est géré dans le service et récupéré du code de vérification
      CookieUtil.setTokenCookies(res, result.access_token, result.refresh_token, result.rememberMe || false);
    }
    
    return result;
  }

  /**
   * Endpoint de rafraîchissement de token
   * POST /auth/refresh
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh Access Token',
    description: 'Refresh expired access token using refresh token.',
    tags: ['Authentication']
  })
  @ApiBody({
    description: 'Refresh token (optional if provided via cookie)',
    schema: {
      type: 'object',
      properties: {
        refresh_token: {
          type: 'string',
          description: 'Refresh token (optional if provided via cookie)',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        },
        refreshToken: { // Add support for camelCase frontend naming
          type: 'string',
          description: 'Refresh token (optional if provided via cookie)',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
      }
    },
    examples: {
      'With Refresh Token': {
        summary: 'Refresh with token in body',
        value: {
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
      },
      'Without Refresh Token': {
        summary: 'Refresh using cookie (empty body)',
        value: {}
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    content: {
      'application/json': {
        example: {
          access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // Added for frontend compatibility
          expires_in: 7200
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired refresh token',
    content: {
      'application/json': {
        example: {
          error: 'Refresh token manquant',
          message: 'Veuillez fournir un refresh token dans le body ou via cookie'
        }
      }
    }
  })
  async refreshToken(@Body() body: { refresh_token?: string, refreshToken?: string }, @Req() req, @Res({ passthrough: true }) res: Response) {
    console.log('AUTH DEBUG - refreshToken');
    console.log('  Cookies:', req.cookies);
    
    // Récupérer le refresh token depuis le cookie ou le body (support both naming conventions)
    const refreshToken = 
      body.refreshToken || // Frontend camelCase
      body.refresh_token || // Backend snake_case
      req.cookies[CookieUtil.COOKIE_NAMES.REFRESH_TOKEN] || // New cookie name
      req.cookies['refresh_token']; // Old cookie name
    
    if (!refreshToken) {
      console.log('  ERROR: No refresh token found');
      return {
        success: false,
        error: 'Refresh token manquant',
        message: 'Veuillez fournir un refresh token dans le body ou via cookie'
      };
    }
    
    try {
      console.log('  Attempting token refresh');
      let result = await this.authService.refreshToken(refreshToken);
      
      // Add both access_token and accessToken for frontend compatibility
      const resultWithBoth: any = { ...result };
      if (!resultWithBoth.accessToken && resultWithBoth.access_token) {
        resultWithBoth.accessToken = resultWithBoth.access_token;
      }
      if (!resultWithBoth.access_token && resultWithBoth.accessToken) {
        resultWithBoth.access_token = resultWithBoth.accessToken;
      }
      
      // Use the enhanced result
      result = resultWithBoth;
      
      // Définir le nouveau access token dans un cookie
      if (result.access_token) {
        console.log('  Setting new access token cookie');
        CookieUtil.setAccessTokenCookie(res, result.access_token, false); // Refresh ne change pas le "Remember Me"
      }
      
      return result;
    } catch (error) {
      console.log('  Refresh error:', error.message);
      return {
        success: false,
        error: 'Refresh token invalide',
        message: error.message || 'Impossible de rafraîchir le token'
      };
    }
  }

  /**
   * Endpoint pour vérifier le token actuel
   * GET /auth/me
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({
    summary: 'Get Current User Profile',
    description: 'Get current authenticated user profile information.',
    tags: ['Authentication']
  })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    content: {
      'application/json': {
        example: {
          user: {
            sub: "64a1b2c3d4e5f6789abcdef0",
            email: "user@example.com",
            role: "user",
            iat: 1688123456,
            exp: 1688130656
          },
          message: "Token valide"
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or expired token',
    content: {
      'application/json': {
        example: {
          statusCode: 401,
          message: 'Unauthorized',
          error: 'Unauthorized'
        }
      }
    }
  })
  async getProfile(@Req() req, @Res({ passthrough: true }) res: Response) {
    // Add debug info for troubleshooting
    console.log('AUTH DEBUG - getProfile')
    console.log('  JWT User:', req.user);
    console.log('  Cookies:', req.cookies);
    console.log('  Headers:', req.headers.authorization ? 'Has Auth Header' : 'No Auth Header');
    
    // Get fresh user data from database instead of JWT payload
    const userId = req.user.sub || req.user._id || req.user.userId;
    console.log('  Using user ID:', userId);
    
    if (!userId) {
      return {
        error: "No valid user ID found in token",
        code: "INVALID_TOKEN",
      };
    }
    
    const user = await this.authService.getUserById(userId);
    
    if (!user) {
      console.log('  WARNING: User not found in database:', userId);
      return {
        user: req.user,  // Fallback to JWT data if user not found
        message: 'Token valide (user not in DB)',
      };
    }
    
    console.log('  Found user in DB:', user.email);
    
    return {
      success: true,
      data: {
        _id: user._id,
        id: user._id, // For frontend compatibility
        name: user.name,
        email: user.email,
        role: user.role,
        numtel: user.numtel,
        date_naissance: user.date_naissance,
        sexe: user.sexe,
        pays: user.pays,
        ville: user.ville,
        code_postal: user.code_postal,
        adresse: user.adresse,
        bio: user.bio,
        avatar: user.photo_profil || user.profile_picture,
        lien_instagram: user.lien_instagram,
        createdAt: user.createdAt,
        isAdmin: user.role === 'creator',  // For compatibility with mobile app
      },
      message: 'Token valide',
    };
  }

  /**
   * Endpoint de déconnexion avec révocation des tokens
   * POST /auth/logout
   */
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User Logout',
    description: 'Logout user and revoke all tokens.',
    tags: ['Authentication']
  })
  // Remove @UseGuards to allow logout without a valid token
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
    content: {
      'application/json': {
        example: {
          message: "Déconnexion réussie. 2 token(s) révoqué(s).",
          revokedTokens: 2,
          details: "Tokens révoqués côté serveur et cookies supprimés côté client"
        }
      }
    }
  })
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    console.log('AUTH DEBUG - logout');
    console.log('  Cookies:', req.cookies);
    console.log('  Headers:', req.headers.authorization ? 'Has Auth Header' : 'No Auth Header');
    
    // Récupérer les tokens depuis les headers ou cookies (check both new and old cookie names)
    const accessToken = req.headers.authorization?.replace('Bearer ', '') || 
                       req.cookies[CookieUtil.COOKIE_NAMES.ACCESS_TOKEN] || 
                       req.cookies['access_token'];
                       
    const refreshToken = req.cookies[CookieUtil.COOKIE_NAMES.REFRESH_TOKEN] || 
                        req.cookies['refresh_token'];
    
    let logoutResult = { message: 'No tokens to revoke', revokedTokens: 0 };
    
    if (accessToken || refreshToken) {
      try {
        // Révoquer les tokens côté serveur
        logoutResult = await this.authService.logout(accessToken, refreshToken);
      } catch (error) {
        console.log('  Error during token revocation:', error.message);
      }
    }
    
    // Supprimer les cookies côté client (always clear cookies, even if token revocation fails)
    CookieUtil.clearTokenCookies(res);
    
    return {
      success: true,
      message: logoutResult.message,
      revokedTokens: logoutResult.revokedTokens,
      details: 'Tokens révoqués côté serveur et cookies supprimés côté client'
    };
  }

  /**
   * Endpoint pour révoquer tous les tokens d'un utilisateur
   * POST /auth/revoke-all-tokens
   */
  @UseGuards(JwtAuthGuard)
  @Post('revoke-all-tokens')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Revoke All User Tokens',
    description: 'Revoke all tokens for current user across all devices.',
    tags: ['Authentication']
  })
  // Remove @UseGuards to allow token revocation without JWT
  @ApiResponse({
    status: 200,
    description: 'All tokens revoked successfully',
    content: {
      'application/json': {
        example: {
          message: "Tous les tokens de l'utilisateur ont été révoqués.",
          details: "Tous les tokens de l'utilisateur ont été révoqués sur tous les appareils"
        }
      }
    }
  })
  async revokeAllTokens(@Body() body: { userId?: string }, @Req() req, @Res({ passthrough: true }) res: Response) {
    console.log('AUTH DEBUG - revokeAllTokens');
    
    // Get userId from JWT if available, or body parameter
    let userId = req.user?.sub || req.user?._id || req.user?.userId || body.userId;
    
    // If we have an access token in cookies, try to extract userId
    const accessToken = req.cookies[CookieUtil.COOKIE_NAMES.ACCESS_TOKEN] || req.cookies['access_token'];
    if (accessToken && !userId) {
      try {
        // Use the JWT service or similar to decode token instead of a non-existent method
        // This is a safer way to get userId without creating new methods
        const decoded = this.authService.decodeToken(accessToken);
        userId = decoded?.sub || decoded?._id || decoded?.userId;
      } catch (error) {
        console.log('  Invalid access token in cookie, cannot extract userId');
      }
    }
    
    if (!userId) {
      console.log('  No userId found, clearing cookies only');
      CookieUtil.clearTokenCookies(res);
      return {
        success: true,
        message: 'Cookies cleared',
        details: 'No user ID provided to revoke server-side tokens'
      };
    }
    
    console.log(`  Revoking tokens for user: ${userId}`);
    
    try {
      // Révoquer tous les tokens de l'utilisateur
      const result = await this.authService.revokeAllTokens(userId);
      
      // Supprimer les cookies côté client
      CookieUtil.clearTokenCookies(res);
      
      return {
        success: true,
        message: result.message,
        details: 'Tous les tokens de l\'utilisateur ont été révoqués sur tous les appareils'
      };
    } catch (error) {
      console.log('  Error revoking tokens:', error.message);
      // Still clear cookies even if server-side token revocation fails
      CookieUtil.clearTokenCookies(res);
      
      return {
        success: false,
        message: 'Error revoking tokens',
        error: error.message,
        details: 'Cookies have been cleared'
      };
    }
  }

  /**
   * Endpoint pour demander la réinitialisation du mot de passe
   * POST /auth/forgot-password
   */
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Forgot Password', description: 'Send password reset code to user email.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' }
      }
    }
  })
  async forgotPassword(@Body('email') email: string) {
    return await this.authService.forgotPassword(email);
  }

  /**
   * Endpoint pour réinitialiser le mot de passe
   * POST /auth/reset-password
   */
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset Password', description: 'Reset password using code sent to email.' })
  @ApiBody({ type: require('../dto-user/reset-password.dto').ResetPasswordDto })
  async resetPassword(@Body() body: import('../dto-user/reset-password.dto').ResetPasswordDto) {
    return await this.authService.resetPassword(body.email, body.verificationCode, body.newPassword);
  }

  // ============ GOOGLE OAUTH 2.0 ============
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Start Google OAuth 2.0 login', description: 'Redirects to Google for authentication.' })
  async googleAuth() {
    return;
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth 2.0 callback', description: 'Handles Google OAuth callback and issues JWT.' })
  async googleAuthCallback(@Req() req, @Res({ passthrough: true }) res: Response) {
    const oauthUser = req.user;
    const result = await (this.authService as any).loginWithGoogle(oauthUser);
    // set cookies
    if (result.access_token && result.refresh_token) {
      CookieUtil.setTokenCookies(res, result.access_token, result.refresh_token, true);
    }
    return result;
  }

  /**
   * Mobile Google Sign-In endpoint
   * POST /auth/google/mobile
   */
  @Post('google/mobile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Mobile Google Sign-In',
    description: 'Authenticate mobile user with Google ID token from Expo Google Sign-In',
    tags: ['Authentication']
  })
  @ApiBody({
    description: 'Google ID token from mobile app',
    schema: {
      type: 'object',
      properties: {
        idToken: {
          type: 'string',
          description: 'Google ID token obtained from mobile Google Sign-In'
        }
      },
      required: ['idToken']
    },
    examples: {
      'Mobile Google Login': {
        summary: 'Mobile Google authentication',
        value: {
          idToken: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjE2NzAyN...'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Google authentication successful',
    type: LoginResponseDto
  })
  @ApiResponse({ status: 400, description: 'Invalid Google ID token' })
  @ApiResponse({ status: 401, description: 'Google authentication failed' })
  async googleMobileAuth(@Body() body: { idToken: string }) {
    return await this.authService.loginWithGoogleMobile(body.idToken);
  }

  /**
   * Endpoint de création de compte
   * POST /auth/register
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'User Registration',
    description: 'Create a new user account.',
    tags: ['Authentication']
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    content: {
      'application/json': {
        example: {
          success: true,
          message: 'Utilisateur créé avec succès.',
          user: {
            _id: '64a1b2c3d4e5f6789abcdef0',
            name: 'John Doe',
            email: 'user@example.com',
            role: 'user',
            createdAt: '2023-07-01T10:00:00.000Z'
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors or user already exists' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * Endpoint de création de compte créateur
   * POST /auth/register-creator
   */
  @Post('register-creator')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Creator Registration',
    description: 'Create a new creator account with creator role.',
    tags: ['Authentication']
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Creator created successfully',
    content: {
      'application/json': {
        example: {
          success: true,
          message: 'Créateur créé avec succès.',
          user: {
            _id: '64a1b2c3d4e5f6789abcdef0',
            name: 'John Creator',
            email: 'creator@example.com',
            role: 'creator',
            createdAt: '2023-07-01T10:00:00.000Z'
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors or user already exists' })
  async registerCreator(@Body() registerDto: RegisterDto) {
    return this.authService.registerCreator(registerDto);
  }
} 