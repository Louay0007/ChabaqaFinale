import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { ThemedText } from '../../../../_components/ThemedText';
import { ThemedView } from '../../../../_components/ThemedView';
import { getCommunityBySlug as getMockCommunity, getUserPurchases, Product as MockProduct, Purchase } from '../../../../lib/mock-data';
import { getCommunityBySlug } from '../../../../lib/communities-api';
import { getProductsByCommunity as getBackendProducts, getMyPurchasedProducts, Product as BackendProduct } from '../../../../lib/product-api';
import BottomNavigation from '../../_components/BottomNavigation';
import { ProductsHeader } from './_components/ProductsHeader';
import { ProductsList } from './_components/ProductsList';
import { ProductsTabs } from './_components/ProductsTabs';
import { SearchBar } from './_components/SearchBar';
import { styles } from './styles';

export default function ProductsScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [community, setCommunity] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [userPurchases, setUserPurchases] = useState<any[]>([]);

  // Fetch community and products data
  useEffect(() => {
    fetchData();
  }, [slug]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('�️ [PRODUCTS] Fetching products for community:', slug);

      // Fetch community data first
      const communityResponse = await getCommunityBySlug(slug || '');
      if (!communityResponse.success || !communityResponse.data) {
        throw new Error('Community not found');
      }

      const communityData = {
        id: communityResponse.data._id || communityResponse.data.id,
        name: communityResponse.data.name,
        slug: communityResponse.data.slug,
      };
      setCommunity(communityData);

      // Fetch products for this community
      console.log('🛍️ [PRODUCTS] Fetching products for community ID:', communityData.id);
      const productsResponse = await getBackendProducts(communityData.id, {
        page: 1,
        limit: 50,
      });

      console.log('📦 [PRODUCTS] Response:', {
        total: productsResponse.total,
        count: productsResponse.products?.length,
        page: productsResponse.page,
        limit: productsResponse.limit
      });

      // Transform backend products to match frontend interface
      console.log('🔄 [PRODUCTS] Transforming', productsResponse.products.length, 'products');
      const transformedProducts = (productsResponse.products || []).map((product: BackendProduct) => {
        console.log('   → Product:', product.title);
        return {
          id: product._id,
          title: product.title,
          description: product.description,
          shortDescription: product.short_description || product.description,
          price: product.price,
          currency: product.currency,
          category: product.category,
          type: product.type,
          images: product.images || [],
          thumbnail: product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/400x300',
          creator: product.created_by,
          communityId: communityData.id,
          isPublished: product.is_published,
          stockQuantity: product.stock_quantity,
          rating: product.rating || 0,
          tags: product.tags || [],
          variants: product.variants || [],
          files: product.files || [],
          createdAt: product.created_at,
          updatedAt: product.updated_at,
        };
      });

      console.log('✅ [PRODUCTS] Transformed products:', transformedProducts.length);
      setAllProducts(transformedProducts);

      // Fetch user's purchased products
      console.log('📊 [PRODUCTS] Fetching user purchases');
      try {
        const purchasedProducts = await getMyPurchasedProducts();
        console.log('📊 [PRODUCTS] User purchases response:', purchasedProducts?.length || 0);

        const transformedPurchases = (purchasedProducts || []).map(product => ({
          id: Date.now().toString() + Math.random(),
          userId: 'current-user',
          productId: product._id,
          product: product,
          purchasedAt: new Date(),
          downloadCount: 0,
          amount: product.price,
          currency: product.currency,
        }));

        console.log('✅ [PRODUCTS] Transformed purchases:', transformedPurchases.length);
        setUserPurchases(transformedPurchases);
      } catch (purchaseError: any) {
        console.warn('⚠️ [PRODUCTS] Could not fetch purchases:', purchaseError.message);
        setUserPurchases([]);
      }

      console.log('✅ [PRODUCTS] Products loaded:', transformedProducts.length);
    } catch (err: any) {
      console.error('❌ [PRODUCTS] Error fetching products:', err);
      setError(err.message || 'Failed to load products');

      // Fallback to mock data
      console.log('⚠️ [PRODUCTS] Falling back to mock data');
      const mockCommunity = getMockCommunity(slug || '');
      if (mockCommunity) {
        setCommunity(mockCommunity);
        // Use mock products as fallback - keeping original functionality
        setAllProducts([]);
        setUserPurchases([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search and active tab
  const filteredProducts = allProducts.filter((product: any) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const isPurchased = userPurchases.some((p: any) => p.productId === product.id);

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
  const freeCount = allProducts.filter((p: any) => p.price === 0).length;
  const premiumCount = allProducts.filter((p: any) => p.price > 0).length;

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

  const handlePurchase = (product: any) => {
    console.log('Purchase product:', product.id);
    // TODO: Implement real purchase logic with backend API
    // This will call the purchase API endpoint
  };

  const handleDownload = (product: any) => {
    console.log('Download product:', product.id);
    // TODO: Implement real download logic with backend API
    // This will call the download API endpoint
  };

  if (loading) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#8e78fb" />
        <ThemedText style={{ marginTop: 16, opacity: 0.7 }}>Loading products...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={{ color: '#ef4444', textAlign: 'center', margin: 20 }}>
          {error}
        </ThemedText>
        <ThemedText style={{ textAlign: 'center', opacity: 0.7 }}>
          Community: {slug}
        </ThemedText>
      </ThemedView>
    );
  }

  if (!community) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Community not found</ThemedText>
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
        products={filteredProducts}
        userPurchases={userPurchases}
        searchQuery={searchQuery}
        onProductPress={navigateToProductDetails}
        onPurchase={handlePurchase}
        onDownload={handleDownload}
      />

      <BottomNavigation slug={slug as string} currentTab="products" />
    </ThemedView>
  );
}


