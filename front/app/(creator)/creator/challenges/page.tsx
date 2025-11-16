"use client"

import { useEffect, useMemo, useState } from "react"
import PageHeader from "./components/PageHeader"
import StatsGrid from "./components/StatsGrid"
import SearchBar from "./components/SearchBar"
import ChallengesTabs from "./components/ChallengesTabs"
import ChallengePerformanceOverview from "./components/ChallengePerformanceOverview"
import { api, apiClient } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function CreatorChallengesPage() {
  const { toast } = useToast()
  const [challenges, setChallenges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCommunitySlug, setSelectedCommunitySlug] = useState<string>("")
  const [search, setSearch] = useState("")
  const [revenue, setRevenue] = useState<number | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const me = await api.auth.me().catch(() => null as any)
        const user = me?.data || (me as any)?.user || null
        if (!user) { setChallenges([]); return }
        // pick first creator community
        const myComms = await api.communities.getByCreator(user._id || user.id).catch(() => null as any)
        const first = (myComms?.data || [])[0]
        const slug = first?.slug || ""
        setSelectedCommunitySlug(slug)
        const listRes = await apiClient.get<any>(`/challenges`, slug ? { communitySlug: slug, limit: 50 } : { limit: 50 }).catch(() => null as any)
        const raw = listRes?.data?.challenges || listRes?.challenges || listRes?.data?.items || listRes?.items || []
        const normalized = (Array.isArray(raw) ? raw : []).map((c: any) => ({
          id: c.id || c._id,
          title: c.title,
          description: c.description,
          thumbnail: c.thumbnail,
          startDate: new Date(c.startDate),
          endDate: new Date(c.endDate),
          participants: Array.isArray(c.participants) ? c.participants : Array.from({ length: Number(c.participantsCount ?? 0) }),
          depositAmount: c.depositAmount ?? 0,
          prize: c.prize || c.pool || undefined,
          category: c.category,
          difficulty: c.difficulty,
        }))
        setChallenges(normalized)

        // Fetch analytics to compute revenue (last 30 days)
        const now = new Date()
        const to = now.toISOString()
        const from = new Date(now.getTime() - 30*24*3600*1000).toISOString()
        const challAgg = await api.creatorAnalytics.getChallenges({ from, to }).catch(() => null as any)
        const byChallenge = challAgg?.data?.byChallenge || challAgg?.byChallenge || challAgg?.data?.items || challAgg?.items || []
        const totalRevenue = (Array.isArray(byChallenge) ? byChallenge : []).reduce((sum: number, x: any) => sum + Number(x.revenue ?? x.deposits ?? 0), 0)
        if (!Number.isNaN(totalRevenue)) setRevenue(totalRevenue)
      } catch (e: any) {
        toast({ title: 'Failed to load challenges', description: e?.message || 'Please try again later.', variant: 'destructive' as any })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    if (!search) return challenges
    const q = search.toLowerCase()
    return challenges.filter(c => (c.title || '').toLowerCase().includes(q) || (c.description || '').toLowerCase().includes(q))
  }, [challenges, search])

  return (
    <div className="space-y-8 p-5">
      <PageHeader />

      <StatsGrid allChallenges={filtered} revenue={revenue} />

      <SearchBar onSearch={setSearch} />

      <ChallengesTabs allChallenges={filtered} />

      {filtered.length > 0 && (
        <ChallengePerformanceOverview allChallenges={filtered} />
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-sm text-muted-foreground">No challenges found.</div>
      )}
    </div>
  )
}
