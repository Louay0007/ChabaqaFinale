"use client"

import { useAuth as useAuthContext } from "@/context/auth-context"

export interface User {
  sub: string
  email: string
  name?: string
  role?: string
  iat?: number
  exp?: number
}

export const useAuth = () => {
  return useAuthContext()
}