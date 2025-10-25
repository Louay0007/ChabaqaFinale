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
  // Afficher un loader pendant la vérification de l'authentification
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>🔍 Vérification de l'authentification...</Text>
      </View>
    );
  }

  // Rediriger vers la page appropriée en fonction de l'état d'authentification
  if (isAuthenticated) {
    console.log('✅ [INDEX] Utilisateur authentifié, redirection vers communities');
    return <Redirect href="/(communities)" />;
  } else {
    console.log('🔐 [INDEX] Utilisateur non authentifié, redirection vers signin');
    return <Redirect href="/(auth)/signin" />;
  }
  */
}
