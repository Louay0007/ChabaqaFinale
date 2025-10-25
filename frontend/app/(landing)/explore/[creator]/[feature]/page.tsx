import { notFound } from "next/navigation"
import { FeatureHero } from "@/app/(landing)/components/creator/feature-hero"
import { FeatureDetails } from "@/app/(landing)/components/creator/feature-details"
import { FeatureTestimonials } from "@/app/(landing)/components/creator/feature-testimonials"
import { FeatureCTA } from "@/app/(landing)/components/creator/feature-cta"
import { mockCommunities, mockCourses, mockChallenges, mockEvents, mockSessions } from "@/lib/mock-data2"

export default function FeaturePage({
  params,
}: {
  params: { creator: string; feature: string }
}) {
  const allFeatures = [...mockCommunities, ...mockCourses, ...mockChallenges, ...mockEvents, ...mockSessions]

  const feature = allFeatures.find((f) => f.slug === params.feature)

  if (!feature) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      <FeatureHero feature={feature} />
      <FeatureDetails feature={feature} />
      <FeatureTestimonials feature={feature} />
      <FeatureCTA feature={feature} />
    </div>
  )
}
