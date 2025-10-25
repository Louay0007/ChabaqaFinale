import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { ThemedText } from '../../../../_components/ThemedText';
import { ThemedView } from '../../../../_components/ThemedView';
import {
  Product,
  getProductsByCommunity,
  getMyPurchasedProducts,
  hasPurchasedProduct
} from '../../../../lib/product-api';
import { useAuth } from '../../../../hooks/use-auth';
import BottomNavigation from '../../_components/BottomNavigation';
import { ProductsHeader } from './_components/ProductsHeader';
import { ProductsList } from './_components/ProductsList';
import { ProductsTabs } from './_components/ProductsTabs';
import { SearchBar } from './_components/SearchBar';
import { styles } from './styles';

export default function ProductsScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();
  
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [userPurchases, setUserPurchases] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [communityId, setCommunityId] = useState<string>('');

  // Set community ID from slug
  useEffect(() => {
    setCommunityId(slug as string);
  }, [slug]);

  // Load products
  const loadProducts = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError('');

      console.log('🛍️ [PRODUCTS] Loading products for community:', slug);

      // Fetch all products for this community
      const response = await getProductsByCommunity(communityId || '', {
        page: 1,
        limit: 50,
      });

      setAllProducts(response.products);

      // Fetch user's purchases if authenticated
      if (isAuthenticated) {
        const purchases = await getMyPurchasedProducts();
        setUserPurchases(purchases);
        console.log('✅ [PRODUCTS] Purchased products loaded:', purchases.length);
      }

      console.log('✅ [PRODUCTS] Products loaded successfully:', response.products.length);
    } catch (err: any) {
      console.error('💥 [PRODUCTS] Error loading products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [communityId, isAuthenticated, slug]);

  // Load on mount
  useEffect(() => {
    if (communityId) {
      loadProducts();
    }
  }, [communityId, loadProducts]);

  // Handle refresh
  const handleRefresh = () => {
    loadProducts(true);
  };

  // Filter products based on search and active tab
  const filteredProducts = allProducts.filter((product: Product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const isPurchased = userPurchases.some((p) => p._id === product._id);

    if (activeTab === 'purchased') {
      return matchesSearch && isPurchased;
    }
    if (activeTab === 'free') {
      return matchesSearch && product.price === 0;
    }
    if (activeTab === 'paid') {
      return matchesSearch && product.price > 0;
    }
    return matchesSearch;
  });

  // Calculate counts for tabs and header
  const totalProducts = allProducts.length;
  const purchasedCount = userPurchases.length;
  const freeCount = allProducts.filter((p: Product) => p.price === 0).length;
  const premiumCount = allProducts.filter((p: Product) => p.price > 0).length;

  // Create tabs data
  const tabs = [
    { key: 'all', title: 'All', count: totalProducts },
    { key: 'purchased', title: 'My Library', count: purchasedCount },
    { key: 'free', title: 'Free', count: freeCount },
    { key: 'paid', title: 'Premium', count: premiumCount },
  ];

  // Navigation and actions
  const navigateToProductDetails = (productId: string) => {
    router.push(`/(community)/${slug}/products/${productId}`);
  };

  // Convert API products to component-compatible format
  const convertedProducts = filteredProducts.map(product => ({
    ...product,
    id: product._id, // Add id field for compatibility
    communityId: product.community_id?._id || '',
    creatorId: product.created_by._id,
    creator: {
      ...product.created_by,
      id: product.created_by._id,
      role: 'creator' as const,
      verified: true,
      communities: [],
      createdAt: new Date(product.created_at),
      updatedAt: new Date(product.updated_at)
    },
    image: product.thumbnail || product.images?.[0] || '',
    downloadUrl: product.files?.[0]?.file_url || '',
    sales: product.purchases_count || 0,
    isPublished: product.is_published,
    createdAt: product.created_at,
    updatedAt: product.updated_at,
    tags: product.tags || []
  }));

  // Convert purchases for compatibility
  const convertedPurchases = userPurchases.map(product => ({
    id: product._id,
    userId: 'current-user', // This would come from auth context
    user: {
      id: 'current-user',
      name: 'Current User',
      email: 'user@example.com',
      role: 'member' as const,
      verified: true,
      communities: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    productId: product._id,
    product: {
      ...product,
      id: product._id,
      communityId: product.community_id?._id || '',
      creatorId: product.created_by._id,
      creator: {
        ...product.created_by,
        id: product.created_by._id,
        role: 'creator' as const,
        verified: true,
        communities: [],
        createdAt: new Date(product.created_at),
        updatedAt: new Date(product.updated_at)
      },
      image: product.thumbnail || product.images?.[0] || '',
      downloadUrl: product.files?.[0]?.file_url || '',
      sales: product.purchases_count || 0,
      isPublished: product.is_published,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
      tags: product.tags || []
    },
    purchasedAt: new Date().toISOString(),
    amount: product.price,
    currency: product.currency,
    status: 'completed' as const,
    downloadCount: product.downloads_count || 0
  }));

  const handlePurchase = (product: Product) => {
    console.log('Purchase product:', product._id);
    // Handle purchase logic
  };

  const handleDownload = (product: Product) => {
    console.log('Download product:', product._id);
    // Handle download logic
  };

  // Loading state
  if (loading && !refreshing) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#8e78fb" />
        <Text style={{ marginTop: 16, color: '#666', fontSize: 16 }}>Loading products...</Text>
      </ThemedView>
    );
  }

  // Error state
  if (error && !refreshing) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>⚠️</Text>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 8 }}>Oops!</Text>
        <Text style={{ fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 }}>
          {error}
        </Text>
        <TouchableOpacity
          onPress={() => loadProducts()}
          style={{
            backgroundColor: '#8e78fb',
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Try Again</Text>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ProductsHeader
        totalProducts={totalProducts}
        purchasedCount={purchasedCount}
        freeCount={freeCount}
        premiumCount={premiumCount}
      />

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search products..."
      />

      <ProductsTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
      />

      <ProductsList
        products={convertedProducts as any}
        userPurchases={convertedPurchases as any}
        searchQuery={searchQuery}
        onProductPress={navigateToProductDetails}
        onPurchase={(product) => handlePurchase(filteredProducts.find(p => p._id === product.id)!)}
        onDownload={(product) => handleDownload(filteredProducts.find(p => p._id === product.id)!)}
      />

      <BottomNavigation slug={slug as string} currentTab="products" />
    </ThemedView>
  );
}


