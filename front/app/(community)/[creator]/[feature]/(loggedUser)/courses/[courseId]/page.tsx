import React from 'react'
import CoursePlayer from '@/app/(community)/[creator]/[feature]/(loggedUser)/courses/[courseId]/components/course-player'
import { getCourseById, getUserEnrollments } from "@/lib/mock-data"

export default async function CoursePlayerPage({ params }: { params: Promise<{ creator: string; feature: string, courseId: string }> }) {
  const { creator, feature, courseId } = await params
  const course = getCourseById(courseId)
  const userEnrollments = getUserEnrollments("2") // Mock user ID
  const enrollment = userEnrollments.find((e) => e.courseId === courseId)

  if (!course) {
    return <div>Course not found</div>
  }

  return <CoursePlayer 
    creatorSlug={creator} 
    slug={feature} 
    courseId={courseId} 
    course={course} 
    enrollment={enrollment} 
  />
}