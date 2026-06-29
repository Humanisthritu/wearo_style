import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    items: [],
    couponCode: "",
    discountPercent: 0
}

const VALID_COUPONS = {
    DRIP20: 20,
    STYLE10: 10,
    FIRST15: 15,
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const { product, quantity = 1, size = 'M', color = 'Black' } = action.payload

            const existing = state.items.find((item) => item.product.id === product.id && item.size === size);

            if (existing) {
                existing.quantity += quantity
            } else {
                state.items.push({ product, quantity, size, color })
            }
        },

        removeFromCart: (state, action) => {
            const { productId, size } = action.payload

            state.items = state.items.filter((item) => !(item.product.id === productId && item.size === size))

        },

        updateQuantity: (state, action) => {
            const { productId, size, quantity } = action.payload

            const item = state.items.find(
                (i) => i.product.id === productId && i.size === size
            )

            if (item) {
                item.quantity = Math.max(1, quantity)
            }
        },

        applyCoupon: (state, action) => {
            const code = action.payload.toUpperCase()

            if (VALID_COUPONS[code]) {
                state.couponCode = code
                state.discountPercent = VALID_COUPONS[code]
            }
        },

        removeCoupon: (state) => {
            state.couponCode = ''
            state.discountPercent = 0
        },

        clearCart: (state) => {
            state.items = []
            state.couponCode = ''
            state.discountPercent = 0
        },
    }
})

export const {
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    clearCart,
} = cartSlice.actions

export const selectCartItems = (state) => state.cart.items;

export const selectCartCount = (state) =>
    state.cart.items.reduce((acc, item) => acc + item.quantity, 0);

export const selectCartSubtotal = (state) =>
  state.cart.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

export const selectCartDiscount = (state) => {
  const subtotal = selectCartSubtotal(state);
  return Math.round(subtotal * (state.cart.discountPercent / 100));
};  

export const selectCartTotal = (state) => {
  const subtotal = selectCartSubtotal(state);
  const discount = selectCartDiscount(state);
  return subtotal - discount;
};


export default cartSlice.reducer

