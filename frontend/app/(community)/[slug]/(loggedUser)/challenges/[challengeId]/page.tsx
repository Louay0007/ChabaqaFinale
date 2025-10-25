import React from 'react'
import ChallengeDetailPageContent from '@/app/(community)/[slug]/(loggedUser)/challenges/[challengeId]/components/ChallengeDetailPageContent'
import { communityService, challengeService } from "@/lib/services"

export default async function ChallengeDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string, challengeId: string }> 
}) {
  const { slug, challengeId } = await params
  
  // Fetch real data from APIs
  const [community, challengeData] = await Promise.all([
    communityService.getCommunityBySlug(slug),
    challengeService.getChallengeById(challengeId),
  ])

  // Transform challenge data to match component props
  const challenge = {
    id: challengeData._id,
    title: challengeData.title,
    description: challengeData.description,
    category: challengeData.category || "General",
    difficulty: challengeData.difficulty || "Intermediate",
    duration: challengeData.duration || "30 days",
    startDate: challengeData.startDate,
    endDate: challengeData.endDate,
    depositAmount: challengeData.depositAmount || 0,
    completionReward: challengeData.completionReward || 0,
    topPerformerBonus: challengeData.topPerformerBonus || 0,
    streakBonus: challengeData.streakBonus || 0,
    maxParticipants: challengeData.maxParticipants || 100,
    participantsCount: challengeData.participantsCount || 0,
    thumbnail: challengeData.thumbnail || "/placeholder.svg?height=400&width=600",
    isActive: challengeData.isActive,
    communityId: community._id,
    creatorId: challengeData.creatorId,
    creator: challengeData.creator,
    participants: challengeData.participants || [],
  }

  // Transform tasks
  const challengeTasks = (challengeData.tasks || []).map((task) => ({
    id: task._id,
    day: task.day,
    title: task.title,
    description: task.description,
    deliverable: task.deliverable || "",
    isCompleted: task.isCompleted || false,
    points: task.points || 0,
    challengeId: challengeData._id,
  }))

  return (
    <ChallengeDetailPageContent 
      slug={slug} 
      community={{
        id: community._id,
        name: community.name,
        slug: community.slug,
      }} 
      challenge={challenge} 
      challengeTasks={challengeTasks} 
    />
  )
}