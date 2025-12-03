/**
 * Course API Integration
 * 
 * Provides functions to interact with the course endpoints for regular users.
 * Handles course browsing, enrollment, progress tracking, and chapter management.
 * 
 * @module course-api
 */

import { tryEndpoints } from './http';
import { getAccessToken } from './auth';

// ============================================================================
// TypeScript Interfaces
// ============================================================================

/**
 * Course creator information
 */
export interface CourseCreator {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
}

/**
 * Course chapter information
 */
export interface CourseChapter {
  _id: string;
  title: string;
  description?: string;
  content_type: 'video' | 'text' | 'quiz' | 'assignment';
  video_url?: string;
  text_content?: string;
  duration?: number; // in seconds
  order: number;
  is_preview: boolean;
  resources?: Array<{
    title: string;
    url: string;
    type: 'pdf' | 'link' | 'file';
  }>;
}

/**
 * Course section (contains chapters)
 */
export interface CourseSection {
  _id: string;
  title: string;
  description?: string;
  order: number;
  chapters: CourseChapter[];
}

/**
 * Main course interface
 */
export interface Course {
  _id: string;
  title: string;
  description: string;
  short_description?: string;
  thumbnail?: string;
  cover_image?: string;
  category?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  price: number;
  currency: string;
  is_published: boolean;
  created_by: CourseCreator;
  community_id?: {
    _id: string;
    name: string;
    slug: string;
  };
  sections: CourseSection[];
  learning_objectives?: string[];
  requirements?: string[];
  tags?: string[];
  enrollment_count?: number;
  rating?: number;
  reviews_count?: number;
  total_duration?: number;
  created_at: string;
  updated_at: string;
}

/**
 * User course enrollment
 */
export interface CourseEnrollment {
  _id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  last_accessed_at?: string;
  completion_percentage: number;
  is_completed: boolean;
  completed_at?: string;
  certificate_url?: string;
}

/**
 * Chapter progress tracking
 */
export interface ChapterProgress {
  chapter_id: string;
  is_started: boolean;
  is_completed: boolean;
  watch_time: number; // seconds watched
  last_position: number; // last playback position
  started_at?: string;
  completed_at?: string;
}

/**
 * Complete course progress
 */
export interface CourseProgress {
  enrollment: CourseEnrollment;
  chapters_progress: ChapterProgress[];
  completed_chapters_count: number;
  total_chapters_count: number;
  current_chapter?: {
    section_id: string;
    chapter_id: string;
  };
}

/**
 * API response for course list
 */
export interface CourseListResponse {
  courses: Course[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Course filters for browsing
 */
export interface CourseFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  communityId?: string;
  is_free?: boolean;
  sort_by?: 'popular' | 'newest' | 'rating' | 'price_low' | 'price_high';
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get courses with filters (for browsing)
 * 
 * @param filters - Filter options for courses
 * @returns Promise with course list response
 */
export async function getCourses(filters: CourseFilters = {}): Promise<CourseListResponse> {
  try {
    console.log('📚 [COURSE-API] Fetching courses with filters:', filters);

    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.level) params.append('level', filters.level);
    if (filters.communityId) params.append('communityId', filters.communityId);
    if (filters.is_free !== undefined) params.append('isFree', filters.is_free.toString());
    if (filters.sort_by) params.append('sortBy', filters.sort_by);

    const resp = await tryEndpoints<any>(
      `/api/cours?${params.toString()}`,
      {
        method: 'GET',
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [COURSE-API] Courses fetched successfully:', resp.data.courses?.length || 0);
      return {
        courses: resp.data.courses || [],
        total: resp.data.total || 0,
        page: resp.data.page || 1,
        limit: resp.data.limit || 10,
        totalPages: resp.data.totalPages || 1,
      };
    }

    throw new Error(resp.data.message || 'Failed to fetch courses');
  } catch (error: any) {
    console.error('💥 [COURSE-API] Error fetching courses:', error);
    throw new Error(error.message || 'Failed to fetch courses');
  }
}

/**
 * Get course by ID (detailed view)
 * 
 * @param courseId - Course ID
 * @returns Promise with course details
 */
export async function getCourseById(courseId: string): Promise<Course> {
  try {
    console.log('📚 [COURSE-API] Fetching course details:', courseId);

    const token = await getAccessToken();
    const headers: any = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const resp = await tryEndpoints<any>(
      `/api/cours/${courseId}`,
      {
        method: 'GET',
        headers,
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [COURSE-API] Course details fetched:', resp.data.course?.title);
      return resp.data.course || resp.data;
    }

    throw new Error(resp.data.message || 'Failed to fetch course');
  } catch (error: any) {
    console.error('💥 [COURSE-API] Error fetching course:', error);
    throw new Error(error.message || 'Failed to fetch course details');
  }
}

/**
 * Enroll in a course
 * 
 * @param courseId - Course ID to enroll in
 * @returns Promise with enrollment data
 */
export async function enrollInCourse(courseId: string): Promise<CourseEnrollment> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Authentication required. Please login to enroll.');
    }

    console.log('📝 [COURSE-API] Enrolling in course:', courseId);

    const resp = await tryEndpoints<any>(
      `/api/cours/${courseId}/enroll`,
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
      console.log('✅ [COURSE-API] Enrollment successful');
      return resp.data.enrollment || resp.data;
    }

    throw new Error(resp.data.message || 'Failed to enroll in course');
  } catch (error: any) {
    console.error('💥 [COURSE-API] Error enrolling in course:', error);
    throw new Error(error.message || 'Failed to enroll in course');
  }
}

