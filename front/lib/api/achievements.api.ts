import { apiClient } from './client';
import type { AchievementResponse, UserAchievementResponse, AchievementWithProgress } from './types';

export interface GetAchievementsParams {
  communitySlug?: string;
}

export interface GetUserAchievementsParams {
  communitySlug: string;
}

export const achievementsApi = {
  /**
   * Get all achievements for a community
   */
  async getAchievements(params?: GetAchievementsParams): Promise<AchievementResponse[]> {
    return apiClient.get<AchievementResponse[]>('/achievements', params);
  },

  /**
   * Get user's achievements with progress for a community
   */
  async getUserAchievements(params: GetUserAchievementsParams): Promise<AchievementWithProgress[]> {
    return apiClient.get<AchievementWithProgress[]>('/achievements/user', params);
  },

  /**
   * Manually check for new achievements
   */
  async checkAchievements(params: GetUserAchievementsParams): Promise<UserAchievementResponse[]> {
    return apiClient.post<UserAchievementResponse[]>('/achievements/check', params);
  },
};