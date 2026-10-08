'use client'

import { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
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

const loginSchema = Yup.object({
  emailOrUsername: Yup.string().trim().required('Email or username is required'),
  password: Yup.string().required('Password is required'),
})

const registerSchema = Yup.object({
  firstName: Yup.string().trim().required('First name is required'),
  lastName: Yup.string().trim().required('Last name is required'),
  email: Yup.string().trim().email('Enter a valid email address').required('Email is required'),
  phone: Yup.string()
    .matches(/^\d{10}$/, 'Enter a valid 10-digit mobile number')
    .required('Mobile number is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
  terms: Yup.boolean().oneOf([true], 'Please agree to the Terms & Privacy Policy'),
})

export default function LoginPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { showToast } = useToast()

  const [tab, setTab] = useState('login')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState('')

  const [remember, setRemember] = useState(false)

  const [showRPass, setShowRPass] = useState(false)
  const [showCPass, setShowCPass] = useState(false)

  //forget password 

  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')

  const loginFormik = useFormik({
    initialValues: { emailOrUsername: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: ({ emailOrUsername, password }) => attemptLogin(emailOrUsername.trim(), password),
  })

  const registerFormik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
    validationSchema: registerSchema,
    onSubmit: handleRegister,
  })


  useEffect(() => {
    const session = getSession()
    if (session) {
      dispatch(loginSuccess(session))
      router.replace('/')
    }
  }, [dispatch, router])

  function clear() { setFormError(''); setSuccess('') }
  function switchTab(t) { setTab(t); clear() }

  const { password: rPass } = registerFormik.values
  const pwChecks = {
    length: rPass.length >= 8,
    uppercase: /[A-Z]/.test(rPass),
    number: /\d/.test(rPass),
  }
  const pwScore = Object.values(pwChecks).filter(Boolean).length
  const pwColors = ['#e24b4a', '#e24b4a', '#ef9f27', '#22c55e']
  const pwWidths = ['25%', '25%', '60%', '100%']

  // ── Core login — shared by form submit and demo button ────────────────────
  function attemptLogin(emailOrUsername, password) {
    clear()
    const result = loginUser({ emailOrUsername, password })

    if (!result.success) {
      setFormError(result.error)
      return false
    }
    const storage = remember ? localStorage : sessionStorage
    storage.setItem(
      'dripkart_session',
      JSON.stringify(result.user)
    )
    dispatch(loginSuccess(result.user))
    setSuccess(`Welcome back, ${result.user.firstName}!`)
    showToast(`Signed in as ${result.user.firstName} ${result.user.lastName} ✓`)
    router.push('/')
    return true
  }

  async function handleDemoLogin() {
    loginFormik.setValues({
      emailOrUsername: DEMO_CREDENTIALS.username,
      password: DEMO_CREDENTIALS.password,
    })
    setLoading(true)
    attemptLogin(DEMO_CREDENTIALS.username, DEMO_CREDENTIALS.password)
    setLoading(false)
  }

  function handleRegister(values) {
    clear()

    const result = registerUser({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      phone: values.phone,
      password: values.password,
    })

    if (!result.success) { setFormError(result.error); return }

    dispatch(loginSuccess(result.user))
    setSuccess(`Account created! Welcome, ${result.user.firstName}!`)
    showToast(`Account created! Welcome, ${result.user.firstName} 🎉`)
    router.push('/')
  }

  const inputCls = (hasErr) =>
    `w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm outline-none transition-all
     ${hasErr
      ? 'border-red-300 bg-red-50 focus:border-red-400 text-red-900'
      : 'border-gray-200 bg-gray-50 focus:border-[#8e4440] focus:bg-white text-gray-900'}`

  const handleForgotPassword = (e) => {
    e.preventDefault()
    clear()
    const email = forgotEmail.trim().toLowerCase()
    if(!email) {
      setFormError('Please enter your registered email address.')
      return
    }
    
    const user = JSON.parse(localStorage.getItem('dripkart_users') || '[]')
    const foundUser = user.find(u => u.email.toLowerCase() === email)
    if (!foundUser) {
      setFormError('No account found with this email address.')
      return
    }
    localStorage.setItem('dripkart_reset_email',
      JSON.stringify({
      email,
      createdAt: Date.now(),
    }))
    setSuccess('Password reset link sent to your email.')
    showToast('Password reset link sent! Check your email.')
  }    

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
      <div className="w-full max-w-3xl grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">

        {/* ── Left panel ── */}
        <div className="relative hidden lg:flex flex-col justify-between p-10 overflow-hidden"
          style={{ background: '#0f0f0f' }}>
          <div className="absolute top-0 left-0 w-56 h-56 rounded-full opacity-[0.12]"
            style={{ background: 'radial-gradient(circle,#8e4440,transparent)', transform: 'translate(-40%,-40%)' }} />
          <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full opacity-[0.07]"
            style={{ background: 'radial-gradient(circle,#8e4440,transparent)', transform: 'translate(40%,40%)' }} />

          <Link href="/" className="relative z-10 text-xl font-medium text-white">
            Drip<span className="text-[#8e4440]">Kart</span>
          </Link>

          <div className="relative z-10">
            <h2 className="text-2xl font-medium text-white leading-snug mb-3">
              Your style,<br />your story.
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-8">
              Sign in to unlock orders, wishlist and member-only deals.
            </p>
            {[
              { icon: <AirportShuttleOutlinedIcon fontSize="small" />, text: 'Free delivery above ₹999' },
              { icon: <AutorenewOutlinedIcon fontSize="small" />, text: '30-day hassle-free returns' },
              { icon: <CardGiftcardOutlinedIcon fontSize="small" />, text: 'Exclusive member deals' },
            ].map((p) => (
              <div key={p.text} className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-[#8e4440]"
                  style={{ background: 'rgba(255,63,108,0.12)' }}>
                  {p.icon}
                </div>
                <span className="text-xs text-gray-400">{p.text}</span>
              </div>
            ))}
          </div>


          <button onClick={handleDemoLogin} disabled={loading}
            className="relative z-10 rounded-xl p-3.5 border text-left w-full transition-all hover:border-[#8e4440]/40 disabled:opacity-60"
            style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
            <p className="flex text-lg text-[#8e4440] mb-0.5 font-medium justify-center">LIVE EVERYDAY</p>

          </button>
        </div>

        {/* ── Right form panel ── */}
        <div className="bg-white p-9 flex flex-col justify-center">
          <div className="flex border-b border-gray-100 mb-7">
            {[['login', 'Sign in'], ['register', 'Create account']].map(([t, label]) => (
              <button key={t} onClick={() => switchTab(t)}
                className={`mr-5 pb-2.5 text-sm font-medium border-b-2 transition-all -mb-px
                  ${tab === t ? 'text-[#8e4440] border-[#8e4440]' : 'text-gray-400 border-transparent hover:text-gray-700'}`}>
                {label}
              </button>
            ))}
          </div>

          {formError && (
            <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 border border-red-100 px-3.5 py-3 text-xs text-red-700">
              <span className="shrink-0">⚠️</span><span>{formError}</span>
            </div>
          )}
          {success && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 border border-green-100 px-3.5 py-2.5 text-xs text-green-700">
              ✅ {success}
            </div>
          )}

          {/* ── LOGIN ── */}
          {tab === 'login' && (
            <>
              {showForgot ? (
                <form
                  onSubmit={handleForgotPassword}
                  className="flex flex-col gap-4"
                >
                  <div>
                    <p className="text-lg font-medium text-gray-900 mb-0.5">
                      Reset your password
                    </p>

                    <p className="text-xs text-gray-400">
                      Enter your registered email address.
                    </p>
                  </div>

                  <Field label="Email">
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={inputCls(false)}
                    />
                  </Field>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#8e4440] text-white text-sm font-medium rounded-lg"
                  >
                    Send reset link
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowForgot(false)
                      setForgotEmail('')
                    }}
                    className="text-xs text-gray-500 hover:text-[#8e4440]"
                  >
                    Back to sign in
                  </button>
                </form>
              ) : (
                <form onSubmit={loginFormik.handleSubmit} noValidate className="flex flex-col gap-3.5">
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-0.5">Welcome back</p>
                  <p className="text-xs text-gray-400">Use your username or registered email</p>
                </div>

                <Field label="Email or username" error={loginFormik.touched.emailOrUsername && loginFormik.errors.emailOrUsername}>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">👤</span>
                    <input type="text" name="emailOrUsername" value={loginFormik.values.emailOrUsername}
                      onChange={(e) => { setFormError(''); loginFormik.handleChange(e) }}
                      onBlur={loginFormik.handleBlur}
                      placeholder="kminchelle  or  you@email.com"
                      className={inputCls(loginFormik.touched.emailOrUsername && loginFormik.errors.emailOrUsername)}
                      autoComplete="username" autoCapitalize="none" autoCorrect="off" spellCheck="false" />
                  </div>
                </Field>

                <Field label="Password" error={loginFormik.touched.password && loginFormik.errors.password}>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔒</span>
                    <input type={showPass ? 'text' : 'password'} name="password" value={loginFormik.values.password}
                      onChange={(e) => { setFormError(''); loginFormik.handleChange(e) }}
                      onBlur={loginFormik.handleBlur}
                      placeholder="Enter your password"
                      className={inputCls(loginFormik.touched.password && loginFormik.errors.password) + ' pr-10'}
                      autoComplete="current-password" />
                    <button type="button" onClick={() => setShowPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPass ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </button>
                  </div>
                </Field>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer select-none">
                    <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}
                      className="w-3.5 h-3.5 accent-[#8e4440]" />
                    Remember me
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      clear()
                      setForgotEmail(loginFormik.values.emailOrUsername)
                      setShowForgot(true)
                    }}
                    className="text-xs text-[#8e4440] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <button type="submit" disabled={loading || loginFormik.isSubmitting}
                  className="w-full py-2.5 bg-[#8e4440] text-white text-sm font-medium rounded-lg hover:bg-[#e03560] transition-colors disabled:opacity-55 flex items-center justify-center gap-2">
                  {(loading || loginFormik.isSubmitting) && <Spin />} {loading || loginFormik.isSubmitting ? 'Signing in…' : 'Sign in'}
                </button>

                <button type="button" onClick={handleDemoLogin} disabled={loading}
                  className="w-full py-2.5 text-xs text-gray-500 border border-dashed border-gray-200 rounded-lg hover:border-[#8e4440] hover:text-[#8e4440] transition-all disabled:opacity-50 flex items-center justify-center gap-1.5">
                  {loading ? <Spin /> : '🧪'} Use demo account
                </button>

                <OrLine />
                <SocialRow onToast={showToast} />

                <p className="text-xs text-center text-gray-400">
                  No account?{' '}
                  <button type="button" onClick={() => switchTab('register')}
                    className="text-[#8e4440] font-medium hover:underline">
                    Create one free
                  </button>
                </p>
              </form>
              )}             
            </>
          )}

          {/* ── REGISTER ── */}
          {tab === 'register' && (
            <form onSubmit={registerFormik.handleSubmit} noValidate className="flex flex-col gap-3">
              <div>
                <p className="text-lg font-medium text-gray-900 mb-0.5">Create account</p>
                <p className="text-xs text-gray-400">Free forever. No credit card needed.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="First name" error={registerFormik.touched.firstName && registerFormik.errors.firstName}>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">👤</span>
                    <input type="text" name="firstName" value={registerFormik.values.firstName}
                      onChange={(e) => { setFormError(''); registerFormik.handleChange(e) }}
                      onBlur={registerFormik.handleBlur}
                      placeholder="Ritu" className={inputCls(registerFormik.touched.firstName && registerFormik.errors.firstName)} autoComplete="given-name" />
                  </div>
                </Field>
                <Field label="Last name" error={registerFormik.touched.lastName && registerFormik.errors.lastName}>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">👤</span>
                    <input type="text" name="lastName" value={registerFormik.values.lastName}
                      onChange={(e) => { setFormError(''); registerFormik.handleChange(e) }}
                      onBlur={registerFormik.handleBlur}
                      placeholder="Kujur" className={inputCls(registerFormik.touched.lastName && registerFormik.errors.lastName)} autoComplete="family-name" />
                  </div>
                </Field>
              </div>

              <Field label="Email" error={registerFormik.touched.email && registerFormik.errors.email}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">📧</span>
                  <input type="email" name="email" value={registerFormik.values.email}
                    onChange={(e) => { setFormError(''); registerFormik.handleChange(e) }}
                    onBlur={registerFormik.handleBlur}
                    placeholder="you@example.com" className={inputCls(registerFormik.touched.email && registerFormik.errors.email)} autoComplete="email" />
                </div>
              </Field>

              <Field label="Mobile" error={registerFormik.touched.phone && registerFormik.errors.phone}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">📱</span>
                  <input type="tel" name="phone" value={registerFormik.values.phone}
                    onChange={(e) => {
                      setFormError('')
                      registerFormik.setFieldValue('phone', e.target.value.replace(/\D/g, '').slice(0, 10))
                    }}
                    onBlur={registerFormik.handleBlur}
                    placeholder="9100000000" className={inputCls(registerFormik.touched.phone && registerFormik.errors.phone)} autoComplete="tel" />
                </div>
              </Field>

              <Field label="Password" error={registerFormik.touched.password && registerFormik.errors.password}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔒</span>
                  <input type={showRPass ? 'text' : 'password'} name="password" value={rPass}
                    onChange={(e) => { setFormError(''); registerFormik.handleChange(e) }}
                    onBlur={registerFormik.handleBlur}
                    placeholder="Min 8 chars, uppercase & number"
                    className={inputCls(registerFormik.touched.password && registerFormik.errors.password) + ' pr-10'} autoComplete="new-password" />
                  <button type="button" onClick={() => setShowRPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showRPass ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                  </button>
                </div>
                {rPass && (
                  <div className="mt-1.5">
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden mb-1.5">
                      <div className="h-full rounded-full transition-all duration-300"
                        style={{ width: pwWidths[pwScore] || '0%', background: pwColors[pwScore] || '#e24b4a' }} />
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

              <Field label="Confirm password" error={registerFormik.touched.confirmPassword && registerFormik.errors.confirmPassword}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔐</span>
                  <input type={showCPass ? 'text' : 'password'} name="confirmPassword" value={registerFormik.values.confirmPassword}
                    onChange={(e) => { setFormError(''); registerFormik.handleChange(e) }}
                    onBlur={registerFormik.handleBlur}
                    placeholder="Re-enter password"
                    className={inputCls(registerFormik.touched.confirmPassword && registerFormik.errors.confirmPassword) + ' pr-16'} autoComplete="new-password" />
                  {registerFormik.values.confirmPassword && (
                    <span className="absolute right-9 top-1/2 -translate-y-1/2 text-xs">
                      {rPass === registerFormik.values.confirmPassword ? '✅' : '❌'}
                    </span>
                  )}
                  <button type="button" onClick={() => setShowCPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showCPass ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                  </button>
                </div>
              </Field>

              <div>
                <label className="flex items-start gap-2 text-xs text-gray-500 cursor-pointer select-none">
                  <input type="checkbox" name="terms" checked={registerFormik.values.terms}
                    onChange={(e) => { setFormError(''); registerFormik.handleChange(e) }}
                    onBlur={registerFormik.handleBlur}
                    className="w-3.5 h-3.5 mt-0.5 accent-[#8e4440] shrink-0" />
                  I agree to the{' '}
                  <span className="text-[#8e4440] ml-0.5 hover:underline">Terms</span>
                  &nbsp;and&nbsp;
                  <span className="text-[#8e4440] hover:underline">Privacy Policy</span>
                </label>
                {registerFormik.touched.terms && registerFormik.errors.terms && (
                  <p className="mt-1 text-xs text-red-600">{registerFormik.errors.terms}</p>
                )}
              </div>

              <button type="submit"
                className="w-full py-2.5 bg-[#8e4440] text-white text-sm font-medium rounded-lg hover:bg-[#e03560] transition-colors">
                {registerFormik.isSubmitting ? 'Creating account…' : 'Create account'}
              </button>

              <OrLine />
              <SocialRow onToast={showToast} />

              <p className="text-xs text-center text-gray-400">
                Already have an account?{' '}
                <button type="button" onClick={() => switchTab('login')}
                  className="text-[#8e4440] font-medium hover:underline">Sign in</button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
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
    <div className="grid grid-cols-1 gap-2">
      {[[<GoogleIcon fontSize="small" />, 'Google']].map(([icon, name]) => (
        <button key={name} type="button" onClick={() => onToast(`${name} login coming soon!`)}
          className="flex items-center justify-center gap-2 py-2.5 text-xs font-medium text-gray-600 border border-gray-100 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all">
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