import React from 'react';
import { Text, TextInput, View } from 'react-native';
import styles from '../styles';
import UploadImage from './UploadImage';

interface StepOneProps {
  formData: {
    name: string;
    country: string;
    bio: string;
  };
  updateFormData: (field: string, value: string) => void;
  selectedImage: string | null;
  handleImagePicker: () => void;
}

const StepOne = ({ formData, updateFormData, selectedImage, handleImagePicker }: StepOneProps) => (
  <View style={styles.stepContent}>
    <Text style={styles.stepTitle}>Name your community</Text>
    <Text style={styles.stepSubtitle}>You can always change this later.</Text>
    <UploadImage selectedImage={selectedImage} handleImagePicker={handleImagePicker} />
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Community Name *</Text>
      <TextInput style={styles.input} value={formData.name} onChangeText={text => updateFormData('name', text)} placeholder="e.g Creators Club" placeholderTextColor="#9CA3AF" />
    </View>
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Country *</Text>
      <TextInput style={styles.input} value={formData.country} onChangeText={text => updateFormData('country', text)} placeholder="e.g Tunisia, France, Morocco..." placeholderTextColor="#9CA3AF" />
    </View>
    <View style={styles.inputContainer}>
      <Text style={styles.label}>Bio (optional)</Text>
      <TextInput style={[styles.input, styles.textArea]} value={formData.bio} onChangeText={text => updateFormData('bio', text)} placeholder="Tell people what your community is about..." placeholderTextColor="#9CA3AF" multiline numberOfLines={4} />
    </View>
  </View>
);

export default StepOne;