'use client'

import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined'

const BADGES = [
  {
    icon: LocalShippingOutlinedIcon,
    title: 'Free Shipping',
    sub: 'On orders above ₹999',
  },
  {
    icon: ReplayOutlinedIcon,
    title: 'Hassle-Free Returns',
    sub: '30-day easy return policy',
  },
  {
    icon: LockOutlinedIcon,
    title: 'Secure Checkout',
    sub: 'Encrypted & trusted payments',
  },
  {
    icon: CardGiftcardOutlinedIcon,
    title: 'Gift Cards',
    sub: 'Perfect for every occasion',
  },
]

export default function TrustBadges() {
  return (
    <div className="border-y border-gray-100 bg-gradient-to-b from-white via-white to-gray-50/60">
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {BADGES.map((b) => {
          const Icon = b.icon

          return (
            <div
              key={b.title}
              className="
                group relative overflow-hidden
                rounded-2xl border border-gray-100
                bg-white/70 backdrop-blur-md
                px-5 py-4
                transition-all duration-300
                hover:-translate-y-1 hover:shadow-lg hover:border-gray-200
              "
            >
              {/* soft glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-gray-50 to-transparent" />

              <div className="relative flex items-center gap-4">
                {/* icon pill */}
                <div
                  className="
                    flex items-center justify-center
                    w-11 h-11 rounded-xl
                    bg-gray-900 text-white
                    shadow-sm
                    group-hover:scale-105 transition
                  "
                >
                  <Icon fontSize="small" />
                </div>

                <div>
                  <div className="text-[13px] font-semibold text-gray-900 tracking-tight">
                    {b.title}
                  </div>
                  <div className="text-[12px] text-gray-500 leading-tight">
                    {b.sub}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}