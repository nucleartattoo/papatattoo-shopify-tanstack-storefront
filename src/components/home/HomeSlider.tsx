import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from '@tanstack/react-router'
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Pause,
  Play,
} from 'lucide-react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

export interface SlideItem {
  id: string
  shortLabel: string
  title: string
  specSummary: string
  ctaLabel: string
  image: string
  fallbackImage: string
  productHandle: string
}

const SLIDES_DATA: SlideItem[] = [
  {
    id: 'papa-volt-battery',
    shortLabel: 'Volt Battery',
    title: 'Papa Volt Wireless Battery Pack',
    specSummary: '5V-12V Regulated Output · Universal RCA Fitment',
    ctaLabel: 'Explore Papa Volt',
    image: '/slides/slide_1_volt_battery.webp',
    fallbackImage: '/slides/slide_1_volt_battery.png',
    productHandle: 'papa-volt-battery',
  },
  {
    id: 'papa-premium-cartridges',
    shortLabel: '316L Cartridges',
    title: 'Papa Premium Tattoo Cartridges: Buy 5 Get 1 Free',
    specSummary: '62 Needle Configurations · Japanese 316L Surgical Steel',
    ctaLabel: 'Shop 62 Sizes',
    image: '/slides/slide_2_premium_cartridges.webp',
    fallbackImage: '/slides/slide_2_premium_cartridges.png',
    productHandle: 'papa-premium-tattoo-cartridges',
  },
  {
    id: 'papa-pen-v3',
    shortLabel: 'Papa Pen V3',
    title: 'Papa Pen V3 Studio Bundle with 5 Cartridge Boxes',
    specSummary: 'Flagship Rotary Machine · Complimentary Sterile Needles',
    ctaLabel: 'Explore Pen V3',
    image: '/slides/slide_3_papa_pen_v3.jpg',
    fallbackImage: '/slides/slide_3_papa_pen_v3.jpg',
    productHandle: 'papa-pen-v3-black-full-set',
  },
  {
    id: 'papa-pen-v2',
    shortLabel: 'Papa Pen V2',
    title: 'Papa Pen V2 Ergonomic Precision Drive',
    specSummary: '6061-T6 Billet Chassis · German Coreless Motor',
    ctaLabel: 'Explore Pen V2',
    image: '/slides/slide_4_papa_pen_v2.jpg',
    fallbackImage: '/slides/slide_4_papa_pen_v2.jpg',
    productHandle: 'papa-pen-v2-1',
  },
  {
    id: 'papa-disposable-pen-grip',
    shortLabel: 'Pen Sleeves',
    title: 'Papa Disposable Ergonomic Pen Grip',
    specSummary: 'Single-Use Medical Silicone Sleeve · Vibration Damping',
    ctaLabel: 'Explore Pen Grip',
    image: '/slides/slide_5_disposable_grip.jpg',
    fallbackImage: '/slides/slide_5_disposable_grip.jpg',
    productHandle: 'papa-disposable-pen-grip',
  },
  {
    id: 'papa-disposable-cartridge-grips',
    shortLabel: 'Barrel Grips',
    title: 'Papa Disposable Cartridge Grips',
    specSummary: 'Non-Slip Rubber Barrel · Surgical Steel Backstem',
    ctaLabel: 'Explore Barrel Grips',
    image: '/slides/slide_6_disposable_cartridge_grips.jpg',
    fallbackImage: '/slides/slide_6_disposable_cartridge_grips.jpg',
    productHandle: 'papa-disposable-cartridge-grips',
  },
  {
    id: 'papa-pen-classic',
    shortLabel: 'Rotary Lineup',
    title: 'Papa Pen Rotary Series for Professional Studios',
    specSummary: 'Multi-Anodized 6061-T6 Finishes · High-Torque Rotary Drive',
    ctaLabel: 'Explore Classic Pen',
    image: '/slides/slide_7_papa_pen.jpg',
    fallbackImage: '/slides/slide_7_papa_pen.jpg',
    productHandle: 'papa-pen-jet-black',
  },
]

const SLIDE_DURATION_MS = 6000

