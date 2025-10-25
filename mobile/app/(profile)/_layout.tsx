import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{
          headerShown: false, // Hide the navigation header
        }} 
      />
      <Stack.Screen 
        name="edit" 
        options={{
          headerShown: false, // Hide the navigation header for edit page too
        }} 
      />
      <Stack.Screen 
        name="settings" 
        options={{
          headerShown: false, // Hide the navigation header for settings page too
        }} 
      />
    </Stack>
  );
}
