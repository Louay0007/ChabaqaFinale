/**
 * Session API Integration (1-on-1 Sessions)
 * 
 * Provides functions to interact with the session endpoints for booking 1-on-1 sessions.
 * Handles session browsing, booking, availability management, and session completion.
 * 
 * @module session-api
 */

import { tryEndpoints } from './http';
import { getAccessToken } from './auth';

// ============================================================================
// TypeScript Interfaces
// ============================================================================

/**
 * Session creator information
 */
export interface SessionCreator {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  title?: string;
  role?: string;
  rating?: number;
  reviews?: number;
  bio?: string;
}

/**
 * Session booking
 */
export interface SessionBooking {
  _id: string;
  id: string;
  user_id: string;
  user_name: string;
  user_email?: string;
  user_avatar?: string;
  booked_at: string;
  scheduled_at: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  meeting_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Main session interface (1-on-1 Session)
 */
export interface Session {
  _id: string;
  id: string;
  title: string;
  description: string;
  creator: SessionCreator;
  community_id?: {
    _id: string;
    name: string;
    slug: string;
  };
  category?: string;
  duration: number; // in minutes
  price: number;
  currency: string;
  is_active: boolean;
  bookings?: SessionBooking[];
  bookings_count?: number;
  bookings_this_week?: number;
  can_book_more?: boolean;
  max_bookings_per_week?: number;
  average_rating?: number;
  rating_count?: number;
  resources?: SessionResource[];
  created_at: string;
  updated_at: string;
}

/**
 * Session resource interface
 */
export interface SessionResource {
  id: string;
  title: string;
  type: 'video' | 'article' | 'code' | 'tool' | 'pdf' | 'link';
  url: string;
  description: string;
  order: number;
}

/**
 * Available time slot
 */
export interface TimeSlot {
  start_time: string;
  end_time: string;
  is_available: boolean;
}

/**
 * API response for session list
 */
export interface SessionListResponse {
  sessions: Session[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Session filters for browsing
 */
export interface SessionFilters {
  page?: number;
  limit?: number;
  communitySlug?: string;
  category?: string;
  isActive?: boolean;
  creatorId?: string;
}

/**
 * Book session data
 */
export interface BookSessionData {
  scheduled_at: string;
  notes?: string;
}

/**
 * Available slot interface
 */
export interface AvailableSlot {
  id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  booked_by?: string;
  booked_at?: string;
}

/**
 * Book slot data
 */
export interface BookSlotData {
  slot_id: string;
  notes?: string;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get sessions with filters
 * 
 * @param filters - Filter options for sessions
 * @returns Promise with session list response
 */
export async function getSessions(filters: SessionFilters = {}): Promise<SessionListResponse> {
  try {
    console.log('📅 [SESSION-API] Fetching sessions with filters:', filters);

    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.communitySlug) params.append('communitySlug', filters.communitySlug);
    if (filters.category) params.append('category', filters.category);
    if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters.creatorId) params.append('creatorId', filters.creatorId);

    const resp = await tryEndpoints<any>(
      `/api/sessions?${params.toString()}`,
      {
        method: 'GET',
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [SESSION-API] Sessions fetched successfully:', resp.data.sessions?.length || 0);
      return {
        sessions: resp.data.sessions || [],
        total: resp.data.total || 0,
        page: resp.data.page || 1,
        limit: resp.data.limit || 10,
        totalPages: resp.data.totalPages || 1,
      };
    }

    throw new Error(resp.data.message || 'Failed to fetch sessions');
  } catch (error: any) {
    console.error('💥 [SESSION-API] Error fetching sessions:', error);
    throw new Error(error.message || 'Failed to fetch sessions');
  }
}

/**
 * Get session by ID
 * 
 * @param sessionId - Session ID
 * @returns Promise with session details
 */
export async function getSessionById(sessionId: string): Promise<Session> {
  try {
    console.log('📅 [SESSION-API] Fetching session details:', sessionId);

    const resp = await tryEndpoints<any>(
      `/api/sessions/${sessionId}`,
      {
        method: 'GET',
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [SESSION-API] Session details fetched');
      return resp.data;
    }

    throw new Error(resp.data.message || 'Failed to fetch session');
  } catch (error: any) {
    console.error('💥 [SESSION-API] Error fetching session:', error);
    throw new Error(error.message || 'Failed to fetch session details');
  }
}

/**
 * Get sessions by community
 * 
 * @param communitySlug - Community slug
 * @returns Promise with session list
 */
export async function getSessionsByCommunity(communitySlug: string): Promise<Session[]> {
  try {
    console.log('📅 [SESSION-API] Fetching sessions for community:', communitySlug);

    const resp = await tryEndpoints<any>(
      `/api/sessions/community/${communitySlug}`,
      {
        method: 'GET',
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [SESSION-API] Community sessions fetched:', resp.data.length || 0);
      return resp.data || [];
    }

    throw new Error(resp.data.message || 'Failed to fetch community sessions');
  } catch (error: any) {
    console.error('💥 [SESSION-API] Error fetching community sessions:', error);
    throw new Error(error.message || 'Failed to fetch community sessions');
  }
}

/**
 * Book a session
 * 
 * @param sessionId - Session ID
 * @param bookingData - Booking data
 * @param promoCode - Optional promo code
 * @returns Promise with booked session
 */
export async function bookSession(
  sessionId: string,
  bookingData: BookSessionData,
  promoCode?: string
): Promise<Session> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Authentication required. Please login to book sessions.');
    }

    console.log('📝 [SESSION-API] Booking session:', sessionId);

    const url = promoCode 
      ? `/api/sessions/${sessionId}/book?promoCode=${promoCode}`
      : `/api/sessions/${sessionId}/book`;

    const resp = await tryEndpoints<any>(
      url,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: bookingData,
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [SESSION-API] Session booked successfully');
      return resp.data;
    }

    throw new Error(resp.data.message || 'Failed to book session');
  } catch (error: any) {
    console.error('💥 [SESSION-API] Error booking session:', error);
    throw new Error(error.message || 'Failed to book session');
  }
}

/**
 * Cancel a booking
 * 
 * @param bookingId - Booking ID
 * @param reason - Cancellation reason
 * @returns Promise with cancelled session
 */
export async function cancelBooking(
  bookingId: string,
  reason?: string
): Promise<Session> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    console.log('❌ [SESSION-API] Cancelling booking:', bookingId);

