import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ExploreData } from '@/lib/data-communities';
import { getCommunityBySlug, joinCommunity, getMyJoinedCommunities } from '@/lib/communities-api';
import { communityStyles } from '../_styles';

export default function CommunityDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [community, setCommunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCommunityDetails();
    checkIfJoined();
  }, [slug]);

  const fetchCommunityDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Fetching community details for slug:', slug);

      // Try to fetch from backend API
      const response = await getCommunityBySlug(slug as string);

      if (response.success && response.data) {
        console.log('✅ Community fetched from backend:', response.data.name);
        console.log('📦 Raw backend data:', response.data);

        // Map category images
        const getCategoryImage = (category: string) => {
          const categoryImages: { [key: string]: any } = {
            'Marketing': require('@/assets/images/email-marketing.png'),
            'Design': require('@/assets/images/branding-hero.png'),
            'Fitness': require('@/assets/images/Personal-coaching-fitness.png'),
            'Web Design': require('@/assets/images/website-vitrine.png'),
            'Development': require('@/assets/images/background.png'),
            'Technology': require('@/assets/images/background.png'),
          };
          return categoryImages[category] || require('@/assets/images/email-marketing.png');
        };

        // Extract creator info (backend returns populated createur object)
        const creatorData = response.data.createur;
        const creatorName = creatorData?.name || creatorData?.email?.split('@')[0] || 'Unknown Creator';
        const creatorAvatar = creatorData?.profile_picture || creatorData?.avatar || creatorData?.photo ||
          `https://placehold.co/64x64?text=${encodeURIComponent(creatorName.charAt(0).toUpperCase())}&style=identicon`;

        // Extract member count (could be array length or direct count)
        let memberCount = 0;
        if (typeof response.data.members === 'number') {
          memberCount = response.data.members;
        } else if (Array.isArray(response.data.members)) {
          memberCount = response.data.members.length;
        } else if (response.data.membersCount) {
          memberCount = response.data.membersCount;
        }

        // Extract rating
        const rating = response.data.rating || response.data.averageRating || 0;

        // Extract price info
        const price = response.data.price || response.data.fees_of_join || 0;
        const priceType = response.data.priceType || (price > 0 ? 'paid' : 'free');

        // Transform backend data to match frontend format
        const transformedCommunity = {
          id: response.data._id?.toString() || response.data.id,
          slug: response.data.slug,
          name: response.data.name,
          creator: creatorName,
          creatorAvatar: creatorAvatar,
          description: response.data.short_description || response.data.description || '',
          longDescription: response.data.longDescription || response.data.long_description || response.data.short_description || '',
          category: response.data.category || 'General',
          members: memberCount,
          rating: rating,
          price: price,
          priceType: priceType,
          currency: response.data.currency || 'TND',
          // Fix image handling - use real backend image with URL transformation
          image: (() => {
            // Helper to transform localhost URLs to mobile-accessible URLs
            const fixImageUrl = (url: string | null | undefined): string | null => {
              if (!url) return null;
              const apiBase = 'http://172.20.10.6:3000'; // Mobile API URL
              if (url.startsWith('http')) {
                return url.replace('http://localhost:3000', apiBase)
                  .replace('http://127.0.0.1:3000', apiBase);
              }
              return `${apiBase}${url.startsWith('/') ? '' : '/'}${url}`;
            };

            // Get raw image URL from backend
            const rawImageUrl = response.data.photo_de_couverture || response.data.image || response.data.logo;

            // Check if it's a placeholder URL
            const isPlaceholder = (url: string) => {
              return url?.includes('placeholder.com') || url?.includes('placehold.co') || url?.includes('via.placeholder');
            };

            // If we have a real image URL (not placeholder), use it
            if (rawImageUrl && !isPlaceholder(rawImageUrl)) {
              const fixedUrl = fixImageUrl(rawImageUrl);
              console.log('🖼️ Using backend image:', { raw: rawImageUrl, fixed: fixedUrl });
              return { uri: fixedUrl };
            }

            // Otherwise, fallback to category image
            console.log('🖼️ Using category fallback for:', response.data.category);
            return getCategoryImage(response.data.category || 'General');
          })(),
          imageUrl: response.data.image || response.data.photo_de_couverture || response.data.logo,
          tags: response.data.tags || [],
          featured: response.data.featured || false,
          verified: response.data.isVerified || false,
          type: response.data.type || 'community',
          benefits: response.data.settings?.benefits || response.data.settings?.features || [
            'Accès complet',
            'Support prioritaire',
            'Ressources exclusives'
          ],
          settings: response.data.settings,
          isPrivate: response.data.isPrivate || false,
        };

        setCommunity(transformedCommunity);
        console.log('📊 Transformed community:', transformedCommunity);
        console.log('👥 Creator info:', { name: creatorName, avatar: creatorAvatar });
        console.log('📏 Stats:', { members: memberCount, rating: rating, price: price });
      }
    } catch (err: any) {
      console.error('❌ Error fetching community:', err);
      setError(err.message || 'Failed to load community');

      // Fallback to mock data
      console.log('⚠️ Falling back to mock data');
      const foundCommunity = ExploreData.communities.find(c => c.slug === slug);
      if (foundCommunity) {
        setCommunity(foundCommunity);
      }
    } finally {
      setLoading(false);
    }
  };

  const checkIfJoined = async () => {
    try {
      const response = await getMyJoinedCommunities();
      if (response.success && response.data) {
        const joined = response.data.some((c: any) =>
          c.slug === slug ||
          c.id === community?.id ||
          c._id === community?.id
        );
        setIsJoined(joined);
        console.log('🔍 Already joined:', joined);
      }
    } catch (err) {
      console.log('⚠️ Could not check join status:', err);
      // Not critical, continue
    }
  };

  const handleJoinCommunity = async () => {
    if (!community || !community.id) {
      Alert.alert('Error', 'Community information not available');
      return;
    }

    if (community.price === 0) {
      // Free community - join immediately
      Alert.alert(
        'Join Community',
        `Join ${community.name} for free?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Join',
            onPress: async () => {
              try {
                setJoining(true);
                console.log('🤝 Joining community:', community.id);

                const response = await joinCommunity(community.id);

                if (response.success) {
                  setIsJoined(true);
                  Alert.alert(
                    'Success! 🎉',
                    `You've successfully joined ${community.name}!`,
                    [{ text: 'OK' }]
                  );
                  // Refresh community data to show updated member count
                  await fetchCommunityDetails();
                } else {
                  throw new Error(response.message || 'Failed to join community');
                }
              } catch (err: any) {
                console.error('❌ Error joining community:', err);
                Alert.alert(
                  'Error',
                  err.message || 'Failed to join community. Please try again.',
                  [{ text: 'OK' }]
                );
              } finally {
                setJoining(false);
              }
            },
          },
        ]
      );
    } else {
      // Paid community - show payment info
      const priceText = `${community.currency || '$'}${community.price}/${community.priceType}`;
      Alert.alert(
        'Join Community',
        `Join ${community.name} for ${priceText}?\n\nNote: Payment integration coming soon!`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Continue',
            onPress: async () => {
              try {
                setJoining(true);
                console.log('💳 Processing payment for community:', community.id);

                // TODO: Integrate with payment system
                // For now, just join the community
                const response = await joinCommunity(community.id);

                if (response.success) {
                  setIsJoined(true);
                  Alert.alert(
                    'Success! 🎉',
                    'Payment processed! Welcome to the community!',
                    [{ text: 'OK' }]
                  );
                  await fetchCommunityDetails();
                } else {
                  throw new Error(response.message || 'Failed to join community');
                }
              } catch (err: any) {
                console.error('❌ Error joining community:', err);
                Alert.alert(
                  'Error',
                  err.message || 'Failed to join community. Please try again.',
                  [{ text: 'OK' }]
                );
              } finally {
                setJoining(false);
              }
            },
          },
        ]
      );
    }
  };

  const formatPrice = () => {
    if (!community) return 'Loading...';
    if (community.price === 0) {
      return 'Free to Join';
    }
    const currency = community.currency || '$';
    const priceTypeMap: { [key: string]: string } = {
      'monthly': 'month',
      'yearly': 'year',
      'hourly': 'hour',
      'one-time': 'one-time',
      'paid': 'one-time',
    };
    const priceType = priceTypeMap[community.priceType] || community.priceType;
    return `${currency}${community.price}/${priceType}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <SafeAreaView style={communityStyles.detailContainer}>
        <View style={communityStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#8b5cf6" />
          <Text style={communityStyles.emptyStateText}>Loading community...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!community) {
    return (
      <SafeAreaView style={communityStyles.detailContainer}>
        <View style={communityStyles.emptyState}>
          <Ionicons name="alert-circle" size={64} color="#ef4444" />
          <Text style={communityStyles.emptyStateText}>
            Community not found
          </Text>
          <TouchableOpacity
            style={communityStyles.joinButton}
            onPress={() => router.replace('/(communities)')}
          >
            <Text style={communityStyles.joinButtonText}>Go to Communities</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={communityStyles.detailContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={{ position: 'relative' }}>
          <Image
            source={community.image}
            style={communityStyles.detailImage}
            onError={(error) => {
              console.log('Hero image loading error:', error.nativeEvent.error);
            }}
          />

          {/* Back Button */}
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderRadius: 20,
              padding: 8,
            }}
            onPress={() => router.replace('/(communities)')}
          >
            <Ionicons name="arrow-back" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View style={communityStyles.detailContent}>
          {/* Title and Creator */}
          <Text style={communityStyles.detailTitle}>{community.name}</Text>

          <View style={communityStyles.detailCreator}>
            <Image
              source={{ uri: community.creatorAvatar }}
              style={communityStyles.creatorAvatar}
            />
            <View style={communityStyles.creatorInfo}>
              <Text style={communityStyles.creatorName}>{community.creator}</Text>
              <Text style={communityStyles.creatorRole}>Community Creator</Text>
            </View>
            <View style={communityStyles.priceContainer}>
              {community.price === 0 ? (
                <Text style={communityStyles.freeLabel}>Free</Text>
              ) : (
                <>
                  <Text style={communityStyles.price}>${community.price}</Text>
                  <Text style={communityStyles.priceType}>
                    /{community.priceType}
                  </Text>
                </>
              )}
            </View>
          </View>

          {/* Description */}
          <Text style={communityStyles.detailDescription}>
            {community.longDescription || community.description}
          </Text>

          {/* Stats */}
          <View style={communityStyles.detailStats}>
            <View style={communityStyles.detailStatItem}>
              <Text style={communityStyles.detailStatValue}>
                {formatNumber(community.members)}
              </Text>
              <Text style={communityStyles.detailStatLabel}>Members</Text>
            </View>
            <View style={communityStyles.detailStatItem}>
              <Text style={communityStyles.detailStatValue}>
                {community.rating.toFixed(1)} ⭐
              </Text>
              <Text style={communityStyles.detailStatLabel}>Rating</Text>
            </View>
            <View style={communityStyles.detailStatItem}>
              <Text style={communityStyles.detailStatValue}>
                {community.category}
              </Text>
              <Text style={communityStyles.detailStatLabel}>Category</Text>
            </View>
          </View>

          {/* Tags */}
          <View style={communityStyles.tagsContainer}>
            {community.tags.map((tag: string, index: number) => (
              <View key={index} style={communityStyles.tag}>
                <Text style={communityStyles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* What You'll Get */}
          {community.benefits && community.benefits.length > 0 && (
            <View style={{ marginTop: 20 }}>
              <Text style={[communityStyles.detailTitle, { fontSize: 18, marginBottom: 12 }]}>
                What You'll Get
              </Text>
              {community.benefits.map((benefit: string, index: number) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  <Text style={[communityStyles.detailDescription, { marginLeft: 8, marginBottom: 0 }]}>
                    {benefit}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Join Button */}
          <TouchableOpacity
            style={[
              communityStyles.joinButton,
              isJoined && { backgroundColor: '#10b981' },
              joining && { opacity: 0.6 }
            ]}
            onPress={handleJoinCommunity}
            disabled={isJoined || joining}
          >
            {joining ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={communityStyles.joinButtonText}>
                {isJoined ? '✓ Joined' : `Join Community - ${formatPrice()}`}
              </Text>
            )}
          </TouchableOpacity>

          {/* Additional spacing for bottom */}
          <View style={{ height: 20 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
