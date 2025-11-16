import * as SecureStore from 'expo-secure-store';
import { setSecureItem, getSecureItem, removeSecureItem } from './secure-storage';
import PlatformUtils from './platform-utils';

/**
 * Migration utility for handling authentication storage changes
 * Helps migrate from old storage format to new platform-aware format
 */

const OLD_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
};

const NEW_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
};

export class AuthMigration {
  private static hasRunMigration = false;

  /**
   * Migrate authentication data from old format to new platform-aware format
   */
  static async migrateAuthData(): Promise<void> {
    if (this.hasRunMigration) {
      return;
    }

    console.log('🔄 [AUTH-MIGRATION] Starting authentication data migration...');

    try {
      // Only migrate on native platforms where SecureStore was used
      if (PlatformUtils.isNative) {
        await this.migrateNativeStorage();
      } else {
        await this.migrateWebStorage();
      }

      this.hasRunMigration = true;
      console.log('✅ [AUTH-MIGRATION] Migration completed successfully');
    } catch (error) {
      console.error('💥 [AUTH-MIGRATION] Migration failed:', error);
      // Don't throw - migration failures shouldn't break the app
    }
  }

  /**
   * Migrate native storage (iOS/Android)
   */
  private static async migrateNativeStorage(): Promise<void> {
    console.log('📱 [AUTH-MIGRATION] Migrating native storage...');

    const migrations = [
      { old: OLD_KEYS.ACCESS_TOKEN, new: NEW_KEYS.ACCESS_TOKEN },
      { old: OLD_KEYS.REFRESH_TOKEN, new: NEW_KEYS.REFRESH_TOKEN },
      { old: OLD_KEYS.USER_DATA, new: NEW_KEYS.USER_DATA },
    ];

    for (const { old, new: newKey } of migrations) {
      try {
        // Check if old format exists (without prefix)
        const oldValue = await SecureStore.getItemAsync(old);
        if (oldValue) {
          console.log(`🔄 [AUTH-MIGRATION] Migrating ${old} to new format`);
          
          // Store in new format
          await setSecureItem(newKey, oldValue);
          
          // Remove old format
          await SecureStore.deleteItemAsync(old);
          
          console.log(`✅ [AUTH-MIGRATION] Successfully migrated ${old}`);
        }
      } catch (error) {
        console.warn(`⚠️ [AUTH-MIGRATION] Failed to migrate ${old}:`, error);
      }
    }
  }

  /**
   * Migrate web storage
   */
  private static async migrateWebStorage(): Promise<void> {
    console.log('🌐 [AUTH-MIGRATION] Migrating web storage...');

    if (typeof localStorage === 'undefined') {
      console.log('⚠️ [AUTH-MIGRATION] localStorage not available, skipping web migration');
      return;
    }

    const migrations = [
      { old: OLD_KEYS.ACCESS_TOKEN, new: NEW_KEYS.ACCESS_TOKEN },
      { old: OLD_KEYS.REFRESH_TOKEN, new: NEW_KEYS.REFRESH_TOKEN },
      { old: OLD_KEYS.USER_DATA, new: NEW_KEYS.USER_DATA },
    ];

    for (const { old, new: newKey } of migrations) {
      try {
        // Check for old unprefixed keys
        const oldValue = localStorage.getItem(old);
        if (oldValue) {
          console.log(`🔄 [AUTH-MIGRATION] Migrating web ${old} to new format`);
          
          // Store in new format (through our secure storage system)
          await setSecureItem(newKey, oldValue);
          
          // Remove old format
          localStorage.removeItem(old);
          
          console.log(`✅ [AUTH-MIGRATION] Successfully migrated web ${old}`);
        }

        // Also check for old prefixed keys that might exist
        const oldPrefixedValue = localStorage.getItem(`secure_${old}`);
        if (oldPrefixedValue) {
          console.log(`🔄 [AUTH-MIGRATION] Migrating old prefixed ${old} to new format`);
          
          try {
            // Decode from old base64 format
            const decoded = atob(oldPrefixedValue);
            await setSecureItem(newKey, decoded);
            
            // Remove old prefixed format
            localStorage.removeItem(`secure_${old}`);
            
            console.log(`✅ [AUTH-MIGRATION] Successfully migrated old prefixed ${old}`);
          } catch (decodeError) {
            console.warn(`⚠️ [AUTH-MIGRATION] Failed to decode old ${old}:`, decodeError);
          }
        }
      } catch (error) {
        console.warn(`⚠️ [AUTH-MIGRATION] Failed to migrate web ${old}:`, error);
      }
    }
  }