    const resp = await tryEndpoints<any>(
      `/api/sessions/bookings/${bookingId}/cancel`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: { reason },
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [SESSION-API] Booking cancelled successfully');
      return resp.data;
    }

    throw new Error(resp.data.message || 'Failed to cancel booking');
  } catch (error: any) {
    console.error('💥 [SESSION-API] Error cancelling booking:', error);
    throw new Error(error.message || 'Failed to cancel booking');
  }
}

/**
 * Confirm a booking (for creators)
 * 
 * @param bookingId - Booking ID
 * @param meetingLink - Optional meeting link
 * @returns Promise with confirmed session
 */
export async function confirmBooking(
  bookingId: string,
  meetingLink?: string
): Promise<Session> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    console.log('✅ [SESSION-API] Confirming booking:', bookingId);

    const resp = await tryEndpoints<any>(
      `/api/sessions/bookings/${bookingId}/confirm`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: { meeting_link: meetingLink },
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [SESSION-API] Booking confirmed successfully');
      return resp.data;
    }

    throw new Error(resp.data.message || 'Failed to confirm booking');
  } catch (error: any) {
    console.error('💥 [SESSION-API] Error confirming booking:', error);
    throw new Error(error.message || 'Failed to confirm booking');
  }
}

/**
 * Mark session as completed
 * 
 * @param bookingId - Booking ID
 * @param notes - Optional completion notes
 * @returns Promise with completed session
 */
