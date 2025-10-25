import { notFound } from "next/navigation"
import { CreatorHero } from "@/app/(landing)/components/creator/creator-hero"
import { CreatorPageContent } from "@/app/(landing)/components/creator/creator-page-content"
import { mockUsers, mockCommunities, mockCourses, mockChallenges, mockEvents, mockSessions } from "@/lib/mock-data2"

interface CreatorPageProps {
  params: {
    creator: string
  }
}

export default function CreatorPage({ params }: CreatorPageProps) {
  const creator = mockUsers.find(
    (user) => user.role === "creator" && user.name.toLowerCase().replace(/\s+/g, "-") === params.creator,
  )

  if (!creator) {
    notFound()
  }

  const communities = mockCommunities.filter((c) => c.creatorId === creator.id)
  const courses = mockCourses.filter((c) => c.creatorId === creator.id)
  const challenges = mockChallenges.filter((c) => c.creatorId === creator.id)
  const events = mockEvents.filter((e) => e.creatorId === creator.id)
  const sessions = mockSessions.filter((s) => s.creatorId === creator.id)

  const totalMembers = communities.reduce((sum, community) => sum + community.members, 0)

  return (
    <div className="min-h-screen bg-white">
      <CreatorHero creator={creator} totalMembers={totalMembers} totalCommunities={communities.length} />
      <CreatorPageContent
        communities={communities}
        allCourses={courses}
        allChallenges={challenges}
        allSessions={sessions}
        allEvents={events}
      />
    </div>
  )
}
