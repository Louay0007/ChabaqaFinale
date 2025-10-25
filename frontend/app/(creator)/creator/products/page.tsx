import { ProductsHeader } from "./components/products-header"
import { ProductsStatsGrid } from "./components/products-stats-grid"
import { ProductsSearch } from "./components/products-search"
import { ProductsTabs } from "./components/products-tabs"
import { ProductsPerformance } from "./components/products-performance"
import { productService, communityService } from "@/lib/services"

export default async function CreatorProductsPage() {
  // Fetch real data from API
  const [productsData, communitiesData] = await Promise.all([
    productService.getMyCreatedProducts().catch(() => []),
    communityService.getCommunities({ page: 1, limit: 1 }).catch(() => ({ communities: [] })),
  ])
  
  // Transform API data to match component expectations
  const products = productsData.map((product: any) => ({
    ...product,
    id: product._id || product.id,
  }))
  
  const communityId = communitiesData.communities?.[0]?._id || ""

  return (
    <div className="space-y-8 p-5">
      <ProductsHeader />
      <ProductsStatsGrid products={products} />
      <ProductsSearch />
      <ProductsTabs products={products} communityId={communityId} />
      <ProductsPerformance products={products} />
    </div>
  )
}