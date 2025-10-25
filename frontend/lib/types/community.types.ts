/**
 * Community Types
 * TypeScript interfaces for Community API requests and responses
 */

export interface Community {
  _id: string
  slug: string
  name: string
  logo?: string
  photo_de_couverture?: string
  coverImage?: string
  shortDescription?: string
  short_description?: string
  longDescription?: string
  long_description?: string
  createur: {
    _id: string
    name: string
    email?: string
    avatar?: string
    bio?: string
  }
  creator?: {
    id: string
    name: string
    email?: string
    avatar?: string
    bio?: string
  }
  category?: string
  priceType?: "free" | "paid" | "monthly" | "yearly"
  price?: number
  fees_of_join?: number
  currency?: string
  membersCount: number
  members?: any[]
  admins?: any[]
  averageRating?: number
  ratingCount?: number
  tags?: string[]
  featured?: boolean
  isVerified?: boolean
  isPrivate?: boolean
  isActive?: boolean
  rank?: number | string
  socialLinks?: {
    website?: string
    twitter?: string
    linkedin?: string
    facebook?: string
    instagram?: string
  }
  createdAt: string
  updatedAt?: string
}

export interface CommunityFilters {
  search?: string
  category?: string
  type?: "community" | "course" | "challenge" | "product" | "oneToOne"
  priceType?: "free" | "paid" | "monthly" | "yearly" | "hourly"
  minMembers?: number
  sortBy?: "popular" | "newest" | "members" | "rating" | "price-low" | "price-high"
  page?: number
  limit?: number
  featured?: boolean
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface CommunitiesResponse {
  communities: Community[]
  pagination: PaginationMeta
}

export interface GlobalStats {
  totalCommunities: number
  totalMembers: number
  totalCourses: number
  totalChallenges: number
  totalProducts: number
  totalOneToOneSessions: number
  totalRevenue: number
  averageRating: number
}

export interface Category {
  name: string
  count: number
  icon?: string
  color?: string
}

export interface CommunityPost {
  id: string
  title?: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  likes: number
  comments: number
  createdAt: string
}

export interface CommunityPostsResponse {
  posts: CommunityPost[]
  pagination: PaginationMeta
}

export interface SearchSuggestion {
  type: "community" | "category" | "creator"
  text: string
  slug: string
}

export interface CreateCommunityDto {
  name: string
  short_description: string
  long_description?: string
  category?: string
  fees_of_join?: number
  isPrivate?: boolean
  tags?: string[]
  socialLinks?: {
    website?: string
    twitter?: string
    linkedin?: string
  }
}

export interface JoinCommunityDto {
  communityId: string
}

export interface LeaveCommunityDto {
  communityId: string
}
