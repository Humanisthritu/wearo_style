import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    categories: [],
    priceRange: [0, 5000],
    sizes: [],
    colors: [],
    ratings: [],
    sort: 'relevance',
}

const filterSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        toggleCategory: (state, action) => {
            const idx = state.categories.indexOf(action.payload)
            if (idx > -1) state.categories.splice(idx, 1)
            else state.categories.push(action.payload)
        },

        setPriceRange: (state, action) => {
            state.priceRange = action.payload
        },

        toggleSize: (state, action) => {
            const idx = state.sizes.indexOf(action.payload)
            if (idx > -1) state.sizes.splice(idx, 1)
            else state.sizes.push(action.payload)
        },

        toggleColor: (state, action) => {
            const idx = state.colors.indexOf(action.payload)
            if (idx > -1) state.colors.splice(idx, 1)
            else state.colors.push(action.payload)
        }, 

        toggleRating: (state, action) => {
         const idx =  state.ratings.indexOf(action.payload)
         if(idx > -1) state.ratings.splice(idx, 1)
         else state.ratings.push(action.payload)   
        },

        setSort: (state, action) => {
         state.sort  = action.payload 
        },

        clearFilters : () => initialState
    }
})

export const selectFilters = (state) => state.filters

export const {
  toggleCategory,
  setPriceRange,
  toggleSize,
  toggleColor,
  toggleRating,
  setSort,
  clearFilters,
} = filterSlice.actions
 
 
export default filterSlice.reducer