import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface SlideItem {
  id: string
  title: string
  image: string
  fallbackImage: string
  targetUrl: string
}

export const SLIDES_DATA: SlideItem[] = [
  {
    id: 'papa-volt-battery',
    title: 'Papa Volt Battery',
    image: '/slides/slide_1_volt_battery.png',
    fallbackImage: 'https://minio.k8s.bdgyoo.com/papa-media/media/slideshow/cache/1920x485/wysiwyg/papahomepage/slider/Papa_Volt_battery.png',
    targetUrl: '/collections?category=all&q=Volt',
  },
  {
    id: 'papa-premium-cartridges',
    title: 'Papa Premium Tattoo Cartridges',
    image: '/slides/slide_2_premium_cartridges.png',
    fallbackImage: 'https://minio.k8s.bdgyoo.com/papa-media/media/slideshow/cache/1920x485/wysiwyg/papahomepage/slider/premium_cartridge_3.png',
    targetUrl: '/products/papa-premium-tattoo-cartridges',
  },
  {
    id: 'papa-pen-v3',
    title: 'Papa Pen V3 Rotary Machine',
    image: '/slides/slide_3_papa_pen_v3.jpg',
    fallbackImage: 'https://minio.k8s.bdgyoo.com/papa-media/media/slideshow/cache/1920x485/wysiwyg/papahomepage/slider/ppenflyer.jpg',
    targetUrl: '/collections?category=machines&q=Papa+Pen+V3',
  },
  {
    id: 'papa-pen-v2',
    title: 'Papa Pen V2 Precision Machine',
    image: '/slides/slide_4_papa_pen_v2.jpg',
    fallbackImage: 'https://minio.k8s.bdgyoo.com/papa-media/media/slideshow/cache/1920x485/wysiwyg/papahomepage/slider/papapenV2_1.jpg',
    targetUrl: '/collections?category=machines&q=Papa+Pen+V2',
  },
  {
    id: 'papa-disposable-pen-grip',
    title: 'Papa Disposable Pen Grip',
    image: '/slides/slide_5_disposable_grip.jpg',
    fallbackImage: 'https://minio.k8s.bdgyoo.com/papa-media/media/slideshow/cache/1920x485/wysiwyg/papahomepage/slider/papa_disposable_grip.jpg',
    targetUrl: '/collections?category=grips&q=disposable',
  },
  {
    id: 'papa-disposable-cartridge-grips',
    title: 'Papa Disposable Cartridge Grips',
    image: '/slides/slide_6_disposable_cartridge_grips.jpg',
    fallbackImage: 'https://minio.k8s.bdgyoo.com/papa-media/media/slideshow/cache/1920x485/wysiwyg/papahomepage/slider/pp.jpg',
    targetUrl: '/collections?category=grips&q=disposable',
  },
  {
    id: 'papa-pen-classic',
    title: 'Papa Pen Classic Jet Black',
    image: '/slides/slide_7_papa_pen.jpg',
    fallbackImage: 'https://minio.k8s.bdgyoo.com/papa-media/media/slideshow/cache/1920x485/wysiwyg/papahomepage/slider/papapen_3.jpg',
    targetUrl: '/collections?category=machines&q=Papa+Pen',
  },
]

export const HomeSlider: React.FC = () => {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const SLIDE_DURATION = 5000

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % SLIDES_DATA.length)
  }, [])

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + SLIDES_DATA.length) % SLIDES_DATA.length)
  }, [])

  // Auto-play interval with pause on mouse hover
  useEffect(() => {
    if (isHovered) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current)
      return
    }

    autoPlayTimerRef.current = setInterval(() => {
      handleNext()
    }, SLIDE_DURATION)

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current)
    }
  }, [isHovered, handleNext])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrev])

  // Mobile Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX - touchEndX
    if (diff > 50) {
      handleNext()
    } else if (diff < -50) {
      handlePrev()
    }
    setTouchStartX(null)
  }

  const currentSlide = SLIDES_DATA[currentIndex]

  const handleSlideClick = () => {
    const url = currentSlide.targetUrl
    if (url.startsWith('/products/')) {
      const handle = url.replace('/products/', '')
      navigate({ to: '/products/$handle', params: { handle } })
    } else if (url.startsWith('/collections')) {
      const parsed = new URL(url, 'http://localhost')
      const category = parsed.searchParams.get('category') || 'all'
      const q = parsed.searchParams.get('q') || undefined
      navigate({ to: '/collections', search: { category, q } })
    }
  }

  return (
    <section
      className="group/slider relative w-full overflow-hidden bg-[#0A0C0F] select-none border-b border-zinc-200/80 dark:border-[#222731]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Papa Tattoo Apparatus Slideshow"
    >
      {/* 1920x485 Pro-Engineered Banner Stage */}
      <div className="relative w-full aspect-[1920/485] min-h-[220px] sm:min-h-[280px] md:min-h-[360px] lg:min-h-[440px] xl:min-h-[485px] bg-[#0A0C0F]">
        {SLIDES_DATA.map((slide, idx) => {
          const isActive = idx === currentIndex
          return (
            <div
              key={slide.id}
              onClick={handleSlideClick}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out cursor-pointer ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Pure, Unobstructed 1920x485 Artwork Banner */}
              <img
                src={slide.image}
                alt={slide.title}
                onError={(e) => {
                  if (e.currentTarget.src !== slide.fallbackImage) {
                    e.currentTarget.src = slide.fallbackImage
                  }
                }}
                className="w-full h-full object-cover object-center"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </div>
          )
        })}

        {/* Navigation Arrow Left */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handlePrev()
          }}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/80 text-white/70 hover:text-[#2ee6ca] border border-white/10 hover:border-[#2ee6ca]/50 backdrop-blur-md flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xl opacity-80 group-hover/slider:opacity-100 active:scale-95"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform hover:-translate-x-0.5" />
        </button>

        {/* Navigation Arrow Right */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleNext()
          }}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/80 text-white/70 hover:text-[#2ee6ca] border border-white/10 hover:border-[#2ee6ca]/50 backdrop-blur-md flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xl opacity-80 group-hover/slider:opacity-100 active:scale-95"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform hover:translate-x-0.5" />
        </button>

        {/* Floating Minimalist Indicator Dots */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
          {SLIDES_DATA.map((slide, idx) => {
            const isActive = idx === currentIndex
            return (
              <button
                key={slide.id}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentIndex(idx)
                }}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isActive
                    ? 'w-6 h-2 bg-[#2ee6ca] shadow-[0_0_10px_#2ee6ca]'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
