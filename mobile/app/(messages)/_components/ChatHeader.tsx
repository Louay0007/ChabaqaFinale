import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  MoreHorizontal, 
  Phone, 
  Video,
  Info,
  User,
  HelpCircle,
  Users
} from 'lucide-react-native';

import {
  DMConversation,
  getConversationDisplayName,
  getConversationAvatar,
} from '../../../lib/dm-api';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../../lib/design-tokens';

interface ChatHeaderProps {
  conversation: DMConversation | null;
  onBack: () => void;
  currentUserId: string;
}

export default function ChatHeader({ conversation, onBack, currentUserId }: ChatHeaderProps) {
  const displayName = conversation ? getConversationDisplayName(conversation, currentUserId) : 'Loading...';
  const avatarUrl = conversation ? getConversationAvatar(conversation, currentUserId) : undefined;

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
    const IconComponent = conversation?.type === 'HELP_DM'
      ? (conversation.participantB ? User : HelpCircle)  // Show user icon if admin assigned
      : conversation?.type === 'COMMUNITY_DM' ? Users : User;

    return (
      <View style={styles.avatarPlaceholder}>
        <IconComponent size={20} color={colors.white} />
      </View>
    );
  };

  const getStatusText = () => {
    if (!conversation) return 'Loading...';

    if (conversation.type === 'HELP_DM') {
      if (conversation.participantB) {
        // Show admin role if available
        const adminRole = conversation.participantB.poste || 'Support Agent';
        const department = conversation.participantB.departement;
        return department ? `${adminRole} • ${department}` : adminRole;
      }
      return 'Connecting to support...';
    }

    if (conversation.type === 'COMMUNITY_DM') {
      return conversation.communityId ? `${conversation.communityId.name} Creator` : 'Community Creator';
    }

    return 'Active now';
  };

  const handleMoreOptions = () => {
    // TODO: Implement more options (mute, block, report, etc.)
    console.log('More options pressed');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../assets/images/background.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(142, 120, 251, 0.95)', 'rgba(142, 120, 251, 0.85)']}
          style={styles.overlay}
        >
          <SafeAreaView style={styles.safeArea}>
            <BlurView intensity={20} style={styles.content}>
              {/* Main Header Content */}
              <View style={styles.headerRow}>
                {/* Back Button */}
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={onBack}
                  activeOpacity={0.7}
                >
                  <ArrowLeft size={24} color={colors.white} />
                </TouchableOpacity>

                {/* Conversation Info */}
                <TouchableOpacity 
                  style={styles.conversationInfo}
                  activeOpacity={0.8}
                >
                  {/* Avatar */}
                  <LinearGradient
                    colors={
                      conversation?.type === 'HELP_DM'
                        ? (conversation.participantB ? ['#4caf50', '#388e3c'] : ['#ffa726', '#ff9800'])
                        : ['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.2)']
                    }
                    style={styles.avatarContainer}
                  >
                    {renderAvatar()}
                  </LinearGradient>

                  {/* Text Info */}
                  <View style={styles.textInfo}>
                    <Text style={styles.displayName} numberOfLines={1}>
                      {displayName}
                    </Text>
                    <Text style={styles.statusText} numberOfLines={1}>
                      {getStatusText()}
                    </Text>
                    {conversation?.type === 'HELP_DM' && conversation.participantB && (
                      <View style={styles.onlineIndicator}>
                        <View style={styles.onlineDot} />
                        <Text style={styles.onlineText}>Online</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>

                {/* Action Buttons */}
                <View style={styles.actions}>
                  {/* Info Button */}
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {
                      // TODO: Navigate to conversation info
                      console.log('Info pressed');
                    }}
                    activeOpacity={0.7}
                  >
                    <Info size={20} color={colors.white} />
                  </TouchableOpacity>

                  {/* More Options */}
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleMoreOptions}
                    activeOpacity={0.7}
                  >
                    <MoreHorizontal size={20} color={colors.white} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Type Indicator */}
              {conversation && (
                <View style={styles.typeIndicatorContainer}>
                  <View style={styles.typeIndicator}>
                    {conversation.type === 'HELP_DM' ? (
                      conversation.participantB ? (
                        <User size={12} color="rgba(255, 255, 255, 0.8)" />
                      ) : (
                        <HelpCircle size={12} color="rgba(255, 255, 255, 0.8)" />
                      )
                    ) : (
                      <Users size={12} color="rgba(255, 255, 255, 0.8)" />
                    )}
                    <Text style={styles.typeText}>
                      {conversation.type === 'HELP_DM'
                        ? (conversation.participantB ? 'Support Agent' : 'Support Conversation')
                        : 'Community Chat'
                      }
                    </Text>
                  </View>
                </View>
              )}
            </BlurView>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = {
  container: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  background: {
    minHeight: 120,
  },
  overlay: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    justifyContent: 'flex-end' as const,
  },

  // Header Row
  headerRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    marginBottom: spacing.sm,
  },

  // Back Button
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },

  // Conversation Info
  conversationInfo: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginHorizontal: spacing.md,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    padding: 2,
    marginRight: spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  textInfo: {
    flex: 1,
  },
  displayName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
    color: colors.white,
    marginBottom: 2,
  },
  statusText: {
    fontSize: fontSize.xs,
    color: 'rgba(255, 255, 255, 0.8)',
  },

  // Actions
  actions: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginLeft: spacing.sm,
  },

  // Type Indicator
  typeIndicatorContainer: {
    alignItems: 'center' as const,
  },
  typeIndicator: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.lg,
  },
  typeText: {
    marginLeft: 4,
    fontSize: fontSize.xs,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: fontWeight.medium as any,
  },

  // Online Status
  onlineIndicator: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginTop: 2,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginRight: 4,
  },
  onlineText: {
    fontSize: fontSize.xs - 1,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: fontWeight.medium as any,
  },
};
