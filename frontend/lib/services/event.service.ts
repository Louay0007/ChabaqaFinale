/**
 * Event Service
 * Handles all event-related API calls
 */

import { httpClient } from "./http-client"
import type {
  Event,
  EventFilters,
  EventListResponse,
  CreateEventDto,
  UpdateEventDto,
} from "../types/event.types"

class EventService {
  private static instance: EventService

  static getInstance(): EventService {
    if (!EventService.instance) {
      EventService.instance = new EventService()
    }
    return EventService.instance
  }

  /**
   * Get events list with filters
   * GET /events
   */
  async getEvents(filters?: EventFilters): Promise<EventListResponse> {
    const response = await httpClient.get<any>("/api/events", filters)
    const result: any = response.data || response
    return result
  }

  /**
   * Get events by community
   * GET /events/community/:communityId
   */
  async getEventsByCommunity(communityId: string): Promise<Event[]> {
    const response = await httpClient.get<any>(`/api/events/community/${communityId}`)
    const result: any = response.data || response
    return result.events || result || []
  }

  /**
   * Get single event by ID
   * GET /events/:id
   */
  async getEventById(id: string): Promise<Event> {
    const response = await httpClient.get<any>(`/api/events/${id}`)
    const result: any = response.data || response
    return result.event || result
  }

  /**
   * Create a new event
   * POST /events
   */
  async createEvent(data: CreateEventDto): Promise<Event> {
    const response = await httpClient.post<any>("/api/events", data)
    const result: any = response.data || response
    return result.event || result
  }

  /**
   * Update an event
   * PATCH /events/:id
   */
  async updateEvent(id: string, data: UpdateEventDto): Promise<Event> {
    const response = await httpClient.patch<any>(`/api/events/${id}`, data)
    const result: any = response.data || response
    return result.event || result
  }

  /**
   * Delete an event
   * DELETE /events/:id
   */
  async deleteEvent(id: string): Promise<void> {
    await httpClient.delete<any>(`/api/events/${id}`)
  }

  /**
   * Register for an event
   * POST /events/:id/register
   */
  async registerForEvent(id: string): Promise<Event> {
    const response = await httpClient.post<any>(`/api/events/${id}/register`)
    const result: any = response.data || response
    return result.event || result
  }

  /**
   * Unregister from an event
   * POST /events/:id/unregister
   */
  async unregisterFromEvent(id: string): Promise<Event> {
    const response = await httpClient.post<any>(`/api/events/${id}/unregister`)
    const result: any = response.data || response
    return result.event || result
  }

  /**
   * Toggle event publication
   * PATCH /events/:id/toggle-published
   */
  async togglePublication(id: string): Promise<Event> {
    const response = await httpClient.patch<any>(`/api/events/${id}/toggle-published`)
    const result: any = response.data || response
    return result.event || result
  }

  /**
   * Get creator's events
   * GET /events/creator/:creatorId
   */
  async getMyCreatedEvents(): Promise<Event[]> {
    // Get current user from auth context, or let backend derive from JWT
    const response = await httpClient.get<any>("/api/events")
    const result: any = response.data || response
    return result.events || result || []
  }

  /**
   * Get event statistics
   * GET /events/stats
   */
  async getEventStats(communityId?: string): Promise<any> {
    const response = await httpClient.get<any>("/api/events/stats", {
      communityId,
    })
    return response.data || response
  }
}

export const eventService = EventService.getInstance()
