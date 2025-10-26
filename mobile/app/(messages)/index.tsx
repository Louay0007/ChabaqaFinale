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
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  MessageCircle, 
  Plus, 
  Search, 
  Filter,
  HelpCircle,
  Users
} from 'lucide-react-native';

import { ThemedView } from '../../_components/ThemedView';
import { useAuth } from '../../hooks/use-auth';
import GlobalBottomNavigation from '../_components/GlobalBottomNavigation';
import {
  DMConversation,
  getInbox,
  startHelpConversation,
  getConversationDisplayName,
  getConversationAvatar,
  getUnreadCount,
  formatMessageTime,
  formatMessagePreview,
} from '../../lib/dm-api';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../lib/design-tokens';
import ConversationItem from './_components/ConversationItem';
import EmptyMessagesState from './_components/EmptyMessagesState';
import NewConversationModal from './_components/NewConversationModal';

type FilterType = 'all' | 'community' | 'help';

export default function MessagesScreen() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();

  // State management
  const [conversations, setConversations] = useState<DMConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [page, setPage] = useState(1);
  const [showNewConversation, setShowNewConversation] = useState(false);

  // Check authentication - only redirect if auth loading is complete and not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      // Redirect silently instead of showing alert
      router.replace('/(auth)/signin');
      return;
    }
    
    // Load conversations when authenticated and not loading
    if (!authLoading && isAuthenticated) {
      loadConversations();
    }
  }, [isAuthenticated, authLoading]);

  // Load conversations from API
  const loadConversations = useCallback(async (isRefresh = false, filter: FilterType = 'all') => {
    if (!isAuthenticated) return;

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

      console.log('💬 [MESSAGES] Loading conversations:', { filter, page: isRefresh ? 1 : page });

      const filterType = filter === 'all' ? undefined : filter;
      const response = await getInbox(filterType, isRefresh ? 1 : page, 20);

      if (isRefresh) {
        setConversations(response.conversations);
        setPage(2);
      } else {
        setConversations(prev => page === 1 ? response.conversations : [...prev, ...response.conversations]);
        setPage(prev => prev + 1);
      }

      setHasMore(response.hasMore);
      console.log('✅ [MESSAGES] Conversations loaded:', response.conversations.length);
    } catch (err: any) {
      console.error('💥 [MESSAGES] Error loading conversations:', err);
      setError(err.message || 'Failed to load conversations');
      
      if (page === 1) {
        Alert.alert(
          'Error Loading Messages',
          err.message || 'Failed to load conversations. Please try again.',
          [{ text: 'Retry', onPress: () => loadConversations(true, filter) }, { text: 'Cancel' }]
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [isAuthenticated, page]);

  // Initial load
  useEffect(() => {
    if (isAuthenticated) {
      loadConversations();
    }
  }, [isAuthenticated]);

  // Handle refresh
  const handleRefresh = () => {
    loadConversations(true, activeFilter);
  };

  // Handle load more
  const handleLoadMore = () => {
    if (!loadingMore && hasMore && !loading) {
      loadConversations(false, activeFilter);
    }
  };

  // Handle filter change
  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    setPage(1);
    loadConversations(true, filter);
  };

  // Handle conversation press
  const handleConversationPress = (conversation: DMConversation) => {
    router.push(`/(messages)/${conversation._id}`);
  };

  // Handle start help conversation
  const handleStartHelp = async () => {
    try {
      setLoading(true);
      console.log('🆘 [MESSAGES] Starting help conversation');
      
      const conversation = await startHelpConversation();
      
      console.log('✅ [MESSAGES] Help conversation started');
      router.push(`/(messages)/${conversation._id}`);
    } catch (error: any) {
      console.error('💥 [MESSAGES] Error starting help:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to start help conversation. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Render header
  const renderHeader = () => (
    <View style={styles.header}>
      <ImageBackground
        source={require('../../assets/images/background.png')}
        style={styles.headerBackground}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(142, 120, 251, 0.9)', 'rgba(142, 120, 251, 0.7)']}
          style={styles.headerOverlay}
        >
          <SafeAreaView style={styles.headerContent}>
            <BlurView intensity={20} style={styles.headerBlur}>
              {/* Title and Actions */}
              <View style={styles.headerTop}>
                <View style={styles.titleContainer}>
                  <MessageCircle size={28} color={colors.white} />
                  <Text style={styles.headerTitle}>Messages</Text>
                </View>
                
                <View style={styles.headerActions}>
                  <TouchableOpacity
                    style={styles.headerButton}
                    onPress={handleStartHelp}
                  >
                    <HelpCircle size={20} color={colors.white} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => setShowNewConversation(true)}
                  >
                    <Plus size={20} color={colors.white} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Filter Tabs */}
              <View style={styles.filterContainer}>
                {[
                  { key: 'all' as FilterType, label: 'All', icon: MessageCircle },
                  { key: 'community' as FilterType, label: 'Communities', icon: Users },
                  { key: 'help' as FilterType, label: 'Support', icon: HelpCircle },
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
                      color={activeFilter === key ? colors.white : 'rgba(255, 255, 255, 0.7)'} 
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
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );

  // Render conversation item
  const renderConversation = ({ item }: { item: DMConversation }) => (
    <ConversationItem
      conversation={item}
      currentUserId={user?._id || ''}
      onPress={() => handleConversationPress(item)}
    />
  );

  // Render loading footer
  const renderLoadingFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.loadingFooterText}>Loading more conversations...</Text>
      </View>
    );
  };

  // Auth loading state
  if (authLoading) {
    return (
      <ThemedView style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </ThemedView>
    );
  }

  // Not authenticated (auth loading is complete)
  if (!isAuthenticated) {
    return (
      <ThemedView style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <MessageCircle size={64} color={colors.gray400} />
          <Text style={styles.loadingText}>Please login to view messages</Text>
        </View>
      </ThemedView>
    );
  }

  // Loading conversations
  if (loading && conversations.length === 0) {
    return (
      <ThemedView style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading conversations...</Text>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyMessagesState 
            onStartHelp={handleStartHelp}
            onNewConversation={() => setShowNewConversation(true)}
            filter={activeFilter}
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

      {/* New Conversation Modal */}
      <NewConversationModal
        visible={showNewConversation}
        onClose={() => setShowNewConversation(false)}
        onConversationStarted={(conversation) => {
          setShowNewConversation(false);
          router.push(`/(messages)/${conversation._id}`);
        }}
      />

      {/* Global Bottom Navigation */}
      <GlobalBottomNavigation />
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
    height: 200,
  },
  headerOverlay: {
    flex: 1,
  },
  headerContent: {
    flex: 1,
  },
  headerBlur: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    justifyContent: 'flex-end' as const,
  },
  headerTop: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: spacing.lg,
  },
  titleContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  headerTitle: {
    marginLeft: spacing.md,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold as any,
    color: colors.white,
  },
  headerActions: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginLeft: spacing.sm,
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
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  activeFilterTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterTabText: {
    marginLeft: spacing.xs,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium as any,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  activeFilterTabText: {
    color: colors.white,
    fontWeight: fontWeight.semibold as any,
  },

  // List Styles
  listContainer: {
    paddingBottom: spacing.xl,
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
};
