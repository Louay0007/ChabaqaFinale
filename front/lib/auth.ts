"use client"

import { useEffect, useState } from "react"
import { authApi } from "@/lib/api"
import type { User } from "@/lib/api/types"

// Interface pour les réponses d'authentification
export interface AuthResponse {
  access_token?: string
  refresh_token?: string
  user?: User
  requires2FA?: boolean
  message?: string
  error?: string
}

// Fonction pour vérifier le profil utilisateur via cookies
export const getProfile = async (): Promise<User | null> => {
  try {
    // Clear localStorage tokens to prevent them from being used and causing auth issues
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      } catch (e) {}
    }

    const extractUser = (r: any): User | null => {
      if (!r) return null
      if (r.success && r.data) return r.data as User
      if (r.data?.user) return r.data.user as User
      if (r.user) return r.user as User
      return null
    }

    // Make sure we have debug info
    console.log("AUTH - getProfile - Trying to fetch current user");

    // First, try to refresh the token
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
    try { 
      console.log("AUTH - Refreshing token");
      await fetch(`${apiBase}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }); 
    } catch (e) {
      console.log("AUTH - Token refresh failed", e);
    }

    // Now fetch the user profile using cookies
    console.log("AUTH - Fetching user profile");
    const cookieRes = await fetch(`${apiBase}/auth/me`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      cache: "no-store"
    })

    if (cookieRes.ok) {
      const json = await cookieRes.json().catch(() => null)
      console.log("AUTH - Profile response:", json);
      const userFromCookie = extractUser(json)
      if (userFromCookie) return userFromCookie
    } else {
      console.log("AUTH - Profile fetch failed:", cookieRes.status);
    }
    
    return null
  } catch (error) {
    console.error("Error getting profile:", error)
    return null
  }
}

// Fonction pour rafraîchir le token via cookies
export const refreshToken = async (): Promise<boolean> => {
  try {
    const response = await authApi.refresh()
    
    if (response.success) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error("Error refreshing token:", error)
    return false
  }
}

// Fonction pour se déconnecter de manière sécurisée
export const logout = async (): Promise<void> => {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
    const backendBase = apiBase.endsWith("/api") ? apiBase.slice(0, -4) : apiBase
    
    // 1. Call backend revoke-all-tokens to invalidate all sessions
    try {
      await fetch(`${backendBase}/auth/revoke-all-tokens`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      })
    } catch (error) {
      console.warn("Failed to revoke tokens on backend:", error)
    }

    // 2. Call logout endpoint to clear session
    try {
      await fetch(`${backendBase}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      })
    } catch (error) {
      console.warn("Failed to logout on backend:", error)
    }

    // 3. Clear any localStorage tokens
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      } catch (error) {
        console.warn("Failed to clear localStorage:", error)
      }
    }
  } catch (error) {
    console.error("Error during logout:", error)
  } finally {
    if (typeof window !== "undefined") {
      window.location.href = "/signin"
    }
  }
}

// Fonction pour révoquer tous les tokens
export const revokeAllTokens = async (): Promise<boolean> => {
  try {
    const response = await fetch("/auth/revoke-all-tokens", {
      method: "POST",
      credentials: "include",
    })

    return response.ok
  } catch (error) {
    console.error("Error revoking all tokens:", error)
    return false
  }
}

// Hook pour vérifier si l'utilisateur est authentifié via cookies
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const profile = await getProfile()
      setUser(profile)
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  return { user, isLoading, setUser }
}

// Fonction pour faire des requêtes authentifiées (utilise automatiquement les cookies)
export const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const defaultOptions: RequestInit = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    },
    ...options,
  }

  let response = await fetch(url, defaultOptions)

  // Si le token est expiré (401), essayer de le rafraîchir automatiquement
  if (response.status === 401) {
    const refreshSuccess = await refreshToken()
    if (refreshSuccess) {
      // Retry la requête originale avec le nouveau token
      response = await fetch(url, defaultOptions)
    }
  }

  return response
}

// Fonction utilitaire pour les requêtes POST authentifiées
export const authenticatedPost = async (url: string, data: any): Promise<Response> => {
  return authenticatedFetch(url, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

// Fonction utilitaire pour les requêtes GET authentifiées
export const authenticatedGet = async (url: string): Promise<Response> => {
  return authenticatedFetch(url, {
    method: "GET",
  })
}
