import { Zap } from "lucide-react"
import { getUserChallengeParticipation } from "@/lib/mock-data"

interface HeaderSectionProps {
  allChallenges: any[]
}

export default function HeaderSection({ allChallenges }: HeaderSectionProps) {
  const currentUserId = "2" // Mock current user ID

  const getChallengeStatus = (challenge: any) => {
    const now = new Date()
    if (challenge.startDate > now) return "upcoming"
    if (challenge.endDate < now) return "completed"
    return "active"
  }

  return (
    <div className="mb-6">
      <div className="bg-gradient-to-r from-challenges-500 to-orange-500 rounded-xl p-4 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between">
        {/* Background circles */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>

        {/* Title & subtitle */}
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-2">
            <Zap className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Challenge Hub</h1>
          </div>
          <p className="text-challenges-100 text-sm md:ml-2">
            Join exciting challenges and compete with fellow members
          </p>
        </div>

        {/* Stats horizontal */}
        <div className="flex space-x-6 mt-4 md:mt-0">
          <div className="text-center">
            <div className="text-xl font-bold">{allChallenges.length}</div>
            <div className="text-challenges-100 text-xs">Total</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">
              {allChallenges.filter((c) => getChallengeStatus(c) === "active").length}
            </div>
            <div className="text-challenges-100 text-xs">Active</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">
              {allChallenges.reduce((acc, c) => acc + c.participants.length, 0)}
            </div>
            <div className="text-challenges-100 text-xs">Participants</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">
              {allChallenges.filter((c) => getUserChallengeParticipation(currentUserId, c.id)).length}
            </div>
            <div className="text-challenges-100 text-xs">Joined</div>
          </div>
        </div>
      </div>
    </div>
  )
}
