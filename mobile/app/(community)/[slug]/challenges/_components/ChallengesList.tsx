import { Challenge } from '@/lib/mock-data';
import { Zap } from 'lucide-react-native';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { styles } from '../styles';
import ChallengeCard from './ChallengeCard';

interface ChallengesListProps {
  challenges: Challenge[];
  onChallengePress: (challengeId: string) => void;
  onJoinChallenge: (challengeId: string) => void;
  formatDate: (date: Date) => string;
  getChallengeStatus: (challenge: Challenge) => string;
  getUserParticipation: (challengeId: string) => boolean;
}

function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <Zap size={64} color="#d1d5db" />
      <Text style={styles.emptyStateText}>No challenges found</Text>
    </View>
  );
}

export default function ChallengesList({
  challenges,
  onChallengePress,
  onJoinChallenge,
  formatDate,
  getChallengeStatus,
  getUserParticipation,
}: ChallengesListProps) {
  const renderChallengeCard = ({ item }: { item: Challenge }) => {
    const isParticipating = getUserParticipation(item.id);

    return (
      <ChallengeCard
        challenge={item}
        isParticipating={isParticipating}
        onPress={() => onChallengePress(item.id)}
        onJoinPress={() => onJoinChallenge(item.id)}
        formatDate={formatDate}
        getChallengeStatus={getChallengeStatus}
      />
    );
  };

  if (challenges.length === 0) {
    return <EmptyState />;
  }

  return (
    <FlatList
      data={challenges}
      renderItem={renderChallengeCard}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.challengesList}
      showsVerticalScrollIndicator={false}
    />
  );
}
