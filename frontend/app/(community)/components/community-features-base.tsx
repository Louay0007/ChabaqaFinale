"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Sparkles, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface CommunityFeaturesBaseProps {
  community: any
  variant: "modern" | "creative" | "minimal"
  title: string
  subtitle: string
  iconSet: any[]
}

export function CommunityFeaturesBase({ community, variant, title, subtitle, iconSet }: CommunityFeaturesBaseProps) {
  const [visibleCards, setVisibleCards] = useState<number[]>([])

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleCards((prev) => {
        if (prev.length < community.settings.features.length) {
          return [...prev, prev.length]
        }
        return prev
      })
    }, 100)

    return () => clearInterval(timer)
  }, [community.settings.features.length])
    const [bubbleStyles, setBubbleStyles] = useState<{ 
    left: string, 
    top: string, 
    animationDelay: string, 
    animationDuration: string 
  }[]>([]);

useEffect(() => {
  if (variant === "creative") {
    const bubbles = Array.from({ length: 10 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${2 + Math.random() * 3}s`,
    }));
    setBubbleStyles(bubbles);
  }
}, [variant]);

  const getVariantStyles = () => {
    switch (variant) {
      case "modern":
        return {
          section: "py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden",
          badge: "bg-blue-500/10 text-blue-700 border-blue-200/50 backdrop-blur-sm hover:bg-blue-500/20",
          title: "text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900",
          subtitle: "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600",
          card: "group hover:shadow-xl transition-all duration-500 border-0 shadow-md overflow-hidden bg-white hover:-translate-y-1 hover:scale-[1.02]",
          iconBg: [
            "from-blue-500 to-blue-600",
            "from-emerald-500 to-emerald-600",
            "from-purple-500 to-purple-600",
            "from-orange-500 to-orange-600",
            "from-pink-500 to-pink-600",
            "from-indigo-500 to-indigo-600",
          ],
          description: "text-gray-600",
        }
      case "creative":
        return {
          section:
            "py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 relative overflow-hidden",
          badge: "bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0 shadow-lg hover:shadow-xl",
          title: "text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900",
          subtitle: "bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent",
          card: "group hover:shadow-xl transition-all duration-500 border-0 shadow-lg overflow-hidden bg-white hover:scale-105 transform hover:-rotate-1",
          iconBg: [
            "from-pink-500 to-rose-500",
            "from-purple-500 to-indigo-500",
            "from-orange-500 to-red-500",
            "from-yellow-500 to-orange-500",
            "from-emerald-500 to-teal-500",
            "from-blue-500 to-purple-500",
          ],
          description: "text-gray-600",
        }
      case "minimal":
        return {
          section: "py-12 sm:py-16 lg:py-20 bg-gray-50 relative",
          badge: "border-gray-300 text-gray-600 bg-white/50 hover:border-gray-900 hover:bg-gray-900 hover:text-white",
          title: "text-2xl sm:text-3xl lg:text-4xl font-extralight text-gray-900 tracking-tight",
          subtitle: "",
          card: "text-center space-y-4 group transition-all duration-500 hover:bg-white rounded-xl p-4 sm:p-6 hover:shadow-md",
          iconBg: [
            "border-2 border-gray-300 rounded-full group-hover:border-gray-900 bg-white group-hover:bg-gray-900",
          ],
          description: "text-gray-600 font-light",
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <section className={styles.section}>
      {/* Background Elements */}
      {variant === "modern" && (
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl animate-pulse"></div>
          <div
            className="absolute bottom-0 right-0 w-40 h-40 bg-indigo-500/5 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        </div>
      )}

      {variant === "creative" && (
        <div className="absolute inset-0">
         {bubbleStyles.map((style, i) => (
          <div key={i} className="absolute animate-bounce hidden sm:block" style={style}>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-20"></div>
          </div>
        ))}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full blur-2xl animate-pulse"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-orange-500/10 to-pink-500/10 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "3s" }}
          ></div>
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          {variant === "minimal" ? (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "1s" }}></div>
              </div>
              <h2 className={styles.title}>{title}</h2>
              <div className="w-16 h-px bg-gray-300 mx-auto"></div>
              <p className="text-base sm:text-lg text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
                Essential tools designed for clarity and focus.
              </p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              <Badge className={cn("px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-bold", styles.badge)}>
                {variant === "creative" && <Sparkles className="w-4 h-4 mr-2 animate-pulse" />}
                {title}
              </Badge>
              <h2 className={cn(styles.title, "mb-4")}>
                {subtitle}{" "}
                <span className={styles.subtitle}>
                  {variant === "modern" ? "Professional Success" : variant === "creative" ? "Creative Genius" : ""}
                </span>
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {variant === "modern"
                  ? "Access industry-leading tools and resources designed for professional growth."
                  : variant === "creative"
                    ? "Dive into a world where imagination meets innovation and creativity knows no bounds."
                    : "Essential tools designed for clarity and focus."}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {community.settings.features.slice(0, 6).map((feature: string, index: number) => {
            const Icon = iconSet[index % iconSet.length]
            const isVisible = visibleCards.includes(index)

            if (variant === "minimal") {
              return (
                <div
                  key={index}
                  className={cn(styles.card, isVisible ? "animate-in slide-in-from-bottom duration-500" : "opacity-0")}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative">
                    <div
                      className={cn(
                        "w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto transition-all duration-500",
                        styles.iconBg[0],
                      )}
                    >
                      <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 group-hover:text-white transition-colors duration-500" />
                    </div>
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gray-300 rounded-full group-hover:bg-gray-900 transition-colors duration-500"></div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg sm:text-xl font-light text-gray-900 tracking-wide">{feature}</h3>
                    <div className="w-8 h-px bg-gray-200 mx-auto group-hover:bg-gray-900 transition-colors duration-500"></div>
                    <p className={cn(styles.description, "leading-relaxed tracking-wide max-w-xs mx-auto text-sm")}>
                      Essential {feature.toLowerCase()} tools designed for clarity.
                    </p>
                  </div>
                </div>
              )
            }

            return (
              <Card
                key={index}
                className={cn(styles.card, isVisible ? "animate-in slide-in-from-bottom duration-500" : "opacity-0")}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-4 sm:p-6 text-center relative">
                  {variant === "creative" && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <Zap className="w-4 h-4 text-purple-500 animate-pulse" />
                      </div>
                    </>
                  )}

                  <div className="relative">
                    <div
                      className={cn(
                        "flex items-center justify-center mx-auto mb-4 shadow-lg transition-all duration-500 group-hover:shadow-xl",
                        variant === "modern"
                          ? `w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${styles.iconBg[index % styles.iconBg.length]} rounded-xl group-hover:scale-110 group-hover:rotate-6`
                          : `w-14 h-14 sm:w-18 sm:h-18 bg-gradient-to-r ${styles.iconBg[index % styles.iconBg.length]} rounded-full group-hover:scale-110 group-hover:rotate-6`,
                      )}
                    >
                      <Icon
                        className={cn(
                          "text-white transition-all duration-500",
                          variant === "modern" ? "w-5 h-5 sm:w-7 sm:h-7" : "w-6 h-6 sm:w-8 sm:h-8",
                        )}
                      />
                    </div>

                    <h3
                      className={cn(
                        "mb-3 transition-colors duration-500",
                        variant === "modern"
                          ? "text-base sm:text-lg font-bold text-gray-900 group-hover:text-blue-600"
                          : "text-lg sm:text-xl font-black text-gray-900 group-hover:text-purple-600",
                      )}
                    >
                      {feature}
                    </h3>

                    <p className={cn(styles.description, "leading-relaxed text-sm mb-4")}>
                      {variant === "modern"
                        ? `Professional ${feature.toLowerCase()} tools designed to accelerate your growth.`
                        : `Unleash your creative potential with amazing ${feature.toLowerCase()} tools.`}
                    </p>

                    {variant === "modern" && (
                      <Button
                        variant="ghost"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold group/btn text-sm"
                      >
                        Learn More
                        <ChevronRight className="ml-1 w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    )}

                    {variant === "creative" && (
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                        <Button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold hover:scale-105 transition-transform text-sm">
                          <Sparkles className="mr-1 w-3 h-3 animate-pulse" />
                          Explore
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Compact CTA */}
        {variant !== "minimal" && (
          <div className="text-center mt-8 sm:mt-12">
            <Button
              size="lg"
              className={cn(
                "px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold transition-all duration-300 hover:scale-105 group",
                variant === "modern"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  : "bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white",
              )}
            >
              <a href="#join-section" className="flex items-center">
                {variant === "creative" && <Sparkles className="mr-2 w-4 h-4 group-hover:animate-spin" />}
                {variant === "creative" ? "Start Creating" : "Get Started"}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
