"use client"

import { useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import type { Community, AchievementWithProgress } from "@/lib/api/types"
import { cn } from "@/lib/utils"
import {
  Trophy,
  Medal,
  Award,
  Star,
  CheckCircle2,
  Lock,
  Target,
  Crown,
  RefreshCw,
  TrendingUp,
} from "lucide-react"

const RARITY_CONFIG = {
  common: { label: "Common", color: "bg-gray-100 text-gray-800", icon: Trophy },
  rare: { label: "Rare", color: "bg-blue-100 text-blue-800", icon: Medal },
  epic: { label: "Epic", color: "bg-purple-100 text-purple-800", icon: Award },
  legendary: { label: "Legendary", color: "bg-yellow-100 text-yellow-800", icon: Crown },
}

interface AchievementsPageContentProps {
  slug: string
  community: Community
  achievements: AchievementWithProgress[]
  onRefresh: () => void
}

export default function AchievementsPageContent({
  slug,
  community,
  achievements,
  onRefresh,
}: AchievementsPageContentProps) {
  const { toast } = useToast()

  const stats = useMemo(() => {
    const unlocked = achievements.filter(a => a.isUnlocked).length
    const total = achievements.length
    const inProgress = achievements.filter(a => !a.isUnlocked && a.progress && a.progress > 0).length
    const locked = total - unlocked - inProgress

    return { total, unlocked, inProgress, locked }
  }, [achievements])

  const unlockedAchievements = achievements.filter(a => a.isUnlocked)
  const lockedAchievements = achievements.filter(a => !a.isUnlocked)

  const handleRefresh = async () => {
    try {
      await onRefresh()
      toast({
        title: "Achievements updated",
        description: "Latest achievement progress has been loaded.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Refresh failed",
        description: "We couldn't refresh your achievements. Please try again.",
      })
    }
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-r from-yellow-500/80 via-orange-500/70 to-red-500/50 px-8 py-10 text-white">
        <div className="absolute inset-0 opacity-10">
          {community.coverImage && (
            <Image
              src={community.coverImage}
              alt={community.name}
              fill
              className="object-cover"
            />
          )}
        </div>
        <div className="relative z-10 max-w-3xl">
          <Badge variant="secondary" className="mb-4 bg-white/20 text-white">
            🏆 Achievements
          </Badge>
          <h1 className="text-3xl font-semibold leading-tight">
            Your Achievement Journey in <span className="text-white/90">{community.name}</span>
          </h1>
          <p className="mt-3 max-w-2xl text-base text-white/80">
            Celebrate your milestones and unlock rewards as you progress through the community.
            Each achievement represents a step forward in your learning journey.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div>
              <p className="text-white/80 text-sm">Achievements Earned</p>
              <p className="text-3xl font-bold">
                {stats.unlocked}
                <span className="text-base font-normal text-white/80">
                  /{stats.total}
                </span>
              </p>
            </div>
            <div className="h-10 w-px bg-white/30" />
            <div>
              <p className="text-white/80 text-sm">Next Milestone</p>
              <p className="text-3xl font-bold">{stats.inProgress}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border border-border/70 shadow-sm">
          <CardContent className="flex items-start gap-4 p-5">
            <div className="rounded-xl bg-yellow-100 p-3 text-yellow-600">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Achievements</p>
              <p className="mt-1 text-2xl font-semibold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/70 shadow-sm">
          <CardContent className="flex items-start gap-4 p-5">
            <div className="rounded-xl bg-green-100 p-3 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Unlocked</p>
              <p className="mt-1 text-2xl font-semibold text-green-600">{stats.unlocked}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/70 shadow-sm">
          <CardContent className="flex items-start gap-4 p-5">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="mt-1 text-2xl font-semibold text-blue-600">{stats.inProgress}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/70 shadow-sm">
          <CardContent className="flex items-start gap-4 p-5">
            <div className="rounded-xl bg-gray-100 p-3 text-gray-600">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Locked</p>
              <p className="mt-1 text-2xl font-semibold text-gray-600">{stats.locked}</p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Achievements Tabs */}
      <section className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-col gap-2">
            <p className="text-lg font-semibold">Achievement Gallery</p>
            <p className="text-sm text-muted-foreground">
              Explore all available achievements and track your progress towards unlocking them.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto rounded-full bg-muted/50 p-1">
            <TabsTrigger value="all" className="px-4">
              All ({stats.total})
            </TabsTrigger>
            <TabsTrigger value="unlocked" className="px-4">
              Unlocked ({stats.unlocked})
            </TabsTrigger>
            <TabsTrigger value="locked" className="px-4">
              Locked ({stats.locked})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {achievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="unlocked" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {unlockedAchievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="locked" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {lockedAchievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}

function AchievementCard({ achievement }: { achievement: AchievementWithProgress }) {
  const rarityConfig = RARITY_CONFIG[achievement.rarity] || RARITY_CONFIG.common
  const RarityIcon = rarityConfig.icon

  const progressPercent = achievement.progress || 0
  const isUnlocked = achievement.isUnlocked

  return (
    <Card className={cn(
      "overflow-hidden border transition-all hover:shadow-lg",
      isUnlocked
        ? "border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-yellow-100"
        : "border-border/60 hover:border-primary/40"
    )}>
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "rounded-xl p-3",
              isUnlocked
                ? "bg-yellow-100 text-yellow-600"
                : "bg-gray-100 text-gray-400"
            )}>
              {isUnlocked ? (
                <RarityIcon className="h-5 w-5" />
              ) : (
                <Lock className="h-5 w-5" />
              )}
            </div>
            <div className="space-y-1">
              <Badge className={rarityConfig.color}>
                {rarityConfig.label}
              </Badge>
              {achievement.points > 0 && (
                <Badge variant="outline" className="text-xs">
                  {achievement.points} XP
                </Badge>
              )}
            </div>
          </div>
          {isUnlocked && achievement.earnedAt && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Earned</p>
              <p className="text-xs font-medium">
                {formatDistanceToNow(new Date(achievement.earnedAt), { addSuffix: true })}
              </p>
            </div>
          )}
        </div>

        <div>
          <CardTitle className="text-lg">{achievement.name}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {!isUnlocked && achievement.currentValue !== undefined && achievement.targetValue !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                {achievement.currentValue} / {achievement.targetValue}
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {Math.round(progressPercent)}% complete
            </p>
          </div>
        )}

        {isUnlocked && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            <span className="font-medium">Achievement Unlocked!</span>
          </div>
        )}

        <div className="flex flex-wrap gap-1">
          {achievement.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}