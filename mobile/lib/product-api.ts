/**
 * Product API Integration
 * 
 * Provides functions to interact with the product endpoints for regular users.
 * Handles product browsing, purchasing, downloading, and management.
 * 
 * @module product-api
 */

import { tryEndpoints } from './http';
import { getAccessToken } from './auth';

// ============================================================================
// TypeScript Interfaces
// ============================================================================

/**
 * Product creator information
 */
export interface ProductCreator {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

/**
 * Product variant (e.g., different sizes, colors)
 */
export interface ProductVariant {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock_quantity?: number;
  sku?: string;
}

/**
 * Product file (for digital products)
 */
export interface ProductFile {
  _id: string;
  name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  download_count?: number;
}

/**
 * Main product interface
 */
export interface Product {
  _id: string;
  title: string;
  description: string;
  short_description?: string;
  images: string[];
  thumbnail?: string;
  category: string;
  type: 'digital' | 'physical';
  price: number;
  currency: string;
  discount_price?: number;
  stock_quantity?: number;
  is_published: boolean;
  created_by: ProductCreator;
  community_id?: {
    _id: string;
    name: string;
    slug: string;
  };
  variants?: ProductVariant[];
  files?: ProductFile[];
  downloads_count?: number;
  purchases_count?: number;
  rating?: number;
  reviews_count?: number;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

/**
 * User product purchase
 */
export interface ProductPurchase {
  _id: string;
  user_id: string;
  product_id: string;
  variant_id?: string;
  purchased_at: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'refunded';
  download_count?: number;
}

/**
 * API response for product list
 */
export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Product filters for browsing
 */
export interface ProductFilters {
  page?: number;
  limit?: number;
  communityId?: string;
  category?: string;
  type?: 'digital' | 'physical';
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get products with filters (for browsing)
 * 
 * @param filters - Filter options for products
 * @returns Promise with product list response
 */
export async function getProducts(filters: ProductFilters = {}): Promise<ProductListResponse> {
  try {
    console.log('🛍️ [PRODUCT-API] Fetching products with filters:', filters);

    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.communityId) params.append('communityId', filters.communityId);
    if (filters.category) params.append('category', filters.category);
    if (filters.type) params.append('type', filters.type);
    if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.search) params.append('search', filters.search);

    const resp = await tryEndpoints<any>(
      `/api/products?${params.toString()}`,
      {
        method: 'GET',
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [PRODUCT-API] Products fetched successfully:', resp.data.data?.products?.length || 0);
      return {
        products: resp.data.data?.products || [],
        total: resp.data.data?.total || 0,
        page: resp.data.data?.page || 1,
        limit: resp.data.data?.limit || 10,
        totalPages: resp.data.data?.totalPages || 1,
      };
    }

    throw new Error(resp.data.message || 'Failed to fetch products');
  } catch (error: any) {
    console.error('💥 [PRODUCT-API] Error fetching products:', error);
    throw new Error(error.message || 'Failed to fetch products');
  }
}

/**
 * Get product by ID (detailed view)
 * 
 * @param productId - Product ID
 * @returns Promise with product details
 */
export async function getProductById(productId: string): Promise<Product> {
  try {
    console.log('🛍️ [PRODUCT-API] Fetching product details:', productId);

    const resp = await tryEndpoints<any>(
      `/api/products/${productId}`,
      {
        method: 'GET',
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [PRODUCT-API] Product details fetched:', resp.data.data?.title);
      return resp.data.data;
    }

    throw new Error(resp.data.message || 'Failed to fetch product');
  } catch (error: any) {
    console.error('💥 [PRODUCT-API] Error fetching product:', error);
    throw new Error(error.message || 'Failed to fetch product details');
  }
}

/**
 * Purchase a product
 * 
 * @param productId - Product ID to purchase
 * @param variantId - Optional variant ID
 * @returns Promise with purchase data
 */
export async function purchaseProduct(
  productId: string,
  variantId?: string
): Promise<ProductPurchase> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Authentication required. Please login to purchase products.');
    }

    console.log('💳 [PRODUCT-API] Purchasing product:', productId);

    const resp = await tryEndpoints<any>(
      `/api/products/${productId}/purchase`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: variantId ? { variant_id: variantId } : {},
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [PRODUCT-API] Purchase successful');
      return resp.data.purchase || resp.data;
    }

    throw new Error(resp.data.message || 'Failed to purchase product');
  } catch (error: any) {
    console.error('💥 [PRODUCT-API] Error purchasing product:', error);
    throw new Error(error.message || 'Failed to purchase product');
  }
}

/**
 * Download a product file
 * 
 * @param productId - Product ID
 * @param fileId - File ID to download
 * @returns Promise with download URL
 */
