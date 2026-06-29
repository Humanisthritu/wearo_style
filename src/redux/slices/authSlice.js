// src/redux/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit'
import { getSession, clearSession, saveSession } from '@/utils/auth'

function loadInitialState() {
  const session = getSession()  // reads localStorage on app boot
  return {
    user:            session ?? null,
    isAuthenticated: !!session,
    isLoading:       false,
    error:           null,
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: loadInitialState,
  reducers: {
    loginSuccess(state, action) {
      state.user            = action.payload
      state.isAuthenticated = true
      state.isLoading       = false
      state.error           = null
      saveSession(action.payload)   // localStorage + cookie
    },
    logout(state) {
      state.user            = null
      state.isAuthenticated = false
      state.error           = null
      clearSession()                // localStorage + cookie deleted
    },
    updateUser(state, action) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
        saveSession(state.user)
      }
    },
  },
})

export const { loginSuccess, logout, updateUser } = authSlice.actions

export const selectUser            = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated

export default authSlice.reducer