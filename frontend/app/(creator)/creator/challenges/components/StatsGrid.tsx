"use client"

import { MetricCard } from "@/components/ui/metric-card"
import { Zap, Play, Users, DollarSign } from "lucide-react"

interface StatsGridProps {
  allChallenges: any[]
}

export default function StatsGrid({ allChallenges }: StatsGridProps) {
  const stats = [
    {
      title: "Total Challenges",
      value: allChallenges.length,
      change: { value: "+1", trend: "up" as const },
      icon: Zap,
      color: "challenges" as const,
    },
    {
      title: "Active Challenges",
      value: allChallenges.filter((c) => {
        const now = new Date()
        return c.startDate <= now && c.endDate >= now
      }).length,
      change: { value: "1", trend: "neutral" as const },
      icon: Play,
      color: "success" as const,
    },
    {
      title: "Total Participants",
      value: allChallenges.reduce((acc, c) => acc + c.participants.length, 0),
      change: { value: "+47", trend: "up" as const },
      icon: Users,
      color: "primary" as const,
    },
    {
      title: "Challenge Revenue",
      value: "$3,250",
      change: { value: "+22%", trend: "up" as const },
      icon: DollarSign,
      color: "success" as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <MetricCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          change={stat.change.trend === "neutral" ? undefined : stat.change}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  )
}
