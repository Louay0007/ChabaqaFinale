import { useAdaptiveColors } from '@/hooks/useAdaptiveColors';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GoogleIcon } from './Icons';

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isRequestingCode: boolean;
  error: string;
  successMessage: string;
  onSubmit: () => void;
  onGoogleLogin: () => void;
  styles: any;
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  isRequestingCode,
  error,
  successMessage,
  onSubmit,
  onGoogleLogin,
  styles
}) => {
  const colors = useAdaptiveColors();
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
        <Text style={[styles.label, { color: colors.primaryText }]}>Email address</Text>
        <TextInput
          style={[
            styles.input, 
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.inputBorder,
              color: colors.inputText,
            }
          ]}
          value={email}
          onChangeText={setEmail}
          placeholder="your@email.com"
          placeholderTextColor={colors.isDark ? "#9CA3AF" : "#6B7280"}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isRequestingCode}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.primaryText }]}>Password</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.inputBorder,
              color: colors.inputText,
            }
          ]}
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••••"
          placeholderTextColor={colors.isDark ? "#9CA3AF" : "#6B7280"}
          secureTextEntry
          editable={!isRequestingCode}
        />
      </View>
      
      <TouchableOpacity
        onPress={onSubmit}
        disabled={isRequestingCode}
        activeOpacity={1}
      >
        <LinearGradient
          colors={colors.isDark ? 
            ['rgba(142, 120, 251, 0.9)', 'rgba(71, 199, 234, 0.9)'] : 
            ['#8e78fb', '#47c7ea']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.primaryButton, isRequestingCode && styles.disabledButton]}
        >
          {isRequestingCode ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Continue</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
      
      <View style={styles.divider}>
        <View style={[styles.dividerLine, { backgroundColor: colors.dividerLine }]} />
        <Text style={[styles.dividerText, { color: colors.secondaryText }]}>or</Text>
        <View style={[styles.dividerLine, { backgroundColor: colors.dividerLine }]} />
      </View>
      
      <TouchableOpacity
        style={[
          styles.secondaryButton, 
          {
            backgroundColor: colors.secondaryButtonBackground,
            borderColor: colors.secondaryButtonBorder,
          },
          isRequestingCode && styles.disabledButton
        ]}
        onPress={onGoogleLogin}
        disabled={isRequestingCode}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <GoogleIcon />
          <Text style={[
            styles.secondaryButtonText, 
            { marginLeft: 12, color: colors.secondaryButtonText }
          ]}>Continue with Google</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default LoginForm;