  /**
   * Clear all authentication data (for debugging or logout)
   */
  static async clearAllAuthData(): Promise<void> {
    console.log('🧹 [AUTH-MIGRATION] Clearing all authentication data...');

    try {
      // Clear new format
      await removeSecureItem(NEW_KEYS.ACCESS_TOKEN);
      await removeSecureItem(NEW_KEYS.REFRESH_TOKEN);
      await removeSecureItem(NEW_KEYS.USER_DATA);

      // Clear old formats (just in case)
      if (PlatformUtils.isNative) {
        try {
          await SecureStore.deleteItemAsync(OLD_KEYS.ACCESS_TOKEN);
          await SecureStore.deleteItemAsync(OLD_KEYS.REFRESH_TOKEN);
          await SecureStore.deleteItemAsync(OLD_KEYS.USER_DATA);
        } catch (error) {
          // Ignore errors for non-existent keys
        }
      }

      if (PlatformUtils.isWeb && typeof localStorage !== 'undefined') {
        localStorage.removeItem(OLD_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(OLD_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(OLD_KEYS.USER_DATA);
        localStorage.removeItem(`secure_${OLD_KEYS.ACCESS_TOKEN}`);
        localStorage.removeItem(`secure_${OLD_KEYS.REFRESH_TOKEN}`);
        localStorage.removeItem(`secure_${OLD_KEYS.USER_DATA}`);
      }

      console.log('✅ [AUTH-MIGRATION] All authentication data cleared');
    } catch (error) {
      console.error('💥 [AUTH-MIGRATION] Error clearing auth data:', error);
    }
  }

  /**
   * Diagnostic function to check what auth data exists
   */
  static async diagnoseAuthStorage(): Promise<void> {
    console.log('🔍 [AUTH-MIGRATION] Diagnosing authentication storage...');

    try {
      // Check new format
      const newAccessToken = await getSecureItem(NEW_KEYS.ACCESS_TOKEN);
      const newRefreshToken = await getSecureItem(NEW_KEYS.REFRESH_TOKEN);
      const newUserData = await getSecureItem(NEW_KEYS.USER_DATA);

      console.log('📊 [AUTH-MIGRATION] New format data:');
      console.log(`  - Access Token: ${newAccessToken ? '✅ Present' : '❌ Missing'}`);
      console.log(`  - Refresh Token: ${newRefreshToken ? '✅ Present' : '❌ Missing'}`);
      console.log(`  - User Data: ${newUserData ? '✅ Present' : '❌ Missing'}`);

      // Check old formats
      if (PlatformUtils.isNative) {
        console.log('📊 [AUTH-MIGRATION] Checking old native format...');
        try {
          const oldAccessToken = await SecureStore.getItemAsync(OLD_KEYS.ACCESS_TOKEN);
          const oldRefreshToken = await SecureStore.getItemAsync(OLD_KEYS.REFRESH_TOKEN);
          const oldUserData = await SecureStore.getItemAsync(OLD_KEYS.USER_DATA);

          console.log('  - Old Access Token:', oldAccessToken ? '⚠️ Present' : '✅ Clean');
          console.log('  - Old Refresh Token:', oldRefreshToken ? '⚠️ Present' : '✅ Clean');
          console.log('  - Old User Data:', oldUserData ? '⚠️ Present' : '✅ Clean');
        } catch (error) {
          console.log('  - Old native data: Error checking');
        }
      }

      if (PlatformUtils.isWeb && typeof localStorage !== 'undefined') {
        console.log('📊 [AUTH-MIGRATION] Checking old web formats...');
        const oldWebAccess = localStorage.getItem(OLD_KEYS.ACCESS_TOKEN);
        const oldWebRefresh = localStorage.getItem(OLD_KEYS.REFRESH_TOKEN);
        const oldWebUser = localStorage.getItem(OLD_KEYS.USER_DATA);

        console.log('  - Old Web Access Token:', oldWebAccess ? '⚠️ Present' : '✅ Clean');
        console.log('  - Old Web Refresh Token:', oldWebRefresh ? '⚠️ Present' : '✅ Clean');
        console.log('  - Old Web User Data:', oldWebUser ? '⚠️ Present' : '✅ Clean');
      }

    } catch (error) {
      console.error('💥 [AUTH-MIGRATION] Error during diagnosis:', error);
    }
  }
}

export default AuthMigration;
