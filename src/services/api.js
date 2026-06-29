const BASE_URL = 'https://dummyjson.com'

// 🧥 ONLY CLOTHING CATEGORIES
const CLOTHING_CATEGORIES = [
  'tops',
  'womens-dresses',
  'womens-shoes',
  'mens-shirts',
  'mens-shoes',
  'womens-bags',
  'womens-jewellery',
]

// =========================
// 🔥 CORE HELPER (IMPORTANT)
// =========================

async function getAllClothingProducts() {
  try {
    const results = await Promise.all(
      CLOTHING_CATEGORIES.map((cat) =>
        fetch(`${BASE_URL}/products/category/${cat}`, {
          next: { revalidate: 3600 }, // Next.js cache
        }).then((res) => {
          if (!res.ok) return { products: [] }
          return res.json()
        })
      )
    )

    return results.flatMap((r) => r.products)
  } catch (err) {
    console.error('Clothing fetch failed', err)
    return []
  }
}

// =========================
// 🧥 API OBJECT
// =========================

export const api = {
  // =========================
  // 🧥 BASE PRODUCTS
  // =========================

  getProducts: async (limit = 100, skip = 0) => {
    const products = await getAllClothingProducts()

    return {
      products: products.slice(skip, skip + limit),
      total: products.length,
      skip,
      limit,
    }
  },

  getProductById: async (id) => {
    const res = await fetch(`${BASE_URL}/products/${id}`)

    if (!res.ok) throw new Error(`Product ${id} not found`)

    const data = await res.json()

    if (!CLOTHING_CATEGORIES.includes(data.category)) {
      throw new Error('Not a clothing product')
    }

    return data
  },

  getProductsByCategory: async (category) => {
    if (!CLOTHING_CATEGORIES.includes(category)) {
      return { products: [] }
    }

    const res = await fetch(
      `${BASE_URL}/products/category/${category}`,
      {
        next: { revalidate: 3600 },
      }
    )

    if (!res.ok) throw new Error('Failed to fetch category')

    return res.json()
  },

  searchProducts: async (query) => {
    const products = await getAllClothingProducts()

    return {
      products: products.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase())
      ),
    }
  },

  getCategories: async () => {
    return CLOTHING_CATEGORIES
  },

  // =========================
  // 🔥 HOME PAGE SECTIONS
  // =========================

  getTrendingProducts: async () => {
    const products = await getAllClothingProducts()

    return products
      .filter((p) => p.rating >= 4.4)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8)
  },

  getNewArrivals: async () => {
    const products = await getAllClothingProducts()

    return products
      .sort((a, b) => b.id - a.id)
      .slice(0, 8)
  },

  getBestSellers: async () => {
    const products = await getAllClothingProducts()

    return products
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 8)
  },

  getRelatedProducts: async (category, currentId) => {
    if (!CLOTHING_CATEGORIES.includes(category)) return []

    const res = await fetch(
      `${BASE_URL}/products/category/${category}`
    )

    if (!res.ok) return []

    const data = await res.json()

    return data.products
      .filter((p) => p.id !== currentId)
      .slice(0, 8)
  },

  // =========================
  // 🔍 ADVANCED FILTERS
  // =========================

  filterProducts: async ({
    category,
    minPrice,
    maxPrice,
    rating,
    search,
  }) => {
    let products = []

    if (category && CLOTHING_CATEGORIES.includes(category)) {
      const data = await api.getProductsByCategory(category)
      products = data.products
    } else {
      products = await getAllClothingProducts()
    }

    if (search) {
      products = products.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (minPrice !== undefined) {
      products = products.filter((p) => p.price >= minPrice)
    }

    if (maxPrice !== undefined) {
      products = products.filter((p) => p.price <= maxPrice)
    }

    if (rating) {
      products = products.filter((p) => p.rating >= rating)
    }

    return products
  },

  // =========================
  // 📄 PAGINATION
  // =========================

  getPaginatedProducts: async (page = 1, limit = 20) => {
    const skip = (page - 1) * limit
    return api.getProducts(limit, skip)
  },

  // =========================
  // 🔐 AUTH
  // =========================

  login: async (username, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        password,
        expiresInMins: 60,
      }),
    })

    if (!res.ok) throw new Error('Invalid credentials')

    return res.json()
  },

  // =========================
  // 👤 USERS
  // =========================

  getUser: async (id) => {
    const res = await fetch(`${BASE_URL}/users/${id}`)

    if (!res.ok) throw new Error('User not found')

    return res.json()
  },
}

// =========================
// DEMO LOGIN
// =========================

export const DEMO_CREDENTIALS = {
  username: 'kminchelle',
  password: '0lelplR',
}