import React from 'react';
import { Text, View } from 'react-native';
import { communityStyles } from '../_styles';

interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <View style={communityStyles.header}>
      <Text style={communityStyles.headerTitle}>{title}</Text>
      <Text style={communityStyles.headerSubtitle}>{subtitle}</Text>
    </View>
  );
}
