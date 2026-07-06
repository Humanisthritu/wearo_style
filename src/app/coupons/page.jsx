'use client'
// src/app/coupons/page.js

import { useState } from 'react'
import { useAppDispatch } from '@/hooks/redux'
import { applyCoupon } from '@/redux/slices/cartSlice'
import { useToast } from '@/context/AppContext'
import Link from 'next/link'

import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import FlashOnIcon from '@mui/icons-material/FlashOn'
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined'
import PercentIcon from '@mui/icons-material/Percent'

const COUPONS = [
  {
    code:        'DRIP20',
    title:       '20% Off on All Orders',
    description: 'Get flat 20% off on your entire cart. No minimum order value.',
    discount:    '20%',
    type:        'percent',
    minOrder:    0,
    maxDiscount: 500,
    expiry:      '2024-12-31',
    category:    'all',
    color:       { bg: '#fff0f3', border: '#ffd6df', accent: '#ff3f6c', tag: 'Most Popular' },
  },
  {
    code:        'STYLE10',
    title:       '10% Off Sitewide',
    description: 'Enjoy 10% discount on everything. Valid on all categories.',
    discount:    '10%',
    type:        'percent',
    minOrder:    499,
    maxDiscount: 300,
    expiry:      '2024-11-30',
    category:    'all',
    color:       { bg: '#f0f4ff', border: '#c7d7ff', accent: '#3b5bdb', tag: 'Sitewide' },
  },
  {
    code:        'FIRST15',
    title:       '15% Off — First Order',
    description: 'Welcome offer! Get 15% off on your very first purchase.',
    discount:    '15%',
    type:        'percent',
    minOrder:    299,
    maxDiscount: 400,
    expiry:      '2024-12-31',
    category:    'all',
    color:       { bg: '#f0fff4', border: '#b2f2bb', accent: '#2f9e44', tag: 'New User' },
  },
  {
    code:        'FREESHIP',
    title:       'Free Delivery on Any Order',
    description: 'No minimum order — get free shipping on your cart regardless of value.',
    discount:    'FREE',
    type:        'shipping',
    minOrder:    0,
    maxDiscount: 99,
    expiry:      '2024-10-31',
    category:    'shipping',
    color:       { bg: '#fff8f0', border: '#ffd8a8', accent: '#e67700', tag: 'Delivery' },
  },
  {
    code:        'FASHION30',
    title:       '30% Off on Clothing',
    description: 'Exclusive discount on all clothing items. Not valid on footwear.',
    discount:    '30%',
    type:        'percent',
    minOrder:    999,
    maxDiscount: 750,
    expiry:      '2024-09-30',
    category:    'clothing',
    color:       { bg: '#fdf4ff', border: '#e9d5ff', accent: '#7c3aed', tag: 'Clothing' },
  },
  {
    code:        'WEEKEND50',
    title:       'Weekend Special — Flat ₹200 Off',
    description: 'Flat ₹200 off on orders above ₹799. Valid Sat & Sun only.',
    discount:    '₹200',
    type:        'flat',
    minOrder:    799,
    maxDiscount: 200,
    expiry:      '2024-12-29',
    category:    'all',
    color:       { bg: '#fff5f5', border: '#fed7d7', accent: '#c53030', tag: 'Weekend' },
  },
]

const OFFERS = [
  { icon: '🏦', title: 'HDFC Bank Cards',         desc: 'Extra 10% off (max ₹500) on HDFC credit & debit cards on orders ₹1500+' },
  { icon: '📱', title: 'PhonePe & GPay',           desc: 'Flat ₹50 off on UPI payments via PhonePe or Google Pay on first transaction' },
  { icon: '🎓', title: 'Student Offer',            desc: 'Verify your student ID and get an additional 5% off on every order' },
  { icon: '🔄', title: 'Subscribe & Save',         desc: 'Subscribe to DripKart Pro and get free delivery + 5% extra on all orders' },
]

