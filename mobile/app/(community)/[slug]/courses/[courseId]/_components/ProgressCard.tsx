import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../../styles';

interface ProgressCardProps {
  progress: number;
  enrollment: any;
  allChapters: any[];
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ 
  progress, 
  enrollment, 
  allChapters 
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Course Progress</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.progressCenter}>
          <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
          <Text style={styles.progressLabel}>Complete</Text>
        </View>
        <View style={styles.progressBarFull}>
          <View
            style={[
              styles.progressFillFull,
              { width: `${progress}%` },
            ]}
          />
        </View>
        <Text style={styles.progressStats}>
          {enrollment?.progress.filter((p: any) => p.isCompleted).length || 0} of{' '}
          {allChapters.length} chapters completed
        </Text>
      </View>
    </View>
  );
};
