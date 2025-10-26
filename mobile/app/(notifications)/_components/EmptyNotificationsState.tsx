import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Bell, 
  BellOff, 
  Check, 
  Settings,
  MessageSquare,
  Users
} from 'lucide-react-native';

import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../../lib/design-tokens';

type FilterType = 'all' | 'unread' | 'read';

interface EmptyNotificationsStateProps {
  filter: FilterType;
  onChangeFilter: (filter: FilterType) => void;
}

export default function EmptyNotificationsState({ 
  filter, 
  onChangeFilter 
}: EmptyNotificationsStateProps) {
  
  const getEmptyStateContent = () => {
    switch (filter) {
      case 'unread':
        return {
          icon: Check,
          title: 'All Caught Up!',
          description: 'You have no unread notifications. Great job staying on top of things!',
          suggestion: {
            label: 'View All Notifications',
            onPress: () => onChangeFilter('all'),
            icon: Bell,
            colors: [colors.primary, '#9c88ff'] as [string, string]
          }
        };
      
      case 'read':
        return {
          icon: BellOff,
          title: 'No Read Notifications',
          description: 'Your read notifications will appear here once you start interacting with notifications.',
          suggestion: {
            label: 'View All Notifications',
            onPress: () => onChangeFilter('all'),
            icon: Bell,
            colors: [colors.primary, '#9c88ff'] as [string, string]
          }
        };
      
      default:
        return {
          icon: Bell,
          title: 'No Notifications Yet',
          description: 'Stay tuned! You\'ll receive notifications about messages, course updates, events, and more.',
          suggestion: {
            label: 'Explore Communities',
            onPress: () => {
              // Navigate to communities - this would be handled by parent component
              console.log('Navigate to communities');
            },
            icon: Users,
            colors: [colors.primary, '#9c88ff'] as [string, string]
          },
          secondaryAction: {
            label: 'Start Messaging',
            onPress: () => {
              // Navigate to messages - this would be handled by parent component
              console.log('Navigate to messages');
            },
            icon: MessageSquare,
            colors: ['#10b981', '#059669'] as [string, string]
          }
        };
    }
  };

  const content = getEmptyStateContent();
  const IconComponent = content.icon;

  return (
    <View style={styles.container}>
      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <LinearGradient
          colors={['rgba(142, 120, 251, 0.1)', 'rgba(156, 136, 255, 0.05)']}
          style={styles.illustrationBackground}
        >
          <IconComponent size={80} color={colors.primary} />
        </LinearGradient>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{content.title}</Text>
        <Text style={styles.description}>{content.description}</Text>

        {/* Actions */}
        <View style={styles.actions}>
          {/* Primary Action */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={content.suggestion.onPress}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={content.suggestion.colors}
              style={styles.buttonGradient}
            >
              <content.suggestion.icon size={20} color={colors.white} />
              <Text style={styles.primaryButtonText}>{content.suggestion.label}</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Secondary Action (only for 'all' filter) */}
          {content.secondaryAction && (
            <TouchableOpacity 
              style={styles.secondaryButton} 
              onPress={content.secondaryAction.onPress}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['rgba(16, 185, 129, 0.1)', 'rgba(5, 150, 105, 0.05)']}
                style={styles.secondaryButtonGradient}
              >
                <content.secondaryAction.icon size={16} color="#10b981" />
                <Text style={styles.secondaryButtonText}>{content.secondaryAction.label}</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {/* Tips */}
        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>💡 Get Notified About:</Text>
          <View style={styles.tipsList}>
            <Text style={styles.tipItem}>• New messages and conversations</Text>
            <Text style={styles.tipItem}>• Course updates and new content</Text>
            <Text style={styles.tipItem}>• Event reminders and announcements</Text>
            <Text style={styles.tipItem}>• Session bookings and confirmations</Text>
            <Text style={styles.tipItem}>• Community activities and achievements</Text>
          </View>
        </View>
      </View>

      {/* Background Pattern */}
      <View style={styles.backgroundPattern}>
        {[...Array(8)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.patternDot,
              {
                opacity: 0.03 - (i * 0.003),
                transform: [
                  { translateX: (i % 4) * 80 - 120 },
                  { translateY: Math.floor(i / 4) * 100 - 50 },
                ],
              },
            ]}
          />
        ))}
      </View>

      {/* Decorative Elements */}
      <View style={styles.decorativeElements}>
        <Bell size={16} color="rgba(142, 120, 251, 0.1)" style={styles.deco1} />
        <MessageSquare size={20} color="rgba(142, 120, 251, 0.08)" style={styles.deco2} />
        <Users size={14} color="rgba(142, 120, 251, 0.06)" style={styles.deco3} />
      </View>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxl,
    minHeight: 500,
    position: 'relative' as const,
  },

  // Illustration
  illustrationContainer: {
    marginBottom: spacing.xl,
  },
  illustrationBackground: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },

  // Content
  content: {
    alignItems: 'center' as const,
    maxWidth: 320,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold as any,
    color: colors.gray800,
    textAlign: 'center' as const,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: fontSize.base,
    color: colors.gray600,
    textAlign: 'center' as const,
    lineHeight: 22,
    marginBottom: spacing.xl,
  },

  // Actions
  actions: {
    alignItems: 'center' as const,
    width: '100%' as const,
    marginBottom: spacing.xl,
  },
  primaryButton: {
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    width: '100%' as const,
  },
  buttonGradient: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  primaryButtonText: {
    marginLeft: spacing.sm,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold as any,
    color: colors.white,
  },

  secondaryButton: {
    borderRadius: borderRadius.lg,
    width: '100%' as const,
  },
  secondaryButtonGradient: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  secondaryButtonText: {
    marginLeft: spacing.xs,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium as any,
    color: '#10b981',
  },

  // Tips
  tips: {
    alignItems: 'flex-start' as const,
    width: '100%' as const,
  },
  tipsTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold as any,
    color: colors.gray700,
    marginBottom: spacing.sm,
  },
  tipsList: {
    alignItems: 'flex-start' as const,
  },
  tipItem: {
    fontSize: fontSize.sm,
    color: colors.gray600,
    lineHeight: 20,
    marginBottom: 4,
  },

  // Background Pattern
  backgroundPattern: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -2,
  },
  patternDot: {
    position: 'absolute' as const,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },

  // Decorative Elements
  decorativeElements: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  deco1: {
    position: 'absolute' as const,
    top: 120,
    right: 60,
  },
  deco2: {
    position: 'absolute' as const,
    top: 240,
    left: 40,
  },
  deco3: {
    position: 'absolute' as const,
    bottom: 180,
    right: 90,
  },
};
