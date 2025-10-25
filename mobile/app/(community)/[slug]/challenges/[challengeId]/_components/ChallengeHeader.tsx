import { Challenge } from '@/lib/mock-data';
import { Zap } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../../styles';

interface ChallengeHeaderProps {
  challenge: Challenge;
  completedTasks: number;
  totalTasks: number;
  totalPoints: number;
  formatDate: (date: Date) => string;
}

const getChallengeStatus = (challenge: Challenge) => {
  const now = new Date();
  if (challenge.startDate > now) return 'upcoming';
  if (challenge.endDate < now) return 'completed';
  return 'active';
};

export default function ChallengeHeader({
  challenge,
  completedTasks,
  totalTasks,
  totalPoints,
  formatDate,
}: ChallengeHeaderProps) {
  const remainingTasks = totalTasks - completedTasks;

  return (
    <View style={styles.header}>
      {/* Background circles */}
      <View style={styles.backgroundCircle1} />
      <View style={styles.backgroundCircle2} />
      
      <View style={styles.headerContent}>
        {/* Left side - Title and subtitle */}
        <View style={styles.titleSection}>
          <View style={styles.titleContainer}>
            <Zap size={20} color="#fff" />
            <Text style={styles.title} numberOfLines={1}>Challenge Hub</Text>
          </View>
          <Text style={styles.subtitle}>{challenge.description}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{getChallengeStatus(challenge)}</Text>
          </View>
        </View>
        
        {/* Right side - Stats horizontal */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{completedTasks}</Text>
            <Text style={styles.statLabel} numberOfLines={2}>Days Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{remainingTasks}</Text>
            <Text style={styles.statLabel} numberOfLines={2}>Days Remaining</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalPoints}</Text>
            <Text style={styles.statLabel} numberOfLines={2}>Points Earned</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>#47</Text>
            <Text style={styles.statLabel} numberOfLines={2}>Your Rank</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
