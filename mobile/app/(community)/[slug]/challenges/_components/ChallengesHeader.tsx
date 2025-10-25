import { Challenge } from '@/lib/mock-data';
import { Zap } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../styles';

interface ChallengesHeaderProps {
  allChallenges: Challenge[];
  activeCount: number;
  totalParticipants: number;
  joinedCount: number;
}

export default function ChallengesHeader({
  allChallenges,
  activeCount,
  totalParticipants,
  joinedCount,
}: ChallengesHeaderProps) {
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
          <Text style={styles.subtitle}>
            Join exciting challenges and compete with fellow members
          </Text>
        </View>
        
        {/* Right side - Stats horizontal */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{allChallenges.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{activeCount}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalParticipants}</Text>
            <Text style={styles.statLabel}>Participants</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{joinedCount}</Text>
            <Text style={styles.statLabel}>Joined</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
