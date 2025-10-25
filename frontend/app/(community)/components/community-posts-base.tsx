"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, ArrowRight, Sparkles, Zap, Share2, Bookmark, MoreHorizontal, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

interface CommunityPostsBaseProps {
  posts: any[]
  variant: "modern" | "creative" | "minimal"
  title: string
  subtitle: string
}

export function CommunityPostsBase({ posts, variant, title, subtitle }: CommunityPostsBaseProps) {
  const [visiblePosts, setVisiblePosts] = useState<number[]>([])
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())

  useEffect(() => {
    const timer = setInterval(() => {
      setVisiblePosts((prev) => {
        if (prev.length < posts.length) {
          return [...prev, prev.length]
        }
        return prev
      })
    }, 150)

    return () => clearInterval(timer)
  }, [posts.length])
  const [sparkleStyles, setSparkleStyles] = useState<{
    left: string,
    top: string,
    animationDelay: string,
    animationDuration: string
  }[]>([]);

  useEffect(() => {
    if (variant === "creative") {
      const sparkles = Array.from({ length: 8 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${2 + Math.random() * 2}s`,
      }));
      setSparkleStyles(sparkles);
    }
  }, [variant]);

  const handleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  const getVariantStyles = () => {
    switch (variant) {
      case "modern":
        return {
          section: "py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden",
          badge: "bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200",
          title: "text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900",
          subtitle: "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600",
          card: "border-0 shadow-md hover:shadow-lg transition-all duration-500 hover:-translate-y-1 bg-white group",
          content: "p-4 sm:p-6",
        }
      case "creative":
        return {
          section:
            "py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-white via-pink-50 to-purple-50 relative overflow-hidden",
          badge: "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg hover:shadow-xl",
          title: "text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900",
          subtitle: "bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent",
          card: "border-0 shadow-lg overflow-hidden group hover:shadow-purple-500/25 transition-all duration-500 hover:scale-[1.02] bg-white",
          content: "p-4 sm:p-6",
        }
      case "minimal":
        return {
          section: "py-12 sm:py-16 lg:py-20 bg-white relative",
          badge: "border-gray-300 text-gray-600 bg-gray-50 hover:border-gray-900 hover:bg-gray-900 hover:text-white",
          title: "text-2xl sm:text-3xl lg:text-4xl font-extralight text-gray-900 tracking-tight",
          subtitle: "",
          card: "border-b border-gray-200 pb-8 last:border-b-0 group transition-all duration-500 hover:bg-gray-50/50",
          content: "space-y-6",
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <section className={styles.section}>
      {/* Background */}
      {variant === "modern" && (
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl animate-pulse"></div>
          <div
            className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/5 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>
      )}

      {variant === "creative" && (
        <div className="absolute inset-0">
         {sparkleStyles.map((style, i) => (
            <div key={i} className="absolute animate-pulse hidden sm:block" style={style}>
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-300/20" />
            </div>
          ))}

          <div className="absolute top-10 left-10 w-24 h-24 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full blur-xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-r from-orange-500/10 to-pink-500/10 rounded-full blur-xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>
      )}

      <div className={cn("mx-auto px-4 sm:px-6 lg:px-8", variant === "minimal" ? "max-w-4xl" : "max-w-7xl")}>
        <div className="text-center mb-8 sm:mb-12">
          {variant === "minimal" ? (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-1 h-1 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-1 h-1 sm:w-2 sm:h-2 bg-gray-900 rounded-full"></div>
                <div
                  className="w-1 h-1 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>
              <h2 className={styles.title}>{title}</h2>
              <div className="w-16 h-px bg-gray-300 mx-auto"></div>
              <p className="text-base sm:text-lg text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
                Thoughtful insights and meaningful conversations from our community.
              </p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              <Badge className={cn("px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-bold", styles.badge)}>
                {variant === "creative" && <Sparkles className="w-4 h-4 mr-2 animate-pulse" />}
                {title}
              </Badge>
              <h2 className={cn(styles.title, "mb-4")}>
                {subtitle} <span className={styles.subtitle}>{variant === "modern" ? "Insights" : "Creations"}</span>
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {variant === "modern"
                  ? "Stay updated with industry trends and professional insights from our community."
                  : "Discover amazing creations and inspiring stories from our creative community."}
              </p>
            </div>
          )}
        </div>

        <div
          className={cn(
            variant === "minimal" ? "space-y-8 sm:space-y-12" : "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6",
          )}
        >
          {posts.slice(0, variant === "minimal" ? 3 : 4).map((post, index) => {
            const isVisible = visiblePosts.includes(index)
            const isLiked = likedPosts.has(post.id)

            if (variant === "minimal") {
              return (
                <article
                  key={post.id}
                  className={cn(styles.card, isVisible ? "animate-in slide-in-from-bottom duration-500" : "opacity-0")}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className={styles.content}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3 sm:gap-0">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12 sm:w-14 sm:h-14 border-2 border-gray-200">
                          <AvatarImage src={post.authorAvatar || "/placeholder.svg"} alt={post.author} />
                          <AvatarFallback className="bg-gray-100 text-gray-900 font-light text-sm">
                            {post.author.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="text-base sm:text-lg font-light text-gray-900 tracking-wide">{post.author}</p>
                          <p className="text-xs text-gray-500 uppercase tracking-wider">{post.timestamp}</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-gray-300 text-gray-600 text-xs uppercase tracking-wider px-3 py-1"
                      >
                        {post.type}
                      </Badge>
                    </div>

                    <div className="sm:pl-16 space-y-4">
                      <p className="text-lg sm:text-xl font-light leading-relaxed text-gray-700 tracking-wide">
                        {post.content}
                      </p>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-8 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <span className="uppercase tracking-wider">{post.likes} likes</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <span className="uppercase tracking-wider">{post.comments} comments</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              )
            }

            return (
              <Card
                key={post.id}
                className={cn(styles.card, isVisible ? "animate-in slide-in-from-bottom duration-500" : "opacity-0")}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {variant === "creative" && (
                  <div className="relative h-32 sm:h-40 bg-gradient-to-br from-pink-400 via-purple-400 to-orange-400 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 animate-pulse" />
                        <p className="text-sm sm:text-base font-black">Creative Showcase</p>
                      </div>
                    </div>
                    <Badge className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0 px-2 py-1 font-black text-xs">
                      {post.type}
                    </Badge>
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 backdrop-blur-sm p-1">
                        <Share2 className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 backdrop-blur-sm p-1">
                        <Bookmark className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}

                <CardContent className={styles.content}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-4">
                    <div className="relative flex-shrink-0">
                      <Avatar
                        className={cn(
                          "ring-2 transition-all duration-300",
                          variant === "creative"
                            ? "w-12 h-12 sm:w-14 sm:h-14 ring-purple-200 group-hover:ring-purple-300"
                            : "w-10 h-10 sm:w-12 sm:h-12 ring-blue-100 group-hover:ring-blue-200",
                        )}
                      >
                        <AvatarImage src={post.authorAvatar || "/placeholder.svg"} alt={post.author} />
                        <AvatarFallback
                          className={cn(
                            "font-bold transition-colors duration-300",
                            variant === "creative"
                              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm"
                              : "bg-blue-100 text-blue-800 text-xs",
                          )}
                        >
                          {post.author.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border border-white flex items-center justify-center">
                        <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "font-bold transition-colors duration-300 truncate",
                          variant === "creative"
                            ? "font-black text-sm sm:text-base text-gray-900 group-hover:text-purple-600"
                            : "text-sm sm:text-base text-gray-900 group-hover:text-blue-600",
                        )}
                      >
                        {post.author}
                      </p>
                      <p
                        className={cn(
                          "text-xs font-medium",
                          variant === "creative" ? "text-purple-600 font-bold" : "text-gray-500",
                        )}
                      >
                        {post.timestamp}
                      </p>
                    </div>

                    <div className="flex items-center space-x-1 self-start sm:self-center">
                      {variant === "modern" && (
                        <Badge
                          variant="outline"
                          className={cn(
                            "font-semibold text-xs",
                            post.type === "announcement"
                              ? "border-blue-200 text-blue-800 bg-blue-50"
                              : "border-emerald-200 text-emerald-800 bg-emerald-50",
                          )}
                        >
                          {post.type}
                        </Badge>
                      )}
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 p-1">
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <p
                      className={cn(
                        "leading-relaxed",
                        variant === "creative"
                          ? "text-sm sm:text-base text-gray-700 font-medium"
                          : "text-sm text-gray-600",
                      )}
                    >
                      {post.content}
                    </p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "transition-all duration-300 hover:scale-110 p-1 group/like",
                            isLiked
                              ? variant === "creative"
                                ? "text-pink-500 hover:text-pink-600"
                                : "text-red-500 hover:text-red-600"
                              : "text-gray-400 hover:text-gray-600",
                          )}
                          onClick={() => handleLike(post.id)}
                        >
                          <Heart className={cn("w-4 h-4 mr-1", isLiked && "fill-current")} />
                          <span className="font-semibold text-xs">{post.likes + (isLiked ? 1 : 0)}</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-gray-600 transition-all duration-300 hover:scale-110 p-1"
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          <span className="font-semibold text-xs">{post.comments}</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-gray-600 transition-all duration-300 hover:scale-110 p-1"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          <span className="font-semibold text-xs">{post.views || Math.floor(Math.random() * 500)}</span>
                        </Button>

                        {variant === "creative" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-purple-400 hover:text-purple-600 transition-all duration-300 hover:scale-110 p-1"
                          >
                            <Zap className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "font-semibold transition-all duration-300 hover:scale-105 group/btn text-xs",
                          variant === "creative"
                            ? "text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                            : "text-blue-600 hover:text-blue-700 hover:bg-blue-50",
                        )}
                      >
                        {variant === "creative" ? "Explore" : "View Details"}
                        <ArrowRight className="ml-1 w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Compact Load More */}
        <div className="text-center mt-8 sm:mt-12">
          <Button
            size="lg"
            variant={variant === "minimal" ? "outline" : "default"}
            className={cn(
              "px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold transition-all duration-300 hover:scale-105 group",
              variant === "modern"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                : variant === "creative"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  : "border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white bg-transparent",
            )}
          >
            {variant === "creative" && <Sparkles className="mr-2 w-4 h-4 group-hover:animate-spin" />}
            {variant === "minimal" ? "View All Posts" : "Load More Posts"}
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  )
}
