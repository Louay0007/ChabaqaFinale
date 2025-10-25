import { login, storeTokens, storeUser, verifyTwoFactor, User } from './auth';
import { tryEndpoints } from './http';

// Types pour les résultats d'authentification
export interface LoginResult {
  success: boolean;
  requires2FA?: boolean;
  error?: string;
  email?: string;
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
    
    // Appel à la fonction login du module auth.ts
    const result = await login(data.email, data.password, data.remember_me || false);

    if (result.requires2FA) {
      console.log('📱 [AUTH-API] 2FA requis');
      return {
        success: true,
        requires2FA: true,
        email: data.email,
      };
    } else if (result.access_token && result.user) {
      // Les tokens sont déjà stockés par la fonction login()
      console.log('✅ [AUTH-API] Connexion directe réussie (pas de 2FA)');
      return { 
        success: true, 
        requires2FA: false 
      };
    } else {
      console.log('❌ [AUTH-API] Échec de connexion:', result.error);
      return { 
        success: false, 
        error: result.error || "Une erreur s'est produite" 
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
  email: string;
  verificationCode: string;
}): Promise<VerifyTwoFactorResult> => {
  try {
    console.log('🔐 [AUTH-API] Vérification du code 2FA pour:', data.email);
    
    const result = await verifyTwoFactor(data.email, data.verificationCode);

    if (result.access_token && result.user) {
      // Les tokens sont déjà stockés par la fonction verifyTwoFactor()
      console.log('✅ [AUTH-API] 2FA vérifié avec succès');
      return {
        success: true,
        user: result.user,
      };
    } else {
      console.log('❌ [AUTH-API] Échec de vérification 2FA:', result.error);
      return { 
        success: false, 
        error: result.error || 'Code de vérification invalide' 
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
