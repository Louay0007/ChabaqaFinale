/**
 * Course Service
 * Handles all course-related API calls
 */

import { httpClient } from "./http-client"
import type {
  Course,
  CourseFilters,
  CourseListResponse,
  CreateCourseDto,
  UpdateCourseDto,
  CreateSectionDto,
  CreateChapterDto,
  CourseEnrollment,
  CoursePermissions,
  ChapterAccess,
} from "../types/course.types"

class CourseService {
  private static instance: CourseService

  static getInstance(): CourseService {
    if (!CourseService.instance) {
      CourseService.instance = new CourseService()
    }
    return CourseService.instance
  }

  /**
   * Get courses list with filters and pagination
   * GET /cours
   */
  async getCourses(filters?: CourseFilters): Promise<CourseListResponse> {
    const response = await httpClient.get<any>("/api/cours", filters)
    return response.data || response
  }

  /**
   * Get courses by community
   * GET /cours/community/:slug
   */
  async getCoursesByCommunity(
    slug: string,
    page?: number,
    limit?: number,
    published?: boolean
  ): Promise<CourseListResponse> {
    const response = await httpClient.get<any>(`/api/cours/community/${slug}`, {
      page,
      limit,
      published,
    })
    return response.data || response
  }

  /**
   * Get user's enrolled courses
   * GET /cours/user/mes-cours
   */
  async getMyCourses(): Promise<Course[]> {
    const response = await httpClient.get<any>("/api/cours/user/mes-cours")
    const result: any = response.data || response
    return result.courses || result || []
  }

  /**
   * Get user's created courses
   * GET /cours/user/created
   */
  async getMyCreatedCourses(): Promise<Course[]> {
    const response = await httpClient.get<any>("/api/cours/user/created")
    const result: any = response.data || response
    return result.courses || result || []
  }

  /**
   * Get single course by ID
   * GET /cours/:id
   */
  async getCourseById(id: string): Promise<Course> {
    const response = await httpClient.get<any>(`/api/cours/${id}`)
    const result: any = response.data || response
    return result.course || result
  }

  /**
   * Get course permissions for user
   * GET /cours/:id/permissions
   */
  async getCoursePermissions(id: string): Promise<CoursePermissions> {
    const response = await httpClient.get<any>(`/api/cours/${id}/permissions`)
    return response.data || response
  }

  /**
   * Create a new course
   * POST /cours/create-cours
   */
  async createCourse(data: CreateCourseDto): Promise<Course> {
    const response = await httpClient.post<any>("/api/cours/create-cours", data)
    const result: any = response.data || response
    return result.cours || result.course || result
  }

  /**
   * Update a course
   * PATCH /cours/:id
   */
  async updateCourse(id: string, data: UpdateCourseDto): Promise<Course> {
    const response = await httpClient.patch<any>(`/api/cours/${id}`, data)
    const result: any = response.data || response
    return result.course || result
  }

  /**
   * Delete a course
   * DELETE /cours/:id
   */
  async deleteCourse(id: string): Promise<{ message: string }> {
    const response = await httpClient.delete<any>(`/api/cours/${id}`)
    return response.data || response
  }

  /**
   * Toggle course publication status
   * PATCH /cours/:id/toggle-publication
   */
  async togglePublication(id: string): Promise<Course> {
    const response = await httpClient.patch<any>(`/api/cours/${id}/toggle-publication`)
    const result: any = response.data || response
    return result.course || result
  }

  /**
   * Enroll in a course
   * POST /cours/:id/enroll
   */
  async enrollInCourse(id: string): Promise<CourseEnrollment> {
    const response = await httpClient.post<any>(`/api/cours/${id}/enroll`)
    const result: any = response.data || response
    return result.enrollment || result
  }

  /**
   * Add section to course
   * POST /cours/:id/add-section
   */
  async addSection(courseId: string, data: CreateSectionDto): Promise<Course> {
    const response = await httpClient.post<any>(`/api/cours/${courseId}/add-section`, data)
    const result: any = response.data || response
    return result.course || result
  }

