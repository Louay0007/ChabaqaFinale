import { getCommunityBySlug } from '@/lib/communities-api';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, StatusBar } from 'react-native';
import CommunityHeader from '../../_components/Header';

export default function LoggedUserLayout() {
  const { slug } = useLocalSearchParams();
  const [communityName, setCommunityName] = useState<string>('Community');
  
  // Fetch community name for header
  useEffect(() => {
    fetchCommunityName();
  }, [slug]);

  const fetchCommunityName = async () => {
    try {
      console.log('🏷️ Fetching community name for header:', slug);
      const response = await getCommunityBySlug(slug as string);
      
      if (response.success && response.data) {
        setCommunityName(response.data.name || 'Community');
        console.log('✅ Community name loaded for header:', response.data.name);
      }
    } catch (error) {
      console.error('❌ Error fetching community name:', error);
      // Keep default name on error
    }
  };
  
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
      header: () => <CommunityHeader showBack title={communityName} />,
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