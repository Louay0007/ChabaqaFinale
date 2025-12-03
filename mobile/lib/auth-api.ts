import { storeTokens, storeUser, User } from './auth';
import { tryEndpoints } from './http';

// Types pour les résultats d'authentification
export interface LoginResult {
  success: boolean;
  requires2FA?: boolean;
  userId?: string;
  error?: string;
  message?: string;
}

export interface VerifyTwoFactorResult {
  success: boolean;
  error?: string;
  user?: User;
}

export interface SignupResult {
  success: boolean;
  error?: string;
  user?: User;
  message?: string;
}

export interface GoogleSignInResult {
  success: boolean;
  error?: string;
  user?: User;
}

// Note: signupAction now uses the robust API client with automatic fallback

/**
 * Action de login avec gestion complète du flux 2FA
 * 
 * @param data - Email, password et remember_me
 * @returns LoginResult avec success, requires2FA ou error
 */
export const loginAction = async (data: {
  email: string;
  password: string;
  remember_me?: boolean;
}): Promise<LoginResult> => {
  try {
    console.log('🚀 [AUTH-API] Tentative de connexion:', {
      email: data.email,
      remember_me: data.remember_me
    });

    const resp = await tryEndpoints<any>(
      '/api/auth/login',
      {
        method: 'POST',
        data: {
          email: data.email,
          password: data.password,
          remember_me: data.remember_me || false,
        },
        timeout: 30000,
      }
    );

    const result = resp.data;
    console.log('📨 [AUTH-API] Réponse du serveur:', result);

    if (resp.status >= 200 && resp.status < 300 && result.requires2FA) {
      console.log('📱 [AUTH-API] 2FA requis');
      return {
        success: true,
        requires2FA: true,
        userId: result.userId,
        message: result.message
      };
    } else if (resp.status >= 200 && resp.status < 300 && !result.requires2FA && result.accessToken) {
      // Connexion directe sans 2FA (cas Google OAuth ou utilisateur sans 2FA)
      console.log('✅ [AUTH-API] Connexion directe réussie (pas de 2FA)');
      await storeTokens(result.accessToken, result.refreshToken);
      if (result.user) {
        await storeUser(result.user);
      }

      return {
        success: true,
        requires2FA: false
      };
    } else {
      console.log('❌ [AUTH-API] Échec de connexion:', result.message);
      return {
        success: false,
        error: result.message || "Email ou mot de passe incorrect"
      };
    }
  } catch (error) {
    console.error('💥 [AUTH-API] Exception lors de la connexion:', error);
    return {
      success: false,
      error: 'Erreur de connexion. Vérifiez votre connexion internet et réessayez.'
    };
  }
};

/**
 * Action de vérification 2FA avec stockage des tokens
 * 
 * @param data - Email et code de vérification à 6 chiffres
 * @returns VerifyTwoFactorResult avec success, user ou error
 */
export const verifyTwoFactorAction = async (data: {
  userId: string;
  code: string;
  rememberMe?: boolean;
}): Promise<VerifyTwoFactorResult> => {
  try {
    console.log('🔐 [AUTH-API] Vérification du code 2FA pour userId:', data.userId);

    const resp = await tryEndpoints<any>(
      '/api/auth/verify-2fa',
      {
        method: 'POST',
        data: {
          userId: data.userId,
          code: data.code,
          rememberMe: data.rememberMe || false
        },
        timeout: 30000,
      }
    );

    const result = resp.data;
    console.log('📨 [AUTH-API] Réponse du serveur:', result);

    if (resp.status >= 200 && resp.status < 300 && result.access_token) {
      console.log('✅ [AUTH-API] 2FA vérifié avec succès');
      // Stocker les tokens
      await storeTokens(result.access_token, result.refresh_token);
      if (result.user) {
        await storeUser(result.user);
      }

      return {
        success: true,
        user: result.user,
      };
    } else {
      console.log('❌ [AUTH-API] Code invalide ou expiré');
      return {
        success: false,
        error: result.message || "Code de vérification invalide ou expiré"
      };
    }
  } catch (error) {
    console.error('💥 [AUTH-API] Exception lors de la vérification 2FA:', error);
    return {
      success: false,
      error: 'Erreur de connexion. Veuillez réessayer.'
    };
  }
};

/**
 * Action d'inscription d'un nouvel utilisateur
 * 
 * @param data - Nom, email, mot de passe et informations optionnelles
 * @returns SignupResult avec success, user ou error
 */
export const signupAction = async (data: {
  name: string;
  email: string;
  password: string;
  numtel?: string;
  date_naissance?: string;
}): Promise<SignupResult> => {
  // Validation côté client avant envoi
  if (!data.name || data.name.trim().length < 2) {
    return { success: false, error: 'Le nom doit contenir au moins 2 caractères' };
  }
  if (!data.password || data.password.length < 8) {
    return { success: false, error: 'Le mot de passe doit contenir au moins 8 caractères' };
  }
  if (!data.email || !data.email.includes('@')) {
    return { success: false, error: 'Email invalide' };
  }

  console.log('🚀 [AUTH-API] Tentative d\'inscription:', {
    name: data.name,
    email: data.email
  });
  try {
    const resp = await tryEndpoints<{ success: boolean; user?: any; message?: string }>(
      '/api/auth/register',
      {
        method: 'POST',
        data: {
          name: data.name,
          email: data.email,
          password: data.password,
          numtel: data.numtel || '',
          date_naissance: data.date_naissance || '',
        },
        timeout: 30000,
      }
    );

    const payload = resp.data;
    if (resp.status >= 200 && resp.status < 300 && payload?.success) {
      console.log('✅ [AUTH-API] Inscription réussie');
      return { success: true, user: payload.user };
    }

    const backendMessage = payload?.message || 'Une erreur s\'est produite';
    console.log('❌ [AUTH-API] Échec d\'inscription:', backendMessage);
    return { success: false, error: backendMessage };
  } catch (error: any) {
    const msg = error?.message?.includes('timeout')
      ? "Le serveur ne répond pas (délai dépassé)"
      : error?.message?.includes('Network')
        ? "Impossible de joindre le serveur"
        : 'Erreur de connexion';
    console.error('💥 [AUTH-API] Exception lors de l\'inscription:', error);
    return { success: false, error: msg };
  }
};

/**
 * Action de connexion avec Google
 * 
 * @param idToken - Google ID token obtenu depuis Expo Google Auth
 * @returns GoogleSignInResult avec success, user ou error
 */
export const googleSignInAction = async (idToken: string): Promise<GoogleSignInResult> => {
  try {
    console.log('🔐 [AUTH-API] Tentative de connexion Google');

    const resp = await tryEndpoints<any>(
      '/api/auth/google/mobile',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: { idToken },
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      const { access_token, refresh_token, user } = resp.data;

      console.log('✅ [AUTH-API] Connexion Google réussie:', user.email);

      // Stocker les tokens et les informations utilisateur
      await storeTokens(access_token, refresh_token);
      await storeUser(user);

      return {
        success: true,
        user: user
      };
    }

    const payload = resp.data;
    const backendMessage = payload?.message || 'Échec de l\'authentification Google';
    console.log('❌ [AUTH-API] Échec de connexion Google:', backendMessage);
    return { success: false, error: backendMessage };

  } catch (error: any) {
    const msg = error?.message?.includes('timeout')
      ? "Le serveur ne répond pas (délai dépassé)"
      : error?.message?.includes('Network')
        ? "Impossible de joindre le serveur"
        : 'Erreur de connexion Google';
    console.error('💥 [AUTH-API] Exception lors de la connexion Google:', error);
    return { success: false, error: msg };
  }
};
