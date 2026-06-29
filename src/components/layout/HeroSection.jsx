'use client'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation, Autoplay } from 'swiper/modules'
import Image from 'next/image'

export default function HeroSection() {
  return (
    <div className="homeSlider">
      <div className="container mx-auto px-2 sm:px-4">
        <Swiper
          navigation={true}
          modules={[Navigation, Autoplay]}
          className="mySwiper"
          // autoplay={{
          //   delay: 2500,
          //   disableOnInteraction: false,
          // }}
        >
          {[1, 2, 3].map((item, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full">
                <Image
                  src="/Banner1.png"
                  alt="home-slider"
                  width={1344}
                  height={514}
                  className="w-full h-auto object-cover rounded-md"
                  priority
                />

                {/* CTA Overlay */}
                <div className="absolute inset-0 flex items-end sm:items-end items-center justify-center sm:justify-start px-4 sm:px-10 pb-6 sm:pb-10">
                  <button className="bg-black text-white text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 rounded-md hover:bg-gray-800 transition">
                    {index === 0
                      ? 'Shop Now'
                      : index === 1
                      ? 'Explore'
                      : 'View Collection'}
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}