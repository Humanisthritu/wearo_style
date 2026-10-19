
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAppSelector } from '@/hooks/redux'
import { selectIsAuthenticated } from '@/redux/slices/authSlice'

import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import ReplayIcon from '@mui/icons-material/Replay'

const STATUS_CONFIG = {
    delivered: {
        label: 'Delivered',
        color: 'text-green-700',
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: <CheckCircleOutlinedIcon fontSize="small" />,
    },
    shipped: {
        label: 'In Transit',
        color: 'text-blue-700',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: <LocalShippingOutlinedIcon fontSize="small" />,
    },
    processing: {
        label: 'Processing',
        color: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        icon: <AccessTimeOutlinedIcon fontSize="small" />,
    },
    cancelled: {
        label: 'Cancelled',
        color: 'text-red-700',
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: <CancelOutlinedIcon fontSize="small" />,
    },
    pending: {
        label: 'Pending',
        color: 'text-gray-700',
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        icon: <AccessTimeOutlinedIcon fontSize="small" />,
    },
}

const FILTER_TABS = [
    'All',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
]

const BRAND_COLOR = '#8e4440'

function normalizeStatus(status) {
    const normalized = String(status || 'pending').toLowerCase()

    if (normalized === 'confirmed') return 'processing'

    return normalized
}

function formatPrice(amount) {
    const value = Number(amount) || 0

    return '₹' + value.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
    })
}

function formatDate(date) {
    if (!date) return '—'

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) return '—'

    return parsedDate.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

function getAddress(address) {
    if (!address) return 'Address not available'

    return [
        address.name,
        address.label,
        address.phone,
    ].filter(Boolean).join(', ') || 'Address not available'
}

function transformOrder(order) {
    return {
        id: String(order.id ?? ''),
        date: order.date,
        status: normalizeStatus(order.status),

        items: (Array.isArray(order.items) ? order.items : []).map(
            (item) => ({
                name: item.title || 'Product',
                brand: item.brand || 'DripKart',
                image: item.thumbnail || '',
                size: item.size || 'M',
                color: item.color || 'Default',
                qty: Number(item.quantity) || 1,
                price: Number(item.priceAtPurchase) || 0,
            })
        ),

        total: Number(order.pricing?.grandTotal) || 0,
        address: getAddress(order.address),
        payment: String(order.paymentMethod || 'N/A').toUpperCase(),
        tracking: order.trackingId || '',
        estimatedDelivery: order.estimatedDelivery || '',
    }
}

