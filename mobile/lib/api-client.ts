/**
 * 🚀 Robust API Client
 * 
 * Enhanced fetch wrapper with retry logic, timeout handling, and better error messages
 */

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.56.1:3000";

// Alternative endpoints to try if primary fails
const FALLBACK_ENDPOINTS = [
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.56.1:3000",
  "http://10.0.2.2:3000", // Android emulator
  "http://localhost:3000", // iOS simulator
];

interface FetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

/**
 * Enhanced fetch with timeout and abort controller
 */
async function fetchWithTimeout(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { timeout = 30000, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Robust API call with retry logic
 */
export async function robustFetch<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const {
    timeout = 30000,
    retries = 0, // No retries by default to avoid long waits
    retryDelay = 1000,
    ...fetchOptions
  } = options;

  const fullUrl = `${API_BASE_URL}${endpoint}`;
  
  console.log(`📡 [API-CLIENT] Request: ${fetchOptions.method || 'GET'} ${fullUrl}`);
  
  let lastError: any;
  
  // Try the request (with optional retries)
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`🔄 [API-CLIENT] Retry attempt ${attempt}/${retries}`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
      
      const startTime = Date.now();
      const response = await fetchWithTimeout(fullUrl, {
        ...fetchOptions,
        timeout,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
      });
      
      const responseTime = Date.now() - startTime;
      console.log(`📨 [API-CLIENT] Response: ${response.status} (${responseTime}ms)`);
      
      // Parse response
      let data: any;
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        try {
          data = await response.json();
          console.log(`📋 [API-CLIENT] Data:`, JSON.stringify(data, null, 2));
        } catch (parseError) {
          console.error('❌ [API-CLIENT] JSON parse error:', parseError);
          return {
            success: false,
            error: 'Réponse serveur invalide',
            statusCode: response.status,
          };
        }
      } else {
        const text = await response.text();
        console.log(`📄 [API-CLIENT] Text response:`, text.substring(0, 200));
        data = { message: text };
      }
      
      // Handle response
      if (response.ok) {
        return {
          success: true,
          data,
          statusCode: response.status,
        };
      } else {
        // Extract error message
        let errorMessage = 'Une erreur est survenue';
        
        if (data.message) {
          if (Array.isArray(data.message)) {
            errorMessage = data.message.join(', ');
          } else if (typeof data.message === 'string') {
            errorMessage = data.message;
          }
        } else if (data.error) {
          errorMessage = data.error;
        }
        
        return {
          success: false,
          error: errorMessage,
          data,
          statusCode: response.status,
        };
      }
      
    } catch (error: any) {
      lastError = error;
      console.error(`💥 [API-CLIENT] Attempt ${attempt + 1} failed:`, error.message);
      
      // Don't retry on certain errors
      if (error.name === 'AbortError' && attempt < retries) {
        continue; // Retry on timeout
      }
      
      if (error.message?.includes('Network request failed')) {
        // Network is down, no point retrying
        break;
      }
    }
  }
  
  // All attempts failed, return error
  let errorMessage = 'Erreur de connexion';
  
  if (lastError?.name === 'AbortError') {
    errorMessage = `Le serveur ne répond pas (délai dépassé après ${timeout/1000}s)`;
  } else if (lastError?.message?.includes('Network request failed')) {
    errorMessage = 'Impossible de joindre le serveur. Vérifiez votre connexion.';
  } else if (lastError?.message) {
    errorMessage = lastError.message;
  }
  
  return {
    success: false,
    error: errorMessage,
  };
}

/**
 * Try multiple endpoint URLs until one works
 */
export async function fetchWithFallback<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  console.log(`🔍 [API-CLIENT] Trying fallback endpoints for: ${endpoint}`);
  
  for (const baseUrl of FALLBACK_ENDPOINTS) {
    const fullUrl = `${baseUrl}${endpoint}`;
    console.log(`🎯 [API-CLIENT] Trying: ${fullUrl}`);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // Quick 10s timeout for fallback
      
      const response = await fetch(fullUrl, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        console.log(`✅ [API-CLIENT] Success with: ${baseUrl}`);
        const data = await response.json();
        
        return {
          success: true,
          data,
          statusCode: response.status,
        };
      }
      
      console.log(`❌ [API-CLIENT] Failed with ${baseUrl}: ${response.status}`);
      
    } catch (error: any) {
      console.log(`❌ [API-CLIENT] Failed with ${baseUrl}:`, error.message);
      continue;
    }
  }
  
  return {
    success: false,
    error: 'Aucun endpoint disponible. Vérifiez la configuration réseau.',
  };
}

/**
 * Convenience methods for common HTTP verbs
 */
export const apiClient = {
  get: <T = any>(endpoint: string, options: FetchOptions = {}) =>
    robustFetch<T>(endpoint, { ...options, method: 'GET' }),
    
  post: <T = any>(endpoint: string, body?: any, options: FetchOptions = {}) =>
    robustFetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
    
  put: <T = any>(endpoint: string, body?: any, options: FetchOptions = {}) =>
    robustFetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),
    
  delete: <T = any>(endpoint: string, options: FetchOptions = {}) =>
    robustFetch<T>(endpoint, { ...options, method: 'DELETE' }),
};

export { API_BASE_URL };
