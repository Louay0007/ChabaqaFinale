import { useAuth } from '@/hooks/use-auth';
import { landingData } from '@/lib/landing-data';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    ImageBackground,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './_styles';

// Import des composants
import Footer from './_components/Footer';
import Header from './_components/Header';
import Hero from './_components/Hero';
import HowItWorks from './_components/HowItWorks';
import Stats from './_components/Stats';

export default function Landing() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  
  // États pour la gestion des modals
  const [howItWorksVisible, setHowItWorksVisible] = useState(false);

  const handleStartBuilding = () => {
    console.log('🔍 État auth:', { user, isAuthenticated, isLoading });
    if (isAuthenticated) {
      console.log('✅ Utilisateur connecté, redirection vers build-community');
      router.push('/(build_community)');
    } else {
      console.log('❌ Utilisateur non connecté, redirection vers signin');
      // Rediriger vers la connexion avec un paramètre pour indiquer la destination
      router.push('/(auth)/signin?redirect=build-community');
    }
  };

  const handleStartBuildingFromModal = () => {
    setHowItWorksVisible(false);
    if (user) {
      router.push('/(build_community)');
    } else {
      // Rediriger vers la connexion avec un paramètre pour indiquer la destination
      router.push('/(auth)/signin?redirect=build-community');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground 
        source={require('@/assets/images/background.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <ScrollView style={styles.scrollContent}>
          <Header
            isAuthenticated={isAuthenticated}
            user={user}
            onHowItWorksPress={() => setHowItWorksVisible(true)}
            onLogout={logout}
          />

          <Hero
            isAuthenticated={isAuthenticated}
            onStartBuilding={handleStartBuilding}
          />

          <Stats stats={landingData.stats} />

          <Footer />
        </ScrollView>

        <HowItWorks
          visible={howItWorksVisible}
          onClose={() => setHowItWorksVisible(false)}
          steps={landingData.howItWorks}
          onStartBuilding={handleStartBuildingFromModal}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}
