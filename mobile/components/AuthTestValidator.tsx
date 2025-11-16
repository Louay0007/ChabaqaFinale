import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { setSecureItem, getSecureItem, removeSecureItem, diagnoseStorage } from '../lib/secure-storage';
import AuthMigration from '../lib/auth-migration';
import PlatformUtils from '../lib/platform-utils';
import { useAuth } from '../hooks/use-auth';

/**
 * Authentication System Test Validator
 * Tests all aspects of the cross-platform authentication system
 */

export default function AuthTestValidator() {
  const [testResults, setTestResults] = useState<Array<{
    name: string;
    status: 'pending' | 'success' | 'error';
    message: string;
  }>>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();

  const addTestResult = (name: string, status: 'success' | 'error', message: string) => {
    setTestResults(prev => [...prev, { name, status, message }]);
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    try {
      // Test 1: Platform Detection
      addTestResult(
        'Platform Detection',
        'success',
        `Running on ${PlatformUtils.getPlatformName()}`
      );

      // Test 2: Storage Basic Operations
      try {
        const testKey = 'test_auth_key';
        const testValue = 'test_auth_value_123';
        
        await setSecureItem(testKey, testValue);
        const retrieved = await getSecureItem(testKey);
        await removeSecureItem(testKey);

        if (retrieved === testValue) {
          addTestResult('Storage Operations', 'success', 'Set/Get/Delete operations work correctly');
        } else {
          addTestResult('Storage Operations', 'error', `Value mismatch: expected "${testValue}", got "${retrieved}"`);
        }
      } catch (error) {
        addTestResult('Storage Operations', 'error', `Storage test failed: ${error}`);
      }

      // Test 3: Storage Diagnostics
      try {
        await diagnoseStorage();
        addTestResult('Storage Diagnostics', 'success', 'Storage diagnostics completed successfully');
      } catch (error) {
        addTestResult('Storage Diagnostics', 'error', `Diagnostics failed: ${error}`);
      }

      // Test 4: Auth Migration
      try {
        await AuthMigration.migrateAuthData();
        addTestResult('Auth Migration', 'success', 'Migration completed without errors');
      } catch (error) {
        addTestResult('Auth Migration', 'error', `Migration failed: ${error}`);
      }

      // Test 5: Auth Storage Diagnosis
      try {
        await AuthMigration.diagnoseAuthStorage();
        addTestResult('Auth Storage Check', 'success', 'Auth storage diagnosis completed');
      } catch (error) {
        addTestResult('Auth Storage Check', 'error', `Auth diagnosis failed: ${error}`);
      }

      
      try {
        const complexData = {
          text: 'Hello World! 🌍',
          emoji: '🔐🚀💯',
          special: 'åäö@#$%^&*()[]{}',
          json: { nested: { deep: 'value' } },
          array: [1, 2, 3, 'test'],
          unicode: '中文测试'
        };
        
        const complexKey = 'complex_test_data';
        const complexValue = JSON.stringify(complexData);
        
        await setSecureItem(complexKey, complexValue);
        const retrievedComplex = await getSecureItem(complexKey);
        await removeSecureItem(complexKey);

        if (retrievedComplex === complexValue) {
          const parsed = JSON.parse(retrievedComplex);
          if (JSON.stringify(parsed) === JSON.stringify(complexData)) {
            addTestResult('Complex Data Storage', 'success', 'Special characters, emojis, and JSON handled correctly');
          } else {
            addTestResult('Complex Data Storage', 'error', 'JSON parsing failed after retrieval');
          }
        } else {
          addTestResult('Complex Data Storage', 'error', 'Complex data storage failed');
        }
      } catch (error) {
        addTestResult('Complex Data Storage', 'error', `Complex storage test failed: ${error}`);
      }

      // Test 7: API Configuration
      try {
        const apiUrl = PlatformUtils.getApiUrl();
        if (apiUrl && apiUrl.startsWith('http')) {
          addTestResult('API Configuration', 'success', `API URL configured: ${apiUrl}`);
        } else {
          addTestResult('API Configuration', 'error', `Invalid API URL: ${apiUrl}`);
        }
      } catch (error) {
        addTestResult('API Configuration', 'error', `API config test failed: ${error}`);
      }

      // Test 8: Auth Hook State
      try {
        addTestResult(
          'Auth Hook State',
          'success',
          `Loading: ${isLoading}, Authenticated: ${isAuthenticated}, User: ${user ? 'Present' : 'None'}`
        );
      } catch (error) {
        addTestResult('Auth Hook State', 'error', `Auth hook test failed: ${error}`);
      }

    } catch (globalError) {
      addTestResult('Global Test', 'error', `Global test error: ${globalError}`);
    }

    setIsRunning(false);
  };

  const clearAllAuthData = async () => {
    try {
      await AuthMigration.clearAllAuthData();
      Alert.alert('Success', 'All authentication data cleared');
    } catch (error) {
      Alert.alert('Error', `Failed to clear auth data: ${error}`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '⏳';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔐 Auth System Validator</Text>
        <Text style={styles.subtitle}>Platform: {PlatformUtils.getPlatformName()}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={runAllTests}
          disabled={isRunning}
        >
          <Text style={styles.buttonText}>
            {isRunning ? '🔄 Running Tests...' : '🧪 Run All Tests'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.dangerButton]}
          onPress={clearAllAuthData}
          disabled={isRunning}
        >
          <Text style={styles.buttonText}>🧹 Clear Auth Data</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.results}>
        <Text style={styles.resultsTitle}>Test Results:</Text>
        {testResults.length === 0 ? (
          <Text style={styles.noResults}>No tests run yet</Text>
        ) : (
          testResults.map((result, index) => (
            <View key={index} style={styles.resultItem}>
              <Text style={styles.resultIcon}>{getStatusIcon(result.status)}</Text>
              <View style={styles.resultContent}>
                <Text style={styles.resultName}>{result.name}</Text>
                <Text style={[
                  styles.resultMessage,
                  result.status === 'error' && styles.errorMessage
                ]}>
                  {result.message}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Summary:</Text>
        <Text style={styles.summaryText}>
          Total: {testResults.length} | 
          Success: {testResults.filter(r => r.status === 'success').length} | 
          Errors: {testResults.filter(r => r.status === 'error').length}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  results: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  noResults: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  resultContent: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  resultMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  errorMessage: {
    color: '#FF3B30',
  },
  summary: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
  },
});
