"use client"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Zap, Heart, Palette, Camera, Brush, Wand2, Lightbulb, Music, Star, Rainbow } from "lucide-react"
import { CommunityHeroBase } from "@/app/(community)/components/community-hero-base"
import { CommunityFeaturesBase } from "@/app/(community)/components/community-features-base"
import { CommunityPostsBase } from "@/app/(community)/components/community-posts-base"

interface CreativeTemplateProps {
  community: any
  posts: any[]
}

export function CreativeTemplate({ community, posts }: CreativeTemplateProps) {
  const iconSet = [Palette, Sparkles, Wand2, Heart, Camera, Music, Brush, Zap, Star, Rainbow]
  const [floaters, setFloaters] = useState<
    { left: string; top: string; animationDelay: string; animationDuration: string }[]
  >([])

  useEffect(() => {
    const floats = Array.from({ length: 20 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${3 + Math.random() * 4}s`,
    }))
    setFloaters(floats)
  }, [])
  return (
    <div className="min-h-screen bg-white">
      {/* Creative Hero with enhanced animated background */}
      <CommunityHeroBase community={community} variant="creative" className="relative">
        {/* Custom creative visual element */}
        <div className="relative">
          <div className="relative z-10 grid grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl p-6 sm:p-8 transform rotate-2 hover:rotate-0 transition-all duration-700 shadow-xl hover:shadow-pink-500/25 group">
                <Camera className="w-10 h-10 sm:w-12 sm:h-12 text-white mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-white font-black text-lg sm:text-xl">
                  {community.settings.features[0] || "Visual Arts"}
                </h3>
                <p className="text-pink-100 mt-2 font-medium text-sm">Create stunning visuals</p>
              </div>
              <div className="bg-gradient-to-br from-purple-400 to-orange-500 rounded-2xl p-6 sm:p-8 transform -rotate-1 hover:rotate-0 transition-all duration-700 shadow-xl hover:shadow-purple-500/25 group">
                <Brush className="w-10 h-10 sm:w-12 sm:h-12 text-white mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-white font-black text-lg sm:text-xl">
                  {community.settings.features[1] || "Digital Design"}
                </h3>
                <p className="text-purple-100 mt-2 font-medium text-sm">Master digital tools</p>
              </div>
            </div>
            <div className="space-y-4 sm:space-y-6 mt-8 sm:mt-12">
              <div className="bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl p-6 sm:p-8 transform rotate-1 hover:rotate-0 transition-all duration-700 shadow-xl hover:shadow-orange-500/25 group">
                <Palette className="w-10 h-10 sm:w-12 sm:h-12 text-white mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-white font-black text-lg sm:text-xl">
                  {community.settings.features[2] || "Color Theory"}
                </h3>
                <p className="text-orange-100 mt-2 font-medium text-sm">Perfect color harmony</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-400 to-purple-500 rounded-2xl p-6 sm:p-8 transform -rotate-2 hover:rotate-0 transition-all duration-700 shadow-xl hover:shadow-yellow-500/25 group">
                <Lightbulb className="w-10 h-10 sm:w-12 sm:h-12 text-white mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-white font-black text-lg sm:text-xl">
                  {community.settings.features[3] || "Innovation"}
                </h3>
                <p className="text-yellow-100 mt-2 font-medium text-sm">Think outside the box</p>
              </div>
            </div>
          </div>
          <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 rounded-2xl opacity-20 blur-2xl animate-pulse"></div>
        </div>
      </CommunityHeroBase>

      <CommunityFeaturesBase
        community={community}
        variant="creative"
        title="Creative Tools"
        subtitle="Unleash Your"
        iconSet={iconSet}
      />

      <CommunityPostsBase posts={posts} variant="creative" title="Community Showcase" subtitle="Amazing" />

      {/* Compact Creative Benefits Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-pink-100 via-purple-100 to-orange-100 relative overflow-hidden">
        <div className="absolute inset-0">
           {floaters.map((style, i) => (
          <div key={i} className="absolute animate-float" style={style}>
            <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-pink-300/30" />
          </div>
        ))}
          <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-2xl animate-pulse"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-black mb-6 shadow-xl">
              Creative Benefits
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Why Creatives{" "}
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">
                Love Us
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join a vibrant community where creativity flourishes and artistic dreams become reality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {community.settings.benefits.slice(0, 6).map((benefit: string, index: number) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 transform overflow-hidden group bg-white"
              >
                <CardContent className="p-6 sm:p-8 text-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500"></div>

                  <div className="relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                      {benefit.split(" ").slice(0, 3).join(" ")}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">{benefit}</p>

                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                      <Button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold hover:scale-105 transition-transform text-sm">
                        Explore Benefit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Compact Creative Inspiration Gallery */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-r from-pink-500/5 to-purple-500/5 rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-black mb-4">
              Creative Inspiration
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              Amazing{" "}
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Creations
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              See what our creative community has been making and get inspired for your next masterpiece.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                title: "Digital Art Masterpiece",
                creator: "Alex Chen",
                likes: 234,
                gradient: "from-pink-400 to-purple-500",
              },
              {
                title: "Brand Identity Design",
                creator: "Maria Rodriguez",
                likes: 189,
                gradient: "from-purple-400 to-orange-500",
              },
              { title: "Motion Graphics", creator: "David Kim", likes: 156, gradient: "from-orange-400 to-pink-500" },
              {
                title: "UI/UX Innovation",
                creator: "Sarah Johnson",
                likes: 298,
                gradient: "from-yellow-400 to-purple-500",
              },
              { title: "3D Visualization", creator: "Mike Wilson", likes: 167, gradient: "from-pink-500 to-rose-500" },
              { title: "Typography Art", creator: "Emma Davis", likes: 203, gradient: "from-purple-500 to-indigo-500" },
            ].map((creation, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 transform overflow-hidden group"
              >
                <div className={`h-40 sm:h-48 bg-gradient-to-br ${creation.gradient} relative`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-white/80 animate-pulse" />
                  </div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <h3 className="font-black text-sm sm:text-base">{creation.title}</h3>
                    <p className="text-white/80 text-xs">by {creation.creator}</p>
                  </div>
                  <div className="absolute top-3 right-3 flex items-center space-x-1 text-white">
                    <Heart className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                    <span className="font-bold text-xs">{creation.likes}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Compact Creative CTA */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900 relative overflow-hidden">
        <div className="absolute inset-0">
           {floaters.map((style, i) => (
          <div key={i} className="absolute animate-float" style={style}>
            <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-pink-300/30" />
          </div>
        ))}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-2xl animate-pulse"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="space-y-6 sm:space-y-8">
            <Badge className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white border-0 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-black backdrop-blur-sm hover:scale-105 transition-all duration-300">
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
              Ready to Create Something Amazing?
            </Badge>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-pink-300 via-purple-300 to-orange-300 bg-clip-text text-transparent leading-tight">
              Join Our Creative Universe
            </h2>

            <p className="text-base sm:text-lg text-pink-100 max-w-3xl mx-auto leading-relaxed">
              Join a vibrant community of creators, artists, and innovators who are pushing the boundaries of
              creativity.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 hover:from-pink-600 hover:via-purple-600 hover:to-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-black shadow-xl hover:shadow-pink-500/25 transition-all duration-300 hover:scale-105 group w-full sm:w-auto"
              >
                <a href="#join-section" className="flex items-center">
                  <Sparkles className="mr-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-spin" />
                  Start Creating Now
                </a>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white/30 text-white hover:bg-white/10 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold backdrop-blur-sm bg-transparent w-full sm:w-auto transition-all duration-300 hover:scale-105"
              >
                Explore Gallery
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-pink-200 text-sm sm:text-base pt-4">
              <div className="flex items-center space-x-2">
                <Palette className="w-4 h-4" />
                <span>Premium creative tools</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4" />
                <span>Supportive community</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4" />
                <span>Expert feedback</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
