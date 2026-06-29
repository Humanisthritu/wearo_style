'use client'
// src/app/login/page.js

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/hooks/redux'
import { loginSuccess } from '@/redux/slices/authSlice'
import { loginUser, getSession, registerUser } from '@/utils/auth'
import { useToast } from '@/context/AppContext'
import { DEMO_CREDENTIALS } from '@/services/api'
import AppleIcon from '@mui/icons-material/Apple'
import GoogleIcon from '@mui/icons-material/Google'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import VisibilityIcon from '@mui/icons-material/Visibility'
import AirportShuttleOutlinedIcon from '@mui/icons-material/AirportShuttleOutlined'
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined'
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined'

export default function LoginPage() {
  const router        = useRouter()
  const dispatch      = useAppDispatch()
  const { showToast } = useToast()

  const [tab, setTab]           = useState('login')
  const [loading, setLoading]   = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors]     = useState({})
  const [success, setSuccess]   = useState('')

  // Login fields
  const [lUser, setLUser]       = useState('')
  const [lPass, setLPass]       = useState('')
  const [remember, setRemember] = useState(false)

  // Register fields
  const [rFirst, setRFirst]     = useState('')
  const [rLast,  setRLast]      = useState('')
  const [rEmail, setREmail]     = useState('')
  const [rPhone, setRPhone]     = useState('')
  const [rPass,  setRPass]      = useState('')
  const [rConf,  setRConf]      = useState('')
  const [rTerms, setRTerms]     = useState(false)
  const [showRPass, setShowRPass] = useState(false)
  const [showCPass, setShowCPass] = useState(false)

  // ── KEY FIX: redirect immediately if already logged in ──────────────────────
  // Runs on every mount. If a session exists in localStorage, push to home.
  useEffect(() => {
    const session = getSession()
    if (session) {
      // Also rehydrate Redux in case the store was reset (e.g. hard refresh)
      dispatch(loginSuccess(session))
      router.replace('/')
    }
  }, [router, dispatch])

  function clear() { setErrors({}); setSuccess('') }
  function switchTab(t) { setTab(t); clear() }

  // ── password strength ──
  const pwChecks = {
    length:    rPass.length >= 8,
    uppercase: /[A-Z]/.test(rPass),
    number:    /\d/.test(rPass),
  }
  const pwScore  = Object.values(pwChecks).filter(Boolean).length
  const pwColors = ['#e24b4a', '#e24b4a', '#ef9f27', '#22c55e']
  const pwWidths = ['25%', '25%', '60%', '100%']

  // ── login submit ──────────────────────────────────────────────────────────────
  async function handleLogin(e) {
    e.preventDefault()
    clear()

    // Basic validation
    if (!lUser.trim()) { setErrors({ general: 'Email or username is required' }); return }
    if (!lPass)        { setErrors({ general: 'Password is required' }); return }

    setLoading(true)

    // loginUser tries DummyJSON API first, then falls back to localStorage users
    const result = await loginUser({ emailOrUsername: lUser.trim(), password: lPass })

    setLoading(false)

    if (!result.success) {
      setErrors({ general: result.error })
      return
    }

    // ── SUCCESS ──
    // 1. Save user to Redux store
    dispatch(loginSuccess(result.user))

    // 2. Show success message inline
    setSuccess(`Welcome back, ${result.user.firstName}!`)

    // 3. Toast notification
    showToast(`Signed in as ${result.user.firstName} ${result.user.lastName} ✓`)

    // 4. Redirect to home after brief delay so user sees the success message
    setTimeout(() => router.push('/'), 800)
  }

  // ── register submit ───────────────────────────────────────────────────────────
  function handleRegister(e) {
    e.preventDefault()
    clear()

    // Validation
    if (!rFirst.trim())  { setErrors({ general: 'First name is required' }); return }
    if (!rLast.trim())   { setErrors({ general: 'Last name is required' }); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rEmail)) {
      setErrors({ general: 'Enter a valid email address' }); return
    }
    if (rPhone.replace(/\D/g, '').length < 10) {
      setErrors({ general: 'Enter a valid 10-digit mobile number' }); return
    }
    if (rPass.length < 8) {
      setErrors({ general: 'Password must be at least 8 characters' }); return
    }
    if (rPass !== rConf) { setErrors({ general: 'Passwords do not match' }); return }
    if (!rTerms)         { setErrors({ general: 'Please agree to the Terms & Privacy Policy' }); return }

    // registerUser saves to localStorage and returns { success, user, error }
    const result = registerUser({
      firstName: rFirst.trim(),
      lastName:  rLast.trim(),
      email:     rEmail.trim(),
      phone:     rPhone.replace(/\D/g, ''),
      password:  rPass,
    })

    if (!result.success) {
      setErrors({ general: result.error })
      return
    }

    // ── SUCCESS ──
    // 1. Save user to Redux store (auto-logs them in)
    dispatch(loginSuccess(result.user))

    // 2. Show success message inline
    setSuccess(`Account created! Welcome to DripKart, ${result.user.firstName}!`)

    // 3. Toast notification
    showToast(`Account created! Welcome, ${result.user.firstName} 🎉`)

    // 4. Redirect to home
    setTimeout(() => router.push('/'), 900)
  }

  const inputCls = (hasError) =>
    `w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm outline-none transition-all font-sans
     ${hasError
       ? 'border-red-300 bg-red-50 focus:border-red-400 text-red-900'
       : 'border-gray-200 bg-gray-50 focus:border-[#ff3f6c] focus:bg-white text-gray-900'}`

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
      <div className="w-full max-w-3xl grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">

        {/* ── Left panel ── */}
        <div
          className="relative hidden lg:flex flex-col justify-between p-10 overflow-hidden"
          style={{ background: '#0f0f0f' }}
        >
          {/* Decorative blobs */}
          <div className="absolute top-0 left-0 w-56 h-56 rounded-full opacity-[0.12]"
            style={{ background: 'radial-gradient(circle,#ff3f6c,transparent)', transform: 'translate(-40%,-40%)' }} />
          <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full opacity-[0.07]"
            style={{ background: 'radial-gradient(circle,#ff3f6c,transparent)', transform: 'translate(40%,40%)' }} />

          {/* Logo */}
          <Link href="/" className="relative z-10 text-xl font-medium text-white">
            Drip<span className="text-[#ff3f6c]">Kart</span>
          </Link>

          {/* Body copy + perks */}
          <div className="relative z-10">
            <h2 className="text-2xl font-medium text-white leading-snug mb-3">
              Your style,<br />your story.
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-8">
              Sign in to unlock orders, wishlist and member-only deals.
            </p>
            {[
              { icon: <AirportShuttleOutlinedIcon fontSize="small" />, text: 'Free delivery above ₹999' },
              { icon: <AutorenewOutlinedIcon fontSize="small" />,      text: '30-day hassle-free returns' },
              { icon: <CardGiftcardOutlinedIcon fontSize="small" />,   text: 'Exclusive member deals' },
            ].map((p) => (
              <div key={p.text} className="flex items-center gap-3 mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-[#ff3f6c]"
                  style={{ background: 'rgba(255,63,108,0.12)' }}
                >
                  {p.icon}
                </div>
                <span className="text-xs text-gray-400">{p.text}</span>
              </div>
            ))}
          </div>

          {/* Demo credentials pill */}
          <div
            className="relative z-10 rounded-xl p-3.5 border"
            style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <p className="text-[10px] text-gray-600 font-medium uppercase tracking-wider mb-2">
              Demo account
            </p>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">username</span>
              <span className="text-[#ff3f6c] font-mono">{DEMO_CREDENTIALS.username}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">password</span>
              <span className="text-[#ff3f6c] font-mono">{DEMO_CREDENTIALS.password}</span>
            </div>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="bg-white p-9 flex flex-col justify-center">

          {/* Tab switcher */}
          <div className="flex border-b border-gray-100 mb-7">
            {[['login', 'Sign in'], ['register', 'Create account']].map(([t, label]) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={`mr-5 pb-2.5 text-sm font-medium border-b-2 transition-all -mb-px
                  ${tab === t
                    ? 'text-[#ff3f6c] border-[#ff3f6c]'
                    : 'text-gray-400 border-transparent hover:text-gray-700'}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Inline alerts */}
          {errors.general && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-100 px-3.5 py-2.5 text-xs text-red-700">
              ⚠️ {errors.general}
            </div>
          )}
          {success && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 border border-green-100 px-3.5 py-2.5 text-xs text-green-700">
              ✅ {success}
            </div>
          )}

          {/* ══════════════════ LOGIN FORM ══════════════════ */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} noValidate className="flex flex-col gap-3.5">
              <div>
                <p className="text-lg font-medium text-gray-900 mb-0.5">Welcome back</p>
                <p className="text-xs text-gray-400">Use your username or registered email</p>
              </div>

              {/* Email / username */}
              <Field label="Email or username">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">👤</span>
                  <input
                    type="text"
                    value={lUser}
                    onChange={(e) => { setLUser(e.target.value); clear() }}
                    placeholder="kminchelle or you@email.com"
                    className={inputCls(errors.general && !lUser)}
                    autoComplete="username"
                    autoCapitalize="none"
                  />
                </div>
              </Field>

              {/* Password */}
              <Field label="Password">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔒</span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={lPass}
                    onChange={(e) => { setLPass(e.target.value); clear() }}
                    placeholder="Enter your password"
                    className={inputCls(errors.general && !lPass) + ' pr-10'}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                  </button>
                </div>
              </Field>

              {/* Remember me + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-3.5 h-3.5 accent-[#ff3f6c]"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => showToast('Reset email sent! 📧')}
                  className="text-xs text-[#ff3f6c] hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign in button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#ff3f6c] text-white text-sm font-medium rounded-lg hover:bg-[#e03560] transition-colors disabled:opacity-55 flex items-center justify-center gap-2"
              >
                {loading && <Spin />}
                {loading ? 'Signing in…' : 'Sign in'}
              </button>

              {/* Demo fill */}
              <button
                type="button"
                onClick={() => {
                  setLUser(DEMO_CREDENTIALS.username)
                  setLPass(DEMO_CREDENTIALS.password)
                  clear()
                  showToast('Demo credentials filled — hit Sign in!')
                }}
                className="w-full py-2.5 text-xs text-gray-400 border border-dashed border-gray-200 rounded-lg hover:border-[#ff3f6c] hover:text-[#ff3f6c] transition-all"
              >
                🧪 Use demo account
              </button>

              <OrLine />
              <SocialRow onToast={showToast} />

              <p className="text-xs text-center text-gray-400">
                No account?{' '}
                <button
                  type="button"
                  onClick={() => switchTab('register')}
                  className="text-[#ff3f6c] font-medium hover:underline"
                >
                  Create one free
                </button>
              </p>
            </form>
          )}

          {/* ══════════════════ REGISTER FORM ══════════════════ */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} noValidate className="flex flex-col gap-3">
              <div>
                <p className="text-lg font-medium text-gray-900 mb-0.5">Create account</p>
                <p className="text-xs text-gray-400">Free forever. No credit card needed.</p>
              </div>

              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="First name">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">👤</span>
                    <input type="text" value={rFirst} onChange={(e) => setRFirst(e.target.value)}
                      placeholder="Rahul" className={inputCls()} autoComplete="given-name" />
                  </div>
                </Field>
                <Field label="Last name">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">👤</span>
                    <input type="text" value={rLast} onChange={(e) => setRLast(e.target.value)}
                      placeholder="Sharma" className={inputCls()} autoComplete="family-name" />
                  </div>
                </Field>
              </div>

              {/* Email */}
              <Field label="Email">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">📧</span>
                  <input type="email" value={rEmail} onChange={(e) => setREmail(e.target.value)}
                    placeholder="you@example.com" className={inputCls()} autoComplete="email" />
                </div>
              </Field>

              {/* Phone */}
              <Field label="Mobile">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">📱</span>
                  <input
                    type="tel"
                    value={rPhone}
                    onChange={(e) => setRPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="98765 43210"
                    className={inputCls()}
                    autoComplete="tel"
                  />
                </div>
              </Field>

              {/* Password + strength */}
              <Field label="Password">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔒</span>
                  <input
                    type={showRPass ? 'text' : 'password'}
                    value={rPass}
                    onChange={(e) => setRPass(e.target.value)}
                    placeholder="Min 8 chars, uppercase & number"
                    className={inputCls() + ' pr-10'}
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShowRPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showRPass ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                  </button>
                </div>
                {/* Strength bar */}
                {rPass && (
                  <div className="mt-1.5">
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden mb-1.5">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width:      pwWidths[pwScore] || '0%',
                          background: pwColors[pwScore] || '#e24b4a',
                        }}
                      />
                    </div>
                    <div className="flex gap-3 text-[10px]">
                      {[['length', '8+ chars'], ['uppercase', 'A–Z'], ['number', '0–9']].map(([k, l]) => (
                        <span key={k} className={pwChecks[k] ? 'text-green-600' : 'text-gray-300'}>
                          {pwChecks[k] ? '✓' : '○'} {l}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Field>

              {/* Confirm password */}
              <Field label="Confirm password">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔐</span>
                  <input
                    type={showCPass ? 'text' : 'password'}
                    value={rConf}
                    onChange={(e) => setRConf(e.target.value)}
                    placeholder="Re-enter password"
                    className={inputCls() + ' pr-10'}
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShowCPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showCPass ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                  </button>
                  {/* Match indicator */}
                  {rConf && (
                    <span className="absolute right-9 top-1/2 -translate-y-1/2 text-xs">
                      {rPass === rConf ? '✅' : '❌'}
                    </span>
                  )}
                </div>
              </Field>

              {/* Terms */}
              <label className="flex items-start gap-2 text-xs text-gray-500 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rTerms}
                  onChange={(e) => setRTerms(e.target.checked)}
                  className="w-3.5 h-3.5 mt-0.5 accent-[#ff3f6c] shrink-0"
                />
                I agree to the{' '}
                <span className="text-[#ff3f6c] ml-0.5 cursor-pointer hover:underline">Terms</span>
                &nbsp;and&nbsp;
                <span className="text-[#ff3f6c] cursor-pointer hover:underline">Privacy Policy</span>
              </label>

              {/* Create account button */}
              <button
                type="submit"
                className="w-full py-2.5 bg-[#ff3f6c] text-white text-sm font-medium rounded-lg hover:bg-[#e03560] transition-colors flex items-center justify-center gap-2"
              >
                Create account
              </button>

              <OrLine />
              <SocialRow onToast={showToast} />

              <p className="text-xs text-center text-gray-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchTab('login')}
                  className="text-[#ff3f6c] font-medium hover:underline"
                >
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Tiny shared sub-components ────────────────────────────────────────────────

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  )
}

function OrLine() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-gray-100" />
      <span className="text-[10px] text-gray-400">or continue with</span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  )
}

function SocialRow({ onToast }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {[
        [<GoogleIcon fontSize="small" />, 'Google'],
        [<AppleIcon fontSize="small" />, 'Apple'],
      ].map(([icon, name]) => (
        <button
          key={name}
          type="button"
          onClick={() => onToast(`${name} login coming soon!`)}
          className="flex items-center justify-center gap-2 py-2.5 text-xs font-medium text-gray-600 border border-gray-100 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all"
        >
          {icon} {name}
        </button>
      ))}
    </div>
  )
}

function Spin() {
  return (
    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}