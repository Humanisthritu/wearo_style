// src/utils/auth.js
// FIX: every function that touches browser APIs (localStorage, document.cookie)
// now guards with  typeof window !== 'undefined'
// so they're safe to import in Server Components and during SSR.

const USERS_KEY   = 'dripkart_users'
const SESSION_KEY = 'dripkart_session'

// ── tiny hash (local users only) ──────────────────────────────────────────────
function simpleHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0
  }
  return hash.toString(16)
}

// ── cookie helpers ────────────────────────────────────────────────────────────
function setCookie(name, value, days = 7) {
  if (typeof document === 'undefined') return   // ← SSR guard
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

function deleteCookie(name) {
  if (typeof document === 'undefined') return   // ← SSR guard
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
}

// ── session ───────────────────────────────────────────────────────────────────

export function saveSession(user) {
  if (typeof window === 'undefined') return     // ← SSR guard
  const { passwordHash, ...safe } = user
  localStorage.setItem(SESSION_KEY, JSON.stringify(safe))
  setCookie('dripkart_session', String(safe.id || safe.email || 'logged_in'))
}

export function getSession() {
  if (typeof window === 'undefined') return null  // ← SSR guard
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
  } catch {
    return null
  }
}

export function clearSession() {
  if (typeof window === 'undefined') return      // ← SSR guard
  localStorage.removeItem(SESSION_KEY)
  deleteCookie('dripkart_session')
}

// ── local user store ──────────────────────────────────────────────────────────

export function getStoredUsers() {
  if (typeof window === 'undefined') return []   // ← SSR guard
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  } catch {
    return []
  }
}

function saveUsers(users) {
  if (typeof window === 'undefined') return
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function findLocalUserByEmail(email) {
  return getStoredUsers().find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  ) || null
}

// ── login ─────────────────────────────────────────────────────────────────────

export async function loginUser({ emailOrUsername, password }) {
  const trimmedUser = emailOrUsername.trim()

  // 1. Try DummyJSON API
  try {
    const res = await fetch('https://dummyjson.com/auth/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username:      trimmedUser,
        password,
        expiresInMins: 60,
      }),
    })

    const data = await res.json()

    if (res.ok) {
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

    console.warn('[DripKart] DummyJSON login failed:', data?.message)
  } catch (err) {
    console.warn('[DripKart] DummyJSON API unreachable:', err.message)
  }

  // 2. Fallback: local registered users
  const localUser = findLocalUserByEmail(trimmedUser)

  if (!localUser) {
    return {
      success: false,
      error: 'No account found. Try the demo credentials (kminchelle / 0lelplR) or register.',
    }
  }

  if (localUser.passwordHash !== simpleHash(password)) {
    return { success: false, error: 'Incorrect password. Please try again.' }
  }

  const { passwordHash, ...safe } = localUser
  saveSession(safe)
  return { success: true, user: safe }
}

// ── register ──────────────────────────────────────────────────────────────────

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

// ── validation ────────────────────────────────────────────────────────────────

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