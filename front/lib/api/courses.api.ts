import { apiClient, ApiSuccessResponse, PaginatedResponse, PaginationParams } from './client';
import type { Course, CourseSection, CourseChapter, CourseEnrollment } from './types';

export interface CreateCourseData {
  title: string;
  slug: string;
  description: string;
  communityId: string;
  thumbnail?: string;
  price: number;
  priceType: 'free' | 'paid';
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
}

export interface UpdateCourseData extends Partial<CreateCourseData> {
  isPublished?: boolean;
}

export interface CreateSectionData {
  title: string;
  description?: string;
  order: number;
}

export interface CreateChapterData {
  title: string;
  content: string;
  videoUrl?: string;
  duration: number;
  order: number;
  isFree: boolean;
}

// Courses API
export const coursesApi = {
  // Get all courses
  getAll: async (params?: PaginationParams): Promise<PaginatedResponse<Course>> => {
    return apiClient.get<PaginatedResponse<Course>>('/courses', params);
  },

  // Create course
  create: async (data: CreateCourseData): Promise<ApiSuccessResponse<Course>> => {
    return apiClient.post<ApiSuccessResponse<Course>>('/courses', data);
  },

  // Get course by ID
  getById: async (id: string): Promise<ApiSuccessResponse<Course>> => {
    return apiClient.get<ApiSuccessResponse<Course>>(`/courses/${id}`);
  },

  // Update course
  update: async (id: string, data: UpdateCourseData): Promise<ApiSuccessResponse<Course>> => {
    return apiClient.patch<ApiSuccessResponse<Course>>(`/courses/${id}`, data);
  },

  // Delete course
  delete: async (id: string): Promise<ApiSuccessResponse<void>> => {
    return apiClient.delete<ApiSuccessResponse<void>>(`/courses/${id}`);
  },

  // Get courses by community (using slug)
  getByCommunity: async (slug: string, params?: { page?: number; limit?: number; published?: boolean }): Promise<any> => {
    return apiClient.get(`/cours/community/${slug}`, params);
  },
  
  // Get user enrolled courses
  getMyCourses: async (params?: PaginationParams): Promise<any> => {
    return apiClient.get('/cours/user/mes-cours', params);
  },
  
  // Get user progress for all courses
  getUserProgress: async (params?: PaginationParams): Promise<any> => {
    return apiClient.get('/cours/user/progress', params);
  },

  // Get course sections
  getSections: async (courseId: string): Promise<ApiSuccessResponse<CourseSection[]>> => {
    return apiClient.get<ApiSuccessResponse<CourseSection[]>>(`/courses/${courseId}/sections`);
  },

  // Create course section
  createSection: async (courseId: string, data: CreateSectionData): Promise<ApiSuccessResponse<CourseSection>> => {
    return apiClient.post<ApiSuccessResponse<CourseSection>>(`/courses/${courseId}/sections`, data);
  },

  // Get course chapters
  getChapters: async (courseId: string): Promise<ApiSuccessResponse<CourseChapter[]>> => {
    return apiClient.get<ApiSuccessResponse<CourseChapter[]>>(`/courses/${courseId}/chapters`);
  },

  // Create course chapter
  createChapter: async (courseId: string, data: CreateChapterData): Promise<ApiSuccessResponse<CourseChapter>> => {
    return apiClient.post<ApiSuccessResponse<CourseChapter>>(`/courses/${courseId}/chapters`, data);
  },

  // Enroll in course
  enroll: async (id: string): Promise<ApiSuccessResponse<CourseEnrollment>> => {
    return apiClient.post<ApiSuccessResponse<CourseEnrollment>>(`/courses/${id}/enroll`);
  },

  // Get course progress
  getProgress: async (id: string): Promise<ApiSuccessResponse<CourseEnrollment>> => {
    return apiClient.get<ApiSuccessResponse<CourseEnrollment>>(`/courses/${id}/progress`);
  },

  // Update chapter progress
  updateProgress: async (id: string, chapterId: string, progress: number): Promise<ApiSuccessResponse<void>> => {
    return apiClient.patch<ApiSuccessResponse<void>>(`/courses/${id}/progress/${chapterId}`, { progress });
  },

  // Complete chapter
  completeChapter: async (id: string, chapterId: string): Promise<ApiSuccessResponse<void>> => {
    return apiClient.post<ApiSuccessResponse<void>>(`/courses/${id}/complete/${chapterId}`);
  },
};