/**
 * Get user's course progress
 * 
 * @param courseId - Course ID
 * @returns Promise with progress data
 */
export async function getCourseProgress(courseId: string): Promise<CourseProgress> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    console.log('📊 [COURSE-API] Fetching course progress:', courseId);

    const resp = await tryEndpoints<any>(
      `/api/course-enrollment/${courseId}/progress`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [COURSE-API] Progress fetched:', resp.data);
      return resp.data;
    }

    throw new Error(resp.data.message || 'Failed to fetch progress');
  } catch (error: any) {
    console.error('💥 [COURSE-API] Error fetching progress:', error);
    throw new Error(error.message || 'Failed to fetch course progress');
  }
}

/**
 * Start a chapter (track when user begins watching)
 * 
 * @param courseId - Course ID
 * @param sectionId - Section ID
 * @param chapterId - Chapter ID
 * @returns Promise with updated progress
 */
export async function startChapter(
  courseId: string,
  sectionId: string,
  chapterId: string
): Promise<any> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    console.log('▶️ [COURSE-API] Starting chapter:', { courseId, sectionId, chapterId });

    const resp = await tryEndpoints<any>(
      `/api/course-enrollment/${courseId}/sections/${sectionId}/chapters/${chapterId}/start`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: {
          startedAt: new Date().toISOString(),
        },
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [COURSE-API] Chapter started successfully');
      return resp.data;
    }

    throw new Error(resp.data.message || 'Failed to start chapter');
  } catch (error: any) {
    console.error('💥 [COURSE-API] Error starting chapter:', error);
    throw new Error(error.message || 'Failed to start chapter');
  }
}

/**
 * Mark chapter as completed
 * 
 * @param courseId - Course ID
 * @param chapterId - Chapter ID
 * @returns Promise with updated progress
 */
export async function completeChapter(
  courseId: string,
  chapterId: string
): Promise<any> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    console.log('✅ [COURSE-API] Completing chapter:', { courseId, chapterId });

    const resp = await tryEndpoints<any>(
      `/api/course-enrollment/${courseId}/chapters/${chapterId}/complete`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [COURSE-API] Chapter completed successfully');
      return resp.data;
    }

    throw new Error(resp.data.message || 'Failed to complete chapter');
  } catch (error: any) {
    console.error('💥 [COURSE-API] Error completing chapter:', error);
    throw new Error(error.message || 'Failed to complete chapter');
  }
}

/**
 * Update watch time for a chapter (for video progress tracking)
 * 
 * @param courseId - Course ID
 * @param chapterId - Chapter ID
 * @param watchTime - Time watched in seconds
 * @returns Promise with updated progress
 */
export async function updateWatchTime(
  courseId: string,
  chapterId: string,
  watchTime: number
): Promise<any> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    console.log('⏱️ [COURSE-API] Updating watch time:', { courseId, chapterId, watchTime });

    const resp = await tryEndpoints<any>(
      `/api/course-enrollment/${courseId}/chapters/${chapterId}/watch-time`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: {
          watchTime,
        },
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [COURSE-API] Watch time updated');
      return resp.data;
    }

    throw new Error(resp.data.message || 'Failed to update watch time');
  } catch (error: any) {
    console.error('💥 [COURSE-API] Error updating watch time:', error);
    // Don't throw error for watch time updates - fail silently
    return null;
  }
}

