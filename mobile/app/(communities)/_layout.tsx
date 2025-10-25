import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';

export default function CommunitiesLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
        },
        headerTintColor: Colors[colorScheme ?? 'light'].text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Communities",
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="[slug]/index" 
        options={{ 
          headerShown: false, // Supprime le header avec "Community Details"
        }} 
      />
    </Stack>
  );
}
