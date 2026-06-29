'use client'
// src/app/product/[id]/ImageGallery.js

import { useState } from 'react'

export default function ImageGallery({ images, thumbnail, title }) {
  console.log(images, "images---------")
  // Merge thumbnail + gallery, deduplicate
  const allImages = [
    thumbnail,
    ...images.filter((img) => img !== thumbnail),
  ].slice(0, 6)

  const [activeIndex, setActiveIndex] = useState(0)
  const [zoomed, setZoomed]           = useState(false)
  const [zoomPos, setZoomPos]         = useState({ x: 50, y: 50 })

  function handlePrev() {
    setActiveIndex((i) => (i === 0 ? allImages.length - 1 : i - 1))
  }

  function handleNext() {
    setActiveIndex((i) => (i === allImages.length - 1 ? 0 : i + 1))
  }

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top)  / rect.height) * 100
    setZoomPos({ x, y })
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 sticky top-20 h-fit">

      {/* Thumbnails column */}
      <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto hide-scrollbar md:max-h-[540px] pb-1">
        {allImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`
              relative shrink-0 w-16 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200
              ${activeIndex === i
                ? 'border-gray-900 shadow-md scale-105'
                : 'border-transparent opacity-60 hover:opacity-100 hover:border-gray-300'}
            `}
          >
            <img
              src={img}
              alt={`${title} view ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="relative flex-1 overflow-hidden rounded-3xl bg-gray-100 aspect-[4/5] cursor-zoom-in select-none">
        <img
          src={allImages[activeIndex]}
          alt={title}
          className={`
            w-full h-full object-cover transition-transform duration-500
            ${zoomed ? 'scale-150' : 'scale-100'}
          `}
          style={
            zoomed
              ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
              : {}
          }
          onMouseEnter={() => setZoomed(true)}
          onMouseLeave={() => { setZoomed(false); setZoomPos({ x: 50, y: 50 }) }}
          onMouseMove={handleMouseMove}
        />

        {/* Zoom hint */}
        {!zoomed && (
          <div className="absolute bottom-3 right-3 rounded-full bg-black/40 backdrop-blur-sm px-2.5 py-1 text-[10px] text-white font-medium pointer-events-none">
            🔍 Hover to zoom
          </div>
        )}

        {/* Prev / Next arrows */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md shadow-md flex items-center justify-center text-gray-800 hover:bg-white transition-all"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md shadow-md flex items-center justify-center text-gray-800 hover:bg-white transition-all"
              aria-label="Next image"
            >
              ›
            </button>
          </>
        )}

        {/* Dot indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {allImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`rounded-full transition-all duration-200 ${
                activeIndex === i
                  ? 'w-5 h-1.5 bg-white'
                  : 'w-1.5 h-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}