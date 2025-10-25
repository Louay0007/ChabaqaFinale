"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Users, Star, Calendar, Clock, Award } from "lucide-react"

interface FeatureHeroProps {
  feature: {
    id: string
    slug: string
    name: string
    creator: string
    creatorId: string
    creatorAvatar: string
    description: string
    category: string
    members: number
    rating: number
    price: number
    priceType: string
    image: string
    tags: string[]
    verified: boolean
    type: "community" | "course" | "challenge" | "event" | "oneToOne"
  }
}

export function FeatureHero({ feature }: FeatureHeroProps) {
  const getTypeConfig = (type: string) => {
    const configs = {
      community: {
        color: "from-blue-500 to-blue-600",
        badgeColor: "bg-blue-500",
        icon: Users,
        ctaText: "Join Community",
      },
      course: {
        color: "from-[#47c7ea] to-[#86e4fd]",
        badgeColor: "bg-[#47c7ea]",
        icon: Award,
        ctaText: "Start Learning",
      },
      challenge: {
        color: "from-[#ff9b28] to-[#fdb863]",
        badgeColor: "bg-[#ff9b28]",
        icon: Award,
        ctaText: "Join Challenge",
      },
      event: {
        color: "from-indigo-500 to-indigo-600",
        badgeColor: "bg-indigo-500",
        icon: Calendar,
        ctaText: "Register Now",
      },
      oneToOne: {
        color: "from-[#f65887] to-[#fb8ba8]",
        badgeColor: "bg-[#f65887]",
        icon: Clock,
        ctaText: "Book Session",
      },
    }
    return configs[type as keyof typeof configs] || configs.community
  }

  const typeConfig = getTypeConfig(feature.type)
  const IconComponent = typeConfig.icon

  const formatPrice = (price: number, type: string) => {
    if (type === "free") return "Free"
    if (type === "per session") return `$${price}/session`
    if (type === "one-time") return `$${price}`
    return `$${price}/${type === "monthly" ? "mo" : type}`
  }

  const getPlaceholderImage = (type: string) => {
    const queries = {
      community: "community group discussion networking",
      course: "online learning education course",
      challenge: "fitness challenge goal achievement",
      event: "live event workshop conference",
      oneToOne: "one on one consultation meeting",
    }
    return `/placeholder.svg?height=600&width=800&query=${queries[type as keyof typeof queries] || "professional content"}`
  }

  const getAvatarPlaceholder = () => {
    return `/placeholder.svg?height=120&width=120&query=professional avatar portrait`
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-purple-50/50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-br ${typeConfig.color} opacity-10 rounded-full blur-3xl`}
        />
        <div
          className={`absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-tr ${typeConfig.color} opacity-10 rounded-full blur-3xl`}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          {/* Left content */}
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Badge
                className={`${typeConfig.badgeColor} text-white border-0 px-2.5 sm:px-3 py-1 text-xs sm:text-sm font-semibold capitalize`}
              >
                <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
                {feature.type}
              </Badge>
              {feature.verified && (
                <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 px-2.5 sm:px-3 py-1 text-xs sm:text-sm font-semibold">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
                  Verified
                </Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight text-balance">
              {feature.name}
            </h1>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed text-pretty">{feature.description}</p>

            {/* Creator info */}
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <Image
                src={feature.creatorAvatar || getAvatarPlaceholder()}
                alt={feature.creator}
                width={48}
                height={48}
                className="rounded-full ring-2 ring-purple-100 sm:w-14 sm:h-14"
              />
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Created by</p>
                <p className="text-base sm:text-lg font-semibold text-gray-900">{feature.creator}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-white rounded-xl border border-gray-200 shadow-sm flex-1 min-w-[140px]">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-500">Members</p>
                  <p className="text-base sm:text-lg font-bold text-gray-900">{feature.members.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-white rounded-xl border border-gray-200 shadow-sm flex-1 min-w-[140px]">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-500">Rating</p>
                  <p className="text-base sm:text-lg font-bold text-gray-900">{feature.rating}</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2 sm:pt-4">
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {formatPrice(feature.price, feature.priceType)}
                </span>
                {feature.priceType !== "free" && (
                  <span className="text-xs sm:text-sm text-gray-500">{feature.priceType}</span>
                )}
              </div>
              <Button
                size="lg"
                className={`flex-1 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 bg-gradient-to-r ${typeConfig.color} text-white border-0 min-h-[48px] touch-manipulation`}
              >
                {typeConfig.ctaText}
              </Button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-2">
              {feature.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="border-purple-200 text-purple-700 bg-purple-50 font-medium px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Right image */}
          <div className="relative order-first lg:order-last">
            <div className="relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-4 sm:border-8 border-white">
              <Image
                src={feature.image || getPlaceholderImage(feature.type)}
                alt={feature.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-200">
              <div className="text-center">
                <p className="text-xs sm:text-sm text-gray-500 mb-0.5 sm:mb-1">Category</p>
                <p className="text-base sm:text-xl font-bold text-gray-900">{feature.category}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
