"use client"

import { useState, useEffect } from "react"
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
  Loader2,
  AlertCircle,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import Image from "next/image"
import { communityHomeApi, type CommunityHomeData } from "@/lib/api/community-home.api"
import { postsApi } from "@/lib/api/posts.api"
import type { Post, Challenge, Course, User } from "@/lib/api/types"

interface PostWithInteractions extends Post {
  isLiked?: boolean;
  isBookmarked?: boolean;
  shares?: number;
  images?: string[];
  tags?: string[];
}

export default function CommunityDashboard({ params }: { params: Promise<{ creator?: string; feature: string }> }) {
  const resolvedParams = React.use(params)
  const { creator, feature } = resolvedParams
  
  // State management
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<CommunityHomeData | null>(null)
  const [newPost, setNewPost] = useState("")
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set())
  const [postsPage, setPostsPage] = useState(1)

  // Fetch data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        const homeData = await communityHomeApi.getHomeData(feature, postsPage, 10)
        setData(homeData)
        
        // Initialize liked/bookmarked posts from user data if available
        // This would come from user preferences API in the future
      } catch (err: any) {
        console.error('Error fetching community home data:', err)
        setError(err.message || 'Failed to load community data')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [feature, postsPage])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary-500 mb-4" />
          <p className="text-gray-600">Loading community...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load community</h2>
          <p className="text-gray-600 mb-4">{error || 'Community not found'}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  const { community, posts, activeChallenges, courses, currentUser, stats } = data
  
  // Use /[creator_name]/[feature] route structure for all navigation
  const basePath = `/${community.creator.name}/${feature}`

  const handleLike = async (postId: string) => {
    const isLiked = likedPosts.has(postId)
    
    // Optimistic update
    setLikedPosts(prev => {
      const newSet = new Set(prev)
      if (isLiked) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })

    try {
      await postsApi.like(postId)
      // Refresh posts to get updated like count
      const updatedData = await communityHomeApi.getHomeData(feature, postsPage, 10)
      setData(updatedData)
    } catch (error) {
      console.error('Error liking post:', error)
      // Revert optimistic update
      setLikedPosts(prev => {
        const newSet = new Set(prev)
        if (isLiked) {
          newSet.add(postId)
        } else {
          newSet.delete(postId)
        }
        return newSet
      })
    }
  }

  const handleBookmark = (postId: string) => {
    // For now, bookmark is local only (no API endpoint yet)
    setBookmarkedPosts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  const handleCreatePost = async () => {
    if (!newPost.trim() || !currentUser || !community) return

    setIsCreatingPost(true)
    try {
      console.log('📝 Creating post with community:', { communityId: community.id, content: newPost })
      await postsApi.create({
        content: newPost,
        communityId: community.id,
      })
      
      // Refresh posts
      const updatedData = await communityHomeApi.getHomeData(feature, postsPage, 10)
      setData(updatedData)
      setNewPost("")
      console.log('✅ Post created successfully')
    } catch (error: any) {
      console.error('❌ Error creating post:', error)
      alert(error.message || 'Failed to create post')
    } finally {
      setIsCreatingPost(false)
    }
  }

  const formatTimeAgo = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  // Transform posts to include interaction state
  const postsWithInteractions: PostWithInteractions[] = posts.map(post => ({
    ...post,
    isLiked: likedPosts.has(post.id),
    isBookmarked: bookmarkedPosts.has(post.id),
    shares: 0, // TODO: Get from API if available
    images: [], // TODO: Get from API if available
    tags: [], // TODO: Extract from content or get from API
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col space-y-6">
          {/* Create Post */}
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                  <AvatarImage src={currentUser?.avatar || "/placeholder.svg?height=48&width=48"} />
                  <AvatarFallback>
                    {(currentUser?.username || currentUser?.firstName || 'U')
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
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
                      disabled={!newPost.trim() || isCreatingPost || !currentUser}
                      className="bg-primary-500 hover:bg-primary-600 text-white text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full transition-colors disabled:opacity-50"
                    >
                      {isCreatingPost ? (
                        <>
                          <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
                          <span className="hidden sm:inline">Posting...</span>
                        </>
                      ) : (
                        <>
                      <Send className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Post</span>
                        </>
                      )}
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
                {postsWithInteractions.length === 0 ? (
                  <Card className="border-0 shadow-sm bg-white">
                    <CardContent className="p-8 text-center">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
                      <p className="text-gray-600 mb-4">Be the first to share something with the community!</p>
                      {currentUser && (
                        <Button onClick={() => document.querySelector('textarea')?.focus()}>
                          Create First Post
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  postsWithInteractions.map((post) => (
                  <Card key={post.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      {/* Post Header */}
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                            <AvatarImage src={post.author.avatar || "/placeholder.svg?height=48&width=48"} />
                            <AvatarFallback>
                              {(post.author.username || post.author.firstName || 'U')
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-sm sm:text-base">
                              {post.author.username || post.author.firstName || 'Anonymous'}
                            </h4>
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
                        {post.title && (
                          <h3 className="font-semibold text-base sm:text-lg mb-2">{post.title}</h3>
                        )}
                        <p className="text-gray-800 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
                          {post.content}
                        </p>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
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
                      {post.images && post.images.length > 0 && (
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
                            {post.likesCount}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-blue-500 text-xs sm:text-sm">
                            <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            {post.commentsCount}
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
                  ))
                )}
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
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{activeChallenges[0].description}</p>
                      <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                        <span className="text-muted-foreground">Participants</span>
                        <span className="font-medium">{activeChallenges[0].participantCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs sm:text-sm mb-3">
                        <span className="text-muted-foreground">Days Left</span>
                        <span className="font-medium">
                          {Math.ceil((new Date(activeChallenges[0].endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                        </span>
                      </div>
                      <Button size="sm" className="w-full bg-challenges-500 hover:bg-challenges-600 text-xs sm:text-sm" asChild>
                        <Link href={`${basePath}/challenges`}>Continue Challenge</Link>
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
                    <Link href={`${basePath}/courses`}>
                      <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3" />
                      Browse Courses
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent text-xs sm:text-sm" asChild>
                    <Link href={`${basePath}/sessions`}>
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3" />
                      Book 1-on-1 Session
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent text-xs sm:text-sm" asChild>
                    <Link href={`${basePath}/progress`}>
                      <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-3" />
                      View Progress
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent text-xs sm:text-sm" asChild>
                    <Link href={`${basePath}/achievements`}>
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
                    <Link href={`${basePath}/courses`}>View All Courses</Link>
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
                    <span className="font-semibold">{stats.activeToday.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Posts This Week</span>
                    <span className="font-semibold">{stats.postsThisWeek.toLocaleString()}</span>
                  </div>
                  {stats.userRank && (
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Your Rank</span>
                      <span className="font-semibold text-primary-600">#{stats.userRank}</span>
                  </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}