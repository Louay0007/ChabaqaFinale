"use server"

import { cookies } from "next/headers"
import { authApi } from "@/lib/api"

interface LoginResult {
  success: boolean
  error?: string
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
    const loginUrl = `${apiBase}/auth/login`

    const res = await fetch(loginUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        remember_me: !!data.remember_me,
      })
    })

    const json = await res.clone().json().catch(() => null)

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
      return { success: true }
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


export async function logoutAction(): Promise<{ success: boolean; error?: string; redirectTo?: string }> {
  console.log('LOGOUT ACTION - Starting logout');
  let cookieStore: any = null;
  
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
    const revokeUrl = `${apiBase}/auth/revoke-all-tokens`
    const logoutUrl = `${apiBase}/auth/logout`
    
    // Get cookies
    cookieStore = await cookies()
    const accessToken = cookieStore.get('accessToken')?.value
    const refreshToken = cookieStore.get('refreshToken')?.value
    
    console.log('LOGOUT ACTION - Tokens present:', { access: !!accessToken, refresh: !!refreshToken });

    // 1. Call backend logout endpoint (highest priority)
    let logoutSuccess = false
    try {
      const headers: any = { "Content-Type": "application/json" }
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`
      }
      
      console.log('LOGOUT ACTION - Calling logout endpoint');
      const logoutResponse = await fetch(logoutUrl, {
        method: "POST",
        credentials: "include",
        headers,
        cache: 'no-store'
      })
      
      console.log('LOGOUT ACTION - Logout response status:', logoutResponse.status);
      logoutSuccess = logoutResponse.ok
      
      if (!logoutSuccess) {
        const errorData = await logoutResponse.json().catch(() => ({}))
        console.warn('LOGOUT ACTION - Logout failed:', errorData)
      }
    } catch (error) {
      console.warn("LOGOUT ACTION - Failed to call logout endpoint:", error)
    }

    // 2. Call backend revoke-all-tokens to invalidate all sessions
    try {
      const headers: any = { "Content-Type": "application/json" }
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`
      }
      
      console.log('LOGOUT ACTION - Calling revoke-all-tokens');
      const revokeResponse = await fetch(revokeUrl, {
        method: "POST",
        credentials: "include",
        headers,
        cache: 'no-store'
      })
      
      console.log('LOGOUT ACTION - Revoke response status:', revokeResponse.status);
      
      if (!revokeResponse.ok) {
        const errorData = await revokeResponse.json().catch(() => ({}))
        console.warn('LOGOUT ACTION - Revoke failed:', errorData)
      }
    } catch (error) {
      console.warn("LOGOUT ACTION - Failed to revoke tokens:", error)
    }

    // 3. Clear Next.js server cookies with proper sameSite config
    console.log('LOGOUT ACTION - Clearing server cookies');
    const sameSiteValue = process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
    const cookieConfig = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: sameSiteValue as 'strict' | 'lax',
      maxAge: 0
    }
    
    cookieStore.set('accessToken', '', cookieConfig)
    cookieStore.set('refreshToken', '', cookieConfig)
    
    // Also clear legacy cookie names
    cookieStore.set('access_token', '', cookieConfig)
    cookieStore.set('refresh_token', '', cookieConfig)

    console.log('LOGOUT ACTION - Logout completed successfully');
    
    // Redirect to home page after successful logout
    if (typeof window === 'undefined') {
      // Server-side redirect
      return { success: true, redirectTo: '/' }
    }
    
    return { success: true }
  } catch (error: any) {
    console.error("LOGOUT ACTION - Unexpected error:", error)

    // Ensure cookies are cleared even if something fails
    try {
      if (!cookieStore) {
        cookieStore = await cookies()
      }
      
      const sameSiteValue = process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
      const cookieConfig = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: sameSiteValue as 'strict' | 'lax',
        maxAge: 0
      }
      
      cookieStore.set('accessToken', '', cookieConfig)
      cookieStore.set('refreshToken', '', cookieConfig)
      cookieStore.set('access_token', '', cookieConfig)
      cookieStore.set('refresh_token', '', cookieConfig)
      
      console.log('LOGOUT ACTION - Cookies cleared despite error');
    } catch (cookieError) {
      console.error('LOGOUT ACTION - Failed to clear cookies:', cookieError)
    }

    // Return success anyway since we cleared cookies
    if (typeof window === 'undefined') {
      return { success: true, redirectTo: '/' }
    }
    return { success: true }
  }
}
