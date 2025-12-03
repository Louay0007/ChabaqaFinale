import { useAuth } from '@/hooks/use-auth';
import { getCommunityBySlug as getRealCommunity } from '@/lib/communities-api';
import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import JoinCommunityModal from '../_components/modals/JoinCommunityModal';
import { commonStyles, communityDetailStyles } from '../community-detail-styles';

export default function CommunityDetail() {
  const { slug } = useLocalSearchParams();
  const { isAuthenticated } = useAuth();
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [community, setCommunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCommunityData();
  }, [slug]);

  const fetchCommunityData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🏘️ [COMMUNITY-DETAIL] Fetching community:', slug);

      const response = await getRealCommunity(slug as string);

      if (!response.success || !response.data) {
        throw new Error('Community not found');
      }

      console.log('📦 [COMMUNITY-DETAIL] Raw response:', {
        id: response.data._id || response.data.id,
        name: response.data.name,
        slug: response.data.slug
      });

      // Transform backend data to match frontend expectations
      const transformedCommunity = {
        id: response.data._id || response.data.id,
        slug: response.data.slug,
        name: response.data.name,
        description: response.data.description || response.data.short_description || '',
        shortDescription: response.data.short_description || response.data.description || '',
        coverImage: response.data.photo_de_couverture || response.data.coverImage || response.data.settings?.heroBackground || '',
        image: response.data.logo || response.data.image || '',
        category: response.data.category || 'General',
        members: Array.isArray(response.data.members)
          ? response.data.members.length
          : (response.data.membersCount || response.data.members || 0),
        rating: response.data.averageRating || response.data.rating || 0,
        priceType: response.data.priceType || ((response.data.fees_of_join && response.data.fees_of_join > 0) ? 'paid' : 'free'),
        price: response.data.fees_of_join || response.data.price || 0,
        currency: response.data.currency || 'TND',
        creator: response.data.createur?.name || response.data.creator || 'Unknown',
        creatorAvatar: response.data.creatorAvatar || response.data.createur?.avatar || '',
        isVerified: response.data.verified || response.data.isVerified || false,
        tags: response.data.tags || [],
        socialLinks: response.data.socialLinks,
        createdAt: response.data.createdAt || response.data.createdDate,
      };

      console.log('✅ [COMMUNITY-DETAIL] Transformed community:', {
        name: transformedCommunity.name,
        members: transformedCommunity.members,
        rating: transformedCommunity.rating
      });

      setCommunity(transformedCommunity);
    } catch (err: any) {
      console.error('❌ [COMMUNITY-DETAIL] Error fetching community:', err);
      setError(err.message || 'Failed to load community');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[communityDetailStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#8e78fb" />
        <Text style={{ marginTop: 16, color: '#666' }}>Loading community...</Text>
      </View>
    );
  }

  if (error || !community) {
    return (
      <View style={[communityDetailStyles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Text style={{ color: '#ef4444', fontSize: 18, marginBottom: 10 }}>Community not found</Text>
        <Text style={{ color: '#666', textAlign: 'center' }}>{error || `Could not find community: ${slug}`}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={communityDetailStyles.container}>
      {community.coverImage ? (
        <Image
          source={{ uri: community.coverImage }}
          style={communityDetailStyles.coverImage}
        />
      ) : null}

      <View style={communityDetailStyles.content}>
        {community.image ? (
          <Image
            source={{ uri: community.image }}
            style={communityDetailStyles.communityLogo}
          />
        ) : null}

        <Text style={communityDetailStyles.communityName}>{community.name}</Text>
        <Text style={communityDetailStyles.communityDescription}>
          {community.shortDescription || community.description}
        </Text>

        <View style={communityDetailStyles.statsContainer}>
          <View style={communityDetailStyles.stat}>
            <Text style={communityDetailStyles.statNumber}>
              {typeof community.members === 'number' ? community.members.toLocaleString() : '0'}
            </Text>
            <Text style={communityDetailStyles.statLabel}>Members</Text>
          </View>
          <View style={communityDetailStyles.stat}>
            <Text style={communityDetailStyles.statNumber}>
              {typeof community.rating === 'number' ? community.rating.toFixed(1) : '0.0'}
            </Text>
            <Text style={communityDetailStyles.statLabel}>Rating</Text>
          </View>
          <View style={communityDetailStyles.stat}>
            <Text style={communityDetailStyles.statNumber}>{community.category}</Text>
            <Text style={communityDetailStyles.statLabel}>Category</Text>
          </View>
        </View>

        {isAuthenticated ? (
          <Link href={`/(community)/${slug}/(loggedUser)/home`} asChild>
            <TouchableOpacity style={commonStyles.primaryButton}>
              <Text style={commonStyles.primaryButtonText}>Enter Community</Text>
            </TouchableOpacity>
          </Link>
        ) : (
          <TouchableOpacity
            style={commonStyles.primaryButton}
            onPress={() => setJoinModalVisible(true)}
          >
            <Text style={commonStyles.primaryButtonText}>Join Community</Text>
          </TouchableOpacity>
        )}

        <JoinCommunityModal
          visible={joinModalVisible}
          onClose={() => setJoinModalVisible(false)}
          community={community}
        />
      </View>
    </ScrollView>
  );
}