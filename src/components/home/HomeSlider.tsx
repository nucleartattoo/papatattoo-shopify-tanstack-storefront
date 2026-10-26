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
  code: string
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
    code: 'SLD-01 // CORDLESS POWER',
    shortLabel: 'Volt Battery',
    title: 'Papa Volt Wireless Battery Pack',
    specSummary: '5V–12V Regulated Output · Universal RCA Fitment · Mini & Regular',
    ctaLabel: 'Inspect Papa Volt',
    image: '/slides/slide_1_volt_battery.webp',
    fallbackImage: '/slides/slide_1_volt_battery.png',
    productHandle: 'papa-volt-battery',
  },
  {
    id: 'papa-premium-cartridges',
    code: 'SLD-02 // STUDIO PROMO',
    shortLabel: 'Buy 5 Get 1',
    title: 'Papa Premium Tattoo Cartridges — Buy 5 Get 1 Free',
    specSummary: '62 Needle Configurations · Japanese 316L Steel · Safety Membrane',
    ctaLabel: 'Shop 62 Needle Sizes',
    image: '/slides/slide_2_premium_cartridges.webp',
    fallbackImage: '/slides/slide_2_premium_cartridges.png',
    productHandle: 'papa-premium-tattoo-cartridges',
  },
  {
    id: 'papa-pen-v3',
    code: 'SLD-03 // MACHINE BUNDLE',
    shortLabel: 'Pen + 5 Boxes',
    title: 'Buy 1 Papa Pen — Get 5 Boxes of Cartridges Free',
    specSummary: 'Flagship Rotary Machine Bundle · 5 Complimentary Sterile Cartridge Boxes',
    ctaLabel: 'Inspect Papa Pen V3',
    image: '/slides/slide_3_papa_pen_v3.jpg',
    fallbackImage: '/slides/slide_3_papa_pen_v3.jpg',
    productHandle: 'papa-pen-v3-black-full-set',
  },
  {
    id: 'papa-pen-v2',
    code: 'SLD-04 // FLAGSHIP ROTARY',
    shortLabel: 'Papa Pen V2',
    title: 'Introducing Papa Pen V2 — Ergonomic Precision Drive',
    specSummary: '6061-T6 Billet Chassis · 3.5 mm Fixed Cam · German Coreless Motor',
    ctaLabel: 'Inspect Papa Pen V2',
    image: '/slides/slide_4_papa_pen_v2.jpg',
    fallbackImage: '/slides/slide_4_papa_pen_v2.jpg',
    productHandle: 'papa-pen-v2-1',
  },
  {
    id: 'papa-disposable-pen-grip',
    code: 'SLD-05 // STERILE SLEEVE',
    shortLabel: 'Pen Grip',
    title: 'Papa Disposable Ergonomic Pen Grip',
    specSummary: 'Single-Use Medical Silicone Sleeve · EO Gas Sterile · Vibration Damping',
    ctaLabel: 'Inspect Pen Grip',
    image: '/slides/slide_5_disposable_grip.jpg',
    fallbackImage: '/slides/slide_5_disposable_grip.jpg',
    productHandle: 'papa-disposable-pen-grip',
  },
  {
    id: 'papa-disposable-cartridge-grips',
    code: 'SLD-06 // BARREL GRIPS',
    shortLabel: 'Cartridge Grip',
    title: 'Papa Disposable Cartridge Grips',
    specSummary: '1" & 1.25" Non-Slip Rubber Barrel · Surgical Backstem · Box of 20',
    ctaLabel: 'Inspect Cartridge Grips',
    image: '/slides/slide_6_disposable_cartridge_grips.jpg',
    fallbackImage: '/slides/slide_6_disposable_cartridge_grips.jpg',
    productHandle: 'papa-disposable-cartridge-grips',
  },
  {
    id: 'papa-pen-classic',
    code: 'SLD-07 // PRO LINEUP',
    shortLabel: 'Papa Pen',
    title: 'Papa Pen Rotary Series — For Professionals Only',
    specSummary: 'Multi-Anodized 6061-T6 Finishes · Continuous High-Torque Rotary Drive',
    ctaLabel: 'Inspect Papa Pen',
    image: '/slides/slide_7_papa_pen.jpg',
    fallbackImage: '/slides/slide_7_papa_pen.jpg',
    productHandle: 'papa-pen-jet-black',
  },
]

