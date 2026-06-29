
import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'
import { api } from '@/services/api'


export default async function NewArrivalsSection() {
  const products = await api.getNewArrivals()
  console.log(products, "products")
 

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="section-title">New Arrivals ✨</h2>
          <p className="text-sm text-gray-500 mt-1">Fresh styles, just dropped</p>
        </div>
        <Link href="/shop?tag=new" className="text-sm text-[#ff3f6c] font-semibold hover:underline">
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}