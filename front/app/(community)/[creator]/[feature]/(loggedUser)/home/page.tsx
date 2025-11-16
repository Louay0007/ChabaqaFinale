"use client"

import { useState } from "react"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Heart,
  MessageSquare,
  Share,
  Bookmark,
  MoreHorizontal,
  ImageIcon,
  Video,
  LinkIcon,
  Send,
  Smile,
  Calendar,
  BookOpen,
  Zap,
  Trophy,
  Users,
  TrendingUp,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import Image from "next/image"
import { getCommunityBySlug, mockUsers, getActiveChallengesByCommunity, getCoursesByCommunity } from "@/lib/mock-data"

const mockPosts = [
  {
    id: "1",
    content:
      "Just completed Day 18 of the 30-Day Coding Challenge! 🎉 Built a weather app with React and integrated with OpenWeatherMap API. The async/await concepts are finally clicking! Here's what I learned today...",
    author: {
      id: "2",
      name: "Mike Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "member" as const,
    },
    createdAt: new Date("2024-02-20T14:30:00"),
    likes: 24,
    comments: 8,
    shares: 3,
    images: ["/placeholder.svg?height=300&width=400"],
    tags: ["challenge", "react", "api"],
    isLiked: false,
    isBookmarked: true,
  },
  {
    id: "2",
    content:
      "Quick tip for anyone struggling with CSS Flexbox: Use 'justify-content' for horizontal alignment and 'align-items' for vertical alignment. This simple mental model changed everything for me! 💡",
    author: {
      id: "3",
      name: "Emily Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "member" as const,
    },
    createdAt: new Date("2024-02-20T10:15:00"),
    likes: 42,
    comments: 12,
    shares: 8,
    images: [],
    tags: ["css", "flexbox", "tip"],
    isLiked: true,
    isBookmarked: false,
  },
  {
    id: "3",
    content:
      "Excited to announce that I just landed my first developer job! 🚀 The portfolio projects from this community really made the difference. Special thanks to Sarah for the amazing courses and everyone for the support!",
    author: {
      id: "4",
      name: "David Kim",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "member" as const,
    },
    createdAt: new Date("2024-02-19T16:45:00"),
    likes: 89,
    comments: 23,
    shares: 15,
    images: [],
    tags: ["success", "job", "portfolio"],
    isLiked: true,
    isBookmarked: true,
  },
]

