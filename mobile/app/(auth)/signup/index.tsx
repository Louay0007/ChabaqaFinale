import AdaptiveBackground from '@/_components/AdaptiveBackground';
import AdaptiveStatusBar from '@/_components/AdaptiveStatusBar';
import { signupAction } from '@/lib/auth-api';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { signupStyles as styles } from '../styles';
import FooterLinks from './_components/FooterLinks';
import Header from './_components/Header';
import SignupForm from './_components/SignupForm';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [numtel, setNumtel] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || birthDate;
    // Keep picker open on iOS, close on Android and web
    setShowDatePicker(Platform.OS === 'ios');
    setBirthDate(currentDate);
    
    // Formater la date en YYYY-MM-DD
    const formattedDate = currentDate.toISOString().split('T')[0];
    setDateNaissance(formattedDate);
  };

  const showDatepicker = () => {
    // On web, always show the date picker (HTML input type="date")
    // On native, toggle the native picker
    setShowDatePicker(true);
  };

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await signupAction({
        name,
        email,
        password,
        numtel,
        date_naissance: dateNaissance,
      });

      if (result.success) {
        setSuccessMessage('Compte créé avec succès !');
        setTimeout(() => {
          router.replace('/(auth)/signin');
        }, 2000);
      } else {
        setError(result.error || "Une erreur s'est produite");
      }
    } catch (error) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    Alert.alert('Google Signup', 'Fonctionnalité Google Signup à implémenter');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <AdaptiveStatusBar />
      <AdaptiveBackground style={styles.background} resizeMode="cover">
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Header styles={styles} />

          <BlurView intensity={20} style={styles.card}>
            <SignupForm
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              numtel={numtel}
              setNumtel={setNumtel}
              dateNaissance={dateNaissance}
              birthDate={birthDate}
              showDatePicker={showDatePicker}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              onDateChange={onDateChange}
              showDatepicker={showDatepicker}
              isLoading={isLoading}
              error={error}
              successMessage={successMessage}
              onSubmit={handleSubmit}
              styles={styles}
            />

            <FooterLinks styles={styles} />
          </BlurView>

          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2024 Chabaqa. Build the future of communities.</Text>
          </View>
        </ScrollView>
      </AdaptiveBackground>
    </KeyboardAvoidingView>
  );
}
