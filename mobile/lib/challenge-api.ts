/**
 * Challenge API Integration
 * 
 * Provides functions to interact with the challenge endpoints for regular users.
 * Handles challenge browsing, joining, progress tracking, and leaderboards.
 * 
 * @module challenge-api
 */

import { tryEndpoints } from './http';
import { getAccessToken } from './auth';

// ============================================================================
// TypeScript Interfaces
// ============================================================================

/**
 * Challenge creator information
 */
export interface ChallengeCreator {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

/**
 * Challenge task
 */
export interface ChallengeTask {
  _id: string;
  title: string;
  description: string;
  points: number;
  order: number;
  is_completed?: boolean;
}

/**
 * Challenge participant
 */
export interface ChallengeParticipant {
  user_id: string;
  user_name: string;
  user_avatar?: string;
  joined_at: string;
  completed_tasks: number;
  total_points: number;
  rank?: number;
}

/**
 * Main challenge interface
 */
export interface Challenge {
  _id: string;
  title: string;
  description: string;
  short_description?: string;
  thumbnail?: string;
  cover_image?: string;
  category?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_by: ChallengeCreator;
  community_id?: {
    _id: string;
    name: string;
    slug: string;
  };
  tasks: ChallengeTask[];
  participants_count: number;
  max_participants?: number;
  prize?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

/**
 * User challenge participation
 */
export interface ChallengeParticipation {
  _id: string;
  user_id: string;
  challenge_id: string;
  joined_at: string;
  completed_tasks: string[]; // Array of task IDs
  total_points: number;
  is_completed: boolean;
  completed_at?: string;
  rank?: number;
}

/**
 * Challenge leaderboard entry
 */
export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  total_points: number;
  completed_tasks: number;
  completion_percentage: number;
}

/**
 * API response for challenge list
 */
export interface ChallengeListResponse {
  challenges: Challenge[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Challenge filters for browsing
 */
export interface ChallengeFilters {
  page?: number;
  limit?: number;
  communitySlug?: string;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  isActive?: boolean;
  search?: string;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get challenges with filters (for browsing)
 * 
 * @param filters - Filter options for challenges
 * @returns Promise with challenge list response
 */
export async function getChallenges(filters: ChallengeFilters = {}): Promise<ChallengeListResponse> {
  try {
    console.log('🏆 [CHALLENGE-API] Fetching challenges with filters:', filters);

    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.communitySlug) params.append('communitySlug', filters.communitySlug);
    if (filters.category) params.append('category', filters.category);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters.search) params.append('search', filters.search);

    const resp = await tryEndpoints<any>(
      `/api/challenges?${params.toString()}`,
      {
        method: 'GET',
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [CHALLENGE-API] Challenges fetched successfully:', resp.data.challenges?.length || 0);
      return {
        challenges: resp.data.challenges || [],
        total: resp.data.total || 0,
        page: resp.data.page || 1,
        limit: resp.data.limit || 10,
        totalPages: resp.data.totalPages || 1,
      };
    }

    throw new Error(resp.data.message || 'Failed to fetch challenges');
  } catch (error: any) {
    console.error('💥 [CHALLENGE-API] Error fetching challenges:', error);
    throw new Error(error.message || 'Failed to fetch challenges');
  }
}

/**
 * Get challenge by ID (detailed view)
 * 
 * @param challengeId - Challenge ID
 * @returns Promise with challenge details
 */
export async function getChallengeById(challengeId: string): Promise<Challenge> {
  try {
    console.log('🏆 [CHALLENGE-API] Fetching challenge details:', challengeId);

    const resp = await tryEndpoints<any>(
      `/api/challenges/${challengeId}`,
      {
        method: 'GET',
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [CHALLENGE-API] Challenge details fetched:', resp.data.title);
      return resp.data;
    }

    throw new Error(resp.data.message || 'Failed to fetch challenge');
  } catch (error: any) {
    console.error('💥 [CHALLENGE-API] Error fetching challenge:', error);
    throw new Error(error.message || 'Failed to fetch challenge details');
  }
}

/**
 * Join a challenge
 * 
 * @param challengeId - Challenge ID to join
 * @returns Promise with participation data
 */
export async function joinChallenge(challengeId: string): Promise<ChallengeParticipation> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Authentication required. Please login to join challenges.');
    }

    console.log('✍️ [CHALLENGE-API] Joining challenge:', challengeId);

    const resp = await tryEndpoints<any>(
      `/api/challenges/${challengeId}/join`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [CHALLENGE-API] Joined challenge successfully');
      return resp.data.participation || resp.data;
    }

    throw new Error(resp.data.message || 'Failed to join challenge');
  } catch (error: any) {
    console.error('💥 [CHALLENGE-API] Error joining challenge:', error);
    throw new Error(error.message || 'Failed to join challenge');
  }
}

/**
 * Leave a challenge
 * 
 * @param challengeId - Challenge ID to leave
 * @returns Promise with success status
 */
export async function leaveChallenge(challengeId: string): Promise<{ success: boolean; message: string }> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    console.log('👋 [CHALLENGE-API] Leaving challenge:', challengeId);

    const resp = await tryEndpoints<any>(
      `/api/challenges/${challengeId}/leave`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [CHALLENGE-API] Left challenge successfully');
      return { success: true, message: 'Successfully left challenge' };
    }

    throw new Error(resp.data.message || 'Failed to leave challenge');
  } catch (error: any) {
    console.error('💥 [CHALLENGE-API] Error leaving challenge:', error);
    throw new Error(error.message || 'Failed to leave challenge');
  }
}

