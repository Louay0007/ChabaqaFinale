import { tryEndpoints } from './http';
import { getAccessToken } from './auth';

/**
 * 🏘️ Communities API Client
 * Handles all community-related API calls for discovery and exploration
 */

// ==================== INTERFACES ====================

export interface Community {
  _id?: string; // MongoDB ID
  id: string;
  slug: string;
  name: string;
  logo?: string;
  coverImage?: string;
  image?: string; // Main image field from backend
  photo_de_couverture?: string; // Backend cover image field
  shortDescription?: string;
  description?: string; // Alternative description field
  short_description?: string; // Backend field name
  longDescription?: string;
  long_description?: any[]; // Backend long description array
  creator: {
    id: string;
    name: string;
    avatar: string;
    bio?: string;
  } | string; // Can be populated object or just string name
  createur?: any; // Backend creator field (populated object)
  creatorId?: string;
  creatorAvatar?: string; // Direct avatar field from backend
  category: string;
  type?: string;
  priceType: 'free' | 'paid' | 'monthly' | 'yearly' | 'hourly' | 'one-time';
  price: number;
  fees_of_join?: number; // Backend field name
  currency?: string;
  membersCount?: number;
  members?: number | any[]; // Can be count or array
  averageRating?: number;
  rating?: number; // Alternative rating field
  ratingCount?: number;
  tags: string[];
  featured: boolean;
  isVerified?: boolean;
  verified?: boolean; // Alternative verified field
  socialLinks?: {
    website?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
    tiktok?: string;
    discord?: string;
    behance?: string;
    github?: string;
  };
  settings?: any; // Community settings object
  stats?: any; // Community stats object
  isActive?: boolean;
  isPrivate?: boolean;
  rank?: number;
  inviteCode?: string;
  inviteLink?: string;
  createdAt: string;
  updatedAt?: string;
  createdDate?: string;
  updatedDate?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CommunitiesResponse {
  success: boolean;
  message: string;
  data: Community[]; // Backend returns array directly
  pagination?: Pagination; // Optional for now
}

export interface CommunityResponse {
  success: boolean;
  message: string;
  data: Community;
}

export interface Category {
  name: string;
  count: number;
  icon: string;
  color: string;
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  categories: Category[];
}

export interface GlobalStats {
  totalCommunities: number;
  totalMembers: number;
  totalCourses: number;
  totalChallenges: number;
  totalProducts: number;
  totalOneToOneSessions: number;
  totalRevenue: number;
  averageRating: number;
}

export interface StatsResponse {
  success: boolean;
  message: string;
  data: GlobalStats;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  likes: number;
  comments: number;
  createdAt: string;
}

export interface PostsResponse {
  success: boolean;
  message: string;
  data: {
    posts: Post[];
    pagination: Pagination;
  };
}

export interface SearchSuggestion {
  type: 'community' | 'category' | 'tag';
  text: string;
  slug: string;
}

export interface SuggestionsResponse {
  success: boolean;
  message: string;
  data: {
    suggestions: SearchSuggestion[];
  };
}

export interface GetCommunitiesFilters {
  search?: string;
  category?: string;
  type?: 'community' | 'course' | 'challenge' | 'product' | 'oneToOne';
  priceType?: 'free' | 'paid' | 'monthly' | 'yearly' | 'hourly';
  minMembers?: number;
  sortBy?: 'popular' | 'newest' | 'members' | 'rating' | 'price-low' | 'price-high';
  page?: number;
  limit?: number;
  featured?: boolean;
}

// ==================== API FUNCTIONS ====================

/**
 * Get communities list with filters, search, and pagination
 * @param filters - Filter options for communities
 * @returns Promise with communities list and pagination
 */
export const getCommunities = async (
  filters: GetCommunitiesFilters = {}
): Promise<CommunitiesResponse> => {
  try {
    console.log('🔍 [COMMUNITIES-API] Fetching communities with filters:', filters);

    // Build query parameters
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.type) params.append('type', filters.type);
    if (filters.priceType) params.append('priceType', filters.priceType);
    if (filters.minMembers) params.append('minMembers', String(filters.minMembers));
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.featured !== undefined) params.append('featured', String(filters.featured));
    params.append('page', String(filters.page || 1));
    params.append('limit', String(filters.limit || 12));

