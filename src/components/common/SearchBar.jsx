'use client'
// src/components/common/SearchBar.jsx

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBar({ onSearch }) {
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

  function handleSearch(q = query) {
    if (!q.trim()) return

    router.push(`/shop?q=${encodeURIComponent(q)}`)
    setShowSuggestions(false)
    setQuery('')
    if (onSearch) onSearch()
  }

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        inputRef.current &&
        !inputRef.current.closest('.search-wrapper')?.contains(e.target)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="search-wrapper relative w-full">
      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50 focus-within:border-[#ff3f6c] focus-within:bg-white transition-all">
        <span className="pl-3 text-gray-400 text-sm">🔍</span>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowSuggestions(true)
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search for products, brands…"
          className="flex-1 py-2 px-2 text-sm bg-transparent outline-none"
        />

        {query && (
          <button
            onClick={() => {
              setQuery('')
              setShowSuggestions(false)
            }}
            className="pr-3 text-gray-400 hover:text-gray-700 text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && query && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
          {filtered.map((s) => (
            <button
              key={s}
              onClick={() => handleSearch(s)}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-700 flex items-center gap-2"
            >
              <span className="text-gray-400 text-xs">🔍</span>
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}