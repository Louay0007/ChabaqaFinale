import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { communitiesData, mockPosts } from "@/lib/data-communities"
import { getTemplateComponent } from "@/lib/template-renderer"

interface CommunityPageProps {
  params: {
    slug: string
  }
}

// Generate metadata for SEO
export async function generateMetadata(
  { params }: CommunityPageProps
): Promise<Metadata> {
  // OR equivalently:
  const communitySlug = (await params).slug;

  const community = communitiesData.communities.find((c) => c.slug === communitySlug)

  if (!community) {
    return {
      title: "Community Not Found",
    }
  }

  return {
    title: `${community.name} - ${community.category} Community`,
    description: community.description,
    openGraph: {
      title: community.name,
      description: community.description,
      images: [community.coverImage],
    },
  }
}

// Generate static params for all communities
export async function generateStaticParams() {
  return communitiesData.communities.map((community) => ({
    slug: community.slug,
  }))
}

export default async function CommunityPage({ params }: CommunityPageProps) {
  const communitySlug = (await params).slug;
  const community = communitiesData.communities.find((c) => c.slug === communitySlug)

  if (!community) {
    notFound()
  }

  const communityPosts = mockPosts.filter((p) => p.communityId === community.id)

  // Get template-specific component
  const TemplateComponent = getTemplateComponent(community.settings.template || "modern")

  return (
    <div className="min-h-screen bg-white">
      {/* Template renders everything including join section */}
      <TemplateComponent community={community} posts={communityPosts} />
    </div>
  )
}
