import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

const initialState = {
    items: [],
    featured: [],
    currentProduct:  null,
    isLoading : false,
    error: null,
    totalProduct: 0,
    currentPage:  1,
    limit: 20
}

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async ({ limit = 20, skip = 0 }) => {
    const res = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`)
    if (!res.ok) throw new Error('Failed to fetch products')
    return res.json()
  }
)

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id) => {
    const res = await fetch(`https://dummyjson.com/products/${id}`)
    if (!res.ok) throw new Error('Product not found')
    return res.json()
  }
)

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchByCategory',
  async (category) => {
    const res = await fetch(`https://dummyjson.com/products/category/${category}`)
    if (!res.ok) throw new Error('Failed to fetch category products')
    return res.json()
  }
)

export const searchProducts = createAsyncThunk(
  'products/search',
  async (query) => {
    const res = await fetch(`https://dummyjson.com/products/search?q=${query}`)
    if (!res.ok) throw new Error('Search failed')
    return res.json()
  }
)

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers : {
        setCurrentProduct: (state, action) => {
            state.currentProduct = action.payload
        },
        setPage: (state, action) => {
            state.currentPage = action.payload
        }
    }
})

export const { setCurrentProduct, setPage } = productSlice.actions

export const selectProducts = (state) => state.products.items
export const selectCurrentProduct = (state) => state.products.currentProduct
export const selectProductsLoading = (state) => state.products.isLoading
export const selectTotalProducts = (state) => state.products.totalProducts

export default productSlice.reducer
