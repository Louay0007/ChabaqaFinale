/**
 * Community Service
 * Handles all community-related API calls
 */

import { httpClient } from "./http-client"
import type {
  Community,
  CommunityFilters,
  CommunitiesResponse,
  GlobalStats,
  Category,
  CommunityPostsResponse,
  SearchSuggestion,
  CreateCommunityDto,
  JoinCommunityDto,
} from "../types/community.types"

class CommunityService {
  private static instance: CommunityService

  static getInstance(): CommunityService {
    if (!CommunityService.instance) {
      CommunityService.instance = new CommunityService()
    }
    return CommunityService.instance
  }

  /**
   * Get communities list with filters and pagination
   * GET /communities
   */
  async getCommunities(filters?: CommunityFilters): Promise<CommunitiesResponse> {
    const response = await httpClient.get<any>("/api/communities", filters)
    // Backend returns data directly, not wrapped
    return response.data || response
  }

  /**
   * Get community by slug
   * GET /communities/:slug
   */
  async getCommunityBySlug(slug: string): Promise<Community> {
    const response = await httpClient.get<Community>(`/api/communities/${slug}`)
    return response.data
  }

  /**
   * Get community posts
   * GET /communities/:slug/posts
   */
  async getCommunityPosts(
    slug: string,
    pagination?: { page?: number; limit?: number }
  ): Promise<CommunityPostsResponse> {
    const response = await httpClient.get<CommunityPostsResponse>(
      `/api/communities/${slug}/posts`,
      pagination
    )
    return response.data
  }

  /**
   * Get global statistics
   * GET /communities/stats/global
   */
  async getGlobalStats(): Promise<GlobalStats> {
    const response = await httpClient.get<any>("/api/communities/stats/global")
    // Backend returns data directly, not wrapped
    return response.data || response
  }

  /**
   * Get categories with counts
   * GET /communities/categories
   */
  async getCategories(): Promise<Category[]> {
    const response = await httpClient.get<any>("/api/communities/categories")
    // Backend returns { categories: [...] } directly
    const result: any = response.data || response
    return result.categories || []
  }

  /**
   * Get search suggestions
   * GET /communities/search/suggestions
   */
  async getSearchSuggestions(query: string, limit?: number): Promise<SearchSuggestion[]> {
    const response = await httpClient.get<any>(
      "/api/communities/search/suggestions",
      { q: query, limit }
    )
    // Backend returns { suggestions: [...] } directly
    const result: any = response.data || response
    return result.suggestions || []
  }

  /**
   * Create a new community
   * POST /community-aff-crea-join/create
   */
  async createCommunity(data: CreateCommunityDto, logoFile?: File): Promise<Community> {
    const formData = new FormData()
    
    // Add all text fields
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === "object") {
          formData.append(key, JSON.stringify(value))
        } else {
          formData.append(key, String(value))
        }
      }
    })

    // Add logo file if provided
    if (logoFile) {
      formData.append("logo", logoFile)
    }

    const response = await httpClient.postFormData<Community>(
      "/api/community-aff-crea-join/create",
      formData
    )
    return response.data
  }

  /**
   * Get user's created communities
   * GET /community-aff-crea-join/my-created
   */
  async getMyCreatedCommunities(): Promise<Community[]> {
    const response = await httpClient.get<Community[]>("/api/community-aff-crea-join/my-created")
    return response.data
  }

  /**
   * Get user's joined communities
   * GET /community-aff-crea-join/my-joined
   */
  async getMyJoinedCommunities(): Promise<Community[]> {
    const response = await httpClient.get<Community[]>("/api/community-aff-crea-join/my-joined")
    return response.data
  }

  /**
   * Get all communities
   * GET /community-aff-crea-join/all-communities
   */
  async getAllCommunities(): Promise<Community[]> {
    const response = await httpClient.get<Community[]>("/api/community-aff-crea-join/all-communities")
    return response.data
  }

  /**
   * Get community by ID
   * GET /community-aff-crea-join/:id
   */
  async getCommunityById(id: string): Promise<Community> {
    const response = await httpClient.get<Community>(`/api/community-aff-crea-join/${id}`)
    return response.data
  }

  /**
   * Get community ranking
   * GET /community-aff-crea-join/ranking
   */
  async getCommunityRanking(): Promise<Community[]> {
    const response = await httpClient.get<Community[]>("/api/community-aff-crea-join/ranking")
    return response.data
  }

  /**
   * Join a community
   * POST /community-aff-crea-join/join
   */
  async joinCommunity(communityId: string): Promise<Community> {
    const response = await httpClient.post<Community>("/api/community-aff-crea-join/join", {
      communityId,
    })
    return response.data
  }

  /**
   * Leave a community
   * POST /community-aff-crea-join/leave/:communityId
   */
  async leaveCommunity(communityId: string): Promise<{ message: string }> {
    const response = await httpClient.post<{ message: string }>(
      `/api/community-aff-crea-join/leave/${communityId}`
    )
    return response.data
  }

  /**
   * Checkout community membership (for paid communities)
   * POST /community-aff-crea-join/:id/checkout
   */
  async checkoutCommunity(
    communityId: string,
    promoCode?: string
  ): Promise<{ checkoutUrl: string; sessionId: string }> {
    const response = await httpClient.post<{ checkoutUrl: string; sessionId: string }>(
      `/api/community-aff-crea-join/${communityId}/checkout`,
      promoCode ? { promoCode } : undefined
    )
    return response.data
  }
}

export const communityService = CommunityService.getInstance()
