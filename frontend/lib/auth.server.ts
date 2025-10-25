import { cookies } from "next/headers"
import { User } from "@/lib/models"

export async function getProfileServer(): Promise<User | null> {
  try {
    // For server components, we need to check if we have valid tokens
    // In a real implementation, you would make a request to your backend
    // to verify the tokens, but for now we'll just check if they exist
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("access_token")
    
    if (!accessToken) {
      return null
    }

    // In a real implementation, you would verify the token with your backend
    // For now, we'll assume the token is valid if it exists
    // You would typically decode the JWT to get user info
    return null // Return null for now, as we don't have a way to decode JWT on server
  } catch (error) {
    console.error("Server auth check error:", error)
    return null
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getProfileServer()
  return user !== null
}