export default function CommunityDashboard({ params }: { params: Promise<{ feature: string }> }) {
  const [newPost, setNewPost] = useState("")
  const [posts, setPosts] = useState(mockPosts)
  const { feature } = React.use(params)
  const community = getCommunityBySlug(feature)
  const currentUser = mockUsers[1] // Member user
  const activeChallenges = getActiveChallengesByCommunity(community?.id || "")
  const courses = getCoursesByCommunity(community?.id || "")

  if (!community) {
    return <div className="p-4 text-center text-gray-600">Community not found</div>
  }

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    )
  }

  const handleBookmark = (postId: string) => {
    setPosts(posts.map((post) => (post.id === postId ? { ...post, isBookmarked: !post.isBookmarked } : post)))
  }

  const handleCreatePost = () => {
    if (newPost.trim()) {
      const post = {
        id: Date.now().toString(),
        content: newPost,
        author: currentUser,
        createdAt: new Date(),
        likes: 0,
        comments: 0,
        shares: 0,
        images: [],
        tags: [],
        isLiked: false,
        isBookmarked: false,
      }
      setPosts([post, ...posts])
      setNewPost("")
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col space-y-6">
          {/* Create Post */}
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                  <AvatarImage src={currentUser.avatar || "/placeholder.svg?height=48&width=48"} />
                  <AvatarFallback>
                    {currentUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <Textarea
                    placeholder="Share your progress, ask questions, or celebrate wins..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="min-h-[80px] sm:min-h-[100px] resize-none border-0 bg-gray-100 rounded-lg focus-visible:ring-2 focus-visible:ring-primary-300 text-sm transition-all duration-200"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:bg-gray-100 hover:text-primary-500 transition-colors rounded-full p-2 sm:p-3"
                        title="Add Photo"
                      >
                        <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="hidden sm:inline ml-2 text-xs sm:text-sm">Photo</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:bg-gray-100 hover:text-primary-500 transition-colors rounded-full p-2 sm:p-3"
                        title="Add Video"
                      >
                        <Video className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="hidden sm:inline ml-2 text-xs sm:text-sm">Video</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:bg-gray-100 hover:text-primary-500 transition-colors rounded-full p-2 sm:p-3"
                        title="Add Link"
                      >
                        <LinkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="hidden sm:inline ml-2 text-xs sm:text-sm">Link</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:bg-gray-100 hover:text-primary-500 transition-colors rounded-full p-2 sm:p-3"
                        title="Add Emoji"
                      >
                        <Smile className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="hidden sm:inline ml-2 text-xs sm:text-sm">Emoji</span>
                      </Button>
                    </div>
                    <Button
                      onClick={handleCreatePost}
                      disabled={!newPost.trim()}
                      className="bg-primary-500 hover:bg-primary-600 text-white text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full transition-colors"
                    >
                      <Send className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Post</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Feed */}
            <div className="lg:col-span-3 space-y-6">
              {/* Posts Feed */}
              <div className="space-y-6">
                {posts.map((post) => (
                  <Card key={post.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      {/* Post Header */}
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                            <AvatarImage src={post.author.avatar || "/placeholder.svg?height=48&width=48"} />
                            <AvatarFallback>
                              {post.author.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-sm sm:text-base">{post.author.name}</h4>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {formatTimeAgo(post.createdAt)} • {post.author.role}
                            </p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8">
                              <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Save post</DropdownMenuItem>
                            <DropdownMenuItem>Hide post</DropdownMenuItem>
                            <DropdownMenuItem>Report post</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Post Content */}
                      <div className="mb-3 sm:mb-4">
                        <p className="text-gray-800 leading-relaxed text-sm sm:text-base">{post.content}</p>

                        {/* Tags */}
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2 sm:mt-3">
                            {post.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Post Images */}
                      {post.images.length > 0 && (
                        <div className="mb-3 sm:mb-4">
                          <div className="grid grid-cols-1 gap-2">
                            {post.images.map((image, index) => (
                              <div key={index} className="relative rounded-lg overflow-hidden">
                                <Image
                                  src={image || "/placeholder.svg"}
                                  alt="Post image"
                                  width={600}
                                  height={300}
                                  className="w-full h-auto object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Post Actions */}
                      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t">
                        <div className="flex items-center space-x-4 sm:space-x-6">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(post.id)}
                            className={`${post.isLiked ? "text-red-500" : "text-muted-foreground"} hover:text-red-500 text-xs sm:text-sm`}
                          >
                            <Heart className={`h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 ${post.isLiked ? "fill-current" : ""}`} />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-blue-500 text-xs sm:text-sm">
                            <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            {post.comments}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-green-500 text-xs sm:text-sm">
                            <Share className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            {post.shares}
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleBookmark(post.id)}
                          className={`${post.isBookmarked ? "text-yellow-500" : "text-muted-foreground"} hover:text-yellow-500 text-xs sm:text-sm`}
                        >
                          <Bookmark className={`h-3 w-3 sm:h-4 sm:w-4 ${post.isBookmarked ? "fill-current" : ""}`} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Active Challenge */}
              {activeChallenges.length > 0 && (
                <Card className="border-0 shadow-sm bg-gradient-to-br from-challenges-50 to-orange-50">
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="flex items-center text-base sm:text-lg">
                      <Zap className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-challenges-500" />
                      Active Challenge
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm sm:text-base">{activeChallenges[0].title}</h4>
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-muted-foreground">Your Progress</span>
                        <span className="font-medium">Day 18/30</span>
                      </div>
                      <div className="w-full bg-white/50 rounded-full h-1.5 sm:h-2">
                        <div className="bg-challenges-500 h-1.5 sm:h-2 rounded-full" style={{ width: "60%" }} />
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm gap-2">
                        <div className="flex items-center text-muted-foreground">
                          <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          {activeChallenges[0].participants.length} participants
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          12 days left
                        </div>
                      </div>
                      <Button size="sm" className="w-full bg-challenges-500 hover:bg-challenges-600 text-xs sm:text-sm" asChild>
                        <Link href={`/community/${feature}/challenge`}>Continue Challenge</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3 p-4 sm:p-6">
                  <Button variant="outline" className="w-full justify-start bg-transparent text-xs sm:text-sm" asChild>
                    <Link href={`/${feature}/courses`}>
                      <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3" />
                      Browse Courses
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent text-xs sm:text-sm" asChild>
                    <Link href={`/${feature}/sessions`}>
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3" />
                      Book 1-on-1 Session
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent text-xs sm:text-sm" asChild>
                    <Link href={`/${feature}/progress`}>
                      <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3" />
                      View Progress
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent text-xs sm:text-sm" asChild>
                    <Link href={`/community/${feature}/achievements`}>
                      <Trophy className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3" />
                      Achievements
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Courses */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="text-base sm:text-lg">Continue Learning</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3 p-4 sm:p-6">
                  {courses.slice(0, 2).map((course) => (
                    <div key={course.id} className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-courses-50 rounded-lg">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-courses-200 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-courses-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-xs sm:text-sm truncate">{course.title}</h4>
                        <div className="flex items-center mt-1">
                          <div className="w-14 sm:w-16 bg-gray-200 rounded-full h-1 sm:h-1.5 mr-1 sm:mr-2">
                            <div className="bg-courses-500 h-1 sm:h-1.5 rounded-full" style={{ width: "65%" }} />
                          </div>
                          <span className="text-xs text-muted-foreground">65%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" className="w-full text-xs sm:text-sm" asChild>
                    <Link href={`/community/${feature}/courses`}>View All Courses</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Community Stats */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="text-base sm:text-lg">Community</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3 p-4 sm:p-6">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Total Members</span>
                    <span className="font-semibold">{community.members.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Active Today</span>
                    <span className="font-semibold">247</span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Posts This Week</span>
                    <span className="font-semibold">89</span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Your Rank</span>
                    <span className="font-semibold text-primary-600">#47</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}