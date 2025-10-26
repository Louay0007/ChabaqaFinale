/**
 * Google Authentication Service for Mobile App
 * 
 * This service handles Google Sign-In integration using Expo's Google authentication.
 * It provides a seamless way to authenticate users with Google and integrate with the backend.
 * 
 * REQUIRED DEPENDENCIES:
 * Run these commands in your mobile directory:
 * 1. expo install expo-auth-session expo-web-browser
 * 2. npx expo install @expo/config-plugins (if not already installed)
 * 
 * Note: We're using WebBrowser-based auth to avoid React hook limitations
 * 
 * REQUIRED CONFIGURATION:
 * Add to your app.json/app.config.js in the expo section:
 * {
 *   "expo": {
 *     "scheme": "your-app-name",
 *     "plugins": [
 *       "@expo/config-plugins"
 *     ]
 *   }
 * }
 */

import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { Platform } from 'react-native';
import { googleSignInAction, GoogleSignInResult } from './auth-api';

// Complete the authentication session for web browser
WebBrowser.maybeCompleteAuthSession();

interface GoogleUser {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface GoogleAuthConfig {
  expoClientId?: string;
  iosClientId?: string;
  androidClientId?: string;
  webClientId?: string;
}

class GoogleAuthService {
  private config: GoogleAuthConfig;

  constructor() {
    // These come from environment variables or Expo config
    this.config = {
      expoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    };
  }

  /**
   * Main Google Sign-In method
   * This handles the complete Google Sign-In flow using WebBrowser
   */
  async signInWithGoogle(): Promise<GoogleSignInResult> {
    try {
      console.log('🔐 [GOOGLE-AUTH] Starting Google Sign-In process');

      // Create redirect URI
      const redirectUri = makeRedirectUri({
        scheme: 'chabaqa', // Replace with your app scheme
      });

      // Get the appropriate client ID for the platform
      const clientId = Platform.select({
        ios: this.config.iosClientId,
        android: this.config.androidClientId,
        default: this.config.expoClientId || this.config.webClientId,
      });

      if (!clientId) {
        throw new Error('Google Client ID not configured for this platform');
      }

      // Configure the authentication URL
      const authUrl = `https://accounts.google.com/oauth/authorize?` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=id_token&` +
        `scope=openid profile email&` +
        `nonce=${Math.random().toString(36)}`;

      console.log('🌐 [GOOGLE-AUTH] Opening Google authentication');
      
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
      
      if (result.type === 'success') {
        // Extract the ID token from the URL
        const url = result.url;
        const idTokenMatch = url.match(/id_token=([^&]+)/);
        
        if (idTokenMatch) {
          const idToken = decodeURIComponent(idTokenMatch[1]);
          console.log('✅ [GOOGLE-AUTH] Google ID token received');
          
          // Send the ID token to our backend for verification
          const authResult = await googleSignInAction(idToken);
          return authResult;
        } else {
          console.error('❌ [GOOGLE-AUTH] No ID token received');
          return {
            success: false,
            error: 'No authentication token received from Google'
          };
        }
      } else if (result.type === 'cancel') {
        console.log('📋 [GOOGLE-AUTH] User cancelled Google Sign-In');
        return {
          success: false,
          error: 'Sign-in was cancelled'
        };
      } else {
        console.error('❌ [GOOGLE-AUTH] Google Sign-In failed:', result);
        return {
          success: false,
          error: 'Google Sign-In failed'
        };
      }
    } catch (error: any) {
      console.error('💥 [GOOGLE-AUTH] Exception during Google Sign-In:', error);
      return {
        success: false,
        error: error.message || 'Google Sign-In error'
      };
    }
  }

  /**
   * Alternative Web Browser-based authentication
   * Fallback method using WebBrowser for direct OAuth flow
   */
  async authenticateWithWebBrowser(): Promise<GoogleSignInResult> {
    try {
      console.log('🔐 [GOOGLE-AUTH] Starting web browser authentication');

      const redirectUri = makeRedirectUri();

      const clientId = Platform.select({
        ios: this.config.iosClientId,
        android: this.config.androidClientId,
        default: this.config.expoClientId,
      });

      if (!clientId) {
        throw new Error('Google Client ID not configured for this platform');
      }

      // Configure the authentication URL
      const authUrl = `https://accounts.google.com/oauth/authorize?` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=id_token&` +
        `scope=openid profile email&` +
        `nonce=${Math.random().toString(36)}`;

      console.log('🌐 [GOOGLE-AUTH] Opening browser for authentication');
      
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
      
      if (result.type === 'success') {
        // Extract the ID token from the URL
        const url = result.url;
        const idTokenMatch = url.match(/id_token=([^&]+)/);
        
        if (idTokenMatch) {
          const idToken = decodeURIComponent(idTokenMatch[1]);
          console.log('✅ [GOOGLE-AUTH] ID token extracted from callback');
          
          // Authenticate with backend
          return await googleSignInAction(idToken);
        } else {
          throw new Error('ID token not found in authentication response');
        }
      } else if (result.type === 'cancel') {
        return {
          success: false,
          error: 'Authentication cancelled'
        };
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error: any) {
      console.error('💥 [GOOGLE-AUTH] Web browser authentication error:', error);
      return {
        success: false,
        error: error.message || 'Google authentication failed'
      };
    }
  }

  /**
   * Check if Google Auth is properly configured
   */
  isConfigured(): boolean {
    const platform = Platform.OS;
    
    if (platform === 'ios') {
      return !!this.config.iosClientId;
    } else if (platform === 'android') {
      return !!this.config.androidClientId;
    } else {
      return !!this.config.expoClientId || !!this.config.webClientId;
    }
  }

  /**
   * Get Google Auth configuration status
   */
  getConfigStatus(): { configured: boolean; platform: string; hasClientId: boolean } {
    const platform = Platform.OS;
    const hasClientId = this.isConfigured();
    
    return {
      configured: hasClientId,
      platform,
      hasClientId
    };
  }
}

// Create singleton instance
const googleAuthService = new GoogleAuthService();

/**
 * Primary Google authentication function
 * Uses Expo AuthSession for the most reliable experience
 */
export async function authenticateWithGoogle(): Promise<GoogleSignInResult> {
  return await googleAuthService.signInWithGoogle();
}

/**
 * Alternative Google authentication using web browser
 * Can be used as fallback if AuthSession has issues
 */
export async function authenticateWithGoogleWebBrowser(): Promise<GoogleSignInResult> {
  return await googleAuthService.authenticateWithWebBrowser();
}

/**
 * Check if Google authentication is properly configured
 */
export function isGoogleAuthConfigured(): boolean {
  return googleAuthService.isConfigured();
}

/**
 * Get Google authentication configuration status
 */
export function getGoogleAuthStatus() {
  return googleAuthService.getConfigStatus();
}

// Export types and service
export { GoogleAuthService, GoogleUser, GoogleAuthConfig };
