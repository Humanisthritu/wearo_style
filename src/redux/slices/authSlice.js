// src/redux/slices/authSlice.jsx
import { createSlice } from '@reduxjs/toolkit'
import { getSession, clearSession, saveSession } from '@/utils/auth'

// Load initial state from localStorage
const loadInitialState = () => {
  const session = getSession()

  return {
    user: session ?? null,
    isAuthenticated: !!session,
    isLoading: false,
    error: null,
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: loadInitialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.isLoading = false
      state.error = null

      saveSession(action.payload)

      console.log('Session saved, current session:', getSession())
    },

    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.error = null

      clearSession()
    },

    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
        saveSession(state.user)
      }
    },
  },
})

// Actions
export const { loginSuccess, logout, updateUser } = authSlice.actions

// Selectors
export const selectUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated

// Reducer
export default authSlice.reducer