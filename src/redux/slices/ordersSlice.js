// src/redux/slices/ordersSlice.js

import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY = 'dripkart_orders'

function loadOrders() {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch { return [] }
}

function persist(orders) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(orders)) } catch { /* ignore */ }
}

const initialState = {
  orders: [],   // rehydrated on client mount
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    rehydrateOrders(state) {
      state.orders = loadOrders()
    },

    placeOrder(state, action) {
      const {
        items, address, paymentMethod,
        subtotal, discount, deliveryCharge, couponCode, grandTotal,
        orderId, // optional — allows caller to pre-generate and reuse the same id
      } = action.payload

      const newOrder = {
        id: orderId || ('DK' + Date.now().toString().slice(-8)),
        date: new Date().toISOString(),
        status: 'confirmed',
        items: items.map((item) => ({
          productId: item.product.id,
          title: item.product.title,
          brand: item.product.brand,
          thumbnail: item.product.thumbnail,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          priceAtPurchase: item.product.price,
        })),
        address,
        paymentMethod,
        pricing: {
          subtotal,
          discount,
          deliveryCharge,
          couponCode: couponCode || null,
          grandTotal,
        },
        trackingId: null,
        estimatedDelivery: deliveryCharge > 0
          ? new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
          : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      }

      state.orders.unshift(newOrder)
      persist(state.orders)
    },

    updateOrderStatus(state, action) {
      const { id, status } = action.payload
      const order = state.orders.find((o) => o.id === id)
      if (order) {
        order.status = status
        persist(state.orders)
      }
    },
  },
})

export const { rehydrateOrders, placeOrder, updateOrderStatus } = ordersSlice.actions

export const selectAllOrders = (s) => s.orders.orders
export const selectOrderById = (id) => (s) => s.orders.orders.find((o) => o.id === id)
export const selectOrdersCount = (s) => s.orders.orders.length

export default ordersSlice.reducer