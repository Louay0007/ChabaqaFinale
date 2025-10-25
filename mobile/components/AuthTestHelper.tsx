import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '@/hooks/use-auth';
import { clearAllTokens, getAccessToken, getRefreshToken, getCachedUser } from '@/lib/auth';

/**
 * 🧪 Auth Testing Helper Component
 * 
 * This component provides buttons to test various auth functions
 * Add this to any screen where you want to test auth functionality
 */
export default function AuthTestHelper() {
  const { user, isAuthenticated, logout } = useAuth();

  const showTokenInfo = async () => {
    const accessToken = await getAccessToken();
    const refreshToken = await getRefreshToken();
    const cachedUser = await getCachedUser();
    
    Alert.alert('🔍 Token Info', 
      `Access Token: ${accessToken ? 'Present' : 'None'}\n` +
      `Refresh Token: ${refreshToken ? 'Present' : 'None'}\n` +
      `Cached User: ${cachedUser ? cachedUser.email : 'None'}\n` +
      `Hook Auth: ${isAuthenticated ? 'Yes' : 'No'}`
    );
  };

  const clearTokensManually = async () => {
    await clearAllTokens();
    Alert.alert('🗑️ Tokens Cleared', 'All tokens have been cleared from SecureStore');
    console.log('🧪 [TEST] Tokens cleared manually');
  };

  const forceLogout = async () => {
    await logout();
    Alert.alert('👋 Logged Out', 'User has been logged out');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧪 Auth Test Helper</Text>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          User: {user ? user.email : 'Not logged in'}
        </Text>
        <Text style={styles.infoText}>
          Authenticated: {isAuthenticated ? '✅ Yes' : '❌ No'}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={showTokenInfo}>
          <Text style={styles.buttonText}>🔍 Show Token Info</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={clearTokensManually}>
          <Text style={styles.buttonText}>🗑️ Clear All Tokens</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={forceLogout}>
          <Text style={styles.buttonText}>👋 Force Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#007AFF',
  },
  infoContainer: {
    marginBottom: 15,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  buttonContainer: {
    gap: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});
