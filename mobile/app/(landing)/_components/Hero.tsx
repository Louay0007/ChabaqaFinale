import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from '../_styles';

interface HeroProps {
  isAuthenticated: boolean;
  onStartBuilding: () => void;
}

const Hero: React.FC<HeroProps> = ({ isAuthenticated, onStartBuilding }) => {
  const navigateToTestCommunity = () => {
    // This directly navigates to the Digital Marketing Mastery community home page
    router.push('/(community)/digital-marketing-mastery/(loggedUser)/home');
  };

  const navigateToCommunities = () => {
    // Navigate to the communities section
    router.push('/(communities)');
  };

  const navigateToCommunityHome = () => {
    // Navigate to the Digital Marketing Mastery community home page
    router.push('/(community)/digital-marketing-mastery/(loggedUser)/home');
  };

  return (
    <View style={styles.mainContent}>
      {/* Heading with simple text */}
      <Text style={styles.gradientHeading}>
        <Text style={styles.normalText}>Build Your </Text>
        <Text style={[styles.normalText, {color: '#8e78fb', fontWeight: 'bold'}]}>
          Dream Community
        </Text>
      </Text>

      <Text style={styles.subtitle}>
        Create, engage, and monetize your audience with the platform 
        designed for creators who want to build something amazing.
      </Text>

      <TouchableOpacity
        onPress={onStartBuilding}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#8e78fb', '#47c7ea']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.ctaButton}
        >
          <Text style={styles.ctaButtonText}>
            Start Building Free
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.replace('/(auth)/signin')}
        activeOpacity={0.8}
      >
        <Text style={styles.navButtonText}>Already have an account? Sign in</Text>
      </TouchableOpacity>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={navigateToCommunities}
          activeOpacity={0.8}
          style={styles.testButton}
        >
          <Text style={styles.testButtonText}>🌟 Browse Communities</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={navigateToCommunityHome}
          activeOpacity={0.8}
          style={[styles.testButton, { backgroundColor: '#3b82f6' }]}
        >
          <Text style={styles.testButtonText}>🏠 Community Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Hero;
