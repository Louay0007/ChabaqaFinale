"use client"

import { useEffect, useState } from "react"
import { ProductsHeader } from "./components/products-header"
import { ProductsStatsGrid } from "./components/products-stats-grid"
import { ProductsSearch } from "./components/products-search"
import { ProductsTabs } from "./components/products-tabs"
import { ProductsPerformance } from "./components/products-performance"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function CreatorProductsPage() {
  const { toast } = useToast()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [revenue, setRevenue] = useState<number | null>(null)
  const [communityId, setCommunityId] = useState<string>("")

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const me = await api.auth.me().catch(() => null as any)
        const user = me?.data || (me as any)?.user || null
        if (!user) { setProducts([]); return }

        // Get first community
        const myComms = await api.communities.getByCreator(user._id || user.id).catch(() => null as any)
        const first = (myComms?.data || [])[0]
        if (first?.id || first?._id) setCommunityId(first.id || first._id)

        // Fetch creator products
        const productsRes = await api.products.getByCreator(user._id || user.id, { limit: 50 }).catch(() => null as any)
        const rawProducts = productsRes?.data?.products || productsRes?.products || productsRes?.data?.items || productsRes?.items || []
        const normalized = (Array.isArray(rawProducts) ? rawProducts : []).map((p: any) => ({
          id: p.id || p._id,
          name: p.name,
          description: p.description,
          price: Number(p.price || 0),
          type: p.type,
          category: p.category,
          isPublished: Boolean(p.isPublished),
          thumbnail: p.thumbnail,
          salesCount: Number(p.salesCount || 0),
          rating: Number(p.rating || 0),
        }))
        setProducts(normalized)

        // Fetch analytics revenue (last 30 days)
        const now = new Date()
        const to = now.toISOString()
        const from = new Date(now.getTime() - 30*24*3600*1000).toISOString()
        const prodAgg = await api.creatorAnalytics.getProducts({ from, to }).catch(() => null as any)
        const byProduct = prodAgg?.data?.byProduct || prodAgg?.byProduct || prodAgg?.data?.items || prodAgg?.items || []
        const totalRevenue = (Array.isArray(byProduct) ? byProduct : []).reduce((sum: number, x: any) => sum + Number(x.revenue ?? 0), 0)
        if (!Number.isNaN(totalRevenue)) setRevenue(totalRevenue)
      } catch (e: any) {
        toast({ title: 'Failed to load products', description: e?.message || 'Please try again later.', variant: 'destructive' as any })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-8 p-5">
      <ProductsHeader />
      <ProductsStatsGrid products={products} revenue={revenue} />
      <ProductsSearch />
      <ProductsTabs products={products} communityId={communityId} />
      <ProductsPerformance products={products} />
    </div>
  )
}