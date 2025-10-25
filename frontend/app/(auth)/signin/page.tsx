import { redirect } from "next/navigation"
import { getProfileServer } from "@/lib/auth.server"
import Image from "next/image"
import SignInForm from "../components/signin-form"

export default async function SignInPage({ 
  searchParams 
}: { 
  searchParams: { redirect?: string } 
}) {
  const user = await getProfileServer()
  // L'erreur provient d'ici - nous n'avons pas besoin d'utiliser ?. avec searchParams
  // car il est toujours disponible, même s'il est vide
  const redirectUrl = searchParams.redirect || "/"

  if (user) {
    redirect(redirectUrl)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background avec fallback */}
      <div className="absolute inset-0 gradient-fallback">
        <Image src="/gradient-background.png" alt="Gradient Background" fill className="object-cover" priority />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex justify-center">
              <Image 
                src="/logo_chabaqa.png" 
                alt="Chabaqa Logo" 
                width={280} 
                height={112} 
                className="drop-shadow-lg"
                priority
              />
            </div>
            <div className="w-16 h-1 bg-gradient-to-r from-[#8e78fb] to-[#86e4fd] mx-auto rounded-full"></div>
          </div>

          {/* Welcome Message */}
          <div className="text-center mb-8 animate-fade-in-delay-200">
            <p className="text-xl text-gray-700 font-light drop-shadow-sm">Sign in to your Chabaqa space</p>
            <p className="text-sm text-gray-600 mt-2 drop-shadow-sm">Create, educate and manage your digital communities</p>
          </div>

          {/* Sign In Form */}
          <SignInForm />

          {/* Footer */}
          <div className="text-center mt-8 animate-fade-in-delay-1200">
            <p className="text-xs text-gray-600 drop-shadow-sm">© 2024 Chabaqa. Build the future of communities.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
