import React from 'react';
import { Text, TextInput, View } from 'react-native';
import styles from '../styles';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
  error?: string;
}

const Input = ({ label, value, onChangeText, placeholder, multiline, numberOfLines, error }: InputProps) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && styles.textArea, error && styles.inputError]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      multiline={multiline}
      numberOfLines={numberOfLines}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

export default Input;
