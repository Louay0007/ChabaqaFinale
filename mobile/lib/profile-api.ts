import { tryEndpoints } from './http';
import { getAccessToken, User } from './auth';
import { getCurrentUser } from './user-api';
import { getMyJoinedCommunities, Community } from './communities-api';

/**
 * 👤 Profile API Client
 * Comprehensive profile data management for the profile screen
 */

// ==================== INTERFACES ====================

export interface UserStats {
  communitiesJoined: number;
  coursesCompleted: number;
  challengesCompleted: number;
  totalPoints?: number;
  badgesEarned?: number;
}

export interface UserActivity {
  id: string;
  type: 'community_joined' | 'course_completed' | 'challenge_completed' | 'badge_earned' | 'post_created';
  title: string;
  description: string;
  timestamp: string;
  relatedId?: string; // ID of related community, course, etc.
  metadata?: any; // Additional activity-specific data
}

export interface ProfileData {
  user: User;
  stats: UserStats;
  joinedCommunities: Community[];
  recentActivities: UserActivity[];
}

export interface CourseProgress {
  id: string;
  courseId: string;
  courseName: string;
  progress: number; // 0-100
  completedAt?: string;
  lastAccessedAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  completedAt?: string;
  status: 'not_started' | 'in_progress' | 'completed';
}

// ==================== API FUNCTIONS ====================

/**
 * Get comprehensive profile data
 * Fetches user profile, stats, communities, and activities in parallel
 */
export const getProfileData = async (): Promise<ProfileData> => {
  try {
    console.log('📆 [PROFILE-API] Fetching comprehensive profile data');
    
    // Fetch all data in parallel for better performance
    const [user, stats, joinedCommunities, recentActivities] = await Promise.allSettled([
      getCurrentUser(),
      getUserStats(),
      getMyJoinedCommunities().catch((error) => {
        console.log('⚠️ [PROFILE-API] getMyJoinedCommunities failed:', error.message);
        return { data: [] };
      }),
      getUserActivities(10) // Get last 10 activities
    ]);

    // Handle results and provide fallbacks with proper null checks
    console.log('🗑️ [PROFILE-API] Debug Promise.allSettled results:', {
      user: user.status,
      stats: stats.status,
      joinedCommunities: {
        status: joinedCommunities.status,
        value: joinedCommunities.status === 'fulfilled' ? joinedCommunities.value : null,
        reason: joinedCommunities.status === 'rejected' ? joinedCommunities.reason : null
      },
      recentActivities: recentActivities.status
    });
    
    const userData = user.status === 'fulfilled' && user.value ? user.value : null;
    const statsData = stats.status === 'fulfilled' ? stats.value : getDefaultStats();
    const communitiesData = joinedCommunities.status === 'fulfilled' && joinedCommunities.value && joinedCommunities.value.data 
      ? joinedCommunities.value.data 
      : [];
    const activitiesData = recentActivities.status === 'fulfilled' && recentActivities.value 
      ? recentActivities.value 
      : [];

    if (!userData) {
      throw new Error('User data not available');
    }

    console.log('✅ [PROFILE-API] Profile data assembled successfully:', {
      hasUser: !!userData,
      userName: userData?.name || 'No name',
      userEmail: userData?.email || 'No email',
      userBio: userData?.bio || 'No bio',
      userPhone: userData?.numtel || 'No phone',
      userCountry: userData?.pays || 'No country',
      userCity: userData?.ville || 'No city',
      hasStats: !!statsData,
      communitiesCount: communitiesData.length,
      activitiesCount: activitiesData.length
    });
    
    return {
      user: userData,
      stats: statsData,
      joinedCommunities: communitiesData,
      recentActivities: activitiesData
    };
  } catch (error: any) {
    console.error('💥 [PROFILE-API] Error fetching profile data:', error);
    throw new Error(error.message || 'Failed to fetch profile data');
  }
};

/**
 * Get user statistics
 * First tries dedicated endpoint, then falls back to calculating from existing data
 */
