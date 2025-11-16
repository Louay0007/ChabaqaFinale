import { notFound } from "next/navigation"
import { cookies, headers } from "next/headers"
import { CommunityDetailsHero } from "./components/community-details-hero"
import { CommunityDetailsContent } from "./components/community-details-content"
import { CommunityDetailsSidebar } from "./components/community-details-sidebar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface CommunityDetailsPageProps {
  params: {
    slug: string
  }
}

export default async function CommunityDetailsPage({ params }: CommunityDetailsPageProps) {
  // Extract slug from params (server component props are sync)
  const { slug } = params
  
  let community = null

  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
    const hdrs = await headers()
    const cookieHeader = hdrs.get("cookie") || ""
    const authHeader = hdrs.get("authorization") || ""
    const jar = await cookies()
    const cookieToken =
      jar.get("accessToken")?.value ||
      jar.get("token")?.value ||
      jar.get("jwt")?.value ||
      jar.get("authToken")?.value ||
      null

    const authValue = authHeader && authHeader.toLowerCase().startsWith("bearer ")
      ? authHeader
      : (cookieToken ? `Bearer ${cookieToken}` : "")

    const res = await fetch(`${apiBase}/community-aff-crea-join/${slug}`, {
      method: "GET",
      headers: {
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        ...(authValue ? { Authorization: authValue } : {}),
      },
      // Force server-side fetch
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error(`Failed community fetch: ${res.status}`)
    }
    const json = await res.json()
    community = json?.data || json
  } catch (error) {
    console.error("Failed to fetch community:", error)
    notFound()
  }

  if (!community) {
    notFound()
  }

  // Type-safe way to handle the community data with proper serialization
  const rawCreator = (community as any)?.creator || (community as any)?.createur || null
  const communityData = {
    ...community,
    creator: rawCreator ? {
      id: String((rawCreator as any)?._id || rawCreator.id || ''),
      name: String((rawCreator as any)?.name || ''),
      avatar: (rawCreator as any)?.avatar ? String((rawCreator as any)?.avatar) : undefined,
      verified: Boolean((rawCreator as any)?.verified)
    } : null,
    // Ensure ID is a string
    id: String((community as any)?._id || community.id || ''),
    // Membership flag if provided by backend
    isMember: Boolean((community as any)?.isMember),
    // Handle any other potential object fields
    settings: (community as any)?.settings ? {
      ...(community as any).settings,
      visibility: String((community as any).settings.visibility || 'public')
    } : { visibility: 'public' },
    // Normalize category if backend returns an object
    category: typeof (community as any).category === 'string' 
      ? community.category 
      : String((community as any).category?.name || ''),
    // Ensure tags are strings
    tags: Array.isArray(community.tags) 
      ? community.tags.map((t: any) => typeof t === 'string' ? t : String(t?.name || t?._id || '')) 
      : [],
    // Preserve members but ensure we don't render array directly
    members: (community as any).members
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <CommunityDetailsHero community={communityData} />

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Community Details */}
            <div className="lg:col-span-2">
              <CommunityDetailsContent community={communityData} />
            </div>

            {/* Right: Sidebar (Join, Stats, etc.) */}
            <div className="lg:col-span-1">
              <CommunityDetailsSidebar community={communityData} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
