import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, MessageSquare, Users } from 'lucide-react-native';

import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../../../../lib/design-tokens';

interface EmptyFeedStateProps {
  onCreatePost: () => void;
  isAuthenticated: boolean;
}

export default function EmptyFeedState({ onCreatePost, isAuthenticated }: EmptyFeedStateProps) {
  return (
    <View style={styles.container}>
      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <LinearGradient
          colors={[colors.primaryLight, 'rgba(142, 120, 251, 0.05)']}
          style={styles.illustrationBackground}
        >
          <MessageSquare size={64} color={colors.primary} />
        </LinearGradient>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>No Posts Yet</Text>
        <Text style={styles.description}>
          This community is just getting started! {isAuthenticated ? 'Be the first to share something amazing.' : 'Join the conversation by logging in.'}
        </Text>

        {/* Action Buttons */}
        <View style={styles.actions}>
          {isAuthenticated ? (
            <>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={onCreatePost}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[colors.primary, '#9c88ff']}
                  style={styles.buttonGradient}
                >
                  <Plus size={20} color={colors.white} />
                  <Text style={styles.primaryButtonText}>Create First Post</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.7}>
                <Users size={16} color={colors.primary} />
                <Text style={styles.secondaryButtonText}>Invite Friends</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.loginPrompt}>
              <Text style={styles.loginText}>Login to join the conversation</Text>
            </View>
          )}
        </View>
      </View>

      {/* Background Pattern */}
      <View style={styles.backgroundPattern}>
        {[...Array(6)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.patternDot,
              {
                opacity: 0.1 - (i * 0.015),
                transform: [
                  { translateX: (i % 3) * 80 - 80 },
                  { translateY: Math.floor(i / 3) * 80 - 40 },
                ],
              },
            ]}
          />
        ))}
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
    minHeight: 400,
  },

  // Illustration
  illustrationContainer: {
    marginBottom: spacing.xl,
  },
  illustrationBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },

  // Content
  content: {
    alignItems: 'center' as const,
    maxWidth: 300,
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
  },
  primaryButton: {
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
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
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: 'rgba(142, 120, 251, 0.2)',
  },
  secondaryButtonText: {
    marginLeft: spacing.xs,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium as any,
    color: colors.primary,
  },

  // Login Prompt
  loginPrompt: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  loginText: {
    fontSize: fontSize.base,
    color: colors.gray600,
    textAlign: 'center' as const,
  },

  // Background Pattern
  backgroundPattern: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  patternDot: {
    position: 'absolute' as const,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
};
