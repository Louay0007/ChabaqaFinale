/**
 * Session Types
 * TypeScript interfaces for Session API requests and responses
 */

export interface Session {
  _id: string
  title: string
  description: string
  duration: number
  price: number
  currency: string
  communityId: string
  creatorId: string
  creator?: {
    _id: string
    name: string
    avatar?: string
  }
  isActive: boolean
  category: string
  maxBookingsPerWeek?: number
  bookings?: SessionBooking[]
  availableHours?: AvailableHours[]
  createdAt: string
  updatedAt?: string
}

export interface SessionBooking {
  _id: string
  sessionId: string
  userId: string
  user?: {
    _id: string
    name: string
    avatar?: string
  }
  scheduledAt: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  meetingUrl?: string
  notes?: string
  createdAt: string
}

export interface AvailableHours {
  dayOfWeek: number
  startTime: string
  endTime: string
}

export interface AvailableSlot {
  _id?: string
  startTime: string
  endTime: string
  isBooked: boolean
  bookingId?: string
}

export interface SessionFilters {
  page?: number
  limit?: number
  communitySlug?: string
  category?: string
}

export interface SessionListResponse {
  sessions: Session[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CreateSessionDto {
  title: string
  description: string
  duration: number
  price: number
  currency: string
  communitySlug: string
  category: string
  maxBookingsPerWeek?: number
}

export interface UpdateSessionDto {
  title?: string
  description?: string
  duration?: number
  price?: number
  category?: string
  maxBookingsPerWeek?: number
}

export interface BookSessionDto {
  sessionId: string
  scheduledAt: string
  notes?: string
  promoCode?: string
}

export interface BookSlotDto {
  slotId: string
  notes?: string
}
