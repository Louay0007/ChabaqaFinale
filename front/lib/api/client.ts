// API Response types
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  timestamp?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  message: string;
  statusCode: number;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// API Client Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private baseURL: string;
  private refreshPromise: Promise<Response | null> | null = null;
  private isRefreshing: boolean = false;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'An error occurred',
        statusCode: response.status,
      }));
      throw error;
    }
    return response.json();
  }

  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(`${this.baseURL}${endpoint}`);
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, String(params[key]));
        }
      });
    }
    return url.toString();
  }

  private getHeaders(isFormData: boolean = false): HeadersInit {
    const headers: HeadersInit = {};
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  }

  // Generic HTTP methods
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = this.buildUrl(endpoint, params);
    const doRequest = async () => fetch(url, { method: 'GET', headers: this.getHeaders(), credentials: 'include' });
    let response = await doRequest();
    if (response.status === 401) {
      await this.tryRefreshToken();
      response = await doRequest();
    }
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const doRequest = async () => fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST', headers: this.getHeaders(), credentials: 'include', body: data ? JSON.stringify(data) : undefined,
    });
    let response = await doRequest();
    if (response.status === 401) {
      await this.tryRefreshToken();
      response = await doRequest();
    }
    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    const doRequest = async () => fetch(`${this.baseURL}${endpoint}`, {
      method: 'PATCH', headers: this.getHeaders(), credentials: 'include', body: data ? JSON.stringify(data) : undefined,
    });
    let response = await doRequest();
    if (response.status === 401) {
      await this.tryRefreshToken();
      response = await doRequest();
    }
    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const doRequest = async () => fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT', headers: this.getHeaders(), credentials: 'include', body: data ? JSON.stringify(data) : undefined,
    });
    let response = await doRequest();
    if (response.status === 401) {
      await this.tryRefreshToken();
      response = await doRequest();
    }
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const doRequest = async () => fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE', headers: this.getHeaders(), credentials: 'include',
    });
    let response = await doRequest();
    if (response.status === 401) {
      await this.tryRefreshToken();
      response = await doRequest();
    }
    return this.handleResponse<T>(response);
  }

  // File upload
  async uploadFile<T>(endpoint: string, file: File): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const doRequest = async () => fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST', headers: this.getHeaders(true), credentials: 'include', body: formData,
    });
    let response = await doRequest();
    if (response.status === 401) {
      await this.tryRefreshToken();
      response = await doRequest();
    }
    return this.handleResponse<T>(response);
  }

  // Multiple file upload
  async uploadFiles<T>(endpoint: string, files: File[]): Promise<T> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(true),
      credentials: 'include',
      body: formData,
    });
    return this.handleResponse<T>(response);
  }

  // Token refresh logic (single-flight with better error handling)
  private async tryRefreshToken(): Promise<Response | null> {
    if (this.isRefreshing) {
      // Wait for ongoing refresh to complete
      while (this.isRefreshing) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return null; // Return null to retry the original request
    }

    if (this.refreshPromise) return this.refreshPromise;
    
    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        const res = await fetch(`${this.baseURL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        
        if (!res.ok) {
          // If refresh fails, redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/signin';
          }
          return null;
        }
        
        return res;
      } catch (error) {
        console.error('Token refresh failed:', error);
        // Redirect to login on network error
        if (typeof window !== 'undefined') {
          window.location.href = '/signin';
        }
        return null;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();
    
    return this.refreshPromise;
  }
}

export const apiClient = new ApiClient();
