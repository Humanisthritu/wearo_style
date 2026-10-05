// src/components/layout/Footer.tsx
import Link from 'next/link'

const FOOTER_LINKS = {
  Company: [
    { title: 'About Us', link: '/company/aboutUs' },
    { title: 'Careers', link: '/company/career' },
    { title: 'Press', link: '/company/press' },
    { title: 'Blog', link: '/blog' },
    { title: 'Sustainability', link: '/sustainability' },
  ],
  Help: [
    { title: 'Track Order', link: '/track-order' },
    { title: 'Returns & Exchanges', link: '/returns' },
    { title: 'Size Guide', link: '/size-guide' },
    { title: 'Contact Us', link: '/contact' },
    { title: 'FAQ', link: '/faq' },
  ],
  Shop: [
    { title: 'New Arrivals', link: '/new' },
    { title: "Men's Fashion", link: '/men' },
    { title: "Women's Fashion", link: '/women' },
    { title: 'Sale', link: '/sale' },
    { title: 'Gift Cards', link: '/gift-cards' },
  ],
  Legal: [
    { title: 'Privacy Policy', link: '/privacy-policy' },
    { title: 'Terms of Service', link: '/terms' },
    { title: 'Cookie Policy', link: '/cookies' },
    { title: 'Accessibility', link: '/accessibility' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="text-xl font-bold text-white font-heading mb-3">
              Drip<span className="text-[#8e4440]">Kart</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-500 mb-4">
              Fashion for the fearless. Curated streetwear and everyday essentials.
            </p>
            <div className="flex gap-3 text-lg">
              <span className="cursor-pointer hover:text-white">📱</span>
              <span className="cursor-pointer hover:text-white">💬</span>
              <span className="cursor-pointer hover:text-white">📷</span>
              <span className="cursor-pointer hover:text-white">🐦</span>
            </div>
          </div>

          {/* Dynamic Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-white text-sm font-semibold mb-4 font-heading">
                {section}
              </h4>

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