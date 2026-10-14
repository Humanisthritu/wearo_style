
'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, ArrowUpRight } from 'lucide-react'
import { api } from '@/services/api'

export default function SearchBar() {
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')
  const [suggestions] = useState([
    'T-Shirts',
    'Jeans',
    'Dresses',
    'Sneakers',
    'Jackets',
    'Watches',
    'Bags',
  ])
  const [showSuggestions, setShowSuggestions] = useState(false)
  

  const router = useRouter()
  const inputRef = useRef(null)

  const filtered = suggestions.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase())
  )

  
const handleSearch = async (q = query) => {
  const searchQuery = q.trim()

  if (!searchQuery) return

  try {
    const data = await api.getProducts()
    const productsList = data?.products || []

    setProducts(productsList)

    const filteredProducts = productsList.filter((product) =>{
     return product?.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product?.brand?.toLowerCase().includes(searchQuery.toLowerCase())
    }
    )
     const params = new URLSearchParams({
      filteredData: JSON.stringify(filteredProducts),
      q: searchQuery,
    })


    console.log(filteredProducts, 'filtered products')

    setShowSuggestions(false)
    setQuery('')

     router.push(`/search?${params.toString()}`)
  } catch (err) {
    console.error('Error searching products:', err)
  }
}


  useEffect(() => {
    const handler = (e) => {
      if (
        inputRef.current &&
        !inputRef.current
          .closest('.search-wrapper')
          ?.contains(e.target)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handler)

    return () => {
      document.removeEventListener('mousedown', handler)
    }
  }, [])

  return (
    <div className="search-wrapper relative w-full">
      {/* Search Input */}
      <div
        className="
          group flex items-center gap-3
          w-full rounded-xl
          border border-gray-200
          bg-gray-50/80
          px-4
          transition-all duration-200
          hover:border-gray-300
          focus-within:border-[#8e4440]
          focus-within:bg-white
          focus-within:shadow-[0_0_0_3px_rgba(142,68,64,0.08)]
        "
      >
        <Search
          size={19}
          strokeWidth={1.8}
          className="shrink-0 text-gray-400 transition-colors group-focus-within:text-[#8e4440]"
        />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowSuggestions(true)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch()
            if (e.key === 'Escape') setShowSuggestions(false)
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search products, brands..."
          autoComplete="off"
          className="
            min-w-0 flex-1
            bg-transparent py-3
            text-sm text-gray-800
            placeholder:text-gray-400
            outline-none
          "
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setShowSuggestions(false)
              inputRef.current?.focus()
            }}
            aria-label="Clear search"
            className="
              flex h-6 w-6 shrink-0 items-center justify-center
              rounded-full text-gray-400
              transition-colors hover:bg-gray-200
              hover:text-gray-700
            "
          >
            <X size={15} />
          </button>
        )}

        {!query && (
          <span className="hidden shrink-0 text-[10px] font-medium tracking-wide text-gray-400 sm:block">
            SEARCH
          </span>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && query && filtered.length > 0 && (
        <div
          className="
            absolute left-0 right-0 top-full z-50 mt-2
            overflow-hidden rounded-xl
            border border-gray-100 bg-white
            shadow-[0_12px_40px_rgba(0,0,0,0.10)]
            animate-in fade-in slide-in-from-top-1 duration-150
          "
        >
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
              Search suggestions
            </p>
          </div>

          <div className="p-1.5">
            {filtered.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSearch(s)}
                className="
                  group flex w-full items-center gap-3
                  rounded-lg px-3 py-3
                  text-left text-sm text-gray-700
                  transition-colors duration-150
                  hover:bg-[#8e4440]/[0.05]
                  hover:text-[#8e4440]
                "
              >
                <Search
                  size={15}
                  strokeWidth={1.8}
                  className="shrink-0 text-gray-400 group-hover:text-[#8e4440]"
                />

                <span className="flex-1">{s}</span>

                <ArrowUpRight
                  size={15}
                  className="
                    text-gray-300 opacity-0
                    transition-all duration-150
                    group-hover:translate-x-0.5
                    group-hover:-translate-y-0.5
                    group-hover:opacity-100
                  "
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {showSuggestions && query && filtered.length === 0 && (
        <div
          className="
            absolute left-0 right-0 top-full z-50 mt-2
            rounded-xl border border-gray-100
            bg-white p-5
            shadow-[0_12px_40px_rgba(0,0,0,0.10)]
          "
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <Search size={18} className="text-gray-400" />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-800">
                No suggestions found
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Press Enter to search for "{query}".
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSearch()}
            className="
              mt-4 w-full rounded-lg
              bg-[#8e4440] px-4 py-2.5
              text-sm font-medium text-white
              transition-colors hover:bg-[#713632]
            "
          >
            Search products
          </button>
        </div>
      )}
    </div>
  )
}
