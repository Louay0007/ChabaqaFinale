import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PlatformUtils from '@/lib/platform-utils';
import { useAdaptiveColors } from '@/hooks/useAdaptiveColors';
import { ExploreData } from '@/lib/data-communities';
import { getCommunities, Community } from '@/lib/communities-api';
import { communityStyles } from './_styles';
import CommunityCard from './_components/_ComponentCard';
import SearchBar from './_components/SearchBar';
import Sidebar from './_components/Sidebar';

export default function CommunitiesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [communities, setCommunities] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(ExploreData.categories);
  const [sidebarKey, setSidebarKey] = useState(0); // Force sidebar refresh
  const adaptiveColors = useAdaptiveColors();

  // Always use list mode
  const viewMode = 'list';

  // Fetch communities from backend
  useEffect(() => {
    fetchCommunities();
  }, []);

  // Refresh sidebar when screen gains focus (user returns from community detail)
  useFocusEffect(
    useCallback(() => {
      refreshSidebar();
    }, [])
  );

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching communities from backend...');

      const response = await getCommunities({
        page: 1,
        limit: 50,
      });

      if (response.success && response.data) {
        console.log('📦 Raw backend data sample:', response.data[0]);

        // Transform backend data to match frontend format
        const transformedCommunities = response.data.map((community: any) => {
          // Helper to fix URLs
          const fixUrl = (url: string | null | undefined) => {
            if (!url) return null;
            const apiBase = PlatformUtils.getApiUrl();
            if (url.startsWith('http')) {
              return url.replace('http://localhost:3000', apiBase)
                .replace('http://127.0.0.1:3000', apiBase);
            }
            return `${apiBase}${url.startsWith('/') ? '' : '/'}${url}`;
          };

          // Extract creator info
          let creatorName = 'Unknown Creator';
          let rawCreatorAvatar = null;

          if (typeof community.creator === 'object' && community.creator !== null) {
            creatorName = community.creator.name || 'Unknown Creator';
            rawCreatorAvatar = community.creator.avatar;
          } else if (typeof community.creator === 'string') {
            creatorName = community.creator;
            rawCreatorAvatar = community.creatorAvatar;
          }

          const creatorAvatar = fixUrl(rawCreatorAvatar) || `https://placehold.co/64x64?text=${creatorName.charAt(0)}`;

          // Map category images based on category name
          const getCategoryImage = (category: string) => {
            const categoryImages: { [key: string]: any } = {
              'Marketing': require('@/assets/images/email-marketing.png'),
              'Design': require('@/assets/images/branding-hero.png'),
              'Fitness': require('@/assets/images/Personal-coaching-fitness.png'),
              'Web Design': require('@/assets/images/website-vitrine.png'),
              'Development': require('@/assets/images/background.png'),
              'Technology': require('@/assets/images/background.png'),
            };
            return categoryImages[category] || require('@/assets/images/email-marketing.png');
          };

          // Get image URLs - backend returns cover image in 'image' field
          const rawImageUrl = community.image || community.logo;
          let finalImageUrl: string | number;

          // Check if URL is a placeholder URL that mobile can't access
          const isPlaceholderUrl = (url: string) => {
            return url.includes('placeholder.com') || url.includes('placehold.co');
          };

          if (rawImageUrl && rawImageUrl.trim() && !isPlaceholderUrl(rawImageUrl)) {
            // If we have a valid non-placeholder URL, fix it and use it
            const fixedUrl = fixUrl(rawImageUrl);
            finalImageUrl = fixedUrl || getCategoryImage(community.category || 'General');
          } else {
            // If no URL, placeholder URL, or mobile can't access it, use category fallback
            finalImageUrl = getCategoryImage(community.category || 'General');
          }

          // DEBUG: Log image data
          console.log('🖼️ [IMAGE DEBUG]', {
            communityName: community.name,
            rawImage: community.image,
            rawImageUrl,
            isPlaceholder: rawImageUrl ? isPlaceholderUrl(rawImageUrl) : false,
            finalImageUrl: typeof finalImageUrl === 'string' ? finalImageUrl : 'LOCAL_ASSET',
            category: community.category
          });

          const transformed = {
            id: community.id || community._id || '',
            slug: community.slug || '',
            name: community.name || 'Unnamed Community',
            creator: creatorName,
            creatorAvatar: creatorAvatar,
            description: community.description || community.short_description || community.shortDescription || '',
            category: community.category || 'General',
            members: community.members || community.membersCount || 0,
            rating: community.rating || community.averageRating || 0,
            price: community.price || community.fees_of_join || 0,
            priceType: community.priceType || 'free',
            // Use the final processed image URL
            image: finalImageUrl,
            // Store the URL for future use (only if it's a string URL)
            imageUrl: typeof finalImageUrl === 'string' ? finalImageUrl : '',
            tags: community.tags || [],
            featured: community.featured || false,
            verified: community.verified || community.isVerified || false,
            type: community.type || 'community',
            link: `/(communities)/${community.slug}`,
          };

          return transformed;
        });

        setCommunities(transformedCommunities);
        console.log('✅ Communities loaded:', transformedCommunities.length);
        console.log('📊 Sample transformed community:', transformedCommunities[0]);
      } else {
        // Fallback to mock data if API fails
        console.warn('⚠️ Using fallback mock data');
        setCommunities(ExploreData.communities);
      }
    } catch (error) {
      console.error('❌ Error fetching communities:', error);
      // Fallback to mock data on error
      setCommunities(ExploreData.communities);
    } finally {
      setLoading(false);
    }
  };

  // Filter communities
  const filteredCommunities = useMemo(() => {
    let filtered = communities;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(community =>
        community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      // Map category names to types for filtering
      const categoryToTypeMap: { [key: string]: string } = {
        'Community': 'community',
        'Course': 'course',
        'Challenge': 'challenge',
        'Product': 'product',
        '1-to-1 Sessions': 'oneToOne',
        'Event': 'event'
      };

      const targetType = categoryToTypeMap[selectedCategory];
      if (targetType) {
        filtered = filtered.filter(community =>
          community.type === targetType
        );
      }
    }

    // Default sort by popularity (featured first, then by members)
    filtered = [...filtered].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.members - a.members;
    });

    return filtered;
  }, [searchQuery, selectedCategory, communities]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCommunities();
    // Also refresh sidebar to update joined communities
    setSidebarKey(prev => prev + 1);
    setRefreshing(false);
  };

  const refreshSidebar = () => {
    setSidebarKey(prev => prev + 1);
  };

  const renderCommunityItem = ({ item }: { item: any }) => (
    <CommunityCard community={item} viewMode="list" />
  );

  const renderEmptyState = () => (
    <View style={communityStyles.emptyState}>
      <Ionicons name="search" size={64} color={adaptiveColors.secondaryText} />
      <Text style={[communityStyles.emptyStateText, { color: adaptiveColors.secondaryText }]}>
        No communities found matching your criteria.
        {searchQuery ? ` Try adjusting your search for "${searchQuery}".` : ''}
      </Text>
    </View>
  );

  const renderTopBar = () => (
    <View style={[communityStyles.topNavBar, { backgroundColor: adaptiveColors.cardBackground, borderBottomColor: adaptiveColors.cardBorder }]}>
      {/* Left section - Menu + Logo */}
      <View style={communityStyles.navLeft}>
        <TouchableOpacity
          style={communityStyles.menuButton}
          onPress={() => {
            setSidebarVisible(true);
          }}
        >
          <Ionicons name="menu" size={24} color={adaptiveColors.primaryText} />
        </TouchableOpacity>
        <Image
          source={require('@/assets/images/logo_chabaqa.png')}
          style={communityStyles.logo}
        />
      </View>

      {/* Right section - Empty space */}
      <View style={communityStyles.navRight} />
    </View>
  );

  const renderHeader = () => (
    <View style={[communityStyles.header, { backgroundColor: adaptiveColors.cardBackground }]}>
      <Text style={[communityStyles.headerTitle, { color: adaptiveColors.primaryText }]}>
        Discover communities
      </Text>
      <Text style={[communityStyles.headerSubtitle, { color: adaptiveColors.secondaryText }]}>
        or{' '}
        <Text
          style={{ color: '#8e78fb', fontWeight: '600' }}
          onPress={() => router.push('/(build_community)')}
        >
          create your own
        </Text>
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[communityStyles.container, { backgroundColor: adaptiveColors.cardBackground }]}>
        <View style={communityStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#8b5cf6" />
          <Text style={[communityStyles.emptyStateText, { color: adaptiveColors.secondaryText }]}>Loading communities...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[communityStyles.container, { backgroundColor: adaptiveColors.cardBackground }]}>
      <StatusBar style={adaptiveColors.isDark ? "light" : "dark"} />
      {/* Top Navigation Bar */}
      {renderTopBar()}

      {/* Header */}
      {renderHeader()}

      {/* Search and Filters */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedSort=""
        onSortChange={() => { }}
        categories={categories}
        sortOptions={[]}
      />

      {/* Communities List */}
      <FlatList
        data={filteredCommunities}
        renderItem={renderCommunityItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={communityStyles.communitiesList}
        numColumns={1}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        nestedScrollEnabled={true}
        scrollEnabled={true}
      />

      {/* Sidebar */}
      <Sidebar
        key={sidebarKey}
        isVisible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />
    </SafeAreaView>
  );
}
