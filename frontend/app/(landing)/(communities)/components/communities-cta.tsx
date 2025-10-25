import { Card, CardContent } from "@/components/ui/card"
import { Users, Zap, Heart } from "lucide-react"
import { CommunitiesCTAClient } from "./communities-cta-client"

export function CommunitiesCTA() {
 return (
    <section className="py-10 sm:py-14 bg-gray-100">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-chabaqa-primary to-chabaqa-secondary1 text-white overflow-hidden rounded-2xl">
            <CardContent className="p-6 sm:p-8 md:p-10 text-center space-y-6">
              {/* Heading */}
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold leading-snug">
                  Ready to Start Your Own Community?
                </h2>
                <p className="text-sm sm:text-base md:text-lg opacity-90 max-w-lg mx-auto">
                  Join thousands of creators building thriving communities and generating meaningful income with Chabaqa.
                </p>
              </div>

              {/* Features inline */}
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 my-6 sm:my-8">
                <div className="flex-1 min-w-[90px] max-w-[120px] text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="font-semibold text-xs sm:text-sm mb-1">Build</h3>
                  <p className="text-[10px] sm:text-xs opacity-80">Invite members</p>
                </div>

                <div className="flex-1 min-w-[90px] max-w-[120px] text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="font-semibold text-xs sm:text-sm mb-1">Engage</h3>
                  <p className="text-[10px] sm:text-xs opacity-80">Share & host</p>
                </div>

                <div className="flex-1 min-w-[90px] max-w-[120px] text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="font-semibold text-xs sm:text-sm mb-1">Monetize</h3>
                  <p className="text-[10px] sm:text-xs opacity-80">Earn revenue</p>
                </div>
              </div>

              {/* CTA Button */}
              <div className="w-full sm:w-auto">
                <CommunitiesCTAClient />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