export default function CouponsPage() {
  const dispatch      = useAppDispatch()
  const { showToast } = useToast()
  const [copiedCode,  setCopiedCode]  = useState(null)
  const [appliedCode, setAppliedCode] = useState(null)
  const [manualCode,  setManualCode]  = useState('')

  function handleCopy(code) {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopiedCode(code)
    showToast(`Code ${code} copied! 📋`)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  function handleApply(code) {
    dispatch(applyCoupon(code))
    setAppliedCode(code)
    showToast(`Coupon ${code} applied to your cart! 🎉`)
  }

  function handleManualApply() {
    const code = manualCode.trim().toUpperCase()
    if (!code) return
    const valid = COUPONS.find((c) => c.code === code)
    if (valid) {
      handleApply(code)
      setManualCode('')
    } else {
      showToast('Invalid coupon code', 'error')
    }
  }

  function fmtDate(d) {
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const isExpired = (expiry) => new Date(expiry) < new Date()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Coupons & Offers</h1>
        <p className="text-xs text-gray-400 mt-0.5">{COUPONS.filter(c => !isExpired(c.expiry)).length} active coupons available</p>
      </div>

      {/* Manual coupon input */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6">
        <p className="text-sm font-semibold text-gray-900 mb-3">Have a coupon code?</p>
        <div className="flex gap-2">
          <input
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleManualApply()}
            placeholder="Enter coupon code e.g. DRIP20"
            className="flex-1 border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm font-mono uppercase tracking-widest text-gray-900 outline-none focus:border-[#ff3f6c] focus:bg-white transition-colors"
          />
          <button onClick={handleManualApply}
            className="px-5 py-2.5 bg-[#ff3f6c] text-white text-sm font-medium rounded-xl hover:bg-[#e03560] transition-colors">
            Apply
          </button>
        </div>
      </div>

      {/* Coupon cards */}
      <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <LocalOfferOutlinedIcon fontSize="small" className="text-[#ff3f6c]"/> Available Coupons
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {COUPONS.map((coupon) => {
          const expired = isExpired(coupon.expiry)
          const copied  = copiedCode  === coupon.code
          const applied = appliedCode === coupon.code

          return (
            <div
              key={coupon.code}
              className={`relative rounded-2xl border overflow-hidden transition-all ${expired ? 'opacity-50' : 'hover:shadow-md hover:-translate-y-0.5'}`}
              style={{ borderColor: coupon.color.border, background: coupon.color.bg }}
            >
              {/* Tag ribbon */}
              <div className="absolute top-3 right-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ background: coupon.color.accent }}>
                  {coupon.color.tag}
                </span>
              </div>

              <div className="p-5">
                {/* Discount amount */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold" style={{ color: coupon.color.accent }}>
                    {coupon.discount}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {coupon.type === 'flat' ? 'flat off' : coupon.type === 'shipping' ? 'shipping' : 'off'}
                  </span>
                </div>

                <p className="text-sm font-semibold text-gray-900 mb-1">{coupon.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">{coupon.description}</p>

                {/* Details */}
                <div className="flex flex-wrap gap-2 mb-4 text-[10px] text-gray-500">
                  {coupon.minOrder > 0 && (
                    <span className="bg-white/70 px-2 py-0.5 rounded-full border border-gray-200">
                      Min order ₹{coupon.minOrder}
                    </span>
                  )}
                  <span className="bg-white/70 px-2 py-0.5 rounded-full border border-gray-200">
                    Max discount ₹{coupon.maxDiscount}
                  </span>
                  <span className={`bg-white/70 px-2 py-0.5 rounded-full border ${expired ? 'border-red-200 text-red-500' : 'border-gray-200'}`}>
                    {expired ? 'Expired' : `Valid till ${fmtDate(coupon.expiry)}`}
                  </span>
                </div>

                {/* Dashed divider */}
                <div className="border-t border-dashed border-gray-300 my-3" />

                {/* Code + buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold tracking-widest"
                      style={{ color: coupon.color.accent }}>
                      {coupon.code}
                    </span>
                    <button onClick={() => handleCopy(coupon.code)} disabled={expired}
                      className="w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 hover:bg-white/80 transition-colors">
                      {copied ? <CheckIcon style={{ fontSize: 14, color: '#22a855' }}/> : <ContentCopyIcon style={{ fontSize: 14 }}/>}
                    </button>
                  </div>

                  <div className="flex gap-2">
                    {!expired && (
                      applied ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg">
                          <CheckIcon style={{ fontSize: 13 }}/> Applied
                        </span>
                      ) : (
                        <button onClick={() => handleApply(coupon.code)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-colors"
                          style={{ background: coupon.color.accent }}>
                          Apply to cart
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bank & payment offers */}
      <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <FlashOnIcon fontSize="small" className="text-amber-500"/> Bank & Payment Offers
      </h2>

      <div className="flex flex-col gap-3 mb-8">
        {OFFERS.map((offer) => (
          <div key={offer.title} className="flex items-start gap-4 bg-white border border-gray-100 rounded-2xl px-5 py-4 hover:border-gray-200 transition-colors">
            <span className="text-2xl shrink-0">{offer.icon}</span>
            <div>
              <p className="text-sm font-semibold text-gray-900">{offer.title}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{offer.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-white font-semibold mb-1">Ready to shop?</p>
          <p className="text-gray-400 text-sm">Apply your coupon at checkout</p>
        </div>
        <Link href="/shop"
          className="shrink-0 px-5 py-2.5 bg-[#ff3f6c] text-white text-sm font-medium rounded-xl hover:bg-[#e03560] transition-colors flex items-center gap-2">
          <ShoppingBagOutlinedIcon fontSize="small"/> Shop now
        </Link>
      </div>
    </div>
  )
}