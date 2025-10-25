import { communityService, courseService, challengeService, sessionService, postService, analyticsService } from "@/lib/services"
import DashboardClient from "./components/dashboard-client"

export default async function CreatorDashboardPage() {
  // Fetch real data from APIs
  const [communities, courses, challenges, sessions, posts, analytics] = await Promise.all([
    communityService.getCommunities({ page: 1, limit: 100 }).catch(() => ({ communities: [] })),
    courseService.getMyCreatedCourses().catch(() => []),
    challengeService.getMyCreatedChallenges().catch(() => ({ challenges: [] })),
    sessionService.getMyCreatedSessions().catch(() => []),
    postService.getMyPosts(1, 100).catch(() => ({ posts: [] })),
    analyticsService.getOverview().catch(() => ({ totals: { views: 0, starts: 0, completes: 0, likes: 0, shares: 0, downloads: 0, bookmarks: 0, watchTime: 0, ratingsCount: 0 }, trend: [], topContents: [] })),
  ])

  // Extract data from responses
  const userCommunities = communities.communities || []
  const creatorCourses = Array.isArray(courses) ? courses : []
  const creatorChallenges = Array.isArray(challenges) ? challenges.challenges || [] : []
  const creatorSessions = Array.isArray(sessions) ? sessions : []
  const creatorPosts = Array.isArray(posts) ? posts.posts || [] : []
  
  return (
    <DashboardClient
      communities={userCommunities}
      courses={creatorCourses}
      challenges={creatorChallenges}
      sessions={creatorSessions}
      posts={creatorPosts}
      analytics={analytics}
    />
  )
}
