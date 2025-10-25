/**
 * Post API Integration
 * 
 * Provides functions to interact with the post endpoints for social features.
 * Handles post creation, comments, likes, bookmarks, and feed management.
 * 
 * @module post-api
 */

import { tryEndpoints } from './http';
import { getAccessToken } from './auth';

// ============================================================================
// TypeScript Interfaces
// ============================================================================

/**
 * Post author information
 */
export interface PostAuthor {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

/**
 * Post comment
 */
export interface PostComment {
  _id: string;
  content: string;
  author: PostAuthor;
  created_at: string;
  updated_at: string;
  likes_count?: number;
}

/**
 * Post attachment
 */
export interface PostAttachment {
  type: 'image' | 'video' | 'document' | 'link';
  url: string;
  thumbnail?: string;
  name?: string;
  size?: number;
}

/**
 * Main post interface
 */
export interface Post {
  _id: string;
  content: string;
  author: PostAuthor;
  community_id?: {
    _id: string;
    name: string;
    slug: string;
  };
  attachments?: PostAttachment[];
  tags?: string[];
  likes_count: number;
  comments_count: number;
  bookmarks_count?: number;
  is_pinned?: boolean;
  is_edited?: boolean;
  created_at: string;
  updated_at: string;
  // User interaction flags
  is_liked?: boolean;
  is_bookmarked?: boolean;
}

/**
 * API response for post list
 */
export interface PostListResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Post filters for browsing
 */
export interface PostFilters {
  page?: number;
  limit?: number;
  communityId?: string;
  authorId?: string;
  tags?: string[];
  search?: string;
}

/**
 * Create post data
 */
export interface CreatePostData {
  content: string;
  community_id: string;
  attachments?: PostAttachment[];
  tags?: string[];
}

/**
 * Update post data
 */
export interface UpdatePostData {
  content?: string;
  attachments?: PostAttachment[];
  tags?: string[];
}

/**
 * Post statistics
 */
export interface PostStats {
  likes_count: number;
  comments_count: number;
  bookmarks_count: number;
  is_liked: boolean;
  is_bookmarked: boolean;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get posts with filters (for feed)
 * 
 * @param filters - Filter options for posts
 * @returns Promise with post list response
 */
export async function getPosts(filters: PostFilters = {}): Promise<PostListResponse> {
  try {
    console.log('📝 [POST-API] Fetching posts with filters:', filters);

    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.communityId) params.append('communityId', filters.communityId);
    if (filters.authorId) params.append('authorId', filters.authorId);
    if (filters.tags) params.append('tags', filters.tags.join(','));
    if (filters.search) params.append('search', filters.search);

    const resp = await tryEndpoints<any>(
      `/api/posts?${params.toString()}`,
      {
        method: 'GET',
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [POST-API] Posts fetched successfully:', resp.data.data?.posts?.length || 0);
      return {
        posts: resp.data.data?.posts || [],
        total: resp.data.data?.total || 0,
        page: resp.data.data?.page || 1,
        limit: resp.data.data?.limit || 10,
        totalPages: resp.data.data?.totalPages || 1,
      };
    }

    throw new Error(resp.data.message || 'Failed to fetch posts');
  } catch (error: any) {
    console.error('💥 [POST-API] Error fetching posts:', error);
    throw new Error(error.message || 'Failed to fetch posts');
  }
}

/**
 * Get post by ID
 * 
 * @param postId - Post ID
 * @returns Promise with post details
 */
export async function getPostById(postId: string): Promise<Post> {
  try {
    console.log('📝 [POST-API] Fetching post details:', postId);

    const resp = await tryEndpoints<any>(
      `/api/posts/${postId}`,
      {
        method: 'GET',
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [POST-API] Post details fetched');
      return resp.data.data;
    }

    throw new Error(resp.data.message || 'Failed to fetch post');
  } catch (error: any) {
    console.error('💥 [POST-API] Error fetching post:', error);
    throw new Error(error.message || 'Failed to fetch post details');
  }
}

/**
 * Get posts by community
 * 
 * @param communityId - Community ID
 * @param filters - Additional filters
 * @returns Promise with post list
 */
export async function getPostsByCommunity(
  communityId: string,
  filters: Omit<PostFilters, 'communityId'> = {}
): Promise<PostListResponse> {
  try {
    console.log('📝 [POST-API] Fetching posts for community:', communityId);

    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const resp = await tryEndpoints<any>(
      `/api/posts/community/${communityId}?${params.toString()}`,
      {
        method: 'GET',
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [POST-API] Community posts fetched:', resp.data.data?.posts?.length || 0);
      return {
        posts: resp.data.data?.posts || [],
        total: resp.data.data?.total || 0,
        page: resp.data.data?.page || 1,
        limit: resp.data.data?.limit || 10,
        totalPages: resp.data.data?.totalPages || 1,
      };
    }

    throw new Error(resp.data.message || 'Failed to fetch community posts');
  } catch (error: any) {
    console.error('💥 [POST-API] Error fetching community posts:', error);
    throw new Error(error.message || 'Failed to fetch community posts');
  }
}

/**
 * Get posts by user
 * 
 * @param userId - User ID
 * @param page - Page number
 * @param limit - Items per page
 * @returns Promise with post list
 */
export async function getPostsByUser(
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<PostListResponse> {
  try {
    console.log('📝 [POST-API] Fetching posts for user:', userId);

    const resp = await tryEndpoints<any>(
      `/api/posts/user/${userId}?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [POST-API] User posts fetched:', resp.data.data?.posts?.length || 0);
      return {
        posts: resp.data.data?.posts || [],
        total: resp.data.data?.total || 0,
        page: resp.data.data?.page || 1,
        limit: resp.data.data?.limit || 10,
        totalPages: resp.data.data?.totalPages || 1,
      };
    }

    throw new Error(resp.data.message || 'Failed to fetch user posts');
  } catch (error: any) {
    console.error('💥 [POST-API] Error fetching user posts:', error);
    throw new Error(error.message || 'Failed to fetch user posts');
  }
}

/**
 * Create a new post
 * 
 * @param postData - Post data
 * @returns Promise with created post
 */
export async function createPost(postData: CreatePostData): Promise<Post> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Authentication required. Please login to create posts.');
    }

    console.log('✍️ [POST-API] Creating post');

    const resp = await tryEndpoints<any>(
      `/api/posts`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: postData,
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [POST-API] Post created successfully');
      return resp.data.data;
    }

    throw new Error(resp.data.message || 'Failed to create post');
  } catch (error: any) {
    console.error('💥 [POST-API] Error creating post:', error);
    throw new Error(error.message || 'Failed to create post');
  }
}

/**
 * Update a post
 * 
 * @param postId - Post ID
 * @param postData - Updated post data
 * @returns Promise with updated post
 */
export async function updatePost(postId: string, postData: UpdatePostData): Promise<Post> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    console.log('✏️ [POST-API] Updating post:', postId);

    const resp = await tryEndpoints<any>(
      `/api/posts/${postId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: postData,
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [POST-API] Post updated successfully');
      return resp.data.data;
    }

    throw new Error(resp.data.message || 'Failed to update post');
  } catch (error: any) {
    console.error('💥 [POST-API] Error updating post:', error);
    throw new Error(error.message || 'Failed to update post');
  }
}

/**
 * Delete a post
 * 
 * @param postId - Post ID
 * @returns Promise with success status
 */
export async function deletePost(postId: string): Promise<{ success: boolean; message: string }> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    console.log('🗑️ [POST-API] Deleting post:', postId);

    const resp = await tryEndpoints<any>(
      `/api/posts/${postId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [POST-API] Post deleted successfully');
      return { success: true, message: 'Post deleted successfully' };
    }

    throw new Error(resp.data.message || 'Failed to delete post');
  } catch (error: any) {
    console.error('💥 [POST-API] Error deleting post:', error);
    throw new Error(error.message || 'Failed to delete post');
  }
}

/**
 * Like a post
 * 
 * @param postId - Post ID
 * @returns Promise with updated stats
 */
export async function likePost(postId: string): Promise<PostStats> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    console.log('❤️ [POST-API] Liking post:', postId);

    const resp = await tryEndpoints<any>(
      `/api/posts/${postId}/like`,
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
      console.log('✅ [POST-API] Post liked');
      return resp.data.data;
    }

    throw new Error(resp.data.message || 'Failed to like post');
  } catch (error: any) {
    console.error('💥 [POST-API] Error liking post:', error);
    throw new Error(error.message || 'Failed to like post');
  }
}

/**
 * Unlike a post
 * 
 * @param postId - Post ID
 * @returns Promise with updated stats
 */
export async function unlikePost(postId: string): Promise<PostStats> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    console.log('💔 [POST-API] Unliking post:', postId);

    const resp = await tryEndpoints<any>(
      `/api/posts/${postId}/unlike`,
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
      console.log('✅ [POST-API] Post unliked');
      return resp.data.data;
    }

    throw new Error(resp.data.message || 'Failed to unlike post');
  } catch (error: any) {
    console.error('💥 [POST-API] Error unliking post:', error);
    throw new Error(error.message || 'Failed to unlike post');
  }
}

/**
 * Add comment to a post
 * 
 * @param postId - Post ID
 * @param content - Comment content
 * @returns Promise with created comment
 */
export async function addComment(postId: string, content: string): Promise<PostComment> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    console.log('💬 [POST-API] Adding comment to post:', postId);

    const resp = await tryEndpoints<any>(
      `/api/posts/${postId}/comments`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: { content },
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [POST-API] Comment added');
      return resp.data.data;
    }

    throw new Error(resp.data.message || 'Failed to add comment');
  } catch (error: any) {
    console.error('💥 [POST-API] Error adding comment:', error);
    throw new Error(error.message || 'Failed to add comment');
  }
}

/**
 * Delete a comment
 * 
 * @param postId - Post ID
 * @param commentId - Comment ID
 * @returns Promise with success status
 */
export async function deleteComment(
  postId: string,
  commentId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    console.log('🗑️ [POST-API] Deleting comment:', commentId);

    const resp = await tryEndpoints<any>(
      `/api/posts/${postId}/comments/${commentId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [POST-API] Comment deleted');
      return { success: true, message: 'Comment deleted successfully' };
    }

    throw new Error(resp.data.message || 'Failed to delete comment');
  } catch (error: any) {
    console.error('💥 [POST-API] Error deleting comment:', error);
    throw new Error(error.message || 'Failed to delete comment');
  }
}

/**
 * Bookmark a post
 * 
 * @param postId - Post ID
 * @returns Promise with success status
 */
export async function bookmarkPost(postId: string): Promise<{ success: boolean; message: string }> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    console.log('🔖 [POST-API] Bookmarking post:', postId);

    const resp = await tryEndpoints<any>(
      `/api/posts/${postId}/bookmark`,
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
      console.log('✅ [POST-API] Post bookmarked');
      return { success: true, message: 'Post bookmarked successfully' };
    }

    throw new Error(resp.data.message || 'Failed to bookmark post');
  } catch (error: any) {
    console.error('💥 [POST-API] Error bookmarking post:', error);
    throw new Error(error.message || 'Failed to bookmark post');
  }
}

/**
 * Remove bookmark from a post
 * 
 * @param postId - Post ID
 * @returns Promise with success status
 */
export async function unbookmarkPost(postId: string): Promise<{ success: boolean; message: string }> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    console.log('🔖 [POST-API] Removing bookmark:', postId);

    const resp = await tryEndpoints<any>(
      `/api/posts/${postId}/bookmark`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [POST-API] Bookmark removed');
      return { success: true, message: 'Bookmark removed successfully' };
    }

    throw new Error(resp.data.message || 'Failed to remove bookmark');
  } catch (error: any) {
    console.error('💥 [POST-API] Error removing bookmark:', error);
    throw new Error(error.message || 'Failed to remove bookmark');
  }
}

/**
 * Get user's bookmarked posts
 * 
 * @param page - Page number
 * @param limit - Items per page
 * @returns Promise with bookmarked posts
 */
export async function getBookmarkedPosts(
  page: number = 1,
  limit: number = 10
): Promise<PostListResponse> {
  try {
    const token = await getAccessToken();
    if (!token) {
      return { posts: [], total: 0, page: 1, limit: 10, totalPages: 0 };
    }

    console.log('🔖 [POST-API] Fetching bookmarked posts');

    const resp = await tryEndpoints<any>(
      `/api/posts/user/bookmarks?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [POST-API] Bookmarked posts fetched:', resp.data.data?.posts?.length || 0);
      return {
        posts: resp.data.data?.posts || [],
        total: resp.data.data?.total || 0,
        page: resp.data.data?.page || 1,
        limit: resp.data.data?.limit || 10,
        totalPages: resp.data.data?.totalPages || 1,
      };
    }

    return { posts: [], total: 0, page: 1, limit: 10, totalPages: 0 };
  } catch (error: any) {
    console.error('💥 [POST-API] Error fetching bookmarked posts:', error);
    return { posts: [], total: 0, page: 1, limit: 10, totalPages: 0 };
  }
}

/**
 * Format time ago string
 * 
 * @param dateString - Date string
 * @returns Formatted time ago string
 */
export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
