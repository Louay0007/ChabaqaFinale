import { NextResponse, NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// JWT Secret for token verification
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const secret = new TextEncoder().encode(JWT_SECRET)

// Configure protected paths here
const PROTECTED_PATHS: RegExp[] = [
  /^\/creator(\/.*)?$/,
  /^\/dashboard(\/.*)?$/,
  /^\/settings(\/.*)?$/,
  /^\/profile(\/.*)?$/,
  /^\/admin(\/.*)?$/,
  /^\/community\/[^/]+\/dashboard(\/.*)?$/,
]

// Admin-only paths
const ADMIN_PATHS: RegExp[] = [
  /^\/admin(\/.*)?$/,
]

// Creator paths (accessible by creators and admins)
const CREATOR_PATHS: RegExp[] = [
  /^\/creator(\/.*)?$/,
]

// Public paths that should redirect authenticated users
const AUTH_REDIRECT_PATHS: RegExp[] = [
  /^\/signin$/,
  /^\/signup$/,
  /^\/register$/,
]

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  // Skip API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Get access token from cookies
  const accessToken = req.cookies.get('accessToken')?.value

  let user = null
  let isValidToken = false

  // Verify token if present
  if (accessToken) {
    try {
      const { payload } = await jwtVerify(accessToken, secret)
      user = payload
      isValidToken = true
    } catch (error) {
      // Token is invalid or expired - clear the cookie
      const response = NextResponse.next()
      response.cookies.delete('accessToken')
      return response
    }
  }

  // Check if this is a protected route
  const isProtected = PROTECTED_PATHS.some((rx) => rx.test(pathname))
  const isAdminPath = ADMIN_PATHS.some((rx) => rx.test(pathname))
  const isCreatorPath = CREATOR_PATHS.some((rx) => rx.test(pathname))
  const isAuthRedirectPath = AUTH_REDIRECT_PATHS.some((rx) => rx.test(pathname))

  // Redirect authenticated users away from auth pages based on role
  if (isValidToken && isAuthRedirectPath) {
    let redirectTo = '/explore' // default for users
    if (user?.role === 'creator' || user?.role === 'admin') {
      redirectTo = '/creator/select-community'
    }
    // Clear any auth-related search params to prevent loops
    const url = new URL(redirectTo, req.url)
    url.search = ''
    return NextResponse.redirect(url)
  }

  // Handle protected routes
  if (isProtected && !isValidToken) {
    return NextResponse.redirect(new URL('/signin', req.url))
  }

  // Handle admin-only routes
  if (isAdminPath && isValidToken && user?.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Handle creator routes (accessible by creators and admins)
  if (isCreatorPath && isValidToken && user?.role !== 'creator' && user?.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Add user info to headers for server components
  if (isValidToken && user) {
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-user-id', user.sub as string)
    requestHeaders.set('x-user-email', user.email as string)
    requestHeaders.set('x-user-role', user.role as string)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/creator/:path*',
    '/dashboard/:path*',
    '/settings/:path*',
    '/profile/:path*',
    '/admin/:path*',
    '/community/:slug/dashboard/:path*',
    '/signin',
    '/signup',
    '/register',
  ],
}
