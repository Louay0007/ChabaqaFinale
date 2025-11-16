import { apiClient, ApiSuccessResponse, PaginatedResponse, PaginationParams } from './client';
import type { Community, CommunitySettings, CommunityMember, CommunityFilters } from './types';

export interface GetCommunitiesParams extends PaginationParams {
  category?: string;
  featured?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface CreateCommunityData {
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  category: string;
  tags: string[];
  price?: number;
  priceType: 'free' | 'monthly' | 'yearly' | 'one-time';
  image?: string;
  coverImage?: string;
}

export interface UpdateCommunityData extends Partial<CreateCommunityData> {}

export interface UpdateCommunitySettingsData extends Partial<Omit<CommunitySettings, 'id' | 'communityId' | 'updatedAt'>> {}

// Communities API
export const communitiesApi = {
  // Get all communities
  getAll: async (params?: GetCommunitiesParams): Promise<PaginatedResponse<Community>> => {
    return apiClient.get<PaginatedResponse<Community>>('/community-aff-crea-join/all-communities', params);
  },

  // Create community
  create: async (data: CreateCommunityData): Promise<ApiSuccessResponse<Community>> => {
    return apiClient.post<ApiSuccessResponse<Community>>('/community-aff-crea-join/create', data);
  },

  // Get community by slug or ID
  getBySlug: async (slug: string): Promise<ApiSuccessResponse<Community>> => {
    return apiClient.get<ApiSuccessResponse<Community>>(`/community-aff-crea-join/${slug}`);
  },

  // Update community
  update: async (id: string, data: UpdateCommunityData): Promise<ApiSuccessResponse<Community>> => {
    return apiClient.patch<ApiSuccessResponse<Community>>(`/community-aff-crea-join/${id}`, data);
  },

  // Delete community
  delete: async (id: string): Promise<ApiSuccessResponse<void>> => {
    return apiClient.delete<ApiSuccessResponse<void>>(`/community-aff-crea-join/${id}`);
  },

  // Get community members
  getMembers: async (id: string, params?: PaginationParams): Promise<PaginatedResponse<CommunityMember>> => {
    return apiClient.get<PaginatedResponse<CommunityMember>>(`/community-aff-crea-join/${id}/members`, params);
  },

  // Add member to community
  addMember: async (id: string, userId: string): Promise<ApiSuccessResponse<void>> => {
    return apiClient.post<ApiSuccessResponse<void>>(`/community-aff-crea-join/join`, { userId });
  },

  // Get community settings
  getSettings: async (id: string): Promise<ApiSuccessResponse<CommunitySettings>> => {
    return apiClient.get<ApiSuccessResponse<CommunitySettings>>(`/community-aff-crea-join/${id}/settings`);
  },

  // Update community settings
  updateSettings: async (id: string, settings: UpdateCommunitySettingsData): Promise<ApiSuccessResponse<CommunitySettings>> => {
    return apiClient.patch<ApiSuccessResponse<CommunitySettings>>(`/community-aff-crea-join/${id}/settings`, settings);
  },

  // Get community stats
  getStats: async (id: string): Promise<ApiSuccessResponse<any>> => {
    return apiClient.get<ApiSuccessResponse<any>>(`/community-aff-crea-join/${id}/stats`);
  },

  // Get communities by creator
  getByCreator: async (creatorId: string): Promise<ApiSuccessResponse<Community[]>> => {
    return apiClient.get<ApiSuccessResponse<Community[]>>(`/community-aff-crea-join/my-created`);
  },

  // Get public communities
  getPublic: async (): Promise<ApiSuccessResponse<Community[]>> => {
    return apiClient.get<ApiSuccessResponse<Community[]>>('/community-aff-crea-join/public/all');
  },

  // Get my joined communities
  getMyJoined: async (): Promise<ApiSuccessResponse<Community[]>> => {
    return apiClient.get<ApiSuccessResponse<Community[]>>('/community-aff-crea-join/my-joined');
  },
};
