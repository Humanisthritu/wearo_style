'use client'
// src/components/common/AuthProvider.js
// Runs ONLY on the client, after hydration is complete.
// Reads localStorage and dispatches rehydrate so Redux stays in sync.
// This avoids the SSR mismatch because we never touch localStorage during SSR.

import { useEffect } from 'react'
import { useAppDispatch } from '@/hooks/redux'
import { rehydrate } from '@/redux/slices/authSlice'
import { getSession } from '@/utils/auth'

export default function AuthProvider({ children }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Only runs on client after first render — safe to read localStorage here
    const session = getSession()
    if (session) {
      dispatch(rehydrate(session))
    }
  }, [dispatch])

  return children
}