    const queryString = params.toString();
    console.log('📡 [COMMUNITIES-API] Query string:', queryString);

    const accessToken = await getAccessToken();
    const headers: Record<string, string> = {};
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const resp = await tryEndpoints<CommunitiesResponse>(
      `/api/community-aff-crea-join/all-communities${queryString ? `?${queryString}` : ''}`,
      {
        method: 'GET',
        headers,
        timeout: 30000,
      }
    );

    console.log('✅ [COMMUNITIES-API] Communities fetched successfully:', {
      count: resp.data.data?.length || 0,
      total: resp.data.pagination?.total || resp.data.data?.length || 0,
    });

    return resp.data;
  } catch (error: any) {
    console.error('💥 [COMMUNITIES-API] Error fetching communities:', error);
    throw new Error(error.message || 'Failed to fetch communities');
  }
};

/**
 * Get community by slug
 * @param slug - Community slug
 * @returns Promise with community details
 */
export const getCommunityBySlug = async (slug: string): Promise<CommunityResponse> => {
  try {
    console.log('🔍 [COMMUNITIES-API] Fetching community by slug/id:', slug);

    // Backend uses ID not slug, but we'll try with the slug parameter (which might be an ID)
    const resp = await tryEndpoints<CommunityResponse>(
      `/api/community-aff-crea-join/${slug}`,
      {
        method: 'GET',
        timeout: 30000,
      }
    );

    console.log('✅ [COMMUNITIES-API] Community fetched successfully:', resp.data.data?.name || 'Community');

    return resp.data;
  } catch (error: any) {
    console.error('💥 [COMMUNITIES-API] Error fetching community:', error);
    if (error.message?.includes('404')) {
      throw new Error('Community not found');
    }
    throw new Error(error.message || 'Failed to fetch community');
  }
};

/**
 * Get community posts
 * @param slug - Community slug
 * @param pagination - Pagination options
 * @returns Promise with posts list and pagination
 */
export const getCommunityPosts = async (
  slug: string,
  pagination: { page?: number; limit?: number } = {}
): Promise<PostsResponse> => {
  try {
    console.log('🔍 [COMMUNITIES-API] Fetching posts for community:', slug);

    const params = new URLSearchParams();
    params.append('page', String(pagination.page || 1));
    params.append('limit', String(pagination.limit || 10));

    const resp = await tryEndpoints<PostsResponse>(
      `/api/communities/${slug}/posts?${params.toString()}`,
      {
        method: 'GET',
        timeout: 30000,
      }
    );

    console.log('✅ [COMMUNITIES-API] Posts fetched successfully:', {
      count: resp.data.data.posts.length,
      total: resp.data.data.pagination.total,
    });

    return resp.data;
  } catch (error: any) {
    console.error('💥 [COMMUNITIES-API] Error fetching posts:', error);
    throw new Error(error.message || 'Failed to fetch posts');
  }
};

/**
 * Get all categories with their community counts
 * @returns Promise with categories list
 */
export const getCategories = async (): Promise<CategoriesResponse> => {
  try {
    console.log('🔍 [COMMUNITIES-API] Fetching categories');

    const resp = await tryEndpoints<CategoriesResponse>(
      '/api/communities/categories',
      {
        method: 'GET',
        timeout: 30000,
      }
    );

    console.log('✅ [COMMUNITIES-API] Categories fetched successfully:', resp.data.categories.length);

    return resp.data;
  } catch (error: any) {
    console.error('💥 [COMMUNITIES-API] Error fetching categories:', error);
    throw new Error(error.message || 'Failed to fetch categories');
  }
};

