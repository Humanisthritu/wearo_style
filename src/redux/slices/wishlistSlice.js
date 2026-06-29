

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const index = state.items.findIndex((p) => p.id === action.payload.id)

      if (index > -1) {
        state.items.splice(index, 1)
      } else {
        state.items.push(action.payload)
      }
    },

    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((p) => p.id !== action.payload)
    },

    clearWishlist: (state) => {
      state.items = []
    },
  },
})

export const { toggleWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions


export const selectWishlistItems = (state) => state.wishlist.items

export const selectWishlistCount = (state) =>
  state.wishlist.items.length

export const selectIsWishlisted = (state, productId) =>
  state.wishlist.items.some((p) => p.id === productId)

export default wishlistSlice.reducer