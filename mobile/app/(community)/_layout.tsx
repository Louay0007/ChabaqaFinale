import { useAuth } from '@/hooks/use-auth';
import { Stack } from 'expo-router';

export default function CommunityLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack screenOptions={{ 
      headerShown: false,
      contentStyle: { backgroundColor: '#f9fafb' } 
    }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[slug]" />
      {isAuthenticated && <Stack.Screen name="(loggedUser)" />}
    </Stack>
  );
}