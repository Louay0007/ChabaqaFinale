import React from 'react';
import { Text, View } from 'react-native';
import { profileStyles } from '../_styles';

interface StatsCardProps {
  value: number;
  label: string;
}

export default function StatsCard({ value, label }: StatsCardProps) {
  const formatValue = (val: number): string => {
    if (val >= 1000) {
      return `${(val / 1000).toFixed(1)}k`;
    }
    return val.toString();
  };

  return (
    <View style={profileStyles.statCard}>
      <Text style={profileStyles.statValue}>{formatValue(value)}</Text>
      <Text style={profileStyles.statLabel}>{label}</Text>
    </View>
  );
}
