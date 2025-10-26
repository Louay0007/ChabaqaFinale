import { colors } from '@/lib/design-tokens';
import {
  Bookmark,
  Heart,
  MessageSquare,
  MoreHorizontal,
  Share,
  Calendar,
  User
} from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';

// Import real API
import { 
  Post, 
  getPostsByCommunity, 
  likePost, 
  unlikePost, 
  bookmarkPost, 
  unbookmarkPost,
  convertPostForUI,
  formatTimeAgo 
} from '../../../lib/post-api';
import { useAuth } from '../../../hooks/use-auth';
import { communityStyles } from './community-styles';
import PostMenuOverlay from './modals/PostMenuOverlay';

interface PostsProps {
  communitySlug: string;
}

export default function Posts({ communitySlug }: PostsProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  
  // State
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [menuAnchorPostId, setMenuAnchorPostId] = useState<string | null>(null);
  
  const windowWidth = Dimensions.get('window').width;
  
  // Load posts from API
  const loadPosts = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError('');

      const response = await getPostsByCommunity(communitySlug, { page: 1, limit: 20 });
      const convertedPosts = response.posts.map(convertPostForUI);
      setPosts(convertedPosts);
      
      console.log('✅ [POSTS] Loaded posts:', convertedPosts.length);
    } catch (err: any) {
      console.error('💥 [POSTS] Error loading:', err);
      setError(err.message || 'Failed to load posts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Load on mount
  useEffect(() => {
    loadPosts();
  }, [communitySlug]);
  
  // Handle refresh
  const handleRefresh = () => {
    loadPosts(true);
  };
  
  // Handle like with optimistic update
  const handleLike = async (postId: string) => {
    if (!isAuthenticated) {
      Alert.alert(
        'Login Required',
        'Please login to like posts',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => router.push('/(auth)/signin') }
        ]
      );
      return;
    }

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const newLikedState = !post.isLikedByUser;
    const newCount = newLikedState ? post.likes + 1 : post.likes - 1;

    // Optimistic update
    setPosts(prev => prev.map(p => 
      p.id === postId 
        ? { ...p, isLikedByUser: newLikedState, likes: newCount }
        : p
    ));

    try {
      if (newLikedState) {
        await likePost(postId);
      } else {
        await unlikePost(postId);
      }
    } catch (error: any) {
      // Revert on error
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, isLikedByUser: !newLikedState, likes: post.likes }
          : p
      ));
      Alert.alert('Error', error.message || 'Failed to update like');
    }
  };
  
  // Handle bookmark with optimistic update
  const handleBookmark = async (postId: string) => {
    if (!isAuthenticated) {
      Alert.alert(
        'Login Required',
        'Please login to bookmark posts',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => router.push('/(auth)/signin') }
        ]
      );
      return;
    }

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    // For now, we'll use local state since API doesn't return bookmark status
    // TODO: Update when backend provides bookmark status in post response
    try {
      await bookmarkPost(postId);
      Alert.alert('Success', 'Post bookmarked successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to bookmark post');
    }
  };
  
  const handleOpenMenu = (postId: string) => {
    // Store the post ID and show the menu
    setMenuAnchorPostId(postId);
    setSelectedPostId(postId);
    setMenuVisible(true);
  };
  
  const handleCloseMenu = () => {
    setMenuVisible(false);
    setSelectedPostId(null);
    setMenuAnchorPostId(null);
  };
  
  const handleSavePost = () => {
    if (selectedPostId) {
      handleBookmark(selectedPostId);
    }
    handleCloseMenu();
  };
  
  const handleHidePost = () => {
    // TODO: Implement hide post functionality
    console.log('Hiding post:', selectedPostId);
    Alert.alert('Feature Coming Soon', 'Hide post functionality will be available soon.');
    handleCloseMenu();
  };
  
  const handleReportPost = () => {
    // TODO: Implement report post functionality
    console.log('Reporting post:', selectedPostId);
    Alert.alert('Feature Coming Soon', 'Report post functionality will be available soon.');
    handleCloseMenu();
  };

  const renderPostItem = ({ item }: { item: Post }) => (
    <TouchableOpacity 
      onPress={() => router.push(`/(community)/${communitySlug}/feed/${item.id}`)}
      activeOpacity={0.98}
    >
      <BlurView intensity={95} style={styles.postCard}>
        <LinearGradient
          colors={['rgba(142, 120, 251, 0.05)', 'rgba(156, 136, 255, 0.02)', 'rgba(142, 120, 251, 0.05)']} 
          style={styles.gradientBorder}
        />
        
        <View style={styles.cardContent}>
          {/* Author Header */}
          <View style={styles.postHeader}>
            <View style={styles.authorContainer}>
              <LinearGradient
                colors={[colors.primary, '#9c88ff']}
                style={styles.avatarGradient}
              >
                <View style={styles.avatarContainer}>
                  {item.author.profile_picture ? (
                    <Image
                      source={{ uri: item.author.profile_picture }}
                      style={styles.avatar}
                    />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <User size={16} color={colors.gray600} />
                    </View>
                  )}
                </View>
              </LinearGradient>
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>{item.author.name}</Text>
                <View style={styles.metaContainer}>
                  <Calendar size={10} color={colors.gray500} />
                  <Text style={styles.postMeta}>
                    {formatTimeAgo(item.createdAt)}
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity 
              onPress={() => handleOpenMenu(item.id)}
              style={styles.menuButton}
            >
              <MoreHorizontal size={18} color={colors.gray500} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.contentContainer}>
            <Text style={styles.postTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.postContent} numberOfLines={3}>{item.content}</Text>
          </View>

          {/* Thumbnail */}
          {item.thumbnail && (
            <View style={styles.thumbnailContainer}>
              <Image
                source={{ uri: item.thumbnail }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
            </View>
          )}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {item.tags.slice(0, 3).map((tag, index) => (
                <BlurView key={index} intensity={20} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </BlurView>
              ))}
              {item.tags.length > 3 && (
                <BlurView intensity={20} style={styles.tag}>
                  <Text style={styles.tagText}>+{item.tags.length - 3}</Text>
                </BlurView>
              )}
            </View>
          )}

          {/* Actions */}
          <View style={styles.postActions}>
            <View style={styles.leftActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleLike(item.id);
                }}
              >
                <Heart
                  size={16}
                  color={item.isLikedByUser ? '#ff3b5c' : colors.gray500}
                  fill={item.isLikedByUser ? '#ff3b5c' : "transparent"}
                />
                <Text style={[styles.actionText, item.isLikedByUser && { color: '#ff3b5c' }]}>
                  {item.likes}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={(e) => {
                  e.stopPropagation();
                  router.push(`/(community)/${communitySlug}/feed/${item.id}?scrollToComments=true`);
                }}
              >
                <MessageSquare size={16} color={colors.gray500} />
                <Text style={styles.actionText}>{item.comments?.length || 0}</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={styles.bookmarkButton}
              onPress={(e) => {
                e.stopPropagation();
                handleBookmark(item.id);
              }}
            >
              <Bookmark
                size={18}
                color={colors.gray500}
              />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Overlay menu for this specific post */}
        {menuVisible && menuAnchorPostId === item.id && (
          <PostMenuOverlay
            onSavePost={handleSavePost}
            onHidePost={handleHidePost}
            onReportPost={handleReportPost}
            onClose={handleCloseMenu}
          />
        )}
      </BlurView>
    </TouchableOpacity>
  );

  // Loading state
  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading posts...</Text>
      </View>
    );
  }

  // Error state
  if (error && !refreshing && posts.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => loadPosts()}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      renderItem={renderPostItem}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      contentContainerStyle={styles.postsList}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  // Post Card
  postCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  gradientBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardContent: {
    padding: 16,
  },
  
  // Author
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    padding: 1.5,
  },
  avatarContainer: {
    width: 33,
    height: 33,
    borderRadius: 16.5,
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  avatar: {
    width: 33,
    height: 33,
  },
  avatarPlaceholder: {
    width: 33,
    height: 33,
    backgroundColor: colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorInfo: {
    marginLeft: 10,
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray800,
    marginBottom: 2,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postMeta: {
    fontSize: 11,
    color: colors.gray500,
    marginLeft: 4,
  },
  menuButton: {
    padding: 8,
  },
  
  // Content
  contentContainer: {
    marginBottom: 12,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray900,
    lineHeight: 22,
    marginBottom: 6,
  },
  postContent: {
    fontSize: 14,
    color: colors.gray600,
    lineHeight: 20,
  },
  
  // Thumbnail
  thumbnailContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  thumbnail: {
    width: '100%',
    height: 160,
  },
  
  // Tags
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: 'rgba(142, 120, 251, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
    overflow: 'hidden',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.primary,
  },
  
  // Actions
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(142, 120, 251, 0.08)',
  },
  leftActions: {
    flexDirection: 'row',
    flex: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '500',
    color: colors.gray600,
  },
  bookmarkButton: {
    padding: 6,
  },
  
  // List
  postsList: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  
  // States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.gray600,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 14,
    color: colors.gray600,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});