import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, StatusBar as RNStatusBar } from 'react-native';

export default function BuildCommunityLayout() {
  // Force la StatusBar en mode sombre pour toute la section Build Community
  useEffect(() => {
    if (Platform.OS === 'android') {
      RNStatusBar.setBarStyle('dark-content', true);
      RNStatusBar.setBackgroundColor('transparent', true);
    }
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: 'Build Community' }} />
        <Stack.Screen name="success" options={{ title: 'Success' }} />
      </Stack>
    </>
  );
}