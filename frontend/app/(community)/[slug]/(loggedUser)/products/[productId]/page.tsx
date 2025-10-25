import { productService } from "@/lib/services"
import ProductPageContent from "@/app/(community)/[slug]/(loggedUser)/products/[productId]/components/product-page-content"

type Props = {
  params: Promise<{ slug: string, productId: string }>
}

export default async function ProductPage({ params }: Props) {
  const { slug, productId } = await params
  
  // Fetch real product data
  const product = await productService.getProductById(productId)
  
  // Mock purchase for now - TODO: implement purchase system
  const purchase = undefined

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <ProductPageContent 
      slug={slug}
      product={product}
      purchase={purchase}
    />
  )
}