// src/components/layout/Footer.tsx
import Link from 'next/link'

const FOOTER_LINKS = {
  Company: ['About Us', 'Careers', 'Press', 'Blog', 'Sustainability'],
  Help: ['Track Order', 'Returns & Exchanges', 'Size Guide', 'Contact Us', 'FAQ'],
  Shop: ['New Arrivals', "Men's Fashion", "Women's Fashion", 'Sale', 'Gift Cards'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Accessibility'],
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="text-xl font-bold text-white font-heading mb-3">
              Drip<span className="text-[#ff3f6c]">Kart</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-500 mb-4">
              Fashion for the fearless. Curated streetwear and everyday essentials.
            </p>
            <div className="flex gap-3 text-lg">
              <span className="cursor-pointer hover:text-white transition-colors">📱</span>
              <span className="cursor-pointer hover:text-white transition-colors">💬</span>
              <span className="cursor-pointer hover:text-white transition-colors">📷</span>
              <span className="cursor-pointer hover:text-white transition-colors">🐦</span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white text-sm font-semibold mb-4 font-heading">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-xs text-gray-500 hover:text-white transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} DripKart. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-gray-600 text-xs">
            <span>We accept:</span>
            <span className="text-lg">💳</span>
            <span className="text-lg">📱</span>
            <span className="font-bold text-sm">UPI</span>
            <span className="font-bold text-sm text-green-400">COD</span>
          </div>
        </div>
      </div>
    </footer>
  )
}