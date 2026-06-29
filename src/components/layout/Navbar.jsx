'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAppSelector } from '@/hooks/redux'

import { selectCartCount } from '@/redux/slices/cartSlice'
import { selectWishlistCount } from '@/redux/slices/wishlistSlice'
import { selectIsAuthenticated, selectUser } from '@/redux/slices/authSlice'

import { getInitials } from '@/utils'
import SearchBar from '@/components/common/SearchBar'

// MUI Icons
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import SearchIcon from '@mui/icons-material/Search'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import { useRouter } from 'next/navigation'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/collections' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const cartCount = useAppSelector(selectCartCount)
  const wishlistCount = useAppSelector(selectWishlistCount)
  const isAuth = useAppSelector(selectIsAuthenticated)
  const user = useAppSelector(selectUser)

  const router = useRouter()


  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">

      {/* Top Offer Bar */}
      <div className="bg-[#d90429] text-white text-center py-2 text-xs font-semibold">
        🚀 Free shipping on orders above ₹999 | Use code <span className="underline">DRIP20</span>
      </div>

      {/* Navbar */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-xl font-bold"   onClick={() => router.refresh()}>
          Drip<span className="text-[#f4d35e]">Kart</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
          {NAV_LINKS.map(link => (
            <Link key={link.href} href={link.href} className="hover:text-black transition">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search (Desktop) */}
        <div className="hidden md:block w-64">
          <SearchBar />
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-3">

          {/* Mobile Search */}
          <button className="md:hidden" onClick={() => setSearchOpen(!searchOpen)}>
            <SearchIcon />
          </button>

          {/* Wishlist */}
          <Link href="/wishlist" className="relative">
            <FavoriteBorderIcon />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative">
            <ShoppingBagOutlinedIcon />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User */}
          {isAuth && user ? (
            <Link
              href="/profile"
              className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold"
            >
              {getInitials(`${user.firstName} ${user.lastName}`)}
            </Link>
          ) : (
            <Link href="/login" className="hidden md:block text-sm">
              Login
            </Link>
          )}

          {/* Mobile Menu */}
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      {searchOpen && (
        <div className="md:hidden border-t px-4 py-3">
          <SearchBar onSearch={() => setSearchOpen(false)} />
        </div>
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-5 py-3 text-sm border-b hover:bg-gray-50"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}