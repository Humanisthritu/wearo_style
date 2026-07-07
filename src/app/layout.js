// src/app/layout.js
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { ReduxProvider }  from '@/components/common/ReduxProvider'
import { AppProvider }    from '@/context/AppContext'
import Navbar             from '@/components/layout/Navbar'
import Footer             from '@/components/layout/Footer'
import AuthProvider from '@/context/AuthContext'

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
      {/*
        suppressHydrationWarning on <html> is needed because browser extensions
        (LastPass, Grammarly, etc.) often inject attributes into <html>/<body>
        that cause harmless hydration warnings.
      */}
      <body
        className={`${inter.variable} ${poppins.variable} font-sans bg-gray-50 text-gray-900`}
        suppressHydrationWarning
        /*
          suppressHydrationWarning on <body> stops warnings from browser
          extensions adding attributes like data-new-gr-c-s-check-loaded.
          This does NOT suppress your actual component hydration errors —
          only tag-level attribute mismatches on html/body.
        */
      >
        <ReduxProvider>
          <AppProvider>
            <AuthProvider>
              <Navbar />
              <main className="min-h-screen">{children}</main>
              <Footer />
            </AuthProvider>
          </AppProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}