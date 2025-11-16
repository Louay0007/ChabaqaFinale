import { apiClient, ApiSuccessResponse } from './client';
import type { User } from './types';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  numtel?: string;
  date_naissance?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

// Authentication API
export const authApi = {
  // Register new user
  register: async (data: RegisterData): Promise<any> => {
    const response: any = await apiClient.post<any>('/auth/register', data);
    const payload = response?.data ?? response;
    const token = payload?.accessToken 
      || payload?.access_token 
      || payload?.data?.accessToken 
      || payload?.data?.access_token;
    if (token) {
      apiClient.setToken(token);
    } else {
      // Ensure stale token does not override cookie session
      apiClient.clearToken();
    }
    return response;
  },

  // Login
  login: async (data: LoginData): Promise<any> => {
    const response: any = await apiClient.post<any>('/auth/login', data);
    const payload = response?.data ?? response;
    const token = payload?.accessToken 
      || payload?.access_token 
      || payload?.data?.accessToken 
      || payload?.data?.access_token;
    if (token) {
      apiClient.setToken(token);
    } else {
      // Ensure stale token does not override cookie session
      apiClient.clearToken();
    }
    return response;
  },

  // Logout
  logout: async (): Promise<ApiSuccessResponse<void>> => {
    const response = await apiClient.post<ApiSuccessResponse<void>>('/auth/logout');
    apiClient.clearToken();
    return response;
  },

  // Refresh token
  refresh: async (): Promise<any> => {
    const response: any = await apiClient.post<any>('/auth/refresh');
    const payload = response?.data ?? response;
    const token = payload?.accessToken 
      || payload?.access_token 
      || payload?.data?.accessToken 
      || payload?.data?.access_token;
    if (token) apiClient.setToken(token); else apiClient.clearToken();
    return response;
  },

  // Forgot password
  forgotPassword: async (data: ForgotPasswordData): Promise<ApiSuccessResponse<void>> => {
    return apiClient.post<ApiSuccessResponse<void>>('/auth/forgot-password', data);
  },

  // Reset password
  resetPassword: async (data: ResetPasswordData): Promise<ApiSuccessResponse<void>> => {
    return apiClient.post<ApiSuccessResponse<void>>('/auth/reset-password', data);
  },

  // Get current user
  me: async (): Promise<ApiSuccessResponse<User>> => {
    return apiClient.get<ApiSuccessResponse<User>>('/auth/me');
  },
};
