import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share, 
  MoreHorizontal,
  Calendar,
  User
} from 'lucide-react-native';

import { Post } from '../../../../../lib/post-api';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../../../../lib/design-tokens';
import { formatTimeAgo } from '../../../../../lib/post-api';
import PostActions from './PostActions';

interface PostCardProps {
  post: Post;
  onPress: () => void;
}

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = screenWidth - (spacing.lg * 2);

export default function PostCard({ post, onPress }: PostCardProps) {
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const renderAuthorHeader = () => (
    <View style={styles.authorContainer}>
      <View style={styles.authorInfo}>
        {/* Avatar with gradient border */}
        <LinearGradient
          colors={[colors.primary, '#9c88ff', colors.primary]}
          style={styles.avatarGradient}
        >
          <View style={styles.avatarContainer}>
            {post.author.profile_picture ? (
              <Image
                source={{ uri: post.author.profile_picture }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User size={20} color={colors.gray600} />
              </View>
            )}
          </View>
        </LinearGradient>

        <View style={styles.authorTextContainer}>
          <Text style={styles.authorName}>{post.author.name}</Text>
          <View style={styles.metaContainer}>
            <Calendar size={12} color={colors.gray500} />
            <Text style={styles.timestamp}>
              {formatTimeAgo(post.createdAt)}
            </Text>
            {post.isPublished && (
              <View style={styles.publishedBadge}>
                <Text style={styles.publishedText}>Published</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.moreButton}>
        <MoreHorizontal size={20} color={colors.gray500} />
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => (
    <Pressable onPress={onPress} style={styles.contentContainer}>
      {/* Title */}
      <Text style={styles.title} numberOfLines={2}>
        {post.title}
      </Text>

      {/* Excerpt or Content Preview */}
      {post.excerpt && (
        <Text style={styles.excerpt} numberOfLines={3}>
          {post.excerpt}
        </Text>
      )}

      {/* Thumbnail Image */}
      {post.thumbnail && (
        <View style={styles.imageContainer}>
          {imageLoading && (
            <View style={styles.imagePlaceholder}>
              <LinearGradient
                colors={['#f0f0f0', '#e0e0e0', '#f0f0f0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.imageShimmer}
              />
            </View>
          )}
          <Image
            source={{ uri: post.thumbnail }}
            style={[styles.thumbnail, imageLoading && { opacity: 0 }]}
            onLoad={handleImageLoad}
            resizeMode="cover"
          />
          
          {/* Gradient overlay for better text readability */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)']}
            style={styles.imageOverlay}
          />
        </View>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {post.tags.slice(0, 3).map((tag, index) => (
            <BlurView key={index} intensity={20} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </BlurView>
          ))}
          {post.tags.length > 3 && (
            <BlurView intensity={20} style={styles.tag}>
              <Text style={styles.tagText}>+{post.tags.length - 3}</Text>
            </BlurView>
          )}
        </View>
      )}
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <BlurView intensity={95} style={styles.card}>
        {/* Gradient border effect */}
        <LinearGradient
          colors={['rgba(142, 120, 251, 0.1)', 'rgba(156, 136, 255, 0.05)', 'rgba(142, 120, 251, 0.1)']}
          style={styles.gradientBorder}
        />
        
        <View style={styles.cardContent}>
          {renderAuthorHeader()}
          {renderContent()}
          
          {/* Post Actions */}
          <PostActions 
            post={post}
            style={styles.actionsContainer}
          />
        </View>
      </BlurView>
    </View>
  );
}

const styles = {
  container: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  
  // Card Styles
  card: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden' as const,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  },
  gradientBorder: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardContent: {
    padding: spacing.lg,
  },

  // Author Styles
  authorContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: spacing.md,
  },
  authorInfo: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flex: 1,
  },
  avatarGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    padding: 2,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden' as const,
    backgroundColor: colors.white,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.gray100,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  authorTextContainer: {
    marginLeft: spacing.md,
    flex: 1,
  },
  authorName: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold as any,
    color: colors.gray800,
    marginBottom: 2,
  },
  metaContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  timestamp: {
    fontSize: fontSize.xs,
    color: colors.gray500,
    marginLeft: spacing.xs,
  },
  publishedBadge: {
    backgroundColor: colors.successBackground,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.sm,
  },
  publishedText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium as any,
    color: colors.success,
  },
  moreButton: {
    padding: spacing.xs,
  },

  // Content Styles
  contentContainer: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold as any,
    color: colors.gray900,
    lineHeight: 24,
    marginBottom: spacing.sm,
  },
  excerpt: {
    fontSize: fontSize.base,
    color: colors.gray600,
    lineHeight: 22,
    marginBottom: spacing.md,
  },

  // Image Styles
  imageContainer: {
    position: 'relative' as const,
    borderRadius: borderRadius.md,
    overflow: 'hidden' as const,
    marginBottom: spacing.sm,
  },
  thumbnail: {
    width: '100%' as const,
    height: 200,
  },
  imagePlaceholder: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  imageShimmer: {
    width: '100%' as const,
    height: 200,
  },
  imageOverlay: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },

  // Tags Styles
  tagsContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    marginTop: spacing.sm,
  },
  tag: {
    backgroundColor: 'rgba(142, 120, 251, 0.1)',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginRight: spacing.sm,
    marginBottom: spacing.xs,
    overflow: 'hidden' as const,
  },
  tagText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium as any,
    color: colors.primary,
  },

  // Actions Styles
  actionsContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(142, 120, 251, 0.1)',
    paddingTop: spacing.md,
  },
};
