import React from 'react'
import ChallengesPageContent from '@/app/(community)/[slug]/(loggedUser)/challenges/components/challenges-page-content'
import { communityService, challengeService } from "@/lib/services"

export default async function ChallengesPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params
  
  // Fetch real data from APIs
  const [community, challenges] = await Promise.all([
    communityService.getCommunityBySlug(slug),
    challengeService.getChallengesByCommunity(slug),
  ])

  // Transform challenges to match component props
  const allChallenges = challenges.map((challenge) => ({
    id: challenge._id,
    title: challenge.title,
    description: challenge.description,
    category: challenge.category || "General",
    difficulty: challenge.difficulty || "Intermediate",
    duration: challenge.duration || "30 days",
    startDate: challenge.startDate,
    endDate: challenge.endDate,
    depositAmount: challenge.depositAmount || 0,
    completionReward: challenge.completionReward || 0,
    maxParticipants: challenge.maxParticipants || 100,
    participantsCount: challenge.participantsCount || 0,
    thumbnail: challenge.thumbnail || "/placeholder.svg?height=200&width=300",
    isActive: challenge.isActive,
    communityId: community._id,
  }))

  return (
    <ChallengesPageContent 
      slug={slug} 
      community={{
        id: community._id,
        name: community.name,
        slug: community.slug,
      }} 
      allChallenges={allChallenges} 
    />
  )
}