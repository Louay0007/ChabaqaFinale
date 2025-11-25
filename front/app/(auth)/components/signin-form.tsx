"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, Shield, AlertCircle, CheckCircle } from "lucide-react"
import { loginAction, verify2FAAction, resend2FACodeAction } from "../signin/actions"
import { signInSchema, type SignInFormData } from "@/lib/validation/auth.validation"
import { TwoFactorVerification } from "@/components/auth/two-factor-verification"
import { useToast } from "@/hooks/use-toast"
import { useAuthContext } from "@/app/providers/auth-provider"

interface SignInFormProps {
  onSuccess?: () => void
}

export default function SignInForm({ onSuccess }: SignInFormProps = {}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [requires2FA, setRequires2FA] = useState(false)
  const [userIdFor2FA, setUserIdFor2FA] = useState("")
  const [rememberMeFor2FA, setRememberMeFor2FA] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { fetchMe } = useAuthContext()

  useEffect(() => {
    setIsLoaded(true)
    const message = searchParams.get("message")
    if (message) {
      setSuccessMessage(message)
    }
  }, [searchParams])

  // Role-based redirect helper (deprecated - using window.location instead)
  const redirectAfterAuth = async () => {
    // This function is no longer used - we use window.location directly in handleVerify2FA
  }

  // Deprecated: old profile slug redirect (kept for reference)
  const getProfileSlugUrl = () => `/explore`

  const validateForm = (): boolean => {
    setFieldErrors({})
    try {
      signInSchema.parse({ email, password, rememberMe })
      return true
    } catch (err: any) {
      const errors: Record<string, string> = {}
      if (err.errors) {
        err.errors.forEach((error: any) => {
          const path = error.path[0]
          errors[path] = error.message
        })
      }
      setFieldErrors(errors)
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const result = await loginAction({ email, password, remember_me: rememberMe })

      if (result.requires2FA && result.userId) {
        // 2FA is now mandatory - show verification form
        setUserIdFor2FA(result.userId)
        setRememberMeFor2FA(rememberMe)
        setRequires2FA(true)
        setIsLoading(false) // Stop loading to show 2FA form
      } else if (result.success) {
        await fetchMe()
        if (onSuccess) onSuccess()

        // Redirect based on role
        const role = result.role?.toLowerCase() || result.user?.role?.toLowerCase()

        if (role === 'creator') {
          window.location.href = '/creator/dashboard'
        } else if (role === 'admin') {
          window.location.href = '/admin'
        } else {
          window.location.href = '/explore'
        }
      } else {
        const errorMessage = result.error || "An unknown error occurred"
        setError(errorMessage)

        // Provide more helpful error messages based on common error patterns
        let title = "Sign In Failed"
        let description = errorMessage

        if (errorMessage.toLowerCase().includes('invalid') || errorMessage.toLowerCase().includes('wrong')) {
          title = "Invalid Credentials"
          description = "The email or password you entered is incorrect. Please check and try again."
        } else if (errorMessage.toLowerCase().includes('not found') || errorMessage.toLowerCase().includes('404')) {
          title = "Account Not Found"
          description = "No account found with this email address. Please check your email or create a new account."
        } else if (errorMessage.toLowerCase().includes('blocked') || errorMessage.toLowerCase().includes('suspended')) {
          title = "Account Suspended"
          description = "Your account has been temporarily suspended. Please contact support for assistance."
        } else if (errorMessage.toLowerCase().includes('verify') || errorMessage.toLowerCase().includes('email')) {
          title = "Email Not Verified"
          description = "Please verify your email address before signing in. Check your inbox for the verification link."
        }

        toast({
          variant: "destructive",
          title,
          description,
          duration: 6000,
        })
      }
    } catch (err) {
      const errorMessage = "Login failed. Please try again."
      setError(errorMessage)
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: errorMessage,
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }


  const handleVerify2FA = async (userId: string, code: string) => {
    setError("")
    try {
      const result = await verify2FAAction(userId, code, rememberMeFor2FA)
      if (result.success) {
        console.log('Login successful, redirecting');

        // Clear any existing auth state to prevent conflicts
        if (typeof window !== 'undefined') {
          // Clear any potential cached auth data
          localStorage.removeItem('auth_user')
          sessionStorage.removeItem('auth_user')
        }

        // Use window.location for hard redirect to ensure cookies are properly set
        if (onSuccess) {
          onSuccess();
        }

        // Wait for cookies to be properly set before checking role
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Check if we have user info from the 2FA response
        if (result.role) {
          const role = String(result.role).toLowerCase()
          if (role === 'creator') {
            window.location.href = '/creator/dashboard'
            return
          } else if (role === 'admin') {
            window.location.href = '/admin'
            return
          } else {
            window.location.href = '/explore'
            return
          }
        } else if (result.user?.role) {
          const role = String(result.user.role).toLowerCase()
          if (role === 'creator') {
            window.location.href = '/creator/dashboard'
            return
          } else if (role === 'admin') {
            window.location.href = '/admin'
            return
          } else {
            window.location.href = '/explore'
            return
          }
        }

        // If no role info from 2FA response, try to fetch it
        try {
          const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
          const res = await fetch(`${apiBase}/auth/me`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            cache: "no-store"
          })

          if (res.ok) {
            const json = await res.json().catch(() => null)
            const role = json?.data?.role || json?.user?.role || json?.role

            // Immediate role-based redirect
            if (String(role).toLowerCase() === 'creator') {
              window.location.href = '/creator/dashboard'
              return
            } else if (String(role).toLowerCase() === 'admin') {
              window.location.href = '/admin'
              return
            } else {
              window.location.href = '/explore'
              return
            }
          }
        } catch (roleError) {
          console.warn('Could not fetch user role immediately, using fallback redirect:', roleError)
        }

        // Final fallback: redirect based on rememberMe setting or default
        if (rememberMeFor2FA) {
          // If rememberMe was checked, assume creator (common for creators)
          window.location.href = '/creator/dashboard'
        } else {
          window.location.href = '/explore'
        }
      } else {
        const errorMessage = result.error || "Verification failed"
        setError(errorMessage)

        let title = "2FA Verification Failed"
        let description = errorMessage

        if (errorMessage.toLowerCase().includes('invalid') || errorMessage.toLowerCase().includes('wrong')) {
          description = "The verification code you entered is incorrect. Please check the code and try again."
        } else if (errorMessage.toLowerCase().includes('expired')) {
          description = "The verification code has expired. Please request a new code."
        }

        toast({
          variant: "destructive",
          title,
          description,
          duration: 5000,
        })
      }
    } catch (err) {
      const errorMessage = "An error occurred during verification."
      setError(errorMessage)
      toast({
        variant: "destructive",
        title: "Verification Error",
        description: "Unable to verify your code. Please check your internet connection and try again.",
        duration: 5000,
      })
    }
  }

  const handleResend2FA = async () => {
    if (!userIdFor2FA) return
    setError("")
    try {
      const result = await resend2FACodeAction(userIdFor2FA)
      if (result.success) {
        setSuccessMessage(result.message || "Code de vérification renvoyé par email.")
        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(""), 5000)
      } else {
        const errorMessage = result.error || "Échec du renvoi du code"
        setError(errorMessage)
        toast({
          variant: "destructive",
          title: "Code Resend Failed",
          description: "Unable to send a new verification code. Please wait a moment and try again, or contact support if the problem persists.",
          duration: 5000,
        })
      }
    } catch (err) {
      const errorMessage = "Une erreur s'est produite lors du renvoi du code."
      setError(errorMessage)
      toast({
        variant: "destructive",
        title: "Resend Error",
        description: "Unable to send a new verification code. Please check your internet connection and try again.",
        duration: 5000,
      })
    }
  }

  const handleGoogleLogin = () => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || ""
    // Backend base host (without trailing /api if present)
    const backendBase = apiBase.endsWith("/api") ? apiBase.slice(0, -4) : apiBase
    // For Google OAuth, redirect to signin page which will handle role-based redirection
    const redirect = encodeURIComponent("/signin")
    // If backend supports passing redirect query, include it
    const url = `${backendBase}/auth/google?redirect=${redirect}`
    window.location.href = url
  }

  if (requires2FA) {
    return (
      <TwoFactorVerification
        userId={userIdFor2FA}
        onVerify={handleVerify2FA}
        onResend={handleResend2FA}
        error={error}
        successMessage={successMessage}
      />
    )
  }


  return (
    <>
      {/* Login Card */}
      <div className="backdrop-blur-xl bg-white/25 border border-white/40 p-8 rounded-3xl shadow-2xl animate-fade-in-delay-600">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Success Message */}
          {successMessage && (
            <div className="p-4 bg-green-100/80 backdrop-blur-sm border border-green-200 rounded-2xl">
              <p className="text-green-700 text-sm">{successMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-100/80 backdrop-blur-sm border border-red-200 rounded-2xl">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2 animate-fade-in-delay-800">
            <Label htmlFor="email" className="text-sm font-medium text-gray-800 block">
              Email address
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' })
                }}
                placeholder="your@email.com"
                required
                disabled={isLoading}
                className={`w-full px-4 py-4 rounded-2xl border-2 transition-all duration-300 text-gray-900 placeholder-gray-500 bg-white/70 backdrop-blur-sm disabled:opacity-50 ${fieldErrors.email
                  ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-200'
                  : 'border-white/50 focus:border-[#86e4fd] focus:ring-4 focus:ring-[#86e4fd]/20'
                  }`}
              />
              {fieldErrors.email && (
                <div className="mt-1 flex items-center text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {fieldErrors.email}
                </div>
              )}
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2 animate-fade-in-delay-900">
            <Label htmlFor="password" className="text-sm font-medium text-gray-800 block">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: '' })
                }}
                placeholder="••••••••••"
                required
                disabled={isLoading}
                className={`w-full px-4 py-4 pr-12 rounded-2xl border-2 transition-all duration-300 text-gray-900 placeholder-gray-500 bg-white/70 backdrop-blur-sm disabled:opacity-50 ${fieldErrors.password
                  ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-200'
                  : 'border-white/50 focus:border-[#86e4fd] focus:ring-4 focus:ring-[#86e4fd]/20'
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#86e4fd] transition-colors duration-200 disabled:opacity-50"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
              {fieldErrors.password && (
                <div className="mt-1 flex items-center text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {fieldErrors.password}
                </div>
              )}
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center space-x-2 animate-fade-in-delay-950">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
              className="w-4 h-4 rounded border-gray-300 text-[#86e4fd] focus:ring-[#86e4fd]"
            />
            <Label htmlFor="rememberMe" className="text-sm text-gray-700 cursor-pointer">
              Remember me for 30 days
            </Label>
          </div>

          {/* Sign In Button */}
          <div className="animate-fade-in-delay-1000">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#8e78fb] to-[#47c7ea] text-white font-semibold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 border-0 relative overflow-hidden group hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  <span className="relative z-10">Sign In</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#7c66e9] to-[#3bb5d6] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </>
              )}
            </Button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/40" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-gray-600">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Login Button */}
          <div className="animate-fade-in-delay-1100">
            <Button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-white/50 text-gray-700 font-semibold text-lg shadow-lg hover:shadow-xl hover:border-[#86e4fd] transition-all duration-300 relative overflow-hidden group hover:bg-white/95 disabled:opacity-50"
            >
              <div className="flex items-center justify-center space-x-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continue with Google</span>
              </div>
            </Button>
          </div>
        </form>

        {/* Additional Links */}
        <div className="mt-8 text-center space-y-4 animate-fade-in-delay-1200">
          <Link
            href="/forgot-password"
            className="text-sm text-[#86e4fd] hover:text-[#74d4f0] font-medium transition-all duration-200 hover:underline block drop-shadow-sm"
          >
            Forgot your password?
          </Link>
          <div className="text-sm text-gray-700 drop-shadow-sm">
            New to Chabaqa?{" "}
            <Link
              href="/signup"
              className="text-[#86e4fd] hover:text-[#74d4f0] font-medium transition-all duration-200 hover:underline"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
