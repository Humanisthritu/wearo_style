'use client'
// src/app/product/[id]/ProductDetailClient.js

import { useState } from 'react'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { addToCart } from '@/redux/slices/cartSlice'
import { toggleWishlist, selectIsWishlisted } from '@/redux/slices/wishlistSlice'
import { useToast } from '@/context/AppContext'
import { formatPrice, getDiscountedPrice } from '@/utils'
import ProductCard from '@/components/product/ProductCard'
import ReviewsSection from './ReviewsSection'
import ImageGallery from './ImageGallery'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const COLORS = [
  { name: 'Black',  hex: '#1a1a1a' },
  { name: 'White',  hex: '#f5f5f5' },
  { name: 'Navy',   hex: '#1e3a5f' },
  { name: 'Olive',  hex: '#6b7c45' },
  { name: 'Rust',   hex: '#c0533a' },
]

export default function ProductDetailClient({ product, similarProducts }) {
  const dispatch  = useAppDispatch()
  const { showToast } = useToast()

  const isWishlisted = useAppSelector((state) =>
    selectIsWishlisted(state, product.id)
  )

  // Local UI state
  const [selectedSize,  setSelectedSize]  = useState('S')
  const [selectedColor, setSelectedColor] = useState(COLORS[0])
  const [quantity,      setQuantity]      = useState(1)
  const [activeTab,     setActiveTab]     = useState('details') // details | reviews | shipping

  const discountedPrice = getDiscountedPrice(product.price, product.discountPercentage)
  const discount        = Math.round(product.discountPercentage ?? 0)
  const savings         = product.price - discountedPrice

  // ── handlers ──────────────────────────────────────────────────────────────

  function handleAddToCart() {
    dispatch(
      addToCart({
        product: { ...product, price: discountedPrice },
        quantity,
        size:  selectedSize,
        color: selectedColor.name,
      })
    )
    showToast('Added to cart! 🛍️')
  }

  function handleBuyNow() {
    handleAddToCart()
    window.location.href = '/checkout'
  }

  function handleWishlist() {
    dispatch(toggleWishlist(product))
    showToast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist! ❤️')
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: product.title, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      showToast('Link copied! 🔗')
    }
  }

  // ── stock badge ───────────────────────────────────────────────────────────
  const stockBadge =
    product.stock === 0
      ? { label: 'Out of Stock', cls: 'bg-red-100 text-red-600' }
      : product.stock < 10
      ? { label: `Only ${product.stock} left!`, cls: 'bg-amber-100 text-amber-700' }
      : { label: 'In Stock', cls: 'bg-green-100 text-green-700' }

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Breadcrumb ── */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-xs text-gray-500 flex-wrap">
          <Link href="/"    className="hover:text-[#ff3f6c] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#ff3f6c] transition-colors">Shop</Link>
          <span>/</span>
          <Link
            href={`/shop?category=${product.category}`}
            className="hover:text-[#ff3f6c] transition-colors capitalize"
          >
            {product.category.replace(/-/g, ' ')}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-[200px]">
            {product.title}
          </span>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* LEFT — Image Gallery */}
          <ImageGallery images={product.images} thumbnail={product.thumbnail} title={product.title} />

          {/* RIGHT — Product Info */}
          <div className="flex flex-col gap-5">

            {/* Brand + badges row */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                {product.brand}
              </span>
              {discount > 0 && (
                <span className="rounded-full bg-[#fff0f3] text-[#ff3f6c] text-xs font-bold px-2.5 py-0.5">
                  {discount}% OFF
                </span>
              )}
              <span className={`rounded-full text-xs font-semibold px-2.5 py-0.5 ${stockBadge.cls}`}>
                {stockBadge.label}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug">
              {product.title}
            </h1>

            {/* Rating row */}
            <div className="flex items-center gap-3 flex-wrap">
              <RatingStars rating={product.rating} />
              <span className="text-sm font-semibold text-gray-800">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-400">
                ({product.reviews?.length ?? Math.floor(product.rating * 20)} reviews)
              </span>
              <span className="text-sm text-[#ff3f6c] font-semibold">
                🔥 {product.stock * 3}+ sold this week
              </span>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100" />

            {/* Price */}
            <div className="flex items-end gap-3 flex-wrap">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(discountedPrice)}
              </span>
              {discount > 0 && (
                <>
                  <span className="text-lg text-gray-400 line-through mb-0.5">
                    {formatPrice(product.price)}
                  </span>
                  <span className="mb-0.5 rounded-md bg-green-50 text-green-700 text-sm font-semibold px-2 py-0.5">
                    Save {formatPrice(savings)}
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-gray-500 -mt-3">
              Inclusive of all taxes &nbsp;·&nbsp; Free delivery above ₹999
            </p>

            {/* Divider */}
            <div className="h-px bg-gray-100" />

            {/* Color selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-800">
                  Color:&nbsp;
                  <span className="font-normal text-gray-500">{selectedColor.name}</span>
                </span>
              </div>
              <div className="flex gap-2.5">
                {COLORS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    title={c.name}
                    className={`
                      w-8 h-8 rounded-full border-2 transition-all duration-200
                      ${selectedColor.name === c.name
                        ? 'border-gray-900 scale-110 shadow-md'
                        : 'border-transparent hover:border-gray-300'}
                    `}
                    style={{ background: c.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div>
              {(product.category !== "womens-jewellery" && product.category !== 'womens-bags' ) && <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-800">
                  Size:&nbsp;
                  <span className="font-normal text-gray-500">{selectedSize}</span>
                </span>
                <button className="text-xs text-[#ff3f6c] font-semibold underline underline-offset-2 hover:no-underline">
                  Size Guide
                </button>
              </div>}
              <div className="flex flex-wrap gap-2">
                {(product.category !== "womens-jewellery" && product.category !== 'womens-bags' ) && SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`
                      min-w-[44px] rounded-xl border-2 px-3 py-2 text-sm font-semibold transition-all duration-200
                      ${selectedSize === size
                        ? 'border-gray-900 bg-gray-900 text-white shadow-md scale-105'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'}
                    `}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <span className="text-sm font-semibold text-gray-800 block mb-3">Quantity</span>
              <div className="flex items-center gap-0 border-2 border-gray-200 rounded-xl w-fit overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2.5 text-xl font-light hover:bg-gray-50 transition-colors text-gray-700"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-12 text-center text-sm font-bold text-gray-900 border-x-2 border-gray-200 py-2.5">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-4 py-2.5 text-xl font-light hover:bg-gray-50 transition-colors text-gray-700"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              {product.stock < 10 && product.stock > 0 && (
                <p className="mt-2 text-xs text-amber-600 font-medium">
                  ⚠️ Only {product.stock} items left in stock
                </p>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3 flex-col sm:flex-row">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 rounded-2xl border-2 border-gray-900 bg-white py-3.5 text-sm font-bold text-gray-900 transition-all hover:bg-gray-900 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                🛍️ Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 rounded-2xl bg-[#ff3f6c] py-3.5 text-sm font-bold text-white transition-all hover:bg-[#e03560] shadow-lg shadow-rose-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ⚡ Buy Now
              </button>
            </div>

            {/* Wishlist + Share row */}
            <div className="flex gap-3">
              <button
                onClick={handleWishlist}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-gray-100 bg-white py-3 text-sm font-semibold text-gray-700 hover:border-[#ff3f6c] hover:text-[#ff3f6c] transition-all"
              >
                {isWishlisted ? '❤️' : '🤍'}
                {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 rounded-2xl border-2 border-gray-100 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:border-gray-300 transition-all"
              >
                🔗 Share
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 rounded-2xl bg-gray-50 p-4 mt-1">
              {[
                { icon: '🚚', label: 'Free Delivery', sub: 'Above ₹999' },
                { icon: '↩️', label: 'Easy Returns', sub: '30 days' },
                { icon: '🔒', label: 'Secure Pay', sub: '100% safe' },
              ].map((b) => (
                <div key={b.label} className="flex flex-col items-center text-center gap-1">
                  <span className="text-xl">{b.icon}</span>
                  <span className="text-xs font-semibold text-gray-800">{b.label}</span>
                  <span className="text-[10px] text-gray-500">{b.sub}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── Tabs: Product Details / Reviews / Shipping ── */}
        <div className="mt-14">
          <div className="flex gap-0 border-b border-gray-200 overflow-x-auto hide-scrollbar">
            {['details', 'reviews', 'shipping'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  whitespace-nowrap px-6 py-3.5 text-sm font-semibold capitalize border-b-2 transition-all
                  ${activeTab === tab
                    ? 'border-[#ff3f6c] text-[#ff3f6c]'
                    : 'border-transparent text-gray-500 hover:text-gray-800'}
                `}
              >
                {tab === 'details'  && '📋 Product Details'}
                {tab === 'reviews'  && `⭐ Reviews (${product.reviews?.length ?? Math.floor(product.rating * 20)})`}
                {tab === 'shipping' && '🚚 Shipping & Returns'}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {activeTab === 'details'  && <DetailsTab product={product} />}
            {activeTab === 'reviews'  && <ReviewsSection product={product} />}
            {activeTab === 'shipping' && <ShippingTab product={product} />}
          </div>
        </div>

        {/* ── Similar Products ── */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">You May Also Like</h2>
              <Link
                href={`/shop?category=${product.category}`}
                className="text-sm text-[#ff3f6c] font-semibold hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function RatingStars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-base ${star <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`}
        >
          ★
        </span>
      ))}
    </div>
  )
}

function DetailsTab({ product }) {
  const rows = [
    { label: 'Brand',             value: product.brand },
    { label: 'Category',          value: product.category?.replace(/-/g, ' ') },
    { label: 'SKU',               value: product.meta?.barcode ?? `DK-${product.id}` },
    { label: 'Stock',             value: `${product.stock} units` },
    { label: 'Min Order Qty',     value: product.minimumOrderQuantity ?? 1 },
    { label: 'Warranty',          value: product.warrantyInformation ?? '1 Year Manufacturer Warranty' },
    { label: 'Return Policy',     value: product.returnPolicy ?? '30-day return policy' },
  ].filter((r) => r.value)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Description */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">About this product</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>

        {product.tags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600 capitalize"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Specs table */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Specifications</h3>
        <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 overflow-hidden">
          {rows.map((row) => (
            <div key={row.label} className="flex">
              <div className="w-40 shrink-0 bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {row.label}
              </div>
              <div className="flex-1 px-4 py-3 text-sm text-gray-800 capitalize">
                {row.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ShippingTab({ product }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
      {[
        {
          icon: '🚚',
          title: 'Standard Delivery',
          desc: product.shippingInformation ?? 'Ships within 3–5 business days. Free on orders above ₹999.',
        },
        {
          icon: '⚡',
          title: 'Express Delivery',
          desc: 'Available at checkout for ₹99 extra. Delivery within 1–2 business days.',
        },
        {
          icon: '↩️',
          title: 'Returns & Exchanges',
          desc: product.returnPolicy ?? '30-day hassle-free returns. Item must be unworn with original tags.',
        },
        {
          icon: '🔒',
          title: 'Secure Payments',
          desc: 'All transactions secured with 256-bit SSL encryption. We never store card details.',
        },
      ].map((item) => (
        <div
          key={item.title}
          className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5"
        >
          <span className="text-2xl shrink-0">{item.icon}</span>
          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-1">{item.title}</h4>
            <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}