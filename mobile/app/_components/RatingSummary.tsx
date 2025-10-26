import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Star, MessageSquare } from 'lucide-react-native';

import {
  FeedbackModel,
  FeedbackStats,
  getFeedbackForItem,
  getRatingColor,
  getRatingText,
} from '../../lib/feedback-api';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../lib/design-tokens';

interface RatingSummaryProps {
  relatedModel: FeedbackModel;
  relatedTo: string;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
  showReviewCount?: boolean;
  showRatingText?: boolean;
}

export default function RatingSummary({ 
  relatedModel, 
  relatedTo, 
  onPress,
  size = 'medium',
  showReviewCount = true,
  showRatingText = false
}: RatingSummaryProps) {
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [relatedModel, relatedTo]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await getFeedbackForItem(relatedModel, relatedTo);
      setStats(response.stats);
    } catch (error) {
      console.error('Error loading rating stats:', error);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: styles.containerSmall,
          rating: styles.ratingSmall,
          star: 12,
          text: styles.textSmall,
        };
      case 'large':
        return {
          container: styles.containerLarge,
          rating: styles.ratingLarge,
          star: 18,
          text: styles.textLarge,
        };
      default:
        return {
          container: styles.containerMedium,
          rating: styles.ratingMedium,
          star: 14,
          text: styles.textMedium,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  if (loading) {
    return (
      <View style={[styles.container, sizeStyles.container]}>
        <ActivityIndicator size="small" color={colors.gray400} />
      </View>
    );
  }

  if (!stats || stats.totalCount === 0) {
    return (
      <TouchableOpacity 
        style={[styles.container, sizeStyles.container, styles.noRating]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Star size={sizeStyles.star} color={colors.gray400} />
        <Text style={[styles.noRatingText, sizeStyles.text]}>No reviews</Text>
      </TouchableOpacity>
    );
  }

  const ratingColor = getRatingColor(stats.averageRating);
  const ratingText = getRatingText(stats.averageRating);

  const content = (
    <>
      {/* Rating Number */}
      <Text style={[sizeStyles.rating, { color: ratingColor }]}>
        {stats.averageRating.toFixed(1)}
      </Text>

      {/* Stars */}
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={sizeStyles.star}
            color={star <= Math.round(stats.averageRating) ? '#fbbf24' : colors.gray300}
            fill={star <= Math.round(stats.averageRating) ? '#fbbf24' : 'transparent'}
          />
        ))}
      </View>

      {/* Review Count */}
      {showReviewCount && (
        <View style={styles.countContainer}>
          <MessageSquare size={sizeStyles.star - 2} color={colors.gray500} />
          <Text style={[styles.countText, sizeStyles.text]}>
            {stats.totalCount}
          </Text>
        </View>
      )}

      {/* Rating Text */}
      {showRatingText && (
        <Text style={[styles.ratingTextLabel, sizeStyles.text, { color: ratingColor }]}>
          {ratingText}
        </Text>
      )}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity 
        style={[styles.container, sizeStyles.container]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, sizeStyles.container]}>
      {content}
    </View>
  );
}

const styles = {
  container: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  containerSmall: {
    paddingVertical: spacing.xs,
  },
  containerMedium: {
    paddingVertical: spacing.sm,
  },
  containerLarge: {
    paddingVertical: spacing.md,
  },

  // Ratings
  ratingSmall: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold as any,
    marginRight: spacing.xs,
  },
  ratingMedium: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold as any,
    marginRight: spacing.xs,
  },
  ratingLarge: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold as any,
    marginRight: spacing.sm,
  },

  // Stars
  starsContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginRight: spacing.sm,
  },

  // Count
  countContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginRight: spacing.sm,
  },
  countText: {
    marginLeft: 2,
    color: colors.gray600,
  },

  // Text sizes
  textSmall: {
    fontSize: fontSize.xs,
  },
  textMedium: {
    fontSize: fontSize.sm,
  },
  textLarge: {
    fontSize: fontSize.base,
  },

  // Rating text
  ratingTextLabel: {
    fontWeight: fontWeight.medium as any,
  },

  // No rating state
  noRating: {
    opacity: 0.6,
  },
  noRatingText: {
    marginLeft: spacing.xs,
    color: colors.gray500,
    fontStyle: 'italic' as const,
  },
};
