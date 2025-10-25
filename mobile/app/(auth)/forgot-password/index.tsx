import AdaptiveBackground from '@/_components/AdaptiveBackground';
import AdaptiveStatusBar from '@/_components/AdaptiveStatusBar';
import BackButton from '@/_components/BackButton';
import { forgotPasswordAction } from '@/lib/forgot-password-api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import styles from '../styles';
import FormSection from './_components/FormSection';
import Header from './_components/Header';
import SuccessView from './_components/SuccessView';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email) {
      setError('Veuillez entrer votre adresse email');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await forgotPasswordAction({ email });

      if (result.success) {
        setIsSubmitted(true);
      } else {
        setError(result.error || "Une erreur s'est produite");
      }
    } catch (error) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryDifferentEmail = () => {
    setIsSubmitted(false);
    setEmail('');
    setError('');
  };

  const handleGoToReset = async () => {
    try {
      // Stocker l'email pour la page suivante
      await AsyncStorage.setItem('reset_email', email);
      // Navigation automatique vers reset-password
      router.push('/(auth)/reset-password');
    } catch (error) {
      console.error('Erreur lors de la navigation:', error);
      Alert.alert('Erreur', 'Impossible de naviguer vers la page de réinitialisation');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <AdaptiveStatusBar />
      <AdaptiveBackground style={styles.background} resizeMode="cover">
        <View style={{ position: 'absolute', top: 50, left: 20, zIndex: 10 }}>
          <BackButton 
            onPress={() => router.back()} 
            color="#1f2937" 
            size={28} 
          />
        </View>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Header 
            isSubmitted={isSubmitted}
            email={email}
            styles={styles}
          />

          <BlurView intensity={20} style={styles.card}>
            {!isSubmitted ? (
              <FormSection
                email={email}
                setEmail={setEmail}
                error={error}
                isLoading={isLoading}
                onSubmit={handleSubmit}
                styles={styles}
              />
            ) : (
              <SuccessView
                onGoToReset={handleGoToReset}
                onTryDifferentEmail={handleTryDifferentEmail}
                styles={styles}
              />
            )}

            <View style={styles.linksContainer}>
              <Text style={styles.signupText}>
                Remember your password?{' '}
                <Text 
                  style={styles.linkText}
                  onPress={() => router.push('/(auth)/signin')}
                >
                  Sign in
                </Text>
              </Text>
            </View>
          </BlurView>

          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2024 Chabaqa. Build the future of communities.</Text>
          </View>
        </ScrollView>
      </AdaptiveBackground>
    </KeyboardAvoidingView>
  );
}
