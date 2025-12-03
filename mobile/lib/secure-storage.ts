import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import PlatformUtils from './platform-utils';

/**
 * Platform-aware secure storage utility
 * - iOS/Android: Uses ExpoSecureStore for encryption
 * - Web: Uses localStorage with base64 encoding for basic security
 */

interface StorageInterface {
  setItemAsync(key: string, value: string): Promise<void>;
  getItemAsync(key: string): Promise<string | null>;
  deleteItemAsync(key: string): Promise<void>;
}

class WebStorage implements StorageInterface {
  private prefix = PlatformUtils.getStoragePrefix();

  async setItemAsync(key: string, value: string): Promise<void> {
    try {
      if (typeof localStorage === 'undefined') {
        throw new Error('localStorage is not available');
      }

      // Simple base64 encoding for basic obfuscation
      const encoded = btoa(unescape(encodeURIComponent(value)));
      localStorage.setItem(this.prefix + key, encoded);

      if (__DEV__) {
        console.log(`💾 [WEB-STORAGE] Stored: ${key}`);
      }
    } catch (error) {
      console.error(`💥 [WEB-STORAGE] Error storing ${key}:`, error);
      throw new Error(`Failed to store ${key}: ${error}`);
    }
  }

  async getItemAsync(key: string): Promise<string | null> {
    try {
      if (typeof localStorage === 'undefined') {
        return null;
      }

      const encoded = localStorage.getItem(this.prefix + key);
      if (!encoded) {
        return null;
      }

      // Decode from base64
      const decoded = decodeURIComponent(escape(atob(encoded)));
      return decoded;
    } catch (error) {
      console.error(`💥 [WEB-STORAGE] Error retrieving ${key}:`, error);
      return null;
    }
  }

  async deleteItemAsync(key: string): Promise<void> {
    try {
      if (typeof localStorage === 'undefined') {
        return;
      }

      localStorage.removeItem(this.prefix + key);
      if (__DEV__) {
        console.log(`💾 [WEB-STORAGE] Deleted: ${key}`);
      }
    } catch (error) {
      console.error(`💥 [WEB-STORAGE] Error deleting ${key}:`, error);
      throw new Error(`Failed to delete ${key}: ${error}`);
    }
  }
}

class NativeStorage implements StorageInterface {
  private prefix = PlatformUtils.getStoragePrefix();

  async setItemAsync(key: string, value: string): Promise<void> {
    try {
      const prefixedKey = this.prefix + key;
      await SecureStore.setItemAsync(prefixedKey, value);
      if (__DEV__) {
        console.log(`🔒 [STORAGE] Stored: ${key}`);
      }
    } catch (error) {
      console.error(`💥 [STORAGE] Error storing ${key}:`, error);
      throw new Error(`Failed to store ${key}: ${error}`);
    }
  }

  async getItemAsync(key: string): Promise<string | null> {
    try {
      const prefixedKey = this.prefix + key;
      const value = await SecureStore.getItemAsync(prefixedKey);
      return value;
    } catch (error) {
      console.error(`💥 [STORAGE] Error retrieving ${key}:`, error);
      return null;
    }
  }

  async deleteItemAsync(key: string): Promise<void> {
    try {
      const prefixedKey = this.prefix + key;
      await SecureStore.deleteItemAsync(prefixedKey);
      if (__DEV__) {
        console.log(`🔒 [STORAGE] Deleted: ${key}`);
      }
    } catch (error) {
      console.error(`💥 [STORAGE] Error deleting ${key}:`, error);
      throw new Error(`Failed to delete ${key}: ${error}`);
    }
  }
}

// Create platform-specific storage instance
const createStorage = (): StorageInterface => {
  if (__DEV__) {
    console.log(`🔒 [STORAGE] Initialized for ${PlatformUtils.getPlatformName()}`);
  }

  if (PlatformUtils.isWeb) {
    return new WebStorage();
  } else {
    return new NativeStorage();
  }
};

const storage = createStorage();

// Export the unified interface
export const SecureStorage = {
  setItemAsync: (key: string, value: string) => storage.setItemAsync(key, value),
  getItemAsync: (key: string) => storage.getItemAsync(key),
  deleteItemAsync: (key: string) => storage.deleteItemAsync(key),
};

// Helper functions for common use cases
export const setSecureItem = async (key: string, value: string): Promise<void> => {
  try {
    await SecureStorage.setItemAsync(key, value);
  } catch (error) {
    console.error(`💥 [SECURE-STORAGE] Error storing ${key}:`, error);

    // Fallback for web platform issues
    if (PlatformUtils.isWeb && error instanceof Error && error.message.includes('localStorage')) {
      console.warn(`⚠️ [SECURE-STORAGE] localStorage unavailable, data will not persist`);
      return; // Don't throw, just warn
    }

    throw error;
  }
};

export const getSecureItem = async (key: string): Promise<string | null> => {
  try {
    return await SecureStorage.getItemAsync(key);
  } catch (error) {
    console.error(`💥 [SECURE-STORAGE] Error getting ${key}:`, error);
    return null;
  }
};

export const removeSecureItem = async (key: string): Promise<void> => {
  try {
    await SecureStorage.deleteItemAsync(key);
  } catch (error) {
    console.error(`💥 [SECURE-STORAGE] Error removing ${key}:`, error);

    // Don't throw on web platform issues during cleanup
    if (PlatformUtils.isWeb && error instanceof Error && error.message.includes('localStorage')) {
      console.warn(`⚠️ [SECURE-STORAGE] localStorage unavailable during cleanup`);
      return;
    }

    throw error;
  }
};

// Storage diagnostics
export const diagnoseStorage = async (): Promise<void> => {
  console.log('🔍 [SECURE-STORAGE] Running storage diagnostics...');

  try {
    // Test basic storage operations
    const testKey = 'test_key';
    const testValue = 'test_value_123';

    await setSecureItem(testKey, testValue);
    const retrieved = await getSecureItem(testKey);
    await removeSecureItem(testKey);

    if (retrieved === testValue) {
      console.log('✅ [SECURE-STORAGE] Storage test passed');
    } else {
      console.error('❌ [SECURE-STORAGE] Storage test failed - value mismatch');
    }
  } catch (error) {
    console.error('❌ [SECURE-STORAGE] Storage test failed:', error);
  }
};

// Initialize storage diagnostics on import (only in development)
if (__DEV__) {
  // Run diagnostics after a short delay to avoid blocking app startup
  setTimeout(() => {
    diagnoseStorage();
  }, 1000);
}

export default SecureStorage;
