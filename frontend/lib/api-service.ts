"use client"

import { User } from "@/lib/models"

// API service for handling all authenticated requests
class APIService {
  private static instance: APIService
  private baseUrl: string

  private constructor() {
    // Use environment variable or fallback to localhost
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
  }

  static getInstance(): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService()
    }
    return APIService.instance
  }

  // Generic fetch wrapper with automatic token refresh
  async fetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
    const url = typeof input === "string" ? `${this.baseUrl}${input}` : input
    const config = {
      credentials: "include" as RequestCredentials,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
      ...init,
    }

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
      }
    }

    return response
  }

  // Authentication endpoints
  async login(email: string, password: string, remember_me: boolean = false): Promise<{
    success: boolean
    requires2FA?: boolean
    access_token?: string
    refresh_token?: string
    user?: User
    error?: string
    message?: string
  }> {
    try {
      const response = await this.fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, remember_me }),
      })

      const result = await response.json()

      if (response.ok) {
        return { success: true, ...result }
      } else {
        return { success: false, error: result.message || "Login failed" }
      }
    } catch (error) {
      return { success: false, error: "Network error occurred" }
    }
  }

  async verify2FA(email: string, verificationCode: string): Promise<{
    success: boolean
    access_token?: string
    refresh_token?: string
    user?: User
    error?: string
    message?: string
  }> {
    try {
      const response = await this.fetch("/api/auth/verify-2fa", {
        method: "POST",
        body: JSON.stringify({ email, verificationCode }),
      })

      const result = await response.json()

      if (response.ok) {
        return { success: true, ...result }
      } else {
        return { success: false, error: result.message || "2FA verification failed" }
      }
    } catch (error) {
      return { success: false, error: "Network error occurred" }
    }
  }

  async refreshToken(): Promise<Response> {
    return this.fetch("/api/auth/refresh", {
      method: "POST",
    })
  }

  async logout(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await this.fetch("/api/auth/logout", {
        method: "POST",
      })

      if (response.ok) {
        return { success: true }
      } else {
        const result = await response.json()
        return { success: false, error: result.message || "Logout failed" }
      }
    } catch (error) {
      return { success: false, error: "Network error occurred" }
    }
  }

  async getProfile(): Promise<{ user: User | null; error?: string }> {
    try {
      const response = await this.fetch("/api/auth/me", {
        method: "GET",
      })

      if (response.ok) {
        const data = await response.json()
        return { user: data.user }
      } else {
        return { user: null, error: "Failed to get profile" }
      }
    } catch (error) {
      return { user: null, error: "Network error occurred" }
    }
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await this.fetch("/api/user/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        return { success: true, message: result.message }
      } else {
        return { success: false, error: result.message || "Failed to send reset code" }
      }
    } catch (error) {
      return { success: false, error: "Network error occurred" }
    }
  }

  async resetPassword(email: string, verificationCode: string, newPassword: string): Promise<{ 
    success: boolean; 
    message?: string; 
    error?: string 
  }> {
    try {
      const response = await this.fetch("/api/user/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, verificationCode, newPassword }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        return { success: true, message: result.message }
      } else {
        return { success: false, error: result.message || "Failed to reset password" }
      }
    } catch (error) {
      return { success: false, error: "Network error occurred" }
    }
  }

  async googleLogin(): Promise<void> {
    // Redirect to Google OAuth endpoint
    window.location.href = `${this.baseUrl}/api/auth/google`
  }
}

export const apiService = APIService.getInstance()
