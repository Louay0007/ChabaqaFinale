/**
 * Course Types
 * TypeScript interfaces for Course API requests and responses
 */

export interface Course {
  _id: string
  titre: string
  title?: string // Alias
  description: string
  prix: number
  price?: number // Alias
  isPaid: boolean
  devise: string
  currency?: string // Alias
  communitySlug: string
  communityId?: string
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
  isPublished: boolean
  category?: string
  niveau?: string
  level?: string // Alias
  duree?: string
  duration?: string // Alias
  learningObjectives?: string[]
  prerequisites?: string[]
  thumbnail?: string
  sections?: CourseSection[]
  enrollmentsCount?: number
  createdAt: string
  updatedAt?: string
}

export interface CourseSection {
  _id: string
  titre: string
  title?: string
  description?: string
  ordre: number
  order?: number
  courseId: string
  chapitres?: CourseChapter[]
  createdAt?: string
}

export interface CourseChapter {
  _id: string
  titre: string
  title?: string
  description?: string
  contenu?: string
  content?: string
  ordre: number
  order?: number
  sectionId: string
  videoUrl?: string
  duree?: number
  duration?: number
  isPreview?: boolean
  ressources?: CourseResource[]
  createdAt?: string
}

export interface CourseResource {
  _id?: string
  titre: string
  title?: string
  type: string
  url: string
  description?: string
}

export interface CourseEnrollment {
  _id: string
  userId: string
  courseId: string
  enrolledAt: string
  progress?: number
  completedChapters?: string[]
  lastAccessedChapter?: string
  isActive: boolean
}

export interface CourseFilters {
  page?: number
  limit?: number
  category?: string
  niveau?: string
  search?: string
  published?: boolean
}

export interface CourseListResponse {
  courses: Course[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    totalPages?: number
  }
}

export interface CreateCourseDto {
  titre: string
  description: string
  prix: number
  isPaid: boolean
  devise: string
  communitySlug: string
  isPublished?: boolean
  category?: string
  niveau?: string
  duree?: string
  learningObjectives?: string[]
  prerequisites?: string[]
  sections?: CreateSectionDto[]
}

export interface UpdateCourseDto {
  titre?: string
  description?: string
  prix?: number
  isPaid?: boolean
  devise?: string
  category?: string
  niveau?: string
  duree?: string
  learningObjectives?: string[]
  prerequisites?: string[]
}

export interface CreateSectionDto {
  titre: string
  description?: string
  ordre: number
  chapitres?: CreateChapterDto[]
}

export interface CreateChapterDto {
  titre: string
  description?: string
  contenu?: string
  ordre: number
  videoUrl?: string
  duree?: number
  isPreview?: boolean
  ressources?: CourseResource[]
}

export interface CoursePermissions {
  canAccess: boolean
  isEnrolled: boolean
  isCreator: boolean
  requiresPayment: boolean
  message?: string
}

export interface ChapterAccess {
  canAccess: boolean
  isLocked: boolean
  reason?: string
  unlockedChapters?: string[]
}