export const HomeSlider: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPausedByUser, setIsPausedByUser] = useState(false)
  const [isInteracting, setIsInteracting] = useState(false)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % SLIDES_DATA.length)
  }, [])

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + SLIDES_DATA.length) % SLIDES_DATA.length)
  }, [])

  const isAutoPlaying = !prefersReducedMotion && !isPausedByUser && !isInteracting

  useEffect(() => {
    if (!isAutoPlaying) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current)
      return
    }

    autoPlayTimerRef.current = setInterval(() => {
      handleNext()
    }, SLIDE_DURATION_MS)

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current)
    }
  }, [isAutoPlaying, handleNext])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      handlePrev()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      handleNext()
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX - touchEndX
    if (diff > 45) {
      handleNext()
    } else if (diff < -45) {
      handlePrev()
    }
    setTouchStartX(null)
  }

  const currentSlide = SLIDES_DATA[currentIndex]

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Studio Promotions and Apparatus Highlights"
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      onFocusCapture={() => setIsInteracting(true)}
      onBlurCapture={e => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setIsInteracting(false)
        }
      }}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="group/slider relative w-full border-y border-[#e2dfd8] dark:border-white/[0.08] bg-white/75 dark:bg-[#171920]/90 backdrop-blur-md select-none"
    >
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Framed Widescreen Exhibition Canvas */}
        <div className="relative w-full aspect-[1920/485] rounded-2xl sm:rounded-3xl bg-[#0c0e12] overflow-hidden border border-[#e2dfd8] dark:border-white/[0.09] shadow-[0_20px_50px_-16px_rgba(18,18,16,0.16)] dark:shadow-[0_24px_60px_-16px_rgba(0,0,0,0.65)]">
          {SLIDES_DATA.map((slide, idx) => {
            const isActive = idx === currentIndex
            return (
              <Link
                key={slide.id}
                to="/products/$handle"
                params={{ handle: slide.productHandle }}
                tabIndex={isActive ? 0 : -1}
                aria-hidden={!isActive}
                aria-label={`${slide.title}: ${slide.ctaLabel}`}
                className={`absolute inset-0 block transition-[opacity,transform,filter] duration-500 ease-[var(--ease-out-strong)] motion-reduce:transition-none focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#38e8c6] ${
                  isActive
                    ? 'opacity-100 scale-100 blur-0 z-10 pointer-events-auto'
                    : 'opacity-0 scale-[1.015] blur-[2px] z-0 pointer-events-none'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  onError={e => {
                    if (e.currentTarget.src !== slide.fallbackImage) {
                      e.currentTarget.src = slide.fallbackImage
                    }
                  }}
                  className="w-full h-full object-cover object-center"
                />
              </Link>
            )
          })}

          {/* Previous Slide Control */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous slide"
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-zinc-950/75 hover:bg-zinc-950/95 text-white border border-white/15 hover:border-white/40 backdrop-blur-md flex items-center justify-center transition-[transform,background-color,border-color,opacity] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.96] cursor-pointer shadow-md sm:opacity-0 sm:group-hover/slider:opacity-100 focus-visible:opacity-100"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Next Slide Control */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next slide"
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-zinc-950/75 hover:bg-zinc-950/95 text-white border border-white/15 hover:border-white/40 backdrop-blur-md flex items-center justify-center transition-[transform,background-color,border-color,opacity] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.96] cursor-pointer shadow-md sm:opacity-0 sm:group-hover/slider:opacity-100 focus-visible:opacity-100"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Unified Exhibition Control Bar */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="mt-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
        >
          {/* Slide Title & Spec Caption */}
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white tracking-tight truncate">
              {currentSlide.title}
            </h3>
            <span className="hidden sm:inline text-xs font-mono text-zinc-500 dark:text-zinc-400 truncate">
              {currentSlide.specSummary}
            </span>
          </div>

          {/* Interactive Chapter Pills + Action */}
          <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2.5 shrink-0">
            <div
              role="tablist"
              aria-label="Select featured release"
              className="flex items-center gap-1 p-1 rounded-xl bg-[#eceae4]/80 dark:bg-[#22252f] border border-[#e2dfd8] dark:border-white/[0.06]"
            >
              {SLIDES_DATA.map((slide, idx) => {
                const isActive = idx === currentIndex
                return (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={slide.title}
                    onClick={() => setCurrentIndex(idx)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer ${
                      isActive
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-2xs'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                    }`}
                  >
                    <span className="hidden md:inline">{slide.shortLabel}</span>
                    <span className="md:hidden">{idx + 1}</span>
                  </button>
                )
              })}
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/products/$handle"
                params={{ handle: currentSlide.productHandle }}
                className="px-3.5 py-1.5 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-mono font-semibold inline-flex items-center gap-1.5 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97]"
              >
                <span>{currentSlide.ctaLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => setIsPausedByUser(prev => !prev)}
                aria-label={
                  isPausedByUser
                    ? 'Resume slideshow autoplay'
                    : 'Pause slideshow autoplay'
                }
                title={isPausedByUser ? 'Resume autoplay' : 'Pause autoplay'}
                className="p-2 rounded-xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#22252f] text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-[transform,border-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer"
              >
                {isPausedByUser ? (
                  <Play className="w-3.5 h-3.5" />
                ) : (
                  <Pause className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
