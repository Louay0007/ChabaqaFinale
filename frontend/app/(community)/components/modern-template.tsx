"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  CheckCircle,
  ArrowRight,
  BarChart3,
  Shield,
  Zap,
  Globe,
  TrendingUp,
  Award,
  Clock,
  Target,
  Users,
  Star,
  Briefcase,
  Rocket,
  BookOpen,
  Lightbulb,
  Settings,
  Database,
} from "lucide-react"
import { CommunityHeroBase } from "@/app/(community)/components/community-hero-base"
import { CommunityFeaturesBase } from "@/app/(community)/components/community-features-base"
import { CommunityPostsBase } from "@/app/(community)/components/community-posts-base"

interface ModernTemplateProps {
  community: any
  posts: any[]
}

export function ModernTemplate({ community, posts }: ModernTemplateProps) {
  const modernIcons = [
    BarChart3,
    Shield,
    Zap,
    Globe,
    Briefcase,
    Award,
    Rocket,
    BookOpen,
    Lightbulb,
    Settings,
    Database,
    Target,
  ]

  return (
    <div className="min-h-screen bg-white">
      <CommunityHeroBase community={community} variant="modern" />

      <CommunityFeaturesBase
        community={community}
        variant="modern"
        title="Professional Features"
        subtitle="Everything You Need to"
        iconSet={modernIcons}
      />

      <CommunityPostsBase posts={posts} variant="modern" title="Community Updates" subtitle="Latest Professional" />

      {/* Compact Benefits Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-pulse"></div>
          <div
            className="absolute bottom-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-4 sm:space-y-6">
                <Badge className="bg-blue-500/10 text-blue-700 border-blue-200/50 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-bold hover:scale-105 transition-all duration-300">
                  Member Benefits
                </Badge>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-tight">
                  Why Top Professionals
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    {" "}
                    Choose Us
                  </span>
                </h2>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  Join thousands of industry leaders who trust our platform for their professional growth and networking
                  needs.
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {community.settings.benefits.slice(0, 3).map((benefit: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3 sm:space-x-4 group">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <p className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                        {benefit.split(" ").slice(0, 3).join(" ")}
                      </p>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{benefit}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold shadow-xl hover:scale-105 transition-all duration-300 group"
                >
                  <a href="#join-section" className="flex items-center">
                    Join Professional Network
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-3 sm:space-y-4">
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group">
                    <CardContent className="p-4 sm:p-6 text-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                        <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-gray-900 mb-1">
                        +{community.stats.monthlyGrowth}%
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-gray-600">Monthly Growth</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group">
                    <CardContent className="p-4 sm:p-6 text-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                        <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-gray-900 mb-1">
                        {community.stats.retentionRate}%
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-gray-600">Retention Rate</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-3 sm:space-y-4 mt-6 sm:mt-8">
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group">
                    <CardContent className="p-4 sm:p-6 text-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                        <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-gray-900 mb-1">24/7</div>
                      <div className="text-xs sm:text-sm font-semibold text-gray-600">Expert Support</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group">
                    <CardContent className="p-4 sm:p-6 text-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                        <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-gray-900 mb-1">Expert</div>
                      <div className="text-xs sm:text-sm font-semibold text-gray-600">Mentorship</div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Background decoration */}
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl blur-xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Compact Testimonials Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <Badge className="bg-blue-500/10 text-blue-700 border-blue-200/50 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-bold mb-4 hover:scale-105 transition-all duration-300">
              Success Stories
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-4">
              What Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Members Say
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Hear from professionals who have transformed their careers with our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                name: "Sarah Johnson",
                role: "Senior Product Manager",
                company: "Tech Corp",
                content:
                  "This community has been instrumental in my career growth. The networking opportunities are unmatched.",
                avatar: "/placeholder.svg",
              },
              {
                name: "Michael Chen",
                role: "Engineering Director",
                company: "Innovation Labs",
                content: "The quality of discussions and expertise of members here is exceptional. Highly recommend.",
                avatar: "/placeholder.svg",
              },
              {
                name: "Emily Rodriguez",
                role: "Marketing Lead",
                company: "Growth Co",
                content:
                  "I've learned more in 6 months here than in years elsewhere. The mentorship program is valuable.",
                avatar: "/placeholder.svg",
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="border-0 shadow-md hover:shadow-lg transition-all duration-500 hover:-translate-y-1 bg-white group"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-sm">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm sm:text-base">{testimonial.name}</p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Compact Professional CTA */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.3),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.3),transparent_50%)]"></div>
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
          <div
            className="absolute bottom-0 right-0 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="space-y-6 sm:space-y-8">
            <Badge className="bg-white/20 text-white border-white/30 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-bold backdrop-blur-sm hover:scale-105 transition-all duration-300">
              Ready to Advance Your Career?
            </Badge>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">
              Join {community.members.toLocaleString()}+
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">
                {" "}
                Professionals
              </span>
            </h2>

            <p className="text-base sm:text-lg opacity-90 max-w-3xl mx-auto leading-relaxed">
              {community.settings.welcomeMessage ||
                "Take the next step in your professional journey with industry experts and like-minded professionals."}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-black shadow-xl hover:shadow-white/25 transition-all duration-300 hover:scale-105 group w-full sm:w-auto"
              >
                <a href="#join-section" className="flex items-center">
                  Start Professional Journey
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white/30 text-white hover:bg-white/10 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold backdrop-blur-sm bg-transparent w-full sm:w-auto transition-all duration-300 hover:scale-105"
              >
                Watch Success Stories
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-white/80 text-sm sm:text-base pt-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>{community.priceType === "free" ? "Free to join" : `${community.priceType} billing`}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Active community</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4" />
                <span>Expert mentorship</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
