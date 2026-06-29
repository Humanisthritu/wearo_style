// src/components/layout/OfferBanner.tsx
import Link from 'next/link'

export default function OfferBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-4">
      <div className="bg-gray-900 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="inline-block bg-[#ff3f6c] text-white text-xs font-bold px-2 py-0.5 rounded mb-3">
            LIMITED TIME
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-white font-heading mb-2">
            End of Season Sale
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Up to 70% off on selected styles. New deals drop every hour!
          </p>
          <Link
            href="/shop?tag=sale"
            className="inline-flex items-center gap-2 bg-[#ff3f6c] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#e03560] transition-colors"
          >
            Grab the Deal →
          </Link>
        </div>
        <div className="text-7xl md:text-8xl shrink-0">🔥</div>
      </div>
    </section>
  )
}