/**
 * Get global platform statistics
 * @returns Promise with global stats
 */
export const getGlobalStats = async (): Promise<StatsResponse> => {
  try {
    console.log('🔍 [COMMUNITIES-API] Fetching global stats');

    const resp = await tryEndpoints<StatsResponse>(
      '/api/communities/stats/global',
      {
        method: 'GET',
        timeout: 30000,
      }
    );

    console.log('✅ [COMMUNITIES-API] Global stats fetched successfully');

    return resp.data;
  } catch (error: any) {
    console.error('💥 [COMMUNITIES-API] Error fetching stats:', error);
    throw new Error(error.message || 'Failed to fetch global stats');
  }
};

/**
 * Get search suggestions for autocomplete
 * @param query - Search query
 * @param limit - Number of suggestions to return
 * @returns Promise with suggestions
 */
export const getSearchSuggestions = async (
  query: string,
  limit: number = 5
): Promise<SuggestionsResponse> => {
  try {
    console.log('🔍 [COMMUNITIES-API] Fetching search suggestions for:', query);

    const params = new URLSearchParams();
    params.append('q', query);
    params.append('limit', String(limit));

    const resp = await tryEndpoints<SuggestionsResponse>(
      `/api/communities/search/suggestions?${params.toString()}`,
      {
        method: 'GET',
        timeout: 10000, // Faster timeout for autocomplete
      }
    );

    console.log('✅ [COMMUNITIES-API] Suggestions fetched:', resp.data.data.suggestions.length);

    return resp.data;
  } catch (error: any) {
    console.error('💥 [COMMUNITIES-API] Error fetching suggestions:', error);
    // Don't throw for suggestions, just return empty
    return {
      success: false,
      message: 'Failed to fetch suggestions',
      data: { suggestions: [] },
    };
  }
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Format price for display
 * @param price - Price value
 * @param currency - Currency code
 * @param priceType - Price type
 * @returns Formatted price string
 */
export const formatPrice = (
  price: number,
  currency: string,
  priceType: string
): string => {
  if (priceType === 'free' || price === 0) {
    return 'Free';
  }

  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);

  const suffix = {
    monthly: '/month',
    yearly: '/year',
    hourly: '/hour',
    paid: '',
  }[priceType] || '';

  return `${formatted}${suffix}`;
};

/**
 * Format member count for display
 * @param count - Member count
 * @returns Formatted string (e.g., "1.2K", "45K", "1M")
 */
export const formatMemberCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return String(count);
};

/**
 * Format rating for display
 * @param rating - Average rating
 * @returns Formatted string with one decimal
 */
export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

/**
 * Get community type label
 * @param type - Community type
 * @returns Human-readable label
 */
export const getCommunityTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    community: 'Community',
    course: 'Course',
    challenge: 'Challenge',
    product: 'Product',
    oneToOne: '1-on-1 Session',
    event: 'Event',
  };
  return labels[type] || type;
};

/**
 * Get user's joined communities
 * @returns Promise with joined communities list
 */
export const getMyJoinedCommunities = async (): Promise<{
  success: boolean;
  message: string;
  data: Community[];
}> => {
  try {
    console.log('📚 [COMMUNITIES] Fetching joined communities');
    const accessToken = await getAccessToken();

    if (!accessToken) {
      console.log('⚠️ [COMMUNITIES] No access token, returning empty list');
      return {
        success: false,
        message: 'Not authenticated',
        data: []
      };
    }

    const resp = await tryEndpoints<{
      success: boolean;
      message: string;
      data: Community[];
    }>('/api/community-aff-crea-join/my-joined', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      timeout: 30000,
    });

    // Handle 401 Unauthorized
    if (resp.status === 401) {
      console.log('⚠️ [COMMUNITIES] Token expired or invalid, returning empty list');
      return {
        success: false,
        message: 'Authentication required',
        data: []
      };
    }

    // Check if response has data
    if (!resp.data || !resp.data.data) {
      console.log('⚠️ [COMMUNITIES] No data in response, returning empty list');
      return {
        success: false,
        message: 'No data received',
        data: []
      };
    }

    console.log('✅ [COMMUNITIES] Joined communities:', resp.data.data.length);
    return resp.data;
  } catch (error: any) {
    console.error('💥 [COMMUNITIES] Error fetching joined communities:', error);
    // Return empty array instead of throwing
    return {
      success: false,
      message: error.message || 'Failed to fetch joined communities',
      data: []
    };
  }
};

