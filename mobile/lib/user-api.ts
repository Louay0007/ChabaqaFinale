import { tryEndpoints } from './http';
import { getAccessToken, storeUser, getStoredUser, User } from './auth';

/**
 * 👤 User Profile API Client
 * Handles user profile management, settings, and account operations
 */

// Re-export User type for convenience
export type { User } from './auth';

// ==================== INTERFACES ====================

export interface UpdateProfileData {
  name?: string;
  numtel?: string;
  date_naissance?: string;
  sexe?: string;
  pays?: string;
  ville?: string;
  code_postal?: string;
  adresse?: string;
  bio?: string;
}

export interface UserResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface SuccessResponse {
  success: boolean;
  message: string;
}

// ==================== API FUNCTIONS ====================

/**
 * Get current user profile (uses auth token)
 * Already exists in auth.ts as getProfile(), this is a wrapper for consistency
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    console.log('👤 [USER-API] Fetching current user profile');
    const accessToken = await getAccessToken();

    if (!accessToken) {
      console.log('⚠️ [USER-API] No access token available');
      return null;
    }

    const resp = await tryEndpoints<{ success?: boolean; data?: any; user?: any; message?: string }>(
      '/api/auth/me',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        timeout: 30000,
      }
    );

    console.log('✅ [USER-API] User profile fetched successfully');
    // Backend returns { success: true, data: user } from /api/auth/me
    const user = resp.data.data || resp.data.user;
    if (user) {
      await storeUser(user);
    }
    return user || null;
  } catch (error: any) {
    console.error('💥 [USER-API] Error fetching user:', error);
    // Return cached user as fallback
    return await getStoredUser();
  }
};

/**
 * Update user profile
 * @param data - Profile data to update
 * @returns Promise with updated user
 */
export const updateProfile = async (data: UpdateProfileData): Promise<UserResponse> => {
  try {
    console.log('🔄 [USER-API] Updating profile:', Object.keys(data));
    const accessToken = await getAccessToken();

    if (!accessToken) {
      throw new Error('Not authenticated');
    }

    const resp = await tryEndpoints<UserResponse>(
      '/api/user/update-profile',
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data,
        timeout: 30000,
      }
    );

    console.log('✅ [USER-API] Profile updated successfully');

    // Update cached user
    if (resp.data.user) {
      await storeUser(resp.data.user);
    }

    return resp.data;
  } catch (error: any) {
    console.error('💥 [USER-API] Error updating profile:', error);
    throw new Error(error.message || 'Failed to update profile');
  }
};

/**
 * Change user password
 * @param newPassword - New password
 * @returns Promise with success response
 */
export const changePassword = async (newPassword: string): Promise<SuccessResponse> => {
  try {
    console.log('🔐 [USER-API] Changing password...');
    const accessToken = await getAccessToken();

    if (!accessToken) {
      throw new Error('Not authenticated');
    }

    const resp = await tryEndpoints<SuccessResponse>(
      '/api/user/change-password',
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: { password: newPassword },
        timeout: 30000,
      }
    );

    console.log('✅ [USER-API] Password changed successfully');
    return resp.data;
  } catch (error: any) {
    console.error('💥 [USER-API] Error changing password:', error);
    throw new Error(error.message || 'Failed to change password');
  }
};

/**
 * Get user by ID
 * @param userId - User ID
 * @returns Promise with user data
 */
export const getUserById = async (userId: string): Promise<User> => {
  try {
    console.log('👤 [USER-API] Fetching user by ID:', userId);

    const resp = await tryEndpoints<{ user: User; message: string }>(
      `/api/user/user/${userId}`,
      {
        method: 'GET',
        timeout: 30000,
      }
    );

    console.log('✅ [USER-API] User fetched successfully:', resp.data.user.name);
    return resp.data.user;
  } catch (error: any) {
    console.error('💥 [USER-API] Error fetching user:', error);
    throw new Error(error.message || 'Failed to fetch user');
  }
};

/**
 * Upload user avatar (placeholder for future implementation)
 * @param imageUri - Local image URI
 * @returns Promise with avatar URL
 */
export const uploadAvatar = async (imageUri: string): Promise<{ avatarUrl: string }> => {
  // TODO: Implement image upload
  // This will require multipart/form-data and backend endpoint
  console.log('📸 [USER-API] Avatar upload not yet implemented');
  throw new Error('Avatar upload not yet implemented');
};

// ==================== VALIDATION FUNCTIONS ====================

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * At least 8 characters
 */
export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  return { valid: true };
};

/**
 * Validate phone number (basic)
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9+\-\s()]+$/;
  return phoneRegex.test(phone) && phone.length >= 10;
};

/**
 * Validate name (at least 2 characters)
 */
export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

// ==================== EXPORT ====================

export default {
  getCurrentUser,
  updateProfile,
  changePassword,
  getUserById,
  uploadAvatar,
  validateEmail,
  validatePassword,
  validatePhone,
  validateName,
};
