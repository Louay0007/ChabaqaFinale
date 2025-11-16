import { apiClient, ApiSuccessResponse, PaginatedResponse, PaginationParams } from './client';
import type { Notification } from './types';

// Notifications API
export const notificationsApi = {
  // Get all notifications
  getAll: async (params?: PaginationParams): Promise<PaginatedResponse<Notification>> => {
    return apiClient.get<PaginatedResponse<Notification>>('/notifications', params);
  },

  // Mark notification as read
  markAsRead: async (id: string): Promise<ApiSuccessResponse<Notification>> => {
    return apiClient.patch<ApiSuccessResponse<Notification>>(`/notifications/${id}/read`);
  },

  // Mark all as read
  markAllAsRead: async (): Promise<ApiSuccessResponse<void>> => {
    return apiClient.patch<ApiSuccessResponse<void>>('/notifications/read-all');
  },

  // Delete notification
  delete: async (id: string): Promise<ApiSuccessResponse<void>> => {
    return apiClient.delete<ApiSuccessResponse<void>>(`/notifications/${id}`);
  },
};
