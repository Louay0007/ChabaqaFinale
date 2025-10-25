"use client"

import { apiService } from "./api-service"

import { User as UserModel } from "@/lib/models"

// Interface pour l'utilisateur basée sur votre JWT payload
export interface User extends UserModel {
  sub?: string // JWT subject identifier (optional for compatibility)
  iat?: number
  exp?: number
}

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
  const { user, error } = await apiService.getProfile()
  if (error) {
    console.error("Error getting profile:", error)
  }
  return user
}

// Fonction pour se déconnecter de manière sécurisée
export const logout = async (): Promise<void> => {
  const { success, error } = await apiService.logout()
  if (!success) {
    console.error("Error during logout:", error)
  }
  
  if (typeof window !== "undefined") {
    window.location.href = "/signin"
  }
}

// Fonction pour révoquer tous les tokens
export const revokeAllTokens = async (): Promise<boolean> => {
  // This would need to be implemented in the API service
  // For now, we'll just return false as it's not implemented
  return false
}

// Fonction pour faire des requêtes authentifiées (utilise automatiquement les cookies)
export const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  return apiService.fetch(url, options)
}

// Fonction utilitaire pour les requêtes POST authentifiées
export const authenticatedPost = async (url: string, data: any): Promise<Response> => {
  return apiService.fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

// Fonction utilitaire pour les requêtes GET authentifiées
export const authenticatedGet = async (url: string): Promise<Response> => {
  return apiService.fetch(url, {
    method: "GET",
  })
}
