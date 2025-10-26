import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  RefreshControl,
  ImageBackground,
  Alert,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Search, Filter, TrendingUp, Clock } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '../../../../_components/ThemedView';
import { useAuth } from '../../../../hooks/use-auth';
import {
  Post,
  PostFilters,
  getPostsByCommunity,
  convertPostForUI,
} from '../../../../lib/post-api';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../../../lib/design-tokens';
import PostCard from './_components/PostCard';
import EmptyFeedState from './_components/EmptyFeedState';

type FilterType = 'recent' | 'popular' | 'trending';

export default function FeedScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  // State management
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('recent');
  const [page, setPage] = useState(1);

  // Load posts from API
  const loadPosts = useCallback(async (isRefresh = false, searchTerm = '') => {
    try {
      if (isRefresh) {
        setRefreshing(true);
        setPage(1);
      } else if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError('');

      console.log('📅 [FEED] Loading posts for community:', slug);

      const filters: PostFilters = {
        page: isRefresh ? 1 : page,
        limit: 10,
        communityId: slug as string,
      };

      if (searchTerm) {
        filters.search = searchTerm;
      }

      const response = await getPostsByCommunity(slug as string, filters);
      const convertedPosts = response.posts.map(convertPostForUI);

      if (isRefresh) {
        setPosts(convertedPosts);
        setPage(2);
      } else {
        setPosts(prev => page === 1 ? convertedPosts : [...prev, ...convertedPosts]);
        setPage(prev => prev + 1);
      }

      setHasMore(convertedPosts.length === 10);
      console.log('✅ [FEED] Posts loaded successfully:', convertedPosts.length);
    } catch (err: any) {
      console.error('💥 [FEED] Error loading posts:', err);
      setError(err.message || 'Failed to load posts');
      
      if (page === 1) {
        Alert.alert(
          'Error Loading Posts',
          err.message || 'Failed to load posts. Please try again.',
          [{ text: 'Retry', onPress: () => loadPosts(true) }, { text: 'Cancel' }]
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [slug, page]);

  // Initial load
  useEffect(() => {
    loadPosts();
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    loadPosts(true, searchQuery);
  };

  // Handle load more
  const handleLoadMore = () => {
    if (!loadingMore && hasMore && !loading) {
      loadPosts(false, searchQuery);
    }
  };

  // Handle search
  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    setPage(1);
    loadPosts(true, text);
  }, []);

  // Handle filter change
  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    setPage(1);
    loadPosts(true, searchQuery);
  };

  // Handle create post
  const handleCreatePost = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Login Required',
        'Please login to create posts',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Login', 
            onPress: () => router.push('/(auth)/signin')
          }
        ]
      );
      return;
    }
    
    router.push(`/(community)/${slug}/feed/create`);
  };

  // Render post item
  const renderPost = ({ item }: { item: Post }) => (
    <PostCard 
      post={item}
      onPress={() => router.push(`/(community)/${slug}/feed/${item.id}`)}
    />
  );

  // Render header
  const renderHeader = () => (
    <View style={styles.header}>
      <ImageBackground
        source={require('../../../../assets/images/background.png')}
        style={styles.headerBackground}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(142, 120, 251, 0.8)', 'rgba(142, 120, 251, 0.6)']}
          style={styles.headerOverlay}
        >
          <BlurView intensity={20} style={styles.headerContent}>
            {/* Title */}
            <Text style={styles.headerTitle}>Community Feed</Text>
            
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <Search size={20} color={colors.gray500} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search posts..."
                  placeholderTextColor={colors.gray500}
                  value={searchQuery}
                  onChangeText={handleSearch}
                />
              </View>
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterContainer}>
              {[
                { key: 'recent' as FilterType, label: 'Recent', icon: Clock },
                { key: 'popular' as FilterType, label: 'Popular', icon: TrendingUp },
                { key: 'trending' as FilterType, label: 'Trending', icon: Filter },
              ].map(({ key, label, icon: Icon }) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.filterTab,
                    activeFilter === key && styles.activeFilterTab
                  ]}
                  onPress={() => handleFilterChange(key)}
                >
                  <Icon 
                    size={16} 
                    color={activeFilter === key ? colors.white : colors.gray600} 
                  />
                  <Text 
                    style={[
                      styles.filterTabText,
                      activeFilter === key && styles.activeFilterTabText
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </BlurView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );

  // Render loading footer
  const renderLoadingFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.loadingFooterText}>Loading more posts...</Text>
      </View>
    );
  };

  // Loading state
  if (loading && posts.length === 0) {
    return (
      <ThemedView style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading posts...</Text>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyFeedState 
            onCreatePost={handleCreatePost}
            isAuthenticated={isAuthenticated}
          />
        }
        ListFooterComponent={renderLoadingFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      {/* Create Post FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleCreatePost}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[colors.primary, '#9c88ff']}
          style={styles.fabGradient}
        >
          <Plus size={24} color={colors.white} />
        </LinearGradient>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  
  // Header Styles
  header: {
    marginBottom: spacing.md,
  },
  headerBackground: {
    height: 220,
  },
  headerOverlay: {
    flex: 1,
  },
  headerContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.lg,
    justifyContent: 'flex-end' as const,
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold as any,
    color: colors.white,
    textAlign: 'center' as const,
    marginBottom: spacing.lg,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  // Search Styles
  searchContainer: {
    marginBottom: spacing.lg,
  },
  searchInputContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: fontSize.base,
    color: colors.gray800,
  },

  // Filter Styles
  filterContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
  },
  filterTab: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeFilterTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterTabText: {
    marginLeft: spacing.xs,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium as any,
    color: colors.gray600,
  },
  activeFilterTabText: {
    color: colors.white,
    fontWeight: fontWeight.semibold as any,
  },

  // List Styles
  listContainer: {
    paddingBottom: 100, // Space for FAB
  },

  // Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingTop: spacing.xxxl,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSize.base,
    color: colors.gray600,
    fontWeight: fontWeight.medium as any,
  },
  loadingFooter: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingVertical: spacing.lg,
  },
  loadingFooterText: {
    marginLeft: spacing.sm,
    fontSize: fontSize.sm,
    color: colors.gray600,
  },

  // FAB Styles
  fab: {
    position: 'absolute' as const,
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
};
