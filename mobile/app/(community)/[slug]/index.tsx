import { useAuth } from '@/hooks/use-auth';
import { getCommunityBySlug } from '@/lib/mock-data';
import { Link, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import JoinCommunityModal from '../_components/modals/JoinCommunityModal';
import { commonStyles, communityDetailStyles } from '../community-detail-styles';

export default function CommunityDetail() {
  const { slug } = useLocalSearchParams();
  const community = getCommunityBySlug(slug as string);
  const { isAuthenticated } = useAuth();
  const [joinModalVisible, setJoinModalVisible] = useState(false);

  if (!community) {
    return (
      <View style={communityDetailStyles.container}>
        <Text>Community not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={communityDetailStyles.container}>
      <Image
        source={{ uri: community.coverImage }}
        style={communityDetailStyles.coverImage}
      />
      
      <View style={communityDetailStyles.content}>
        <Image
          source={{ uri: community.image }}
          style={communityDetailStyles.communityLogo}
        />
        
        <Text style={communityDetailStyles.communityName}>{community.name}</Text>
        <Text style={communityDetailStyles.communityDescription}>{community.description}</Text>
        
        <View style={communityDetailStyles.statsContainer}>
          <View style={communityDetailStyles.stat}>
            <Text style={communityDetailStyles.statNumber}>{community.members.toLocaleString()}</Text>
            <Text style={communityDetailStyles.statLabel}>Members</Text>
          </View>
          <View style={communityDetailStyles.stat}>
            <Text style={communityDetailStyles.statNumber}>{community.rating}</Text>
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