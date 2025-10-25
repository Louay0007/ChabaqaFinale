"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { User as UserModel } from "@/lib/models"

export type Role = 'user' | 'creator';

export interface User extends Omit<UserModel, 'role'> {
  role: Role
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (userData: User) => void
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
  initialUser?: User | null
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser || null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const login = useCallback(async (userData: User) => {
    setUser(userData)
    if (userData.role === 'creator') {
      if (typeof window !== 'undefined') window.location.href = '/creator/dashboard'
    } else {
      if (typeof window !== 'undefined') window.location.href = '/' // Fallback to root until correct user page is confirmed
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      // Call backend logout endpoint
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.error("Error during logout:", error)
    } finally {
      setUser(null)
      // No redirection, keep user on current page
    }
  }, [])

  const refreshUser = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Error refreshing user:", error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Check authentication status on mount
  useEffect(() => {
    if (!initialUser) {
      refreshUser()
    }
  }, [initialUser, refreshUser])

  // Token refresh interceptor
  useEffect(() => {
    const handleTokenRefresh = async () => {
      if (!user) return
      
      // Check if token is about to expire (15 minutes before expiration)
      // In a real implementation, you would decode the JWT and check its expiration
      // For now, we'll just refresh every hour
      const interval = setInterval(async () => {
        try {
          const response = await fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "include",
          })
          
          if (!response.ok) {
            // If refresh fails, logout user
            logout()
          }
        } catch (error) {
          console.error("Token refresh error:", error)
          logout()
        }
      }, 60 * 60 * 1000) // Every hour
      
      return () => clearInterval(interval)
    }
    
    handleTokenRefresh()
  }, [user, logout])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
