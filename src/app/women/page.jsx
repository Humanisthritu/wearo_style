'use client'
import ProductCard from '@/app/components/product/ProductCard'
import { api } from '@/services/api'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const WomenPage = () => {
    const [products, setProducts] = useState([])
    const pickWord = ['women', 'girl']

    useEffect(() => {
        getProduct()
    }, [])

    const filterGenderWise = products.filter((product) =>
        pickWord.some((word) =>
            product.description?.toLowerCase().includes(word)
        )
    )

    const getProduct = async () => {
        try {
            const data = await api.getProducts()
            setProducts(data?.products || [])
        } catch (err) {
            console.log(err)
            setProducts([])
        }
    }

    return (
        <>
            <section className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-semibold capitalize">
                        WOMEN
                    </h1>

                    <p className="text-sm text-gray-500">
                        {filterGenderWise.length} items found
                    </p>
                </div>
                {products.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                          No products found
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {filterGenderWise.map((product) => (
                            <ProductCard key={product.id} product={product} />
                          ))}
                        </div>
                      )}
            </section>
        </>
    )
}

export default WomenPage
