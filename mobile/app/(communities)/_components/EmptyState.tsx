import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { communityStyles } from '../_styles';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  iconColor?: string;
}

export default function EmptyState({ 
  icon, 
  title, 
  subtitle, 
  iconColor = '#cbd5e0' 
}: EmptyStateProps) {
  return (
    <View style={communityStyles.emptyState}>
      <Ionicons name={icon} size={64} color={iconColor} />
      <Text style={communityStyles.emptyStateText}>{title}</Text>
      {subtitle && (
        <Text style={[communityStyles.emptyStateText, { fontSize: 14, marginTop: 8 }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}
