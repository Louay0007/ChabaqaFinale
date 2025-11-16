import { ThemedView } from '@/_components/ThemedView';
import { getChallengesByCommunity as getMockChallenges } from '@/lib/challenge-utils';
import {
    Challenge as MockChallenge,
    getCommunityBySlug as getMockCommunity,
    getCurrentUser,
    getUserChallengeParticipation
} from '@/lib/mock-data';
import { getChallengesByCommunity, getUserParticipations, Challenge as ApiChallenge } from '@/lib/challenge-api';
import { getCommunityBySlug } from '@/lib/communities-api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import BottomNavigation from '../../_components/BottomNavigation';
import ChallengesHeader from './_components/ChallengesHeader';
import ChallengesList from './_components/ChallengesList';
import SearchFilter from './_components/SearchFilter';
import TabsNavigation from './_components/TabsNavigation';
import { styles } from './styles';

export default function ChallengesScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('browse');
  
  // Real data state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [community, setCommunity] = useState<any>(null);
  const [allChallenges, setAllChallenges] = useState<any[]>([]);
  const [userParticipations, setUserParticipations] = useState<any[]>([]);
  
  const currentUser = getCurrentUser();
  const currentUserId = currentUser?.id || '';
  
  // Fetch data on component mount
  useEffect(() => {
    fetchChallengesData();
  }, [slug]);
  
  const fetchChallengesData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🏆 Fetching challenges for community:', slug);

      // Fetch community data first
      const communityResponse = await getCommunityBySlug(slug || '');
      if (!communityResponse.success || !communityResponse.data) {
        throw new Error('Community not found');
      }
      
      const communityData = {
        id: communityResponse.data._id || communityResponse.data.id,
        name: communityResponse.data.name,
        slug: communityResponse.data.slug,
      };
      setCommunity(communityData);
      
      // Fetch challenges for this community
      const challengesResponse = await getChallengesByCommunity(slug as string, {
        page: 1,
        limit: 50,
        isActive: true
      });
      
      // Transform backend challenges to match frontend interface
      const transformedChallenges = challengesResponse.challenges.map((challenge: ApiChallenge) => ({
        id: challenge._id,
        title: challenge.title,
        description: challenge.description,
        shortDescription: challenge.short_description || challenge.description,
        thumbnail: challenge.thumbnail || challenge.cover_image || 'https://via.placeholder.com/400x300',
        communityId: communityData.id,
        creatorId: challenge.created_by._id,
        creator: challenge.created_by,
        startDate: new Date(challenge.start_date),
        endDate: new Date(challenge.end_date),
        isActive: challenge.is_active,
        difficulty: challenge.difficulty,
        category: challenge.category,
        participants: [], // Will be populated from backend data
        participantsCount: challenge.participants_count || 0,
        maxParticipants: challenge.max_participants,
        tasks: challenge.tasks || [],
        prize: challenge.prize,
        tags: challenge.tags || [],
        createdAt: new Date(challenge.created_at),
        updatedAt: new Date(challenge.updated_at),
      }));
      
      setAllChallenges(transformedChallenges);
      
      // Fetch user's challenge participations
      try {
        const participationsResponse = await getUserParticipations(slug as string, 'all');
        const transformedParticipations = participationsResponse.map((participation: any) => ({
          challengeId: participation.challengeId || participation.challenge?.id,
          userId: participation.userId,
          joinedAt: participation.joinedAt,
          progress: participation.progress || 0,
          completedTasks: participation.completedTasks || 0,
          totalTasks: participation.totalTasks || 0,
          isActive: participation.isActive,
          lastActivityAt: participation.lastActivityAt,
        }));
        setUserParticipations(transformedParticipations);
      } catch (participationError) {
        console.warn('⚠️ Could not fetch user participations:', participationError);
        setUserParticipations([]);
      }
      
      console.log('✅ Challenges loaded:', transformedChallenges.length);
    } catch (err: any) {
      console.error('❌ Error fetching challenges:', err);
      setError(err.message || 'Failed to load challenges');
      
      // Fallback to mock data
      console.log('⚠️ Falling back to mock data');
      const mockCommunity = getMockCommunity(slug as string);
      const mockChallenges = getMockChallenges(mockCommunity?.id || '');
      
      setCommunity(mockCommunity);
      setAllChallenges(mockChallenges);
      setUserParticipations([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les challenges
  const filteredChallenges = allChallenges.filter((challenge: any) => {
    const matchesSearch =
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchQuery.toLowerCase());

    const now = new Date();
    const isParticipating = userParticipations.some(p => p.challengeId === challenge.id);

    if (activeTab === 'active') {
      return matchesSearch && challenge.startDate <= now && challenge.endDate >= now;
    }
    if (activeTab === 'upcoming') {
      return matchesSearch && challenge.startDate > now;
    }
    if (activeTab === 'completed') {
      return matchesSearch && challenge.endDate < now;
    }
    if (activeTab === 'joined') {
      return matchesSearch && isParticipating;
    }
    return matchesSearch;
  });

  const getChallengeStatus = (challenge: any) => {
    const now = new Date();
    if (challenge.startDate > now) return 'upcoming';
    if (challenge.endDate < now) return 'completed';
    return 'active';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleJoinChallenge = (challengeId: string) => {
    router.push(`/(community)/${slug}/challenges/${challengeId}`);
  };

  const handleChallengePress = (challengeId: string) => {
    router.push(`/(community)/${slug}/challenges/${challengeId}`);
  };

  const handleFilterPress = () => {
    console.log('Filter pressed');
  };

  // Calculs des statistiques
  const activeCount = allChallenges.filter((c: any) => getChallengeStatus(c) === 'active').length;
  const upcomingCount = allChallenges.filter((c: any) => getChallengeStatus(c) === 'upcoming').length;
  const completedCount = allChallenges.filter((c: any) => getChallengeStatus(c) === 'completed').length;
  const joinedCount = userParticipations.length;
  const totalParticipants = allChallenges.reduce((total: number, challenge: any) => total + (challenge.participantsCount || 0), 0);

  // Configuration des onglets
  const tabs = [
    { key: 'browse', label: 'Browse' },
    { key: 'active', label: 'Active', count: activeCount },
    { key: 'upcoming', label: 'Upcoming', count: upcomingCount },
    { key: 'completed', label: 'Completed', count: completedCount },
    { key: 'joined', label: 'Joined', count: joinedCount },
  ];

  if (loading) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#8e78fb" />
        <Text style={{ marginTop: 16, opacity: 0.7 }}>Loading challenges...</Text>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <Text style={{ color: '#ef4444', textAlign: 'center', margin: 20 }}>
          {error}
        </Text>
        <Text style={{ textAlign: 'center', opacity: 0.7 }}>
          Community: {slug}
        </Text>
      </ThemedView>
    );
  }

  if (!community) {
    return (
      <ThemedView style={styles.container}>
        <Text>Community not found</Text>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ChallengesHeader
        allChallenges={allChallenges}
        activeCount={activeCount}
        totalParticipants={totalParticipants}
        joinedCount={joinedCount}
      />

      {/* Search and Filter */}
      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterPress={handleFilterPress}
      />

      {/* Tabs */}
      <TabsNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
      />

      {/* Challenge List */}
      <ChallengesList
        challenges={filteredChallenges}
        onChallengePress={handleChallengePress}
        onJoinChallenge={handleJoinChallenge}
        formatDate={formatDate}
        getChallengeStatus={getChallengeStatus}
        getUserParticipation={(challengeId: string) => userParticipations.some(p => p.challengeId === challengeId)}
      />
      
      {/* Bottom Navigation */}
      <BottomNavigation slug={slug as string} currentTab="challenges" />
    </ThemedView>
  );
}


