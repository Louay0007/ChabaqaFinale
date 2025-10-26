import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAdaptiveColors } from '@/hooks/useAdaptiveColors';
import { getCommunities, Community } from '@/lib/communities-api';
import { ExploreData } from '@/lib/data-communities';
import { communityStyles } from './_styles';
import CommunityCard from './_components/_ComponentCard';
import SearchBar from './_components/SearchBar';
import Sidebar from './_components/Sidebar';
import GlobalBottomNavigation from '../_components/GlobalBottomNavigation';

export default function CommunitiesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const adaptiveColors = useAdaptiveColors();

  // Always use list mode
  const viewMode = 'list';

  // Load communities from API
  const loadCommunities = async (pageNum: number = 1, append: boolean = false) => {
    try {
      if (!append) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError('');

      console.log('🔄 [COMMUNITIES] Loading communities...', {
        page: pageNum,
        search: searchQuery,
        category: selectedCategory,
      });

      // Map category names to types for API
      const categoryToTypeMap: { [key: string]: string } = {
        'Community': 'community',
        'Course': 'course',
        'Challenge': 'challenge',
        'Product': 'product',
        '1-to-1 Sessions': 'oneToOne',
        'Event': 'event',
      };

      const filters: any = {
        page: pageNum,
        limit: 12,
        sortBy: 'popular',
      };

      if (searchQuery.trim()) {
        filters.search = searchQuery.trim();
      }

      if (selectedCategory !== 'All') {
        const targetType = categoryToTypeMap[selectedCategory];
        if (targetType) {
          filters.type = targetType;
        }
      }

      const result = await getCommunities(filters);

      // Backend returns data as Community[] directly
      const communitiesData = result.data;
      
      console.log('✅ [COMMUNITIES] Loaded successfully:', {
        count: communitiesData.length,
        total: result.pagination?.total || communitiesData.length,
      });

      if (append) {
        setCommunities(prev => [...prev, ...communitiesData]);
      } else {
        setCommunities(communitiesData);
      }

      // Handle pagination if available, otherwise disable
      if (result.pagination) {
        setPage(result.pagination.page);
        setTotalPages(result.pagination.totalPages);
      } else {
        // No pagination from backend - show all at once
        setPage(1);
        setTotalPages(1);
      }
    } catch (err: any) {
      console.error('💥 [COMMUNITIES] Error loading communities:', err);
      setError(err.message || 'Failed to load communities');

      // Fallback to mock data on error
      if (!append && communities.length === 0) {
        console.log('📦 [COMMUNITIES] Using fallback mock data');
        setCommunities(ExploreData.communities as any);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load communities on mount and when filters change
  useEffect(() => {
    loadCommunities(1, false);
  }, [searchQuery, selectedCategory]);

  // Load more communities (pagination)
  const loadMoreCommunities = () => {
    if (!loadingMore && page < totalPages) {
      loadCommunities(page + 1, true);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCommunities(1, false);
    setRefreshing(false);
  };

  const handleRetry = () => {
    loadCommunities(1, false);
  };

  const renderCommunityItem = ({ item }: { item: any }) => (
    <CommunityCard community={item} viewMode="list" />
  );

  const renderEmptyState = () => {
    if (error) {
      return (
        <View style={communityStyles.emptyState}>
          <Ionicons name="cloud-offline" size={64} color={adaptiveColors.secondaryText} />
          <Text style={[communityStyles.emptyStateText, { color: adaptiveColors.secondaryText, marginBottom: 16 }]}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={handleRetry}
            style={[communityStyles.retryButton, { backgroundColor: '#8e78fb' }]}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={communityStyles.emptyState}>
        <Ionicons name="search" size={64} color={adaptiveColors.secondaryText} />
        <Text style={[communityStyles.emptyStateText, { color: adaptiveColors.secondaryText }]}>
          No communities found matching your criteria.
          {searchQuery ? ` Try adjusting your search for "${searchQuery}".` : ''}
        </Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={{ padding: 20, alignItems: 'center' }}>
        <ActivityIndicator size="small" color="#8b5cf6" />
        <Text style={[communityStyles.emptyStateText, { color: adaptiveColors.secondaryText, marginTop: 8 }]}>
          Loading more...
        </Text>
      </View>
    );
  };

  const renderTopBar = () => (
    <View style={[
      communityStyles.topNavBar, 
      { 
        backgroundColor: adaptiveColors.cardBackground, 
        borderBottomColor: adaptiveColors.cardBorder,
        paddingTop: Platform.OS === 'ios' ? 44 : 0, // iPhone safe area
      }
    ]}>
      {/* Left section - Menu + Logo */}
      <View style={communityStyles.navLeft}>
        <TouchableOpacity 
          style={communityStyles.menuButton}
          onPress={() => setSidebarVisible(true)}
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
        onSortChange={() => {}}
        categories={ExploreData.categories}
        sortOptions={[]}
      />

      {/* Communities List */}
      <FlatList
        data={communities}
        renderItem={renderCommunityItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={communityStyles.communitiesList}
        numColumns={1}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        onEndReached={loadMoreCommunities}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        nestedScrollEnabled={true}
        scrollEnabled={true}
      />


      <Sidebar 
        isVisible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />

      {/* Global Bottom Navigation */}
      <GlobalBottomNavigation />
    </SafeAreaView>
  );
}
