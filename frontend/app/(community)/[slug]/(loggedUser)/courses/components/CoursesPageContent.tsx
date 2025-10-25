"use client"

import { useState } from "react"
import HeaderSection from "@/app/(community)/[slug]/(loggedUser)/courses/components/HeaderSection"
import CoursesTabs from "@/app/(community)/[slug]/(loggedUser)/courses/components/CoursesTabs"
import CourseList from "@/app/(community)/[slug]/(loggedUser)/courses/components/CourseList"
import CourseDetailsSidebar from "@/app/(community)/[slug]/(loggedUser)/courses/components/CourseDetailsSidebar"

interface CoursesPageContentProps {
  slug: string
  community: any
  allCourses: any[]
  userEnrollments: any[]
}

export default function CoursesPageContent({ 
  slug, 
  community, 
  allCourses, 
  userEnrollments 
}: CoursesPageContentProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)

  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())

    const isEnrolled = userEnrollments.some((e) => e.courseId === course.id)

    if (activeTab === "enrolled") {
      return matchesSearch && isEnrolled
    }
    if (activeTab === "available") {
      return matchesSearch && !isEnrolled
    }
    if (activeTab === "free") {
      return matchesSearch && course.price === 0
    }
    if (activeTab === "paid") {
      return matchesSearch && course.price > 0
    }
    return matchesSearch
  })

  const getEnrollmentProgress = (courseId: string) => {
    const enrollment = userEnrollments.find((e) => e.courseId === courseId)
    if (!enrollment) return null

    const course = allCourses.find((c) => c.id === courseId)
    if (!course) return null

    const totalChapters = course.sections.reduce((acc: number, s: any) => acc + s.chapters.length, 0)
    const completed = enrollment.progress.filter((p: any) => p.isCompleted).length
    return { completed, total: totalChapters, percentage: (completed / totalChapters) * 100 }
  }

  const getCoursePricing = (course: any) => {
    if (course.price === 0) {
      const paidChapters = course.sections.flatMap((s: any) => s.chapters).filter((c: any) => c.price && c.price > 0)
      if (paidChapters.length > 0) {
        return { type: "freemium", basePrice: 0, paidChapters: paidChapters.length }
      }
      return { type: "free", basePrice: 0 }
    }
    return { type: "paid", basePrice: course.price }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <HeaderSection 
          allCourses={allCourses} 
          userEnrollments={userEnrollments} 
        />
        
        <CoursesTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          allCourses={allCourses}
          userEnrollments={userEnrollments}
          filteredCourses={filteredCourses}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <CourseList
              filteredCourses={filteredCourses}
              userEnrollments={userEnrollments}
              allCourses={allCourses}
              selectedCourse={selectedCourse}
              setSelectedCourse={setSelectedCourse}
              getEnrollmentProgress={getEnrollmentProgress}
              getCoursePricing={getCoursePricing}
              slug={slug}
            />
            {/* Sidebar - Hidden on mobile */}
            <div className="hidden lg:block">
              <CourseDetailsSidebar
                selectedCourse={selectedCourse}
                allCourses={allCourses}
                userEnrollments={userEnrollments}
                getCoursePricing={getCoursePricing}
              />
            </div>
          </div>
        </CoursesTabs>
      </div>
    </div>
  )
}