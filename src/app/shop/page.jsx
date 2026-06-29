'use client'

import { api } from '@/services/api'
import ProductCard from '@/components/product/ProductCard'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ShopPage() {
  const [products, setProducts] = useState([])
  const searchParams = useSearchParams()
  console.log(products, 'products')

  const category = searchParams.get('category')

  useEffect(() => {
    getCategoryProduct()
  }, [category])

  const getCategoryProduct = async () => {
    try {
      const data = category
        ?  await api.getProductsByCategory(category)
        : await api.getProducts()

      setProducts(data?.products || [])
    } catch (err) {
      console.log(err)
      setProducts([])
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold capitalize">
          {category ? category.replace('-', ' ') : 'All Products'}
        </h1>

        <p className="text-sm text-gray-500">
          {products.length} items found
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No products found
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}