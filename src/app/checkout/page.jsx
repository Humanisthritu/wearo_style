'use client'
// src/app/checkout/page.js

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import {
  selectCartItems, selectCartSubtotal,
  selectCartDiscount, selectCartTotal, clearCart,
} from '@/redux/slices/cartSlice'
import { selectIsAuthenticated } from '@/redux/slices/authSlice'
import { useToast } from '@/context/AppContext'
import { formatPrice } from '@/utils'

import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'
import AddIcon from '@mui/icons-material/Add'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import { selectAllAddresses } from '@/redux/slices/addressSlice'
import { placeOrder } from '@/redux/slices/ordersSlice'

// ── Mock saved addresses ───────────────────────────────────────────────────────
// const addresses = [
//   {
//     id: '1', label: 'Home', name: 'Rahul Sharma', phone: '9876543210',
//     line1: 'Flat 4B, Sunshine Apartments, 12th Cross',
//     line2: 'Indiranagar', city: 'Bengaluru', state: 'Karnataka',
//     pincode: '560038', isDefault: true,
//   },
//   {
//     id: '2', label: 'Work', name: 'Rahul Sharma', phone: '9876543210',
//     line1: '3rd Floor, Tech Park, Outer Ring Road',
//     line2: 'Marathahalli', city: 'Bengaluru', state: 'Karnataka',
//     pincode: '560037', isDefault: false,
//   },
// ]

const STEPS = [
  { id: 1, label: 'Address', icon: <LocationOnOutlinedIcon fontSize="small" /> },
  { id: 2, label: 'Payment', icon: <PaymentOutlinedIcon fontSize="small" /> },
  { id: 3, label: 'Confirm', icon: <VerifiedOutlinedIcon fontSize="small" /> },
]

const DELIVERY_OPTIONS = [
  { id: 'standard', label: 'Standard Delivery', sub: '3–5 business days', price: 0, badge: 'FREE' },
  { id: 'express', label: 'Express Delivery', sub: '1–2 business days', price: 99, badge: '⚡ Fast' },
]

