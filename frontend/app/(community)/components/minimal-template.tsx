"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Minus, Circle, Square, Triangle, Plus, X, Check, Dot, Hash } from "lucide-react"
import { CommunityHeroBase } from "@/app/(community)/components/community-hero-base"
import { CommunityFeaturesBase } from "@/app/(community)/components/community-features-base"
import { CommunityPostsBase } from "@/app/(community)/components/community-posts-base"

interface MinimalTemplateProps {
  community: any
  posts: any[]
}

export function MinimalTemplate({ community, posts }: MinimalTemplateProps) {
  const iconSet = [Circle, Square, Triangle, Minus, Plus, X, Check, ArrowRight, Dot, Hash]

  return (
    <div className="min-h-screen bg-white">
      <CommunityHeroBase community={community} variant="minimal" className="relative py-20">
        {/* Enhanced minimal geometric visual */}
        <div className="relative">
          <div className="grid grid-cols-3 gap-6 sm:gap-8">
            <div className="space-y-6 sm:space-y-8">
              <div className="aspect-square bg-gray-100 rounded-lg transition-all duration-700 hover:bg-gray-900 hover:scale-105"></div>
              <div className="aspect-square border-2 border-gray-200 rounded-lg transition-all duration-700 hover:border-gray-900 hover:scale-105"></div>
            </div>
            <div className="space-y-6 sm:space-y-8 mt-10 sm:mt-16">
              <div className="aspect-square border-2 border-gray-200 rounded-lg transition-all duration-700 hover:border-gray-900 hover:scale-105"></div>
              <div className="aspect-square bg-gray-900 rounded-lg transition-all duration-700 hover:bg-gray-700 hover:scale-105"></div>
            </div>
            <div className="space-y-6 sm:space-y-8">
              <div className="aspect-square border-2 border-gray-200 rounded-lg transition-all duration-700 hover:border-gray-900 hover:scale-105"></div>
              <div className="aspect-square bg-gray-100 rounded-lg transition-all duration-700 hover:bg-gray-900 hover:scale-105"></div>
            </div>
          </div>

          {/* Subtle background lines */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-0 w-full h-px bg-gray-200"></div>
            <div className="absolute top-0 left-1/2 w-px h-full bg-gray-200"></div>
          </div>
        </div>
      </CommunityHeroBase>

      <CommunityFeaturesBase
        community={community}
        variant="minimal"
        title="Essential Features"
        subtitle="Focused Tools"
        iconSet={iconSet}
      />

      <CommunityPostsBase posts={posts} variant="minimal" title="Recent Thoughts" subtitle="Community" />

      {/* Compact Minimal Benefits */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-center">
            <div className="space-y-8 sm:space-y-12">
              <div className="space-y-6 sm:space-y-8">
                <div className="space-y-4">
                  <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-gray-900 tracking-tight leading-tight">
                    Why Join
                  </h2>
                  <div className="w-16 h-px bg-gray-300"></div>
                </div>
                <p className="text-lg sm:text-xl text-gray-600 font-light leading-relaxed tracking-wide">
                  A carefully curated community focused on quality, depth, and meaningful connections.
                </p>
              </div>

              <div className="space-y-6 sm:space-y-8">
                {community.settings.benefits.slice(0, 3).map((benefit: string, index: number) => (
                  <div key={index} className="flex items-start space-x-4 sm:space-x-6 group">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 border border-gray-300 rounded-full flex items-center justify-center flex-shrink-0 mt-2 group-hover:border-gray-900 transition-all duration-500">
                      <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-gray-900 transition-colors duration-500" />
                    </div>
                    <div className="space-y-2 sm:space-y-3 flex-1">
                      <p className="text-lg sm:text-xl font-light text-gray-900 leading-relaxed tracking-wide group-hover:text-gray-700 transition-colors duration-300">
                        {benefit}
                      </p>
                      <div className="w-8 h-px bg-gray-200 group-hover:bg-gray-900 group-hover:w-16 transition-all duration-500"></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <Button
                  variant="outline"
                  className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-12 sm:px-16 py-4 sm:py-6 text-base sm:text-lg font-light bg-transparent tracking-wide transition-all duration-500 hover:scale-105"
                >
                  <a href="#join-section" className="flex items-center">
                    Learn More
                    <ArrowRight className="ml-3 w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-3 gap-6 sm:gap-8">
                <div className="space-y-6 sm:space-y-8">
                  <div className="aspect-square bg-gray-100 rounded-lg transition-all duration-700 hover:bg-gray-900"></div>
                  <div className="aspect-square border-2 border-gray-200 rounded-lg transition-all duration-700 hover:border-gray-900"></div>
                </div>
                <div className="space-y-6 sm:space-y-8 mt-10 sm:mt-16">
                  <div className="aspect-square border-2 border-gray-200 rounded-lg transition-all duration-700 hover:border-gray-900"></div>
                  <div className="aspect-square bg-gray-900 rounded-lg transition-all duration-700 hover:bg-gray-700"></div>
                </div>
                <div className="space-y-6 sm:space-y-8">
                  <div className="aspect-square border-2 border-gray-200 rounded-lg transition-all duration-700 hover:border-gray-900"></div>
                  <div className="aspect-square bg-gray-100 rounded-lg transition-all duration-700 hover:bg-gray-900"></div>
                </div>
              </div>

              {/* Subtle grid overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Compact Minimal Statistics */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-gray-900 tracking-tight mb-4">
              Community Impact
            </h2>
            <div className="w-20 h-px bg-gray-300 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-12">
            {[
              { number: community.members.toLocaleString(), label: "Members" },
              { number: community.rating, label: "Rating" },
              { number: `${community.stats.engagementRate}%`, label: "Engagement" },
              { number: `${community.stats.retentionRate}%`, label: "Retention" },
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="space-y-4">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mx-auto group-hover:bg-gray-900 transition-colors duration-500"></div>
                  <div className="text-3xl sm:text-4xl font-extralight text-gray-900 tracking-tight">{stat.number}</div>
                  <div className="w-12 h-px bg-gray-200 mx-auto group-hover:bg-gray-900 group-hover:w-16 transition-all duration-500"></div>
                  <div className="text-sm sm:text-base text-gray-600 font-light uppercase tracking-[0.2em]">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compact Minimal CTA */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8 sm:space-y-12">
            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extralight text-gray-900 tracking-tight leading-tight">
                Simple.
                <br />
                Focused.
                <br />
                <span className="text-gray-500">Essential.</span>
              </h2>

              <div className="w-24 h-px bg-gray-300 mx-auto"></div>

              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 font-light tracking-wide max-w-3xl mx-auto leading-relaxed">
                {community.settings.welcomeMessage ||
                  "Join a community that values quality over quantity, depth over breadth, and meaning over noise."}
              </p>
            </div>

            <div className="space-y-6 sm:space-y-8">
              <Button
                size="lg"
                className="bg-gray-900 text-white hover:bg-gray-800 px-12 sm:px-16 py-4 sm:py-6 text-lg sm:text-xl font-light tracking-wide transition-all duration-700 hover:scale-105"
              >
                <a href="#join-section">Begin Journey</a>
              </Button>

              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-gray-400 text-sm sm:text-base">
                <div className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span className="uppercase tracking-[0.2em] font-light">No Distractions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span className="uppercase tracking-[0.2em] font-light">Pure Focus</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span className="uppercase tracking-[0.2em] font-light">
                    {community.priceType === "free" ? "Free Access" : "Essential Only"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
