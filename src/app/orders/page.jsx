'use client'
// src/app/orders/page.js

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
import FilterListIcon from '@mui/icons-material/FilterList'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import ReplayIcon from '@mui/icons-material/Replay'



const STATUS_CONFIG = {
    delivered: { label: 'Delivered', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-100', icon: <CheckCircleOutlinedIcon fontSize="small" /> },
    shipped: { label: 'In Transit', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-100', icon: <LocalShippingOutlinedIcon fontSize="small" /> },
    processing: { label: 'Processing', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-100', icon: <AccessTimeOutlinedIcon fontSize="small" /> },
    cancelled: { label: 'Cancelled', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-100', icon: <CancelOutlinedIcon fontSize="small" /> },
    pending: { label: 'Pending', color: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-100', icon: <AccessTimeOutlinedIcon fontSize="small" /> },
}

const FILTER_TABS = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

export default function OrdersPage() {
    const isAuth = useAppSelector(selectIsAuthenticated)
    const [orders, setOrders] = useState([])
    const [activeFilter, setActiveFilter] = useState('All')
    const [searchQuery, setSearchQuery] = useState('')
    const [expandedId, setExpandedId] = useState(null)
    
    function normalizeStatus(status) {
        if (status === 'confirmed') return 'processing'
        return status
    }

    useEffect(() => {
        const stored = localStorage.getItem('dripkart_orders')
        if (!stored) return

        const ordersInfo = JSON.parse(stored)

        const transformed = ordersInfo.map((o) => ({
            id: o.id,
            date: o.date,
            status: normalizeStatus(o.status),

            items: o.items.map((item) => ({
                name: item.title,
                brand: item.brand,
                emoji: item.thumbnail,
                size: item.size || 'M',
                color: item.color || 'Default',
                qty: item.quantity || 1,
                price: item.priceAtPurchase || 0,
            })),

            total: o.pricing?.grandTotal || 0,

            address: `${o.address?.name}, ${o.address?.label}, ${o.address?.phone}`,

            payment: o.paymentMethod?.toUpperCase(),

            tracking: o.trackingId,

            estimatedDelivery: o.estimatedDelivery,
        }))

        setOrders(transformed)
    }, [])

    if (!isAuth) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-gray-500">
                <ReceiptLongOutlinedIcon style={{ fontSize: 48, color: '#e5e7eb' }} />
                <p className="font-medium text-gray-700">Please login to view your orders</p>
                <Link href="/login" className="px-5 py-2.5 bg-[#ff3f6c] text-white text-sm font-medium rounded-lg">Sign in</Link>
            </div>
        )
    }

    const filtered = orders.filter((o) => {
        const matchesFilter =
            activeFilter === 'All' ||
            o.status === activeFilter.toLowerCase()

        const matchesSearch =
            !searchQuery ||
            o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.items.some((i) =>
                i.name.toLowerCase().includes(searchQuery.toLowerCase())
            )

        return matchesFilter && matchesSearch
    })

    function fmt(n) {
        return '₹' + n.toLocaleString('en-IN')
    }

    function fmtDate(d) {
        return new Date(d).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        })
    }



    return (
        <div className="max-w-4xl mx-auto px-4 py-8">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">My Orders</h1>
                    <p className="text-xs text-gray-400 mt-0.5"> {orders.length} orders placed</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-4">
                <SearchOutlinedIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fontSize="small" />
                <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by order ID or product name…"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl text-sm text-gray-900 outline-none focus:border-[#ff3f6c] focus:bg-white transition-colors"
                />
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-6 pb-1">
                {FILTER_TABS.map((f) => (
                    <button key={f} onClick={() => setActiveFilter(f)}
                        className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium border transition-all
              ${activeFilter === f
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}>
                        {f}
                    </button>
                ))}
            </div>

            {/* Orders list */}
            {filtered.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <ReceiptLongOutlinedIcon style={{ fontSize: 44, color: '#e5e7eb' }} />
                    <p className="mt-3 font-medium text-gray-600">No orders found</p>
                    <Link href="/shop" className="mt-4 inline-block px-5 py-2.5 bg-[#ff3f6c] text-white text-sm font-medium rounded-lg">
                        Start shopping
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {filtered.map((order) => {
                        const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending
                        const expanded = expandedId === order.id

                        return (
                            <div key={order.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden">

                                {/* Order header */}
                                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                                    <div className="flex items-center gap-4 flex-wrap">
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Order ID</p>
                                            <p className="text-sm font-semibold text-gray-900 font-mono">#{order.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Placed on</p>
                                            <p className="text-sm text-gray-700">{fmtDate(order.date)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Total</p>
                                            <p className="text-sm font-semibold text-gray-900">{fmt(order.total)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {/* Status badge */}
                                        <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                                            {cfg.icon} {cfg.label}
                                        </span>
                                        {/* Expand toggle */}
                                        <button onClick={() => setExpandedId(expanded ? null : order.id)}
                                            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                            {expanded ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Items preview (always visible) */}
                                <div className="px-5 py-4 flex items-center gap-3">
                                    <div className="flex -space-x-2">
                                        {order.items.slice(0, 3).map((item, i) => (
                                            <div key={i} className="w-10 h-12 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center text-xl shadow-sm">
                                                <img src={item.emoji} alt={item.title}/>
                                            </div>
                                        ))}
                                        {order.items.length > 3 && (
                                            <div className="w-10 h-12 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-semibold text-gray-500 shadow-sm">
                                                +{order.items.length - 3}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">
                                            {order.items[0].name}
                                            {order.items.length > 1 && ` + ${order.items.length - 1} more`}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">via {order.payment}</p>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex gap-2 shrink-0">
                                        {order.status === 'delivered' && (
                                            <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:border-gray-400 transition-colors">
                                                <ReplayIcon style={{ fontSize: 14 }} /> Buy again
                                            </button>
                                        )}
                                        {order.status === 'shipped' && order.tracking && (
                                            <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-100 bg-blue-50 rounded-lg hover:border-blue-300 transition-colors">
                                                <LocalShippingOutlinedIcon style={{ fontSize: 14 }} /> Track
                                            </button>
                                        )}
                                        {order.status === 'processing' && (
                                            <button className="px-3 py-1.5 text-xs font-medium text-red-500 border border-red-100 bg-red-50 rounded-lg hover:border-red-300 transition-colors" >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Expanded details */}
                                {expanded && (
                                    <div className="border-t border-gray-100 px-5 py-4 bg-gray-50/50">

                                        {/* All items */}
                                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Items</h4>
                                        <div className="flex flex-col gap-3 mb-5">
                                            {order.items.map((item, i) => (
                                                <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100">
                                                    <div className="w-10 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xl shrink-0">
                                                        {item.emoji}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                                        <p className="text-xs text-gray-400">{item.brand} · Size: {item.size} · {item.color}</p>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <p className="text-sm font-semibold text-gray-900">{fmt(item.price)}</p>
                                                        <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Delivery + tracking */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Delivery address</h4>
                                                <p className="text-sm text-gray-700">{order.address}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tracking</h4>
                                                {order.tracking ? (
                                                    <p className="text-sm font-mono text-blue-600">{order.tracking}</p>
                                                ) : (
                                                    <p className="text-sm text-gray-400">Not available yet</p>
                                                )}
                                                {order.estimatedDelivery && (
                                                    <p className="text-xs text-green-600 mt-1">
                                                        Expected by {fmtDate(order.estimatedDelivery)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Summary */}
                                        <div className="mt-4 flex justify-between text-sm font-semibold text-gray-900 pt-4 border-t border-gray-100">
                                            <span>Order Total</span>
                                            <span>{fmt(order.total)}</span>
                                        </div>
                                    </div>
                                )}

                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}