export default function OrdersPage() {
    const isAuth = useAppSelector(selectIsAuthenticated)

    const [orders, setOrders] = useState([])
    const [activeFilter, setActiveFilter] = useState('All')
    const [searchQuery, setSearchQuery] = useState('')
    const [expandedId, setExpandedId] = useState(null)
    const [loadError, setLoadError] = useState(false)

    useEffect(() => {
        try {
            const stored = localStorage.getItem('dripkart_orders')

            if (!stored) {
                setOrders([])
                return
            }

            const ordersInfo = JSON.parse(stored)

            if (!Array.isArray(ordersInfo)) {
                setOrders([])
                setLoadError(true)
                return
            }

            setOrders(ordersInfo.map(transformOrder))
            setLoadError(false)
        } catch (error) {
            console.error('Failed to load orders:', error)
            setOrders([])
            setLoadError(true)
        }
    }, [])

    const query = searchQuery.trim().toLowerCase()

    const filteredOrders = orders.filter((order) => {
        const matchesFilter =
            activeFilter === 'All' ||
            order.status === activeFilter.toLowerCase()

        const matchesSearch =
            !query ||
            order.id.toLowerCase().includes(query) ||
            order.items.some((item) =>
                item.name.toLowerCase().includes(query)
            )

        return matchesFilter && matchesSearch
    })

    if (!isAuth) {
        return (
            <main className="flex min-h-[60vh] items-center justify-center bg-[#faf8f6] px-4 py-12">
                <div className="flex w-full max-w-md flex-col items-center rounded-2xl border border-gray-100 bg-white px-6 py-12 text-center shadow-sm">
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f8eeee]">
                        <ReceiptLongOutlinedIcon
                            sx={{ fontSize: 32, color: BRAND_COLOR }}
                        />
                    </div>

                    <h1 className="text-xl font-bold text-gray-900">
                        Your orders await
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        Please sign in to view your orders and track your deliveries.
                    </p>

                    <Link
                        href="/login"
                        className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#8e4440] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#743733] focus:outline-none focus:ring-2 focus:ring-[#8e4440]/40 focus:ring-offset-2"
                    >
                        Sign in
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-[#faf8f6] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            <div className="mx-auto max-w-5xl">

                {/* Page header */}
                <header className="mb-7 border-b border-gray-200 pb-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8e4440]">
                                Your account
                            </p>

                            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                                My Orders
                            </h1>

                            <p className="mt-2 text-sm text-gray-500">
                                Track your purchases and manage your orders.
                            </p>
                        </div>

                        <div className="flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3">
                            <ReceiptLongOutlinedIcon
                                sx={{ fontSize: 20, color: BRAND_COLOR }}
                            />

                            <span className="text-sm font-semibold text-gray-800">
                                {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Search */}

                <div className="mb-6">
                    <label
                        htmlFor="order-search"
                        className="mb-2 block text-sm font-semibold text-gray-800"
                    >
                        Search your orders
                    </label>

                    <div className="relative">
                        <SearchOutlinedIcon
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            fontSize="small"
                        />

                        <input
                            id="order-search"
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Enter order ID or product name..."
                            className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-12 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-[#8e4440] focus:ring-4 focus:ring-[#8e4440]/10"
                        />

                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                aria-label="Clear search"
                                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                            >
                                ×
                            </button>
                        )}
                    </div>

                    <p className="mt-2 text-xs text-gray-500">
                        {searchQuery.trim()
                            ? `${filteredOrders.length} matching orders`
                            : `${orders.length} total orders`}
                    </p>
                </div>


                {/* Status filters */}
                <section className="mb-6">
                    <div className="mb-3 flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-800">
                            Filter orders
                        </span>

                        <span className="text-xs text-gray-400">
                            ({filteredOrders.length} found)
                        </span>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {FILTER_TABS.map((filter) => {
                            const active = activeFilter === filter

                            return (
                                <button
                                    key={filter}
                                    type="button"
                                    onClick={() => setActiveFilter(filter)}
                                    aria-pressed={active}
                                    className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-semibold transition-all duration-200 sm:text-sm ${active
                                            ? 'border-[#8e4440] bg-[#8e4440] text-white shadow-sm'
                                            : 'border-gray-200 bg-white text-gray-600 hover:border-[#8e4440] hover:text-[#8e4440]'
                                        }`}
                                >
                                    {filter}
                                </button>
                            )
                        })}
                    </div>
                </section>

                {/* Error state */}
                {loadError && (
                    <div
                        role="alert"
                        className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    >
                        We couldn't load your orders. Please refresh the page and try again.
                    </div>
                )}

                {/* Empty state */}
                {!loadError && filteredOrders.length === 0 && (
                    <section className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-14 text-center sm:py-20">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f8eeee]">
                            <ReceiptLongOutlinedIcon
                                sx={{ fontSize: 32, color: BRAND_COLOR }}
                            />
                        </div>

                        <h2 className="mt-5 text-lg font-bold text-gray-900">
                            {orders.length === 0
                                ? 'No orders yet'
                                : 'No orders found'}
                        </h2>

                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                            {orders.length === 0
                                ? 'Your purchases will appear here once you place your first order.'
                                : 'Try another search term or select a different status filter.'}
                        </p>

                        {orders.length === 0 ? (
                            <Link
                                href="/shop"
                                className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#8e4440] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#743733]"
                            >
                                Start shopping
                            </Link>
                        ) : (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery('')
                                    setActiveFilter('All')
                                }}
                                className="mt-5 rounded-lg px-4 py-2 text-sm font-semibold text-[#8e4440] transition hover:bg-[#f8eeee]"
                            >
                                Clear filters
                            </button>
                        )}
                    </section>
                )}

                {/* Orders list */}
                <section className="flex flex-col gap-5">
                    {filteredOrders.map((order) => {
                        const config =
                            STATUS_CONFIG[order.status] || STATUS_CONFIG.pending

                        const expanded = expandedId === order.id

                        return (
                            <article
                                key={order.id}
                                className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
                            >
                                {/* Order summary header */}
                                <div className="border-b border-gray-100 px-4 py-5 sm:px-6">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="grid grid-cols-2 gap-x-5 gap-y-4 sm:flex sm:flex-wrap sm:items-center sm:gap-7">
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                                                    Order ID
                                                </p>

                                                <p className="mt-1 break-all font-mono text-sm font-bold text-gray-900">
                                                    #{order.id || 'N/A'}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                                                    Order date
                                                </p>

                                                <p className="mt-1 text-sm font-medium text-gray-700">
                                                    {formatDate(order.date)}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                                                    Order total
                                                </p>

                                                <p className="mt-1 text-sm font-bold text-gray-900">
                                                    {formatPrice(order.total)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-3 sm:justify-end">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${config.color} ${config.bg} ${config.border}`}
                                            >
                                                {config.icon}
                                                {config.label}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setExpandedId(
                                                        expanded ? null : order.id
                                                    )
                                                }
                                                aria-expanded={expanded}
                                                aria-label={
                                                    expanded
                                                        ? 'Hide order details'
                                                        : 'Show order details'
                                                }
                                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8e4440]/30"
                                            >
                                                {expanded ? (
                                                    <KeyboardArrowUpIcon />
                                                ) : (
                                                    <KeyboardArrowDownIcon />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Product preview */}
                                <div className="px-4 py-5 sm:px-6">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                        <div className="flex shrink-0 items-center pl-1">
                                            {order.items.slice(0, 3).map((item, index) => (
                                                <div
                                                    key={`${order.id}-${index}`}
                                                    className={`relative -ml-1 flex h-16 w-12 items-center justify-center overflow-hidden rounded-lg border-2 border-white bg-gray-100 shadow-sm ${index > 0 ? '-ml-3' : ''
                                                        }`}
                                                    style={{ zIndex: 3 - index }}
                                                >
                                                    {item.image ? (
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            loading="lazy"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <ReceiptLongOutlinedIcon
                                                            sx={{
                                                                fontSize: 20,
                                                                color: '#9ca3af',
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            ))}

                                            {order.items.length > 3 && (
                                                <div className="-ml-3 flex h-16 w-12 shrink-0 items-center justify-center rounded-lg border-2 border-white bg-gray-100 text-xs font-bold text-gray-600 shadow-sm">
                                                    +{order.items.length - 3}
                                                </div>
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="break-words text-sm font-semibold leading-6 text-gray-900">
                                                {order.items.length > 0
                                                    ? order.items[0].name
                                                    : 'Order items'}
                                                {order.items.length > 1 &&
                                                    ` + ${order.items.length - 1} more`}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                                Payment method: {order.payment}
                                            </p>

                                            {order.estimatedDelivery &&
                                                order.status !== 'delivered' &&
                                                order.status !== 'cancelled' && (
                                                    <p className="mt-1 text-xs font-medium text-green-700">
                                                        Expected by {formatDate(order.estimatedDelivery)}
                                                    </p>
                                                )}
                                        </div>

                                        {/* Order actions */}
                                        <div className="flex flex-wrap gap-2 sm:shrink-0">
                                            {order.status === 'delivered' && (
                                                <Link
                                                    href="/shop"
                                                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3.5 py-2.5 text-xs font-semibold text-gray-700 transition hover:border-[#8e4440] hover:bg-[#fdf7f6] hover:text-[#8e4440]"
                                                >
                                                    <ReplayIcon sx={{ fontSize: 16 }} />
                                                    Buy again
                                                </Link>
                                            )}

                                            {order.status === 'shipped' && order.tracking && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setExpandedId(
                                                            expanded ? null : order.id
                                                        )
                                                    }
                                                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3.5 py-2.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                                                >
                                                    <LocalShippingOutlinedIcon
                                                        sx={{ fontSize: 16 }}
                                                    />
                                                    Track order
                                                </button>
                                            )}

                                            {order.status === 'processing' && (
                                                <span className="inline-flex items-center rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs font-semibold text-amber-700">
                                                    Being processed
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Expandable details */}
                                {expanded && (
                                    <div className="border-t border-gray-100 bg-[#faf9f8] px-4 py-5 sm:px-6 sm:py-6">
                                        {/* Items */}
                                        <div className="mb-6">
                                            <div className="mb-4 flex items-center justify-between">
                                                <h2 className="text-sm font-bold text-gray-900">
                                                    Order items
                                                </h2>

                                                <span className="text-xs text-gray-500">
                                                    {order.items.length}{' '}
                                                    {order.items.length === 1
                                                        ? 'item'
                                                        : 'items'}
                                                </span>
                                            </div>

                                            <div className="flex flex-col gap-3">
                                                {order.items.map((item, index) => (
                                                    <div
                                                        key={`${order.id}-item-${index}`}
                                                        className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 sm:gap-4 sm:p-4"
                                                    >
                                                        <div className="flex h-16 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                                                            {item.image ? (
                                                                <img
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    loading="lazy"
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <ReceiptLongOutlinedIcon
                                                                    sx={{
                                                                        fontSize: 22,
                                                                        color: '#9ca3af',
                                                                    }}
                                                                />
                                                            )}
                                                        </div>

                                                        <div className="min-w-0 flex-1">
                                                            <p className="break-words text-sm font-semibold leading-5 text-gray-900">
                                                                {item.name}
                                                            </p>

                                                            <p className="mt-1 text-xs text-gray-500">
                                                                {item.brand}
                                                            </p>

                                                            <p className="mt-1 text-xs text-gray-500">
                                                                Size: {item.size} · Color: {item.color}
                                                            </p>

                                                            <p className="mt-1 text-xs text-gray-500">
                                                                Qty: {item.qty}
                                                            </p>
                                                        </div>

                                                        <div className="shrink-0 text-right">
                                                            <p className="text-sm font-bold text-gray-900">
                                                                {formatPrice(item.price)}
                                                            </p>

                                                            <p className="mt-1 text-xs text-gray-400">
                                                                Each
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Address and tracking */}
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div className="rounded-xl border border-gray-100 bg-white p-4 sm:p-5">
                                                <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
                                                    Delivery address
                                                </h3>

                                                <p className="break-words text-sm leading-6 text-gray-700">
                                                    {order.address}
                                                </p>
                                            </div>

                                            <div className="rounded-xl border border-gray-100 bg-white p-4 sm:p-5">
                                                <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
                                                    Delivery and tracking
                                                </h3>

                                                {order.tracking ? (
                                                    <p className="break-all font-mono text-sm text-blue-700">
                                                        {order.tracking}
                                                    </p>
                                                ) : (
                                                    <p className="text-sm text-gray-400">
                                                        Tracking information is not available yet.
                                                    </p>
                                                )}

                                                {order.estimatedDelivery && (
                                                    <p className="mt-3 flex items-center gap-2 text-xs font-medium text-green-700">
                                                        <LocalShippingOutlinedIcon
                                                            sx={{ fontSize: 16 }}
                                                        />
                                                        Expected by {formatDate(order.estimatedDelivery)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Payment and total */}
                                        <div className="mt-4 rounded-xl border border-gray-100 bg-white p-4 sm:p-5">
                                            <div className="flex items-center justify-between gap-4 text-sm">
                                                <span className="text-gray-500">
                                                    Payment method
                                                </span>

                                                <span className="text-right font-medium text-gray-800">
                                                    {order.payment}
                                                </span>
                                            </div>

                                            <div className="mt-4 flex items-center justify-between gap-4 border-t border-gray-100 pt-4">
                                                <span className="text-sm font-semibold text-gray-900">
                                                    Order total
                                                </span>

                                                <span className="text-lg font-bold text-[#8e4440]">
                                                    {formatPrice(order.total)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </article>
                        )
                    })}
                </section>

                {/* Continue shopping */}
                {orders.length > 0 && (
                    <div className="mt-8 flex justify-center pb-4">
                        <Link
                            href="/shop"
                            className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#8e4440] hover:text-[#8e4440]"
                        >
                            Continue shopping
                        </Link>
                    </div>
                )}
            </div>
        </main>
    )
}
