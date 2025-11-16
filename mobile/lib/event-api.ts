/**
 * Event API Integration
 * 
 * Provides functions to interact with the event endpoints for regular users.
 * Handles event browsing, registration, ticket purchasing, and management.
 * 
 * @module event-api
 */

import { tryEndpoints } from './http';
import { getAccessToken } from './auth';

// ============================================================================
// TypeScript Interfaces
// ============================================================================

/**
 * Event creator information
 */
export interface EventCreator {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

/**
 * Event session
 */
export interface EventSession {
  _id: string;
  title: string;
  description?: string;
  speaker?: string;
  start_time: string;
  end_time: string;
  location?: string;
}

/**
 * Event ticket type
 */
export interface EventTicket {
  _id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  quantity_available: number;
  quantity_sold: number;
  is_available: boolean;
}

/**
 * Event speaker
 */
export interface EventSpeaker {
  _id: string;
  name: string;
  title?: string;
  bio?: string;
  avatar?: string;
  company?: string;
}

/**
 * Main event interface
 */
export interface Event {
  _id: string;
  title: string;
  description: string;
  short_description?: string;
  thumbnail?: string;
  cover_image?: string;
  category?: string;
  type: 'online' | 'in-person' | 'hybrid';
  start_date: string;
  end_date: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  venue?: string;
  is_active: boolean;
  is_published: boolean;
  created_by: EventCreator;
  community_id?: {
    _id: string;
    name: string;
    slug: string;
  };
  sessions?: EventSession[];
  tickets?: EventTicket[];
  speakers?: EventSpeaker[];
  attendees_count: number;
  max_attendees?: number;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

/**
 * User event registration
 */
export interface EventRegistration {
  _id: string;
  user_id: string;
  event_id: string;
  ticket_id?: string;
  registered_at: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  qr_code?: string;
}

/**
 * API response for event list
 */
export interface EventListResponse {
  events: Event[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Event filters for browsing
 */
export interface EventFilters {
  page?: number;
  limit?: number;
  communityId?: string;
  category?: string;
  type?: 'online' | 'in-person' | 'hybrid';
  isActive?: boolean;
  search?: string;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get events with filters (for browsing)
 * 
 * @param filters - Filter options for events
 * @returns Promise with event list response
 */
export async function getEvents(filters: EventFilters = {}): Promise<EventListResponse> {
  try {
    console.log('🎉 [EVENT-API] Fetching events with filters:', filters);

    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.communityId) params.append('communityId', filters.communityId);
    if (filters.category) params.append('category', filters.category);
    if (filters.type) params.append('type', filters.type);
    if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters.search) params.append('search', filters.search);

    const resp = await tryEndpoints<any>(
      `/api/events?${params.toString()}`,
      {
        method: 'GET',
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [EVENT-API] Events fetched successfully:', resp.data.data?.events?.length || 0);
      return {
        events: resp.data.data?.events || [],
        total: resp.data.data?.total || 0,
        page: resp.data.data?.page || 1,
        limit: resp.data.data?.limit || 10,
        totalPages: resp.data.data?.totalPages || 1,
      };
    }

    throw new Error(resp.data.message || 'Failed to fetch events');
  } catch (error: any) {
    console.error('💥 [EVENT-API] Error fetching events:', error);
    throw new Error(error.message || 'Failed to fetch events');
  }
}

/**
 * Get event by ID (detailed view)
 * 
 * @param eventId - Event ID
 * @returns Promise with event details
 */
export async function getEventById(eventId: string): Promise<Event> {
  try {
    console.log('🎉 [EVENT-API] Fetching event details:', eventId);

    const resp = await tryEndpoints<any>(
      `/api/events/${eventId}`,
      {
        method: 'GET',
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [EVENT-API] Event details fetched:', resp.data.data?.title);
      return resp.data.data;
    }

    throw new Error(resp.data.message || 'Failed to fetch event');
  } catch (error: any) {
    console.error('💥 [EVENT-API] Error fetching event:', error);
    throw new Error(error.message || 'Failed to fetch event details');
  }
}

/**
 * Register for an event
 * 
 * @param eventId - Event ID to register for
 * @param ticketId - Optional ticket ID to purchase
 * @returns Promise with registration data
 */
export async function registerForEvent(
  eventId: string,
  ticketId?: string
): Promise<EventRegistration> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Authentication required. Please login to register for events.');
    }

    console.log('📝 [EVENT-API] Registering for event:', eventId);

    const resp = await tryEndpoints<any>(
      `/api/events/${eventId}/register`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: ticketId ? { ticket_id: ticketId } : {},
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [EVENT-API] Registration successful');
      return resp.data.registration || resp.data;
    }

    throw new Error(resp.data.message || 'Failed to register for event');
  } catch (error: any) {
    console.error('💥 [EVENT-API] Error registering for event:', error);
    throw new Error(error.message || 'Failed to register for event');
  }
}

/**
 * Unregister from an event
 * 
 * @param eventId - Event ID to unregister from
 * @returns Promise with success status
 */
export async function unregisterFromEvent(eventId: string): Promise<{ success: boolean; message: string }> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    console.log('👋 [EVENT-API] Unregistering from event:', eventId);

