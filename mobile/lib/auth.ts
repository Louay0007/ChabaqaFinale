"use client"

import { SecureStorage, setSecureItem, getSecureItem, removeSecureItem } from './secure-storage';
import { tryEndpoints } from './http';
import PlatformUtils from './platform-utils';

// Interface pour l'utilisateur (full profile from database + JWT fields)
export interface User {
  // JWT token fields
  sub?: string;
  iat?: number;
  exp?: number;
  // Database user fields
  _id?: string;
  id?: string;
  email: string;
  name: string;
  role: string;
  numtel?: string;
  date_naissance?: string;
  sexe?: string;
  pays?: string;
  ville?: string;
  code_postal?: string;
  adresse?: string;
  bio?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Interface pour les réponses d'authentification
export interface AuthResponse {
  access_token?: string;
  refresh_token?: string;
  user?: User;
  requires2FA?: boolean;
  email?: string;
  message?: string;
  error?: string;
}

// Clés pour le stockage sécurisé
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

// URL de base de l'API (platform-aware)
const API_BASE_URL = PlatformUtils.getApiUrl();

// Log platform info for debugging auth system
if (__DEV__) {
  console.log('🔐 [AUTH] Initializing authentication system...');
  PlatformUtils.logPlatformInfo();
}

// Fonctions de stockage sécurisé
export const storeTokens = async (accessToken: string, refreshToken?: string): Promise<void> => {
  try {
    await setSecureItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      await setSecureItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  } catch (error) {
    console.error('Error storing tokens:', error);
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  try {
    return await getSecureItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await getSecureItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

export const storeUser = async (user: User): Promise<void> => {
  try {
    await setSecureItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error storing user:', error);
  }
};

export const getStoredUser = async (): Promise<User | null> => {
  try {
    const userData = await getSecureItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting stored user:', error);
    return null;
  }
};

export const clearAllTokens = async (): Promise<void> => {
  try {
    await removeSecureItem(ACCESS_TOKEN_KEY);
    await removeSecureItem(REFRESH_TOKEN_KEY);
    await removeSecureItem(USER_KEY);
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
};

// Fonction pour rafraîchir le token
export const refreshToken = async (): Promise<boolean> => {
  try {
    const storedRefreshToken = await getRefreshToken();
    if (!storedRefreshToken) {
      console.log('⚠️ [AUTH] Aucun refresh token disponible');
      return false;
    }

    console.log('🔄 [AUTH] Rafraîchissement du token...');
    const resp = await tryEndpoints<{ access_token: string; refresh_token?: string }>(
      '/api/auth/refresh',
      {
        method: 'POST',
        data: { refreshToken: storedRefreshToken }, // Backend expects 'refreshToken' not 'refresh_token'
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      const data = resp.data;
      console.log('✅ [AUTH] Token rafraîchi avec succès');
      if (data.access_token) {
        await storeTokens(data.access_token, data.refresh_token || storedRefreshToken);
        return true;
      }
    } else if (resp.status === 401) {
      // Refresh token is invalid/expired - clear everything and force re-login
      console.log('🚪 [AUTH] Refresh token invalide - déconnexion automatique');
      await clearAllTokens();
      return false;
    } else {
      console.log(`❌ [AUTH] Échec du rafraîchissement (${resp.status})`);
    }

    return false;
  } catch (error) {
    console.error("💥 [AUTH] Exception lors du rafraîchissement:", error);
    // If refresh fails, clear tokens to force re-login
    await clearAllTokens();
    return false;
  }
};

// Fonction pour vérifier le profil utilisateur
export const getProfile = async (): Promise<User | null> => {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      console.log('⚠️ [AUTH] Aucun access token disponible');
      return null;
    }

    console.log('🔍 [AUTH] Récupération du profil utilisateur...');
    const resp = await tryEndpoints<{ success?: boolean; data?: User; user?: User }>(
      '/api/auth/me',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      const payload = resp.data;
      console.log('✅ [AUTH] Profil récupéré:', payload);
      // Handle both response formats: { data: user } or { user: user }
      const user = payload.data || payload.user;
      if (user) {
        await storeUser(user);
        return user;
      }
    } else if (resp.status === 401) {
      // Token expiré, essayer de le rafraîchir
      console.log('🔄 [AUTH] Token expiré, tentative de rafraîchissement...');
      const refreshSuccess = await refreshToken();
      if (refreshSuccess) {
        console.log('✅ [AUTH] Token rafraîchi, nouvelle tentative...');
        // Retry avec le nouveau token
        return await getProfile();
      } else {
        console.log('❌ [AUTH] Échec du rafraîchissement du token');
      }
    } else {
      console.log(`⚠️ [AUTH] Erreur ${resp.status} lors de la récupération du profil`);
    }

    return null;
  } catch (error) {
    if (__DEV__) {
      console.error("💥 [AUTH] Exception lors de la récupération du profil:", error);
    }
    return null;
  }
};

// Fonction pour se connecter
export const login = async (email: string, password: string, rememberMe: boolean = false): Promise<AuthResponse> => {
  try {
    console.log('🔐 [AUTH] Tentative de connexion pour:', email);
    const resp = await tryEndpoints<any>(
      '/api/auth/login',
      {
        method: 'POST',
        data: {
          email,
          password,
          remember_me: rememberMe,
        },
        timeout: 30000,
      }
    );

    const result = resp.data;
    console.log('📨 [AUTH] Réponse du serveur:', result);

    if (resp.status >= 200 && resp.status < 300 && result.requires2FA) {
      console.log('📱 [AUTH] 2FA requis');
      return {
        requires2FA: true,
        email: email,
        message: result.message
      };
    } else if (resp.status >= 200 && resp.status < 300 && !result.requires2FA && result.access_token) {
      // Connexion directe sans 2FA (cas Google OAuth)
      console.log('✅ [AUTH] Connexion réussie sans 2FA');
      await storeTokens(result.access_token, result.refresh_token);
      if (result.user) {
        await storeUser(result.user);
      }

      return {
        access_token: result.access_token,
        refresh_token: result.refresh_token,
        user: result.user
      };
    } else {
      console.log('❌ [AUTH] Échec de connexion:', result.message);
      return {
        error: result.message || "Email ou mot de passe incorrect"
      };
    }
  } catch (error) {
    console.error('💥 [AUTH] Exception lors de la connexion:', error);
    return {
      error: "Erreur de connexion. Vérifiez votre connexion internet."
    };
  }
};

// Fonction pour vérifier le code 2FA
export const verifyTwoFactor = async (email: string, verificationCode: string): Promise<AuthResponse> => {
  try {
    console.log('🔐 [AUTH] Vérification du code 2FA pour:', email);
    const resp = await tryEndpoints<any>(
      '/api/auth/verify-2fa',
      {
        method: 'POST',
        data: { email, verificationCode },
        timeout: 30000,
      }
    );

    const result = resp.data;
    console.log('📨 [AUTH] Réponse du serveur:', result);

    if (resp.status >= 200 && resp.status < 300 && result.access_token) {
      console.log('✅ [AUTH] 2FA vérifié avec succès');
      // Stocker les tokens
      await storeTokens(result.access_token, result.refresh_token);
      if (result.user) {
        await storeUser(result.user);
      }

      return {
        access_token: result.access_token,
        refresh_token: result.refresh_token,
        user: result.user,
        message: result.message
      };
    } else {
      console.log('❌ [AUTH] Code invalide ou expiré');
      return {
        error: result.message || "Code de vérification invalide ou expiré"
      };
    }
  } catch (error) {
    console.error('💥 [AUTH] Exception lors de la vérification 2FA:', error);
    return {
      error: "Erreur de connexion. Veuillez réessayer."
    };
  }
};

// Fonction pour se déconnecter
export const logout = async (): Promise<boolean> => {
  try {
    const accessToken = await getAccessToken();
    const storedRefreshToken = await getRefreshToken();

    console.log('👋 [AUTH] Déconnexion en cours...');

    if (accessToken || storedRefreshToken) {
      const resp = await tryEndpoints(
        '/api/auth/logout',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          data: storedRefreshToken ? { refresh_token: storedRefreshToken } : undefined,
          timeout: 30000,
        }
      );

      console.log(`📨 [AUTH] Réponse logout: ${resp.status}`);
      // Supprimer les tokens localement même si l'appel échoue
      await clearAllTokens();
      console.log('✅ [AUTH] Tokens supprimés localement');

      return resp.status >= 200 && resp.status < 300;
    }

    await clearAllTokens();
    return true;
  } catch (error) {
    console.error("💥 [AUTH] Exception lors de la déconnexion:", error);
    // Supprimer les tokens localement même en cas d'erreur
    await clearAllTokens();
    return false;
  }
};

// Fonction pour faire des requêtes authentifiées avec refresh automatique
export const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  let accessToken = await getAccessToken();

  if (!accessToken) {
    throw new Error('No access token available');
  }

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      ...(options.headers as Record<string, string>),
    },
    ...options,
  };

