"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

interface FeatureCTAProps {
  feature: {
    name: string
    price: number
    priceType: string
    type: "community" | "course" | "challenge" | "event" | "oneToOne"
  }
}

export function FeatureCTA({ feature }: FeatureCTAProps) {
  const getTypeConfig = (type: string) => {
    const configs = {
      community: {
        color: "from-blue-500 to-blue-600",
        ctaText: "Join Community Now",
      },
      course: {
        color: "from-[#47c7ea] to-[#86e4fd]",
        ctaText: "Start Learning Today",
      },
      challenge: {
        color: "from-[#ff9b28] to-[#fdb863]",
        ctaText: "Join the Challenge",
      },
      event: {
        color: "from-indigo-500 to-indigo-600",
        ctaText: "Register for Event",
      },
      oneToOne: {
        color: "from-[#f65887] to-[#fb8ba8]",
        ctaText: "Book Your Session",
      },
    }
    return configs[type as keyof typeof configs] || configs.community
  }

  const typeConfig = getTypeConfig(feature.type)

  const formatPrice = (price: number, type: string) => {
    if (type === "free") return "Free"
    if (type === "per session") return `$${price}/session`
    if (type === "one-time") return `$${price}`
    return `$${price}/${type === "monthly" ? "mo" : type}`
  }

  return (
    <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 py-12 sm:py-14 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 text-balance">
          Ready to Get Started?
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-purple-100 mb-6 sm:mb-8 text-pretty">
          Join now and start your journey to success with {feature.name}
        </p>

        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-left w-full md:w-auto">
              <p className="text-xs sm:text-sm text-gray-500 mb-1">Starting at</p>
              <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                {formatPrice(feature.price, feature.priceType)}
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-700">Instant access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-700">30-day money-back guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-700">Cancel anytime</span>
                </div>
              </div>
            </div>
            <Button
              size="lg"
              className={`w-full md:w-auto text-base sm:text-lg font-semibold px-8 sm:px-12 py-5 sm:py-6 shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 bg-gradient-to-r ${typeConfig.color} text-white border-0 min-h-[56px] touch-manipulation`}
            >
              {typeConfig.ctaText}
            </Button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-purple-200 mt-4 sm:mt-6">
          Join {Math.floor(Math.random() * 5000 + 1000)}+ members who are already seeing results
        </p>
      </div>
    </div>
  )
}
