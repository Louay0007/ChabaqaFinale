import React from 'react'
import ChallengesPageContent from '@/app/(community)/[creator]/[feature]/(loggedUser)/challenges/components/challenges-page-content'
import { getCommunityBySlug, getChallengesByCommunity } from "@/lib/mock-data"

export default async function ChallengesPage({ 
  params 
}: { 
  params: Promise<{ feature: string }> 
}) {
  const { feature } = await params
  const community = getCommunityBySlug(feature)
  const allChallenges = getChallengesByCommunity(community?.id || "")

  return <ChallengesPageContent slug={feature} community={community} allChallenges={allChallenges} />
}