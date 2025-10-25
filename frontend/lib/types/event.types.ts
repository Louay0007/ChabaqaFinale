/**
 * Event Types
 * TypeScript interfaces for Event API requests and responses
 */

export interface Event {
  _id: string
  title: string
  description: string
  image?: string
  startDate: string
  endDate?: string
  startTime: string
  endTime: string
  timezone: string
  location: string
  onlineUrl?: string
  category: string
  type: "Online" | "In-person" | "Hybrid"
  communityId: string
  creatorId: string
  creator?: {
    _id: string
    name: string
    avatar?: string
  }
  isPublished: boolean
  isActive: boolean
  sessions?: EventSession[]
  tickets?: EventTicket[]
  speakers?: EventSpeaker[]
  attendees?: string[]
  attendeesCount?: number
  createdAt: string
  updatedAt?: string
}

export interface EventSession {
  _id: string
  title: string
  description?: string
  startTime: string
  endTime: string
  speaker?: string
  attendance?: number
  isActive: boolean
}

export interface EventTicket {
  _id: string
  type: string
  name: string
  price: number
  description?: string
  quantity?: number
  sold: number
}

export interface EventSpeaker {
  _id: string
  name: string
  title: string
  bio?: string
  photo?: string
}

export interface EventFilters {
  page?: number
  limit?: number
  communityId?: string
  category?: string
  type?: string
}

export interface EventListResponse {
  events: Event[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CreateEventDto {
  title: string
  description: string
  startDate: string
  endDate?: string
  startTime: string
  endTime: string
  timezone: string
  location: string
  onlineUrl?: string
  category: string
  type: "Online" | "In-person" | "Hybrid"
  communityId: string
}

export interface UpdateEventDto {
  title?: string
  description?: string
  startDate?: string
  endDate?: string
  startTime?: string
  endTime?: string
  location?: string
  onlineUrl?: string
  category?: string
  type?: "Online" | "In-person" | "Hybrid"
}
