'use client'

import { useEffect, useState, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { getSession, clearSession } from '@/utils/auth'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function LayoutClient({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
 

  // Check authentication status
  const checkAuth = useCallback(() => {
    try {
      const session = getSession()
      setIsLoggedIn(!!session)
    } catch (error) {
      console.error('Auth check failed:', error)
      setIsLoggedIn(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial auth check
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Listen for storage events (when user logs in/out in another tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'dripkart_session') {
        checkAuth()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [checkAuth])

  // Check auth when route changes (useful for protected routes)
  useEffect(() => {
    checkAuth()
  }, [pathname, checkAuth])

  // Public routes that shouldn't show Navbar/Footer
  const publicRoutes = ['/login', '/register', '/forgot-password']
  const isPublicRoute = publicRoutes.some(route => pathname === route)
  
  // Also check if it's an auth-related route (starts with /auth/)
  const isAuthRoute = pathname.startsWith('/auth/')
  
  const showNavigation = isLoggedIn && !isPublicRoute 

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {showNavigation && <Navbar />}
      
      <main className={`flex-1 ${showNavigation ? 'pt-1' : ''}`}>
        {children}
      </main>
      
      {showNavigation && <Footer />}
    </div>
  )
}