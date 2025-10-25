import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface TwoFactorFormProps {
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  isLoading: boolean;
  error: string;
  successMessage: string;
  onSubmit: () => void;
  onBackToCredentials: () => void;
  styles: any;
}

const TwoFactorForm: React.FC<TwoFactorFormProps> = ({
  verificationCode,
  setVerificationCode,
  isLoading,
  error,
  successMessage,
  onSubmit,
  onBackToCredentials,
  styles
}) => {
  return (
    <View style={styles.form}>
      {successMessage ? (
        <View style={styles.successMessage}>
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      ) : null}
      {error ? (
        <View style={styles.errorMessage}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Verification Code</Text>
        <TextInput
          style={[styles.input, styles.codeInput]}
          value={verificationCode}
          onChangeText={(text) => setVerificationCode(text.replace(/\D/g, '').slice(0, 6))}
          placeholder="123456"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          maxLength={6}
          editable={!isLoading}
        />
      </View>
      
      <TouchableOpacity
        onPress={onSubmit}
        disabled={isLoading}
        activeOpacity={1}
      >
        <LinearGradient
          colors={['#8e78fb', '#47c7ea']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.primaryButton, isLoading && styles.disabledButton]}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Sign In</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBackToCredentials}
        disabled={isLoading}
      >
        <Text style={styles.backButtonText}>← Back to credentials</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TwoFactorForm;
