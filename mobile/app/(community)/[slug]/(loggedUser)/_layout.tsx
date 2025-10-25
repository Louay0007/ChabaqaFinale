import { getCommunityBySlug } from '@/lib/mock-data';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Platform, StatusBar } from 'react-native';
import CommunityHeader from '../../_components/Header';

export default function LoggedUserLayout() {
  const { slug } = useLocalSearchParams();
  const community = getCommunityBySlug(slug as string);
  
  // Set status bar to light content for dark background
  React.useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }
    StatusBar.setBarStyle('dark-content');
  }, []);
  
  return (
    <Stack screenOptions={{ 
      header: () => <CommunityHeader showBack title={community?.name || 'Communauté'} />,
      animation: 'slide_from_right',
      contentStyle: { backgroundColor: '#f9fafb' },
      headerShown: true, // Show the header but we're using a custom component with custom styling
    }}>
      <Stack.Screen 
        name="home/index" 
        options={{ 
          title: "Accueil",
        }} 
      />
    </Stack>
  );
}