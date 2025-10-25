"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Heart,
  MessageSquare,
  Share,
  MoreHorizontal,
  ImageIcon,
  Send,
  Loader2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { postService } from "@/lib/services"
import type { Post, CreatePostDto } from "@/lib/types/post.types"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

interface CommunityFeedClientProps {
  communityId: string
  initialPosts: Post[]
  currentUserId?: string
}

export function CommunityFeedClient({
  communityId,
  initialPosts,
  currentUserId,
}: CommunityFeedClientProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [newPostContent, setNewPostContent] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      toast.error("Please write something")
      return
    }

    try {
      setIsCreating(true)
      const postData: CreatePostDto = {
        content: newPostContent,
        communityId,
      }
      
      const newPost = await postService.createPost(postData)
      setPosts([newPost, ...posts])
      setNewPostContent("")
      toast.success("Post created successfully!")
    } catch (error: any) {
      toast.error(error.message || "Failed to create post")
    } finally {
      setIsCreating(false)
    }
  }

  const handleLike = async (postId: string) => {
    const post = posts.find((p) => p._id === postId)
    if (!post) return

    try {
      setLoadingStates((prev) => ({ ...prev, [postId]: true }))
      
      if (post.isLiked) {
        const stats = await postService.unlikePost(postId)
        setPosts((prev) =>
          prev.map((p) =>
            p._id === postId
              ? { ...p, likes: stats.likes, isLiked: false }
              : p
          )
        )
      } else {
        const stats = await postService.likePost(postId)
        setPosts((prev) =>
          prev.map((p) =>
            p._id === postId
              ? { ...p, likes: stats.likes, isLiked: true }
              : p
          )
        )
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update like")
    } finally {
      setLoadingStates((prev) => ({ ...prev, [postId]: false }))
    }
  }

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return

    try {
      await postService.deletePost(postId)
      setPosts((prev) => prev.filter((p) => p._id !== postId))
      toast.success("Post deleted successfully")
    } catch (error: any) {
      toast.error(error.message || "Failed to delete post")
    }
  }

  return (
    <div className="space-y-6">
      {/* Create Post Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="Share something with the community..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="min-h-[100px] resize-none"
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" disabled>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Image
                  </Button>
                </div>
                <Button
                  onClick={handleCreatePost}
                  disabled={isCreating || !newPostContent.trim()}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Post
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      {posts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No posts yet. Be the first to share something!</p>
          </CardContent>
        </Card>
      ) : (
        posts.map((post) => (
          <Card key={post._id}>
            <CardContent className="pt-6">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback>
                      {post.author.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{post.author.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                {currentUserId === post.author._id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDelete(post._id)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {/* Post Content */}
              <p className="mb-4 whitespace-pre-wrap">{post.content}</p>

              {/* Post Images */}
              {post.images && post.images.length > 0 && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img
                    src={post.images[0]}
                    alt="Post image"
                    className="w-full h-auto"
                  />
                </div>
              )}

              {/* Post Actions */}
              <div className="flex items-center gap-4 pt-4 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(post._id)}
                  disabled={loadingStates[post._id]}
                  className={post.isLiked ? "text-red-500" : ""}
                >
                  {loadingStates[post._id] ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Heart
                      className={`h-4 w-4 mr-2 ${post.isLiked ? "fill-current" : ""}`}
                    />
                  )}
                  {post.likes}
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {post.commentsCount || 0}
                </Button>
                <Button variant="ghost" size="sm">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
