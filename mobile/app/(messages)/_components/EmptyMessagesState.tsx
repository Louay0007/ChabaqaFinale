import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  MessageSquare, 
  Plus, 
  HelpCircle, 
  Users,
  Heart 
} from 'lucide-react-native';

import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../../lib/design-tokens';

interface EmptyMessagesStateProps {
  onStartHelp: () => void;
  onNewConversation: () => void;
  filter: 'all' | 'community' | 'help';
}

export default function EmptyMessagesState({ 
  onStartHelp, 
  onNewConversation, 
  filter 
}: EmptyMessagesStateProps) {
  
  const getEmptyStateContent = () => {
    switch (filter) {
      case 'help':
        return {
          icon: HelpCircle,
          title: 'No Support Messages',
          description: 'Need help? Start a conversation with our support team for assistance.',
          primaryAction: {
            label: 'Get Help',
            onPress: onStartHelp,
            icon: HelpCircle,
            colors: ['#ffa726', '#ff9800']
          }
        };
      
      case 'community':
        return {
          icon: Users,
          title: 'No Community Messages',
          description: 'Connect with community creators to ask questions and get involved.',
          primaryAction: {
            label: 'Browse Communities',
            onPress: onNewConversation,
            icon: Users,
            colors: [colors.primary, '#9c88ff']
          }
        };
      
      default:
        return {
          icon: MessageSquare,
          title: 'No Messages Yet',
          description: 'Start conversations with community creators or get help from our support team.',
          primaryAction: {
            label: 'Start Messaging',
            onPress: onNewConversation,
            icon: Plus,
            colors: [colors.primary, '#9c88ff']
          },
          secondaryAction: {
            label: 'Get Help',
            onPress: onStartHelp,
            icon: HelpCircle,
            colors: ['#ffa726', '#ff9800']
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
            onPress={content.primaryAction.onPress}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={content.primaryAction.colors as [string, string]}
              style={styles.buttonGradient}
            >
              <content.primaryAction.icon size={20} color={colors.white} />
              <Text style={styles.primaryButtonText}>{content.primaryAction.label}</Text>
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
                colors={['rgba(255, 167, 38, 0.1)', 'rgba(255, 152, 0, 0.05)']}
                style={styles.secondaryButtonGradient}
              >
                <content.secondaryAction.icon size={16} color="#ffa726" />
                <Text style={styles.secondaryButtonText}>{content.secondaryAction.label}</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {/* Tips */}
        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>💡 Quick Tips:</Text>
          {filter === 'all' && (
            <View style={styles.tipsList}>
              <Text style={styles.tipItem}>• Message community creators directly</Text>
              <Text style={styles.tipItem}>• Get instant support from our team</Text>
              <Text style={styles.tipItem}>• All conversations are secure and private</Text>
            </View>
          )}
          {filter === 'community' && (
            <View style={styles.tipsList}>
              <Text style={styles.tipItem}>• Visit communities to start conversations</Text>
              <Text style={styles.tipItem}>• Ask questions about courses and content</Text>
              <Text style={styles.tipItem}>• Connect with like-minded learners</Text>
            </View>
          )}
          {filter === 'help' && (
            <View style={styles.tipsList}>
              <Text style={styles.tipItem}>• Get help with technical issues</Text>
              <Text style={styles.tipItem}>• Ask about features and functionality</Text>
              <Text style={styles.tipItem}>• Report bugs or suggest improvements</Text>
            </View>
          )}
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
                opacity: 0.05 - (i * 0.006),
                transform: [
                  { translateX: (i % 4) * 80 - 120 },
                  { translateY: Math.floor(i / 4) * 100 - 50 },
                ],
              },
            ]}
          />
        ))}
      </View>

      {/* Decorative Hearts */}
      <View style={styles.decorativeElements}>
        <Heart size={16} color="rgba(142, 120, 251, 0.1)" style={styles.heart1} />
        <MessageSquare size={20} color="rgba(142, 120, 251, 0.08)" style={styles.heart2} />
        <Users size={14} color="rgba(142, 120, 251, 0.06)" style={styles.heart3} />
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
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
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
    shadowOpacity: 0.2,
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
    borderColor: 'rgba(255, 167, 38, 0.2)',
  },
  secondaryButtonText: {
    marginLeft: spacing.xs,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium as any,
    color: '#ffa726',
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
    width: 8,
    height: 8,
    borderRadius: 4,
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
  heart1: {
    position: 'absolute' as const,
    top: 100,
    right: 50,
  },
  heart2: {
    position: 'absolute' as const,
    top: 200,
    left: 30,
  },
  heart3: {
    position: 'absolute' as const,
    bottom: 150,
    right: 80,
  },
};
