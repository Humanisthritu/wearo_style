// src/app/layout.tsx
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { ReduxProvider } from '@/components/common/ReduxProvider'
import { AppProvider } from '@/context/AppContext'
import ShellWrapper from '@/components/layout/ShellWrapper'  // ← new

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

export const metadata = {
  title: 'DripKart — Fashion That Moves With You',
  description:
    'Shop the latest trends in fashion. Curated streetwear, everyday essentials, and statement pieces.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-sans bg-gray-50 text-gray-900`}>
        <ReduxProvider>
          <AppProvider>
            <ShellWrapper>{children}</ShellWrapper>  
          </AppProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}