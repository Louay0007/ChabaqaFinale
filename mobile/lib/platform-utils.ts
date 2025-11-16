import { Platform } from 'react-native';

/**
 * Platform detection and utilities for React Native apps
 * Handles differences between iOS, Android, and Web platforms
 */

export const PlatformUtils = {
  // Platform checks
  isWeb: Platform.OS === 'web',
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
  isNative: Platform.OS !== 'web',

  // Get platform name
  getPlatformName(): string {
    switch (Platform.OS) {
      case 'ios':
        return 'iOS';
      case 'android':
        return 'Android';
      case 'web':
        return 'Web';
      default:
        return 'Unknown';
    }
  },

  // Get platform-specific API URL
  getApiUrl(): string {
    const envUrl = process.env.EXPO_PUBLIC_API_URL;
    
    if (envUrl) {
      return envUrl;
    }

    // Fallback URLs based on platform
    if (Platform.OS === 'web') {
      return 'http://localhost:3000';
    } else if (Platform.OS === 'android') {
      // Android emulator uses 10.0.2.2 to access host machine
      return 'http://10.0.2.2:3000';
    } else {
      // iOS simulator can use localhost
      return 'http://localhost:3000';
    }
  },

  // Check if secure storage is available
  isSecureStorageAvailable(): boolean {
    return Platform.OS !== 'web';
  },

  // Log platform info for debugging
  logPlatformInfo(): void {
    console.log(`🏗️ [PLATFORM] Running on ${this.getPlatformName()}`);
    console.log(`🌐 [PLATFORM] API URL: ${this.getApiUrl()}`);
    console.log(`🔐 [PLATFORM] Secure Storage: ${this.isSecureStorageAvailable() ? 'Native' : 'Web Fallback'}`);
  },

  // Get platform-specific storage prefix
  getStoragePrefix(): string {
    const appId = 'chabaqa_app';
    return `${appId}_${Platform.OS}_`;
  }
};

export default PlatformUtils;
