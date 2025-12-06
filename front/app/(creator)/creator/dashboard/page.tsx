"use client"

import { Badge } from "@/components/ui/badge"

import { useEffect, useState } from "react"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnhancedCard } from "@/components/ui/enhanced-card"
import { MetricCard } from "@/components/ui/metric-card"
import {
  Users,
  BookOpen,
  Zap,
  Calendar,
  DollarSign,
  TrendingUp,
  MessageSquare,
  Star,
  ArrowRight,
  Plus,
  Eye,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { CommunityManager } from "@/app/(creator)/creator/components/community-manager"
import { api, apiClient } from "@/lib/api"
import { useCreatorCommunity } from "@/app/(creator)/creator/context/creator-community-context"


import { useAuthContext } from "@/app/providers/auth-provider"
import { useRouter } from "next/navigation"

export default function CreatorDashboardPage() {
  const router = useRouter()
  const { user: authUser, isAuthenticated, loading: authLoading } = useAuthContext()

  // Use shared community context
  const {
    communities: creatorCommunities,
    selectedCommunity,
    selectedCommunityId,
    isLoading: communityLoading
  } = useCreatorCommunity()

  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any | null>(null)
  const [creatorCourses, setCreatorCourses] = useState<any[]>([])
  const [creatorChallenges, setCreatorChallenges] = useState<any[]>([])
  const [creatorSessions, setCreatorSessions] = useState<any[]>([])
  const [creatorPosts] = useState<any[]>([])
  const [userCommunities, setUserCommunities] = useState<any[]>([])
  const [overview, setOverview] = useState<any | null>(null)
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [membersCount, setMembersCount] = useState<number>(0)
  const [topContent, setTopContent] = useState<any[]>([])

  const getCommunityId = (community: any): string => {
    const rawId = community?.id ?? community?._id
    if (typeof rawId === 'string') return rawId
    if (rawId && typeof rawId.toString === 'function') return rawId.toString()
    return ''
  }

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/signin?redirect=/creator/dashboard')
    }
  }, [authLoading, isAuthenticated, router])

  // Reload data when selected community changes
  useEffect(() => {
    // Don't load data if not authenticated or community not selected
    if (!isAuthenticated || authLoading || communityLoading || !selectedCommunityId) {
      return
    }

    const load = async () => {
      try {
        setLoading(true)
        // Use authenticated user from context
        setUser(authUser)
        const userId = authUser?.id
        if (!userId) { setLoading(false); return }

        // If creator has no communities, redirect to create first one
        if (!creatorCommunities || creatorCommunities.length === 0) {
          router.push('/build-community')
          return
        }

        setUserCommunities(creatorCommunities)

        // Get selected community's slug for filtering
        const communitySlug = selectedCommunity?.slug || ''
        console.log('[Dashboard] Loading data for community:', { communitySlug, selectedCommunityId })

        // Parallel fetches - filter by selected community
        const toDate = new Date()
        const fromDate = new Date(toDate.getTime() - 30 * 24 * 3600 * 1000)

        const [coursesRes, challengesRes, sessionsRes, overviewRes, notifRes, topCoursesAgg, topChallengesAgg, topSessionsAgg] = await Promise.all([
          // 1. Courses: Always get creator's own courses (not community filtered)
          // Endpoint: /cours/user/created -> { success: true, data: { courses: [...] } }
          apiClient.get<any>(`/cours/user/created`, { limit: 100 }).catch((e) => { console.log('[Dashboard] Courses fetch error:', e); return null }),

          // 2. Challenges
          // If community: /challenges?communitySlug=... -> { challenges: [...] }
          // If no community: /challenges/by-user/:id?type=created -> { success: true, data: { challenges: [...] } }
          communitySlug
            ? apiClient.get<any>(`/challenges`, { communitySlug, limit: 50 }).catch((e) => { console.log('[Dashboard] Challenges fetch error:', e); return null })
            : apiClient.get<any>(`/challenges/by-user/${userId}`, { type: 'created', limit: 50 }).catch((e) => { console.log('[Dashboard] Challenges fetch error:', e); return null }),

          // 3. Sessions
          // Endpoint: /sessions?creatorId=... or ?communitySlug=... -> { sessions: [...] }
          communitySlug
            ? apiClient.get<any>(`/sessions`, { communitySlug, limit: 50 }).catch((e) => { console.log('[Dashboard] Sessions fetch error:', e); return null })
            : apiClient.get<any>(`/sessions`, { creatorId: userId, limit: 50 }).catch((e) => { console.log('[Dashboard] Sessions fetch error:', e); return null }),

          api.creatorAnalytics.getOverview({ from: fromDate.toISOString(), to: toDate.toISOString() }).catch(() => null as any),
          api.notifications.getAll({ page: 1, limit: 5 }).catch(() => null as any),
          api.creatorAnalytics.getCourses({ from: fromDate.toISOString(), to: toDate.toISOString() }).catch(() => null as any),
          api.creatorAnalytics.getChallenges({ from: fromDate.toISOString(), to: toDate.toISOString() }).catch(() => null as any),
          api.creatorAnalytics.getSessions({ from: fromDate.toISOString(), to: toDate.toISOString() }).catch(() => null as any),
        ])

        console.log('[Dashboard] Raw API responses:', JSON.stringify({ coursesRes, challengesRes, sessionsRes }, null, 2))

        // --- PARSING LOGIC ---

        // 1. Courses Parsing
        let courses: any[] = []
        if (coursesRes) {
          // Handle { success: true, data: { courses: [] } }
          if (coursesRes.data?.courses) courses = coursesRes.data.courses
          // Handle { courses: [] }
          else if (coursesRes.courses) courses = coursesRes.courses
          // Handle direct array
          else if (Array.isArray(coursesRes.data)) courses = coursesRes.data
          else if (Array.isArray(coursesRes)) courses = coursesRes
        }
        setCreatorCourses(Array.isArray(courses) ? courses : [])

        // 2. Challenges Parsing
        let challenges: any[] = []
        if (challengesRes) {
          // Handle { success: true, data: { challenges: [] } } (from by-user)
          if (challengesRes.data?.challenges) challenges = challengesRes.data.challenges
          // Handle { challenges: [] } (from findAll)
          else if (challengesRes.challenges) challenges = challengesRes.challenges
          // Handle direct array
          else if (Array.isArray(challengesRes.data)) challenges = challengesRes.data
          else if (Array.isArray(challengesRes)) challenges = challengesRes
        }
        setCreatorChallenges(Array.isArray(challenges) ? challenges : [])

        // 3. Sessions Parsing
        let sessions: any[] = []
        if (sessionsRes) {
          // Handle { sessions: [] } (from findAll)
          if (sessionsRes.sessions) sessions = sessionsRes.sessions
          // Handle { success: true, data: { sessions: [] } } (just in case)
          else if (sessionsRes.data?.sessions) sessions = sessionsRes.data.sessions
          // Handle direct array
          else if (Array.isArray(sessionsRes.data)) sessions = sessionsRes.data
          else if (Array.isArray(sessionsRes)) sessions = sessionsRes
        }
        setCreatorSessions(Array.isArray(sessions) ? sessions : [])

        setOverview(overviewRes?.data || overviewRes || null)

        const notifications = notifRes?.data || []
        setRecentActivity(Array.isArray(notifications) ? notifications.slice(0, 5) : [])

        // Get members count from selected community
        const community = selectedCommunity as any
        const finalMembersCount = community?.members || community?.membersCount || 0
        setMembersCount(typeof finalMembersCount === 'number' ? finalMembersCount : 0)

        // Build Top Performing Content (pick best from each type)
        const pickMetric = (item: any) => {
          const metrics: Array<{ key: string; label: string; value: number }> = [
            { key: 'completes', label: 'completes', value: Number(item?.completes || 0) },
            { key: 'starts', label: 'starts', value: Number(item?.starts || 0) },
            { key: 'views', label: 'views', value: Number(item?.views || 0) },
            { key: 'likes', label: 'likes', value: Number(item?.likes || 0) },
            { key: 'bookings', label: 'bookings', value: Number(item?.bookings || 0) },
            { key: 'participants', label: 'participants', value: Number(item?.participants || 0) },
            { key: 'downloads', label: 'downloads', value: Number(item?.downloads || 0) },
          ]
          const best = metrics.sort((a, b) => b.value - a.value)[0]
          return best
        }

        const normalize = (arr: any[], type: 'course' | 'challenge' | 'session') => {
          return (arr || []).map((x: any) => {
            const metric = pickMetric(x)
            const id = x?.contentId || x?._id || x?.id
            const title = x?.title || x?.name || `${type.charAt(0).toUpperCase() + type.slice(1)} ${String(id).slice(-6)}`
            const href = type === 'course' ? `/creator/courses/${id}/manage`
              : type === 'challenge' ? `/creator/challenges/${id}/manage`
                : `/creator/sessions/${id}/manage`
            return { id, title, type, metricLabel: metric.label, metricValue: metric.value, href }
          })
        }

        const byCourse = topCoursesAgg?.data?.byCourse || topCoursesAgg?.byCourse || []
        const byChallenge = topChallengesAgg?.data?.byChallenge || topChallengesAgg?.byChallenge || []
        const bySession = topSessionsAgg?.data?.bySession || topSessionsAgg?.bySession || []

        const tops = [
          ...normalize(byCourse, 'course'),
          ...normalize(byChallenge, 'challenge'),
          ...normalize(bySession, 'session'),
        ]
          .filter(Boolean)
          .sort((a, b) => (b.metricValue || 0) - (a.metricValue || 0))
          .slice(0, 4)

        setTopContent(tops)
      } catch (e) {
        console.error('[Dashboard] Load error:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [isAuthenticated, authLoading, authUser, communityLoading, selectedCommunityId, selectedCommunity, creatorCommunities, router])

  const stats = [
    {
      title: "Total Members",
      value: membersCount || (selectedCommunity as any)?.membersCount || (selectedCommunity as any)?.members || 0,
      change: { value: "+50", trend: "up" as const },
      icon: Users,
      color: "primary" as const,
    },
    {
      title: "Total Courses",
      value: creatorCourses?.length || 0,
      change: { value: "+2", trend: "up" as const },
      icon: BookOpen,
      color: "courses" as const,
    },
    {
      title: "Total Challenges",
      value: creatorChallenges?.length || 0,
      change: { value: "+1", trend: "up" as const },
      icon: Zap,
      color: "challenges" as const,
    },
    {
      title: "Total Sessions",
      value: creatorSessions?.length || 0,
      change: { value: "+3", trend: "up" as const },
      icon: Calendar,
      color: "sessions" as const,
    },
    {
      title: "Total Revenue",
      value: (() => {
        const rev = (overview?.revenue?.total)
          || overview?.totalRevenue
          || overview?.salesTotal
          || 0
        try { return typeof rev === 'number' ? `$${rev.toLocaleString()}` : String(rev) } catch { return `$${rev}` }
      })(),
      change: { value: "+20%", trend: "up" as const },
      icon: DollarSign,
      color: "success" as const,
    },
    {
      title: "Avg. Engagement",
      value: (() => {
        const eng = overview?.engagementRate || overview?.avgEngagement || 0
        const pct = typeof eng === 'number' ? Math.round(eng) : eng
        return `${pct}%`
      })(),
      change: { value: "+5%", trend: "up" as const },
      icon: TrendingUp,
      color: "primary" as const,
    },
  ]

  return (
    <div className="p-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Creator Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your creator content.</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Content
            </Button>
            <Button size="sm" asChild>
              <Link href={`/community/${selectedCommunity?.slug}/dashboard`}>
                <Eye className="h-4 w-4 mr-2" />
                View Community
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {stats.map((stat) => (
            <MetricCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>

        {/* Content Tabs */}
        <EnhancedCard className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Content Management</CardTitle>
            <CardDescription>Manage your courses, challenges, sessions and posts</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="challenges">Challenges</TabsTrigger>
                <TabsTrigger value="sessions">Sessions</TabsTrigger>
                <TabsTrigger value="posts">Posts</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Activity */}
                  <EnhancedCard>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <MessageSquare className="h-5 w-5 mr-2 text-primary-500" />
                        Recent Activity
                      </CardTitle>
                      <CardDescription>Latest interactions across your content</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentActivity.length === 0 && (
                          <div className="text-sm text-muted-foreground">No recent activity.</div>
                        )}
                        {recentActivity.map((n, idx) => (
                          <div key={n.id || idx} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{n.title || n.message || n.type || 'Activity'}</p>
                              <p className="text-xs text-muted-foreground">{new Date(n.createdAt || Date.now()).toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </EnhancedCard>

                  {/* Top Performing Content */}
                  <EnhancedCard>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Star className="h-5 w-5 mr-2 text-yellow-500" />
                        Top Performing Content
                      </CardTitle>
                      <CardDescription>Your most popular courses, challenges, and sessions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {topContent.length === 0 && (
                          <div className="text-sm text-muted-foreground">No top content yet.</div>
                        )}
                        {topContent.map((item) => {
                          const Icon = item.type === 'course' ? BookOpen : item.type === 'challenge' ? Zap : Calendar
                          const bg = item.type === 'course' ? 'bg-courses-50' : item.type === 'challenge' ? 'bg-challenges-50' : 'bg-sessions-50'
                          const iconColor = item.type === 'course' ? 'text-courses-500' : item.type === 'challenge' ? 'text-challenges-500' : 'text-sessions-500'
                          return (
                            <div key={`${item.type}-${item.id}`} className={`flex items-center space-x-3 p-3 ${bg} rounded-lg`}>
                              <Icon className={`h-5 w-5 ${iconColor} flex-shrink-0`} />
                              <div className="flex-1">
                                <p className="font-medium text-sm">{item.title}</p>
                                <p className="text-xs text-muted-foreground">{item.type.charAt(0).toUpperCase() + item.type.slice(1)} • {item.metricValue} {item.metricLabel}</p>
                              </div>
                              <Link href={item.href} className="text-sm text-primary-500 flex items-center">
                                View <ArrowRight className="h-3 w-3 ml-1" />
                              </Link>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </EnhancedCard>
                </div>
              </TabsContent>

              <TabsContent value="courses">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {creatorCourses.map((course) => (
                    <EnhancedCard key={course.id} hover className="overflow-hidden">
                      <div className="relative">
                        <Image
                          src={course.thumbnail || "/placeholder.svg?height=200&width=400&query=course+thumbnail"}
                          alt={course.title}
                          width={400}
                          height={200}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-courses-500 text-white">${course.price}</Badge>
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                        <CardDescription className="line-clamp-3">{course.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="h-4 w-4 mr-1" />
                          {course.enrollments.length} enrolled
                        </div>
                        <Button size="sm" asChild>
                          <Link href={`/creator/courses/${course.id}/manage`}>Manage</Link>
                        </Button>
                      </CardContent>
                    </EnhancedCard>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="challenges">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {creatorChallenges.map((challenge) => (
                    <EnhancedCard key={challenge.id} hover className="overflow-hidden">
                      <div className="relative">
                        <div className="bg-gradient-to-r from-challenges-500 to-orange-500 p-6 text-white">
                          <h3 className="text-xl font-bold mb-2">{challenge.title}</h3>
                          <p className="text-challenges-100 text-sm">{challenge.description}</p>
                        </div>
                      </div>
                      <CardContent className="flex items-center justify-between pt-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="h-4 w-4 mr-1" />
                          {challenge.participants.length} participants
                        </div>
                        <Button size="sm" asChild>
                          <Link href={`/creator/challenges/${challenge.id}/manage`}>Manage</Link>
                        </Button>
                      </CardContent>
                    </EnhancedCard>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="sessions">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {creatorSessions.map((session) => (
                    <EnhancedCard key={session.id} hover className="overflow-hidden">
                      <CardHeader>
                        <CardTitle className="line-clamp-2">{session.title}</CardTitle>
                        <CardDescription className="line-clamp-3">{session.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <DollarSign className="h-4 w-4 mr-1" />${session.price}
                        </div>
                        <Button size="sm" asChild>
                          <Link href={`/creator/sessions/${session.id}/manage`}>Manage</Link>
                        </Button>
                      </CardContent>
                    </EnhancedCard>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="posts">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {creatorPosts.map((post) => (
                    <EnhancedCard key={post.id} hover className="overflow-hidden">
                      <div className="relative">
                        {post.thumbnail && (
                          <Image
                            src={post.thumbnail || "/placeholder.svg"}
                            alt={post.title}
                            width={400}
                            height={200}
                            className="w-full h-48 object-cover"
                          />
                        )}
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                        <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {post.comments.length} comments
                        </div>
                        <Button size="sm" asChild>
                          <Link href={`/creator/posts/${post.id}/manage`}>Manage</Link>
                        </Button>
                      </CardContent>
                    </EnhancedCard>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </EnhancedCard>

        {/* Community Manager */}
        <CommunityManager communities={userCommunities} />
      </div>
    </div>
  )
}
