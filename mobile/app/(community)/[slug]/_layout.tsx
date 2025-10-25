import { Stack } from 'expo-router';
import CommunityHeader from '../_components/Header';

export default function CommunitySlugLayout() {
  return (
    <Stack screenOptions={{ 
      header: () => <CommunityHeader showBack />,
      animation: 'slide_from_right'
    }}>
      <Stack.Screen name="index" options={{ title: "Détails de la communauté" }} />
      <Stack.Screen name="(loggedUser)" options={{ headerShown: false }} />
    </Stack>
  );
}