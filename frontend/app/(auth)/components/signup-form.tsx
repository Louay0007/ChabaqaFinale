"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { signupAction } from "../signup/actions"

interface SignUpFormProps {
  onSuccess?: () => void
}

export default function SignUpForm({ onSuccess }: SignUpFormProps = {}) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [numtel, setNumtel] = useState("")
  const [dateNaissance, setDateNaissance] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signupAction({ 
        name, 
        email, 
        password, 
        numtel, 
        date_naissance: dateNaissance 
      })

      if (result.success) {
        if (onSuccess) {
          onSuccess()
        } else {
          router.push("/signin?message=Account created successfully")
        }
      } else {
        setError(result.error || "An error occurred")
      }
    } catch (error) {
      setError("Connection error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="backdrop-blur-xl bg-white/25 border border-white/40 p-8 rounded-3xl shadow-2xl animate-fade-in-delay-400">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-100/80 backdrop-blur-sm border border-red-200 rounded-2xl">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Name Field */}
        <div className="space-y-2 animate-fade-in-delay-600">
          <Label htmlFor="name" className="text-sm font-medium text-gray-800 block">
            Full Name
          </Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
            className="w-full px-4 py-4 rounded-2xl border-2 border-white/50 focus:border-[#86e4fd] focus:ring-4 focus:ring-[#86e4fd]/20 transition-all duration-300 text-gray-900 placeholder-gray-500 bg-white/70 backdrop-blur-sm disabled:opacity-50"
          />
        </div>

        {/* Email Field */}
        <div className="space-y-2 animate-fade-in-delay-700">
          <Label htmlFor="email" className="text-sm font-medium text-gray-800 block">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="w-full px-4 py-4 rounded-2xl border-2 border-white/50 focus:border-[#86e4fd] focus:ring-4 focus:ring-[#86e4fd]/20 transition-all duration-300 text-gray-900 placeholder-gray-500 bg-white/70 backdrop-blur-sm disabled:opacity-50"
          />
        </div>

        {/* Phone Field */}
        <div className="space-y-2 animate-fade-in-delay-750">
          <Label htmlFor="numtel" className="text-sm font-medium text-gray-800 block">
            Phone Number
          </Label>
          <Input
            id="numtel"
            type="tel"
            value={numtel}
            onChange={(e) => setNumtel(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-4 rounded-2xl border-2 border-white/50 focus:border-[#86e4fd] focus:ring-4 focus:ring-[#86e4fd]/20 transition-all duration-300 text-gray-900 placeholder-gray-500 bg-white/70 backdrop-blur-sm disabled:opacity-50"
          />
        </div>

        {/* Date of Birth Field */}
        <div className="space-y-2 animate-fade-in-delay-775">
          <Label htmlFor="dateNaissance" className="text-sm font-medium text-gray-800 block">
            Date of Birth
          </Label>
          <Input
            id="dateNaissance"
            type="date"
            value={dateNaissance}
            onChange={(e) => setDateNaissance(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-4 rounded-2xl border-2 border-white/50 focus:border-[#86e4fd] focus:ring-4 focus:ring-[#86e4fd]/20 transition-all duration-300 text-gray-900 placeholder-gray-500 bg-white/70 backdrop-blur-sm disabled:opacity-50"
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2 animate-fade-in-delay-800">
          <Label htmlFor="password" className="text-sm font-medium text-gray-800 block">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-4 pr-12 rounded-2xl border-2 border-white/50 focus:border-[#86e4fd] focus:ring-4 focus:ring-[#86e4fd]/20 transition-all duration-300 text-gray-900 placeholder-gray-500 bg-white/70 backdrop-blur-sm disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#86e4fd] transition-colors duration-200 disabled:opacity-50"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Create Account Button */}
        <div className="animate-fade-in-delay-900">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#8e78fb] to-[#86e4fd] text-white font-semibold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 border-0 relative overflow-hidden group hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span className="relative z-10">Create my account</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#7c66e9] to-[#74d4f0] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Sign in link */}
      <div className="mt-8 text-center animate-fade-in-delay-1000">
        <div className="text-sm text-gray-700 drop-shadow-sm">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-[#86e4fd] hover:text-[#74d4f0] font-medium transition-all duration-200 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
