'use client'
// src/components/layout/Navbar.js

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { selectUser, selectIsAuthenticated, logout } from '@/redux/slices/authSlice'
import { selectCartCount } from '@/redux/slices/cartSlice'
import { selectWishlistCount } from '@/redux/slices/wishlistSlice'
import { clearSession } from '@/utils/auth'
import { useToast } from '@/context/AppContext'
import SearchBar from '@/components/common/SearchBar'

// MUI icons
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import LogoutIcon from '@mui/icons-material/Logout'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import FavoriteIcon from '@mui/icons-material/Favorite'
import PersonIcon from '@mui/icons-material/Person'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'

const NAV_LINKS = [
  { label: 'Men',    href: '/shop?category=mens-shirts' },
  { label: 'Women',  href: '/shop?category=womens-dresses' },
  { label: 'Kids',   href: '/shop?category=tops' },
  { label: '🔥 Sale', href: '/shop?tag=sale' },
]

export default function Navbar() {
  const dispatch      = useAppDispatch()
  const router        = useRouter()
  const { showToast } = useToast()

  const user          = useAppSelector(selectUser)
  const isAuth        = useAppSelector(selectIsAuthenticated)
  const cartCount     = useAppSelector(selectCartCount)
  const wishlistCount = useAppSelector(selectWishlistCount)

  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // ── Logout handler ──────────────────────────────────────────────────────────
  function handleLogout() {
    setDropdownOpen(false)
    clearSession()                    // clear localStorage + cookie
    dispatch(logout())                // clear Redux state
    showToast('Logged out successfully 👋')
    router.push('/login')             // send back to login page
  }

  // ── Avatar initials ─────────────────────────────────────────────────────────
  function getInitials() {
    if (!user) return '?'
    return `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
  }

  return (
    <>
      {/* Announcement strip */}
      <div className="bg-[#ff3f6c] text-white text-center py-1.5 text-xs font-medium tracking-wide">
        🚀 Free shipping above ₹999 &nbsp;·&nbsp; Use <span className="underline font-semibold">DRIP20</span> for 20% off
      </div>

      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">

          {/* Logo */}
          <Link href="/" className="text-xl font-bold shrink-0 tracking-tight">
            Drip<span className="text-[#ff3f6c]">Kart</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6 ml-2">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}
                className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Search */}
          <div className="hidden md:block flex-1 max-w-xs">
            <SearchBar />
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-1 ml-auto">

            {/* Wishlist */}
            <Link href="/wishlist"
              className="relative w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all">
              <FavoriteBorderIcon fontSize="small" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#ff3f6c] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart"
              className="relative w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all">
              <ShoppingBagOutlinedIcon fontSize="small" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#ff3f6c] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* User avatar / login */}
            {isAuth && user ? (
              <div className="relative" ref={dropdownRef}>
                {/* Avatar button */}
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-gray-50 transition-all"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.firstName}
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-gray-100"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#ff3f6c] text-white text-xs font-bold flex items-center justify-center">
                      {getInitials()}
                    </div>
                  )}
                  <span className="hidden md:block text-sm font-medium text-gray-700 max-w-[80px] truncate">
                    {user.firstName}
                  </span>
                  <svg className={`w-3 h-3 text-gray-400 transition-transform hidden md:block ${dropdownOpen ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden z-50">

                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-sm font-semibold text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <DropdownItem
                        icon={<PersonIcon fontSize="small" />}
                        label="My Profile"
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                      />
                      <DropdownItem
                        icon={<ReceiptLongOutlinedIcon fontSize="small" />}
                        label="My Orders"
                        href="/orders"
                        onClick={() => setDropdownOpen(false)}
                      />
                      <DropdownItem
                        icon={<FavoriteIcon fontSize="small" />}
                        label="Wishlist"
                        href="/wishlist"
                        onClick={() => setDropdownOpen(false)}
                        badge={wishlistCount}
                      />
                      <DropdownItem
                        icon={<ShoppingCartOutlinedIcon fontSize="small" />}
                        label="Cart"
                        href="/cart"
                        onClick={() => setDropdownOpen(false)}
                        badge={cartCount}
                      />
                      <DropdownItem
                        icon={<LocalOfferOutlinedIcon fontSize="small" />}
                        label="Coupons & Offers"
                        href="/coupons"
                        onClick={() => setDropdownOpen(false)}
                      />
                      <DropdownItem
                        icon={<LocationOnOutlinedIcon fontSize="small" />}
                        label="Saved Addresses"
                        href="/profile/addresses"
                        onClick={() => setDropdownOpen(false)}
                      />
                      <DropdownItem
                        icon={<SettingsOutlinedIcon fontSize="small" />}
                        label="Settings"
                        href="/profile/settings"
                        onClick={() => setDropdownOpen(false)}
                      />
                    </div>

                    {/* Logout — separated with border */}
                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <span className="text-red-400">
                          <LogoutIcon fontSize="small" />
                        </span>
                        <span className="font-medium">Log out</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            ) : (
              /* Not logged in — show Login button */
              <Link href="/login"
                className="ml-1 px-4 py-2 bg-[#ff3f6c] text-white text-xs font-semibold rounded-lg hover:bg-[#e03560] transition-colors">
                Login
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all ml-1"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <CloseIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            {/* Mobile search */}
            <div className="px-4 py-3 border-b border-gray-50">
              <SearchBar onSearch={() => setMobileOpen(false)} />
            </div>

            {/* Nav links */}
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 border-b border-gray-50">
                {link.label}
              </Link>
            ))}

            {/* Mobile user section */}
            {isAuth && user ? (
              <>
                <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100 bg-gray-50">
                  {user.image ? (
                    <img src={user.image} alt={user.firstName}
                      className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#ff3f6c] text-white text-sm font-bold flex items-center justify-center">
                      {getInitials()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
                {[
                  { label: 'My Profile',  href: '/profile' },
                  { label: 'My Orders',   href: '/orders' },
                  { label: 'Wishlist',    href: '/wishlist' },
                  { label: 'Cart',        href: '/cart' },
                  { label: 'Settings',    href: '/profile/settings' },
                ].map((item) => (
                  <Link key={item.href} href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-50">
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 font-medium">
                  <LogoutIcon fontSize="small" /> Log out
                </button>
              </>
            ) : (
              <div className="px-4 py-3 flex gap-2">
                <Link href="/login" onClick={() => setMobileOpen(false)}
                  className="flex-1 py-2.5 bg-[#ff3f6c] text-white text-sm font-semibold rounded-lg text-center hover:bg-[#e03560] transition-colors">
                  Sign in
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg text-center hover:border-gray-400 transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  )
}

// ── Dropdown menu item ────────────────────────────────────────────────────────

function DropdownItem({ icon, label, href, onClick, badge }) {
  return (
    <Link href={href} onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
      <span className="text-gray-400">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge > 0 && (
        <span className="w-5 h-5 bg-[#ff3f6c] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </Link>
  )
}