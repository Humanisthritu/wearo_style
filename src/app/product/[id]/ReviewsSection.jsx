'use client'
// src/app/product/[id]/ReviewsSection.js

import { useState } from 'react'
import { useToast } from '@/context/AppContext'

export default function ReviewsSection({ product }) {
  const { showToast } = useToast()
  const reviews       = product.reviews ?? generateMockReviews(product)

  // Rating breakdown counts
  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }))

  // New review form state
  const [form, setForm]       = useState({ rating: 0, comment: '', name: '' })
  const [hoveredStar, setHover] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.rating)  { showToast('Please select a star rating', 'error'); return }
    if (!form.comment) { showToast('Please write a comment', 'error'); return }
    if (!form.name)    { showToast('Please enter your name', 'error'); return }
    setSubmitted(true)
    showToast('Review submitted! Thanks 🎉')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

      {/* ── Left: rating summary ── */}
      <div className="lg:col-span-1">
        <div className="rounded-2xl bg-gray-50 p-6 text-center">
          {/* Big rating number */}
          <div className="text-6xl font-bold text-gray-900 leading-none">
            {product.rating.toFixed(1)}
          </div>
          <div className="flex justify-center gap-0.5 mt-2 mb-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                className={`text-xl ${s <= Math.round(product.rating) ? 'text-amber-400' : 'text-gray-200'}`}
              >
                ★
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-500 mb-5">
            Based on {reviews.length} reviews
          </p>

          {/* Bar breakdown */}
          <div className="space-y-2">
            {breakdown.map(({ star, count }) => {
              const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0
              return (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="w-3 text-gray-500 text-right shrink-0">{star}</span>
                  <span className="text-amber-400 shrink-0">★</span>
                  <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-xs text-gray-500 shrink-0">{pct}%</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Write a review ── */}
        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-5">
          <h4 className="font-semibold text-gray-900 mb-4">Write a Review</h4>

          {submitted ? (
            <div className="text-center py-4 text-sm text-green-700 font-medium">
              ✅ Thank you for your review!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {/* Star picker */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                  Your Rating *
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, rating: s }))}
                      onMouseEnter={() => setHover(s)}
                      onMouseLeave={() => setHover(0)}
                      className={`text-2xl transition-transform hover:scale-110 ${
                        s <= (hoveredStar || form.rating)
                          ? 'text-amber-400'
                          : 'text-gray-200'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Your Name *
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Rahul S."
                  className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#ff3f6c] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Your Review *
                </label>
                <textarea
                  value={form.comment}
                  onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                  placeholder="How was the fit, quality, and delivery?"
                  rows={3}
                  className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#ff3f6c] transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#ff3f6c] py-2.5 text-sm font-bold text-white hover:bg-[#e03560] transition-colors"
              >
                Submit Review
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── Right: individual reviews ── */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        {reviews.map((review, i) => (
          <ReviewCard key={i} review={review} />
        ))}
      </div>

    </div>
  )
}

function ReviewCard({ review }) {
  const stars      = Math.round(review.rating)
  const timeAgo    = review.date ? formatTimeAgo(review.date) : '2 days ago'
  const [helpful, setHelpful] = useState(false)

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ff3f6c] to-rose-400 flex items-center justify-center text-white text-sm font-bold shrink-0">
            {review.reviewerName?.charAt(0).toUpperCase() ?? '?'}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-none">
              {review.reviewerName ?? 'Anonymous'}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Verified Purchase ✓</p>
          </div>
        </div>
        <span className="text-xs text-gray-400">{timeAgo}</span>
      </div>

      {/* Stars */}
      <div className="flex gap-0.5 mt-3 mb-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <span
            key={s}
            className={`text-sm ${s <= stars ? 'text-amber-400' : 'text-gray-200'}`}
          >
            ★
          </span>
        ))}
      </div>

      {/* Comment */}
      <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>

      {/* Helpful row */}
      <div className="mt-3 flex items-center gap-3">
        <span className="text-xs text-gray-400">Was this helpful?</span>
        <button
          onClick={() => setHelpful(true)}
          className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${
            helpful
              ? 'border-green-500 text-green-600 bg-green-50'
              : 'border-gray-200 text-gray-500 hover:border-gray-400'
          }`}
        >
          👍 Yes {helpful ? '(1)' : ''}
        </button>
        <button className="text-xs font-semibold px-2.5 py-1 rounded-full border border-gray-200 text-gray-500 hover:border-gray-400 transition-all">
          👎 No
        </button>
      </div>
    </div>
  )
}

// ── helpers ──────────────────────────────────────────────────────────────────

function formatTimeAgo(isoDate) {
  const diff = Date.now() - new Date(isoDate).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 30)  return `${days} days ago`
  const months = Math.floor(days / 30)
  return months === 1 ? '1 month ago' : `${months} months ago`
}

/** Generate deterministic mock reviews when the API returns none */
function generateMockReviews(product) {
  const names    = ['Priya S.', 'Rahul K.', 'Anita M.', 'Deepak J.', 'Sneha R.', 'Amit T.']
  const comments = [
    'Great quality! Exactly as described. Very happy with the purchase.',
    'Fits perfectly. The material is really comfortable for everyday wear.',
    'Fast delivery and nice packaging. Product matches the photos.',
    'Good value for money. Would definitely recommend to friends.',
    'Absolutely love it! The colour is even better in person.',
    'Decent quality. Sizing runs a bit small, order one size up.',
  ]
  return Array.from({ length: 6 }, (_, i) => ({
    reviewerName: names[i],
    rating:       4 + (i % 2 === 0 ? 1 : 0),
    comment:      comments[i],
    date:         new Date(Date.now() - i * 4 * 86400000).toISOString(),
  }))
}