export async function completeSession(
  bookingId: string,
  notes?: string
): Promise<Session> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    console.log('✔️ [SESSION-API] Completing session:', bookingId);

    const resp = await tryEndpoints<any>(
      `/api/sessions/bookings/${bookingId}/complete`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: { notes },
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [SESSION-API] Session completed successfully');
      return resp.data;
    }

    throw new Error(resp.data.message || 'Failed to complete session');
  } catch (error: any) {
    console.error('💥 [SESSION-API] Error completing session:', error);
    throw new Error(error.message || 'Failed to complete session');
  }
}

/**
 * Get user's bookings
 * 
 * @returns Promise with user bookings
 */
export async function getUserBookings(): Promise<SessionBooking[]> {
  try {
    const token = await getAccessToken();
    if (!token) {
      return [];
    }

    console.log('📅 [SESSION-API] Fetching user bookings');

    const resp = await tryEndpoints<any>(
      `/api/sessions/bookings/user`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [SESSION-API] User bookings fetched:', resp.data.bookings?.length || 0);
      return resp.data.bookings || [];
    }

    return [];
  } catch (error: any) {
    console.error('💥 [SESSION-API] Error fetching user bookings:', error);
    return [];
  }
}

/**
 * Get creator's bookings (for session creators)
 * 
 * @returns Promise with creator bookings
 */
export async function getCreatorBookings(): Promise<SessionBooking[]> {
  try {
    const token = await getAccessToken();
    if (!token) {
      return [];
    }

    console.log('📅 [SESSION-API] Fetching creator bookings');

    const resp = await tryEndpoints<any>(
      `/api/sessions/bookings/creator`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [SESSION-API] Creator bookings fetched:', resp.data.bookings?.length || 0);
      return resp.data.bookings || [];
    }

    return [];
  } catch (error: any) {
    console.error('💥 [SESSION-API] Error fetching creator bookings:', error);
    return [];
  }
}

/**
 * Format session duration
 * 
 * @param minutes - Duration in minutes
 * @returns Formatted duration string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  
  if (remainingMins === 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  
  return `${hours}h ${remainingMins}m`;
}

/**
 * Format session price
 * 
 * @param price - Price amount
 * @param currency - Currency code
 * @returns Formatted price string
 */
export function formatSessionPrice(price: number, currency: string = 'USD'): string {
  if (price === 0) return 'Free';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
}

/**
 * Get booking status color
 * 
 * @param status - Booking status
 * @returns Color hex code
 */
export function getBookingStatusColor(status: string): string {
  switch (status) {
    case 'confirmed':
      return '#10b981'; // green
    case 'pending':
      return '#f59e0b'; // orange
    case 'completed':
      return '#8e78fb'; // purple
    case 'cancelled':
      return '#ef4444'; // red
    default:
      return '#666666'; // gray
  }
}

/**
 * Get booking status label
 * 
 * @param status - Booking status
 * @returns Formatted status label
 */
export function getBookingStatusLabel(status: string): string {
  switch (status) {
    case 'pending':
      return 'Pending Confirmation';
    case 'confirmed':
      return 'Confirmed';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
}

/**
 * Check if booking can be cancelled
 * 
 * @param booking - Booking object
 * @returns Boolean indicating if cancellation is allowed
 */
export function canCancelBooking(booking: SessionBooking): boolean {
  // Can't cancel if already completed or cancelled
  if (booking.status === 'completed' || booking.status === 'cancelled') {
    return false;
  }
  
  // Can cancel if it's in the future
  const startTime = new Date(booking.scheduled_at);
  const now = new Date();
  
  return startTime > now;
}

/**
 * Format date and time for session
 * 
 * @param dateString - Date string
 * @returns Formatted date and time
 */
export function formatSessionDateTime(dateString: string): string {
  const date = new Date(dateString);
  
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };
  
  const formattedDate = date.toLocaleDateString('en-US', dateOptions);
  const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
  
  return `${formattedDate} at ${formattedTime}`;
}

/**
 * Get available slots for a session
 * 
 * @param sessionId - Session ID
 * @param startDate - Optional start date filter
 * @param endDate - Optional end date filter
 * @returns Promise with available slots
 */
