import type React from "react"
import type { Metadata } from "next"
import "../../globals.css"
import { Inter } from "next/font/google"
import CreatorClientLayout from "@/app/(creator)/creator/creator-client-layout"
import { AuthProvider } from "@/app/providers/auth-provider"
import RequireAuth from "@/components/auth/require-auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Chabaqa - Turn your passion into buisness",
  description: "A full-featured creator platform for building and managing communities",
  generator: "v0.dev",
}

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <RequireAuth>
            <CreatorClientLayout>{children}</CreatorClientLayout>
          </RequireAuth>
        </AuthProvider>
      </body>
    </html>
  )
}
