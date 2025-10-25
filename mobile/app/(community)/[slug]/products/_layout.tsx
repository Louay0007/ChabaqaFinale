import { Stack } from 'expo-router';
import React from 'react';

export default function ProductsLayout() {
  return (
    <Stack screenOptions={{ 
      headerShown: false,
      animation: 'slide_from_right'
    }}>
      <Stack.Screen name="index" options={{ title: "Products" }} />
      <Stack.Screen name="[productId]/index" options={{ title: "Product Details" }} />
    </Stack>
  );
}
