'use client'
// src/app/profile/addresses/page.js

import { useState } from 'react'
import Link from 'next/link'
import { useAppSelector } from '@/hooks/redux'
import { selectIsAuthenticated } from '@/redux/slices/authSlice'
import { useToast } from '@/context/AppContext'

import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseIcon from '@mui/icons-material/Close'
import MyLocationIcon from '@mui/icons-material/MyLocation'

const INITIAL_ADDRESSES = [
  {
    id: '1',
    label: 'Home',
    name: 'Rahul Sharma',
    phone: '9876543210',
    line1: 'Flat 4B, Sunshine Apartments, 12th Cross',
    line2: 'Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    country: 'India',
    isDefault: true,
  },
  {
    id: '2',
    label: 'Work',
    name: 'Rahul Sharma',
    phone: '9876543210',
    line1: '3rd Floor, Tech Park, Outer Ring Road',
    line2: 'Marathahalli',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560037',
    country: 'India',
    isDefault: false,
  },
]

const EMPTY_FORM = {
  label: 'Home',
  name: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
  country: 'India',
  isDefault: false,
}

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Jammu & Kashmir','Ladakh',
]

export default function AddressesPage() {
  const { showToast } = useToast()
  const isAuth        = useAppSelector(selectIsAuthenticated)

  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES)
  const [showForm,  setShowForm]  = useState(false)
  const [editId,    setEditId]    = useState(null)   // null = new address
  const [form,      setForm]      = useState(EMPTY_FORM)
  const [errors,    setErrors]    = useState({})
  const [saving,    setSaving]    = useState(false)
  const [deleteId,  setDeleteId]  = useState(null)   // confirm delete

  if (!isAuth) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <LocationOnOutlinedIcon style={{ fontSize: 48, color: '#e5e7eb' }} />
        <p className="text-gray-500">Please login to manage addresses</p>
        <Link href="/login" className="px-5 py-2.5 bg-[#ff3f6c] text-white text-sm font-medium rounded-lg">
          Sign in
        </Link>
      </div>
    )
  }

  // ── helpers ────────────────────────────────────────────────────────────────

  function openNew() {
    setForm(EMPTY_FORM)
    setEditId(null)
    setErrors({})
    setShowForm(true)
  }

  function openEdit(addr) {
    setForm({ ...addr })
    setEditId(addr.id)
    setErrors({})
    setShowForm(true)
  }

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }))
  }

  function validate() {
    const errs = {}
    if (!form.name.trim())    errs.name    = 'Full name is required'
    if (!/^\d{10}$/.test(form.phone.replace(/\s/g, '')))
                              errs.phone   = 'Enter a valid 10-digit number'
    if (!form.line1.trim())   errs.line1   = 'Address line 1 is required'
    if (!form.city.trim())    errs.city    = 'City is required'
    if (!form.state)          errs.state   = 'State is required'
    if (!/^\d{6}$/.test(form.pincode)) errs.pincode = 'Enter a valid 6-digit pincode'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)
    await new Promise((r) => setTimeout(r, 500))

    if (editId) {
      // Update existing
      setAddresses((prev) =>
        prev.map((a) => {
          if (form.isDefault && a.id !== editId) return { ...a, isDefault: false }
          if (a.id === editId) return { ...form, id: editId }
          return a
        })
      )
      showToast('Address updated ✓')
    } else {
      // Add new
      const newAddr = { ...form, id: Date.now().toString() }
      setAddresses((prev) => {
        const updated = form.isDefault
          ? prev.map((a) => ({ ...a, isDefault: false }))
          : prev
        return [...updated, newAddr]
      })
      showToast('Address saved ✓')
    }

    setSaving(false)
    setShowForm(false)
  }

  function handleSetDefault(id) {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    )
    showToast('Default address updated')
  }

  function handleDelete(id) {
    setAddresses((prev) => prev.filter((a) => a.id !== id))
    setDeleteId(null)
    showToast('Address removed')
  }

  function labelIcon(label) {
    if (label === 'Home') return <HomeOutlinedIcon fontSize="small" />
    if (label === 'Work') return <WorkOutlineIcon fontSize="small" />
    return <LocationOnIcon fontSize="small" />
  }

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Saved Addresses</h1>
          <p className="text-xs text-gray-400 mt-0.5">{addresses.length} saved address{addresses.length !== 1 ? 'es' : ''}</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#ff3f6c] text-white text-sm font-medium rounded-xl hover:bg-[#e03560] transition-colors">
          <AddLocationAltOutlinedIcon fontSize="small" /> Add address
        </button>
      </div>

      {/* Address cards */}
      {addresses.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl">
          <LocationOnOutlinedIcon style={{ fontSize: 44, color: '#d1d5db' }} />
          <p className="mt-3 font-medium text-gray-600">No saved addresses</p>
          <p className="text-sm text-gray-400 mt-1 mb-4">Add an address for faster checkout</p>
          <button onClick={openNew}
            className="px-5 py-2.5 bg-[#ff3f6c] text-white text-sm font-medium rounded-xl hover:bg-[#e03560] transition-colors">
            Add your first address
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {addresses.map((addr) => (
            <div key={addr.id}
              className={`bg-white rounded-2xl border transition-all ${addr.isDefault ? 'border-[#ff3f6c] shadow-sm shadow-rose-100' : 'border-gray-100 hover:border-gray-200'}`}>
              <div className="p-5">
                {/* Top row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    {/* Label badge */}
                    <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full
                      ${addr.label === 'Home' ? 'bg-blue-50 text-blue-700'
                        : addr.label === 'Work' ? 'bg-purple-50 text-purple-700'
                        : 'bg-gray-100 text-gray-700'}`}>
                      {labelIcon(addr.label)} {addr.label}
                    </span>
                    {addr.isDefault && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-[#ff3f6c] bg-[#fff0f3] px-2 py-0.5 rounded-full">
                        <CheckCircleIcon style={{ fontSize: 11 }} /> Default
                      </span>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openEdit(addr)}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      <EditOutlinedIcon fontSize="small" />
                    </button>
                    <button onClick={() => setDeleteId(addr.id)}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <DeleteOutlineIcon fontSize="small" />
                    </button>
                  </div>
                </div>

                {/* Address details */}
                <p className="text-sm font-semibold text-gray-900">{addr.name}</p>
                <p className="text-sm text-gray-600 mt-0.5">{addr.line1}</p>
                {addr.line2 && <p className="text-sm text-gray-600">{addr.line2}</p>}
                <p className="text-sm text-gray-600">{addr.city}, {addr.state} — {addr.pincode}</p>
                <p className="text-sm text-gray-500 mt-1">📞 +91 {addr.phone}</p>

                {/* Set as default */}
                {!addr.isDefault && (
                  <button onClick={() => handleSetDefault(addr.id)}
                    className="mt-3 text-xs text-[#ff3f6c] font-medium hover:underline">
                    Set as default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add / Edit form drawer ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Form header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-base font-semibold text-gray-900">
                {editId ? 'Edit address' : 'Add new address'}
              </h2>
              <button onClick={() => setShowForm(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <CloseIcon fontSize="small" />
              </button>
            </div>

            <form onSubmit={handleSave} className="px-6 py-5 flex flex-col gap-4">

              {/* Label selector */}
              <div>
                <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider block mb-2">
                  Address type
                </label>
                <div className="flex gap-2">
                  {['Home', 'Work', 'Other'].map((l) => (
                    <button key={l} type="button" onClick={() => set('label', l)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-xl border transition-all
                        ${form.label === l
                          ? 'border-[#ff3f6c] bg-[#fff0f3] text-[#ff3f6c]'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      {labelIcon(l)} {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name + Phone */}
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Full Name *" error={errors.name}>
                  <input value={form.name} onChange={(e) => set('name', e.target.value)}
                    placeholder="Ritu Kujur" className={inputCls(errors.name)} />
                </FormField>
                <FormField label="Phone *" error={errors.phone}>
                  <input type="tel" value={form.phone}
                    onChange={(e) => set('phone', e.target.value.replace(/\D/g,'').slice(0,10))}
                    placeholder="9876543210" className={inputCls(errors.phone)} />
                </FormField>
              </div>

              {/* Address lines */}
              <FormField label="Address Line 1 *" error={errors.line1}>
                <input value={form.line1} onChange={(e) => set('line1', e.target.value)}
                  placeholder="Flat no., Building, Street name"
                  className={inputCls(errors.line1)} />
              </FormField>

              <FormField label="Address Line 2 (optional)">
                <input value={form.line2} onChange={(e) => set('line2', e.target.value)}
                  placeholder="Area, Landmark"
                  className={inputCls()} />
              </FormField>

              {/* City + Pincode */}
              <div className="grid grid-cols-2 gap-3">
                <FormField label="City *" error={errors.city}>
                  <input value={form.city} onChange={(e) => set('city', e.target.value)}
                    placeholder="Bengaluru" className={inputCls(errors.city)} />
                </FormField>
                <FormField label="Pincode *" error={errors.pincode}>
                  <input type="tel" value={form.pincode}
                    onChange={(e) => set('pincode', e.target.value.replace(/\D/g,'').slice(0,6))}
                    placeholder="560001" className={inputCls(errors.pincode)} />
                </FormField>
              </div>

              {/* State */}
              <FormField label="State *" error={errors.state}>
                <select value={form.state} onChange={(e) => set('state', e.target.value)}
                  className={inputCls(errors.state) + ' cursor-pointer'}>
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </FormField>

              {/* Detect location */}
              <button type="button"
                onClick={() => showToast('Location detection coming soon! 📍')}
                className="flex items-center justify-center gap-2 w-full py-2.5 border border-dashed border-gray-200 rounded-xl text-xs text-gray-500 hover:border-[#ff3f6c] hover:text-[#ff3f6c] transition-all">
                <MyLocationIcon fontSize="small" /> Use my current location
              </button>

              {/* Set as default */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input type="checkbox" checked={form.isDefault}
                  onChange={(e) => set('isDefault', e.target.checked)}
                  className="w-4 h-4 accent-[#ff3f6c] rounded" />
                <span className="text-sm text-gray-600">Set as default delivery address</span>
              </label>

              {/* Submit */}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:border-gray-400 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 bg-[#ff3f6c] text-white text-sm font-medium rounded-xl hover:bg-[#e03560] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving ? <><Spin /> Saving…</> : editId ? 'Update address' : 'Save address'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ── Delete confirmation modal ── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <DeleteOutlineIcon className="text-red-500" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 text-center mb-2">Remove address?</h3>
            <p className="text-sm text-gray-500 text-center mb-5">This address will be permanently deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:border-gray-400 transition-colors">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 bg-red-500 text-white text-sm font-medium rounded-xl hover:bg-red-600 transition-colors">
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

// ── helpers ───────────────────────────────────────────────────────────────────

function FormField({ label, error, children }) {
  return (
    <div>
      <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider block mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1 flex items-center gap-1">⚠ {error}</p>}
    </div>
  )
}

const inputCls = (error) =>
  `w-full border rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none transition-colors bg-gray-50
   ${error ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-[#ff3f6c] focus:bg-white'}`

function Spin() {
  return (
    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
    </svg>
  )
}