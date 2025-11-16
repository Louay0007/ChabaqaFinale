import { NextResponse, NextRequest } from 'next/server'

// Configure protected paths here
const PROTECTED_PATHS: RegExp[] = [
  /^\/creator(\/.*)?$/,
  /^\/dashboard(\/.*)?$/,
  /^\/settings(\/.*)?$/,
  /^\/community\/[^/]+\/dashboard(\/.*)?$/,
]

// Heuristic: consider user authenticated if any of these cookies exist
const AUTH_COOKIE_CANDIDATES = [
  'accessToken',
  'Authentication',
  'auth_token',
  'refreshToken',
  'rt',
]

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  // Skip non-protected routes
  const isProtected = PROTECTED_PATHS.some((rx) => rx.test(pathname))
  if (!isProtected) return NextResponse.next()

  // Try to detect an auth cookie (httpOnly) set by backend
  const hasAuthCookie = AUTH_COOKIE_CANDIDATES.some((name) => !!req.cookies.get(name)?.value)

  if (!hasAuthCookie) {
    const redirect = encodeURIComponent(`${pathname}${search || ''}`)
    const url = new URL(`/signin?redirect=${redirect}`, req.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/creator/:path*',
    '/dashboard/:path*',
    '/settings/:path*',
    '/community/:slug/dashboard/:path*',
    '/profile',
  ],
}
