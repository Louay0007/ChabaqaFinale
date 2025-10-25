import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { EyeIcon, EyeOffIcon } from './Icons';

interface ResetFormProps {
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  newPassword: string;
  setNewPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
  error: string;
  isLoading: boolean;
  onSubmit: () => void;
  styles: any;
}

const ResetForm: React.FC<ResetFormProps> = ({
  verificationCode,
  setVerificationCode,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
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

      <View style={styles.inputContainer}>
        <Text style={styles.label}>New Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter your new password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry={!showPassword}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirm New Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your new password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry={!showConfirmPassword}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading}
          >
            {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
          </TouchableOpacity>
        </View>
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
            <Text style={styles.primaryButtonText}>Reset Password</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default ResetForm;
