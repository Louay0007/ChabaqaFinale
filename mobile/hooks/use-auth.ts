import { useCallback, useEffect, useState } from 'react';
import {
  User,
  logout as authLogout,
  revokeAllTokens as authRevokeAllTokens,
  isAuthenticated as checkAuth,
  getAccessToken,
  getCachedUser,
  getProfile,
  getRefreshToken
} from '../lib/auth';
import AuthMigration from '../lib/auth-migration';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fonction pour vérifier rapidement si des tokens existent
  const checkTokensExist = useCallback(async () => {
    const accessToken = await getAccessToken();
    const refreshToken = await getRefreshToken();
    return !!(accessToken || refreshToken);
  }, []);

  // Fonction pour charger l'utilisateur
  const loadUser = useCallback(async () => {
    try {
      setIsLoading(true);

      // D'abord, récupérer l'utilisateur en cache et vérifier les tokens
      const cachedUser = await getCachedUser();
      const hasTokens = (await getAccessToken()) || (await getRefreshToken());

      if (cachedUser && hasTokens) {
        setUser(cachedUser);
        setIsAuthenticated(true);

        // Vérifier en arrière-plan si l'authentification est toujours valide
        // mais ne pas bloquer l'UI pour cela
        checkAuth()
          .then(async (authenticated) => {
            if (authenticated) {
              // Optionnellement, récupérer un profil frais en arrière-plan
              const freshUser = await getProfile();
              if (freshUser) {
                setUser(freshUser);
              }
            } else {
              setUser(null);
              setIsAuthenticated(false);
            }
          })
          .catch((error) => {
            // En cas d'erreur réseau, garder l'état en cache
            // Silently fail - user can still use app with cached data
            if (__DEV__) {
              console.log('Background auth check failed (using cached data)');
            }
          });

        setIsLoading(false);
        return;
      }

      // Si pas d'utilisateur en cache ou pas de tokens, vérifier avec le serveur
      const authenticated = await checkAuth();
      if (authenticated) {
        const freshUser = await getProfile();
        if (freshUser) {
          setUser(freshUser);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error loading user:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fonction pour se connecter
  const login = useCallback((userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  // Fonction pour se déconnecter
  const logout = useCallback(async () => {
    try {
      console.log('🧪 [USE-AUTH] Déconnexion pour test...');
      await authLogout();
      console.log('✅ [USE-AUTH] Déconnexion réussie');
    } catch (error) {
      console.error('💥 [USE-AUTH] Erreur lors de la déconnexion:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      console.log('🔄 [USE-AUTH] État local réinitialisé');
    }
  }, []);

  // Fonction pour révoquer tous les tokens (déconnexion de tous les appareils)
  const revokeAllTokens = useCallback(async () => {
    try {
      console.log('🔐 [USE-AUTH] Révocation de tous les tokens...');
      await authRevokeAllTokens();
      console.log('✅ [USE-AUTH] Tous les tokens révoqués');
    } catch (error) {
      console.error('💥 [USE-AUTH] Erreur lors de la révocation:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      console.log('🔄 [USE-AUTH] État local réinitialisé');
    }
  }, []);

  // Charger l'utilisateur au montage du composant
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Run migration first to handle any old storage format
        await AuthMigration.migrateAuthData();

        // Diagnostic in development mode
        if (__DEV__) {
          await AuthMigration.diagnoseAuthStorage();
        }

        // Vérification rapide des tokens pour éviter le flash
        const hasTokens = await checkTokensExist();
        const cachedUser = await getCachedUser();

        if (hasTokens && cachedUser) {
          // Définir immédiatement l'état comme authentifié pour éviter le flash
          setUser(cachedUser);
          setIsAuthenticated(true);
          setIsLoading(false);

          // Puis vérifier en arrière-plan
          loadUser();
        } else {
          // Pas de tokens ou d'utilisateur en cache, charger normalement
          loadUser();
        }
      } catch (error) {
        console.error('💥 [USE-AUTH] Error during auth initialization:', error);
        // Still try to load user even if migration fails
        loadUser();
      }
    };

    initializeAuth();
  }, [loadUser, checkTokensExist]);

  // Watch for token changes (e.g., when refresh fails and clears tokens)
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkTokenInterval = setInterval(async () => {
      const hasTokens = await checkTokensExist();
      if (!hasTokens && isAuthenticated) {
        console.log('🚪 [USE-AUTH] Tokens cleared - logging out');
        setUser(null);
        setIsAuthenticated(false);
      }
    }, 2000); // Check every 2 seconds

    return () => clearInterval(checkTokenInterval);
  }, [isAuthenticated, checkTokensExist]);

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    revokeAllTokens,
    refetch: loadUser,
  };
};
