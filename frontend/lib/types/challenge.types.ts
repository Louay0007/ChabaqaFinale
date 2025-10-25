/**
 * Challenge Types
 * TypeScript interfaces for Challenge API requests and responses
 */

export interface Challenge {
  _id: string
  title: string
  description: string
  communitySlug: string
  community?: {
    _id: string
    name: string
    slug: string
  }
  creatorId: string
  creator?: {
    _id: string
    name: string
    email?: string
    avatar?: string
  }
  startDate: string
  endDate: string
  isActive: boolean
  category?: string
  difficulty?: string
  duration?: string
  thumbnail?: string
  maxParticipants?: number
  depositAmount?: number
  completionReward?: number
  topPerformerBonus?: number
  streakBonus?: number
  isPaid?: boolean
  pricing?: ChallengePricing
  participants?: ChallengeParticipant[]
  participantsCount?: number
  tasks?: ChallengeTask[]
  createdAt: string
  updatedAt?: string
}

export interface ChallengeTask {
  _id: string
  challengeId: string
  day: number
  title: string
  description: string
  deliverable?: string
  isCompleted?: boolean
  points?: number
  order?: number
}

export interface ChallengeParticipant {
  _id: string
  userId: string
  user?: {
    _id: string
    name: string
    avatar?: string
  }
  challengeId: string
  joinedAt: string
  progress: number
  completedTasks?: string[]
  isActive: boolean
}

export interface ChallengePricing {
  basePrice?: number
  currency?: string
  earlyBirdDiscount?: number
  earlyBirdDeadline?: string
  groupDiscount?: number
  promoCode?: string
  promoDiscount?: number
}

export interface ChallengeFilters {
  page?: number
  limit?: number
  communitySlug?: string
  category?: string
  difficulty?: string
  isActive?: boolean
}

export interface ChallengeListResponse {
  challenges: Challenge[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CreateChallengeDto {
  title: string
  description: string
  communitySlug: string
  startDate: string
  endDate: string
  category?: string
  difficulty?: string
  duration?: string
  maxParticipants?: number
  depositAmount?: number
  completionReward?: number
  tasks?: CreateChallengeTaskDto[]
}

export interface UpdateChallengeDto {
  title?: string
  description?: string
  startDate?: string
  endDate?: string
  category?: string
  difficulty?: string
  duration?: string
  maxParticipants?: number
  isActive?: boolean
}

export interface CreateChallengeTaskDto {
  day: number
  title: string
  description: string
  deliverable?: string
  points?: number
}

export interface JoinChallengeDto {
  challengeId: string
  promoCode?: string
}

export interface LeaveChallengeDto {
  challengeId: string
}

export interface UpdateProgressDto {
  challengeId: string
  taskId: string
  isCompleted: boolean
  progress?: number
}

export interface ChallengeAccessResponse {
  hasAccess: boolean
  isParticipant: boolean
  requiresPayment: boolean
  message?: string
}

export interface ChallengePriceCalculation {
  basePrice: number
  discount: number
  finalPrice: number
  currency: string
  discountReason?: string
}
