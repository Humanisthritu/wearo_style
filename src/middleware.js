// src/middleware.js
// ─────────────────────────────────────────────────────────────────────────────
// Runs on the Edge before every request.
// If the user has no session cookie → redirect to /login
// If the user IS logged in and hits /login → redirect to /
// ─────────────────────────────────────────────────────────────────────────────
import { NextResponse } from 'next/server'

// Routes that DON'T need a login
const PUBLIC_ROUTES = ['/login', '/register']

// Routes that are always public regardless (assets, api, _next)
const PUBLIC_PREFIXES = ['/_next', '/api', '/favicon', '/images', '/icons']

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Always allow static assets and API routes
  if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }

  // Read session from cookie (we'll set this cookie on login)
  const sessionCookie = request.cookies.get('dripkart_session')?.value
  const isLoggedIn    = !!sessionCookie

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname)

  // Not logged in + trying to access protected page → go to /login
  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url)
    // Preserve where they were trying to go so we can redirect after login
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Already logged in + trying to visit /login or /register → go home
  if (isLoggedIn && isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Run middleware on every route except static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}