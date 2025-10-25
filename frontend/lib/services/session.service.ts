/**
 * Session Service
 * Handles all session-related API calls
 */

import { httpClient } from "./http-client"
import type {
  Session,
  SessionFilters,
  SessionListResponse,
  SessionBooking,
  AvailableSlot,
  CreateSessionDto,
  UpdateSessionDto,
  BookSessionDto,
  BookSlotDto,
} from "../types/session.types"

class SessionService {
  private static instance: SessionService

  static getInstance(): SessionService {
    if (!SessionService.instance) {
      SessionService.instance = new SessionService()
    }
    return SessionService.instance
  }

  /**
   * Get sessions list with filters
   * GET /sessions
   */
  async getSessions(filters?: SessionFilters): Promise<SessionListResponse> {
    const response = await httpClient.get<any>("/api/sessions", filters)
    const result: any = response.data || response
    return result
  }

  /**
   * Get sessions by community
   * GET /sessions/community/:communitySlug
   */
  async getSessionsByCommunity(communitySlug: string): Promise<Session[]> {
    const response = await httpClient.get<any>(`/api/sessions/community/${communitySlug}`)
    const result: any = response.data || response
    return result.sessions || result || []
  }

  /**
   * Get single session by ID
   * GET /sessions/:id
   */
  async getSessionById(id: string): Promise<Session> {
    const response = await httpClient.get<any>(`/api/sessions/${id}`)
    const result: any = response.data || response
    return result.session || result
  }

  /**
   * Create a new session
   * POST /sessions
   */
  async createSession(data: CreateSessionDto): Promise<Session> {
    const response = await httpClient.post<any>("/api/sessions", data)
    const result: any = response.data || response
    return result.session || result
  }

  /**
   * Update a session
   * PATCH /sessions/:id
   */
  async updateSession(id: string, data: UpdateSessionDto): Promise<Session> {
    const response = await httpClient.patch<any>(`/api/sessions/${id}`, data)
    const result: any = response.data || response
    return result.session || result
  }

  /**
   * Delete a session
   * DELETE /sessions/:id
   */
  async deleteSession(id: string): Promise<void> {
    await httpClient.delete<any>(`/api/sessions/${id}`)
  }

  /**
   * Book a session
   * POST /sessions/:id/book
   */
  async bookSession(id: string, data: BookSessionDto): Promise<SessionBooking> {
    const response = await httpClient.post<any>(`/api/sessions/${id}/book`, data)
    const result: any = response.data || response
    return result.booking || result
  }

  /**
   * Get available slots for a session
   * GET /sessions/:id/available-slots
   */
  async getAvailableSlots(
    id: string,
    filters?: { startDate?: string; endDate?: string }
  ): Promise<AvailableSlot[]> {
    const response = await httpClient.get<any>(`/api/sessions/${id}/available-slots`, filters)
    const result: any = response.data || response
    return result.slots || result || []
  }

  /**
   * Book a specific slot
   * POST /sessions/:id/book-slot
   */
  async bookSlot(id: string, data: BookSlotDto): Promise<SessionBooking> {
    const response = await httpClient.post<any>(`/api/sessions/${id}/book-slot`, data)
    const result: any = response.data || response
    return result.booking || result
  }

  /**
   * Get user's bookings
   * GET /sessions/bookings/user
   */
  async getUserBookings(): Promise<SessionBooking[]> {
    const response = await httpClient.get<any>("/api/sessions/bookings/user")
    const result: any = response.data || response
    return result.bookings || result || []
  }

  /**
   * Cancel a booking
   * PATCH /sessions/:id/cancel-slot/:slotId
   */
  async cancelBooking(sessionId: string, slotId: string): Promise<void> {
    await httpClient.patch<any>(`/api/sessions/${sessionId}/cancel-slot/${slotId}`)
  }

  /**
   * Get creator's sessions
   * GET /sessions (filtered by creator)
   */
  async getMyCreatedSessions(): Promise<Session[]> {
    const response = await httpClient.get<any>("/api/sessions")
    const result: any = response.data || response
    return result.sessions || result || []
  }

  /**
   * Get creator's bookings
   * GET /sessions/bookings/creator
   */
  async getCreatorBookings(): Promise<SessionBooking[]> {
    const response = await httpClient.get<any>("/api/sessions/bookings/creator")
    const result: any = response.data || response
    return result.bookings || result || []
  }
}

export const sessionService = SessionService.getInstance()
