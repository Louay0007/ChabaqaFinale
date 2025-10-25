import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, TextInput, View } from 'react-native';
import styles from '../styles';
import FacebookIcon from './icons/FacebookIcon';
import InstagramIcon from './icons/InstagramIcon';
import LinkedInIcon from './icons/LinkedInIcon';
import TikTokIcon from './icons/TikTokIcon';
import WebsiteIcon from './icons/WebsiteIcon';
import YouTubeIcon from './icons/YouTubeIcon';

interface StepThreeProps {
  formData: {
    socialLinks: {
      instagram: string;
      tiktok: string;
      facebook: string;
      youtube: string;
      linkedin: string;
      website: string;
    };
  };
  updateFormData: (field: string, value: string) => void;
  socialLinkErrors: {
    instagram?: string;
    tiktok?: string;
    facebook?: string;
    youtube?: string;
    linkedin?: string;
    website?: string;
  };
}

const StepThree = ({ formData, updateFormData, socialLinkErrors }: StepThreeProps) => (
  <View style={styles.stepContent}>
    <Text style={styles.stepTitle}>Connect Your Social Media</Text>
    <Text style={styles.stepSubtitle}>Link your social accounts to help people find your community.</Text>
    <View style={styles.socialLinksContainer}>
      <View style={styles.socialLinkRow}>
        <View style={styles.socialIconContainer}><LinearGradient colors={['#E1306C', '#C13584']} style={styles.socialIcon}><InstagramIcon /></LinearGradient></View>
        <TextInput style={[styles.socialInput, socialLinkErrors.instagram && styles.inputError]} value={formData.socialLinks.instagram} onChangeText={text => updateFormData('socialLinks.instagram', text)} placeholder="Instagram username or URL" placeholderTextColor="#9CA3AF" />
      </View>
      {socialLinkErrors.instagram && <Text style={styles.errorText}>{socialLinkErrors.instagram}</Text>}
      <View style={styles.socialLinkRow}>
        <View style={styles.socialIconContainer}><LinearGradient colors={['#000000', '#333333']} style={styles.socialIcon}><TikTokIcon /></LinearGradient></View>
        <TextInput style={[styles.socialInput, socialLinkErrors.tiktok && styles.inputError]} value={formData.socialLinks.tiktok} onChangeText={text => updateFormData('socialLinks.tiktok', text)} placeholder="TikTok username or URL" placeholderTextColor="#9CA3AF" />
      </View>
      {socialLinkErrors.tiktok && <Text style={styles.errorText}>{socialLinkErrors.tiktok}</Text>}
      <View style={styles.socialLinkRow}>
        <View style={styles.socialIconContainer}><LinearGradient colors={['#1877F2', '#1565C0']} style={styles.socialIcon}><FacebookIcon /></LinearGradient></View>
        <TextInput style={[styles.socialInput, socialLinkErrors.facebook && styles.inputError]} value={formData.socialLinks.facebook} onChangeText={text => updateFormData('socialLinks.facebook', text)} placeholder="Facebook page URL" placeholderTextColor="#9CA3AF" />
      </View>
      {socialLinkErrors.facebook && <Text style={styles.errorText}>{socialLinkErrors.facebook}</Text>}
      <View style={styles.socialLinkRow}>
        <View style={styles.socialIconContainer}><LinearGradient colors={['#FF0000', '#CC0000']} style={styles.socialIcon}><YouTubeIcon /></LinearGradient></View>
        <TextInput style={[styles.socialInput, socialLinkErrors.youtube && styles.inputError]} value={formData.socialLinks.youtube} onChangeText={text => updateFormData('socialLinks.youtube', text)} placeholder="YouTube channel URL" placeholderTextColor="#9CA3AF" />
      </View>
      {socialLinkErrors.youtube && <Text style={styles.errorText}>{socialLinkErrors.youtube}</Text>}
      <View style={styles.socialLinkRow}>
        <View style={styles.socialIconContainer}><LinearGradient colors={['#0077B5', '#005885']} style={styles.socialIcon}><LinkedInIcon /></LinearGradient></View>
        <TextInput style={[styles.socialInput, socialLinkErrors.linkedin && styles.inputError]} value={formData.socialLinks.linkedin} onChangeText={text => updateFormData('socialLinks.linkedin', text)} placeholder="LinkedIn page URL" placeholderTextColor="#9CA3AF" />
      </View>
      {socialLinkErrors.linkedin && <Text style={styles.errorText}>{socialLinkErrors.linkedin}</Text>}
      <View style={styles.socialLinkRow}>
        <View style={styles.socialIconContainer}><LinearGradient colors={['#6B7280', '#4B5563']} style={styles.socialIcon}><WebsiteIcon /></LinearGradient></View>
        <TextInput style={[styles.socialInput, socialLinkErrors.website && styles.inputError]} value={formData.socialLinks.website} onChangeText={text => updateFormData('socialLinks.website', text)} placeholder="Your website URL" placeholderTextColor="#9CA3AF" />
      </View>
      {socialLinkErrors.website && <Text style={styles.errorText}>{socialLinkErrors.website}</Text>}
    </View>
  </View>
);

export default StepThree;
