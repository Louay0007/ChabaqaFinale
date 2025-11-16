import { use } from "react"
import { getCommunityBySlug, getProductsByCommunity, getUserPurchases } from "@/lib/mock-data"
import ProductsPageContent from "@/app/(community)/[creator]/[feature]/(loggedUser)/products/components/products-page-content"

type Props = {
  params: Promise<{ feature: string }>
}

export default function ProductsPage({ params }: Props) {
  const { feature } = use(params)
  const community = getCommunityBySlug(feature)
  const allProducts = getProductsByCommunity(community?.id || "")
  const userPurchases = getUserPurchases("2") // Mock user ID

  if (!community) {
    return <div>Community not found</div>
  }

  return (
    <ProductsPageContent 
      slug={feature}
      community={community}
      allProducts={allProducts}
      userPurchases={userPurchases}
    />
  )
}