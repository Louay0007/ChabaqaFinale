import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CommunitiesPageClient } from "../components/communities-page-client"
import { communityService } from "@/lib/services"

export default async function CommunitiesPage() {
  // Fetch real data from API
  const [communitiesData, globalStats, categories] = await Promise.all([
    communityService.getCommunities({ limit: 50 }),
    communityService.getGlobalStats(),
    communityService.getCategories(),
  ])

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-16">
        <CommunitiesPageClient 
          communities={communitiesData.communities}
          stats={globalStats}
          categories={categories}
        />
      </main>

      <Footer />
    </div>
  )
}
