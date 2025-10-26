import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { 
  MessageCircle, 
  HelpCircle, 
  Users, 
  User 
} from 'lucide-react-native';

import {
  DMConversation,
  getConversationDisplayName,
  getConversationAvatar,
  getUnreadCount,
  formatMessageTime,
  formatMessagePreview,
} from '../../../lib/dm-api';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../../lib/design-tokens';

interface ConversationItemProps {
  conversation: DMConversation;
  currentUserId: string;
  onPress: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

export default function ConversationItem({ conversation, currentUserId, onPress }: ConversationItemProps) {
  const displayName = getConversationDisplayName(conversation, currentUserId);
  const avatarUrl = getConversationAvatar(conversation, currentUserId);
  const unreadCount = getUnreadCount(conversation, currentUserId);
  const lastMessageTime = conversation.lastMessageAt ? formatMessageTime(conversation.lastMessageAt) : '';
  const messagePreview = formatMessagePreview(conversation.lastMessageText);

  const renderAvatar = () => {
    if (avatarUrl) {
      return (
        <Image
          source={{ uri: avatarUrl }}
          style={styles.avatar}
        />
      );
    }

    // Default icon based on conversation type
    const IconComponent = conversation.type === 'HELP_DM' ? HelpCircle : 
                         conversation.type === 'COMMUNITY_DM' ? Users : User;

    return (
      <View style={styles.avatarPlaceholder}>
        <IconComponent size={24} color={colors.primary} />
      </View>
    );
  };

  const renderUnreadBadge = () => {
    if (unreadCount === 0) return null;

    return (
      <LinearGradient
        colors={['#ff6b6b', '#ee5a24']}
        style={styles.unreadBadge}
      >
        <Text style={styles.unreadText}>
          {unreadCount > 99 ? '99+' : unreadCount.toString()}
        </Text>
      </LinearGradient>
    );
  };

  const renderConversationType = () => {
    if (conversation.type === 'HELP_DM') {
      return (
        <View style={styles.typeIndicator}>
          <HelpCircle size={12} color={colors.warning} />
          <Text style={styles.typeText}>Support</Text>
        </View>
      );
    }

    if (conversation.type === 'COMMUNITY_DM') {
      return (
        <View style={styles.typeIndicator}>
          <Users size={12} color={colors.primary} />
          <Text style={styles.typeText}>Community</Text>
        </View>
      );
    }

    return null;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.container}
    >
      <BlurView intensity={95} style={styles.card}>
        <LinearGradient
          colors={
            unreadCount > 0
              ? ['rgba(142, 120, 251, 0.1)', 'rgba(156, 136, 255, 0.05)', 'rgba(142, 120, 251, 0.1)']
              : ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)', 'rgba(255, 255, 255, 0.05)']
          }
          style={styles.gradientBorder}
        />
        
        <View style={styles.cardContent}>
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <LinearGradient
              colors={
                conversation.type === 'HELP_DM'
                  ? ['#ffa726', '#ff9800']
                  : ['#8e78fb', '#9c88ff']
              }
              style={styles.avatarGradient}
            >
              <View style={styles.avatarContainer}>
                {renderAvatar()}
              </View>
            </LinearGradient>
            
            {/* Online status indicator (placeholder for future implementation) */}
            <View style={styles.onlineIndicator} />
          </View>

          {/* Content Section */}
          <View style={styles.contentSection}>
            <View style={styles.headerRow}>
              <Text style={[
                styles.displayName,
                unreadCount > 0 && styles.unreadDisplayName
              ]}>
                {displayName}
              </Text>
              
              <View style={styles.metaContainer}>
                {renderConversationType()}
                <Text style={styles.timeText}>{lastMessageTime}</Text>
              </View>
            </View>

            <View style={styles.messageRow}>
              <Text style={[
                styles.messagePreview,
                unreadCount > 0 && styles.unreadMessagePreview
              ]} numberOfLines={2}>
                {messagePreview}
              </Text>
              
              {renderUnreadBadge()}
            </View>
          </View>
        </View>

        {/* Hover/Press effect overlay */}
        <View style={styles.pressOverlay} />
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
    borderRadius: borderRadius.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
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
    alignItems: 'center' as const,
    padding: spacing.lg,
  },
  pressOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },

  // Avatar Styles
  avatarSection: {
    position: 'relative' as const,
    marginRight: spacing.md,
  },
  avatarGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    padding: 2,
  },
  avatarContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden' as const,
    backgroundColor: colors.white,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  avatarPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.gray100,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  onlineIndicator: {
    position: 'absolute' as const,
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.white,
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
  displayName: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold as any,
    color: colors.gray800,
    flex: 1,
    marginRight: spacing.sm,
  },
  unreadDisplayName: {
    fontWeight: fontWeight.bold as any,
    color: colors.gray900,
  },
  metaContainer: {
    alignItems: 'flex-end' as const,
  },
  timeText: {
    fontSize: fontSize.xs,
    color: colors.gray500,
    marginTop: 2,
  },

  // Type Indicator
  typeIndicator: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: 'rgba(142, 120, 251, 0.1)',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  typeText: {
    marginLeft: 4,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium as any,
    color: colors.primary,
  },

  // Message Styles
  messageRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-end' as const,
  },
  messagePreview: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.gray600,
    lineHeight: 18,
    marginRight: spacing.sm,
  },
  unreadMessagePreview: {
    fontWeight: fontWeight.medium as any,
    color: colors.gray700,
  },

  // Unread Badge
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: spacing.xs,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  unreadText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold as any,
    color: colors.white,
    textAlign: 'center' as const,
  },
};
