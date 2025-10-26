import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { 
  MessageSquare, 
  Calendar, 
  BookOpen, 
  Users, 
  Clock,
  ShoppingBag,
  AlertCircle,
  Award,
  Star,
  Settings,
  Shield
} from 'lucide-react-native';

import {
  Notification,
  NotificationPriority,
  formatNotificationTime,
  shouldShowNotificationBadge,
  getNotificationColor,
} from '../../../lib/notification-api';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../../lib/design-tokens';

interface NotificationItemProps {
  notification: Notification;
  onPress: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

export default function NotificationItem({ notification, onPress }: NotificationItemProps) {
  const timeAgo = formatNotificationTime(notification.createdAt);
  const showBadge = shouldShowNotificationBadge(notification);
  const priorityColor = getNotificationColor(notification.priority);

  const getNotificationIcon = () => {
    const iconProps = {
      size: 24,
      color: notification.isRead ? colors.gray500 : colors.primary,
    };

    switch (notification.type) {
      case 'new_message':
      case 'new_dm_message':
        return <MessageSquare {...iconProps} />;
      case 'course_update':
        return <BookOpen {...iconProps} />;
      case 'event_reminder':
        return <Calendar {...iconProps} />;
      case 'challenge_progress':
        return <Award {...iconProps} />;
      case 'session_reminder':
        return <Clock {...iconProps} />;
      case 'product_purchase':
        return <ShoppingBag {...iconProps} />;
      case 'community_invite':
        return <Users {...iconProps} />;
      case 'system_update':
        return <Settings {...iconProps} />;
      case 'security_alert':
        return <Shield {...iconProps} />;
      case 'achievement':
        return <Award {...iconProps} />;
      case 'feedback_request':
        return <Star {...iconProps} />;
      default:
        return <AlertCircle {...iconProps} />;
    }
  };

  const getPriorityIndicator = () => {
    if (notification.priority === NotificationPriority.LOW || notification.isRead) {
      return null;
    }

    return (
      <View style={[
        styles.priorityIndicator,
        { backgroundColor: priorityColor }
      ]} />
    );
  };

  const renderUnreadDot = () => {
    if (notification.isRead || !showBadge) return null;

    return (
      <LinearGradient
        colors={['#ff6b6b', '#ee5a24']}
        style={styles.unreadDot}
      />
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.container}
    >
      <BlurView intensity={notification.isRead ? 85 : 95} style={styles.card}>
        <LinearGradient
          colors={
            notification.isRead
              ? ['rgba(255, 255, 255, 0.02)', 'rgba(255, 255, 255, 0.01)', 'rgba(255, 255, 255, 0.02)']
              : ['rgba(142, 120, 251, 0.08)', 'rgba(156, 136, 255, 0.04)', 'rgba(142, 120, 251, 0.08)']
          }
          style={styles.gradientBorder}
        />
        
        <View style={styles.cardContent}>
          {/* Icon Section */}
          <View style={styles.iconSection}>
            <LinearGradient
              colors={
                notification.isRead
                  ? ['rgba(156, 163, 175, 0.2)', 'rgba(156, 163, 175, 0.1)']
                  : [colors.primaryLight, 'rgba(142, 120, 251, 0.1)']
              }
              style={styles.iconContainer}
            >
              {getNotificationIcon()}
              {renderUnreadDot()}
            </LinearGradient>
            
            {/* Priority Indicator */}
            {getPriorityIndicator()}
          </View>

          {/* Content Section */}
          <View style={styles.contentSection}>
            <View style={styles.headerRow}>
              <Text style={[
                styles.title,
                !notification.isRead && styles.unreadTitle
              ]} numberOfLines={2}>
                {notification.title}
              </Text>
              
              <Text style={styles.timeText}>{timeAgo}</Text>
            </View>

            <Text style={[
              styles.body,
              !notification.isRead && styles.unreadBody
            ]} numberOfLines={3}>
              {notification.body}
            </Text>

            {/* Action Tags */}
            {notification.data?.tags && (
              <View style={styles.tagsContainer}>
                {notification.data.tags.slice(0, 2).map((tag: string, index: number) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Interactive Overlay */}
        <View style={styles.interactiveOverlay} />
      </BlurView>
    </TouchableOpacity>
  );
}

const styles = {
  container: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs,
  },
  
  // Card Styles
  card: {
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden' as const,
  },
  gradientBorder: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardContent: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    padding: spacing.lg,
  },
  interactiveOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },

  // Icon Styles
  iconSection: {
    position: 'relative' as const,
    marginRight: spacing.md,
    alignItems: 'center' as const,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    position: 'relative' as const,
  },
  unreadDot: {
    position: 'absolute' as const,
    top: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.white,
  },
  priorityIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginTop: spacing.xs,
  },

  // Content Styles
  contentSection: {
    flex: 1,
    justifyContent: 'center' as const,
  },
  headerRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium as any,
    color: colors.gray700,
    flex: 1,
    marginRight: spacing.sm,
    lineHeight: 20,
  },
  unreadTitle: {
    fontWeight: fontWeight.semibold as any,
    color: colors.gray900,
  },
  timeText: {
    fontSize: fontSize.xs,
    color: colors.gray500,
    marginTop: 2,
  },
  body: {
    fontSize: fontSize.sm,
    color: colors.gray600,
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  unreadBody: {
    color: colors.gray700,
  },

  // Tags
  tagsContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    marginTop: spacing.xs,
  },
  tag: {
    backgroundColor: 'rgba(142, 120, 251, 0.1)',
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  tagText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium as any,
    color: colors.primary,
  },
};