/**
 * Get user's enrolled courses
 * 
 * @returns Promise with list of enrolled courses
 */
export async function getMyEnrolledCourses(): Promise<Course[]> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    console.log('📚 [COURSE-API] Fetching enrolled courses');

    const resp = await tryEndpoints<any>(
      `/api/course-enrollment/my-courses`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [COURSE-API] Enrolled courses fetched:', resp.data.courses?.length || 0);
      return resp.data.courses || [];
    }

    throw new Error(resp.data.message || 'Failed to fetch enrolled courses');
  } catch (error: any) {
    console.error('💥 [COURSE-API] Error fetching enrolled courses:', error);
    // Return empty array instead of throwing for better UX
    return [];
  }
}

/**
 * Check if user is enrolled in a course
 * 
 * @param courseId - Course ID
 * @returns Promise with boolean enrollment status
 */
export async function isEnrolledInCourse(courseId: string): Promise<boolean> {
  try {
    const token = await getAccessToken();
    if (!token) {
      return false;
    }

    const progress = await getCourseProgress(courseId);
    return !!progress.enrollment;
  } catch (error) {
    return false;
  }
}

/**
 * Get courses by community
 * 
 * @param communityId - Community ID
 * @param filters - Additional filters
 * @returns Promise with course list
 */
export async function getCoursesByCommunity(
  communityId: string,
  filters: Omit<CourseFilters, 'communityId'> = {}
): Promise<CourseListResponse> {
  return getCourses({
    ...filters,
    communityId,
  });
}

/**
 * Format course duration to readable string
 * 
 * @param seconds - Duration in seconds
 * @returns Formatted duration string
 */
export function formatCourseDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

/**
 * Get user's enrolled courses (using backend endpoint)
 * 
 * @returns Promise with list of enrolled courses with progress
 */
export async function getUserEnrolledCourses(): Promise<any[]> {
  try {
    const token = await getAccessToken();
    if (!token) {
      return [];
    }

    console.log('📚 [COURSE-API] Fetching user enrolled courses');

    const resp = await tryEndpoints<any>(
      `/api/cours/user/mes-cours`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [COURSE-API] User enrolled courses fetched:', resp.data.data?.courses?.length || 0);
      return resp.data.data?.courses || [];
    }

    return [];
  } catch (error: any) {
    console.error('💥 [COURSE-API] Error fetching user enrolled courses:', error);
    return [];
  }
}

/**
 * Get courses by community slug (using correct backend endpoint)
 * 
 * @param communitySlug - Community slug
 * @param filters - Additional filters
 * @returns Promise with course list
 */
export async function getCoursesByCommunitySlug(
  communitySlug: string,
  filters: { page?: number; limit?: number; published?: boolean } = {}
): Promise<any> {
  try {
    console.log('📚 [COURSE-API] Fetching courses for community:', communitySlug);
    console.log('📚 [COURSE-API] Filters:', filters);

    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.published !== undefined) params.append('published', filters.published.toString());

    const endpoint = `/api/cours/community/${communitySlug}?${params.toString()}`;
    console.log('📚 [COURSE-API] Calling endpoint:', endpoint);

    const resp = await tryEndpoints<any>(
      endpoint,
      {
        method: 'GET',
        timeout: 30000,
      }
    );

    console.log('📦 [COURSE-API] Response status:', resp.status);
    console.log('📦 [COURSE-API] Response data:', JSON.stringify(resp.data, null, 2));

    if (resp.status >= 200 && resp.status < 300) {
      const result = resp.data.data || resp.data;
      console.log('✅ [COURSE-API] Processed result:', result);
      console.log('✅ [COURSE-API] Courses count:', result.courses?.length || 0);

      if (result.courses && result.courses.length > 0) {
        console.log('📚 [COURSE-API] First course:', result.courses[0]);
      }

      return result;
    }

    throw new Error(resp.data.message || 'Failed to fetch community courses');
  } catch (error: any) {
    console.error('💥 [COURSE-API] Error fetching community courses:', error);
    console.error('💥 [COURSE-API] Error details:', error.message);
    throw new Error(error.message || 'Failed to fetch community courses');
  }
}

/**
 * Calculate course progress percentage
 * 
 * @param completedChapters - Number of completed chapters
 * @param totalChapters - Total number of chapters
 * @returns Progress percentage (0-100)
 */
export function calculateProgressPercentage(
  completedChapters: number,
  totalChapters: number
): number {
  if (totalChapters === 0) return 0;
  return Math.round((completedChapters / totalChapters) * 100);
}
