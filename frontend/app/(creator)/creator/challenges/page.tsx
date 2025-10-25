// app/(creator)/creator/challenges/page.tsx
import PageHeader from "./components/PageHeader"
import StatsGrid from "./components/StatsGrid"
import SearchBar from "./components/SearchBar"
import ChallengesTabs from "./components/ChallengesTabs"
import ChallengePerformanceOverview from "./components/ChallengePerformanceOverview"
import { challengeService } from "@/lib/services"

export default async function CreatorChallengesPage() {
  // Fetch real data from API
  const challengesData = await challengeService.getMyCreatedChallenges().catch(() => ({ challenges: [] }))
  
  // Transform API data to match component expectations
  const allChallenges = (challengesData.challenges || []).map((challenge: any) => ({
    ...challenge,
    id: challenge._id || challenge.id,
    participants: challenge.participants || [],
  }))

  return (
    <div className="space-y-8 p-5">
      <PageHeader />
      <StatsGrid allChallenges={allChallenges} />
      <SearchBar />
      <ChallengesTabs allChallenges={allChallenges} />
      {allChallenges.length > 0 && (
        <ChallengePerformanceOverview allChallenges={allChallenges} />
      )}
    </div>
  )
}
