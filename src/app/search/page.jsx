'use client'
import { useSearchParams } from 'next/navigation'
import React from 'react'
import ProductCard from '../components/product/ProductCard'

const page = () => {
    const searchParams = useSearchParams()
    console.log(searchParams, "searchParams")


    const query = searchParams.get('q') || ''

    const filteredData = JSON.parse(
        searchParams.get('filteredData') || '[]'
    )

    console.log(query, 'search query')
    console.log(filteredData, 'filtered products params')
    return (
        <>
            <div className='p-[20px]'>
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent mb-1.5">Search Results for: {query}</h2>
                </div>


                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredData.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </>
    )
}

export default page
