import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Share,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2,
  ThumbsUp
} from 'lucide-react-native';

import { Post, likePost, unlikePost, bookmarkPost, unbookmarkPost } from '../../../../../lib/post-api';
import { useAuth } from '../../../../../hooks/use-auth';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../../../../lib/design-tokens';

interface PostActionsProps {
  post: Post;
  style?: any;
}

export default function PostActions({ post, style }: PostActionsProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  
  // Local state for optimistic updates
  const [isLiked, setIsLiked] = useState(post.isLikedByUser);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isBookmarked, setIsBookmarked] = useState(false); // TODO: Get from API
  const [isProcessing, setIsProcessing] = useState(false);

  // Animation values
  const likeAnimation = new Animated.Value(1);
  const bookmarkAnimation = new Animated.Value(1);

  // Handle like with optimistic update
  const handleLike = async () => {
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

    if (isProcessing) return;
    setIsProcessing(true);

    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Animate like button
    Animated.sequence([
      Animated.timing(likeAnimation, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(likeAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    const newLikedState = !isLiked;
    const newCount = newLikedState ? likeCount + 1 : likeCount - 1;

    // Optimistic update
    setIsLiked(newLikedState);
    setLikeCount(newCount);

    try {
      if (newLikedState) {
        await likePost(post.id);
      } else {
        await unlikePost(post.id);
      }
      console.log('✅ [ACTIONS] Like updated successfully');
    } catch (error: any) {
      console.error('💥 [ACTIONS] Like error:', error);
      
      // Revert optimistic update
      setIsLiked(!newLikedState);
      setLikeCount(likeCount);
      
      Alert.alert(
        'Error',
        error.message || 'Failed to update like. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle bookmark with optimistic update
  const handleBookmark = async () => {
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

    if (isProcessing) return;
    setIsProcessing(true);

    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Animate bookmark button
    Animated.sequence([
      Animated.timing(bookmarkAnimation, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(bookmarkAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    const newBookmarkedState = !isBookmarked;

    // Optimistic update
    setIsBookmarked(newBookmarkedState);

    try {
      if (newBookmarkedState) {
        await bookmarkPost(post.id);
      } else {
        await unbookmarkPost(post.id);
      }
      console.log('✅ [ACTIONS] Bookmark updated successfully');
    } catch (error: any) {
      console.error('💥 [ACTIONS] Bookmark error:', error);
      
      // Revert optimistic update
      setIsBookmarked(!newBookmarkedState);
      
      Alert.alert(
        'Error',
        error.message || 'Failed to update bookmark. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle comment navigation
  const handleComment = () => {
    router.push(`/(community)/${post.communityId}/feed/${post.id}?scrollToComments=true`);
  };

  // Handle share
  const handleShare = async () => {
    try {
      // Haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      const shareUrl = `https://chabaqa.app/posts/${post.id}`;
      const message = `Check out this post: "${post.title}" by ${post.author.name}`;
      
      const result = await Share.share({
        message: `${message}\n\n${shareUrl}`,
        url: shareUrl,
        title: post.title,
      });

      if (result.action === Share.sharedAction) {
        console.log('✅ [ACTIONS] Post shared successfully');
      }
    } catch (error: any) {
      console.error('💥 [ACTIONS] Share error:', error);
      Alert.alert('Error', 'Failed to share post');
    }
  };

  // Get action button style based on state
  const getActionButtonStyle = (isActive: boolean, baseColor: string) => ({
    ...styles.actionButton,
    backgroundColor: isActive 
      ? `${baseColor}15` 
      : 'transparent',
  });

  return (
    <View style={[styles.container, style]}>
      {/* Like Button */}
      <TouchableOpacity
        style={getActionButtonStyle(isLiked, colors.error)}
        onPress={handleLike}
        activeOpacity={0.7}
        disabled={isProcessing}
      >
        <Animated.View style={{ transform: [{ scale: likeAnimation }] }}>
          <Heart
            size={20}
            color={isLiked ? '#ff3b5c' : colors.gray600}
            fill={isLiked ? '#ff3b5c' : 'transparent'}
          />
        </Animated.View>
        <Text style={[
          styles.actionText,
          isLiked && { color: '#ff3b5c' }
        ]}>
          {likeCount}
        </Text>
      </TouchableOpacity>

      {/* Comment Button */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={handleComment}
        activeOpacity={0.7}
      >
        <MessageCircle
          size={20}
          color={colors.gray600}
        />
        <Text style={styles.actionText}>
          {post.comments?.length || 0}
        </Text>
      </TouchableOpacity>

      {/* Share Button */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={handleShare}
        activeOpacity={0.7}
      >
        <Share2
          size={20}
          color={colors.gray600}
        />
        <Text style={styles.actionText}>Share</Text>
      </TouchableOpacity>

      {/* Spacer */}
      <View style={styles.spacer} />

      {/* Bookmark Button */}
      <TouchableOpacity
        style={getActionButtonStyle(isBookmarked, '#ffa726')}
        onPress={handleBookmark}
        activeOpacity={0.7}
        disabled={isProcessing}
      >
        <Animated.View style={{ transform: [{ scale: bookmarkAnimation }] }}>
          <Bookmark
            size={20}
            color={isBookmarked ? '#ffa726' : colors.gray600}
            fill={isBookmarked ? '#ffa726' : 'transparent'}
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  container: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: spacing.xs,
  },
  
  actionButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    marginRight: spacing.sm,
  },
  
  actionText: {
    marginLeft: spacing.xs,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium as any,
    color: colors.gray600,
  },
  
  spacer: {
    flex: 1,
  },
};
