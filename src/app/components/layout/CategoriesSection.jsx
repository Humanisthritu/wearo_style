'use client'

import Link from 'next/link'
import CheckroomOutlinedIcon from '@mui/icons-material/CheckroomOutlined'
import FemaleOutlinedIcon from '@mui/icons-material/FemaleOutlined'
import MaleOutlinedIcon from '@mui/icons-material/MaleOutlined'
import CheckroomIcon from '@mui/icons-material/Checkroom'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'

const CATEGORIES = [
  {
    icon: ShoppingBagOutlinedIcon,
    label: 'Bags',
    slug: 'womens-bags',
  },
  {
    icon: FemaleOutlinedIcon,
    label: 'Jewellery',
    slug: 'womens-jewellery',
  },
  {
    icon: CheckroomOutlinedIcon,
    label: "Women's Shoes",
    slug: 'womens-shoes',
  },
  {
    icon: MaleOutlinedIcon,
    label: "Men's Shirts",
    slug: 'mens-shirts',
  },
  {
    icon: CheckroomIcon,
    label: 'T-Shirts',
    slug: 'tops',
  },
  {
    icon: CheckroomOutlinedIcon,
    label: "Women's Dresses",
    slug: 'womens-dresses',
  },
]

export default function CategoriesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-6">
        Shop by Category
      </h2>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon

          return (
            <Link
              key={cat.label}
              href={`/shop?category=${cat.slug}`} // ✅ simple + reliable
              className="group flex flex-col items-center justify-center gap-2 bg-white border border-gray-200 rounded-lg py-4 hover:border-gray-300 transition"
            >
              <Icon className="text-gray-500 group-hover:text-gray-900 transition" />
              <span className="text-[12px] font-medium text-gray-700 text-center">
                {cat.label}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}