export default function CheckoutPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { showToast } = useToast()
  const isAuth = useAppSelector(selectIsAuthenticated)
  const items = useAppSelector(selectCartItems)
  const subtotal = useAppSelector(selectCartSubtotal)
  const discount = useAppSelector(selectCartDiscount)
  const cartTotal = useAppSelector(selectCartTotal)
  const addresses = useAppSelector(selectAllAddresses)
  const [orderSummary, setOrderSummary] = useState(null)
  console.log(items, "items checkout")

  // ── Step state ────────────────────────────────────────────────────────────
  const [step, setStep] = useState(1)

  // ── Step 1: Address ───────────────────────────────────────────────────────
  const [selectedAddressId, setSelectedAddressId] = useState('1')
  const [delivery, setDelivery] = useState('standard')
  const [showNewAddr, setShowNewAddr] = useState(false)
  const [newAddr, setNewAddr] = useState({
    name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '',
  })

  // ── Step 2: Payment ───────────────────────────────────────────────────────
  const [payMethod, setPayMethod] = useState('card')
  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvv: '' })
  const [upiId, setUpiId] = useState('')
  const [showCvv, setShowCvv] = useState(false)
  const [processing, setProcessing] = useState(false)

  // ── Step 3: Order placed ──────────────────────────────────────────────────
  const [orderId, setOrderId] = useState(null)

  // ── Derived ───────────────────────────────────────────────────────────────
  const deliveryCharge = delivery === 'express' ? 99 : 0
  const grandTotal = cartTotal + deliveryCharge
  const selectedAddr = addresses.find((a) => a.id === selectedAddressId)

  // ── Guards ────────────────────────────────────────────────────────────────
  if (!isAuth) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Please login to continue to checkout</p>
        <Link href="/login?from=/checkout"
          className="px-5 py-2.5 bg-[#ff3f6c] text-white text-sm font-medium rounded-xl">
          Sign in
        </Link>
      </div>
    )
  }

  if (items.length === 0 && step < 3) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Your cart is empty</p>
        <Link href="/shop" className="px-5 py-2.5 bg-[#ff3f6c] text-white text-sm font-medium rounded-xl">
          Shop now
        </Link>
      </div>
    )
  }

  // ── Step 1 → 2 ────────────────────────────────────────────────────────────
  function handleAddressContinue() {
    if (showNewAddr) {
      const { name, phone, line1, city, state, pincode } = newAddr
      if (!name || !phone || !line1 || !city || !state || !pincode) {
        showToast('Please fill all required address fields', 'error'); return
      }
    } else if (!selectedAddressId) {
      showToast('Please select or add a delivery address', 'error'); return
    }
    setStep(2)
    window.scrollTo(0, 0)
  }
  // ── Step 2 → 3 (place order) ──────────────────────────────────────────────
  async function handlePlaceOrder() {
    if (payMethod === 'card') {
      if (!card.name) { showToast('Enter name on card', 'error'); return }
      if (card.number.replace(/\s/g, '').length < 16) { showToast('Enter valid card number', 'error'); return }
      if (!card.expiry) { showToast('Enter expiry date', 'error'); return }
      if (!card.cvv) { showToast('Enter CVV', 'error'); return }
    }
    if (payMethod === 'upi' && !upiId.includes('@')) {
      showToast('Enter a valid UPI ID (e.g. user@okaxis)', 'error'); return
    }

    const orderAddress = showNewAddr
      ? { id: 'new', label: 'Delivery', ...newAddr, country: 'India', isDefault: false }
      : selectedAddr

    if (!orderAddress) {
      showToast('No delivery address selected', 'error'); return
    }

    setProcessing(true)
    await new Promise((r) => setTimeout(r, 1800))

    const id = 'DK' + Date.now().toString().slice(-8)
    const codCharge = payMethod === 'cod' ? 50 : 0
    const finalDelivery = deliveryCharge + codCharge
    const finalTotal = grandTotal + codCharge

    // 📌 Snapshot everything BEFORE clearing the cart, so the confirmation
    // screen isn't reading post-clear (zeroed-out) selectors.
    setOrderSummary({
      subtotal,
      discount,
      deliveryCharge: finalDelivery,
      grandTotal: finalTotal,
      address: orderAddress,
      deliveryOption: delivery,
    })

    dispatch(placeOrder({
      orderId: id,
      items,
      address: orderAddress,
      paymentMethod: payMethod,
      subtotal,
      discount,
      deliveryCharge: finalDelivery,
      couponCode: null,
      grandTotal: finalTotal,
    }))

    dispatch(clearCart())
    setOrderId(id)
    setStep(3)
    setProcessing(false)
    window.scrollTo(0, 0)
  }

  // ── Card number formatter ─────────────────────────────────────────────────
  function formatCardNumber(val) {
    return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  }

  function formatExpiry(val) {
    const v = val.replace(/\D/g, '').slice(0, 4)
    return v.length >= 3 ? v.slice(0, 2) + '/' + v.slice(2) : v
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* ── Stepper ── */}
      <div className="flex items-center justify-center gap-0 mb-10">
        {STEPS.map((s, i) => {
          const done = step > s.id
          const active = step === s.id
          return (
            <div key={s.id} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all
                  ${done ? 'bg-green-500 border-green-500 text-white'
                    : active ? 'bg-[#ff3f6c] border-[#ff3f6c] text-white'
                      : 'bg-white border-gray-200 text-gray-400'}`}>
                  {done ? <CheckCircleIcon style={{ fontSize: 18 }} /> : s.icon}
                </div>
                <span className={`text-[11px] font-medium ${active ? 'text-[#ff3f6c]' : done ? 'text-green-600' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-20 sm:w-32 h-0.5 mx-2 mb-5 transition-all ${step > s.id ? 'bg-green-400' : 'bg-gray-100'}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* ── Success screen ── */}
      {step === 3 && (
        <div className="max-w-lg mx-auto text-center py-10">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircleIcon style={{ fontSize: 44, color: '#22c55e' }} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed! 🎉</h1>
          <p className="text-gray-500 mb-1">Your order has been confirmed</p>
          <p className="text-sm font-mono font-bold text-[#ff3f6c] mb-6">#{orderId}</p>

          {orderSummary && (
            <>
              <div className="bg-gray-50 rounded-2xl p-5 text-left mb-6">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Order summary</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span><span>{formatPrice(orderSummary.subtotal)}</span>
                  </div>
                  {orderSummary.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span><span>−{formatPrice(orderSummary.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span>{orderSummary.deliveryCharge ? formatPrice(orderSummary.deliveryCharge) : 'Free'}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total paid</span><span>{formatPrice(orderSummary.grandTotal)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-sm text-blue-700 mb-6 text-left">
                <p className="font-semibold mb-1">📦 Estimated delivery</p>
                <p className="text-blue-600">
                  {orderSummary.deliveryOption === 'express' ? '1–2 business days' : '3–5 business days'}
                </p>
                {orderSummary.address && (
                  <p className="text-blue-500 text-xs mt-1">
                    to {orderSummary.address.line1}, {orderSummary.address.city}
                  </p>
                )}
              </div>
            </>
          )}

          <div className="flex gap-3">
            <Link href="/orders"
              className="flex-1 py-3 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:border-gray-400 transition-colors text-center">
              Track order
            </Link>
            <Link href="/shop"
              className="flex-1 py-3 bg-[#ff3f6c] text-white text-sm font-medium rounded-xl hover:bg-[#e03560] transition-colors text-center">
              Continue shopping
            </Link>
          </div>
        </div>
      )}

      {/* ── Steps 1 & 2 ── */}
      {step < 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">

          {/* ── LEFT ── */}
          <div>

            {/* ════ STEP 1: Address ════ */}
            {step === 1 && (
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                  <LocationOnOutlinedIcon fontSize="small" className="text-[#ff3f6c]" />
                  <h2 className="text-sm font-semibold text-gray-900">Delivery Address</h2>
                </div>

                <div className="p-5 flex flex-col gap-3">
                  {/* Saved addresses */}
                  {addresses.map((addr) => (
                    <label key={addr.id}
                      className={`flex gap-4 p-4 rounded-xl border cursor-pointer transition-all
                        ${selectedAddressId === addr.id && !showNewAddr
                          ? 'border-[#ff3f6c] bg-[#fff0f3]'
                          : 'border-gray-100 hover:border-gray-200'}`}
                      onClick={() => { setSelectedAddressId(addr.id); setShowNewAddr(false) }}
                    >
                      <input type="radio" name="address" value={addr.id}
                        checked={selectedAddressId === addr.id && !showNewAddr}
                        onChange={() => { }}
                        className="mt-0.5 accent-[#ff3f6c] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                            ${addr.label === 'Home' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                            {addr.label === 'Home' ? <HomeOutlinedIcon style={{ fontSize: 10 }} /> : <WorkOutlineIcon style={{ fontSize: 10 }} />} {addr.label}
                          </span>
                          {addr.isDefault && (
                            <span className="text-[10px] text-[#ff3f6c] font-semibold">Default</span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-gray-900">{addr.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                        <p className="text-xs text-gray-500">{addr.city}, {addr.state} — {addr.pincode}</p>
                        <p className="text-xs text-gray-400 mt-0.5">📞 +91 {addr.phone}</p>
                      </div>
                    </label>
                  ))}

                  {/* Add new address toggle */}
                  <button onClick={() => { setShowNewAddr((v) => !v); setSelectedAddressId(null) }}
                    className={`flex items-center gap-2 p-4 rounded-xl border transition-all text-sm font-medium
                      ${showNewAddr ? 'border-[#ff3f6c] bg-[#fff0f3] text-[#ff3f6c]' : 'border-dashed border-gray-200 text-gray-500 hover:border-gray-400'}`}>
                    <AddIcon fontSize="small" /> Add a new address
                  </button>

                  {/* Inline new address form */}
                  {showNewAddr && (
                    <div className="border border-gray-100 rounded-xl p-4 flex flex-col gap-3 bg-gray-50">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelCls}>Full Name *</label>
                          <input value={newAddr.name} onChange={(e) => setNewAddr((f) => ({ ...f, name: e.target.value }))}
                            placeholder="Rahul Sharma" className={inputCls()} />
                        </div>
                        <div>
                          <label className={labelCls}>Phone *</label>
                          <input type="tel" value={newAddr.phone}
                            onChange={(e) => setNewAddr((f) => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                            placeholder="9876543210" className={inputCls()} />
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>Address Line 1 *</label>
                        <input value={newAddr.line1} onChange={(e) => setNewAddr((f) => ({ ...f, line1: e.target.value }))}
                          placeholder="Flat, building, street" className={inputCls()} />
                      </div>
                      <div>
                        <label className={labelCls}>Address Line 2</label>
                        <input value={newAddr.line2} onChange={(e) => setNewAddr((f) => ({ ...f, line2: e.target.value }))}
                          placeholder="Area, landmark" className={inputCls()} />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className={labelCls}>City *</label>
                          <input value={newAddr.city} onChange={(e) => setNewAddr((f) => ({ ...f, city: e.target.value }))}
                            placeholder="Bengaluru" className={inputCls()} />
                        </div>
                        <div>
                          <label className={labelCls}>State *</label>
                          <input value={newAddr.state} onChange={(e) => setNewAddr((f) => ({ ...f, state: e.target.value }))}
                            placeholder="Karnataka" className={inputCls()} />
                        </div>
                        <div>
                          <label className={labelCls}>Pincode *</label>
                          <input type="tel" value={newAddr.pincode}
                            onChange={(e) => setNewAddr((f) => ({ ...f, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                            placeholder="560001" className={inputCls()} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Delivery option */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-1">Delivery option</p>
                    <div className="flex flex-col gap-2">
                      {DELIVERY_OPTIONS.map((opt) => (
                        <label key={opt.id}
                          className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all
                            ${delivery === opt.id ? 'border-[#ff3f6c] bg-[#fff0f3]' : 'border-gray-100 hover:border-gray-200'}`}>
                          <input type="radio" name="delivery" value={opt.id}
                            checked={delivery === opt.id} onChange={() => setDelivery(opt.id)}
                            className="accent-[#ff3f6c]" />
                          <LocalShippingOutlinedIcon fontSize="small"
                            className={delivery === opt.id ? 'text-[#ff3f6c]' : 'text-gray-400'} />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{opt.label}</p>
                            <p className="text-xs text-gray-500">{opt.sub}</p>
                          </div>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                            ${opt.price === 0 ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                            {opt.badge}
                          </span>
                          {opt.price > 0 && (
                            <span className="text-sm font-semibold text-gray-900">{formatPrice(opt.price)}</span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>

                  <button onClick={handleAddressContinue}
                    className="w-full py-3 bg-[#ff3f6c] text-white text-sm font-medium rounded-xl hover:bg-[#e03560] transition-colors mt-1">
                    Continue to Payment →
                  </button>
                </div>
              </div>
            )}

            {/* ════ STEP 2: Payment ════ */}
            {step === 2 && (
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <PaymentOutlinedIcon fontSize="small" className="text-[#ff3f6c]" />
                    <h2 className="text-sm font-semibold text-gray-900">Payment Method</h2>
                  </div>
                  <button onClick={() => setStep(1)}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors">
                    <EditOutlinedIcon style={{ fontSize: 14 }} /> Edit address
                  </button>
                </div>

                {/* Selected address summary */}
                {selectedAddr && (
                  <div className="mx-5 mt-4 flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                    <CheckCircleIcon style={{ fontSize: 16, color: '#22c55e', marginTop: 2 }} />
                    <div className="text-xs text-green-800">
                      <p className="font-semibold">{selectedAddr.name}</p>
                      <p className="text-green-700">{selectedAddr.line1}, {selectedAddr.city} — {selectedAddr.pincode}</p>
                    </div>
                  </div>
                )}

                <div className="p-5">
                  {/* Payment method tabs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
                    {[
                      { id: 'card', icon: '💳', label: 'Card' },
                      { id: 'upi', icon: '📱', label: 'UPI' },
                      { id: 'netbanking', icon: '🏦', label: 'Net Banking' },
                      { id: 'cod', icon: '💵', label: 'COD' },
                    ].map((m) => (
                      <button key={m.id} onClick={() => setPayMethod(m.id)}
                        className={`py-2.5 rounded-xl border text-xs font-medium transition-all flex flex-col items-center gap-1
                          ${payMethod === m.id
                            ? 'border-[#ff3f6c] bg-[#fff0f3] text-[#ff3f6c]'
                            : 'border-gray-100 text-gray-600 hover:border-gray-300'}`}>
                        <span className="text-lg">{m.icon}</span> {m.label}
                      </button>
                    ))}
                  </div>

                  {/* Card form */}
                  {payMethod === 'card' && (
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className={labelCls}>Name on card</label>
                        <input value={card.name} onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))}
                          placeholder="Rahul Sharma" className={inputCls()} autoComplete="cc-name" />
                      </div>
                      <div>
                        <label className={labelCls}>Card number</label>
                        <input value={card.number}
                          onChange={(e) => setCard((c) => ({ ...c, number: formatCardNumber(e.target.value) }))}
                          placeholder="4242  4242  4242  4242" maxLength={19}
                          className={inputCls() + ' font-mono tracking-widest'} autoComplete="cc-number" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelCls}>Expiry</label>
                          <input value={card.expiry}
                            onChange={(e) => setCard((c) => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                            placeholder="MM/YY" maxLength={5}
                            className={inputCls() + ' font-mono'} autoComplete="cc-exp" />
                        </div>
                        <div>
                          <label className={labelCls}>CVV</label>
                          <div className="relative">
                            <input type={showCvv ? 'text' : 'password'} value={card.cvv}
                              onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                              placeholder="•••" maxLength={4}
                              className={inputCls() + ' font-mono pr-9'} autoComplete="cc-csc" />
                            <button type="button" onClick={() => setShowCvv((v) => !v)}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                              {showCvv
                                ? <VisibilityOffOutlinedIcon style={{ fontSize: 16 }} />
                                : <VisibilityOutlinedIcon style={{ fontSize: 16 }} />}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <input type="checkbox" id="save-card" className="accent-[#ff3f6c] w-3.5 h-3.5" />
                        <label htmlFor="save-card" className="text-xs text-gray-500 cursor-pointer">
                          Save this card for future payments
                        </label>
                      </div>
                    </div>
                  )}

                  {/* UPI form */}
                  {payMethod === 'upi' && (
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className={labelCls}>UPI ID</label>
                        <input value={upiId} onChange={(e) => setUpiId(e.target.value)}
                          placeholder="yourname@okaxis"
                          className={inputCls() + ' font-mono'} />
                      </div>
                      <div className="flex items-center gap-3">
                        {['PhonePe', 'GPay', 'Paytm', 'BHIM'].map((app) => (
                          <button key={app} onClick={() => showToast(`Opening ${app}…`)}
                            className="flex-1 py-2 border border-gray-100 rounded-lg text-xs text-gray-600 hover:border-[#ff3f6c] hover:text-[#ff3f6c] transition-colors">
                            {app}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Net Banking */}
                  {payMethod === 'netbanking' && (
                    <div className="grid grid-cols-3 gap-2">
                      {['HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak', 'Others'].map((bank) => (
                        <button key={bank}
                          className="py-2.5 border border-gray-100 rounded-xl text-xs font-medium text-gray-600 hover:border-[#ff3f6c] hover:text-[#ff3f6c] transition-colors">
                          {bank}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* COD */}
                  {payMethod === 'cod' && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                      <p className="text-sm font-semibold text-amber-800 mb-1">Cash on Delivery</p>
                      <p className="text-xs text-amber-700">Pay ₹50 extra as COD handling charges. Pay when your order arrives.</p>
                    </div>
                  )}

                  {/* Secure badge */}
                  <div className="flex items-center justify-center gap-2 mt-5 text-xs text-gray-400">
                    <LockOutlinedIcon style={{ fontSize: 14 }} />
                    <span>Secured with 256-bit SSL encryption</span>
                  </div>

                  {/* Place order button */}
                  <button onClick={handlePlaceOrder} disabled={processing}
                    className="w-full mt-4 py-3.5 bg-[#ff3f6c] text-white text-sm font-semibold rounded-xl hover:bg-[#e03560] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                    {processing ? <><Spin /> Processing payment…</> : `Pay ${formatPrice(grandTotal + (payMethod === 'cod' ? 50 : 0))} →`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Order summary ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 sticky top-20">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Order Summary</h2>

            {/* Items */}
            <div className="flex flex-col gap-3 mb-4 max-h-52 overflow-y-auto">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-12 h-14 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                    <img src={item.product.thumbnail} alt={item.product.title}
                      className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">{item.product.title}</p>
                    <p className="text-[10px] text-gray-400">Size: {item.size} · Qty: {item.quantity}</p>
                  </div>
                  <p className="text-xs font-semibold text-gray-900 shrink-0">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm border-t border-gray-100 pt-3">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal ({items.reduce((a, c) => a + c.quantity, 0)} items)</span>
                <span className="text-gray-800">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>−{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500">
                <span>Delivery</span>
                <span className={deliveryCharge === 0 ? 'text-green-600' : 'text-gray-800'}>
                  {deliveryCharge === 0 ? 'Free' : formatPrice(deliveryCharge)}
                </span>
              </div>
              {payMethod === 'cod' && step === 2 && (
                <div className="flex justify-between text-amber-600">
                  <span>COD charges</span>
                  <span>+₹50</span>
                </div>
              )}
            </div>

            <div className="flex justify-between text-sm font-bold text-gray-900 border-t border-gray-100 pt-3 mt-2">
              <span>Total</span>
              <span className="text-base">{formatPrice(grandTotal + (payMethod === 'cod' && step === 2 ? 50 : 0))}</span>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              {[
                { icon: '🔒', text: 'Secure payment' },
                { icon: '↩️', text: '30-day return' },
                { icon: '🚚', text: 'Fast delivery' },
              ].map((b) => (
                <div key={b.text} className="bg-gray-50 rounded-xl py-2.5 px-1 flex flex-col items-center gap-1">
                  <span className="text-base">{b.icon}</span>
                  <span className="text-[10px] text-gray-400 text-center leading-tight">{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── helpers ───────────────────────────────────────────────────────────────────

const labelCls = 'text-[10px] font-medium text-gray-400 uppercase tracking-wider block mb-1.5'

const inputCls = (error) =>
  `w-full border rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors bg-gray-50
   ${error ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-[#ff3f6c] focus:bg-white'}`

function Spin() {
  return (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}