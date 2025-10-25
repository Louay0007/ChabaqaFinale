import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define which routes require authentication
const protectedRoutes = [
  '/creator',
  '/community',
  '/dashboard',
  '/build-community'
]

// Define which routes are public (don't require authentication)
const publicRoutes = [
  '/signin',
  '/signup',
  '/forgot-password',
  '/reset-password'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }
  
  // If it's a protected route, check for authentication
  if (isProtectedRoute) {
    // In a real implementation, you would check for valid tokens here
    // For now, we'll just check if the access_token cookie exists
    const accessToken = request.cookies.get('access_token')
    
    if (!accessToken) {
      // Redirect to signin page with the original URL as a redirect parameter
      const url = request.nextUrl.clone()
      url.pathname = '/signin'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
  }
  
  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
