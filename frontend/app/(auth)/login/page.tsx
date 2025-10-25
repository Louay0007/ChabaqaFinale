"use client"

import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = (success: boolean) => {
    if (success) {
      router.push("/creator/dashboard")
    }
  }

  return <LoginForm onLogin={handleLogin} />
}
