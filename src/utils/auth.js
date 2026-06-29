// src/utils/auth.js

const USERS_KEY   = 'dripkart_users'
const SESSION_KEY = 'dripkart_session'

// ── tiny hash for local users ─────────────────────────────────────────────────
function simpleHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0
  }
  return hash.toString(16)
}

// ── cookie helpers (needed for middleware on the Edge) ────────────────────────
function setCookie(name, value, days = 7) {
  if (typeof document === 'undefined') return
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

function deleteCookie(name) {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
}

// ─────────────────────────────────────────────────────────────────────────────
// SESSION
// ─────────────────────────────────────────────────────────────────────────────

export function saveSession(user) {
  if (typeof window === 'undefined') return
  const { passwordHash, ...safe } = user
  localStorage.setItem(SESSION_KEY, JSON.stringify(safe))
  setCookie('dripkart_session', String(safe.id || safe.email || 'logged_in'))
}

export function getSession() {
  if (typeof window === 'undefined') return null
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
  } catch {
    return null
  }
}

export function clearSession() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(SESSION_KEY)
  deleteCookie('dripkart_session')
}

// ─────────────────────────────────────────────────────────────────────────────
// LOCAL USER STORE
// ─────────────────────────────────────────────────────────────────────────────

export function getStoredUsers() {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  } catch {
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function findLocalUserByEmail(email) {
  return (
    getStoredUsers().find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    ) || null
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN
// Strategy:
//   1. Try DummyJSON API  (works for "kminchelle" / "0lelplR")
//   2. If API fails OR returns 400, try local registered users by email
// ─────────────────────────────────────────────────────────────────────────────

export async function loginUser({ emailOrUsername, password }) {
  const trimmedUser = emailOrUsername.trim()
  const trimmedPass = password  // do NOT trim passwords

  // ── 1. DummyJSON API ──────────────────────────────────────────────────────
  let apiError = null
  try {
    const res = await fetch('https://dummyjson.com/auth/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username:      trimmedUser,   // DummyJSON always needs "username" key
        password:      trimmedPass,
        expiresInMins: 60,
      }),
    })

    // Parse response regardless of status so we can read error messages
    const data = await res.json()

    if (res.ok) {
      // ✅ API login succeeded
      const user = {
        id:        data.id,
        firstName: data.firstName,
        lastName:  data.lastName,
        email:     data.email,
        phone:     data.phone   ?? '',
        image:     data.image   ?? '',
        username:  data.username,
        token:     data.token,
        source:    'api',
      }
      saveSession(user)
      return { success: true, user, token: data.token }
    }

    // API returned 400/401 — wrong credentials for that username
    // Log for debugging but don't show raw API error to user
    apiError = data?.message || `API error ${res.status}`
    console.warn('[DripKart] DummyJSON login failed:', apiError)

  } catch (networkErr) {
    // No internet, CORS, or other fetch error
    apiError = networkErr.message
    console.warn('[DripKart] DummyJSON API unreachable:', networkErr.message)
  }

  // ── 2. Fallback: locally registered users ─────────────────────────────────
  // Match by email (local users are identified by email, not username)
  const localUser = findLocalUserByEmail(trimmedUser)

  if (!localUser) {
    // Give a helpful message depending on what happened
    if (apiError) {
      return {
        success: false,
        error:
          'Credentials not found. Use the demo account (kminchelle / 0lelplR) or register a new account.',
      }
    }
    return {
      success: false,
      error: 'No account found with this email or username.',
    }
  }

  if (localUser.passwordHash !== simpleHash(trimmedPass)) {
    return { success: false, error: 'Incorrect password. Please try again.' }
  }

  // ✅ Local login succeeded
  const { passwordHash, ...safe } = localUser
  saveSession(safe)
  return { success: true, user: safe }
}

// ─────────────────────────────────────────────────────────────────────────────
// REGISTER
// ─────────────────────────────────────────────────────────────────────────────

export function registerUser({ firstName, lastName, email, phone, password }) {
  const users = getStoredUsers()

  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: 'An account with this email already exists.' }
  }

  const newUser = {
    id:           Date.now(),
    firstName:    firstName.trim(),
    lastName:     lastName.trim(),
    email:        email.trim().toLowerCase(),
    phone:        phone.replace(/\D/g, ''),
    passwordHash: simpleHash(password),
    image:        `https://api.dicebear.com/7.x/initials/svg?seed=${firstName}+${lastName}`,
    source:       'local',
    createdAt:    new Date().toISOString(),
  }

  saveUsers([...users, newUser])

  const { passwordHash, ...safe } = newUser
  saveSession(safe)
  return { success: true, user: safe }
}

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validatePhone(phone) {
  return /^[6-9]\d{9}$/.test(phone.replace(/[\s-]/g, ''))
}

export function validatePassword(password) {
  const checks = {
    length:    password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number:    /\d/.test(password),
  }
  const score = Object.values(checks).filter(Boolean).length
  return {
    checks,
    score,
    strength: score <= 1 ? 'Weak' : score <= 2 ? 'Fair' : score === 3 ? 'Good' : 'Strong',
    color:    score <= 1 ? '#ef4444' : score <= 2 ? '#f59e0b' : score === 3 ? '#3b82f6' : '#22c55e',
    valid:    score >= 3,
  }
}

export function getPasswordStrengthWidth(score) {
  return `${(score / 4) * 100}%`
}