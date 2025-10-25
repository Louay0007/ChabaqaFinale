import { Challenge } from '@/lib/mock-data';
import { Calendar, Trophy, Users } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';

interface ChallengeCardProps {
  challenge: Challenge;
  isParticipating: boolean;
  onPress: () => void;
  onJoinPress: () => void;
  formatDate: (date: Date) => string;
  getChallengeStatus: (challenge: Challenge) => string;
}

export default function ChallengeCard({
  challenge,
  isParticipating,
  onPress,
  onJoinPress,
  formatDate,
  getChallengeStatus,
}: ChallengeCardProps) {
  const status = getChallengeStatus(challenge);

  return (
    <TouchableOpacity 
      style={styles.challengeCard}
      onPress={onPress}
    >
      {/* Header gradient */}
      <View style={styles.cardHeader}>
        <View style={styles.listStatusBadge}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
        <Text style={styles.cardTitle}>{challenge.title}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {challenge.description}
        </Text>
      </View>

      {/* Card content */}
      <View style={styles.cardContent}>
        <View style={styles.cardRow}>
          <View style={styles.cardInfo}>
            <Calendar size={16} color="#6b7280" />
            <Text style={styles.cardInfoText}>{formatDate(challenge.startDate)}</Text>
          </View>
          <View style={styles.cardInfo}>
            <Users size={16} color="#6b7280" />
            <Text style={styles.cardInfoText}>{challenge.participants.length} participants</Text>
          </View>
        </View>
        
        <View style={styles.cardFooter}>
          <View style={styles.difficultyBadge}>
            <Trophy size={16} color="#f59e0b" />
            <Text style={styles.pointsText}>{challenge.completionReward} points</Text>
          </View>
          
          {challenge.difficulty && (
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>{challenge.difficulty}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Action button */}
      <TouchableOpacity 
        style={[
          styles.actionButton,
          isParticipating ? styles.continueButton : styles.joinButton,
        ]}
        onPress={onJoinPress}
      >
        <Text style={styles.actionButtonText}>
          {isParticipating ? 'Continue' : 'Join Challenge'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
