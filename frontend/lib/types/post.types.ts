/**
 * Post Types
 * TypeScript interfaces for Post API requests and responses
 */

export interface Post {
  _id: string
  content: string
  author: {
    _id: string
    name: string
    email?: string
    avatar?: string
  }
  communityId: string
  community?: {
    _id: string
    name: string
    slug: string
  }
  images?: string[]
  tags?: string[]
  likes: number
  commentsCount: number
  shares?: number
  isLiked?: boolean
  createdAt: string
  updatedAt?: string
}

export interface PostComment {
  _id: string
  content: string
  author: {
    _id: string
    name: string
    avatar?: string
  }
  postId: string
  createdAt: string
  updatedAt?: string
}

export interface PostStats {
  likes: number
  comments: number
  shares: number
  isLiked: boolean
}

export interface PostFilters {
  page?: number
  limit?: number
  communityId?: string
  authorId?: string
  tags?: string[]
  search?: string
}

export interface PostListResponse {
  posts: Post[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CreatePostDto {
  content: string
  communityId: string
  images?: string[]
  tags?: string[]
}

export interface UpdatePostDto {
  content?: string
  images?: string[]
  tags?: string[]
}

export interface CreateCommentDto {
  content: string
}

export interface UpdateCommentDto {
  content: string
}
