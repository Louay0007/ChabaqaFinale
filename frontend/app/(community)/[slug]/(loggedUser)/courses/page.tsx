import CoursesPageContent from '@/app/(community)/[slug]/(loggedUser)/courses/components/CoursesPageContent'
import { communityService, courseService } from "@/lib/services"

export default async function CoursesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  // Fetch real data from APIs
  const [community, coursesData, myCourses] = await Promise.all([
    communityService.getCommunityBySlug(slug),
    courseService.getCoursesByCommunity(slug, 1, 50, true),
    courseService.getMyCourses().catch(() => []), // Handle if not authenticated
  ])

  if (!community) {
    return <div>Community not found</div>
  }

  // Transform to match component props
  const allCourses = coursesData.courses.map((course) => ({
    id: course._id,
    title: course.titre || course.title || "",
    description: course.description,
    thumbnail: course.thumbnail || "/placeholder.svg?height=200&width=300",
    price: course.prix || course.price || 0,
    currency: course.devise || course.currency || "USD",
    duration: course.duree || course.duration || "N/A",
    level: course.niveau || course.level || "Beginner",
    category: course.category || "General",
    isPublished: course.isPublished,
    enrollmentsCount: course.enrollmentsCount || 0,
    communityId: community._id,
  }))

  // Create enrollments from myCourses
  const userEnrollments = myCourses.map((course) => ({
    id: `enrollment-${course._id}`,
    userId: "current-user",
    courseId: course._id,
    enrolledAt: course.createdAt,
    progress: 0, // TODO: Get actual progress
  }))

  return (
    <CoursesPageContent 
      slug={slug}
      community={{
        id: community._id,
        name: community.name,
        slug: community.slug,
      }}
      allCourses={allCourses}
      userEnrollments={userEnrollments}
    />
  )
}