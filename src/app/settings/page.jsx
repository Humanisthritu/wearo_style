'use client'
// src/app/settings/page.js

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { selectUser, selectIsAuthenticated, logout } from '@/redux/slices/authSlice'
import { clearSession } from '@/utils/auth'
import { useToast } from '@/context/AppContext'

import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import LanguageIcon from '@mui/icons-material/Language'
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import LogoutIcon from '@mui/icons-material/Logout'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import SmartphoneIcon from '@mui/icons-material/Smartphone'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import CheckIcon from '@mui/icons-material/Check'

export default function SettingsPage() {
  const router        = useRouter()
  const dispatch      = useAppDispatch()
  const { showToast } = useToast()
  const user          = useAppSelector(selectUser)
  const isAuth        = useAppSelector(selectIsAuthenticated)

  // ── Notification prefs ────────────────────────────────────────────────────
  const [notifs, setNotifs] = useState({
    orderUpdates:   true,
    promotions:     true,
    priceDrops:     true,
    newArrivals:    false,
    wishlistAlerts: true,
    emailDigest:    false,
  })

  // ── Privacy prefs ─────────────────────────────────────────────────────────
  const [privacy, setPrivacy] = useState({
    searchHistory:    true,
    personalizedAds:  true,
    dataSharing:      false,
  })

  // ── Appearance ────────────────────────────────────────────────────────────
  const [theme,    setTheme]    = useState('light')   // 'light' | 'dark' | 'system'
  const [language, setLanguage] = useState('en')

  // ── Password change ───────────────────────────────────────────────────────
  const [showPwForm, setShowPwForm] = useState(false)
  const [pw, setPw] = useState({ current: '', newPass: '', confirm: '' })
  const [showPw, setShowPw] = useState({ current: false, newPass: false, confirm: false })

  if (!isAuth) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Please login to access settings</p>
        <Link href="/login" className="px-5 py-2.5 bg-[#ff3f6c] text-white text-sm font-medium rounded-lg">Sign in</Link>
      </div>
    )
  }

  function toggleNotif(key) {
    setNotifs((n) => ({ ...n, [key]: !n[key] }))
    showToast('Notification preference saved')
  }

  function togglePrivacy(key) {
    setPrivacy((p) => ({ ...p, [key]: !p[key] }))
    showToast('Privacy setting updated')
  }

  function handlePasswordChange(e) {
    e.preventDefault()
    if (!pw.current)          { showToast('Enter your current password', 'error'); return }
    if (pw.newPass.length < 8){ showToast('New password must be 8+ characters', 'error'); return }
    if (pw.newPass !== pw.confirm){ showToast('Passwords do not match', 'error'); return }
    showToast('Password changed successfully ✓')
    setPw({ current: '', newPass: '', confirm: '' })
    setShowPwForm(false)
  }

  function handleLogout() {
    clearSession()
    dispatch(logout())
    showToast('Logged out 👋')
    router.push('/login')
  }

  function handleDeleteAccount() {
    if (window.confirm('Are you sure? This action cannot be undone.')) {
      clearSession()
      dispatch(logout())
      showToast('Account deleted. We\'re sorry to see you go.')
      router.push('/login')
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-5">

      <div className="mb-2">
        <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
        <p className="text-xs text-gray-400 mt-0.5">Manage your account preferences</p>
      </div>

      {/* ── Notifications ── */}
      <Section icon={<NotificationsOutlinedIcon fontSize="small"/>} title="Notifications">
        {[
          { key: 'orderUpdates',   label: 'Order updates',       sub: 'Shipping, delivery and refund status' },
          { key: 'promotions',     label: 'Promotions & offers',  sub: 'Deals, coupons and seasonal sales' },
          { key: 'priceDrops',     label: 'Price drop alerts',   sub: 'When wishlist items go on sale' },
          { key: 'newArrivals',    label: 'New arrivals',        sub: 'Fresh drops in your favourite categories' },
          { key: 'wishlistAlerts', label: 'Wishlist alerts',     sub: 'Low stock & availability updates' },
          { key: 'emailDigest',    label: 'Weekly email digest', sub: 'Summary of new items and offers' },
        ].map(({ key, label, sub }) => (
          <ToggleRow key={key} label={label} sub={sub}
            value={notifs[key]} onChange={() => toggleNotif(key)} />
        ))}
      </Section>

      {/* ── Privacy ── */}
      <Section icon={<ShieldOutlinedIcon fontSize="small"/>} title="Privacy & Data">
        {[
          { key: 'searchHistory',   label: 'Save search history',   sub: 'Remember your recent searches for suggestions' },
          { key: 'personalizedAds', label: 'Personalised experience', sub: 'Show recommendations based on your activity' },
          { key: 'dataSharing',     label: 'Share data with partners', sub: 'Allow trusted partners to improve offers' },
        ].map(({ key, label, sub }) => (
          <ToggleRow key={key} label={label} sub={sub}
            value={privacy[key]} onChange={() => togglePrivacy(key)} />
        ))}
        <LinkRow label="Download my data" sub="Get a copy of all your account data"
          onClick={() => showToast('Your data export request has been sent 📧')} />
      </Section>

      {/* ── Password ── */}
      <Section icon={<LockOutlinedIcon fontSize="small"/>} title="Password & Security">
        {!showPwForm ? (
          <LinkRow label="Change password" sub="Update your account password"
            onClick={() => setShowPwForm(true)} />
        ) : (
          <form onSubmit={handlePasswordChange} className="flex flex-col gap-3 px-4 py-3">
            {[
              { key: 'current', label: 'Current password', placeholder: 'Enter current password' },
              { key: 'newPass', label: 'New password',     placeholder: 'Min 8 characters' },
              { key: 'confirm', label: 'Confirm new password', placeholder: 'Re-enter new password' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider block mb-1">
                  {label}
                </label>
                <div className="relative">
                  <input
                    type={showPw[key] ? 'text' : 'password'}
                    value={pw[key]}
                    onChange={(e) => setPw((p) => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#ff3f6c] focus:bg-white transition-colors pr-9"
                  />
                  <button type="button"
                    onClick={() => setShowPw((s) => ({ ...s, [key]: !s[key] }))}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw[key]
                      ? <VisibilityOffOutlinedIcon style={{ fontSize: 16 }}/>
                      : <VisibilityOutlinedIcon style={{ fontSize: 16 }}/>}
                  </button>
                </div>
              </div>
            ))}
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => { setShowPwForm(false); setPw({ current:'', newPass:'', confirm:'' }) }}
                className="flex-1 py-2 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:border-gray-400 transition-colors">
                Cancel
              </button>
              <button type="submit"
                className="flex-1 py-2 bg-[#ff3f6c] text-white text-xs font-medium rounded-lg hover:bg-[#e03560] transition-colors">
                Update password
              </button>
            </div>
          </form>
        )}
        <LinkRow label="Two-factor authentication" sub="Add an extra layer of security"
          onClick={() => showToast('2FA coming soon!')} badge="Soon" />
        <LinkRow label="Active sessions" sub="See where you're logged in"
          onClick={() => showToast('Session management coming soon!')} />
      </Section>

      {/* ── Appearance ── */}
      <Section icon={<PaletteOutlinedIcon fontSize="small"/>} title="Appearance">
        <div className="px-4 py-3">
          <p className="text-xs text-gray-500 mb-3">Theme</p>
          <div className="flex gap-2">
            {[
              { value: 'light',  label: '☀️ Light'  },
              { value: 'dark',   label: '🌙 Dark'   },
              { value: 'system', label: '💻 System' },
            ].map((t) => (
              <button key={t.value} onClick={() => { setTheme(t.value); showToast(`Theme set to ${t.label}`) }}
                className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all
                  ${theme === t.value
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-3">Language</p>
          <select value={language} onChange={(e) => { setLanguage(e.target.value); showToast('Language updated') }}
            className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#ff3f6c] transition-colors">
            <option value="en">🇬🇧 English</option>
            <option value="hi">🇮🇳 हिन्दी (Hindi)</option>
            <option value="ta">🇮🇳 தமிழ் (Tamil)</option>
            <option value="te">🇮🇳 తెలుగు (Telugu)</option>
            <option value="kn">🇮🇳 ಕನ್ನಡ (Kannada)</option>
          </select>
        </div>
      </Section>

      {/* ── Connected accounts ── */}
      <Section icon={<SmartphoneIcon fontSize="small"/>} title="Connected Accounts">
        <ConnectedRow icon="🇬" label="Google" email={user?.email} connected={user?.source === 'api'}
          onToggle={() => showToast('Google account management coming soon!')} />
        <ConnectedRow icon="🍎" label="Apple" connected={false}
          onToggle={() => showToast('Apple account management coming soon!')} />
        <ConnectedRow icon="📧" label="Email / Password" email={user?.email} connected={true}
          onToggle={() => showToast('Email is your primary login method')} />
      </Section>

      {/* ── Danger zone ── */}
      <div className="bg-white border border-red-100 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-red-100 bg-red-50/50">
          <DeleteOutlineIcon fontSize="small" className="text-red-400" />
          <span className="text-sm font-semibold text-red-600">Danger Zone</span>
        </div>

        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors border-b border-gray-100">
          <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
            <LogoutIcon fontSize="small"/>
          </span>
          <div className="text-left flex-1">
            <p className="text-sm font-medium text-gray-800">Log out</p>
            <p className="text-xs text-gray-400">Sign out of your DripKart account</p>
          </div>
          <KeyboardArrowRightIcon fontSize="small" className="text-gray-300"/>
        </button>

        <button onClick={handleDeleteAccount}
          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-red-50 transition-colors">
          <span className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400">
            <DeleteOutlineIcon fontSize="small"/>
          </span>
          <div className="text-left flex-1">
            <p className="text-sm font-medium text-red-600">Delete account</p>
            <p className="text-xs text-gray-400">Permanently delete your account and all data</p>
          </div>
          <KeyboardArrowRightIcon fontSize="small" className="text-gray-300"/>
        </button>
      </div>

      {/* App version */}
      <p className="text-center text-xs text-gray-300 pb-2">DripKart v1.0.0 · Made with ❤️</p>

    </div>
  )
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function Section({ icon, title, children }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
        <span className="text-gray-400">{icon}</span>
        <span className="text-sm font-semibold text-gray-700">{title}</span>
      </div>
      {children}
    </div>
  )
}

function ToggleRow({ label, sub, value, onChange }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
      </div>
      <button onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-all duration-200 shrink-0 ml-4 ${value ? 'bg-[#ff3f6c]' : 'bg-gray-200'}`}>
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${value ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    </div>
  )
}

function LinkRow({ label, sub, onClick, badge }) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors text-left">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      {badge && (
        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      <KeyboardArrowRightIcon fontSize="small" className="text-gray-300 shrink-0"/>
    </button>
  )
}

function ConnectedRow({ icon, label, email, connected, onToggle }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-base">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {email && connected && <p className="text-xs text-gray-400 truncate">{email}</p>}
        {!connected && <p className="text-xs text-gray-400">Not connected</p>}
      </div>
      <button onClick={onToggle}
        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
          connected
            ? 'border-green-200 bg-green-50 text-green-700 flex items-center gap-1'
            : 'border-gray-200 text-gray-600 hover:border-gray-400'
        }`}>
        {connected ? <><CheckIcon style={{ fontSize: 12 }}/> Connected</> : 'Connect'}
      </button>
    </div>
  )
}