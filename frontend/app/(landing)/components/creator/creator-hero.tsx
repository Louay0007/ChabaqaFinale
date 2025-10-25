import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import type { User } from "@/lib/models"

interface CreatorHeroProps {
  creator: User
  totalMembers: number
  totalCommunities: number
}

export function CreatorHero({ creator, totalMembers, totalCommunities }: CreatorHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <div className="container relative mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center gap-6 sm:gap-8 text-center md:flex-row md:text-left">
            {/* Creator Avatar */}
            <div className="relative flex-shrink-0">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#8e78fb] via-[#47c7ea] to-[#f65887] opacity-75 blur-lg" />
              <div className="relative h-24 w-24 sm:h-32 sm:w-32 md:h-36 md:w-36 lg:h-40 lg:w-40 overflow-hidden rounded-full border-4 border-white shadow-xl">
                <Image
                  src={creator.avatar || "/placeholder.svg?height=160&width=160&query=professional avatar portrait"}
                  alt={creator.name}
                  fill
                  className="object-cover"
                />
              </div>
              {creator.verified && (
                <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[#8e78fb] text-white shadow-lg">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Creator Info */}
            <div className="flex-1 space-y-3 sm:space-y-4">
              <div>
                <h1 className="mb-2 font-sans text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 text-balance">
                  {creator.name}
                </h1>
                <p className="text-base sm:text-lg text-gray-600">Digital Creator & Educator</p>
              </div>

              <p className="max-w-2xl text-pretty text-sm sm:text-base md:text-lg leading-relaxed text-gray-700">
                I'm a passionate creator dedicated to crafting accessible, high-quality learning experiences that blend
                thoughtful design with robust content. My work lies at the intersection of education and community,
                creating experiences that not only teach but inspire growth and connection.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 lg:gap-6 pt-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-[140px] sm:min-w-0">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-[#8e78fb]/10 flex-shrink-0">
                    <svg
                      className="h-5 w-5 sm:h-6 sm:w-6 text-[#8e78fb]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">{totalMembers.toLocaleString()}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Members</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 min-w-[140px] sm:min-w-0">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-[#47c7ea]/10 flex-shrink-0">
                    <svg
                      className="h-5 w-5 sm:h-6 sm:w-6 text-[#47c7ea]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">{totalCommunities}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Communities</div>
                  </div>
                </div>

                <Badge
                  variant="secondary"
                  className="bg-[#8e78fb]/10 text-[#8e78fb] hover:bg-[#8e78fb]/20 border-[#8e78fb]/20 text-xs sm:text-sm px-3 py-1"
                >
                  <svg className="mr-1 h-3 w-3 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Verified Creator
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
