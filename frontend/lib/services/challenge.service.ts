/**
 * Challenge Service
 * Handles all challenge-related API calls
 */

import { httpClient } from "./http-client"
import type {
  Challenge,
  ChallengeFilters,
  ChallengeListResponse,
  CreateChallengeDto,
  UpdateChallengeDto,
  JoinChallengeDto,
  LeaveChallengeDto,
  UpdateProgressDto,
  ChallengeAccessResponse,
  ChallengePriceCalculation,
} from "../types/challenge.types"

class ChallengeService {
  private static instance: ChallengeService

  static getInstance(): ChallengeService {
    if (!ChallengeService.instance) {
      ChallengeService.instance = new ChallengeService()
    }
    return ChallengeService.instance
  }

  /**
   * Get challenges list with filters and pagination
   * GET /challenges
   */
  async getChallenges(filters?: ChallengeFilters): Promise<ChallengeListResponse> {
    const response = await httpClient.get<any>("/api/challenges", filters)
    return response.data || response
  }

  /**
   * Get challenges by community
   * GET /challenges/community/:communitySlug
   */
  async getChallengesByCommunity(communitySlug: string): Promise<Challenge[]> {
    const response = await httpClient.get<any>(`/api/challenges/community/${communitySlug}`)
    const result: any = response.data || response
    return result.challenges || result || []
  }

  /**
   * Get single challenge by ID
   * GET /challenges/:id
   */
  async getChallengeById(id: string): Promise<Challenge> {
    const response = await httpClient.get<any>(`/api/challenges/${id}`)
    const result: any = response.data || response
    return result.challenge || result
  }

  /**
   * Create a new challenge
   * POST /challenges
   */
  async createChallenge(data: CreateChallengeDto): Promise<Challenge> {
    const response = await httpClient.post<any>("/api/challenges", data)
    const result: any = response.data || response
    return result.challenge || result
  }

  /**
   * Update a challenge
   * PATCH /challenges/:id
   */
  async updateChallenge(id: string, data: UpdateChallengeDto): Promise<Challenge> {
    const response = await httpClient.patch<any>(`/api/challenges/${id}`, data)
    const result: any = response.data || response
    return result.challenge || result
  }

  /**
   * Delete a challenge
   * DELETE /challenges/:id
   */
  async deleteChallenge(id: string): Promise<void> {
    await httpClient.delete<any>(`/api/challenges/${id}`)
  }

  /**
   * Join a challenge
   * POST /challenges/join
   */
  async joinChallenge(data: JoinChallengeDto): Promise<Challenge> {
    const response = await httpClient.post<any>("/api/challenges/join", data)
    const result: any = response.data || response
    return result.challenge || result
  }

  /**
   * Leave a challenge
   * POST /challenges/leave
   */
  async leaveChallenge(data: LeaveChallengeDto): Promise<Challenge> {
    const response = await httpClient.post<any>("/api/challenges/leave", data)
    const result: any = response.data || response
    return result.challenge || result
  }

  /**
   * Update challenge progress
   * PATCH /challenges/progress
   */
  async updateProgress(data: UpdateProgressDto): Promise<Challenge> {
    const response = await httpClient.patch<any>("/api/challenges/progress", data)
    const result: any = response.data || response
    return result.challenge || result
  }

  /**
   * Get free challenges
   * GET /challenges/free
   */
  async getFreeChallenges(
    page?: number,
    limit?: number,
    communitySlug?: string
  ): Promise<ChallengeListResponse> {
    const response = await httpClient.get<any>("/api/challenges/free", {
      page,
      limit,
      communitySlug,
    })
    return response.data || response
  }

  /**
   * Get premium challenges
   * GET /challenges/premium
   */
  async getPremiumChallenges(
    page?: number,
    limit?: number,
    communitySlug?: string
  ): Promise<ChallengeListResponse> {
    const response = await httpClient.get<any>("/api/challenges/premium", {
      page,
      limit,
      communitySlug,
    })
    return response.data || response
  }

  /**
   * Check challenge access
   * POST /challenges/check-access
   */
  async checkAccess(challengeId: string): Promise<ChallengeAccessResponse> {
    const response = await httpClient.post<any>("/api/challenges/check-access", {
      challengeId,
    })
    return response.data || response
  }

  /**
   * Calculate challenge price
   * POST /challenges/calculate-price
   */
  async calculatePrice(
    challengeId: string,
    promoCode?: string
  ): Promise<ChallengePriceCalculation> {
    const response = await httpClient.post<any>("/api/challenges/calculate-price", {
      challengeId,
      promoCode,
    })
    return response.data || response
  }

  /**
   * Track challenge view
   * POST /challenges/track/view
   */
  async trackView(challengeId: string): Promise<void> {
    await httpClient.post<any>("/api/challenges/track/view", { challengeId })
  }

  /**
   * Track challenge start
   * POST /challenges/track/start
   */
  async trackStart(challengeId: string): Promise<void> {
    await httpClient.post<any>("/api/challenges/track/start", { challengeId })
  }

  /**
   * Track challenge completion
   * POST /challenges/track/complete
   */
  async trackComplete(challengeId: string): Promise<void> {
    await httpClient.post<any>("/api/challenges/track/complete", { challengeId })
  }

  /**
   * Get creator's challenges
   * GET /challenges (filtered by current user)
   */
  async getMyCreatedChallenges(
    page?: number,
    limit?: number
  ): Promise<ChallengeListResponse> {
    const response = await httpClient.get<any>("/api/challenges", {
      page,
      limit,
      // Backend will filter by authenticated user
    })
    return response.data || response
  }

  /**
   * Get challenge statistics (for creators)
   * GET /challenges/:id/track/stats
   */
  async getChallengeStats(challengeId: string): Promise<any> {
    const response = await httpClient.get<any>(`/api/challenges/${challengeId}/track/stats`)
    return response.data || response
  }

  /**
   * Get challenge progress for user
   * GET /challenges/:id/progress
   */
  async getChallengeProgress(challengeId: string): Promise<any> {
    const response = await httpClient.get<any>(`/api/challenges/${challengeId}/progress`)
    return response.data || response
  }
}

export const challengeService = ChallengeService.getInstance()
