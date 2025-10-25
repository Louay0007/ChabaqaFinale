"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, Shield } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { apiService } from "@/lib/api-service"
import { User } from "@/context/auth-context"

interface SignInFormProps {
  onSuccess?: () => void
}

export default function SignInForm({ onSuccess }: SignInFormProps = {}) {
  const { login: setAuthUser } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isRequestingCode, setIsRequestingCode] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [showTwoFactor, setShowTwoFactor] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    setIsLoaded(true)
    const message = searchParams.get("message")
    if (message) {
      setSuccessMessage(message)
    }
  }, [searchParams])

  // Récupérer l'URL de redirection depuis les paramètres d'URL
  const redirectUrl = searchParams.get("redirect") || "/"

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsRequestingCode(true)
    setError("")

    try {
      const result = await apiService.login(email, password)

      if (result.success && result.requires2FA) {
        setShowTwoFactor(true)
        setSuccessMessage("Code de vérification envoyé par email")
      } else if (result.success && result.user) {
        setAuthUser(result.user as User)
        if (onSuccess) {
          onSuccess()
        } else {
          router.push(redirectUrl)
        }
      } else {
        setError(result.error || "Une erreur s'est produite")
      }
    } catch (error) {
      setError("Erreur de connexion. Veuillez réessayer.")
    } finally {
      setIsRequestingCode(false)
    }
  }

  const handleTwoFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await apiService.verify2FA(email, verificationCode)

      if (result.success && result.user) {
        setAuthUser(result.user as User)
        if (onSuccess) {
          onSuccess()
        } else {
          router.push(redirectUrl)
        }
      } else {
        setError(result.error || "Code de vérification invalide")
      }
    } catch (error) {
      setError("Erreur de connexion. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToCredentials = () => {
    setShowTwoFactor(false)
    setVerificationCode("")
    setError("")
    setSuccessMessage("")
  }

  const handleGoogleLogin = async () => {
    try {
      await apiService.googleLogin()
    } catch (error) {
      setError("Erreur de connexion Google. Veuillez réessayer.")
    }
  }

  return (
    <>
      {/* Header Message */}
      <div className="text-center mb-8 animate-fade-in-delay-400">
        {showTwoFactor && (
          <>
       
            <div className="w-16 h-16 bg-gradient-to-r from-[#8e78fb] to-[#47c7ea] rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 drop-shadow-sm">Check your email</h2>
            <p className="text-gray-700 drop-shadow-sm">
              We've sent a verification code to <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-600 mt-2 drop-shadow-sm">The code will expire in 10 minutes.</p>
          </>
        )}
      </div>

      {/* Login Card */}
      <div className="backdrop-blur-xl bg-white/25 border border-white/40 p-8 rounded-3xl shadow-2xl animate-fade-in-delay-600">
        {!showTwoFactor ? (
          <form onSubmit={handleInitialSubmit} className="space-y-6">
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
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={isRequestingCode}
                  className="w-full px-4 py-4 rounded-2xl border-2 border-white/50 focus:border-[#86e4fd] focus:ring-4 focus:ring-[#86e4fd]/20 transition-all duration-300 text-gray-900 placeholder-gray-500 bg-white/70 backdrop-blur-sm disabled:opacity-50"
                />
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
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  disabled={isRequestingCode}
                  className="w-full px-4 py-4 rounded-2xl border-2 border-white/50 focus:border-[#86e4fd] focus:ring-4 focus:ring-[#86e4fd]/20 transition-all duration-300 text-gray-900 placeholder-gray-500 bg-white/70 backdrop-blur-sm disabled:opacity-50"
                />
              </div>
            </div>

            {/* Continue Button */}
            <div className="animate-fade-in-delay-1000">
              <Button
                type="submit"
                disabled={isRequestingCode}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#8e78fb] to-[#47c7ea] text-white font-semibold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 border-0 relative overflow-hidden group hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isRequestingCode ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    <span>Sending Code...</span>
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
                disabled={isRequestingCode}
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
        ) : (
          <form onSubmit={handleTwoFactorSubmit} className="space-y-6">
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

            {/* Verification Code Field */}
            <div className="space-y-2">
              <Label htmlFor="verificationCode" className="text-sm font-medium text-gray-800 block">
                Verification Code
              </Label>
              <div className="relative">
                <Input
                  id="verificationCode"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="123456"
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-4 rounded-2xl border-2 border-white/50 focus:border-[#86e4fd] focus:ring-4 focus:ring-[#86e4fd]/20 transition-all duration-300 text-gray-900 placeholder-gray-500 bg-white/70 backdrop-blur-sm disabled:opacity-50 text-center text-2xl tracking-widest"
                  maxLength={6}
                />
              </div>
            </div>

            {/* Sign In Button */}
            <div>
              <Button
                type="submit"
                disabled={isLoading || verificationCode.length !== 6}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#8e78fb] to-[#47c7ea] text-white font-semibold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 border-0 relative overflow-hidden group hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span className="relative z-10">Sign In Securely</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#7c66e9] to-[#3bb5d6] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </>
                )}
              </Button>
            </div>

            {/* Back Button */}
            <div>
              <Button
                type="button"
                onClick={handleBackToCredentials}
                disabled={isLoading}
                className="w-full py-4 px-6 rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-white/50 text-gray-700 font-semibold text-lg shadow-lg hover:shadow-xl hover:border-[#86e4fd] transition-all duration-300 relative overflow-hidden group hover:bg-white/95 disabled:opacity-50"
              >
                <span className="relative z-10">Back to Credentials</span>
              </Button>
            </div>
          </form>
        )}

        {/* Additional Links */}
        {!showTwoFactor && (
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
        )}
      </div>
    </>
  )
}