const SLIDE_DURATION_MS = 5500

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
      aria-label="Featured Papa Tattoo Apparatus & Studio Promotions"
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
      className="group/slider relative w-full border-b border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#181a20] select-none"
    >
      {/* 1920x485 Full-Bleed Widescreen Banner Stage (True Native Aspect Ratio, Zero Cropping) */}
      <div className="relative w-full aspect-[1920/485] bg-[#0c0e12] overflow-hidden">
        {SLIDES_DATA.map((slide, idx) => {
          const isActive = idx === currentIndex
          return (
            <Link
              key={slide.id}
              to="/products/$handle"
              params={{ handle: slide.productHandle }}
              tabIndex={isActive ? 0 : -1}
              aria-hidden={!isActive}
              aria-label={`${slide.title} — ${slide.ctaLabel}`}
              className={`absolute inset-0 block transition-[opacity,transform] duration-500 ease-[var(--ease-out-strong)] motion-reduce:transition-none focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#38e8c6] ${
                isActive
                  ? 'opacity-100 scale-100 z-10 pointer-events-auto'
                  : 'opacity-0 scale-[1.01] z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                fetchPriority={idx === 0 ? 'high' : 'auto'}
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

        {/* Previous Slide Floating Button */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous slide"
          className="absolute left-2.5 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-zinc-950/70 hover:bg-zinc-950/90 text-white border border-white/15 hover:border-[#38e8c6]/60 backdrop-blur-md flex items-center justify-center transition-[transform,background-color,border-color,opacity] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.96] cursor-pointer shadow-md sm:opacity-0 sm:group-hover/slider:opacity-100 focus-visible:opacity-100"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Next Slide Floating Button */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next slide"
          className="absolute right-2.5 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-zinc-950/70 hover:bg-zinc-950/90 text-white border border-white/15 hover:border-[#38e8c6]/60 backdrop-blur-md flex items-center justify-center transition-[transform,background-color,border-color,opacity] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.96] cursor-pointer shadow-md sm:opacity-0 sm:group-hover/slider:opacity-100 focus-visible:opacity-100"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Swiss Industrial Slide Telemetry & 7-Slide Exhibition Index */}
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 space-y-2.5">
        {/* Row 1: Active Slide Telemetry Bar + Direct Action & Play/Pause */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2"
        >
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#0d5d50]/10 dark:bg-[#38e8c6]/10 border border-[#0d5d50]/25 dark:border-[#38e8c6]/25 text-[10px] font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6] uppercase tracking-wider shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0d5d50] dark:bg-[#38e8c6]" />
              <span>
                {String(currentIndex + 1).padStart(2, '0')} /{' '}
                {String(SLIDES_DATA.length).padStart(2, '0')}
              </span>
            </span>

            <span className="hidden md:inline text-[11px] font-mono font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider shrink-0">
              {currentSlide.code}
            </span>

            <span className="text-xs sm:text-sm font-bold text-zinc-950 dark:text-white truncate">
              {currentSlide.title}
            </span>

            <span className="hidden xl:inline text-xs font-mono text-zinc-500 dark:text-zinc-400 truncate">
              · {currentSlide.specSummary}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <Link
              to="/products/$handle"
              params={{ handle: currentSlide.productHandle }}
              className="px-3 py-1 rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-[11px] font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1.5 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97]"
            >
              <span>{currentSlide.ctaLabel}</span>
              <ArrowRight className="w-3 h-3" />
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
              className="p-1.5 rounded-lg border border-zinc-200/80 dark:border-white/[0.08] bg-zinc-100/80 dark:bg-[#22252e] text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-300 dark:hover:border-white/20 transition-colors cursor-pointer"
            >
              {isPausedByUser ? (
                <Play className="w-3.5 h-3.5" />
              ) : (
                <Pause className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Row 2: 7-Column Proportional Slide Selector Strip */}
        <div
          role="tablist"
          aria-label="Select banner slide"
          className="grid grid-cols-7 gap-1 sm:gap-1.5"
        >
          {SLIDES_DATA.map((slide, idx) => {
            const isActive = idx === currentIndex
            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Slide ${idx + 1}: ${slide.title}`}
                onClick={() => setCurrentIndex(idx)}
                className={`group/tab relative text-left px-2 py-1.5 rounded-lg border transition-[transform,background-color,border-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.98] cursor-pointer overflow-hidden ${
                  isActive
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-2xs'
                    : 'bg-zinc-50 dark:bg-[#1f222b] text-zinc-600 dark:text-zinc-400 border-zinc-200/80 dark:border-white/[0.06] hover:border-zinc-300 dark:hover:border-white/20 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center justify-center md:justify-start gap-1.5 min-w-0">
                  <span
                    className={`text-[10px] font-mono font-bold shrink-0 ${
                      isActive
                        ? 'text-[#38e8c6] dark:text-[#0d5d50]'
                        : 'text-zinc-400 dark:text-zinc-500'
                    }`}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="hidden md:inline text-[11px] font-mono font-semibold truncate">
                    {slide.shortLabel}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
