import { CreatorCoursesHeader } from "./components/creator-courses-header"
import { CreatorCoursesStats } from "./components/creator-courses-stats"
import { CreatorCoursesSearch } from "./components/creator-courses-search"
import { CreatorCoursesTabs } from "./components/creator-courses-tabs"
import { CreatorCoursesPerformance } from "./components/creator-courses-performance"
import { courseService } from "@/lib/services"

export default async function CreatorCoursesPage() {
  // Fetch real data from API
  const coursesData = await courseService.getMyCreatedCourses().catch(() => [])
  
  // Transform API data to match component expectations
  const allCourses = coursesData.map((course: any) => ({
    ...course,
    id: course._id || course.id,
    enrollments: course.enrollments || [],
    requirements: course.requirements || [],
    notes: course.notes || "",
    resources: course.resources || [],
  }))
  
  return (
    <div className="space-y-8 p-5">
      <CreatorCoursesHeader />
      <CreatorCoursesStats allCourses={allCourses} />
      <CreatorCoursesSearch />
      <CreatorCoursesTabs allCourses={allCourses} />
      {allCourses.length > 0 && <CreatorCoursesPerformance allCourses={allCourses} />}
    </div>
  )
}