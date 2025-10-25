"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
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

interface DashboardClientProps {
  communities: any[]
  courses: any[]
  challenges: any[]
  sessions: any[]
  posts: any[]
  analytics: any
}

export default function DashboardClient({
  communities,
  courses,
  challenges,
  sessions,
  posts,
  analytics,
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const selectedCommunity = communities[0]
  
  const stats = [
    {
      title: "Total Members",
      value: selectedCommunity?.membersCount || 0,
      change: { value: "+50", trend: "up" as const },
      icon: Users,
      color: "primary" as const,
    },
    {
      title: "Total Courses",
      value: courses.length,
      change: { value: "+2", trend: "up" as const },
      icon: BookOpen,
      color: "courses" as const,
    },
    {
      title: "Total Challenges",
      value: challenges.length,
      change: { value: "+1", trend: "up" as const },
      icon: Zap,
      color: "challenges" as const,
    },
    {
      title: "Total Sessions",
      value: sessions.length,
      change: { value: "+3", trend: "up" as const },
      icon: Calendar,
      color: "sessions" as const,
    },
    {
      title: "Total Views",
      value: analytics.totals?.views || 0,
      change: { value: "+20%", trend: "up" as const },
      icon: Eye,
      color: "success" as const,
    },
    {
      title: "Avg. Engagement",
      value: analytics.totals?.likes ? `${Math.round((analytics.totals.likes / analytics.totals.views) * 100)}%` : "0%",
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
            {selectedCommunity && (
              <Button size="sm" asChild>
                <Link href={`/${selectedCommunity.slug}/home`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Community
                </Link>
              </Button>
            )}
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
                <TabsTrigger value="courses">Courses ({courses.length})</TabsTrigger>
                <TabsTrigger value="challenges">Challenges ({challenges.length})</TabsTrigger>
                <TabsTrigger value="sessions">Sessions ({sessions.length})</TabsTrigger>
                <TabsTrigger value="posts">Posts ({posts.length})</TabsTrigger>
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
                        {analytics.topContents?.slice(0, 4).map((content: any, idx: number) => (
                          <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Activity in {content.contentType}</p>
                              <p className="text-xs text-muted-foreground">{content.views} views • {content.completes} completions</p>
                            </div>
                          </div>
                        ))}
                        {analytics.topContents?.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-4">No activity yet</p>
                        )}
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
                        {/* Top Course */}
                        {courses[0] && (
                          <div className="flex items-center space-x-3 p-3 bg-courses-50 rounded-lg">
                            <BookOpen className="h-5 w-5 text-courses-500 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{courses[0].titre || courses[0].title}</p>
                              <p className="text-xs text-muted-foreground">Course • {courses[0].enrollmentsCount || 0} enrollments</p>
                            </div>
                            <Link href={`/creator/courses/${courses[0]._id}`} className="text-sm text-primary-500 flex items-center">
                              View <ArrowRight className="h-3 w-3 ml-1" />
                            </Link>
                          </div>
                        )}
                        {/* Top Challenge */}
                        {challenges[0] && (
                          <div className="flex items-center space-x-3 p-3 bg-challenges-50 rounded-lg">
                            <Zap className="h-5 w-5 text-challenges-500 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{challenges[0].title}</p>
                              <p className="text-xs text-muted-foreground">Challenge • {challenges[0].participants?.length || 0} participants</p>
                            </div>
                            <Link href={`/creator/challenges/${challenges[0]._id}`} className="text-sm text-primary-500 flex items-center">
                              View <ArrowRight className="h-3 w-3 ml-1" />
                            </Link>
                          </div>
                        )}
                        {/* Top Session */}
                        {sessions[0] && (
                          <div className="flex items-center space-x-3 p-3 bg-sessions-50 rounded-lg">
                            <Calendar className="h-5 w-5 text-sessions-500 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{sessions[0].title}</p>
                              <p className="text-xs text-muted-foreground">Session • {sessions[0].bookings?.length || 0} bookings</p>
                            </div>
                            <Link href={`/creator/sessions/${sessions[0]._id}`} className="text-sm text-primary-500 flex items-center">
                              View <ArrowRight className="h-3 w-3 ml-1" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </EnhancedCard>
                </div>
              </TabsContent>

              <TabsContent value="courses">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course: any) => (
                    <EnhancedCard key={course._id} hover className="overflow-hidden">
                      <div className="relative">
                        <Image
                          src={course.thumbnail || "/placeholder.svg?height=200&width=400"}
                          alt={course.titre || course.title}
                          width={400}
                          height={200}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-courses-500 text-white">${course.prix || course.price || 0}</Badge>
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-2">{course.titre || course.title}</CardTitle>
                        <CardDescription className="line-clamp-3">{course.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="h-4 w-4 mr-1" />
                          {course.enrollmentsCount || 0} enrolled
                        </div>
                        <Button size="sm" asChild>
                          <Link href={`/creator/courses/${course._id}/manage`}>Manage</Link>
                        </Button>
                      </CardContent>
                    </EnhancedCard>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="challenges">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {challenges.map((challenge: any) => (
                    <EnhancedCard key={challenge._id} hover className="overflow-hidden">
                      <div className="relative">
                        <div className="bg-gradient-to-r from-challenges-500 to-orange-500 p-6 text-white">
                          <h3 className="text-xl font-bold mb-2">{challenge.title}</h3>
                          <p className="text-challenges-100 text-sm">{challenge.description}</p>
                        </div>
                      </div>
                      <CardContent className="flex items-center justify-between pt-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="h-4 w-4 mr-1" />
                          {challenge.participants?.length || 0} participants
                        </div>
                        <Button size="sm" asChild>
                          <Link href={`/creator/challenges/${challenge._id}/manage`}>Manage</Link>
                        </Button>
                      </CardContent>
                    </EnhancedCard>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="sessions">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sessions.map((session: any) => (
                    <EnhancedCard key={session._id} hover className="overflow-hidden">
                      <CardHeader>
                        <CardTitle className="line-clamp-2">{session.title}</CardTitle>
                        <CardDescription className="line-clamp-3">{session.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <DollarSign className="h-4 w-4 mr-1" />${session.price || 0}
                        </div>
                        <Button size="sm" asChild>
                          <Link href={`/creator/sessions/${session._id}`}>Manage</Link>
                        </Button>
                      </CardContent>
                    </EnhancedCard>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="posts">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post: any) => (
                    <EnhancedCard key={post._id} hover className="overflow-hidden">
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
                        <CardDescription className="line-clamp-3">{post.content}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {post.commentsCount || 0} comments
                        </div>
                        <Button size="sm" asChild>
                          <Link href={`/creator/posts/${post._id}`}>View</Link>
                        </Button>
                      </CardContent>
                    </EnhancedCard>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </EnhancedCard>
      </div>
    </div>
  )
}