export async function downloadProductFile(
  productId: string,
  fileId: string
): Promise<{ download_url: string }> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    console.log('⬇️ [PRODUCT-API] Downloading product file:', { productId, fileId });

    const resp = await tryEndpoints<any>(
      `/api/products/${productId}/files/${fileId}/download`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [PRODUCT-API] Download URL retrieved');
      return { download_url: resp.data.download_url || resp.data.url };
    }

    throw new Error(resp.data.message || 'Failed to get download URL');
  } catch (error: any) {
    console.error('💥 [PRODUCT-API] Error downloading file:', error);
    throw new Error(error.message || 'Failed to download file');
  }
}

/**
 * Get products by community
 * 
 * @param communityId - Community ID
 * @param filters - Additional filters
 * @returns Promise with product list
 */
export async function getProductsByCommunity(
  communityId: string,
  filters: Omit<ProductFilters, 'communityId'> = {}
): Promise<ProductListResponse> {
  try {
    console.log('🛍️ [PRODUCT-API] Fetching products for community:', communityId);

    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const resp = await tryEndpoints<any>(
      `/api/products/community/${communityId}?${params.toString()}`,
      {
        method: 'GET',
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [PRODUCT-API] Community products fetched:', resp.data.data?.products?.length || 0);
      return {
        products: resp.data.data?.products || [],
        total: resp.data.data?.total || 0,
        page: resp.data.data?.page || 1,
        limit: resp.data.data?.limit || 10,
        totalPages: resp.data.data?.totalPages || 1,
      };
    }

    throw new Error(resp.data.message || 'Failed to fetch community products');
  } catch (error: any) {
    console.error('💥 [PRODUCT-API] Error fetching community products:', error);
    throw new Error(error.message || 'Failed to fetch community products');
  }
}

/**
 * Get user's purchased products
 * 
 * @returns Promise with list of purchased products
 */
export async function getMyPurchasedProducts(): Promise<Product[]> {
  try {
    const token = await getAccessToken();
    if (!token) {
      return [];
    }

    console.log('🛍️ [PRODUCT-API] Fetching purchased products');

    const resp = await tryEndpoints<any>(
      `/api/products/my-purchases`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [PRODUCT-API] Purchased products fetched:', resp.data.products?.length || 0);
      return resp.data.products || [];
    }

    return [];
  } catch (error: any) {
    console.error('💥 [PRODUCT-API] Error fetching purchased products:', error);
    return [];
  }
}

/**
 * Check if user has purchased a product
 * 
 * @param productId - Product ID
 * @returns Promise with boolean purchase status
 */
export async function hasPurchasedProduct(productId: string): Promise<boolean> {
  try {
    const token = await getAccessToken();
    if (!token) {
      return false;
    }

    const purchasedProducts = await getMyPurchasedProducts();
    return purchasedProducts.some(product => product._id === productId);
  } catch (error) {
    return false;
  }
}

/**
 * Calculate discount percentage
 * 
 * @param product - Product object
 * @returns Discount percentage or 0 if no discount
 */
export function getDiscountPercentage(product: Product): number {
  if (!product.discount_price || product.discount_price >= product.price) {
    return 0;
  }
  
  return Math.round(((product.price - product.discount_price) / product.price) * 100);
}

/**
 * Get effective price (considering discounts)
 * 
 * @param product - Product object
 * @returns Effective price
 */
export function getEffectivePrice(product: Product): number {
  return product.discount_price && product.discount_price < product.price
    ? product.discount_price
    : product.price;
}

/**
 * Format price with currency
 * 
 * @param price - Price amount
 * @param currency - Currency code
 * @returns Formatted price string
 */
export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
}

/**
 * Check if product is in stock
 * 
 * @param product - Product object
 * @returns Boolean indicating stock availability
 */
export function isInStock(product: Product): boolean {
  // Digital products are always in stock
  if (product.type === 'digital') return true;
  
  // Physical products check stock quantity
  if (product.stock_quantity === undefined || product.stock_quantity === null) {
    return true; // Assume unlimited if not specified
  }
  
  return product.stock_quantity > 0;
}

/**
 * Get product availability message
 * 
 * @param product - Product object
 * @returns Availability message
 */
export function getAvailabilityMessage(product: Product): string {
  if (!isInStock(product)) {
    return 'Out of Stock';
  }
  
  if (product.type === 'digital') {
    return 'Instant Download';
  }
  
  if (product.stock_quantity && product.stock_quantity <= 5) {
    return `Only ${product.stock_quantity} left!`;
  }
  
  return 'In Stock';
}

/**
 * Calculate total file size for digital product
 * 
 * @param product - Product object
 * @returns Total file size in bytes
 */
export function getTotalFileSize(product: Product): number {
  if (!product.files || product.files.length === 0) return 0;
  
  return product.files.reduce((total, file) => total + file.file_size, 0);
}

/**
 * Format file size to human-readable string
 * 
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
