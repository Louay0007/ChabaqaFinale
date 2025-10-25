"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  Star,
  CheckCircle,
  ArrowRight,
  Award,
  Sparkles,
  Wand2,
  Play,
  TrendingUp,
  Shield,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { JoinCommunityModal } from "@/app/(community)/components/join-community-modal"

interface CommunityHeroBaseProps {
  community: any
  variant: "modern" | "creative" | "minimal"
  className?: string
  children?: React.ReactNode
}


export function CommunityHeroBase({ community, variant, className, children }: CommunityHeroBaseProps) {
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])
  const [sparkleStyles, setSparkleStyles] = useState<{ 
    left: string, 
    top: string, 
    animationDelay: string, 
    animationDuration: string 
  }[]>([]);

  useEffect(() => {
    if (variant === "creative") {
      const newSparkles = Array.from({ length: 15 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${3 + Math.random() * 4}s`,
      }));
      setSparkleStyles(newSparkles);
    }
  }, [variant]);
  const formatPrice = (price: number, type: string) => {
    if (type === "free") return "Free"
    return `$${price}/${type === "monthly" ? "mo" : type}`
  }

  // Get dynamic colors from community settings
  const primaryColor = community.settings?.primaryColor || "#3b82f6"
  const secondaryColor = community.settings?.secondaryColor || "#1e40af"

  const getVariantStyles = () => {
    switch (variant) {
      case "modern":
        return {
          section: `bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden`,
          badge: `bg-blue-500/20 text-blue-300 border-blue-400/30 backdrop-blur-sm hover:bg-blue-500/30`,
          title: "text-white drop-shadow-2xl",
          description: "text-blue-100/90",
          creatorCard: "bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:bg-white/15",
          button: `bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-2xl`,
          icon: Award,
          statsCard: "bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15",
          accentColor: primaryColor,
        }
      case "creative":
        return {
          section: `bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900 text-white relative overflow-hidden`,
          badge: `bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white border-0 shadow-lg`,
          title: `bg-gradient-to-r from-pink-300 via-purple-300 to-orange-300 bg-clip-text text-transparent drop-shadow-2xl`,
          description: "text-pink-100/90",
          creatorCard: "bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl hover:bg-white/15",
          button: `bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 hover:from-pink-600 hover:via-purple-600 hover:to-orange-600 text-white shadow-2xl`,
          icon: Wand2,
          statsCard: "bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-sm border-white/20",
          accentColor: primaryColor,
        }
      case "minimal":
        return {
          section: "bg-white text-gray-900 relative",
          badge: "border-gray-900 text-gray-900 bg-gray-50 hover:bg-gray-900 hover:text-white",
          title: "text-gray-900",
          description: "text-gray-600",
          creatorCard: "border-2 border-gray-200 bg-gray-50/50 hover:border-gray-900 hover:bg-white",
          button: "border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white bg-transparent",
          icon: CheckCircle,
          statsCard: "border border-gray-200 bg-gray-50/50 hover:border-gray-900 hover:bg-white",
          accentColor: primaryColor,
        }
    }
  }

  const styles = getVariantStyles()
  const Icon = styles.icon

  return (
    <>
      <section
        id="community-hero"
        className={cn("relative h-screen flex items-center py-4 sm:py-6 lg:py-8", styles.section, className)}
        style={{
          background:
            variant === "modern"
              ? `linear-gradient(135deg, ${primaryColor}20 0%, ${secondaryColor}20 100%), linear-gradient(135deg, #0f172a 0%, #1e40af 50%, #3730a3 100%)`
              : variant === "creative"
                ? `linear-gradient(135deg, ${primaryColor}30 0%, ${secondaryColor}30 100%), linear-gradient(135deg, #7c2d12 0%, #be185d 50%, #ea580c 100%)`
                : undefined,
        }}
      >
        {/* Enhanced Background Effects */}
        {variant === "modern" && (
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                background: `radial-gradient(circle at 30% 20%, ${primaryColor}40, transparent 50%)`,
              }}
            ></div>
            <div
              className="absolute inset-0 opacity-40"
              style={{
                background: `radial-gradient(circle at 70% 80%, ${secondaryColor}40, transparent 50%)`,
              }}
            ></div>
            <div
              className="absolute top-10 left-10 w-16 h-16 rounded-full blur-xl animate-pulse"
              style={{ backgroundColor: `${primaryColor}20` }}
            ></div>
            <div
              className="absolute top-20 right-20 w-24 h-24 rounded-lg rotate-45 blur-xl animate-pulse"
              style={{
                backgroundColor: `${secondaryColor}20`,
                animationDelay: "1s",
              }}
            ></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
          </div>
        )}

        {variant === "creative" && (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]"></div>

            {sparkleStyles.map((style, i) => (
              <div
                key={i}
                className="absolute animate-float hidden sm:block"
                style={style}
              >
                <Sparkles
                  className="w-2 h-2 sm:w-3 sm:h-3 opacity-40"
                  style={{ color: primaryColor }}
                />
              </div>
            ))}
          </div>
        )}

        {variant === "minimal" && (
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <div className="absolute top-10 left-10 w-px h-16" style={{ backgroundColor: primaryColor }}></div>
            <div className="absolute top-10 left-10 w-16 h-px" style={{ backgroundColor: primaryColor }}></div>
            <div className="absolute bottom-10 right-10 w-px h-16" style={{ backgroundColor: secondaryColor }}></div>
            <div className="absolute bottom-10 right-10 w-16 h-px" style={{ backgroundColor: secondaryColor }}></div>
          </div>
        )}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            {/* Content */}
            <div
              className={cn(
                "space-y-4 sm:space-y-6 text-center lg:text-left",
                isVisible ? "animate-in slide-in-from-left duration-1000" : "opacity-0",
              )}
            >
              <div className="space-y-3 sm:space-y-4">
                <Badge
                  className={cn(
                    "px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-105 inline-flex items-center",
                    styles.badge,
                  )}
                  style={{
                    backgroundColor: variant === "minimal" ? "transparent" : `${primaryColor}30`,
                    borderColor: variant === "minimal" ? primaryColor : "transparent",
                    color: variant === "minimal" ? primaryColor : "white",
                  }}
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  {community.category} Community
                </Badge>

                <h1
                  className={cn(
                    "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tight",
                    styles.title,
                  )}
                >
                  {community.name}
                </h1>

                <p
                  className={cn(
                    "text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0",
                    styles.description,
                  )}
                >
                  {community.longDescription}
                </p>
              </div>

              {/* Creator Info with dynamic colors */}
              <div
                className={cn(
                  "flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 rounded-xl transition-all duration-500",
                  styles.creatorCard,
                )}
                style={{
                  backgroundColor: variant === "minimal" ? "transparent" : `${primaryColor}10`,
                  borderColor: variant === "minimal" ? `${primaryColor}30` : "transparent",
                }}
              >
                <div className="relative flex-shrink-0">
                  <Avatar
                    className={cn(
                      "w-12 h-12 sm:w-14 sm:h-14 ring-2",
                      variant === "minimal"
                        ? ""
                        : ""
                    )}
                    style={
                      variant === "minimal"
                        ? { boxShadow: `0 0 0 2px ${primaryColor}` }
                        : { boxShadow: `0 0 0 2px rgba(255,255,255,0.2)` }
                    }
                  >
                    <AvatarImage src={community.creatorAvatar || "/placeholder.svg"} alt={community.creator} />
                    <AvatarFallback
                      className="font-bold text-sm"
                      style={{
                        backgroundColor: primaryColor,
                        color: "white",
                      }}
                    >
                      {community.creator.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {community.verified && (
                    <div
                      className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <CheckCircle className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-xs font-medium opacity-70 uppercase tracking-wider">Created by</p>
                  <p className="text-sm sm:text-base font-bold">{community.creator}</p>
                  <div className="flex items-center justify-center sm:justify-start space-x-3 mt-1">
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span className="text-xs font-semibold">{community.members.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-semibold">{community.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

                {/* Stats with dynamic colors */}
                {variant !== "modern" && (
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                  { value: community.members.toLocaleString(), label: "Members", icon: Users },
                  { value: community.rating, label: "Rating", icon: Star },
                  { value: `${community.stats.engagementRate}%`, label: "Active", icon: TrendingUp },
                  ].map((stat, index) => (
                  <div
                    key={index}
                    className={cn(
                    "text-center p-2 sm:p-3 rounded-lg border transition-all duration-300 hover:scale-105",
                    styles.statsCard,
                    )}
                    style={{
                    backgroundColor: variant === "minimal" ? "transparent" : `${primaryColor}10`,
                    borderColor: variant === "minimal" ? `${primaryColor}30` : "rgba(255,255,255,0.2)",
                    }}
                  >
                    <stat.icon className="w-3 h-3 sm:w-4 sm:h-4 mx-auto mb-1" style={{ color: primaryColor }} />
                    <div className="text-sm sm:text-base font-black">{stat.value}</div>
                    <div className="text-xs font-semibold uppercase tracking-wider opacity-70">{stat.label}</div>
                  </div>
                  ))}
                </div>
                )}

              {/* CTA with dynamic colors */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <div className="text-center sm:text-left">
                  <div className="text-xl sm:text-2xl font-black">
                    {formatPrice(community.price, community.priceType)}
                  </div>
                  {community.priceType !== "free" && <div className="text-xs font-medium opacity-70">per month</div>}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button
                    size="sm"
                    className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-bold transition-all duration-300 hover:scale-105 group w-full sm:w-auto"
                    style={{
                      backgroundColor: primaryColor,
                      color: "white",
                    }}
                    onClick={() => setShowJoinModal(true)}
                  >
                    {variant === "creative" && <Sparkles className="mr-2 w-4 h-4 group-hover:animate-spin" />}
                    Join Community
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  {variant === "modern" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-3 sm:px-4 py-2 sm:py-3 text-sm font-semibold backdrop-blur-sm bg-transparent w-full sm:w-auto"
                      style={{
                        borderColor: "rgba(255,255,255,0.2)",
                        color: "white",
                      }}
                    >
                      <Play className="mr-2 w-3 h-3" />
                      Demo
                    </Button>
                  )}
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 pt-2 text-center sm:text-left">
                {[
                  { icon: Shield, text: community.priceType === "free" ? "Free" : "Cancel anytime" },
                  { icon: Zap, text: "Instant access" },
                  { icon: Award, text: "Expert support" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-1 px-2 py-1 rounded-full backdrop-blur-sm text-xs"
                    style={{
                      backgroundColor: variant === "minimal" ? `${primaryColor}10` : "rgba(255,255,255,0.1)",
                    }}
                  >
                    <item.icon className="w-3 h-3" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Element with dynamic accent */}
            <div
              className={cn(
                "relative order-first lg:order-last",
                isVisible ? "animate-in slide-in-from-right duration-1000 delay-300" : "opacity-0",
              )}
            >
              {children || (
                <div className="relative group">
                  <div className="relative z-10 overflow-hidden rounded-xl shadow-2xl">
                    <img
                      src={community.coverImage || "/placeholder.svg"}
                      alt={community.name}
                      className="w-full h-48 sm:h-64 lg:h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                    {/* Live indicator with dynamic color */}
                    <div
                      className="absolute top-3 right-3 backdrop-blur-sm rounded-lg p-2"
                      style={{ backgroundColor: `${primaryColor}20` }}
                    >
                      <div className="flex items-center space-x-1">
                        <div
                          className="w-2 h-2 rounded-full animate-pulse"
                          style={{ backgroundColor: primaryColor }}
                        ></div>
                        <span className="text-white font-semibold text-xs">Live</span>
                      </div>
                    </div>

                    {/* Bottom stats with dynamic styling */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <div
                        className="backdrop-blur-xl rounded-lg p-3 border"
                        style={{
                          backgroundColor: `${primaryColor}20`,
                          borderColor: `${primaryColor}30`,
                        }}
                      >
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <div className="text-sm font-bold text-white">{community.members.toLocaleString()}</div>
                            <div className="text-xs text-white/80">Members</div>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">{community.rating}</div>
                            <div className="text-xs text-white/80">Rating</div>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">{community.stats.engagementRate}%</div>
                            <div className="text-xs text-white/80">Active</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Background decoration with dynamic colors */}
                  <div
                    className="absolute -bottom-3 -right-3 w-full h-full rounded-xl blur-xl"
                    style={{
                      background: `linear-gradient(45deg, ${primaryColor}20, ${secondaryColor}20)`,
                    }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Join Modal */}
      {showJoinModal && <JoinCommunityModal community={community} onClose={() => setShowJoinModal(false)} />}
    </>
  )
}
