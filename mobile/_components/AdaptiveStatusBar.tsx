import { useColorScheme } from '@/hooks/useColorScheme';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

export default function AdaptiveStatusBar() {
  const colorScheme = useColorScheme();
  
  return (
    <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
  );
}
