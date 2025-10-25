// Backup of original _layout.tsx
// If reanimated issues persist, we can temporarily remove reanimated imports
// and use this simpler version for testing auth functionality

import { Stack } from 'expo-router';
import { useAuth } from '@/hooks/use-auth';

export default function RootLayout() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a simple loading component
  }

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
