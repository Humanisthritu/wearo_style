
import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'
import { api } from '@/services/api'


export default async function TrendingSection() {
  const products = await api.getTrendingProducts()

  if (!products.length) return null

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
            Trending Now 🔥
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Most loved by shoppers this week
          </p>
        </div>

        <Link
          href="/shop"
          className="text-sm font-semibold text-[#ff3f6c] hover:underline"
        >
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map((product) => (
          <div key={product.id} className="relative group">
            {/* 🔥 Badge */}

            <div className="transform transition duration-300 group-hover:scale-105">
              <ProductCard product={product} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}