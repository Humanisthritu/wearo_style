'use client'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { addToCart } from '@/redux/slices/cartSlice'
import { toggleWishlist, selectIsWishlisted } from '@/redux/slices/wishlistSlice'
import { useToast } from '@/context/AppContext'
import { formatPrice, getDiscountedPrice } from '@/utils'
import Link from 'next/link'

export default function ProductCard({ product }) {
  const dispatch = useAppDispatch()
  const { showToast } = useToast()

  const isWishlisted = useAppSelector((state) =>
    selectIsWishlisted(state, product.id)
  )

  const discountedPrice = getDiscountedPrice(
    product.price,
    product.discountPercentage
  )

  const discount = Math.round(product.discountPercentage ?? 0)

  function handleAddToCart(e) {
    e.preventDefault()
    e.stopPropagation()

    dispatch(
      addToCart({
        product: { ...product, price: discountedPrice },
        quantity: 1,
      })
    )

    showToast('Added to cart! 🛍️')
  }

  function handleWishlist(e) {
    e.preventDefault()
    e.stopPropagation()

    dispatch(toggleWishlist(product))

    showToast(
      isWishlisted ? 'Removed from wishlist' : 'Added to wishlist! ❤️'
    )
  }

  return (
    <Link  href={`/product/${product.id}`}  className="group relative overflow-hidden rounded-3xl bg-white shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 block">
      <div className="group relative overflow-hidden rounded-3xl bg-white shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
        {/* Product Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute left-4 top-4">
              <span className="rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                {discount}% OFF
              </span>
            </div>
          )}

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-110 hover:bg-white"
          >
            <span className="text-lg">
              {isWishlisted ? '❤️' : '🤍'}
            </span>
          </button>

          {/* Bottom Actions */}
          <div className="absolute bottom-4 left-4 right-4 translate-y-10 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              onClick={handleAddToCart}
              className="w-full rounded-2xl bg-white py-3 text-sm font-semibold text-gray-900 shadow-xl backdrop-blur-md hover:bg-gray-50"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4">
          <h3 className="line-clamp-1 text-sm font-semibold text-gray-900">
            {product.title}
          </h3>

          <p className="mt-1 text-xs text-gray-500 capitalize">
            {product.brand}
          </p>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(discountedPrice)}
            </span>

            {discount > 0 && (
              <>
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>

                <span className="text-xs font-medium text-green-600">
                  Save {discount}%
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>

  )
}