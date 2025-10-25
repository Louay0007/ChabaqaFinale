/**
 * Product Service
 * Handles all product-related API calls
 */

import { httpClient } from "./http-client"
import type {
  Product,
  ProductFilters,
  ProductListResponse,
  CreateProductDto,
  UpdateProductDto,
} from "../types/product.types"

class ProductService {
  private static instance: ProductService

  static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService()
    }
    return ProductService.instance
  }

  /**
   * Get products list with filters
   * GET /products
   */
  async getProducts(filters?: ProductFilters): Promise<ProductListResponse> {
    const response = await httpClient.get<any>("/api/products", filters)
    const result: any = response.data || response
    return result
  }

  /**
   * Get products by community
   * GET /products/community/:communityId
   */
  async getProductsByCommunity(communityId: string): Promise<Product[]> {
    const response = await httpClient.get<any>(`/api/products/community/${communityId}`)
    const result: any = response.data || response
    return result.products || result || []
  }

  /**
   * Get single product by ID
   * GET /products/:id
   */
  async getProductById(id: string): Promise<Product> {
    const response = await httpClient.get<any>(`/api/products/${id}`)
    const result: any = response.data || response
    return result.product || result
  }

  /**
   * Create a new product
   * POST /products
   */
  async createProduct(data: CreateProductDto): Promise<Product> {
    const response = await httpClient.post<any>("/api/products", data)
    const result: any = response.data || response
    return result.product || result
  }

  /**
   * Update a product
   * PATCH /products/:id
   */
  async updateProduct(id: string, data: UpdateProductDto): Promise<Product> {
    const response = await httpClient.patch<any>(`/api/products/${id}`, data)
    const result: any = response.data || response
    return result.product || result
  }

  /**
   * Delete a product
   * DELETE /products/:id
   */
  async deleteProduct(id: string): Promise<void> {
    await httpClient.delete<any>(`/api/products/${id}`)
  }

  /**
   * Toggle product publication
   * PATCH /products/:id/toggle-published
   */
  async togglePublication(id: string): Promise<Product> {
    const response = await httpClient.patch<any>(`/api/products/${id}/toggle-published`)
    const result: any = response.data || response
    return result.product || result
  }

  /**
   * Download product file
   * POST /products/:productId/files/:fileId/download
   */
  async downloadFile(productId: string, fileId: string): Promise<{ downloadUrl: string }> {
    const response = await httpClient.post<any>(
      `/api/products/${productId}/files/${fileId}/download`
    )
    return response.data || response
  }

  /**
   * Get creator's products
   * GET /products/creator/:creatorId
   */
  async getMyCreatedProducts(): Promise<Product[]> {
    // Backend will derive creatorId from JWT
    const response = await httpClient.get<any>("/api/products")
    const result: any = response.data || response
    return result.products || result || []
  }

  /**
   * Get product statistics
   * GET /products/:id/stats
   */
  async getProductStats(productId: string): Promise<any> {
    const response = await httpClient.get<any>(`/api/products/${productId}/stats`)
    return response.data || response
  }
}

export const productService = ProductService.getInstance()
