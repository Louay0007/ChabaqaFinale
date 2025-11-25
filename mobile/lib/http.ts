import { Platform } from 'react-native';
import PlatformUtils from './platform-utils';

/**
 * 🚀 Platform-Aware HTTP Client using Native Fetch
 * Works on Web, iOS, Android without any adapter issues
 */

// Use only the configured API URL from environment variable
const API_BASE_URL = PlatformUtils.getApiUrl();

if (__DEV__) {
  console.log(`🌐 [HTTP] Platform: ${PlatformUtils.getPlatformName()}`);
  console.log(`🌐 [HTTP] API Base URL: ${API_BASE_URL}`);
  console.log(`🌐 [HTTP] Full API URL will be: ${API_BASE_URL}/api/...`);
}

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
 * Send request to the configured API endpoint
 */
export async function tryEndpoints<T = any>(
  path: string,
  config: RequestConfig = {}
): Promise<HttpResponse<T>> {
  const startTime = Date.now();
  const method = config.method || 'GET';
  const url = joinUrl(API_BASE_URL, path);

  console.log(`🚀 [HTTP] ${method} ${url}`);

  try {
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
    console.log(`✅ [HTTP] SUCCESS in ${elapsed}ms - Status: ${response.status}`);

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
    const message = error?.message || 'Unknown error';
    const elapsed = Date.now() - startTime;

    console.log(`❌ [HTTP] ${url} failed after ${elapsed}ms:`);
    console.log(`   Message: ${message}`);

    throw error;
  }
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
