import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { 
  Star, 
  MessageSquare, 
  User,
  ChevronRight,
  TrendingUp
} from 'lucide-react-native';

import {
  FeedbackModel,
  Feedback,
  FeedbackStats,
  getFeedbackForItem,
  getRatingColor,
  getStarRating,
  formatFeedbackTime,
  getFeedbackEmoji,
} from '../../lib/feedback-api';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../lib/design-tokens';

interface FeedbackDisplayProps {
  relatedModel: FeedbackModel;
  relatedTo: string;
  showAddButton?: boolean;
  onAddFeedback?: () => void;
  maxItems?: number;
  compact?: boolean;
}

interface FeedbackItemProps {
  feedback: Feedback;
  compact?: boolean;
}

const FeedbackItem: React.FC<FeedbackItemProps> = ({ feedback, compact = false }) => {
  const ratingColor = getRatingColor(feedback.rating);
  
  return (
    <BlurView intensity={90} style={[styles.feedbackItem, compact && styles.feedbackItemCompact]}>
      <View style={styles.feedbackHeader}>
        {/* User Avatar */}
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={[colors.primary, '#9c88ff']}
            style={styles.avatarGradient}
          >
            <View style={styles.avatar}>
              <User size={16} color={colors.white} />
            </View>
          </LinearGradient>
        </View>

        {/* User Info & Rating */}
        <View style={styles.feedbackInfo}>
          <View style={styles.feedbackTopRow}>
            <Text style={styles.userName}>Anonymous User</Text>
            <Text style={styles.feedbackTime}>{formatFeedbackTime(feedback.createdAt)}</Text>
          </View>
          
          {/* Star Rating */}
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={compact ? 12 : 14}
                color={star <= feedback.rating ? '#fbbf24' : colors.gray300}
                fill={star <= feedback.rating ? '#fbbf24' : 'transparent'}
              />
            ))}
            <Text style={[styles.ratingNumber, { color: ratingColor }]}>
              {feedback.rating}.0
            </Text>
          </View>
        </View>

        {/* Rating Emoji */}
        <Text style={styles.ratingEmoji}>
          {getFeedbackEmoji(feedback.rating)}
        </Text>
      </View>

      {/* Comment */}
      {feedback.comment && (
        <View style={styles.commentContainer}>
          <Text style={[styles.comment, compact && styles.commentCompact]} numberOfLines={compact ? 2 : undefined}>
            {feedback.comment}
          </Text>
        </View>
      )}
    </BlurView>
  );
};

