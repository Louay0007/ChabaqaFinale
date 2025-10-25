import { Platform } from 'react-native';

/**
 * 🚀 Platform-Aware HTTP Client using Native Fetch
 * Works on Web, iOS, Android without any adapter issues
 */

// Base URLs to try in order (platform-specific)
const PRIMARY_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

// Build platform-specific fallback list
const BASE_URLS: string[] = (() => {
  const urls: string[] = [];
  
  // Add primary URL from env
  if (PRIMARY_BASE_URL) {
    urls.push(PRIMARY_BASE_URL);
  }
  
  // Platform-specific fallbacks
  if (Platform.OS === 'web') {
    // Web can use localhost directly
    urls.push('http://localhost:3000');
    urls.push('http://127.0.0.1:3000');
  } else if (Platform.OS === 'ios') {
    // iOS simulator can use localhost
    urls.push('http://localhost:3000');
    urls.push('http://127.0.0.1:3000');
  } else if (Platform.OS === 'android') {
    // Android emulator special IPs
    urls.push('http://10.0.2.2:3000');
    urls.push('http://10.0.3.2:3000');
    urls.push('http://localhost:3000');
  }
  
  // Remove duplicates
  return [...new Set(urls)];
})();

console.log('🌐 [HTTP] Platform:', Platform.OS);
console.log('🌐 [HTTP] Will try endpoints:', BASE_URLS);

// Response interface
interface HttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

// Request config interface
interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  data?: any;
  timeout?: number;
}

function joinUrl(base: string, path: string): string {
  if (!path) return base;
  const b = base.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}`;
}

/**
 * Fetch with timeout using AbortController
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number = 30000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
}

/**
 * Try sending request against multiple base URLs with fallback
 */
export async function tryEndpoints<T = any>(
  path: string,
  config: RequestConfig = {}
): Promise<HttpResponse<T>> {
  let lastError: any;
  const startTime = Date.now();
  const method = config.method || 'GET';

  console.log(`🚀 [HTTP] Trying to ${method} ${path}`);
  console.log(`🚀 [HTTP] Will attempt ${BASE_URLS.length} endpoint(s)`);

  for (let i = 0; i < BASE_URLS.length; i++) {
    const base = BASE_URLS[i];
    const url = joinUrl(base, path);
    
    try {
      console.log(`🎯 [HTTP] Attempt ${i + 1}/${BASE_URLS.length}: ${url}`);
      
      // Prepare fetch options
      const fetchOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(config.headers || {}),
        },
      };

      // Add body for POST/PUT/PATCH
      if (config.data && ['POST', 'PUT', 'PATCH'].includes(method)) {
        fetchOptions.body = JSON.stringify(config.data);
      }

      // Make request with timeout
      const response = await fetchWithTimeout(
        url,
        fetchOptions,
        config.timeout || 30000
      );

      const elapsed = Date.now() - startTime;
      console.log(`✅ [HTTP] SUCCESS with ${base} in ${elapsed}ms - Status: ${response.status}`);

      // Parse response
      let data: T;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text() as any;
      }

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };
      
    } catch (error: any) {
      lastError = error;
      const message = error?.message || 'Unknown error';
      
      console.log(`❌ [HTTP] ${url} failed:`);
      console.log(`   Message: ${message}`);

      // Only try next base on network/timeout errors
      const isTimeout = /timeout/i.test(message) || error.name === 'AbortError';
      const isNetwork = /fetch|network|connection/i.test(message);

      if (!isTimeout && !isNetwork && error.status) {
        // Got a server response (4xx/5xx). Stop here.
        console.log(`⚠️ [HTTP] Got server response (${error.status}), stopping fallback`);
        throw error;
      }
      
      if (i < BASE_URLS.length - 1) {
        console.log(`🔄 [HTTP] Trying next endpoint...`);
      }
    }
  }

  // If we reach here, all attempts failed
  console.log(`💥 [HTTP] All ${BASE_URLS.length} endpoints failed`);
  throw lastError ?? new Error('All endpoints failed');
}

// Convenience methods
export const http = {
  get: <T = any>(path: string, config?: RequestConfig) => 
    tryEndpoints<T>(path, { ...config, method: 'GET' }),
    
  post: <T = any>(path: string, data?: any, config?: RequestConfig) => 
    tryEndpoints<T>(path, { ...config, method: 'POST', data }),
    
  put: <T = any>(path: string, data?: any, config?: RequestConfig) => 
    tryEndpoints<T>(path, { ...config, method: 'PUT', data }),
    
  delete: <T = any>(path: string, config?: RequestConfig) => 
    tryEndpoints<T>(path, { ...config, method: 'DELETE' }),
};

export default http;
