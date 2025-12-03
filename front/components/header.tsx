"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown, LogOut, User as UserIcon } from "lucide-react"
import { siteData } from "@/lib/data"
import { useRouter } from "next/navigation"
import { logoutAction } from "@/app/(auth)/signin/actions"
import Image from "next/image"
import { useAuth } from "@/hooks/use-auth"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { user: authUser, isLoading } = useAuth()
  const isAuthenticated = !!authUser
  const profileHandle = ((authUser?.email || "").split("@")[0]) || "user"

  const groups = siteData.navigationGroups
  const mainGroup = groups[0]
  const dropdownGroups = groups.slice(1)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    setError("") // Reset error
    
    try {
      const result = await logoutAction()

      if (result.success) {
        // Rediriger vers la page de connexion avec un message de succès
        router.push('/signin?message=Déconnexion réussie')
        router.refresh()
      } else {
        // Afficher l'erreur à l'utilisateur
        setError(result.error || "Erreur lors de la déconnexion")
        console.error('Erreur lors de la déconnexion:', result.error)
      }
    } catch (error) {
      setError("Erreur de connexion")
      console.error('Erreur lors de la déconnexion:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="w-full bg-gradient-to-b from-pink-100 to-white dark:from-gray-900 dark:to-gray-900">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <nav aria-label="Global" className="flex items-center justify-between ">
          {/* Left: Logo */}
          <div className="flex lg:flex-1">
            <Link href="/" className="-ml-3 p-0.5 flex items-center" aria-label="Chabaqa">
              <Image src="/Logos/PNG/frensh.png" alt="Chabaqa Logo" width={150} height={28} priority style={{ objectFit: 'contain' }} />
            </Link>
          </div>

          {/* Middle: Desktop links */}
          <div className="hidden lg:flex lg:gap-x-8">
            <Link href="/explore" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Explore</Link>
            <Link href="/pricing" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Pricing</Link>
            <Link href="/about" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-pink-600 dark:hover:text-pink-400 transition-colors">About</Link>
            <button className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-pink-600 dark:hover:text-pink-400 transition-colors flex items-center gap-x-1" type="button">
              Features
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Desktop actions (auth-aware) */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-x-4">
            {isLoading ? null : !isAuthenticated ? (
              <>
                <Link href="/signin" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Sign in</Link>
                <Link href="/build-community" className="rounded-md bg-pink-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-pink-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link href={`/profile/${profileHandle}`} className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-pink-600 dark:hover:text-pink-400 transition-colors flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  @{profileHandle}
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="rounded-md bg-pink-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-pink-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 disabled:opacity-70"
                >
                  {isLoggingOut ? 'Déconnexion...' : 'Logout'}
                </button>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="lg:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </nav>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 text-sm">
            {error}
          </div>
        )}

        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-3">
            {groups.map((group) => (
              <div key={group.title} className="mb-4">
                <h3 className="text-chabaqa-primary font-semibold mb-2">{group.title}</h3>
                <div className="flex flex-col space-y-1">
                  {group.items.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-pink-600 dark:hover:text-pink-400 rounded transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* Mobile CTA Buttons (auth-aware) */}
            <div className="pt-2 space-y-2">
              {isLoading ? null : !isAuthenticated ? (
                <>
                  <Link href="/signin">
                    <Button variant="ghost" className="w-full justify-start">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/build-community">
                    <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                      Get Started
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href={`/profile/${profileHandle}`}>
                    <Button variant="ghost" className="w-full justify-start flex items-center space-x-2 hover:text-pink-600 dark:hover:text-pink-400">
                      <UserIcon className="w-4 h-4" />
                      <span>@{profileHandle}</span>
                    </Button>
                  </Link>
                  <Button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full justify-start bg-pink-500 hover:bg-pink-600 text-white"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {isLoggingOut ? 'Déconnexion...' : 'Logout'}
                  </Button>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