    const resp = await tryEndpoints<any>(
      `/api/events/${eventId}/unregister`,
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
      console.log('✅ [EVENT-API] Unregistered successfully');
      return { success: true, message: 'Successfully unregistered from event' };
    }

    throw new Error(resp.data.message || 'Failed to unregister from event');
  } catch (error: any) {
    console.error('💥 [EVENT-API] Error unregistering from event:', error);
    throw new Error(error.message || 'Failed to unregister from event');
  }
}

/**
 * Get events by community
 * 
 * @param communityId - Community ID
 * @param filters - Additional filters
 * @returns Promise with event list
 */
export async function getEventsByCommunity(
  communityId: string,
  filters: Omit<EventFilters, 'communityId'> = {}
): Promise<EventListResponse> {
  try {
    console.log('🎉 [EVENT-API] Fetching events for community:', communityId);

    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const resp = await tryEndpoints<any>(
      `/api/events/community/${communityId}?${params.toString()}`,
      {
        method: 'GET',
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [EVENT-API] Community events fetched:', resp.data.data?.events?.length || 0);
      return {
        events: resp.data.data?.events || [],
        total: resp.data.data?.total || 0,
        page: resp.data.data?.page || 1,
        limit: resp.data.data?.limit || 10,
        totalPages: resp.data.data?.totalPages || 1,
      };
    }

    throw new Error(resp.data.message || 'Failed to fetch community events');
  } catch (error: any) {
    console.error('💥 [EVENT-API] Error fetching community events:', error);
    throw new Error(error.message || 'Failed to fetch community events');
  }
}

/**
 * Get user's registered events
 * 
 * @returns Promise with list of registered events
 */
export async function getMyRegisteredEvents(): Promise<Event[]> {
  try {
    const token = await getAccessToken();
    if (!token) {
      console.log('⚠️ [EVENT-API] No auth token - returning empty registrations');
      return [];
    }

    console.log('🎉 [EVENT-API] Fetching registered events');
    
    const resp = await tryEndpoints<any>(
      `/api/events/my-registrations`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [EVENT-API] Registered events fetched:', resp.data.events?.length || 0);
      return resp.data.events || [];
    }

    return [];
  } catch (error: any) {
    console.error('💥 [EVENT-API] Error fetching registered events:', error);
    return [];
  }
}

/**
 * Check if user is registered for an event
 * 
 * @param eventId - Event ID
 * @returns Promise with boolean registration status
 */
export async function isRegisteredForEvent(eventId: string): Promise<boolean> {
  try {
    const token = await getAccessToken();
    if (!token) {
      return false;
    }

    const registeredEvents = await getMyRegisteredEvents();
    return registeredEvents.some(event => event._id === eventId);
  } catch (error) {
    return false;
  }
}

/**
 * Get event status (upcoming, ongoing, past)
 * 
 * @param event - Event object
 * @returns Status string
 */
export function getEventStatus(event: Event): 'upcoming' | 'ongoing' | 'past' {
  const now = new Date();
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);

  if (endDate < now) return 'past';
  if (startDate > now) return 'upcoming';
  return 'ongoing';
}

/**
 * Calculate days until event
 * 
 * @param startDate - Event start date
 * @returns Number of days until event
 */
export function getDaysUntilEvent(startDate: string): number {
  const now = new Date();
  const start = new Date(startDate);
  const diffTime = start.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Format event date range
 * 
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Formatted date range string
 */
export function formatEventDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const options: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  };
  
  // Same day event
  if (start.toDateString() === end.toDateString()) {
    return start.toLocaleDateString('en-US', options);
  }
  
  return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
}

/**
 * Check if event has available tickets
 * 
 * @param event - Event object
 * @returns Boolean indicating ticket availability
 */
export function hasAvailableTickets(event: Event): boolean {
  if (!event.tickets || event.tickets.length === 0) return true;
  
  return event.tickets.some(ticket => 
    ticket.is_available && 
    ticket.quantity_available > ticket.quantity_sold
  );
}

/**
 * Get cheapest ticket price
 * 
 * @param event - Event object
 * @returns Cheapest ticket price or 0 if free
 */
export function getCheapestTicketPrice(event: Event): number {
  if (!event.tickets || event.tickets.length === 0) return 0;
  
  const availableTickets = event.tickets.filter(ticket => 
    ticket.is_available && 
    ticket.quantity_available > ticket.quantity_sold
  );
  
  if (availableTickets.length === 0) return 0;
  
  return Math.min(...availableTickets.map(ticket => ticket.price));
}
