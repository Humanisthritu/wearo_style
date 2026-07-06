

import { createSlice } from '@reduxjs/toolkit'
import { saveSession, clearSession } from '@/utils/auth'

const initialState = {
  user:            null,   // always null on server
  isAuthenticated: false,  // always false on server
  isLoading:       false,
  error:           null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,            // plain object — no function, no localStorage call
  reducers: {
    loginSuccess(state, action) {
      state.user            = action.payload
      state.isAuthenticated = true
      state.isLoading       = false
      state.error           = null
      if (typeof window !== 'undefined') saveSession(action.payload)
    },
    logout(state) {
      state.user            = null
      state.isAuthenticated = false
      state.error           = null
      if (typeof window !== 'undefined') clearSession()
    },
    updateUser(state, action) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
        if (typeof window !== 'undefined') saveSession(state.user)
      }
    },
    // Called by AuthProvider on mount (client-only) to rehydrate from localStorage
    rehydrate(state, action) {
      if (action.payload) {
        state.user            = action.payload
        state.isAuthenticated = true
      }
    },
  },
})

export const { loginSuccess, logout, updateUser, rehydrate } = authSlice.actions

export const selectUser            = (s) => s.auth.user
export const selectIsAuthenticated = (s) => s.auth.isAuthenticated
export const selectAuthLoading     = (s) => s.auth.isLoading

export default authSlice.reducer