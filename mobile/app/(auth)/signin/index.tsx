import AdaptiveBackground from '@/_components/AdaptiveBackground';
import AdaptiveStatusBar from '@/_components/AdaptiveStatusBar';
import { useAuth } from '@/hooks/use-auth';
import { useAdaptiveColors } from '@/hooks/useAdaptiveColors';
import { loginAction, verifyTwoFactorAction } from '@/lib/auth-api';
import { authenticateWithGoogle } from '@/lib/google-auth';
import { BlurView } from 'expo-blur';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import styles from '../styles';
import FooterLinks from './_components/FooterLinks';
import Header from './_components/Header';
import LoginForm from './_components/LoginForm';
import TwoFactorForm from './_components/TwoFactorForm';
// ===== MODE TEST STATIQUE =====
// Décommentez la ligne suivante pour afficher les comptes de test sur l'écran
// import TestCredentialsHelper from './_components/TestCredentialsHelper';
// ===== FIN MODE TEST STATIQUE =====

export default function SignInScreen() {
  const { login, refetch, isAuthenticated, isLoading } = useAuth();
  const colors = useAdaptiveColors();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [userId, setUserId] = useState(''); // Store userId for 2FA
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRequestingCode, setIsRequestingCode] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  // Récupérer le paramètre de redirection
  const params = useLocalSearchParams();
  const redirectTo = params.redirect as string;

  // Auth testing logs
  useEffect(() => {
    console.log('🔐 [SIGNIN] Page de connexion chargée');
  }, []);

  // Rediriger si l'utilisateur est déjà connecté
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log('✅ [SIGNIN] Utilisateur déjà connecté, redirection...');
      // Rediriger vers la destination appropriée
      if (redirectTo === 'build-community') {
        router.replace('/(build_community)');
      } else {
        router.replace('/(communities)');
      }
    } else if (!isLoading && !isAuthenticated) {
      console.log('🔐 [SIGNIN] Utilisateur non connecté');
    }
  }, [isAuthenticated, isLoading, redirectTo]);

  // Fonction pour gérer la redirection après connexion réussie
  const handleSuccessfulLogin = async () => {
    console.log('🎉 Connexion réussie! Refetch des données utilisateur...');

    // Forcer le refetch des données utilisateur
    await refetch();

    // Attendre un peu pour que les données soient mises à jour
    await new Promise(resolve => setTimeout(resolve, 300));

    if (redirectTo === 'build-community') {
      console.log('📍 Redirection vers build-community');
      router.replace('/(build_community)');
    } else {
      console.log('📍 Redirection vers communities');
      router.replace('/(communities)');
    }
  };

  const handleInitialSubmit = async () => {
    // Validation côté client
    if (!email || !email.trim()) {
      setError('Veuillez entrer votre email');
      return;
    }
    if (!password || password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setIsRequestingCode(true);
    setError('');
    setSuccessMessage('');

    try {
      console.log('🚀 [SIGNIN] Tentative de connexion...');
      const result = await loginAction({
        email: email.trim(),
        password,
        remember_me: true
      });

      if (result.success && result.requires2FA && result.userId) {
        console.log('📱 [SIGNIN] 2FA requis, userId:', result.userId);
        setUserId(result.userId); // Store userId for 2FA verification
        setShowTwoFactor(true);
        setSuccessMessage(result.message || '✉️ Code de vérification envoyé par email');
        setPassword(''); // Clear password for security
      } else if (result.success && !result.requires2FA) {
        console.log('✅ [SIGNIN] Connexion directe réussie (pas de 2FA)');
        setSuccessMessage('✅ Connexion réussie!');
        // Le login est géré automatiquement par le stockage des tokens
        await handleSuccessfulLogin();
      } else {
        console.log('❌ [SIGNIN] Erreur de connexion:', result.error);
        setError(result.error || "Identifiants incorrects");
      }
    } catch (error: any) {
      console.error('💥 [SIGNIN] Exception lors de la connexion:', error);
      setError('Erreur de connexion. Veuillez vérifier votre connexion internet.');
    } finally {
      setIsRequestingCode(false);
    }
  };

  const handleTwoFactorSubmit = async () => {
    // Validation du code 2FA
    if (!verificationCode || verificationCode.trim().length !== 6) {
      setError('Veuillez entrer le code à 6 chiffres');
      return;
    }

    if (!userId) {
      setError('Session expirée. Veuillez vous reconnecter.');
      handleBackToCredentials();
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      console.log('🔐 [SIGNIN] Vérification du code 2FA...');
      const result = await verifyTwoFactorAction({
        userId: userId,
        code: verificationCode.trim(),
        rememberMe: true
      });

      if (result.success) {
        console.log('✅ [SIGNIN] 2FA validé avec succès');
        setSuccessMessage('✅ Code vérifié! Connexion en cours...');

        // Les tokens sont automatiquement stockés par verifyTwoFactorAction
        if (result.user) {
          // Mettre à jour le contexte d'auth
          login(result.user);
        }

        // Refetch et redirection
        await refetch();

        // Petit délai pour que l'utilisateur voie le message de succès
        setTimeout(() => {
          handleSuccessfulLogin();
        }, 500);
      } else {
        console.log('❌ [SIGNIN] Erreur 2FA:', result.error);
        setError(result.error || 'Code de vérification invalide');
        setVerificationCode(''); // Clear invalid code
      }
    } catch (error: any) {
      console.error('💥 [SIGNIN] Exception lors de la vérification 2FA:', error);
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToCredentials = () => {
    console.log('⬅️ [SIGNIN] Retour à la saisie des identifiants');
    setShowTwoFactor(false);
    setVerificationCode('');
    setUserId(''); // Clear userId
    setError('');
    setSuccessMessage('');
    // Reset password for security
    setPassword('');
  };

  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      setError('');

      console.log('🔐 [SIGNIN] Starting Google Sign-In');

      const result = await authenticateWithGoogle();

      if (result.success && result.user) {
        console.log('✅ [SIGNIN] Google Sign-In successful');

        // Refetch user data to update auth state
        await refetch();

        // Navigate based on redirect parameter or default to communities
        if (redirectTo) {
          router.replace(redirectTo as any);
        } else {
          router.replace('/(communities)');
        }

      } else {
        console.log('❌ [SIGNIN] Google Sign-In failed:', result.error);
        setError(result.error || 'Google Sign-In failed');
      }

    } catch (error: any) {
      console.error('💥 [SIGNIN] Google Sign-In error:', error);
      setError('An error occurred during Google Sign-In');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===== MODE TEST STATIQUE =====
  // Fonction pour remplir automatiquement les identifiants (optionnel)
  const handleSelectTestCredentials = (testEmail: string, testPassword: string) => {
    setEmail(testEmail);
    setPassword(testPassword);
    setError('');
    setSuccessMessage('✅ Identifiants de test chargés - Cliquez sur Se connecter');
  };
  // ===== FIN MODE TEST STATIQUE =====


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
          <Header
            showTwoFactor={showTwoFactor}
            email={email}
            styles={styles}
          />

          <BlurView
            intensity={colors.isDark ? 40 : 20}
            style={[
              styles.card,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.cardBorder,
              }
            ]}
          >
            {/* ===== MODE TEST STATIQUE ===== */}
            {/* Décommentez les lignes suivantes pour afficher l'aide aux identifiants de test */}
            {/* {!showTwoFactor && (
              <TestCredentialsHelper onSelectCredentials={handleSelectTestCredentials} />
            )} */}
            {/* ===== FIN MODE TEST STATIQUE ===== */}


            {!showTwoFactor ? (
              <LoginForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                isRequestingCode={isRequestingCode}
                error={error}
                successMessage={successMessage}
                onSubmit={handleInitialSubmit}
                onGoogleLogin={handleGoogleLogin}
                styles={styles}
              />
            ) : (
              <TwoFactorForm
                verificationCode={verificationCode}
                setVerificationCode={setVerificationCode}
                isLoading={isSubmitting}
                error={error}
                successMessage={successMessage}
                onSubmit={handleTwoFactorSubmit}
                onBackToCredentials={handleBackToCredentials}
                styles={styles}
              />
            )}

            {!showTwoFactor && (
              <FooterLinks styles={styles} />
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
