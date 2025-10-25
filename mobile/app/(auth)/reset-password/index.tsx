import AdaptiveBackground from '@/_components/AdaptiveBackground';
import AdaptiveStatusBar from '@/_components/AdaptiveStatusBar';
import BackButton from '@/_components/BackButton';
import { resetPasswordAction } from '@/lib/forgot-password-api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View
} from 'react-native';
import styles from '../styles';
import Header from './_components/Header';
import ResetForm from './_components/ResetForm';
import SuccessView from './_components/SuccessView';

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams();
  const [email, setEmail] = useState('');
  
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Récupérer l'email depuis AsyncStorage ou params
    const getEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('reset_email');
        if (storedEmail) {
          setEmail(storedEmail);
        } else if (params.email) {
          setEmail(params.email as string);
        }
      } catch (error) {
        console.log('Erreur lors de la récupération de l\'email:', error);
      }
    };
    getEmail();
  }, [params]);

  const handleSubmit = async () => {
    setError('');

    // Validation
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (verificationCode.length !== 6) {
      setError('Le code de vérification doit contenir 6 chiffres');
      return;
    }

    setIsLoading(true);

    try {
      const result = await resetPasswordAction({
        email,
        verificationCode,
        newPassword,
      });

      if (result.success) {
        setIsSuccess(true);
      } else {
        setError(result.error || "Une erreur s'est produite");
      }
    } catch (error) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToSignIn = () => {
    router.push('/(auth)/signin');
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
            isSuccess={isSuccess}
            email={email}
            styles={styles}
          />

          <BlurView intensity={20} style={styles.card}>
            {!isSuccess ? (
              <ResetForm
                verificationCode={verificationCode}
                setVerificationCode={setVerificationCode}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                showConfirmPassword={showConfirmPassword}
                setShowConfirmPassword={setShowConfirmPassword}
                error={error}
                isLoading={isLoading}
                onSubmit={handleSubmit}
                styles={styles}
              />
            ) : (
              <SuccessView
                onGoToSignIn={handleGoToSignIn}
                styles={styles}
              />
            )}

            {!isSuccess && (
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
            )}
          </BlurView>

          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2024 Chabaqa. Build the future of communities.</Text>
          </View>
        </ScrollView>
      </AdaptiveBackground>
    </KeyboardAvoidingView>
  );
}
