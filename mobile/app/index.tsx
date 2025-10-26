import { useAuth } from '@/hooks/use-auth';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View, Text } from 'react-native';

export default function Index() {
  const { isLoading, isAuthenticated, logout } = useAuth();

  // 🧪 TESTING MODE: Always start with auth for testing
  // Comment out the lines below when you want normal behavior
  console.log('🧪 [INDEX] TESTING MODE: Always redirecting to auth for testing');
  return <Redirect href="/(auth)/signin" />;

  // 📝 NORMAL MODE: Uncomment this section for production behavior
  /*
  // Show loader during authentication verification
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>🔍 Checking authentication...</Text>
      </View>
    );
  }

  // Redirect to appropriate page based on authentication state
  // COMMUNITIES ARE NOW THE BASE OF EVERYTHING
  if (isAuthenticated) {
    console.log('✅ [INDEX] User authenticated, redirecting to communities hub');
    return <Redirect href="/(communities)" />;
  } else {
    console.log('🔐 [INDEX] User not authenticated, redirecting to signin');
    return <Redirect href="/(auth)/signin" />;
  }
  */
}