export const getUserStats = async (): Promise<UserStats> => {
  try {
    console.log('📈 [PROFILE-API] Fetching user stats');
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
      throw new Error('Not authenticated');
    }

    // Try dedicated stats endpoint first
    try {
      const resp = await tryEndpoints<{
        success: boolean;
        data: UserStats;
      }>(
        '/api/user/stats',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          timeout: 15000, // Shorter timeout
        }
      );

      console.log('✅ [PROFILE-API] User stats fetched from dedicated endpoint');
      return resp.data.data;
    } catch (statsError) {
      console.log('⚠️ [PROFILE-API] Stats endpoint not available, calculating from existing data');
      
      // Fallback: Calculate stats from existing data sources
      const [communities] = await Promise.allSettled([
        getMyJoinedCommunities().catch(() => ({ data: [] }))
      ]);
      
      const communitiesCount = communities.status === 'fulfilled' && communities.value && communities.value.data 
        ? communities.value.data.length 
        : 0;
      
      const calculatedStats: UserStats = {
        communitiesJoined: communitiesCount,
        coursesCompleted: 0, // Will be updated when course endpoints are available
        challengesCompleted: 0, // Will be updated when challenge endpoints are available
        totalPoints: 0,
        badgesEarned: 0,
      };
      
      console.log('✅ [PROFILE-API] Stats calculated from existing data:', calculatedStats);
      return calculatedStats;
    }
  } catch (error: any) {
    console.error('💥 [PROFILE-API] Error fetching user stats:', error);
    // Return default stats as fallback
    return getDefaultStats();
  }
};

/**
 * Get user activities
 */
export const getUserActivities = async (limit: number = 20): Promise<UserActivity[]> => {
  try {
    console.log('📋 [PROFILE-API] Fetching user activities');
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
      console.log('⚠️ [PROFILE-API] No access token, returning empty activities');
      return [];
    }

    const resp = await tryEndpoints<{
      success: boolean;
      data: UserActivity[];
    }>(
      `/api/user/activities?limit=${limit}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        timeout: 15000, // Shorter timeout
      }
    );

    console.log('✅ [PROFILE-API] User activities fetched successfully');
    return resp.data.data;
  } catch (error: any) {
    console.log('⚠️ [PROFILE-API] Activities endpoint not available:', error.message);
    // Return empty array as fallback - this is expected if endpoint doesn't exist
    return [];
  }
};

/**
 * Get user's course progress
 */
export const getUserCourseProgress = async (): Promise<CourseProgress[]> => {
  try {
    console.log('📚 [PROFILE-API] Fetching user course progress');
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
      throw new Error('Not authenticated');
    }

    const resp = await tryEndpoints<{
      success: boolean;
      data: CourseProgress[];
    }>(
      '/api/user/courses/progress',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        timeout: 30000,
      }
    );

    console.log('✅ [PROFILE-API] Course progress fetched successfully');
    return resp.data.data;
  } catch (error: any) {
    console.error('💥 [PROFILE-API] Error fetching course progress:', error);
    // Return empty array as fallback
    return [];
  }
};

/**
 * Get user's challenges
 */
export const getUserChallenges = async (): Promise<Challenge[]> => {
  try {
    console.log('🏆 [PROFILE-API] Fetching user challenges');
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
      throw new Error('Not authenticated');
    }

    const resp = await tryEndpoints<{
      success: boolean;
      data: Challenge[];
    }>(
      '/api/user/challenges',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        timeout: 30000,
      }
    );

    console.log('✅ [PROFILE-API] User challenges fetched successfully');
    return resp.data.data;
  } catch (error: any) {
    console.error('💥 [PROFILE-API] Error fetching user challenges:', error);
    // Return empty array as fallback
    return [];
  }
};

/**
 * Refresh all profile data
 * Clears cache and fetches fresh data
 */
export const refreshProfileData = async (): Promise<ProfileData> => {
  console.log('🔄 [PROFILE-API] Refreshing all profile data');
  return await getProfileData();
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Get default stats when API fails
 */
const getDefaultStats = (): UserStats => ({
  communitiesJoined: 0,
  coursesCompleted: 0,
  challengesCompleted: 0,
  totalPoints: 0,
  badgesEarned: 0,
});

/**
 * Format activity timestamp
 */
export const formatActivityTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
  return date.toLocaleDateString();
};

/**
 * Get activity icon based on type
 */
export const getActivityIcon = (type: UserActivity['type']): string => {
  switch (type) {
    case 'community_joined': return 'people';
    case 'course_completed': return 'school';
    case 'challenge_completed': return 'trophy';
    case 'badge_earned': return 'medal';
    case 'post_created': return 'create';
    default: return 'ellipse';
  }
};

/**
 * Get activity color based on type
 */
export const getActivityColor = (type: UserActivity['type']): string => {
  switch (type) {
    case 'community_joined': return '#8e78fb';
    case 'course_completed': return '#47c7ea';
    case 'challenge_completed': return '#ff9b28';
    case 'badge_earned': return '#f65887';
    case 'post_created': return '#10b981';
    default: return '#6b7280';
  }
};

// ==================== EXPORT ====================

export default {
  getProfileData,
  getUserStats,
  getUserActivities,
  getUserCourseProgress,
  getUserChallenges,
  refreshProfileData,
  formatActivityTime,
  getActivityIcon,
  getActivityColor,
};
