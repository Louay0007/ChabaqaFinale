/**
 * Product Types
 * TypeScript interfaces for Product API requests and responses
 */

export interface Product {
  _id: string
  title: string
  description: string
  price: number
  communityId: string
  creatorId: string
  creator?: {
    _id: string
    name: string
    avatar?: string
  }
  isPublished: boolean
  category: string
  images?: string[]
  thumbnail?: string
  variants?: ProductVariant[]
  files?: ProductFile[]
  sales?: number
  rating?: number
  features?: string[]
  licenseTerms?: string
  createdAt: string
  updatedAt?: string
}

export interface ProductVariant {
  _id: string
  name: string
  price: number
  description?: string
  stock?: number
}

export interface ProductFile {
  _id: string
  name: string
  url: string
  type: string
  size: string
  status?: string
}

export interface ProductFilters {
  page?: number
  limit?: number
  communityId?: string
  creatorId?: string
  category?: string
}

export interface ProductListResponse {
  products: Product[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CreateProductDto {
  title: string
  description: string
  price: number
  communityId: string
  category: string
  features?: string[]
  licenseTerms?: string
}

export interface UpdateProductDto {
  title?: string
  description?: string
  price?: number
  category?: string
  features?: string[]
  licenseTerms?: string
}