  let response = await fetch(url, defaultOptions);

  // Si le token est expiré (401), essayer de le rafraîchir automatiquement
  if (response.status === 401) {
    const refreshSuccess = await refreshToken();
    if (refreshSuccess) {
      // Récupérer le nouveau token et retry la requête
      accessToken = await getAccessToken();
      if (accessToken) {
        const newOptions = {
          ...defaultOptions,
          headers: {
            ...defaultOptions.headers,
            "Authorization": `Bearer ${accessToken}`,
          },
        };
        response = await fetch(url, newOptions);
      }
    } else {
      // Refresh failed, user needs to login again
      await clearAllTokens();
      throw new Error('Authentication failed - please login again');
    }
  }

  return response;
};

// Fonction utilitaire pour les requêtes POST authentifiées
export const authenticatedPost = async (url: string, data: any): Promise<Response> => {
  return authenticatedFetch(url, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Fonction utilitaire pour les requêtes GET authentifiées
export const authenticatedGet = async (url: string): Promise<Response> => {
  return authenticatedFetch(url, {
    method: "GET",
  });
};

// Fonction pour vérifier si l'utilisateur est connecté
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const accessToken = await getAccessToken();
    const storedRefreshToken = await getRefreshToken();

    console.log('🔍 [AUTH] Vérification de l\'authentification...');

    // Si on n'a aucun token, l'utilisateur n'est pas connecté
    if (!accessToken && !storedRefreshToken) {
      console.log('⚠️ [AUTH] Aucun token disponible');
      return false;
    }

    // Si on a un access token, essayer de récupérer le profil
    if (accessToken) {
      console.log('🔑 [AUTH] Access token trouvé, vérification du profil...');
      const user = await getProfile();
      if (user !== null) {
        console.log('✅ [AUTH] Utilisateur authentifié:', user.email);
        return true;
      }
    }

    // Si on n'a qu'un refresh token, essayer de le rafraîchir
    if (storedRefreshToken) {
      console.log('🔄 [AUTH] Tentative de rafraîchissement du token...');
      const refreshSuccess = await refreshToken();
      if (refreshSuccess) {
        // Retry avec le nouveau token
        const user = await getProfile();
        const isAuth = user !== null;
        console.log(isAuth ? '✅ [AUTH] Authentification réussie après rafraîchissement' : '❌ [AUTH] Échec après rafraîchissement');
        return isAuth;
      }
    }

    console.log('❌ [AUTH] Authentification échouée');
    return false;
  } catch (error) {
    console.error('💥 [AUTH] Exception lors de la vérification:', error);
    return false;
  }
};

// Fonction pour récupérer l'utilisateur stocké localement (pour éviter des appels réseau)
export const getCachedUser = async (): Promise<User | null> => {
  return await getStoredUser();
};

// Fonction pour révoquer tous les tokens de l'utilisateur (déconnexion de tous les appareils)
export const revokeAllTokens = async (): Promise<boolean> => {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      console.log('⚠️ [AUTH] Aucun access token disponible');
      return false;
    }

    console.log('🔐 [AUTH] Révocation de tous les tokens...');
    const resp = await tryEndpoints(
      '/api/auth/revoke-all-tokens',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [AUTH] Tous les tokens ont été révoqués');
      await clearAllTokens();
      return true;
    }

    console.log('❌ [AUTH] Échec de la révocation des tokens');
    return false;
  } catch (error) {
    console.error('💥 [AUTH] Exception lors de la révocation des tokens:', error);
    // Clear local tokens even if server call fails
    await clearAllTokens();
    return false;
  }
};
