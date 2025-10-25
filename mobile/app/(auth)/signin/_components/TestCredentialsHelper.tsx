import { useAdaptiveColors } from '@/hooks/useAdaptiveColors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TestCredentialsHelperProps {
  onSelectCredentials: (email: string, password: string) => void;
}

export default function TestCredentialsHelper({ onSelectCredentials }: TestCredentialsHelperProps) {
  const colors = useAdaptiveColors();

  const testAccounts = [
    { email: 'test@test.com', password: '123456', label: 'Test User' },
 
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.isDark ? '#1a1a1a' : '#f0f0f0' }]}>
      <Text style={[styles.title, { color: colors.primaryText }]}>
        🧪 Mode Test - Comptes Disponibles
      </Text>
      {testAccounts.map((account, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.accountButton, { 
            backgroundColor: colors.isDark ? '#2a2a2a' : '#ffffff',
            borderColor: colors.isDark ? '#3a3a3a' : '#e0e0e0',
          }]}
          onPress={() => onSelectCredentials(account.email, account.password)}
        >
          <Text style={[styles.accountLabel, { color: colors.primaryText }]}>
            {account.label}
          </Text>
          <Text style={[styles.accountEmail, { color: colors.secondaryText }]}>
            {account.email}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  accountButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  accountLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  accountEmail: {
    fontSize: 12,
  },
});
