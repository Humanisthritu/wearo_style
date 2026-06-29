'use client'
// src/app/cart/page.js

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartDiscount,
  selectCartTotal,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  removeCoupon,
  clearCart,
} from '@/redux/slices/cartSlice'
import { toggleWishlist, selectIsWishlisted } from '@/redux/slices/wishlistSlice'
import { useToast } from '@/context/AppContext'
import { formatPrice, getDiscountedPrice } from '@/utils'

export default function CartPage() {
  const dispatch      = useAppDispatch()
  const router        = useRouter()
  const { showToast } = useToast()

  const items    = useAppSelector(selectCartItems)
  const subtotal = useAppSelector(selectCartSubtotal)
  const discount = useAppSelector(selectCartDiscount)
  const total    = useAppSelector(selectCartTotal)
  const cartState = useAppSelector((s) => s.cart)

  const [couponInput, setCouponInput]   = useState('')
  const [selected,    setSelected]      = useState(new Set())

  const totalCount = items.reduce((a, c) => a + c.quantity, 0)
  const allSelected = items.length > 0 && items.every((i) => selected.has(`${i.product.id}-${i.size}`))

  function toggleSelect(key) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  function toggleAll(checked) {
    if (checked) {
      setSelected(new Set(items.map((i) => `${i.product.id}-${i.size}`)))
    } else {
      setSelected(new Set())
    }
  }

  function handleRemoveSelected() {
    if (!selected.size) { showToast('No items selected'); return }
    let count = 0
    selected.forEach((key) => {
      const [productId, size] = key.split('-')
      dispatch(removeFromCart({ productId: Number(productId), size }))
      count++
    })
    setSelected(new Set())
    showToast(`${count} item${count > 1 ? 's' : ''} removed`)
  }

  function handleRemove(productId, size) {
    dispatch(removeFromCart({ productId, size }))
    setSelected((prev) => { const n = new Set(prev); n.delete(`${productId}-${size}`); return n })
    showToast('Item removed from cart')
  }

  function handleQty(productId, size, delta, currentQty) {
    dispatch(updateQuantity({ productId, size, quantity: currentQty + delta }))
  }

  function handleMoveToWishlist(product) {
    dispatch(toggleWishlist(product))
    dispatch(removeFromCart({ productId: product.id, size: 'M' }))
    showToast('Saved to wishlist ❤️')
  }

  function handleCoupon() {
    const code = couponInput.trim().toUpperCase()
    if (!code) return
    dispatch(applyCoupon(code))
    const valid = ['DRIP20', 'STYLE10', 'FIRST15'].includes(code)
    showToast(valid ? `Coupon applied! 🎉` : 'Invalid coupon code')
    if (!valid) setCouponInput('')
  }

  function handleRemoveCoupon() {
    dispatch(removeCoupon())
    setCouponInput('')
    showToast('Coupon removed')
  }

  // ── Empty state ──
  if (!items.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center text-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-4xl">🛍️</div>
        <h2 className="text-xl font-medium text-gray-900">Your cart is empty</h2>
        <p className="text-sm text-gray-500">Add items from the shop or your wishlist</p>
        <div className="flex gap-3 mt-2">
          <Link href="/shop" className="px-5 py-2.5 bg-[#ff3f6c] text-white text-sm font-medium rounded-lg hover:bg-[#e03560] transition-colors">
            Shop now
          </Link>
          <Link href="/wishlist" className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:border-gray-400 transition-colors">
            View wishlist
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-medium text-gray-900">My Cart</h1>
          <span className="text-sm text-gray-400">({totalCount} item{totalCount > 1 ? 's' : ''})</span>
        </div>
        <button
          onClick={() => { dispatch(clearCart()); showToast('Cart cleared') }}
          className="text-sm text-gray-400 hover:text-[#ff3f6c] transition-colors"
        >
          Clear cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">

        {/* ── Cart items ── */}
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">

          {/* Select all row */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(e) => toggleAll(e.target.checked)}
              className="w-3.5 h-3.5 accent-[#ff3f6c]"
              id="select-all"
            />
            <label htmlFor="select-all" className="text-xs text-gray-500 cursor-pointer select-none">
              Select all
            </label>
            {selected.size > 0 && (
              <button
                onClick={handleRemoveSelected}
                className="ml-auto text-xs text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
              >
                🗑️ Remove selected ({selected.size})
              </button>
            )}
          </div>

          {/* Column headers — desktop only */}
          <div className="hidden md:grid grid-cols-[2fr_80px_110px_80px_32px] gap-2 px-4 py-2.5 border-b border-gray-100">
            {['Product', 'Price', 'Quantity', 'Total', ''].map((h) => (
              <span key={h} className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{h}</span>
            ))}
          </div>

          {/* Cart rows */}
          {items.map((item) => {
            const { product, quantity, size, color } = item
            const key = `${product.id}-${size}`
            const isSelected = selected.has(key)
            const lineTotal = product.price * quantity

            return (
              <CartRow
                key={key}
                product={product}
                quantity={quantity}
                size={size}
                color={color}
                lineTotal={lineTotal}
                isSelected={isSelected}
                onToggle={() => toggleSelect(key)}
                onQtyChange={(delta) => handleQty(product.id, size, delta, quantity)}
                onRemove={() => handleRemove(product.id, size)}
                onMoveToWishlist={() => handleMoveToWishlist(product)}
              />
            )
          })}
        </div>

        {/* ── Order summary ── */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 sticky top-20">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Order summary</h2>

          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal ({totalCount} items)</span>
              <span className="text-gray-900">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Discount</span>
              <span className="text-green-600">
                {discount > 0 ? `−${formatPrice(discount)}` : '−₹0'}
              </span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Delivery</span>
              <span className="text-green-600">Free</span>
            </div>
          </div>

          <div className="flex justify-between text-sm font-medium text-gray-900 border-t border-gray-100 mt-4 pt-4">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          {/* Coupon */}
          <div className="mt-4">
            {cartState.couponCode ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                <div>
                  <span className="text-xs font-medium text-green-700">
                    🎉 {cartState.couponCode} applied
                  </span>
                  <span className="text-xs text-green-600 ml-1">
                    ({cartState.discountPercent}% off)
                  </span>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-xs text-red-500 hover:text-red-700 transition-colors"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCoupon()}
                  placeholder="Coupon code (DRIP20)"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 placeholder-gray-400 outline-none focus:border-[#ff3f6c] transition-colors bg-white"
                />
                <button
                  onClick={handleCoupon}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:border-gray-400 transition-colors"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Checkout button */}
          <button
            onClick={() => router.push('/checkout')}
            className="w-full mt-4 py-3 bg-[#ff3f6c] text-white text-sm font-medium rounded-xl hover:bg-[#e03560] transition-colors shadow-sm shadow-rose-100"
          >
            Proceed to checkout →
          </button>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { icon: '🚚', label: 'Free shipping' },
              { icon: '↩️', label: '30-day return' },
              { icon: '🔒', label: 'Secure pay' },
            ].map((b) => (
              <div key={b.label} className="flex flex-col items-center gap-1 bg-gray-50 rounded-lg py-2.5 px-1">
                <span className="text-base">{b.icon}</span>
                <span className="text-[10px] text-gray-500 text-center leading-tight">{b.label}</span>
              </div>
            ))}
          </div>

          {/* Back to shop */}
          <Link
            href="/shop"
            className="block text-center mt-4 text-xs text-gray-400 hover:text-[#ff3f6c] transition-colors"
          >
            ← Continue shopping
          </Link>
        </div>

      </div>
    </div>
  )
}

// ── Cart row component ────────────────────────────────────────────────────────

function CartRow({ product, quantity, size, color, lineTotal, isSelected, onToggle, onQtyChange, onRemove, onMoveToWishlist }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-[2fr_80px_110px_80px_32px] gap-3 px-4 py-4 border-b border-gray-100 last:border-0 items-center transition-colors ${isSelected ? 'bg-[#fff8f9]' : ''}`}>

      {/* Product info */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggle}
          className="w-3.5 h-3.5 accent-[#ff3f6c] shrink-0"
        />
        <Link href={`/product/${product.id}`} className="shrink-0">
          <div className="w-14 h-16 rounded-lg bg-gray-50 overflow-hidden">
            <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover" />
          </div>
        </Link>
        <div className="min-w-0">
          <Link href={`/product/${product.id}`}>
            <p className="text-xs font-medium text-gray-900 truncate hover:text-[#ff3f6c] transition-colors">
              {product.title}
            </p>
          </Link>
          <p className="text-[10px] text-gray-400 mt-0.5">
            {product.brand} · Size: {size} · {color}
          </p>
          <button
            onClick={onMoveToWishlist}
            className="mt-1.5 text-[10px] text-[#ff3f6c] hover:underline flex items-center gap-1"
          >
            🤍 Save for later
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="text-xs text-gray-700 md:text-sm">
        <span className="md:hidden text-gray-400 text-[10px] mr-1">Price: </span>
        {formatPrice(product.price)}
      </div>

      {/* Quantity */}
      <div>
        <div className="flex items-center border border-gray-200 rounded-lg w-fit overflow-hidden">
          <button
            onClick={() => onQtyChange(-1)}
            className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-base font-light"
          >
            −
          </button>
          <span className="w-8 h-7 flex items-center justify-center text-xs font-medium text-gray-900 border-x border-gray-200">
            {quantity}
          </span>
          <button
            onClick={() => onQtyChange(1)}
            className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-base font-light"
          >
            +
          </button>
        </div>
      </div>

      {/* Line total */}
      <div className="text-xs font-medium text-[#ff3f6c] md:text-sm">
        {formatPrice(lineTotal)}
      </div>

      {/* Remove */}
      <button
        onClick={onRemove}
        className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 text-sm"
        aria-label="Remove item"
      >
        🗑️
      </button>

    </div>
  )
}