import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

interface AdaptiveBackgroundProps {
  children: React.ReactNode;
  style?: any;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
}

export default function AdaptiveBackground({ 
  children, 
  style, 
  resizeMode = 'cover' 
}: AdaptiveBackgroundProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <ImageBackground
      source={require('@/assets/images/background.png')}
      style={[styles.background, style]}
      resizeMode={resizeMode}
    >
      {/* Overlay sombre en mode dark */}
      {isDark && <View style={styles.darkOverlay} />}
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Plus sombre pour plus de contraste
  },
});
