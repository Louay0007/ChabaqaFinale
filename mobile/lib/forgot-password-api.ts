import { tryEndpoints } from './http';

interface ForgotPasswordResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function forgotPasswordAction(data: { email: string }): Promise<ForgotPasswordResult> {
  try {
    console.log('🔄 Envoi de la demande de reset password pour:', data.email);
    
    const resp = await tryEndpoints<{ success: boolean; message?: string; error?: string }>(
      '/api/auth/forgot-password',
      {
        method: 'POST',
        data: { email: data.email },
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    console.log('📡 Réponse reçue, status:', resp.status);
    const result = resp.data;
    console.log('📦 Données reçues:', result);

    if (resp.status >= 200 && resp.status < 300 && result.success) {
      console.log('✅ Demande de reset envoyée avec succès');
      return { 
        success: true, 
        message: result.message || 'Code de vérification envoyé par email'
      };
    } else if (resp.status >= 500) {
      // Server error - likely email configuration issue
      console.log('🚨 Erreur serveur (email):', result.error);
      return { 
        success: false, 
        error: 'Service email temporairement indisponible. Contactez le support si le problème persiste.'
      };
    } else {
      console.log('❌ Erreur dans la réponse:', result.error);
      return { 
        success: false, 
        error: result.error || result.message || "Une erreur s'est produite" 
      };
    }
  } catch (error: any) {
    console.error('💥 Erreur de connexion:', error);
    const isNetworkError = error?.message?.includes('Network') || 
                           error?.message?.includes('timeout') || 
                           error?.message?.includes('ECONNREFUSED');
    
    return { 
      success: false, 
      error: isNetworkError 
        ? "Impossible de joindre le serveur. Vérifiez votre connexion." 
        : "Erreur de connexion. Veuillez réessayer."
    };
  }
}

interface ResetPasswordResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function resetPasswordAction(data: {
  email: string;
  verificationCode: string;
  newPassword: string;
}): Promise<ResetPasswordResult> {
  try {
    console.log('🔄 Reset du mot de passe pour:', data.email);
    
    const resp = await tryEndpoints<{ success: boolean; message?: string; error?: string }>(
      '/api/auth/reset-password',
      {
        method: 'POST',
        data: {
          email: data.email,
          verificationCode: data.verificationCode,
          newPassword: data.newPassword,
        },
        timeout: 30000,
      }
    );

    console.log('📡 Réponse reçue, status:', resp.status);
    const result = resp.data;
    console.log('📦 Données reçues:', result);

    if (resp.status >= 200 && resp.status < 300 && result.success) {
      console.log('✅ Mot de passe reseté avec succès');
      return { 
        success: true, 
        message: result.message 
      };
    } else {
      console.log('❌ Erreur dans la réponse:', result.error);
      return { 
        success: false, 
        error: result.error || "Une erreur s'est produite" 
      };
    }
  } catch (error: any) {
    console.error('💥 Erreur de connexion:', error);
    return { 
      success: false, 
      error: "Erreur de connexion. Veuillez réessayer." 
    };
  }
}
