// app/manage-challenge/[challengeId]/page.tsx
import ChallengeManager from "./components/ChallengeManager"
import { challengeService } from "@/lib/services"

export default async function ManageChallengePage({
  params,
}: {
  params: Promise<{ challengeId: string }>
}) {
  const { challengeId } = await params
  
  // Fetch real data from API
  const challenge = await challengeService.getChallengeById(challengeId).catch(() => null)
  const challengeTasks = challenge?.tasks || []

  if (!challenge) {
    return <div>Challenge not found</div>
  }

  return (
    <ChallengeManager 
      challenge={challenge} 
      challengeTasks={challengeTasks} 
      challengeId={challengeId}
    />
  )
}