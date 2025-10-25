/**
 * Post Service
 * Handles all post-related API calls
 */

import { httpClient } from "./http-client"
import type {
  Post,
  PostComment,
  PostStats,
  PostFilters,
  PostListResponse,
  CreatePostDto,
  UpdatePostDto,
  CreateCommentDto,
} from "../types/post.types"

class PostService {
  private static instance: PostService

  static getInstance(): PostService {
    if (!PostService.instance) {
      PostService.instance = new PostService()
    }
    return PostService.instance
  }

  /**
   * Get posts list with filters and pagination
   * GET /posts
   */
  async getPosts(filters?: PostFilters): Promise<PostListResponse> {
    const response = await httpClient.get<any>("/api/posts", filters)
    // Backend returns { success: true, data: { posts, pagination } }
    return response.data || response
  }

  /**
   * Get posts by user
   * GET /posts/user/:userId
   */
  async getPostsByUser(userId: string, page?: number, limit?: number): Promise<PostListResponse> {
    const response = await httpClient.get<any>(`/api/posts/user/${userId}`, { page, limit })
    return response.data || response
  }

  /**
   * Get posts by community
   * GET /posts/community/:communityId
   */
  async getPostsByCommunity(
    communityId: string,
    page?: number,
    limit?: number
  ): Promise<PostListResponse> {
    const response = await httpClient.get<any>(`/api/posts/community/${communityId}`, {
      page,
      limit,
    })
    return response.data || response
  }

  /**
   * Get single post by ID
   * GET /posts/:id
   */
  async getPostById(id: string): Promise<Post> {
    const response = await httpClient.get<any>(`/api/posts/${id}`)
    return response.data || response
  }

  /**
   * Create a new post
   * POST /posts
   */
  async createPost(data: CreatePostDto): Promise<Post> {
    const response = await httpClient.post<any>("/api/posts", data)
    return response.data || response
  }

  /**
   * Update a post
   * PATCH /posts/:id
   */
  async updatePost(id: string, data: UpdatePostDto): Promise<Post> {
    const response = await httpClient.patch<any>(`/api/posts/${id}`, data)
    return response.data || response
  }

  /**
   * Delete a post
   * DELETE /posts/:id
   */
  async deletePost(id: string): Promise<{ message: string }> {
    const response = await httpClient.delete<any>(`/api/posts/${id}`)
    return response.data || response
  }

  /**
   * Add comment to post
   * POST /posts/:id/comments
   */
  async addComment(postId: string, data: CreateCommentDto): Promise<PostComment> {
    const response = await httpClient.post<any>(`/api/posts/${postId}/comments`, data)
    return response.data || response
  }

  /**
   * Update comment
   * PATCH /posts/:id/comments/:commentId
   */
  async updateComment(
    postId: string,
    commentId: string,
    content: string
  ): Promise<PostComment> {
    const response = await httpClient.patch<any>(
      `/api/posts/${postId}/comments/${commentId}`,
      { content }
    )
    return response.data || response
  }

  /**
   * Delete comment
   * DELETE /posts/:id/comments/:commentId
   */
  async deleteComment(postId: string, commentId: string): Promise<{ message: string }> {
    const response = await httpClient.delete<any>(`/api/posts/${postId}/comments/${commentId}`)
    return response.data || response
  }

  /**
   * Like a post
   * POST /posts/:id/like
   */
  async likePost(postId: string): Promise<PostStats> {
    const response = await httpClient.post<any>(`/api/posts/${postId}/like`)
    return response.data || response
  }

  /**
   * Unlike a post
   * POST /posts/:id/unlike
   */
  async unlikePost(postId: string): Promise<PostStats> {
    const response = await httpClient.post<any>(`/api/posts/${postId}/unlike`)
    return response.data || response
  }

  /**
   * Dislike a post
   * POST /posts/:id/dislike
   */
  async dislikePost(postId: string): Promise<PostStats> {
    const response = await httpClient.post<any>(`/api/posts/${postId}/dislike`)
    return response.data || response
  }

  /**
   * Get creator's posts
   * GET /posts (filtered by author)
   */
  async getMyPosts(page?: number, limit?: number): Promise<PostListResponse> {
    const response = await httpClient.get<any>("/api/posts", {
      page,
      limit,
      // Backend will filter by authenticated user
    })
    return response.data || response
  }

  /**
   * Get post statistics
   * GET /posts/:id/stats
   */
  async getPostStats(postId: string, userId?: string): Promise<PostStats> {
    const response = await httpClient.get<any>(`/api/posts/${postId}/stats`, { userId })
    return response.data || response
  }
}

export const postService = PostService.getInstance()
