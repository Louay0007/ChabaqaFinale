'use client'

import { useState, useEffect } from 'react'
import { communitiesApi } from "@/lib/api/communities.api"
import { progressionApi } from "@/lib/api/progression.api"
import type { Community, ProgressionOverview } from "@/lib/api/types"
import ProgressionPageContent from "@/app/(community)/[creator]/[feature]/(loggedUser)/progress/components/progression-page-content"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw, AlertCircle } from "lucide-react"

export default function ProgressionPage({
  params,
}: {
  params: { creator: string; feature: string }
}) {
  const { feature } = params
  const normalisedSlug = decodeURIComponent(feature).trim()

  const [community, setCommunity] = useState<Community | null>(null)
  const [progression, setProgression] = useState<ProgressionOverview | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const communityResponse = await communitiesApi.getBySlug(normalisedSlug)
        const communityPayload = (communityResponse as any)?.data?.data ?? communityResponse?.data
        const community = Array.isArray(communityPayload) ? communityPayload[0] : communityPayload
        const communityId = community?.id ?? community?._id ?? community?.communityId

        if (!community || !communityId) {
          throw new Error('Community not found')
        }

        const progression = await progressionApi.getOverview({
          communityId,
          communitySlug: normalisedSlug,
        })

        setCommunity(community as Community)
        setProgression(progression)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [normalisedSlug])

  if (loading) {
    return (
      <Card className="border border-dashed">
        <CardContent className="flex items-center gap-3 py-10 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading your progress...
        </CardContent>
      </Card>
    )
  }

  if (error) {
    console.error("Error loading progression page:", error)
    return (
      <Card className="border border-dashed">
        <CardContent className="py-10 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle className="text-lg mb-2">Unable to load progress</CardTitle>
          <p className="text-sm text-muted-foreground mb-4">
            We encountered an issue while loading your progression data. Please try again.
          </p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!community || !progression) {
    return (
      <Card className="border border-dashed">
        <CardContent className="py-10 text-center">
          <CardTitle className="text-lg">No progress data available</CardTitle>
          <p className="mt-2 text-sm text-muted-foreground">
            Start engaging with community content to see your progress here.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <ProgressionPageContent
      slug={normalisedSlug}
      community={community}
      initialData={progression}
    />
  )
}

