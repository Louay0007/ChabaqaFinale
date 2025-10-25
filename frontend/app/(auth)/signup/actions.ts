"use server"

interface SignupResult {
  success: boolean
  error?: string
  user?: {
    _id: string
    name: string
    email: string
    role: string
    createdAt: string
  }
}

export async function signupAction(data: { 
  name: string
  email: string
  password: string
  numtel?: string
  date_naissance?: string
}): Promise<SignupResult> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (response.ok && result.success) {
      return { 
        success: true, 
        user: result.user 
      }
    } else {
      return { success: false, error: result.message || "Une erreur s'est produite lors de l'inscription." }
    }
  } catch (error) {
    return { success: false, error: "Erreur de connexion. Veuillez réessayer." }
  }
}