export async function getAvailableSlots(
  sessionId: string,
  startDate?: string,
  endDate?: string
): Promise<AvailableSlot[]> {
  try {
    console.log('🕐 [SESSION-API] Fetching available slots for session:', sessionId);

    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const resp = await tryEndpoints<any>(
      `/api/sessions/${sessionId}/available-slots?${params.toString()}`,
      {
        method: 'GET',
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [SESSION-API] Available slots fetched:', resp.data.slots?.length || 0);
      return resp.data.slots || [];
    }

    return [];
  } catch (error: any) {
    console.error('💥 [SESSION-API] Error fetching available slots:', error);
    return [];
  }
}

/**
 * Book a specific time slot
 * 
 * @param sessionId - Session ID
 * @param bookSlotData - Slot booking data
 * @returns Promise with booked session
 */
export async function bookSlot(
  sessionId: string,
  bookSlotData: BookSlotData
): Promise<Session> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Authentication required. Please login to book slots.');
    }

    console.log('📝 [SESSION-API] Booking slot for session:', sessionId);

    const resp = await tryEndpoints<any>(
      `/api/sessions/${sessionId}/book-slot`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: bookSlotData,
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [SESSION-API] Slot booked successfully');
      return resp.data;
    }

    throw new Error(resp.data.message || 'Failed to book slot');
  } catch (error: any) {
    console.error('💥 [SESSION-API] Error booking slot:', error);
    throw new Error(error.message || 'Failed to book slot');
  }
}

/**
 * Cancel a booked slot
 * 
 * @param sessionId - Session ID
 * @param slotId - Slot ID
 * @returns Promise with updated session
 */
export async function cancelSlot(
  sessionId: string,
  slotId: string
): Promise<Session> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    console.log('❌ [SESSION-API] Cancelling slot:', slotId);

    const resp = await tryEndpoints<any>(
      `/api/sessions/${sessionId}/cancel-slot/${slotId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [SESSION-API] Slot cancelled successfully');
      return resp.data;
    }

    throw new Error(resp.data.message || 'Failed to cancel slot');
  } catch (error: any) {
    console.error('💥 [SESSION-API] Error cancelling slot:', error);
    throw new Error(error.message || 'Failed to cancel slot');
  }
}

/**
 * Convert API session to component-compatible format
 * 
 * @param apiSession - Session from API
 * @returns Converted session for UI components
 */
export function convertSessionForUI(apiSession: Session): any {
  return {
    id: apiSession.id || apiSession._id,
    title: apiSession.title,
    description: apiSession.description,
    duration: apiSession.duration,
    price: apiSession.price,
    currency: apiSession.currency,
    category: apiSession.category || 'General',
    tags: [], // Add tags if available in backend
    mentor: {
      id: apiSession.creator._id,
      name: apiSession.creator.name,
      avatar: apiSession.creator.avatar,
      title: apiSession.creator.title || 'Mentor',
      role: apiSession.creator.role || 'Mentor',
      rating: apiSession.creator.rating || apiSession.average_rating || 0,
      reviews: apiSession.creator.reviews || apiSession.rating_count || 0,
      bio: apiSession.creator.bio || apiSession.description,
    },
    isActive: apiSession.is_active,
    bookingsCount: apiSession.bookings_count || apiSession.bookings?.length || 0,
    canBookMore: apiSession.can_book_more !== false,
    resources: apiSession.resources || [],
    createdAt: apiSession.created_at,
    updatedAt: apiSession.updated_at,
  };
}

/**
 * Convert API booking to component-compatible format
 * 
 * @param apiBooking - Booking from API
 * @param sessionType - Associated session type
 * @returns Converted booking for UI components
 */
export function convertBookingForUI(apiBooking: SessionBooking, sessionType?: Session): any {
  return {
    id: apiBooking.id || apiBooking._id,
    sessionTypeId: sessionType?.id || sessionType?._id,
    userId: apiBooking.user_id,
    scheduledAt: apiBooking.scheduled_at,
    status: apiBooking.status,
    meetingUrl: apiBooking.meeting_url,
    notes: apiBooking.notes,
    sessionType: sessionType ? convertSessionForUI(sessionType) : undefined,
  };
}
