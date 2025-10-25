import { ThemedText } from '@/_components/ThemedText';
import React from 'react';
import { View } from 'react-native';
import { styles } from '../../styles';

interface SessionDescriptionProps {
  description: string;
}

export const SessionDescription: React.FC<SessionDescriptionProps> = ({ description }) => {
  return (
    <View style={styles.sectionContainer}>
      <ThemedText style={styles.sectionTitle}>About this session</ThemedText>
      <ThemedText style={styles.description}>{description}</ThemedText>
    </View>
  );
};
