import React from 'react'
import CoursePlayer from '@/app/(community)/[slug]/(loggedUser)/courses/[courseId]/components/course-player'
import { courseService } from "@/lib/services"

export default async function CoursePlayerPage({ params }: { params: Promise<{ slug: string, courseId: string }> }) {
  const { slug, courseId } = await params
  
  // Fetch real course data
  const [courseData, myCourses] = await Promise.all([
    courseService.getCourseById(courseId),
    courseService.getMyCourses().catch(() => []),
  ])

  if (!courseData) {
    return <div>Course not found</div>
  }

  // Transform course data to match component props
  const course = {
    id: courseData._id,
    title: courseData.titre || courseData.title || "",
    description: courseData.description,
    thumbnail: courseData.thumbnail || "/placeholder.svg?height=400&width=600",
    price: courseData.prix || courseData.price || 0,
    currency: courseData.devise || courseData.currency || "USD",
    duration: courseData.duree || courseData.duration || "N/A",
    level: courseData.niveau || courseData.level || "Beginner",
    category: courseData.category || "General",
    communityId: courseData.communityId || "",
    creatorId: courseData.creatorId,
    creator: courseData.creator || { name: "Unknown", avatar: "" },
    isPublished: courseData.isPublished,
    learningObjectives: courseData.learningObjectives || [],
    prerequisites: courseData.prerequisites || [],
    sections: (courseData.sections || []).map((section) => ({
      id: section._id,
      title: section.titre || section.title || "",
      description: section.description || "",
      order: section.ordre || section.order || 0,
      chapters: (section.chapitres || []).map((chapter) => ({
        id: chapter._id,
        title: chapter.titre || chapter.title || "",
        description: chapter.description || "",
        content: chapter.contenu || chapter.content || "",
        order: chapter.ordre || chapter.order || 0,
        videoUrl: chapter.videoUrl || "",
        duration: chapter.duree || chapter.duration || 0,
        isPreview: chapter.isPreview || false,
        resources: chapter.ressources || [],
      })),
    })),
  }

  // Check if user is enrolled
  const isEnrolled = myCourses.some((c) => c._id === courseId)
  const enrollment = isEnrolled
    ? {
        id: `enrollment-${courseId}`,
        userId: "current-user",
        courseId: courseId,
        enrolledAt: new Date().toISOString(),
        progress: 0,
      }
    : undefined

  return <CoursePlayer 
    slug={slug} 
    courseId={courseId} 
    course={course} 
    enrollment={enrollment} 
  />
}