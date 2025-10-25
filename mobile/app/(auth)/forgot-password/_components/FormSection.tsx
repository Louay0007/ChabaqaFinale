import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface FormSectionProps {
  email: string;
  setEmail: (email: string) => void;
  error: string;
  isLoading: boolean;
  onSubmit: () => void;
  styles: any;
}

const FormSection: React.FC<FormSectionProps> = ({
  email,
  setEmail,
  error,
  isLoading,
  onSubmit,
  styles
}) => {
  return (
    <View style={styles.form}>
      {error ? (
        <View style={styles.errorMessage}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email address</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="your@email.com"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
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
            <Text style={styles.primaryButtonText}>Send Verification Code</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default FormSection;