  /**
   * Delete section from course
   * DELETE /cours/:courseId/sections/:sectionId
   */
  async deleteSection(courseId: string, sectionId: string): Promise<{ message: string }> {
    const response = await httpClient.delete<any>(
      `/api/cours/${courseId}/sections/${sectionId}`
    )
    return response.data || response
  }

  /**
   * Add chapter to section
   * POST /cours/:courseId/sections/:sectionId/add-chapitre
   */
  async addChapter(
    courseId: string,
    sectionId: string,
    data: CreateChapterDto
  ): Promise<Course> {
    const response = await httpClient.post<any>(
      `/api/cours/${courseId}/sections/${sectionId}/add-chapitre`,
      data
    )
    const result: any = response.data || response
    return result.course || result
  }

  /**
   * Delete chapter from section
   * DELETE /cours/:courseId/sections/:sectionId/chapitres/:chapitreId
   */
  async deleteChapter(
    courseId: string,
    sectionId: string,
    chapitreId: string
  ): Promise<{ message: string }> {
    const response = await httpClient.delete<any>(
      `/api/cours/${courseId}/sections/${sectionId}/chapitres/${chapitreId}`
    )
    return response.data || response
  }

  /**
   * Upload course thumbnail
   * PUT /cours/:id/thumbnail
   */
  async uploadThumbnail(id: string, file: File): Promise<Course> {
    const formData = new FormData()
    formData.append("thumbnail", file)
    const response = await httpClient.postFormData<any>(`/api/cours/${id}/thumbnail`, formData)
    const result: any = response.data || response
    return result.course || result
  }

  /**
   * Upload chapter video
   * PUT /cours/:courseId/sections/:sectionId/chapitres/:chapitreId/video
   */
  async uploadChapterVideo(
    courseId: string,
    sectionId: string,
    chapitreId: string,
    file: File
  ): Promise<Course> {
    const formData = new FormData()
    formData.append("video", file)
    const response = await httpClient.postFormData<any>(
      `/api/cours/${courseId}/sections/${sectionId}/chapitres/${chapitreId}/video`,
      formData
    )
    const result: any = response.data || response
    return result.course || result
  }

  /**
   * Check chapter access
   * GET /cours/:courseId/chapitres/:chapitreId/access
   */
  async getChapterAccess(courseId: string, chapitreId: string): Promise<ChapterAccess> {
    const response = await httpClient.get<any>(
      `/api/cours/${courseId}/chapitres/${chapitreId}/access`
    )
    return response.data || response
  }

  /**
   * Track course view
   * POST /cours/track/view
   */
  async trackView(courseId: string): Promise<void> {
    await httpClient.post<any>("/api/cours/track/view", { courseId })
  }

  /**
   * Track course start
   * POST /cours/track/start
   */
  async trackStart(courseId: string): Promise<void> {
    await httpClient.post<any>("/api/cours/track/start", { courseId })
  }

  /**
   * Track course completion
   * POST /cours/track/complete
   */
  async trackComplete(courseId: string): Promise<void> {
    await httpClient.post<any>("/api/cours/track/complete", { courseId })
  }

  /**
   * Track chapter progress
   * POST /cours/track/chapter-progress
   */
  async trackChapterProgress(courseId: string, chapitreId: string, progress: number): Promise<void> {
    await httpClient.post<any>("/api/cours/track/chapter-progress", {
      courseId,
      chapitreId,
      progress,
    })
  }

  /**
   * Get course statistics (for creators)
   * GET /cours/:id/track/stats
   */
  async getCourseStats(courseId: string): Promise<any> {
    const response = await httpClient.get<any>(`/api/cours/${courseId}/track/stats`)
    return response.data || response
  }

  /**
   * Get course progress for user
   * GET /cours/:id/progress
   */
  async getCourseProgress(courseId: string): Promise<any> {
    const response = await httpClient.get<any>(`/api/cours/${courseId}/progress`)
    return response.data || response
  }
}

export const courseService = CourseService.getInstance()
