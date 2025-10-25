"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"

// Validation schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
})

const verify2FASchema = z.object({
  email: z.string().email(),
  verificationCode: z.string().length(6, "Verification code must be 6 digits"),
})

interface LoginResult {
  success: boolean
  requires2FA?: boolean
  error?: string
}

interface VerifyTwoFactorResult {
  success: boolean
  user?: any
  error?: string
}

export async function loginAction(formData: { email: string; password: string }): Promise<LoginResult> {
  // Validate form data
  const validatedData = loginSchema.safeParse(formData)
  if (!validatedData.success) {
    const errors = validatedData.error.flatten().fieldErrors
    return { success: false, error: JSON.stringify(errors) }
  }

  const { email, password } = validatedData.data

  try {
    // Call backend login endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })

    const result = await response.json()

    if (response.ok) {
      if (result.requires2FA) {
        return { 
          success: true, 
          requires2FA: true
        }
      } else {
        // Stocker les tokens dans les cookies
        const cookieStore = cookies()
        ;(await cookieStore).set('access_token', result.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7 // 7 jours
        })
        
        if (result.refresh_token) {
          (await cookieStore).set('refresh_token', result.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30 // 30 jours
          })
        }

        return { 
          success: true,
          requires2FA: false
        }
      }
    } else {
      return { success: false, error: result.message || "Invalid email or password" }
    }
  } catch (error) {
    return { success: false, error: "Connection error. Please try again." }
  }
}

export async function verifyTwoFactorAction(formData: { email: string; verificationCode: string }): Promise<VerifyTwoFactorResult> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/auth/verify-2fa`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        verificationCode: formData.verificationCode,
      }),
    })

    const result = await response.json()

    if (response.ok && result.access_token) {
      // Stocker les tokens dans les cookies
      const cookieStore = cookies()
      ;(await cookieStore).set('access_token', result.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 jours
      })
      
      if (result.refresh_token) {
        (await cookieStore).set('refresh_token', result.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30 // 30 jours
        })
      }

      return { 
        success: true, 
        user: result.user 
      }
    } else {
      return { success: false, error: result.message || "Invalid verification code" }
    }
  } catch (error) {
    return { success: false, error: "Connection error. Please try again." }
  }
}

export async function logoutAction(): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value
    const refreshToken = cookieStore.get('refresh_token')?.value

    if (!accessToken && !refreshToken) {
      redirect("/signin")
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { "Authorization": `Bearer ${accessToken}` })
      },
      body: JSON.stringify({
        ...(refreshToken && { refresh_token: refreshToken })
      }),
    })

    // Supprimer les cookies
    cookieStore.delete('access_token')
    cookieStore.delete('refresh_token')
    
    redirect("/signin")
  } catch (error) {
    redirect("/signin")
  }
}
