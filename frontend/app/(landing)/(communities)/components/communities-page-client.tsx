"use client"

import { FeaturedCommunities } from "./featured-communities"
import { CommunitiesSearchSection } from "./communities-search-section"
import { CommunitiesCTA } from "./communities-cta"
import type { Community, GlobalStats, Category } from "@/lib/types/community.types"

interface CommunitiesPageClientProps {
  communities: Community[]
  stats: GlobalStats
  categories: Category[]
}

export function CommunitiesPageClient({ communities, stats, categories }: CommunitiesPageClientProps) {
  // Transform Community to Explore format for existing components
  const transformedCommunities = communities.map((community) => ({
    id: community._id,
    slug: community.slug,
    name: community.name,
    logo: community.logo || "",
    coverImage: community.coverImage || community.photo_de_couverture || "",
    image: community.coverImage || community.photo_de_couverture || community.logo || "",
    description: community.shortDescription || community.short_description || "",
    creator: community.creator?.name || community.createur?.name || "",
    creatorAvatar: community.creator?.avatar || community.createur?.avatar || "",
    category: community.category || "General",
    priceType: community.priceType || "free",
    price: community.price || community.fees_of_join || 0,
    members: community.membersCount || 0,
    rating: community.averageRating || 0,
    tags: community.tags || [],
    type: "community" as const,
    featured: community.featured || false,
    verified: community.isVerified || false,
    link: `/${community.slug}`,
  }))

  return (
    <>
      <FeaturedCommunities communities={transformedCommunities} />
      <CommunitiesSearchSection communities={transformedCommunities} />
      <CommunitiesCTA />
    </>
  )
}
