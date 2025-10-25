import BackButton from '@/_components/BackButton';
import { ThemedText } from '@/_components/ThemedText';
import React from 'react';
import { View } from 'react-native';
import { styles } from '../../styles';

interface SessionHeaderProps {
  onBack: () => void;
  title: string;
}

export const SessionHeader: React.FC<SessionHeaderProps> = ({ onBack, title }) => {
  return (
    <View style={styles.header}>
      <BackButton onPress={onBack} />
      <ThemedText style={styles.sessionTitle}>{title}</ThemedText>
    </View>
  );
};
