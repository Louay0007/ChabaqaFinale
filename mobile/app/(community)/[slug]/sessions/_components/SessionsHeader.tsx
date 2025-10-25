import { Calendar } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../styles';

interface SessionsHeaderProps {
  totalBooked: number;
  totalAvailable: number;
  avgRating: number;
}

export const SessionsHeader: React.FC<SessionsHeaderProps> = ({
  totalBooked,
  totalAvailable,
  avgRating,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.backgroundCircle1} />
      <View style={styles.backgroundCircle2} />
      
      <View style={styles.headerContent}>
        <View style={styles.titleSection}>
          <View style={styles.titleContainer}>
            <Calendar size={20} color="#fff" />
            <Text style={styles.title} numberOfLines={1}>1-on-1 Sessions</Text>
          </View>
          <Text style={styles.subtitle}>
            Get personalized mentorship and guidance from expert developers
          </Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalBooked}</Text>
            <Text style={styles.statLabel}>Booked</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalAvailable}</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{avgRating.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
