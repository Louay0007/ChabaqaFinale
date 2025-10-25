"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown, LogOut, User } from "lucide-react"
import { siteData } from "@/lib/data"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import Image from "next/image"

export function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const groups = siteData.navigationGroups
  const mainGroup = groups[0]
  const dropdownGroups = groups.slice(1)

  const handleLogout = async () => {
    setIsLoading(true)
    setError("") // Reset error
    
    try {
      await logout() // Use logout from useAuth to clear auth state without redirect
      // No redirection, just clear state and update UI
    } catch (error) {
      setError("Erreur de connexion")
      console.error('Erreur lors de la déconnexion:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <Link href="/" className="flex items-center space-x-2">
            {/* Logo Mobile (sm:hidden) */}
            <div className="sm:hidden">
              <Image
                src="/Logos/PNG/frensh.png"
                alt="Chabaqa Logo"
                width={140}
                height={26} // mobile height
                style={{ objectFit: "contain" }}
                priority
              />
            </div>

            {/* Logo Desktop (hidden sm:block) */}
            <div className="hidden sm:block">
              <Image
                src="/Logos/PNG/frensh.png"
                alt="Chabaqa Logo"
                width={150}
                height={36} // desktop height
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
          </Link>
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6 relative">
            {/* Main group links visible */}
            {mainGroup.items.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-chabaqa-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}

            {/* Dropdown groups */}
            {dropdownGroups.map((group) => (
              <div key={group.title} className="relative group">
                <button className="flex items-center text-gray-700 hover:text-chabaqa-primary transition-colors cursor-pointer">
                  {group.title}
                  <ChevronDown className="ml-1 w-4 h-4" />
                </button>

                <div className="absolute left-0 top-[calc(100%-4px)] hidden group-hover:block bg-white border border-gray-200 rounded shadow z-50 w-48">
                  {group.items.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block px-4 py-2 text-gray-700 hover:bg-chabaqa-primary hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Desktop CTA buttons or Profile Icon */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href={user?.role === 'creator' ? '/creator/dashboard' : '/community'}>
                  <Button variant="ghost" className="rounded-full p-0 h-10 w-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800">
                    {user?.name ? (
                      <span className="font-medium text-sm">{user.name.charAt(0).toUpperCase()}</span>
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="flex items-center space-x-2 text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 hover:border-red-400"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{isLoading ? 'Déconnexion...' : 'Logout'}</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/signin">
                  <Button variant="ghost" className="text-gray-700 hover:text-chabaqa-primary">
                    Sign In
                  </Button>
                </Link>
                <Link href="/build-community">
                  <Button className="bg-chabaqa-accent hover:bg-chabaqa-accent/90 text-white">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 text-sm">
            {error}
          </div>
        )}

        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="md:hidden bg-white border-t border-gray-200 px-4 py-3">
            {groups.map((group) => (
              <div key={group.title} className="mb-4">
                <h3 className="text-chabaqa-primary font-semibold mb-2">{group.title}</h3>
                <div className="flex flex-col space-y-1">
                  {group.items.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2 text-gray-700 hover:text-chabaqa-primary rounded transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* Mobile CTA Buttons or Profile Icon */}
            <div className="pt-2 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link href={user?.role === 'creator' ? '/creator/dashboard' : '/community'}>
                    <Button variant="ghost" className="w-full justify-start flex items-center space-x-2 text-gray-700 hover:text-chabaqa-primary">
                      <span className="inline-block rounded-full p-1 bg-gray-200 h-8 w-8 flex items-center justify-center text-gray-800 font-medium text-sm">
                        {user?.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                      </span>
                      <span>Profile</span>
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="w-full justify-start text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {isLoading ? 'Déconnexion...' : 'Logout'}
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/signin">
                    <Button variant="ghost" className="w-full justify-start">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/build-community">
                    <Button className="w-full bg-chabaqa-accent hover:bg-chabaqa-accent/90 text-white">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
