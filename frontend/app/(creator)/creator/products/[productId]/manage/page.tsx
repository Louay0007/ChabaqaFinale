import { ProductHeader } from "./components/product-header"
import { ProductTabs } from "./components/product-tabs"
import { ProductFormProvider } from "./components/product-form-context"
import { productService } from "@/lib/services"
import { Button } from "@/components/ui/button"
import { ShoppingBag, ArrowLeft } from "lucide-react"
import Link from "next/link"

type Props = {
  params: Promise<{ productId: string }>
}

export default async function CreatorProductPage({ params }: Props) {
  const { productId } = await params
  
  // Fetch real data from API
  const product = await productService.getProductById(productId).catch(() => null)

  if (!product) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Product not found</h3>
        <Button asChild className="mt-4">
          <Link href="/creator/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <ProductFormProvider product={product}>
      <div className="max-w-6xl mx-auto space-y-8 p-5">
        <ProductHeader />
        <ProductTabs />
      </div>
    </ProductFormProvider>
  )
}