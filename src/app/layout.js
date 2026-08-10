// src/app/layout.js
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { ReduxProvider }  from '@/components/common/ReduxProvider'
import { AppProvider }    from '@/context/AppContext'
import Navbar             from '@/components/layout/Navbar'
import Footer             from '@/components/layout/Footer'
import AuthProvider from '@/context/AuthContext'
import LayoutClient from '@/components/common/LayoutClient'

const inter   = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

export const metadata = {
  title:       'DripKart — Fashion That Moves With You',
  description: 'Shop the latest trends in fashion.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} font-sans bg-gray-50 text-gray-900`}
        suppressHydrationWarning
      >
        <ReduxProvider>
          <AppProvider>
            <AuthProvider>
              <LayoutClient>
              <main className="min-h-screen">{children}</main>
                </LayoutClient>
            </AuthProvider>
          </AppProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}