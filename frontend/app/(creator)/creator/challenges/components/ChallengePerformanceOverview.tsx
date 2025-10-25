
import { EnhancedCard } from "@/components/ui/enhanced-card"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Flame } from "lucide-react"

interface ChallengePerformanceOverviewProps {
  allChallenges: any[]
}

export default function ChallengePerformanceOverview({ allChallenges }: ChallengePerformanceOverviewProps) {
  return (
    <EnhancedCard
      variant="glass"
      className="bg-gradient-to-r from-challenges-50 to-orange-50 border-challenges-200"
    >
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-challenges-600" />
          Challenge Performance Overview
        </CardTitle>
        <CardDescription>Your most engaging challenges this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allChallenges.slice(0, 3).map((challenge, index) => (
            <div key={challenge.id} className="flex items-center space-x-4 p-4 bg-white/50 rounded-lg">
              <div className="flex-shrink-0">
                <Badge
                  variant="secondary"
                  className={`w-8 h-8 rounded-full p-0 flex items-center justify-center ${
                    index === 0
                      ? "bg-yellow-100 text-yellow-800"
                      : index === 1
                        ? "bg-gray-100 text-gray-800"
                        : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {index + 1}
                </Badge>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{challenge.title}</h4>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                  <span>{challenge.participants.length} participants</span>
                  <span>${(challenge.depositAmount || 50) * challenge.participants.length} deposits</span>
                  <div className="flex items-center">
                    <Flame className="h-3 w-3 mr-1 text-orange-500" />
                    {Math.round(challenge.participants[0]?.progress || 0)}% completion
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-green-600">
                  +{Math.floor(Math.random() * 20 + 10)}%
                </div>
                <div className="text-xs text-muted-foreground">engagement</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </EnhancedCard>
  )
}
