import AdaptiveBackground from '@/_components/AdaptiveBackground';
import AdaptiveStatusBar from '@/_components/AdaptiveStatusBar';
import BackButton from '@/_components/BackButton';
import { createCommunityAction } from '@/lib/build-community-api';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import StepOne from './_components/StepOne';
import Stepper from './_components/Stepper';
import StepThree from './_components/StepThree';
import StepTwo from './_components/StepTwo';
import Success from './_components/Success';
import styles from './styles';

// Type definition for form data
type CommunityFormData = {
  name: string;
  bio: string;
  country: string;
  status: 'public' | 'private';
  joinFee: 'free' | 'paid';
  feeAmount: string;
  currency: string;
  socialLinks: {
    instagram: string;
    tiktok: string;
    facebook: string;
    youtube: string;
    linkedin: string;
    website: string;
  };
};

export default function BuildCommunityScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState<CommunityFormData>({
    name: '',
    bio: '',
    country: '',
    status: 'public',
    joinFee: 'free',
    feeAmount: '0',
    currency: 'USD',
    socialLinks: { instagram: '', tiktok: '', facebook: '', youtube: '', linkedin: '', website: '' },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [socialLinkErrors, setSocialLinkErrors] = useState<Record<string, string>>({});
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const currencies = [
    { code: 'USD', name: 'United States Dollar', symbol: '$' },
    { code: 'TND', name: 'Tunisian Dinar', symbol: 'د.ت' },
    { code: 'EUR', name: 'Euro', symbol: '€' }
  ];

  const updateFormData = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (parent === 'socialLinks') {
        setFormData(prev => ({
          ...prev,
          socialLinks: {
            ...prev.socialLinks,
            [child]: value
          }
        }));
        validateAndSetSocialLink(child, value);
      }
    } else {
      setFormData(prev => ({ ...prev, [field]: value } as CommunityFormData));
    }
  };

  const validateAndSetSocialLink = (platform: string | number, url: string) => {
    const platformStr = String(platform);
    if (url.trim() && !validateSocialLink(platformStr, url)) {
      setSocialLinkErrors(prev => ({ ...prev, [platformStr]: `Please enter a valid ${platformStr} URL or username` }));
    } else {
      setSocialLinkErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[platformStr];
        return newErrors;
      });
    }
  };

  const validateSocialLink = (platform: string, url: string) => {
    const regexMap = {
      instagram: /^(https?:\/\/)?(www\.)?instagram\.com\/[A-Za-z0-9._-]+\/?$|^@?[A-Za-z0-9._-]{1,30}$/,
      tiktok: /^(https?:\/\/)?(www\.)?tiktok\.com\/@[A-Za-z0-9._-]+\/?$|^@?[A-Za-z0-9._-]{1,24}$/,
      facebook: /^(https?:\/\/)?(www\.)?facebook\.com\/[A-Za-z0-9.\-]+\/?$/,
      youtube: /^(https?:\/\/)?(www\.)?youtube\.com\/(channel|c|user)\/[A-Za-z0-9._-]+\/?$/,
      linkedin: /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[A-Za-z0-9._-]+\/?$/,
      website: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
    } as const;
    const key = platform.toLowerCase() as keyof typeof regexMap;
    return !url.trim() || (regexMap[key]?.test(url.trim()) ?? false);
  };

  const canContinue = () => {
    switch (currentStep) {
      case 1: return formData.name.trim() !== '' && formData.country.trim() !== '';
      case 2: return formData.joinFee === 'paid' ? formData.feeAmount && parseFloat(formData.feeAmount) > 0 : true;
      case 3: return Object.values(formData.socialLinks).some(link => link.trim() !== '') && Object.keys(socialLinkErrors).length === 0;
      default: return false;
    }
  };

  const nextStep = () => canContinue() && currentStep < 3 && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      const dataToSubmit = { ...formData, feeAmount: formData.joinFee === 'paid' ? formData.feeAmount : '0' };
      const result = await createCommunityAction(dataToSubmit);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => router.push('/(tabs)'), 2000);
      } else setError(result.error || "Une erreur s'est produite");
    } catch (error) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImagePicker = () => {
    // Placeholder for camera/gallery logic
    // Implement openCamera and openGallery as needed
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <AdaptiveStatusBar />
      <AdaptiveBackground style={styles.background} resizeMode="cover">
        <View style={styles.safeAreaTop} />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.headerContainer}>
            <BackButton 
              onPress={() => router.back()} 
              color="#1f2937" 
              size={28} 
            />
          </View>
          <BlurView intensity={20} style={styles.card}>
            {!success ? (
              <View style={styles.form}>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <Stepper currentStep={currentStep} />
                {currentStep === 1 && <StepOne formData={formData} updateFormData={updateFormData} selectedImage={selectedImage} handleImagePicker={handleImagePicker} />}
                {currentStep === 2 && <StepTwo formData={formData} updateFormData={updateFormData} selectedCurrency={selectedCurrency} setSelectedCurrency={setSelectedCurrency} showCurrencyModal={showCurrencyModal} setShowCurrencyModal={setShowCurrencyModal} currencies={currencies} />}
                {currentStep === 3 && <StepThree formData={formData} updateFormData={updateFormData} socialLinkErrors={socialLinkErrors} />}
                <View style={styles.navigation}>
                  {currentStep > 1 && (
                    <TouchableOpacity 
                      style={styles.secondaryButton} 
                      onPress={prevStep} 
                      disabled={isSubmitting}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.secondaryButtonText}>← Back</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity 
                    onPress={currentStep === 3 ? handleSubmit : nextStep} 
                    disabled={!canContinue() || isSubmitting}
                    activeOpacity={0.8}
                  >
                    <LinearGradient colors={['#8e78fb', '#47c7ea']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.primaryButton, (!canContinue() || isSubmitting) && styles.disabledButton]}>
                      {isSubmitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryButtonText}>{currentStep === 3 ? 'Create Community' : 'Continue →'}</Text>}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <Success 
                communityName={formData.name}
                communityImage={selectedImage}
                onGoToCommunities={() => {
                  // Use setTimeout to ensure navigation happens after component is fully mounted
                  setTimeout(() => {
                    try {
                      router.push('/(tabs)');
                    } catch (error) {
                      console.log('Navigation error:', error);
                      // Fallback navigation
                      router.replace('/');
                    }
                  }, 100);
                }}
              />
            )}
          </BlurView>
          <View style={styles.footer}><Text style={styles.footerText}>© 2024 Chabaqa. Build the future of communities.</Text></View>
        </ScrollView>
      </AdaptiveBackground>
    </KeyboardAvoidingView>
  );
}