export default function FeedbackDisplay({ 
  relatedModel, 
  relatedTo, 
  showAddButton = true,
  onAddFeedback,
  maxItems = 5,
  compact = false
}: FeedbackDisplayProps) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFeedback();
  }, [relatedModel, relatedTo]);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('📊 [FEEDBACK-DISPLAY] Loading feedback:', { relatedModel, relatedTo });
      
      const response = await getFeedbackForItem(relatedModel, relatedTo);
      setFeedbacks(response.feedbacks.slice(0, maxItems));
      setStats(response.stats);
      
      console.log('✅ [FEEDBACK-DISPLAY] Feedback loaded:', response.feedbacks.length);
    } catch (err: any) {
      console.error('💥 [FEEDBACK-DISPLAY] Error loading feedback:', err);
      setError(err.message || 'Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const renderStatsHeader = () => {
    if (!stats || stats.totalCount === 0) return null;

    const averageColor = getRatingColor(stats.averageRating);

    return (
      <BlurView intensity={95} style={styles.statsContainer}>
        <LinearGradient
          colors={['rgba(142, 120, 251, 0.05)', 'rgba(156, 136, 255, 0.02)']}
          style={styles.statsGradient}
        >
          <View style={styles.statsContent}>
            {/* Overall Rating */}
            <View style={styles.overallRating}>
              <Text style={[styles.averageRating, { color: averageColor }]}>
                {stats.averageRating.toFixed(1)}
              </Text>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    color={star <= Math.round(stats.averageRating) ? '#fbbf24' : colors.gray300}
                    fill={star <= Math.round(stats.averageRating) ? '#fbbf24' : 'transparent'}
                  />
                ))}
              </View>
              <Text style={styles.totalReviews}>
                {stats.totalCount} review{stats.totalCount !== 1 ? 's' : ''}
              </Text>
            </View>

            {/* Rating Distribution */}
            {!compact && (
              <View style={styles.distributionContainer}>
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution];
                  const percentage = stats.totalCount > 0 ? (count / stats.totalCount) * 100 : 0;
                  
                  return (
                    <View key={rating} style={styles.distributionRow}>
                      <Text style={styles.distributionRating}>{rating}</Text>
                      <Star size={12} color="#fbbf24" fill="#fbbf24" />
                      <View style={styles.distributionBar}>
                        <View 
                          style={[
                            styles.distributionFill, 
                            { width: `${percentage}%`, backgroundColor: getRatingColor(rating) }
                          ]} 
                        />
                      </View>
                      <Text style={styles.distributionCount}>{count}</Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </LinearGradient>
      </BlurView>
    );
  };

  const renderAddFeedbackButton = () => {
    if (!showAddButton || !onAddFeedback) return null;

    return (
      <TouchableOpacity
        style={styles.addFeedbackButton}
        onPress={onAddFeedback}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[colors.primary, '#9c88ff']}
          style={styles.addFeedbackGradient}
        >
          <Star size={20} color={colors.white} />
          <Text style={styles.addFeedbackText}>Rate & Review</Text>
          <ChevronRight size={16} color={colors.white} />
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderFeedbackList = () => {
    if (feedbacks.length === 0) {
      return (
        <View style={styles.emptyState}>
          <MessageSquare size={48} color={colors.gray400} />
          <Text style={styles.emptyStateText}>No reviews yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Be the first to share your experience!
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={feedbacks}
        renderItem={({ item }) => <FeedbackItem feedback={item} compact={compact} />}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!compact}
        style={styles.feedbackList}
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.loadingText}>Loading reviews...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load reviews</Text>
        <TouchableOpacity onPress={loadFeedback} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      {/* Stats Header */}
      {renderStatsHeader()}
      
      {/* Add Feedback Button */}
      {renderAddFeedbackButton()}
      
      {/* Reviews List */}
      <View style={styles.reviewsSection}>
        <View style={styles.reviewsHeader}>
          <MessageSquare size={20} color={colors.gray700} />
          <Text style={styles.reviewsTitle}>
            Reviews {stats && `(${stats.totalCount})`}
          </Text>
        </View>
        
        {renderFeedbackList()}
      </View>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
  },
  containerCompact: {
    flex: 0,
  },

  // Loading & Error
  loadingContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: spacing.xl,
  },
  loadingText: {
    marginLeft: spacing.sm,
    fontSize: fontSize.sm,
    color: colors.gray600,
  },
  errorContainer: {
    alignItems: 'center' as const,
    paddingVertical: spacing.xl,
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colors.gray600,
    marginBottom: spacing.sm,
  },
  retryButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.sm,
  },
  retryText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.medium as any,
  },

  // Stats
  statsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statsGradient: {
    borderRadius: borderRadius.lg,
  },
  statsContent: {
    padding: spacing.lg,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  },
  overallRating: {
    alignItems: 'center' as const,
  },
  averageRating: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold as any,
    marginBottom: spacing.xs,
  },
  starsContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: spacing.xs,
  },
  totalReviews: {
    fontSize: fontSize.sm,
    color: colors.gray600,
  },
  distributionContainer: {
    flex: 1,
    marginLeft: spacing.xl,
  },
  distributionRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: spacing.xs,
  },
  distributionRating: {
    fontSize: fontSize.sm,
    color: colors.gray700,
    width: 12,
  },
  distributionBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.gray200,
    borderRadius: 4,
    marginHorizontal: spacing.sm,
    overflow: 'hidden' as const,
  },
  distributionFill: {
    height: '100%' as const,
    borderRadius: 4,
  },
  distributionCount: {
    fontSize: fontSize.xs,
    color: colors.gray500,
    width: 20,
    textAlign: 'right' as const,
  },

  // Add Feedback Button
  addFeedbackButton: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  addFeedbackGradient: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  addFeedbackText: {
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold as any,
    color: colors.white,
  },

  // Reviews Section
  reviewsSection: {
    flex: 1,
  },
  reviewsHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: spacing.md,
  },
  reviewsTitle: {
    marginLeft: spacing.sm,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
    color: colors.gray800,
  },

  // Feedback List
  feedbackList: {
    flex: 1,
  },
  feedbackItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  feedbackItemCompact: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  feedbackHeader: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    marginBottom: spacing.sm,
  },
  avatarContainer: {
    marginRight: spacing.md,
  },
  avatarGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    padding: 2,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  feedbackInfo: {
    flex: 1,
  },
  feedbackTopRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: spacing.xs,
  },
  userName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium as any,
    color: colors.gray800,
  },
  feedbackTime: {
    fontSize: fontSize.xs,
    color: colors.gray500,
  },
  starsRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  ratingNumber: {
    marginLeft: spacing.xs,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold as any,
  },
  ratingEmoji: {
    fontSize: 24,
    marginLeft: spacing.sm,
  },
  commentContainer: {
    marginTop: spacing.sm,
  },
  comment: {
    fontSize: fontSize.sm,
    color: colors.gray700,
    lineHeight: 18,
  },
  commentCompact: {
    fontSize: fontSize.xs,
    lineHeight: 16,
  },

  // Empty State
  emptyState: {
    alignItems: 'center' as const,
    paddingVertical: spacing.xxl,
  },
  emptyStateText: {
    marginTop: spacing.lg,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
    color: colors.gray700,
  },
  emptyStateSubtext: {
    marginTop: spacing.xs,
    fontSize: fontSize.sm,
    color: colors.gray500,
    textAlign: 'center' as const,
  },
};
