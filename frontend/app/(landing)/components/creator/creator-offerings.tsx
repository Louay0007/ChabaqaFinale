"use client"

import { CommunityCard } from "./community-card"

interface CreatorOfferingsProps {
  communities: any[]
  courses: any[]
  challenges: any[]
  sessions: any[]
  events: any[]
  activeTab: string
}

export function CreatorOfferings({
  communities,
  courses,
  challenges,
  sessions,
  events,
  activeTab,
}: CreatorOfferingsProps) {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12">
        {activeTab === "communities" && (
          <section className="animate-in fade-in duration-500">
            <div className="mb-8 sm:mb-10 md:mb-12">
              <h2 className="mb-2 sm:mb-3 font-sans text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 text-balance">
                Communities
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed text-pretty max-w-3xl">
                Join vibrant communities and connect with like-minded learners. Build relationships, share knowledge,
                and grow together.
              </p>
            </div>
            <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {communities.map((community) => (
                <CommunityCard key={community.id} community={community} viewMode="grid" />
              ))}
            </div>
          </section>
        )}

        {activeTab === "courses" && (
          <section className="animate-in fade-in duration-500">
            <div className="mb-8 sm:mb-10 md:mb-12">
              <h2 className="mb-2 sm:mb-3 font-sans text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 text-balance">
                Courses
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed text-pretty max-w-3xl">
                Comprehensive courses designed to help you master new skills. Learn at your own pace with structured
                content and hands-on projects.
              </p>
            </div>
            <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <CommunityCard key={course.id} community={course} viewMode="grid" />
              ))}
            </div>
          </section>
        )}

        {activeTab === "challenges" && (
          <section className="animate-in fade-in duration-500">
            <div className="mb-8 sm:mb-10 md:mb-12">
              <h2 className="mb-2 sm:mb-3 font-sans text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 text-balance">
                Challenges
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed text-pretty max-w-3xl">
                Push your limits with structured challenges. Stay accountable, build habits, and achieve your goals with
                our community-driven approach.
              </p>
            </div>
            <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {challenges.map((challenge) => (
                <CommunityCard key={challenge.id} community={challenge} viewMode="grid" />
              ))}
            </div>
          </section>
        )}

        {activeTab === "events" && (
          <section className="animate-in fade-in duration-500">
            <div className="mb-8 sm:mb-10 md:mb-12">
              <h2 className="mb-2 sm:mb-3 font-sans text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 text-balance">
                Events
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed text-pretty max-w-3xl">
                Attend live events and workshops. Network with peers, learn from experts, and stay updated with the
                latest trends.
              </p>
            </div>
            <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <CommunityCard key={event.id} community={event} viewMode="grid" />
              ))}
            </div>
          </section>
        )}

        {activeTab === "sessions" && (
          <section className="animate-in fade-in duration-500">
            <div className="mb-8 sm:mb-10 md:mb-12">
              <h2 className="mb-2 sm:mb-3 font-sans text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 text-balance">
                One-on-One Sessions
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed text-pretty max-w-3xl">
                Get personalized guidance and mentorship. Book individual sessions tailored to your specific needs and
                goals.
              </p>
            </div>
            <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {sessions.map((session) => (
                <CommunityCard key={session.id} community={session} viewMode="grid" />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
