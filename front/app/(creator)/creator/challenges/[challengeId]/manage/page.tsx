// app/manage-challenge/[challengeId]/page.tsx
import ChallengeManager from "./components/ChallengeManager"
import { getChallengeById, getChallengeTasks } from "@/lib/mock-data"

export default async function ManageChallengePage({
  params,
}: {
  params: { challengeId: string }
}) {
  const challenge = getChallengeById(params.challengeId)
  const challengeTasks = getChallengeTasks(params.challengeId)

  if (!challenge) {
    return <div>Challenge not found</div>
  }

  return (
      <ChallengeManager 
        challenge={challenge} 
        challengeTasks={challengeTasks} 
        challengeId={params.challengeId}
      />
  )
}