"use server"

import { cookies } from "next/headers"
import { authApi } from "@/lib/api"

interface LoginResult {
  success: boolean
  requires2FA?: boolean
  error?: string
  email?: string
}

interface VerifyTwoFactorResult {
  success: boolean
  error?: string
  user?: {
    _id: string
    name: string
    email: string
    role: string
  }
}

export async function loginAction(data: { 
  email: string
  password: string
  remember_me?: boolean
}): Promise<LoginResult> {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
    const backendBase = apiBase.endsWith("/api") ? apiBase.slice(0, -4) : apiBase
    const primaryUrl = `${backendBase}/auth/login`
    const altUrl = `${backendBase}/api/auth/login`

    const doFetch = async (url: string) => fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        remember_me: !!data.remember_me,
      })
    })

    let res = await doFetch(primaryUrl)
    if (res.status === 404) {
      res = await doFetch(altUrl)
    }

    // Handle 2FA step indicator in JSON
    const json = await res.clone().json().catch(() => null)
    if (json?.requires2FA) {
      return { success: true, requires2FA: true, email: data.email }
    }

    // Propagate Set-Cookie headers from backend to browser via Next cookies()
    const setCookieHeaders: string[] = (res.headers as any).getSetCookie?.() || (res.headers.get('set-cookie') ? [res.headers.get('set-cookie') as string] : [])
    if (setCookieHeaders.length > 0) {
      const cookieStore: any = await cookies()
      // Clear old tokens to avoid mixing sessions
      cookieStore.delete('accessToken')
      cookieStore.delete('refreshToken')

      for (const sc of setCookieHeaders) {
        if (!sc) continue
        const first = sc.split(';')[0] || ''
        const [name, ...rest] = first.split('=')
        const value = rest.join('=')
        if (!name || typeof value !== 'string') continue
        if (name === 'accessToken' || name === 'refreshToken') {
          // Default 7d for access, 30d for refresh (backend will also enforce its own expiry)
          const maxAge = name === 'accessToken' ? (60 * 60 * 24 * 7) : (60 * 60 * 24 * 30)
          cookieStore.set(name, value, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge,
          })
        }
      }
    }

    // Also handle token-in-body backends
    if (json?.accessToken || json?.access_token || json?.data?.accessToken || json?.data?.access_token) {
      const access = json?.accessToken || json?.access_token || json?.data?.accessToken || json?.data?.access_token
      const refresh = json?.refreshToken || json?.refresh_token || json?.data?.refreshToken || json?.data?.refresh_token
      const cookieStore: any = await cookies()
      if (access) {
        cookieStore.set('accessToken', access, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: data.remember_me ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7
        })
      }
      if (refresh) {
        cookieStore.set('refreshToken', refresh, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30
        })
      }
    }

    if (res.ok && (json?.success !== false)) {
      return { success: true, requires2FA: false }
    }

    return { success: false, error: json?.message || "Login failed" }
  } catch (error: any) {
    console.error("Login error:", error)
    
    // Convert error to string safely
    const errorMessage = typeof error === 'string' 
      ? error 
      : (error?.message || error?.error || JSON.stringify(error) || "Connection error. Please try again.")
    const errText = typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage)

    if (errText.includes("401") || errText.includes("Invalid")) {
      return { success: false, error: "Invalid email or password" }
    } else if (errText.includes("404")) {
      return { success: false, error: "Account not found" }
    }
    
    return { success: false, error: errText }
  }
}

export async function verifyTwoFactorAction(data: {
  email: string
  verificationCode: string
}): Promise<VerifyTwoFactorResult> {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
    const backendBase = apiBase.endsWith("/api") ? apiBase.slice(0, -4) : apiBase
    const primaryUrl = `${backendBase}/auth/verify-2fa`
    const altUrl = `${backendBase}/api/auth/verify-2fa`
    let response = await fetch(primaryUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: data.email,
        verificationCode: data.verificationCode,
      }),
    })

    // If backend uses a global '/api' prefix, retry with that path on 404
    if (response.status === 404) {
      response = await fetch(altUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: data.email, verificationCode: data.verificationCode }),
      })
    }

    const result = await response.json()

    // If backend returns tokens, persist them; otherwise assume cookies were set server-side
    if (result?.accessToken || result?.access_token) {
      const cookieStore: any = await cookies()
      cookieStore.set('accessToken', result.accessToken || result.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7
      })
      if (result.refreshToken || result.refresh_token) {
        cookieStore.set('refreshToken', result.refreshToken || result.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30
        })
      }
    }

    if (response.ok && (result?.success !== false)) {
      return { success: true, user: result.user }
    }

    const err = typeof result === 'string' ? result : (result?.message || "Code de vérification invalide")
    return { success: false, error: err }
  } catch (error) {
    return { success: false, error: "Erreur de connexion. Veuillez réessayer." }
  }
}

export async function logoutAction(): Promise<{ success: boolean; error?: string }> {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
    const backendBase = apiBase.endsWith("/api") ? apiBase.slice(0, -4) : apiBase
    const revokeUrl = `${backendBase}/auth/revoke-all-tokens`
    const logoutUrl = `${backendBase}/auth/logout`

    // 1. Call backend revoke-all-tokens to invalidate all sessions
    try {
      await fetch(revokeUrl, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      })
    } catch (error) {
      console.warn("Failed to revoke tokens on backend:", error)
    }

    // 2. Call logout endpoint to clear session
    try {
      await fetch(logoutUrl, {
        method: "POST", 
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      })
    } catch (error) {
      console.warn("Failed to logout on backend:", error)
    }

    // 3. Clear Next.js server cookies
    const cookieStore: any = await cookies()
    cookieStore.delete('accessToken')
    cookieStore.delete('refreshToken')

    return { success: true }
  } catch (error: any) {
    console.error("Logout error:", error)
    
    // Even if backend calls fail, clear cookies locally
    const cookieStore: any = await cookies()
    cookieStore.delete('accessToken')
    cookieStore.delete('refreshToken')

    return { success: true } // Return success anyway since cookies are cleared
  }
}
