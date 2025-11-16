"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthContext } from "@/app/providers/auth-provider"

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuthContext()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return
    if (!isAuthenticated) {
      const redirect = encodeURIComponent(pathname || "/")
      router.replace(`/signin?redirect=${redirect}`)
    }
  }, [isAuthenticated, loading, pathname, router])

  if (loading) return null
  if (!isAuthenticated) return null

  return <>{children}</>
}
