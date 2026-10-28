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
import {
  computeReleaseVelocity,
  projectMomentum,
  rubberband,
  VelocitySample,
} from '../../utils/appleSpring'

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
  const [dragOffsetPx, setDragOffsetPx] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)
  const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const dragStateRef = useRef({
    active: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    lockedAxis: null as 'x' | 'y' | null,
    didDrag: false,
    samples: [] as VelocitySample[],
  })

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % SLIDES_DATA.length)
  }, [])

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + SLIDES_DATA.length) % SLIDES_DATA.length)
  }, [])

  const isAutoPlaying =
    !prefersReducedMotion && !isPausedByUser && !isInteracting && !isDragging

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

  // 1:1 Pointer Drag + Rubber-banding + Momentum Projection (§1, §2, §6, §9, §10)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    const target = e.target as HTMLElement
    if (target.closest('button')) return

    const d = dragStateRef.current
    d.active = true
    d.pointerId = e.pointerId
    d.startX = e.clientX
    d.startY = e.clientY
    d.lockedAxis = null
    d.didDrag = false
    d.samples = [{ x: e.clientX, y: e.clientY, t: performance.now() }]
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragStateRef.current
    if (!d.active || e.pointerId !== d.pointerId) return

    const dx = e.clientX - d.startX
    const dy = e.clientY - d.startY

    if (!d.lockedAxis) {
      if (Math.hypot(dx, dy) < 8) return
      if (Math.abs(dx) > Math.abs(dy)) {
        d.lockedAxis = 'x'
        d.didDrag = true
        setIsDragging(true)
        e.currentTarget.setPointerCapture?.(e.pointerId)
      } else {
        d.lockedAxis = 'y'
        d.active = false
        return
      }
    }

    if (d.lockedAxis !== 'x') return

    const now = performance.now()
    d.samples.push({ x: e.clientX, y: e.clientY, t: now })
    if (d.samples.length > 8) d.samples.shift()

    const width = canvasRef.current?.offsetWidth || 960
    setDragOffsetPx(rubberband(dx, width, 0.35))
  }

  const finishPointerGesture = (
    e: React.PointerEvent<HTMLDivElement>,
    cancelled = false
  ) => {
    const d = dragStateRef.current
    if (!d.active || e.pointerId !== d.pointerId) return
    d.active = false

    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }

    if (d.lockedAxis === 'x' && !cancelled) {
      const dx = e.clientX - d.startX
      const { vx } = computeReleaseVelocity(d.samples, performance.now())
      // Project resting endpoint from release velocity (§6 Momentum projection)
      const projected = dx + projectMomentum(vx, 0.994)
      const threshold = Math.min(
        (canvasRef.current?.offsetWidth || 640) * 0.14,
        90
      )

      if (projected < -threshold || vx < -320) {
        handleNext()
      } else if (projected > threshold || vx > 320) {
        handlePrev()
      }
    }

    d.lockedAxis = null
    setIsDragging(false)
    setDragOffsetPx(0)
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
      className="group/slider relative w-full select-none"
    >
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Framed Widescreen Exhibition Canvas */}
        <div
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={e => finishPointerGesture(e, false)}
          onPointerCancel={e => finishPointerGesture(e, true)}
          className="relative w-full aspect-[1920/485] rounded-2xl sm:rounded-[28px] bg-[#0c0e12] overflow-hidden shadow-[0_20px_50px_-20px_rgba(0,0,0,0.12)] dark:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)] touch-pan-y cursor-grab active:cursor-grabbing"
        >
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
                onClick={e => {
                  if (dragStateRef.current.didDrag) {
                    e.preventDefault()
                    dragStateRef.current.didDrag = false
                  }
                }}
                draggable={false}
                style={
                  isActive && dragOffsetPx !== 0 && !prefersReducedMotion
                    ? {
                        transform: `translate3d(${dragOffsetPx.toFixed(1)}px, 0, 0) scale(1)`,
                        transition: 'none',
                      }
                    : undefined
                }
                className={`absolute inset-0 block transition-[opacity,transform,filter] duration-500 ease-[var(--ease-spring)] motion-reduce:transition-none focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white ${
                  isActive
                    ? 'opacity-100 scale-100 blur-0 z-10 pointer-events-auto'
                    : 'opacity-0 scale-[1.015] blur-[2px] z-0 pointer-events-none'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  draggable={false}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  onError={e => {
                    if (e.currentTarget.src !== slide.fallbackImage) {
                      e.currentTarget.src = slide.fallbackImage
                    }
                  }}
                  className="w-full h-full object-cover object-center pointer-events-none"
                />
              </Link>
            )
          })}

          {/* Previous Slide Control */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous slide"
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/55 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-[transform,background-color,opacity] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.95] cursor-pointer sm:opacity-0 sm:group-hover/slider:opacity-100 focus-visible:opacity-100"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Next Slide Control */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next slide"
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/55 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-[transform,background-color,opacity] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.95] cursor-pointer sm:opacity-0 sm:group-hover/slider:opacity-100 focus-visible:opacity-100"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Unified Exhibition Control Bar */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="mt-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-1"
        >
          {/* Slide Title & Spec Caption */}
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 min-w-0">
            <h3 className="text-sm sm:text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-[-0.015em] truncate">
              {currentSlide.title}
            </h3>
            <span className="hidden sm:inline text-xs text-[#86868b] truncate">
              {currentSlide.specSummary}
            </span>
          </div>

          {/* Interactive Chapter Pills + Action */}
          <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2.5 shrink-0">
            <div
              role="tablist"
              aria-label="Select featured release"
              className="flex items-center gap-1 p-1 rounded-full bg-black/[0.05] dark:bg-white/[0.08]"
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
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-[transform,background-color,color,box-shadow] duration-200 ease-[var(--ease-spring)] active:scale-[0.97] cursor-pointer ${
                      isActive
                        ? 'bg-white text-[#1d1d1f] dark:bg-[#2c2c2e] dark:text-white shadow-2xs'
                        : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
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
                className="px-4 py-1.5 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-xs font-medium inline-flex items-center gap-1.5 hover:opacity-85 transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97]"
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
                className="p-2 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-[transform,color,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer"
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
