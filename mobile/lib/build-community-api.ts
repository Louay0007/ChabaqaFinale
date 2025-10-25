import { authenticatedPost } from './auth';

// Ce fichier n'est pas une route, mais une API utilitaire
// Pour Expo Router, on peut ajouter cette ligne pour éviter les avertissements
export const unstable_settings = {
  isNotARoute: true,
};

interface CommunityFormData {
  name: string;
  bio: string;
  country: string;
  status: string;
  joinFee: string;
  feeAmount: string;
  currency: string;
  socialLinks: {
    instagram: string;
    tiktok: string;
    facebook: string;
    youtube: string;
    linkedin: string;
    website: string;
  };
}

interface ApiResponse {
  success: boolean;
  error?: string;
  communityId?: string;
  message?: string;
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.180:3001";

export async function createCommunityAction(formData: CommunityFormData): Promise<ApiResponse> {
  try {
    console.log('🚀 Tentative de création de communauté:', { name: formData.name });
    console.log('📡 URL API:', `${API_BASE_URL}/community-aff-crea-join/create`);
    
    const response = await authenticatedPost(`${API_BASE_URL}/community-aff-crea-join/create`, formData);

    console.log('📨 Réponse reçue:', response.status);

    const data = await response.json();
    console.log('📋 Données reçues:', data);

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Erreur lors de la création de la communauté',
      };
    }

    return {
      success: true,
      communityId: data.communityId || data.id,
      message: data.message || 'Communauté créée avec succès',
    };
  } catch (error) {
    console.error('❌ Erreur lors de la création de la communauté:', error);
    return {
      success: false,
      error: 'Erreur de connexion. Veuillez réessayer.',
    };
  }
}

export async function uploadCommunityImage(imageUri: string): Promise<ApiResponse> {
  try {
    const accessToken = await import('./auth').then(auth => auth.getAccessToken());
    
    if (!accessToken) {
      return {
        success: false,
        error: 'Non authentifié. Veuillez vous connecter.',
      };
    }

    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'community-image.jpg',
    } as any);

    const response = await fetch(`${API_BASE_URL}/community-aff-crea-join/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Erreur lors de l\'upload de l\'image',
      };
    }

    return {
      success: true,
      message: data.imageUrl || 'Image uploadée avec succès',
    };
  } catch (error) {
    console.error('❌ Erreur lors de l\'upload de l\'image:', error);
    return {
      success: false,
      error: 'Erreur de connexion lors de l\'upload.',
    };
  }
}
