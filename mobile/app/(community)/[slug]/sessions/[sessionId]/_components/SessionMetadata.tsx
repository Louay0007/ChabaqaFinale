import { ThemedText } from '@/_components/ThemedText';
import React from 'react';
import { View } from 'react-native';
import { styles } from '../../styles';

interface SessionMetadataProps {
  duration: number;
  price: number;
}

export const SessionMetadata: React.FC<SessionMetadataProps> = ({ duration, price }) => {
  return (
    <View style={styles.sessionMetadata}>
      <View style={styles.metadataItem}>
        <ThemedText style={styles.metadataLabel}>Duration</ThemedText>
        <ThemedText style={styles.metadataValue}>{duration} minutes</ThemedText>
      </View>
      <View style={styles.metadataItem}>
        <ThemedText style={styles.metadataLabel}>Price</ThemedText>
        <ThemedText style={styles.metadataValue}>${price}</ThemedText>
      </View>
    </View>
  );
};
