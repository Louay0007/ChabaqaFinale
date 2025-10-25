import { tryEndpoints } from './http';
import { getAccessToken } from './auth';

/**
 * 🤝 Community Join/Leave API Client
 * Handles community membership operations
 */

// ==================== INTERFACES ====================

export interface JoinResponse {
  success: boolean;
  message: string;
  membershipId?: string;
}

export interface LeaveResponse {
  success: boolean;
  message: string;
}

export interface MembershipStatusResponse {
  success: boolean;
  isMember: boolean;
  membershipId?: string;
  joinedAt?: string;
}

export interface MyCommunitiesResponse {
  success: boolean;
  communities: any[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==================== API FUNCTIONS ====================

/**
 * Join a community
 * @param communityId - Community ID
 * @returns Promise with join response
 */
export const joinCommunity = async (communityId: string): Promise<JoinResponse> => {
  try {
    console.log('🤝 [COMMUNITY-JOIN] Joining community:', communityId);
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
      throw new Error('Please login to join communities');
    }

    const resp = await tryEndpoints<JoinResponse>(
      '/api/community-aff-crea-join/join',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        data: { communityId },
        timeout: 30000,
      }
    );

    console.log('✅ [COMMUNITY-JOIN] Successfully joined community');
    return resp.data;
  } catch (error: any) {
    console.error('💥 [COMMUNITY-JOIN] Error joining community:', error);
    throw new Error(error.message || 'Failed to join community');
  }
};

/**
 * Leave a community
 * @param communityId - Community ID
 * @returns Promise with leave response
 */
export const leaveCommunity = async (communityId: string): Promise<LeaveResponse> => {
  try {
    console.log('👋 [COMMUNITY-JOIN] Leaving community:', communityId);
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
      throw new Error('Not authenticated');
    }

    const resp = await tryEndpoints<LeaveResponse>(
      `/api/community-aff-crea-join/leave/${communityId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        timeout: 30000,
      }
    );

    console.log('✅ [COMMUNITY-JOIN] Successfully left community');
    return resp.data;
  } catch (error: any) {
    console.error('💥 [COMMUNITY-JOIN] Error leaving community:', error);
    throw new Error(error.message || 'Failed to leave community');
  }
};

/**
 * Check membership status
 * @param communityId - Community ID
 * @returns Promise with membership status
 */
export const getMembershipStatus = async (
  communityId: string
): Promise<MembershipStatusResponse> => {
  try {
    console.log('🔍 [COMMUNITY-JOIN] Checking membership status:', communityId);
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
      return { success: true, isMember: false };
    }

    const resp = await tryEndpoints<MembershipStatusResponse>(
      `/api/community-aff-crea-join/status/${communityId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        timeout: 30000,
      }
    );

    console.log('✅ [COMMUNITY-JOIN] Membership status:', resp.data.isMember);
    return resp.data;
  } catch (error: any) {
    console.error('💥 [COMMUNITY-JOIN] Error checking membership:', error);
    // Return false on error (user not member)
    return { success: false, isMember: false };
  }
};

/**
 * Get user's joined communities
 * @param page - Page number
 * @param limit - Items per page
 * @returns Promise with communities list
 */
export const getMyJoinedCommunities = async (
  page: number = 1,
  limit: number = 20
): Promise<MyCommunitiesResponse> => {
  try {
    console.log('📚 [COMMUNITY-JOIN] Fetching joined communities');
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
      throw new Error('Not authenticated');
    }

    const resp = await tryEndpoints<MyCommunitiesResponse>(
      '/api/community-aff-crea-join/my-joined',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        timeout: 30000,
      }
    );

    console.log('✅ [COMMUNITY-JOIN] Joined communities:', resp.data.communities.length);
    return resp.data;
  } catch (error: any) {
    console.error('💥 [COMMUNITY-JOIN] Error fetching joined communities:', error);
    // Return empty array on error
    return { success: false, communities: [] };
  }
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Toggle community membership (join if not member, leave if member)
 * @param communityId - Community ID
 * @param currentlyJoined - Current membership status
 * @returns Promise with new status
 */
export const toggleMembership = async (
  communityId: string,
  currentlyJoined: boolean
): Promise<{ success: boolean; isJoined: boolean; message: string }> => {
  try {
    if (currentlyJoined) {
      const result = await leaveCommunity(communityId);
      return {
        success: result.success,
        isJoined: false,
        message: result.message || 'Left community',
      };
    } else {
      const result = await joinCommunity(communityId);
      return {
        success: result.success,
        isJoined: true,
        message: result.message || 'Joined community',
      };
    }
  } catch (error: any) {
    return {
      success: false,
      isJoined: currentlyJoined,
      message: error.message,
    };
  }
};

// ==================== EXPORT ====================

export default {
  joinCommunity,
  leaveCommunity,
  getMembershipStatus,
  getMyJoinedCommunities,
  toggleMembership,
};
