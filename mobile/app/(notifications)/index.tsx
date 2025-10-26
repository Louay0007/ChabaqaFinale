import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  SectionList,
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
  Bell, 
  Settings, 
  Check, 
  CheckCheck,
  Filter,
  BellOff
} from 'lucide-react-native';

import { ThemedView } from '../../_components/ThemedView';
import { useAuth } from '../../hooks/use-auth';
import GlobalBottomNavigation from '../_components/GlobalBottomNavigation';
import {
  Notification,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  groupNotificationsByDate,
  getUnreadCount,
} from '../../lib/notification-api';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../lib/design-tokens';
import NotificationItem from './_components/NotificationItem';
import EmptyNotificationsState from './_components/EmptyNotificationsState';
import NotificationFilters from './_components/NotificationFilters';

type FilterType = 'all' | 'unread' | 'read';

export default function NotificationsScreen() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();

  // State management
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [groupedNotifications, setGroupedNotifications] = useState<Array<{
    title: string;
    data: Notification[];
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [markingAllRead, setMarkingAllRead] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [page, setPage] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);

  // Check authentication - only redirect if auth loading is complete and not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      // Redirect silently instead of showing alert
      router.replace('/(auth)/signin');
      return;
    }
    
    // Load notifications when authenticated and not loading
    if (!authLoading && isAuthenticated) {
      loadNotifications();
    }
  }, [isAuthenticated, authLoading]);

  // Load notifications from API
  const loadNotifications = useCallback(async (isRefresh = false, filter: FilterType = 'all') => {
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

      console.log('🔔 [NOTIFICATIONS] Loading notifications:', { filter, page: isRefresh ? 1 : page });

      const unreadOnly = filter === 'unread';
      const response = await getNotifications(isRefresh ? 1 : page, 20, unreadOnly);

      let filteredNotifications = response.notifications;
      
      // Apply client-side filtering for 'read' filter
      if (filter === 'read') {
        filteredNotifications = response.notifications.filter(n => n.isRead);
      }

      if (isRefresh) {
        setNotifications(filteredNotifications);
        setPage(2);
      } else {
        setNotifications(prev => page === 1 ? filteredNotifications : [...prev, ...filteredNotifications]);
        setPage(prev => prev + 1);
      }

      setHasMore(response.hasMore);
      setUnreadCount(getUnreadCount(filteredNotifications));
      
      // Group notifications by date
      const grouped = groupNotificationsByDate(filteredNotifications);
      setGroupedNotifications(grouped);

      console.log('✅ [NOTIFICATIONS] Notifications loaded:', filteredNotifications.length);
    } catch (err: any) {
      console.error('💥 [NOTIFICATIONS] Error loading notifications:', err);
      setError(err.message || 'Failed to load notifications');
      
      if (page === 1) {
        Alert.alert(
          'Error Loading Notifications',
          err.message || 'Failed to load notifications. Please try again.',
          [{ text: 'Retry', onPress: () => loadNotifications(true, filter) }, { text: 'Cancel' }]
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
      loadNotifications();
    }
  }, [isAuthenticated]);

  // Handle refresh
  const handleRefresh = () => {
    loadNotifications(true, activeFilter);
  };

  // Handle load more
  const handleLoadMore = () => {
    if (!loadingMore && hasMore && !loading) {
      loadNotifications(false, activeFilter);
    }
  };

  // Handle filter change
  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    setPage(1);
    loadNotifications(true, filter);
  };

  // Handle notification press
  const handleNotificationPress = async (notification: Notification) => {
    try {
      // Mark as read if unread
      if (!notification.isRead) {
        await markNotificationAsRead(notification._id);
        
        // Update local state
        setNotifications(prev => prev.map(n => 
          n._id === notification._id 
            ? { ...n, isRead: true, readAt: new Date().toISOString() }
            : n
        ));
        
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      // Handle navigation based on notification data
      if (notification.data?.url) {
        // Navigate to specific URL
        router.push(notification.data.url);
      } else if (notification.data?.screen) {
        // Navigate to specific screen
        router.push(notification.data.screen);
      } else {
        // Default action based on type
        handleNotificationTypeAction(notification);
      }
    } catch (error: any) {
      console.error('💥 [NOTIFICATIONS] Error handling notification press:', error);
    }
  };

  // Handle notification type-specific actions
  const handleNotificationTypeAction = (notification: Notification) => {
    switch (notification.type) {
      case 'new_dm_message':
        if (notification.data?.conversationId) {
          router.push(`/(messages)/${notification.data.conversationId}`);
        } else {
          router.push('/(messages)');
        }
        break;
      case 'course_update':
        if (notification.data?.courseId) {
          router.push(`/(community)/${notification.data.communitySlug}/courses/${notification.data.courseId}`);
        }
        break;
      case 'event_reminder':
        if (notification.data?.eventId) {
          router.push(`/(community)/${notification.data.communitySlug}/events/${notification.data.eventId}`);
        }
        break;
      case 'session_reminder':
        if (notification.data?.sessionId) {
          router.push(`/(community)/${notification.data.communitySlug}/sessions/${notification.data.sessionId}`);
        }
        break;
      default:
        // No specific action, just mark as read
        console.log('No specific action for notification type:', notification.type);
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;

    try {
      setMarkingAllRead(true);
      console.log('👁️ [NOTIFICATIONS] Marking all as read');

      const result = await markAllNotificationsAsRead();
      
      if (result.success) {
        // Update local state
        setNotifications(prev => prev.map(n => ({ 
          ...n, 
          isRead: true, 
          readAt: n.readAt || new Date().toISOString() 
        })));
        setUnreadCount(0);
        
        // Regroup notifications
        const grouped = groupNotificationsByDate(notifications.map(n => ({ 
          ...n, 
          isRead: true 
        })));
        setGroupedNotifications(grouped);
        
        console.log('✅ [NOTIFICATIONS] All notifications marked as read');
      }
    } catch (error: any) {
      console.error('💥 [NOTIFICATIONS] Error marking all as read:', error);
      Alert.alert('Error', 'Failed to mark all notifications as read');
    } finally {
      setMarkingAllRead(false);
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
                  <Bell size={28} color={colors.white} />
                  <Text style={styles.headerTitle}>Notifications</Text>
                  {unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadBadgeText}>
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.headerActions}>
                  {unreadCount > 0 && (
                    <TouchableOpacity
                      style={styles.headerButton}
                      onPress={handleMarkAllAsRead}
                      disabled={markingAllRead}
                    >
                      {markingAllRead ? (
                        <ActivityIndicator size="small" color={colors.white} />
                      ) : (
                        <CheckCheck size={20} color={colors.white} />
                      )}
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => router.push('/(notifications)/settings')}
                  >
                    <Settings size={20} color={colors.white} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Filter Tabs */}
              <NotificationFilters
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
                unreadCount={unreadCount}
              />
            </BlurView>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );

  // Render section header
  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{section.title}</Text>
    </View>
  );

  // Render notification item
  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <NotificationItem
      notification={item}
      onPress={() => handleNotificationPress(item)}
    />
  );

  // Render loading footer
  const renderLoadingFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.loadingFooterText}>Loading more notifications...</Text>
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
          <Bell size={64} color={colors.gray400} />
          <Text style={styles.loadingText}>Please login to view notifications</Text>
        </View>
      </ThemedView>
    );
  }

  // Loading notifications
  if (loading && notifications.length === 0) {
    return (
      <ThemedView style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SectionList
        sections={groupedNotifications}
        renderItem={renderNotificationItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyNotificationsState 
            filter={activeFilter}
            onChangeFilter={handleFilterChange}
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
  unreadBadge: {
    marginLeft: spacing.sm,
    backgroundColor: '#ff4757',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    paddingHorizontal: spacing.xs,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  unreadBadgeText: {
    fontSize: fontSize.xs,
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

  // Section Styles
  sectionHeader: {
    backgroundColor: colors.gray100,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  sectionHeaderText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold as any,
    color: colors.gray700,
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
