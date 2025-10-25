import { communityService, productService } from "@/lib/services"
import ProductsPageContent from "@/app/(community)/[slug]/(loggedUser)/products/components/products-page-content"

type Props = {
  params: Promise<{ slug: string }>
}

export default async function ProductsPage({ params }: Props) {
  const { slug } = await params
  
  // Fetch real data from APIs
  const community = await communityService.getCommunityBySlug(slug)
  const products = await productService.getProductsByCommunity(community._id)

  if (!community) {
    return <div>Community not found</div>
  }

  // Transform products to match component props
  const allProducts: any = products.map((product) => ({
    id: product._id,
    title: product.title,
    description: product.description,
    price: product.price,
    category: product.category,
    images: product.images || [],
    thumbnail: product.thumbnail || "/placeholder.svg?height=200&width=300",
    sales: product.sales || 0,
    rating: product.rating || 0,
    communityId: community._id,
    creatorId: product.creatorId,
    creator: product.creator,
    isPublished: product.isPublished,
    variants: product.variants || [],
    files: product.files || [],
    createdAt: product.createdAt,
  }))

  // Mock user purchases for now
  const userPurchases: any[] = []

  // Use any type for community to avoid type conflicts
  const communityData: any = { 
    id: community._id, 
    name: community.name, 
    slug: community.slug 
  }

  return <ProductsPageContent slug={slug} community={communityData} allProducts={allProducts} userPurchases={userPurchases} />
}