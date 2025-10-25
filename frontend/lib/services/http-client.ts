/**
 * HTTP Client Service
 * Handles all HTTP requests with automatic token refresh and error handling
 */

class HttpClient {
  private static instance: HttpClient
  private baseUrl: string

  private constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
  }

  static getInstance(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient()
    }
    return HttpClient.instance
  }

  /**
   * Generic fetch wrapper with automatic token refresh
   */
  async fetch<T = any>(
    endpoint: string,
    options?: RequestInit
  ): Promise<{ data: T; success: boolean; message?: string }> {
    const url = `${this.baseUrl}${endpoint}`
    
    const config: RequestInit = {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    }

    try {
      let response = await fetch(url, config)

      // If we get a 401, try to refresh the token
      if (response.status === 401) {
        const refreshResponse = await this.refreshToken()

        if (refreshResponse.ok) {
          // Retry the original request with refreshed token
          response = await fetch(url, config)
        } else {
          // If refresh fails, redirect to login
          if (typeof window !== "undefined") {
            window.location.href = "/signin"
          }
          throw new Error("Authentication failed")
        }
      }

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || `HTTP Error: ${response.status}`)
      }

      return result
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error)
      throw error
    }
  }

  /**
   * Fetch with FormData (for file uploads)
   */
  async fetchFormData<T = any>(
    endpoint: string,
    formData: FormData,
    options?: RequestInit
  ): Promise<{ data: T; success: boolean; message?: string }> {
    const url = `${this.baseUrl}${endpoint}`

    const config: RequestInit = {
      credentials: "include",
      method: "POST",
      body: formData,
      ...options,
      headers: {
        // Don't set Content-Type for FormData, browser will set it with boundary
        ...options?.headers,
      },
    }

    try {
      let response = await fetch(url, config)

      if (response.status === 401) {
        const refreshResponse = await this.refreshToken()
        if (refreshResponse.ok) {
          response = await fetch(url, config)
        } else {
          if (typeof window !== "undefined") {
            window.location.href = "/signin"
          }
          throw new Error("Authentication failed")
        }
      }

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || `HTTP Error: ${response.status}`)
      }

      return result
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error)
      throw error
    }
  }

  /**
   * Refresh authentication token
   */
  private async refreshToken(): Promise<Response> {
    return fetch(`${this.baseUrl}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
  }

  /**
   * GET request
   */
  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<{ data: T; success: boolean; message?: string }> {
    const queryString = params ? `?${new URLSearchParams(this.cleanParams(params)).toString()}` : ""
    return this.fetch<T>(`${endpoint}${queryString}`, { method: "GET" })
  }

  /**
   * POST request
   */
  async post<T = any>(endpoint: string, data?: any): Promise<{ data: T; success: boolean; message?: string }> {
    return this.fetch<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  /**
   * PUT request
   */
  async put<T = any>(endpoint: string, data?: any): Promise<{ data: T; success: boolean; message?: string }> {
    return this.fetch<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  /**
   * PATCH request
   */
  async patch<T = any>(endpoint: string, data?: any): Promise<{ data: T; success: boolean; message?: string }> {
    return this.fetch<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  /**
   * DELETE request
   */
  async delete<T = any>(endpoint: string): Promise<{ data: T; success: boolean; message?: string }> {
    return this.fetch<T>(endpoint, { method: "DELETE" })
  }

  /**
   * POST with FormData
   */
  async postFormData<T = any>(endpoint: string, formData: FormData): Promise<{ data: T; success: boolean; message?: string }> {
    return this.fetchFormData<T>(endpoint, formData, { method: "POST" })
  }

  /**
   * Clean params - remove undefined/null values
   */
  private cleanParams(params: Record<string, any>): Record<string, string> {
    const cleaned: Record<string, string> = {}
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        cleaned[key] = String(value)
      }
    })
    return cleaned
  }
}

export const httpClient = HttpClient.getInstance()
