import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import styles from '../styles';
import CameraIcon from './icons/CameraIcon';

interface UploadImageProps {
  selectedImage: string | null;
  handleImagePicker: () => void;
}

const UploadImage: React.FC<UploadImageProps> = ({ selectedImage, handleImagePicker }) => (
  <View style={styles.photoUploadContainer}>
    <TouchableOpacity 
      style={styles.photoUploadButton} 
      onPress={handleImagePicker}
      activeOpacity={0.8}
    >
      <LinearGradient colors={['#8e78fb', '#47c7ea']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.photoUploadGradient}>
        {selectedImage ? <Image source={{ uri: selectedImage }} style={styles.selectedImage} /> : <CameraIcon />}
      </LinearGradient>
    </TouchableOpacity>
    <Text style={styles.photoUploadText}>Add community photo</Text>
  </View>
);

export default UploadImage;