'use client'

import React, { useEffect, useState } from 'react'
import { api } from '@/services/api'
import { useParams } from 'next/navigation'
import ProductCard from '@/components/product/ProductCard'
import ProductDetailClient from './ProductDetailClient'

const ProductPage = () => {
  const { id } = useParams()

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])

  useEffect(() => {
    if (!id) return
    setProduct(null)
    setRelated([])

    const fetchData = async () => {
      try {
        
        const res = await api.getProductById(id)
        setProduct(res)

        if (res?.category) {
          const relatedProducts = await api.getRelatedProducts(
            res.category,
            res.id
          )
          setRelated(relatedProducts)
        }
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [id])

  if (!product) return <div>Loading...</div>

  return (
    <>
      {
        product && <ProductDetailClient product={product} similarProducts={related}/>
      }
    </>
  )
}

export default ProductPage