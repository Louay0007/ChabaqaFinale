import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, StatusBar as RNStatusBar } from 'react-native';

export default function AuthLayout() {
  // Force la StatusBar en mode sombre pour toute la section Auth
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
        <Stack.Screen name="signin/index" />
        <Stack.Screen name="signup/index" />
        <Stack.Screen name="forgot-password/index" />
        <Stack.Screen name="reset-password/index" />
      </Stack>
    </>
  );
}
