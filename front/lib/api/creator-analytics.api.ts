import { apiClient, ApiSuccessResponse } from './client';

export interface CreatorAnalyticsParams {
  from?: string;
  to?: string;
}

export const creatorAnalyticsApi = {
  getOverview: async (params?: CreatorAnalyticsParams): Promise<ApiSuccessResponse<any>> => {
    return apiClient.get<ApiSuccessResponse<any>>('/analytics/creator/overview', params);
  },
  getCourses: async (params?: CreatorAnalyticsParams): Promise<ApiSuccessResponse<any>> => {
    return apiClient.get<ApiSuccessResponse<any>>('/analytics/creator/courses', params);
  },
  getChallenges: async (params?: CreatorAnalyticsParams): Promise<ApiSuccessResponse<any>> => {
    return apiClient.get<ApiSuccessResponse<any>>('/analytics/creator/challenges', params);
  },
  getSessions: async (params?: CreatorAnalyticsParams): Promise<ApiSuccessResponse<any>> => {
    return apiClient.get<ApiSuccessResponse<any>>('/analytics/creator/sessions', params);
  },
  getEvents: async (params?: CreatorAnalyticsParams): Promise<ApiSuccessResponse<any>> => {
    return apiClient.get<ApiSuccessResponse<any>>('/analytics/creator/events', params);
  },
  getProducts: async (params?: CreatorAnalyticsParams): Promise<ApiSuccessResponse<any>> => {
    return apiClient.get<ApiSuccessResponse<any>>('/analytics/creator/products', params);
  },
  getPosts: async (params?: CreatorAnalyticsParams): Promise<ApiSuccessResponse<any>> => {
    return apiClient.get<ApiSuccessResponse<any>>('/analytics/creator/posts', params);
  },
};
