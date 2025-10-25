import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View, Platform } from 'react-native';
import { EyeIcon, EyeOffIcon } from './Icons';
import DatePicker from './DatePicker';

interface SignupFormProps {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  numtel: string;
  setNumtel: (numtel: string) => void;
  dateNaissance: string;
  birthDate: Date;
  showDatePicker: boolean;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  onDateChange: (event: any, selectedDate?: Date) => void;
  showDatepicker: () => void;
  isLoading: boolean;
  error: string;
  successMessage: string;
  onSubmit: () => void;
  styles: any;
}

const SignupForm: React.FC<SignupFormProps> = ({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  numtel,
  setNumtel,
  dateNaissance,
  birthDate,
  showDatePicker,
  showPassword,
  setShowPassword,
  onDateChange,
  showDatepicker,
  isLoading,
  error,
  successMessage,
  onSubmit,
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
        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Your full name"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="words"
          editable={!isLoading}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email Address *</Text>
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

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={numtel}
          onChangeText={setNumtel}
          placeholder="+216 12 34 56 78"
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
          editable={!isLoading}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Date of Birth</Text>
        <TouchableOpacity 
          style={[styles.input, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
          onPress={showDatepicker}
          disabled={isLoading}
        >
          <Text style={{
            color: dateNaissance ? '#1F2937' : '#9CA3AF',
            fontSize: 16,
          }}>
            {dateNaissance || 'Select your birth date'}
          </Text>
          <Text style={{ fontSize: 18 }}>📅</Text>
        </TouchableOpacity>
        <DatePicker
          value={birthDate}
          onChange={onDateChange}
          show={showDatePicker}
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password *</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••••"
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
            <Text style={styles.primaryButtonText}>Create my account</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default SignupForm;
