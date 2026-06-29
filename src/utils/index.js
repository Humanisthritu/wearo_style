
export function formatPrice(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount)
}

export function discountPercent(originalPrice, discountedPrice) {
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
}

export function getDiscountedPrice(price, discountPercentage) {
  return Math.round(price - (price * discountPercentage) / 100)
}

export function truncate(text, maxLength) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '…'
}

export function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function generateOrderId() {
  return 'DK' + Date.now().toString().slice(-8)
}


export function ratingStars(rating) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5 ? 1 : 0
  const empty = 5 - full - half
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty)
}


export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}