import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  X, 
  Search, 
  MessageCircle,
  Users,
  ChevronRight
} from 'lucide-react-native';

import { DMConversation, startCommunityConversation } from '../../../lib/dm-api';
import { getCommunities, Community, CommunitiesResponse } from '../../../lib/communities-api';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../../lib/design-tokens';

interface NewConversationModalProps {
  visible: boolean;
  onClose: () => void;
  onConversationStarted: (conversation: DMConversation) => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function NewConversationModal({ 
  visible, 
  onClose, 
  onConversationStarted 
}: NewConversationModalProps) {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [startingConversation, setStartingConversation] = useState<string | null>(null);

  // Load communities when modal opens
  useEffect(() => {
    if (visible) {
      loadCommunities();
    } else {
      // Reset state when modal closes
      setSearchQuery('');
      setCommunities([]);
      setFilteredCommunities([]);
    }
  }, [visible]);

  // Filter communities based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCommunities(communities);
    } else {
      const filtered = communities.filter(community =>
        community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCommunities(filtered);
    }
  }, [searchQuery, communities]);

  const loadCommunities = async () => {
    try {
      setLoading(true);
      console.log('🏘️ [NEW-CONVERSATION] Loading communities');

      const response = await getCommunities({
        page: 1,
        limit: 50,
      });

      setCommunities(response.data);
      console.log('✅ [NEW-CONVERSATION] Communities loaded:', response.data.length);
    } catch (error: any) {
      console.error('💥 [NEW-CONVERSATION] Error loading communities:', error);
      Alert.alert(
        'Error',
        'Failed to load communities. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStartConversation = async (community: Community) => {
    if (startingConversation === community.id) return;

    try {
      setStartingConversation(community.id);
      console.log('💬 [NEW-CONVERSATION] Starting conversation with community:', community.name);

      const conversation = await startCommunityConversation(community.id);
      
      console.log('✅ [NEW-CONVERSATION] Conversation started');
      onConversationStarted(conversation);
    } catch (error: any) {
      console.error('💥 [NEW-CONVERSATION] Error starting conversation:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to start conversation. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setStartingConversation(null);
    }
  };

  const renderCommunityItem = ({ item }: { item: Community }) => (
    <TouchableOpacity
      style={styles.communityItem}
      onPress={() => handleStartConversation(item)}
      activeOpacity={0.8}
      disabled={startingConversation === item._id}
    >
      <BlurView intensity={90} style={styles.communityCard}>
        <View style={styles.communityContent}>
          {/* Community Avatar */}
          <View style={styles.avatarSection}>
            <LinearGradient
              colors={[colors.primary, '#9c88ff']}
              style={styles.avatarGradient}
            >
              <View style={styles.avatarContainer}>
                {item.logo ? (
                  <Image
                    source={{ uri: item.logo }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Users size={24} color={colors.primary} />
                  </View>
                )}
              </View>
            </LinearGradient>
          </View>

          {/* Community Info */}
          <View style={styles.infoSection}>
            <Text style={styles.communityName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.communityDescription} numberOfLines={2}>
              {item.shortDescription || 'Connect with this community'}
            </Text>
            
            {/* Members Count */}
            <View style={styles.statsContainer}>
              <Users size={12} color={colors.gray500} />
              <Text style={styles.membersCount}>
                {item.membersCount || 0} members
              </Text>
            </View>
          </View>

          {/* Action */}
          <View style={styles.actionSection}>
            {startingConversation === item.id ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <TouchableOpacity style={styles.messageButton}>
                <LinearGradient
                  colors={[colors.primary, '#9c88ff']}
                  style={styles.messageButtonGradient}
                >
                  <MessageCircle size={16} color={colors.white} />
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </BlurView>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Users size={48} color={colors.gray400} />
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'No communities found' : 'No communities available'}
      </Text>
      <Text style={styles.emptyDescription}>
        {searchQuery 
          ? 'Try adjusting your search terms'
          : 'Communities will appear here when available'
        }
      </Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <LinearGradient
          colors={['rgba(142, 120, 251, 0.9)', 'rgba(142, 120, 251, 0.7)']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <X size={24} color={colors.white} />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>New Conversation</Text>
            
            <View style={styles.headerSpacer} />
          </View>
        </LinearGradient>

        {/* Search */}
        <View style={styles.searchSection}>
          <BlurView intensity={90} style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Search size={20} color={colors.gray500} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search communities..."
                placeholderTextColor={colors.gray500}
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
              />
            </View>
          </BlurView>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Loading communities...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredCommunities}
              renderItem={renderCommunityItem}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={renderEmptyState}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            Select a community to start a conversation with its creator
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },

  // Header
  header: {
    paddingVertical: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: spacing.lg,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold as any,
    color: colors.white,
  },
  headerSpacer: {
    width: 40,
  },

  // Search
  searchSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  searchContainer: {
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchInputContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: fontSize.base,
    color: colors.gray800,
  },

  // Content
  content: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },

  // Community Item
  communityItem: {
    marginBottom: spacing.md,
  },
  communityCard: {
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden' as const,
  },
  communityContent: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: spacing.lg,
  },

  // Avatar
  avatarSection: {
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

  // Info
  infoSection: {
    flex: 1,
    marginRight: spacing.sm,
  },
  communityName: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold as any,
    color: colors.gray800,
    marginBottom: 4,
  },
  communityDescription: {
    fontSize: fontSize.sm,
    color: colors.gray600,
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  membersCount: {
    marginLeft: 4,
    fontSize: fontSize.xs,
    color: colors.gray500,
  },

  // Action
  actionSection: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  messageButton: {
    borderRadius: 20,
  },
  messageButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingTop: spacing.xxxl,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSize.base,
    color: colors.gray600,
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingTop: spacing.xxxl,
  },
  emptyTitle: {
    marginTop: spacing.lg,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
    color: colors.gray700,
    textAlign: 'center' as const,
  },
  emptyDescription: {
    marginTop: spacing.sm,
    fontSize: fontSize.sm,
    color: colors.gray500,
    textAlign: 'center' as const,
    paddingHorizontal: spacing.xl,
  },

  // Instructions
  instructions: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  instructionText: {
    fontSize: fontSize.sm,
    color: colors.gray600,
    textAlign: 'center' as const,
  },
};
