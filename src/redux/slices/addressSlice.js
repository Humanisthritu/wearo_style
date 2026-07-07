// src/redux/slices/addressSlice.js

import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY = 'dripkart_addresses'

// ── localStorage helpers ──────────────────────────────────────────────────────
function loadAddresses() {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch { /* ignore */ }
  // Default addresses on first load
  return [
    {
      id: 'addr_1',
      label: 'Home',
      name: 'Rahul Sharma',
      phone: '9876543210',
      line1: 'Flat 4B, Sunshine Apartments, 12th Cross',
      line2: 'Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      country: 'India',
      isDefault: true,
    },
    {
      id: 'addr_2',
      label: 'Work',
      name: 'Rahul Sharma',
      phone: '9876543210',
      line1: '3rd Floor, Tech Park, Outer Ring Road',
      line2: 'Marathahalli',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560037',
      country: 'India',
      isDefault: false,
    },
  ]
}

function persist(addresses) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses))
  } catch { /* ignore */ }
}

// ── Initial state ─────────────────────────────────────────────────────────────
const initialState = {
  addresses: [],        // loaded on client via rehydrateAddresses action
  isLoading: false,
  error: null,
}

// ── Slice ─────────────────────────────────────────────────────────────────────
const addressSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {
    // Called by AddressProvider on client mount — safe from SSR mismatch
    rehydrateAddresses(state) {
      state.addresses = loadAddresses()
    },

    addAddress(state, action) {
      const newAddress = {
        ...action.payload,
        id: `addr_${Date.now()}`,
      }
      // If new address is default, clear others
      if (newAddress.isDefault) {
        state.addresses = state.addresses.map((a) => ({ ...a, isDefault: false }))
      }
      // If this is the first address, make it default automatically
      if (state.addresses.length === 0) {
        newAddress.isDefault = true
      }
      state.addresses.push(newAddress)
      persist(state.addresses)
    },

    updateAddress(state, action) {
      const { id, ...updates } = action.payload
      state.addresses = state.addresses.map((addr) => {
        if (addr.id === id) return { ...addr, ...updates }
        // If updated address is default, remove default from others
        if (updates.isDefault) return { ...addr, isDefault: false }
        return addr
      })
      persist(state.addresses)
    },

    deleteAddress(state, action) {
      const deletedWasDefault = state.addresses.find(
        (a) => a.id === action.payload
      )?.isDefault

      state.addresses = state.addresses.filter((a) => a.id !== action.payload)

      // Auto-assign default to first remaining address if we deleted the default
      if (deletedWasDefault && state.addresses.length > 0) {
        state.addresses[0].isDefault = true
      }
      persist(state.addresses)
    },

    setDefaultAddress(state, action) {
      state.addresses = state.addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === action.payload,
      }))
      persist(state.addresses)
    },
  },
})

export const {
  rehydrateAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = addressSlice.actions

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectAllAddresses    = (s) => s.addresses.addresses
export const selectDefaultAddress  = (s) => s.addresses.addresses.find((a) => a.isDefault) || null
export const selectAddressById     = (id) => (s) => s.addresses.addresses.find((a) => a.id === id)
export const selectAddressCount    = (s) => s.addresses.addresses.length

export default addressSlice.reducer