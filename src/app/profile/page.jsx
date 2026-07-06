'use client'
// src/app/profile/page.js

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { selectUser, selectIsAuthenticated, updateUser, logout } from '@/redux/slices/authSlice'
import { clearSession } from '@/utils/auth'
import { useToast } from '@/context/AppContext'

// MUI icons
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined'
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined'

export default function ProfilePage() {
  const router        = useRouter()
  const dispatch      = useAppDispatch()
  const { showToast } = useToast()
  const user          = useAppSelector(selectUser)
  const isAuth        = useAppSelector(selectIsAuthenticated)

  const [editing, setEditing] = useState(false)
  const [saving,  setSaving]  = useState(false)
  const [form, setForm] = useState({
    firstName: user?.firstName ?? '',
    lastName:  user?.lastName  ?? '',
    email:     user?.email     ?? '',
    phone:     user?.phone     ?? '',
    gender:    user?.gender    ?? '',
    birthDate: user?.birthDate ?? '',
  })

  if (!isAuth || !user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-gray-500">
        <PersonOutlineIcon style={{ fontSize: 48, color: '#e5e7eb' }} />
        <p className="font-medium text-gray-700">Please login to view your profile</p>
        <Link href="/login" className="px-5 py-2.5 bg-[#ff3f6c] text-white text-sm font-medium rounded-lg">
          Sign in
        </Link>
      </div>
    )
  }

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSave() {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 500))
    dispatch(updateUser(form))
    setSaving(false)
    setEditing(false)
    showToast('Profile updated successfully ✓')
  }

  function handleLogout() {
    clearSession()
    dispatch(logout())
    showToast('Logged out 👋')
    router.push('/login')
  }

  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()

  const QUICK_LINKS = [
    { icon: <ShoppingBagOutlinedIcon fontSize="small"/>, label: 'My Orders',       sub: 'Track, return or buy again',  href: '/orders'   },
    { icon: <FavoriteBorderIcon fontSize="small"/>,     label: 'Wishlist',         sub: 'Items saved for later',       href: '/wishlist' },
    { icon: <LocationOnOutlinedIcon fontSize="small"/>, label: 'Saved Addresses',  sub: 'Manage delivery addresses',   href: '#'         },
    { icon: <LocalOfferOutlinedIcon fontSize="small"/>, label: 'Coupons & Offers', sub: 'Your deals and discounts',    href: '/coupons'  },
    { icon: <SettingsOutlinedIcon fontSize="small"/>,   label: 'Settings',         sub: 'Account & privacy',           href: '/settings' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* ── Profile header card ── */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-5">
        {/* Cover */}
        <div className="h-24 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 relative">
          <div className="absolute inset-0 opacity-20"
            style={{ background: 'radial-gradient(circle at 30% 50%, #ff3f6c, transparent)' }} />
        </div>

        <div className="px-6 pb-6">
          {/* Avatar row */}
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="relative">
              {user.image ? (
                <img src={user.image} alt={user.firstName}
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-[#ff3f6c] text-white text-2xl font-bold flex items-center justify-center ring-4 ring-white shadow">
                  {initials}
                </div>
              )}
              <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-[#ff3f6c] transition-colors">
                <CameraAltOutlinedIcon style={{ fontSize: 12 }} />
              </button>
            </div>

            {/* Edit / Save buttons */}
            <div className="flex gap-2 mt-10">
              {editing ? (
                <>
                  <button onClick={() => setEditing(false)}
                    className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:border-gray-400 transition-colors">
                    <CloseOutlinedIcon fontSize="small"/> Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#ff3f6c] text-white text-xs font-medium rounded-lg hover:bg-[#e03560] transition-colors disabled:opacity-60">
                    {saving
                      ? <><Spin/> Saving…</>
                      : <><SaveOutlinedIcon fontSize="small"/> Save changes</>
                    }
                  </button>
                </>
              ) : (
                <button onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:border-gray-400 transition-colors">
                  <EditOutlinedIcon fontSize="small"/> Edit profile
                </button>
              )}
            </div>
          </div>

          {/* Name + verified */}
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-lg font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </h1>
            {user.source === 'api' && (
              <span className="flex items-center gap-0.5 text-[10px] text-blue-600 font-medium bg-blue-50 px-1.5 py-0.5 rounded-full">
                <VerifiedOutlinedIcon style={{ fontSize: 11 }}/> Verified
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* ── Left: edit form ── */}
        <div className="md:col-span-2 bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-5">Personal Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="First Name" value={form.firstName}
              onChange={(v) => set('firstName', v)} editing={editing} />
            <FormField label="Last Name" value={form.lastName}
              onChange={(v) => set('lastName', v)} editing={editing} />
            <FormField label="Email Address" value={form.email} type="email"
              onChange={(v) => set('email', v)} editing={editing} />
            <FormField label="Mobile Number" value={form.phone} type="tel"
              onChange={(v) => set('phone', v)} editing={editing} />
            <div>
              <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider block mb-1.5">
                Gender
              </label>
              {editing ? (
                <div className="flex gap-2">
                  {['Male', 'Female', 'Other'].map((g) => (
                    <button key={g} type="button"
                      onClick={() => set('gender', g.toLowerCase())}
                      className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all
                        ${form.gender === g.toLowerCase()
                          ? 'border-[#ff3f6c] bg-[#fff0f3] text-[#ff3f6c]'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      {g}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-700 capitalize py-2 border border-transparent">
                  {form.gender || <span className="text-gray-300">Not set</span>}
                </p>
              )}
            </div>
            <FormField label="Date of Birth" value={form.birthDate} type="date"
              onChange={(v) => set('birthDate', v)} editing={editing} />
          </div>

          {/* Account info */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Account Info</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Member since', value: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Jan 2024' },
                { label: 'Account type',  value: user.source === 'api' ? 'DummyJSON' : 'Local' },
                { label: 'Username',      value: user.username ?? '—' },
                { label: 'User ID',       value: `#${user.id}` },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-xl px-3 py-2.5">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm font-medium text-gray-800 mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: quick links + logout ── */}
        <div className="flex flex-col gap-4">
          {/* Quick navigation */}
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Quick links</p>
            </div>
            {QUICK_LINKS.map((item) => (
              <Link key={item.label} href={item.href}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                <span className="text-gray-400">{item.icon}</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.label}</p>
                  <p className="text-[10px] text-gray-400">{item.sub}</p>
                </div>
                <svg className="w-3.5 h-3.5 text-gray-300 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </Link>
            ))}
          </div>

          {/* Logout card */}
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 bg-white border border-gray-100 rounded-2xl hover:border-red-200 hover:bg-red-50 transition-all group">
            <span className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400 group-hover:bg-red-100 transition-colors">
              <LogoutIcon fontSize="small"/>
            </span>
            <div className="text-left">
              <p className="text-sm font-medium text-red-500">Log out</p>
              <p className="text-[10px] text-gray-400">Sign out of your account</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

function FormField({ label, value, onChange, editing, type = 'text' }) {
  return (
    <div>
      <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider block mb-1.5">
        {label}
      </label>
      {editing ? (
        <input type={type} value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#ff3f6c] focus:bg-white transition-colors" />
      ) : (
        <p className="text-sm text-gray-800 py-2 border border-transparent">
          {value || <span className="text-gray-300">Not set</span>}
        </p>
      )}
    </div>
  )
}

function Spin() {
  return (
    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
    </svg>
  )
}