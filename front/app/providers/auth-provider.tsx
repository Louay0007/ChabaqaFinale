"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import { api, type User } from "@/lib/api"

interface AuthContextValue {
  user: User | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  register: (payload: { name: string; email: string; password: string; numtel?: string; date_naissance?: string }) => Promise<void>
  login: (payload: { email: string; password: string }) => Promise<{ requires2FA?: boolean } | void>
  verify2FA: (payload: { email: string; code: string }) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
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
      const res = await api.auth.me()
      setUser(res.data)
    } catch (e: any) {
      setUser(null)
    }
  }, [])

  const refresh = useCallback(async () => {
    try {
      await api.auth.refresh()
    } catch (e) {
      // ignore
    }
  }, [])

  const register = useCallback(async (payload: { name: string; email: string; password: string; numtel?: string; date_naissance?: string }) => {
    setError(null)
    const res = await api.auth.register(payload)
    if (res?.data?.user) {
      setUser(res.data.user)
    }
  }, [])

  const login = useCallback(async (payload: { email: string; password: string }) => {
    setError(null)
    const res = await api.auth.login(payload)
    const requires2FA = (res as any)?.data?.requires2FA
    if (requires2FA) {
      return { requires2FA: true }
    }
    await fetchMe()
  }, [fetchMe])

  const verify2FA = useCallback(async (payload: { email: string; code: string }) => {
    setError(null)
    if ((api as any)?.auth?.verify2FA) {
      await (api as any).auth.verify2FA(payload.email, payload.code)
      await fetchMe()
    }
  }, [fetchMe])

  const logout = useCallback(async () => {
    try {
      await api.auth.logout()
    } finally {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        await refresh()
      } finally {
        if (!mounted) return
        await fetchMe()
        setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [fetchMe, refresh])

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    error,
    isAuthenticated,
    register,
    login,
    verify2FA,
    logout,
    refresh,
    fetchMe,
  }), [user, loading, error, isAuthenticated, register, login, verify2FA, logout, refresh, fetchMe])

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
