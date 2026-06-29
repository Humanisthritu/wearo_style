'use client'

import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import {
  selectWishlistItems,
  selectWishlistCount,
  removeFromWishlist,
  clearWishlist,
} from '@/redux/slices/wishlistSlice'

import {
  addToCart,
  selectCartItems,
} from '@/redux/slices/cartSlice'

import { useToast } from '@/context/AppContext'
import { getDiscountedPrice } from '@/utils'
import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import LocalMallTwoToneIcon from '@mui/icons-material/LocalMallTwoTone';


export default function WishlistPage() {
  const dispatch = useAppDispatch()
  const { showToast } = useToast()

  const items = useAppSelector(selectWishlistItems)
  const count = useAppSelector(selectWishlistCount)
  const cartItems = useAppSelector(selectCartItems)

  const isInCart = (productId) =>
    cartItems.some((c) => c.product.id === productId)

  function handleAddToCart(product) {
    if (isInCart(product.id)) {
      showToast('Already in cart!')
      return
    }

    const discountedPrice = getDiscountedPrice(
      product.price,
      product.discountPercentage
    )

    dispatch(
      addToCart({
        product: { ...product, price: discountedPrice },
        quantity: 1,
        size: 'M',
        color: 'Black',
      })
    )

    showToast('Added to cart! 🛍️')
  }

  function handleRemove(productId) {
    dispatch(removeFromWishlist(productId))
    showToast('Removed from wishlist')
  }

  function handleMoveAllToCart() {
    let added = 0

    items.forEach((product) => {
      if (!isInCart(product.id)) {
        const discountedPrice = getDiscountedPrice(
          product.price,
          product.discountPercentage
        )

        dispatch(
          addToCart({
            product: { ...product, price: discountedPrice },
            quantity: 1,
            size: 'M',
            color: 'Black',
          })
        )

        added++
      }
    })

    dispatch(clearWishlist())

    showToast(
      added
        ? `Moved ${added} item${added > 1 ? 's' : ''} to cart! <LocalMallOutlinedIcon/>`
        : 'All items already in cart'
    )
  }

  function handleClearAll() {
    dispatch(clearWishlist())
    showToast('Wishlist cleared')
  }

  // Empty state
  if (!items.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-4xl">
          🤍
        </div>
        <h2 className="text-xl font-medium text-gray-900">
          Your wishlist is empty
        </h2>
        <p className="text-sm text-gray-500">
          Save items you love and come back to shop them later
        </p>
        <Link
          href="/shop"
          className="mt-2 px-6 py-2.5 bg-[#ff3f6c] text-white text-sm font-medium rounded-lg hover:bg-[#e03560] transition-colors"
        >
          Explore products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-medium text-gray-900">
            My Wishlist
          </h1>
          <span className="text-sm text-gray-400">
            ({count} items)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleMoveAllToCart}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-400 transition-colors"
          >
           <LocalMallTwoToneIcon/> Move all to cart
          </button>

          <button
            onClick={handleClearAll}
            className="text-sm text-gray-400 hover:text-[#ff3f6c] transition-colors"
          >
            Clear all
          </button>
        </div>
      </div>

      {/* Grid using ProductCard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onRemove={handleRemove}
            onAddToCart={handleAddToCart}
            isInCart={isInCart(product.id)}
            showRemoveButton
          />
        ))}
      </div>
    </div>
  )
}