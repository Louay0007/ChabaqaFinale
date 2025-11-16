"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import { api, type User } from "@/lib/api"
import { getProfile } from "@/lib/auth"
import { logoutAction } from "@/app/(auth)/signin/actions"
import { tokenManager } from "@/lib/token-manager"
import { secureStorage } from "@/lib/secure-storage"

interface AuthContextValue {
  user: User | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  register: (payload: { name: string; email: string; password: string; numtel?: string; date_naissance?: string }) => Promise<void>
  login: (payload: { email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  fetchMe: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const isAuthenticated = !!user

  const fetchMe = useCallback(async () => {
    try {
      setError(null)
      const user = await getProfile();
      setUser(user);
    } catch (e: any) {
      setUser(null)
      // Only set error if it's not an authentication error (401)
      if (e?.statusCode !== 401) {
        setError(e?.message || 'Failed to fetch user profile')
      }
    }
  }, [])

  const register = useCallback(async (payload: { name: string; email: string; password: string; numtel?: string; date_naissance?: string }) => {
    try {
      setError(null)
      await api.auth.register(payload)
      await fetchMe()
    } catch (e: any) {
      setError(e?.message || 'Registration failed')
      throw e
    }
  }, [fetchMe])

  const login = useCallback(async (payload: { email: string; password: string }) => {
    try {
      setError(null)
      await api.auth.login(payload)
      await fetchMe()
    } catch (e: any) {
      setError(e?.message || 'Login failed')
      throw e
    }
  }, [fetchMe])

  const logout = useCallback(async () => {
    try {
      // Call server action to logout and clear cookies
      await logoutAction();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state
      setUser(null);
      
      // Clear token manager
      tokenManager.clearTokens();
      
      // Clear secure storage
      secureStorage.clear();
      
      // Redirect to home page
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  }, [])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      await fetchMe()
      if (mounted) {
        setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [fetchMe])

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    fetchMe,
  }), [user, loading, error, isAuthenticated, register, login, logout, fetchMe])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider")
  return ctx
}
