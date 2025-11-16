import CoursesPageContent from '@/app/(community)/[creator]/[feature]/(loggedUser)/courses/components/CoursesPageContent'
import { getCommunityBySlug, getCoursesByCommunity, getUserEnrollments } from "@/lib/mock-data"

export default async function CoursesPage({ params }: { params: Promise<{ feature: string }> }) {
  const { feature } = await params; 
  const community = getCommunityBySlug(feature)
  const allCourses = getCoursesByCommunity(community?.id || "")
  const userEnrollments = getUserEnrollments("2") // Mock user ID

  if (!community) {
    return <div>Community not found</div>
  }

  return (
    <CoursesPageContent 
      slug={feature}
      community={community}
      allCourses={allCourses}
      userEnrollments={userEnrollments}
    />
  )
}