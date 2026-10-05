'use client'
// src/app/settings/page.js

import Link from 'next/link'

import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import LogoutIcon from '@mui/icons-material/Logout'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import SmartphoneIcon from '@mui/icons-material/Smartphone'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import CheckIcon from '@mui/icons-material/Check'

export default function SettingsPage() {
  // ── Static data ──────────────────────────────────────────────────────
  const notifs = {
    orderUpdates: true,
    promotions: true,
    priceDrops: true,
    newArrivals: false,
    wishlistAlerts: true,
    emailDigest: false,
  }

  const privacy = {
    searchHistory: true,
    personalizedAds: true,
    dataSharing: false,
  }

  const language = 'en'
  const theme = 'light'
  const user = { email: 'user@example.com', source: 'api' }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-5">
      <div className="mb-2">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-xs text-gray-400 mt-0.5">Manage your account preferences</p>
      </div>

      {/* ── Notifications ── */}
      <Section icon={<NotificationsOutlinedIcon fontSize="small"/>} title="Notifications">
        {[
          { key: 'orderUpdates', label: 'Order updates', sub: 'Shipping, delivery and refund status' },
          { key: 'promotions', label: 'Promotions & offers', sub: 'Deals, coupons and seasonal sales' },
          { key: 'priceDrops', label: 'Price drop alerts', sub: 'When wishlist items go on sale' },
          { key: 'newArrivals', label: 'New arrivals', sub: 'Fresh drops in your favourite categories' },
          { key: 'wishlistAlerts', label: 'Wishlist alerts', sub: 'Low stock & availability updates' },
          { key: 'emailDigest', label: 'Weekly email digest', sub: 'Summary of new items and offers' },
        ].map(({ key, label, sub }) => (
          <ToggleRow 
            key={key} 
            label={label} 
            sub={sub}
            value={notifs[key]} 
          />
        ))}
      </Section>

      {/* ── Privacy ── */}
      <Section icon={<ShieldOutlinedIcon fontSize="small"/>} title="Privacy & Data">
        {[
          { key: 'searchHistory', label: 'Save search history', sub: 'Remember your recent searches for suggestions' },
          { key: 'personalizedAds', label: 'Personalised experience', sub: 'Show recommendations based on your activity' },
          { key: 'dataSharing', label: 'Share data with partners', sub: 'Allow trusted partners to improve offers' },
        ].map(({ key, label, sub }) => (
          <ToggleRow 
            key={key} 
            label={label} 
            sub={sub}
            value={privacy[key]} 
          />
        ))}
        <LinkRow 
          label="Download my data" 
          sub="Get a copy of all your account data"
        />
      </Section>

      {/* ── Password ── */}
      <Section icon={<LockOutlinedIcon fontSize="small"/>} title="Password & Security">
        <LinkRow 
          label="Change password" 
          sub="Update your account password"
        />
        <LinkRow 
          label="Two-factor authentication" 
          sub="Add an extra layer of security"
          badge="Soon" 
        />
        <LinkRow 
          label="Active sessions" 
          sub="See where you're logged in"
        />
      </Section>

      {/* ── Appearance ── */}
      <Section icon={<PaletteOutlinedIcon fontSize="small"/>} title="Appearance">
        <div className="px-4 py-3">
          <p className="text-xs text-gray-500 mb-3 dark:text-gray-400">Theme</p>
          <div className="flex gap-2">
            {[
              { value: 'light', label: '☀️ Light' },
              { value: 'dark', label: '🌙 Dark' },
              { value: 'system', label: '💻 System' },
            ].map((t) => (
              <button 
                key={t.value} 
                className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all
                  ${theme === t.value
                    ? 'border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900'
                    : 'border-gray-200 text-gray-600 hover:border-gray-400 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-500'
                  }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-500 mb-3 dark:text-gray-400">Language</p>
          <select 
            value={language} 
            className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#ff3f6c] transition-colors dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
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
        <ConnectedRow 
          icon="🇬" 
          label="Google" 
          email={user?.email} 
          connected={user?.source === 'api'}
        />
        <ConnectedRow 
          icon="🍎" 
          label="Apple" 
          connected={false}
        />
        <ConnectedRow 
          icon="📧" 
          label="Email / Password" 
          email={user?.email} 
          connected={true}
        />
      </Section>

      {/* ── Danger zone ── */}
      <div className="bg-white border border-red-100 rounded-2xl overflow-hidden dark:bg-gray-900 dark:border-red-900">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-red-100 bg-red-50/50 dark:border-red-900 dark:bg-red-950/50">
          <DeleteOutlineIcon fontSize="small" className="text-red-400" />
          <span className="text-sm font-semibold text-red-600 dark:text-red-400">Danger Zone</span>
        </div>

        <button 
          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors border-b border-gray-100 dark:border-gray-800 dark:hover:bg-gray-800"
        >
          <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            <LogoutIcon fontSize="small"/>
          </span>
          <div className="text-left flex-1">
            <p className="text-sm font-medium text-gray-800 dark:text-white">Log out</p>
            <p className="text-xs text-gray-400">Sign out of your DripKart account</p>
          </div>
          <KeyboardArrowRightIcon fontSize="small" className="text-gray-300"/>
        </button>

        <button 
          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-red-50 transition-colors dark:hover:bg-red-950/50"
        >
          <span className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400 dark:bg-red-950/50">
            <DeleteOutlineIcon fontSize="small"/>
          </span>
          <div className="text-left flex-1">
            <p className="text-sm font-medium text-red-600 dark:text-red-400">Delete account</p>
            <p className="text-xs text-gray-400">Permanently delete your account and all data</p>
          </div>
          <KeyboardArrowRightIcon fontSize="small" className="text-gray-300"/>
        </button>
      </div>

      {/* App version */}
      <p className="text-center text-xs text-gray-300 pb-2 dark:text-gray-600">DripKart v1.0.0 · Made with ❤️</p>
    </div>
  )
}

// ── Shared sub-components ─────────────────────────────────────────────

function Section({ icon, title, children }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden dark:bg-gray-900 dark:border-gray-800">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/50">
        <span className="text-gray-400">{icon}</span>
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</span>
      </div>
      {children}
    </div>
  )
}

function ToggleRow({ label, sub, value }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors dark:border-gray-800 dark:hover:bg-gray-800/50">
      <div>
        <p className="text-sm font-medium text-gray-800 dark:text-white">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
      </div>
      <button 
        className={`relative w-11 h-6 rounded-full transition-all duration-200 shrink-0 ml-4
          ${value ? 'bg-[#ff3f6c]' : 'bg-gray-200 dark:bg-gray-700'}`}
      >
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 
          ${value ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    </div>
  )
}

function LinkRow({ label, sub, badge }) {
  return (
    <button 
      className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors text-left dark:border-gray-800 dark:hover:bg-gray-800/50"
    >
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800 dark:text-white">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      {badge && (
        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900">
          {badge}
        </span>
      )}
      <KeyboardArrowRightIcon fontSize="small" className="text-gray-300 shrink-0"/>
    </button>
  )
}

function ConnectedRow({ icon, label, email, connected }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 last:border-0 dark:border-gray-800">
      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-base dark:bg-gray-800">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 dark:text-white">{label}</p>
        {email && connected && <p className="text-xs text-gray-400 truncate">{email}</p>}
        {!connected && <p className="text-xs text-gray-400">Not connected</p>}
      </div>
      <button 
        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all
          ${connected
            ? 'border-green-200 bg-green-50 text-green-700 flex items-center gap-1 dark:border-green-900 dark:bg-green-950/50 dark:text-green-400'
            : 'border-gray-200 text-gray-600 hover:border-gray-400 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-500'
          }`}
      >
        {connected ? <><CheckIcon style={{ fontSize: 12 }}/> Connected</> : 'Connect'}
      </button>
    </div>
  )
}