/**
 * Get community rankings (top communities by members)
 * @returns Promise with ranked communities list
 */
export const getCommunityRanking = async (): Promise<{
  success: boolean;
  message: string;
  data: Community[];
}> => {
  try {
    console.log('🏆 [COMMUNITIES] Fetching community rankings');
    const resp = await tryEndpoints<{
      success: boolean;
      message: string;
      data: Community[];
    }>('/api/community-aff-crea-join/ranking', {
      method: 'GET',
      timeout: 30000,
    });

    console.log('✅ [COMMUNITIES] Rankings loaded');
    return resp.data;
  } catch (error: any) {
    console.error('💥 [COMMUNITIES] Error fetching rankings:', error);
    throw new Error(error.message || 'Failed to fetch rankings');
  }
};

/**
 * Join a community by ID
 * @param communityId - ID of the community to join
 * @param message - Optional message for joining
 * @returns Promise with join result
 */
export const joinCommunity = async (
  communityId: string,
  message?: string
): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> => {
  try {
    console.log('🤝 [COMMUNITIES] Joining community:', communityId);

    const accessToken = await getAccessToken();
    if (!accessToken) {
      throw new Error('Not authenticated');
    }

    const resp = await tryEndpoints<{
      success: boolean;
      message: string;
      data?: any;
    }>(`/api/community-aff-crea-join/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        communityId,
        message: message || undefined,
      },
      timeout: 30000,
    });

    console.log('✅ [COMMUNITIES] Community joined successfully');
    return resp.data;
  } catch (error: any) {
    console.error('💥 [COMMUNITIES] Error joining community:', error);
    throw new Error(error.message || 'Failed to join community');
  }
};

/**
 * Get active/online members of a community by slug
 */
export const getActiveMembersByCommunity = async (
  slug: string,
  limit: number = 20
): Promise<{
  success: boolean;
  message: string;
  data: {
    members: Array<{
      id: string;
      name: string;
      email: string;
      avatar: string;
      bio: string;
      isOnline: boolean;
      lastActive: Date;
    }>;
    total: number;
    online: number;
  };
}> => {
  try {
    console.log('👥 [ACTIVE-MEMBERS-API] Fetching active members for:', slug, 'limit:', limit);

    const resp = await tryEndpoints<{
      success: boolean;
      message: string;
      data: {
        members: Array<{
          id: string;
          name: string;
          email: string;
          avatar: string;
          bio: string;
          isOnline: boolean;
          lastActive: Date;
        }>;
        total: number;
        online: number;
      };
    }>(`/api/community-aff-crea-join/${slug}/active-members?limit=${limit}`, {
      method: 'GET',
      timeout: 10000,
    });

    console.log('✅ [ACTIVE-MEMBERS-API] Fetched:', {
      total: resp.data.data.total,
      online: resp.data.data.online
    });

    return resp.data;
  } catch (error: any) {
    console.error('❌ [ACTIVE-MEMBERS-API] Error:', error);
    throw new Error(error.message || 'Failed to fetch active members');
  }
};

export default {
  getCommunities,
  getCommunityBySlug,
  getCommunityPosts,
  getCategories,
  getGlobalStats,
  getSearchSuggestions,
  getMyJoinedCommunities,
  getCommunityRanking,
  joinCommunity,
  getActiveMembersByCommunity,
  formatPrice,
  formatMemberCount,
  formatRating,
  getCommunityTypeLabel,
};
