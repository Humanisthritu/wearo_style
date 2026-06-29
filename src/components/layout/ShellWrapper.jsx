'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'

export default function ShellWrapper({ children }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  return (
    <>
      {!isLoginPage && <Navbar />}
      <main className="min-h-screen">{children}</main>
      {!isLoginPage && <Footer />}
    </>
  )
}