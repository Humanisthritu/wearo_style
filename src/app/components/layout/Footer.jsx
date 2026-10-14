// src/components/layout/Footer.tsx
import { Box, Typography } from '@mui/material'
import Link from 'next/link'

const FOOTER_LINKS = {
  Company: [
    { title: 'About Us', link: '/company/aboutUs' },
    { title: 'Careers', link: '/company/career' },
  ],
  Help: [
    { title: 'Contact Us', link: '/contact' },
    { title: 'FAQ', link: '/faq' },
  ],
  Shop: [
    { title: 'New Arrivals', link: '/new-arrival' },
    { title: "Men's Fashion", link: '/shop?category=mens-shirts' },
    { title: "Women's Fashion", link: '/shop?category=womens-dresses' },
    { title: 'Sale', link: '/shop?tag=sale' },
  ],
  Legal: [
    { title: 'Privacy Policy', link: '/privacy-policy' },
    { title: 'Terms of Service', link: '/terms' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <Box className="max-w-7xl mx-auto px-4 py-12">
        <Box className="grid grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Brand column */}
          <Box className="col-span-2 md:col-span-1">
            <Box className="text-xl font-bold text-white font-heading mb-3">
              Drip<span className="text-[#8e4440]">Kart</span>
            </Box>
            <Typography className="text-sm leading-relaxed text-gray-500 mb-4">
              Fashion for the fearless. Curated streetwear and everyday essentials.
            </Typography>
            <Box className="flex gap-3 text-lg">
              <span className="cursor-pointer hover:text-white">📱</span>
              <span className="cursor-pointer hover:text-white">💬</span>
              <span className="cursor-pointer hover:text-white">📷</span>
              <span className="cursor-pointer hover:text-white">🐦</span>
            </Box>
          </Box>

          {/* Dynamic Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <Box key={section}>
              <Typography variant="h6" className="text-white text-sm font-semibold mb-4 font-heading">
                {section}
              </Typography>

              <ul className="space-y-2">
                {links.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.link}
                      className="text-xs text-gray-500 hover:text-white transition-colors"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </Box>
          ))}
        </Box>

        {/* Bottom bar */}
        <Box className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} DripKart. All rights reserved.
          </p>

          <Box className="flex items-center gap-3 text-gray-600 text-xs">
            <span>We accept:</span>
            <span className="text-lg">💳</span>
            <span className="text-xl">📱</span>
            <span className="font-bold text-sm">UPI</span>
            <span className="font-bold text-sm text-green-400">COD</span>
          </Box>
        </Box>
      </Box>
    </footer>
  )
}