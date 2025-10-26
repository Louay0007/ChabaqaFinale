import { Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function NotificationsLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false,
          title: 'Notifications'
        }} 
      />
      <Stack.Screen 
        name="settings/index" 
        options={{ 
          headerShown: false,
          title: 'Notification Settings',
          presentation: 'card'
        }} 
      />
    </Stack>
  );
}
