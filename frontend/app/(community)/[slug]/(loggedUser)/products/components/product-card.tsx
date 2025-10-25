import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Users, Download, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Product } from "@/lib/models"
import { getFileTypeIcon } from "@/lib/utilsmedia"

interface ProductCardProps {
  product: Product
  isPurchased: boolean
  isSelected: boolean
  onSelect: () => void
  slug: string
}

export default function ProductCard({
  product,
  isPurchased,
  isSelected,
  onSelect,
  slug
}: ProductCardProps) {
  const fileTypes = [...new Set(product.files?.map(f => f.type))]

  return (
    <Card
      className={`border-0 shadow-sm hover:shadow-md transition-all cursor-pointer ${
        isSelected ? "ring-2 ring-primary-500" : ""
      }`}
      onClick={onSelect}
    >
      <div className="flex flex-col md:flex-row">
        <div className="relative md:w-64">
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
            <Image
              src={product.images[0] || "/placeholder.svg?height=200&width=256&query=digital-product"}
              alt={product.title}
              width={256}
              height={200}
              className="w-full h-48 md:h-full object-contain p-4 rounded-t-lg md:rounded-l-lg md:rounded-t-none"
            />
          </div>
          <div className="absolute top-3 right-3">
            {isPurchased ? (
              <Badge className="bg-green-500 text-white">
                <CheckCircle className="h-3 w-3 mr-1" />
                Owned
              </Badge>
            ) : product.price === 0 ? (
              <Badge className="bg-blue-500 text-white">Free</Badge>
            ) : (
              <Badge variant="secondary" className="bg-white/90">
                ${product.price}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex-1 p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
              <p className="text-muted-foreground line-clamp-2">{product.description}</p>
            </div>
            <div className="flex items-center text-sm text-muted-foreground ml-4">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span>{product.rating || "4.8"} ({product.sales})</span>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2 text-sm text-muted-foreground mb-4">
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
            {fileTypes.map((type, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {type}
              </Badge>
            ))}
            <div className="flex items-center ml-auto">
              <Users className="h-4 w-4 mr-1" />
              {product.sales} downloads
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={product.creator.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {product.creator.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{product.creator.name}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                asChild
                className="text-primary-600 hover:text-primary-800"
              >
                <Link href={`/${slug}/products/${product.id}`}>
                  View Details
                </Link>
              </Button>
              
              {isPurchased ? (
                <Button size="sm" asChild>
                  <Link href={`/${slug}/products/${product.id}/download`}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Link>
                </Button>
              ) : product.price === 0 ? (
                <Button size="sm" variant="outline">
                  Get Free
                </Button>
              ) : (
                <Button size="sm">
                  Buy - ${product.price}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}