/**
 * Update progress for a challenge task
 * 
 * @param challengeId - Challenge ID
 * @param taskId - Task ID to mark as completed
 * @returns Promise with updated participation
 */
export async function updateChallengeProgress(
  challengeId: string,
  taskId: string
): Promise<ChallengeParticipation> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    console.log('📝 [CHALLENGE-API] Updating challenge progress:', { challengeId, taskId });

    const resp = await tryEndpoints<any>(
      `/api/challenges/${challengeId}/progress`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: {
          task_id: taskId,
          completed: true,
        },
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [CHALLENGE-API] Progress updated successfully');
      return resp.data.participation || resp.data;
    }

    throw new Error(resp.data.message || 'Failed to update progress');
  } catch (error: any) {
    console.error('💥 [CHALLENGE-API] Error updating progress:', error);
    throw new Error(error.message || 'Failed to update challenge progress');
  }
}

/**
 * Get user's participation in a challenge
 * 
 * @param challengeId - Challenge ID
 * @returns Promise with participation data or null if not participating
 */
export async function getMyChallengeParticipation(challengeId: string): Promise<ChallengeParticipation | null> {
  try {
    const token = await getAccessToken();
    if (!token) {
      return null;
    }

    console.log('📊 [CHALLENGE-API] Fetching participation for challenge:', challengeId);

    const resp = await tryEndpoints<any>(
      `/api/challenges/${challengeId}/my-participation`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [CHALLENGE-API] Participation data fetched');
      return resp.data.participation || resp.data;
    }

    return null;
  } catch (error: any) {
    console.error('💥 [CHALLENGE-API] Error fetching participation:', error);
    return null;
  }
}

/**
 * Get challenge leaderboard
 * 
 * @param challengeId - Challenge ID
 * @param limit - Number of entries to fetch (default: 50)
 * @returns Promise with leaderboard entries
 */
export async function getChallengeLeaderboard(
  challengeId: string,
  limit: number = 50
): Promise<LeaderboardEntry[]> {
  try {
    console.log('🏅 [CHALLENGE-API] Fetching leaderboard for challenge:', challengeId);

    const resp = await tryEndpoints<any>(
      `/api/challenges/${challengeId}/leaderboard?limit=${limit}`,
      {
        method: 'GET',
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [CHALLENGE-API] Leaderboard fetched:', resp.data.leaderboard?.length || 0);
      return resp.data.leaderboard || [];
    }

    throw new Error(resp.data.message || 'Failed to fetch leaderboard');
  } catch (error: any) {
    console.error('💥 [CHALLENGE-API] Error fetching leaderboard:', error);
    return [];
  }
}

/**
 * Get challenges by community
 * 
 * @param communitySlug - Community slug
 * @param filters - Additional filters
 * @returns Promise with challenge list
 */
export async function getChallengesByCommunity(
  communitySlug: string,
  filters: Omit<ChallengeFilters, 'communitySlug'> = {}
): Promise<ChallengeListResponse> {
  return getChallenges({
    ...filters,
    communitySlug,
  });
}

/**
 * Check if user is participating in a challenge
 * 
 * @param challengeId - Challenge ID
 * @returns Promise with boolean participation status
 */
export async function isParticipatingInChallenge(challengeId: string): Promise<boolean> {
  try {
    const participation = await getMyChallengeParticipation(challengeId);
    return !!participation;
  } catch (error) {
    return false;
  }
}

/**
 * Get challenge status (upcoming, active, completed)
 * 
 * @param challenge - Challenge object
 * @returns Status string
 */
export function getChallengeStatus(challenge: Challenge): 'upcoming' | 'active' | 'completed' {
  const now = new Date();
  const startDate = new Date(challenge.start_date);
  const endDate = new Date(challenge.end_date);

  if (startDate > now) return 'upcoming';
  if (endDate < now) return 'completed';
  return 'active';
}

/**
 * Calculate days remaining in challenge
 * 
 * @param endDate - Challenge end date
 * @returns Number of days remaining
 */
export function getDaysRemaining(endDate: string): number {
  const now = new Date();
  const end = new Date(endDate);
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Format challenge date range
 * 
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Formatted date range string
 */
export function formatChallengeDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const options: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  };
  
  return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
}

/**
 * Get user's challenge participations
 * 
 * @param communitySlug - Optional community slug to filter by
 * @param status - Optional status filter ('active', 'completed', 'all')
 * @returns Promise with user participations
 */
export async function getUserParticipations(
  communitySlug?: string,
  status: string = 'all'
): Promise<ChallengeParticipation[]> {
  try {
    const token = await getAccessToken();
    if (!token) {
      return [];
    }

    console.log('📊 [CHALLENGE-API] Fetching user participations');

    const params = new URLSearchParams();
    if (communitySlug) params.append('communitySlug', communitySlug);
    if (status && status !== 'all') params.append('status', status);

    const resp = await tryEndpoints<any>(
      `/api/challenges/user/my-participations?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [CHALLENGE-API] User participations fetched:', resp.data.data?.participations?.length || 0);
      return resp.data.data?.participations || [];
    }

    return [];
  } catch (error: any) {
    console.error('💥 [CHALLENGE-API] Error fetching user participations:', error);
    return [];
  }
}

/**
 * Calculate completion percentage
 * 
 * @param completedTasks - Number of completed tasks
 * @param totalTasks - Total number of tasks
 * @returns Completion percentage (0-100)
 */
export function calculateChallengeCompletion(
  completedTasks: number,
  totalTasks: number
): number {
  if (totalTasks === 0) return 0;
  return Math.round((completedTasks / totalTasks) * 100);
}
