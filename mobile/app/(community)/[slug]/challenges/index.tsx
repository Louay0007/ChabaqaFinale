import { ThemedView } from '@/_components/ThemedView';
import {
    Challenge,
    getChallengesByCommunity,
    getMyChallengeParticipation,
    getChallengeStatus,
    isParticipatingInChallenge
} from '@/lib/challenge-api';
import { useAuth } from '@/hooks/use-auth';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect, useCallback } from 'react';
import { Text, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import BottomNavigation from '../../_components/BottomNavigation';
import ChallengesHeader from './_components/ChallengesHeader';
import ChallengesList from './_components/ChallengesList';
import SearchFilter from './_components/SearchFilter';
import TabsNavigation from './_components/TabsNavigation';
import { styles } from './styles';

export default function ChallengesScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('browse');
  const [allChallenges, setAllChallenges] = useState<Challenge[]>([]);
  const [participatingChallenges, setParticipatingChallenges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Load challenges
  const loadChallenges = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError('');

      console.log('🏆 [CHALLENGES] Loading challenges for community:', slug);

      // Fetch all challenges for this community
      const response = await getChallengesByCommunity(slug as string, {
        page: 1,
        limit: 50,
      });

      setAllChallenges(response.challenges);

      // Check participation for each challenge if authenticated
      if (isAuthenticated) {
        const participationChecks = await Promise.all(
          response.challenges.map(c => isParticipatingInChallenge(c._id))
        );
        const participating = response.challenges
          .filter((_, index) => participationChecks[index])
          .map(c => c._id);
        setParticipatingChallenges(participating);
        console.log('✅ [CHALLENGES] Participating in:', participating.length);
      }

      console.log('✅ [CHALLENGES] Challenges loaded successfully:', response.challenges.length);
    } catch (err: any) {
      console.error('💥 [CHALLENGES] Error loading challenges:', err);
      setError(err.message || 'Failed to load challenges');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [slug, isAuthenticated]);

  // Load on mount
  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  // Handle refresh
  const handleRefresh = () => {
    loadChallenges(true);
  };

  // Filter challenges
  const filteredChallenges = allChallenges.filter((challenge: Challenge) => {
    const matchesSearch =
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchQuery.toLowerCase());

    const status = getChallengeStatus(challenge);
    const isParticipating = participatingChallenges.includes(challenge._id);

    if (activeTab === 'active') {
      return matchesSearch && status === 'active';
    }
    if (activeTab === 'upcoming') {
      return matchesSearch && status === 'upcoming';
    }
    if (activeTab === 'completed') {
      return matchesSearch && status === 'completed';
    }
    if (activeTab === 'joined') {
      return matchesSearch && isParticipating;
    }
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleChallengePress = (challengeId: string) => {
    router.push(`/(community)/${slug}/challenges/${challengeId}`);
  };

  const handleFilterPress = () => {
    console.log('Filter pressed');
  };

  // Calculate statistics
  const activeCount = allChallenges.filter((c) => getChallengeStatus(c) === 'active').length;
  const upcomingCount = allChallenges.filter((c) => getChallengeStatus(c) === 'upcoming').length;
  const completedCount = allChallenges.filter((c) => getChallengeStatus(c) === 'completed').length;
  const joinedCount = participatingChallenges.length;
  const totalParticipants = allChallenges.reduce((total, challenge) => total + (challenge.participants_count || 0), 0);

  // Configuration des onglets
  const tabs = [
    { key: 'browse', label: 'Browse' },
    { key: 'active', label: 'Active', count: activeCount },
    { key: 'upcoming', label: 'Upcoming', count: upcomingCount },
    { key: 'completed', label: 'Completed', count: completedCount },
    { key: 'joined', label: 'Joined', count: joinedCount },
  ];

  // Loading state
  if (loading && !refreshing) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#ff9b28" />
        <Text style={{ marginTop: 16, color: '#666', fontSize: 16 }}>Loading challenges...</Text>
      </ThemedView>
    );
  }

  // Error state
  if (error && !refreshing) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>⚠️</Text>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 8 }}>Oops!</Text>
        <Text style={{ fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 }}>
          {error}
        </Text>
        <TouchableOpacity
          onPress={() => loadChallenges()}
          style={{
            backgroundColor: '#ff9b28',
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Try Again</Text>
        </TouchableOpacity>
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
        onJoinChallenge={handleChallengePress}
        formatDate={formatDate}
        getChallengeStatus={getChallengeStatus}
        getUserParticipation={(challengeId: string) => participatingChallenges.includes(challengeId)}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#ff9b28"
            colors={['#ff9b28']}
          />
        }
      />
      
      {/* Bottom Navigation */}
      <BottomNavigation slug={slug as string} currentTab="challenges" />
    </ThemedView>
  );
}


