import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Check,
} from 'lucide-react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { useCart } from '../../context/CartContext'
import { ShopifyProduct } from '../../types/shopify'
import {
  computeReleaseVelocity,
  projectMomentum,
  rubberband,
  VelocitySample,
} from '../../utils/appleSpring'

export interface HeroSlideSpec {
  label: string
  value: string
}

export interface HeroSlideItem {
  id: string
  indexNumber: string
  shortLabel: string
  categoryTag: string
  badge: string
  title: string
  subtitle: string
  description: string
  productHandle: string
  price: string
  currency: string
  specs: HeroSlideSpec[]
  primaryCta: {
    label: string
    to: string
    params?: Record<string, string>
    search?: Record<string, string>
  }
  cutoutImage: string
  fallbackImage: string
  glowRgb: string
  glowName: string
}

const HERO_SLIDES: HeroSlideItem[] = [
  {
    id: 'papa-pen-v3',
    indexNumber: '01',
    shortLabel: 'Pen V3 Set',
    categoryTag: '01 / Modular Rotary Apparatus',
    badge: 'Flagship Studio Bundle',
    title: 'Papa Pen V3.',
    subtitle: 'The New Flagship Standard.',
    description:
      'Milled from aerospace 6061 billet with German coreless power. Includes 5 sterile cartridge boxes for immediate studio deployment.',
    productHandle: 'papa-pen-v3-black-full-set',
    price: '$799.95',
    currency: 'USD',
    specs: [
      { label: 'Stroke Cam', value: '3.5 to 4.5 mm' },
      { label: 'Motor Drive', value: 'German Coreless' },
      { label: 'Balance Mass', value: '134 g' },
    ],
    primaryCta: {
      label: 'Explore Pen V3',
      to: '/products/$handle',
      params: { handle: 'papa-pen-v3-black-full-set' },
    },
    cutoutImage: '/product-images/img_214_img_5795_cutout.webp',
    fallbackImage: '/slides/slide_3_papa_pen_v3.jpg',
    glowRgb: '56, 232, 198',
    glowName: 'Platinum Cyan',
  },
  {
    id: 'papa-premium-cartridges',
    indexNumber: '02',
    shortLabel: '316L Cartridges',
    categoryTag: '02 / Surgical Metallurgy',
    badge: '62 Micron Geometries',
    title: 'Papa 316L Cartridges.',
    subtitle: 'Japanese Steel. Zero Deflection.',
    description:
      'Automated micro-soldering fixtures eliminate needle drift. Integrated silicone safety membrane prevents pigment backflow into rotary drives.',
    productHandle: 'papa-premium-tattoo-cartridges',
    price: '$25.00',
    currency: 'USD',
    specs: [
      { label: 'Needle Lineup', value: '62 Geometries' },
      { label: 'Pin Metallurgy', value: 'Japanese 316L' },
      { label: 'Sterility Lot', value: '100% EO Gas' },
    ],
    primaryCta: {
      label: 'Configure 62 Sizes',
      to: '/products/$handle',
      params: { handle: 'papa-premium-tattoo-cartridges' },
    },
    cutoutImage: '/product-images/papa-premium-tattoo-cartridges-round-cutout.webp',
    fallbackImage: '/slides/slide_2_premium_cartridges.webp',
    glowRgb: '46, 230, 202',
    glowName: 'Surgical Teal',
  },
  {
    id: 'papa-volt-battery',
    indexNumber: '03',
    shortLabel: 'Papa Volt',
    categoryTag: '03 / Cordless Power System',
    badge: '2,000 mAh Lithium',
    title: 'Papa Volt Power.',
    subtitle: 'Continuous Drive. Zero Cords.',
    description:
      'Ultra-compact 2,000 mAh lithium dock delivering up to 8 hours of low-ripple voltage without tethering cables. Instant digital telemetry readout.',
    productHandle: 'papa-volt-battery',
    price: '$129.00',
    currency: 'USD',
    specs: [
      { label: 'Clean Voltage', value: '5V to 12V' },
      { label: 'Capacity', value: '2,000 mAh' },
      { label: 'Fitment', value: 'Universal RCA' },
    ],
    primaryCta: {
      label: 'Explore Papa Volt',
      to: '/products/$handle',
      params: { handle: 'papa-volt-battery' },
    },
    cutoutImage: '/product-images/img_041_papa_volt_large_cutout.webp',
    fallbackImage: '/slides/slide_1_volt_battery.webp',
    glowRgb: '56, 189, 248',
    glowName: 'Electric Cyan',
  },
  {
    id: 'papa-pen-v2',
    indexNumber: '04',
    shortLabel: 'Pen V2 Rotary',
    categoryTag: '04 / Precision Coreless Rotary',
    badge: 'Surgical Ergonomics',
    title: 'Papa Pen V2.',
    subtitle: 'Forward-Biased Center of Gravity.',
    description:
      'Engineered mass balance shifts weight forward to eliminate wrist strain during all-day lining and color packing. Aircraft 6061-T6 alloy chassis.',
    productHandle: 'papa-pen-v2-1',
    price: '$469.00',
    currency: 'USD',
    specs: [
      { label: 'Stroke Length', value: '3.5 mm' },
      { label: 'Chassis Billet', value: '6061-T6 Alloy' },
      { label: 'Weight Center', value: 'Forward Bias' },
    ],
    primaryCta: {
      label: 'Explore Pen V2',
      to: '/products/$handle',
      params: { handle: 'papa-pen-v2-1' },
    },
    cutoutImage: '/product-images/img_026_black_cutout.webp',
    fallbackImage: '/slides/slide_4_papa_pen_v2.jpg',
    glowRgb: '245, 158, 11',
    glowName: 'Titanium Amber',
  },
  {
    id: 'studio-replenishment',
    indexNumber: '05',
    shortLabel: 'Studio Matrix',
    categoryTag: '05 / B2B Commercial Supply',
    badge: 'Tiered Bulk Deductions',
    title: 'Studio Volume Matrix.',
    subtitle: 'Direct-From-Engineering Replenishment.',
    description:
      'Live wholesale replenishment matrix: 5% at 5 boxes, 10% at 10 boxes, 15% at 20+ boxes. Complimentary worldwide air freight on qualifying studio orders.',
    productHandle: 'papa-premium-tattoo-cartridges',
    price: 'Up to 15% Off',
    currency: 'USD',
    specs: [
      { label: 'Volume Tier', value: '5% to 15% Off' },
      { label: 'Air Freight', value: 'Free on 5+ Boxes' },
      { label: 'Packaging', value: '20 Sterile Pins' },
    ],
    primaryCta: {
      label: 'Open Studio Matrix',
      to: '/collections',
      search: { category: 'needles' },
    },
    cutoutImage: '/product-images/img_002_papa-cartridges-needles-round_cutout.webp',
    fallbackImage: '/slides/slide_7_papa_pen.jpg',
    glowRgb: '16, 185, 129',
    glowName: 'Emerald Matrix',
  },
]

const SLIDE_INTERVAL_MS = 6500

interface FullpageHeroSliderProps {
  products?: ShopifyProduct[]
}

export const FullpageHeroSlider: React.FC<FullpageHeroSliderProps> = ({
  products = [],
}) => {
  const { addToCart, openCart } = useCart()
  const prefersReducedMotion = usePrefersReducedMotion()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [addedCartSlideId, setAddedCartSlideId] = useState<string | null>(null)
  const [dragOffsetPx, setDragOffsetPx] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const progressStartTimeRef = useRef<number>(Date.now())
  const [slideProgress, setSlideProgress] = useState(0)
  const progressAnimFrameRef = useRef<number | null>(null)

  const sliderStageRef = useRef<HTMLElement>(null)
  const dragStateRef = useRef({
    active: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    lockedAxis: null as 'x' | 'y' | null,
    didDrag: false,
    samples: [] as VelocitySample[],
  })

  const currentSlide = HERO_SLIDES[currentIndex]

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % HERO_SLIDES.length)
    progressStartTimeRef.current = Date.now()
    setSlideProgress(0)
  }, [])

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
    progressStartTimeRef.current = Date.now()
    setSlideProgress(0)
  }, [])

  const handleSelectSlide = (idx: number) => {
    if (idx === currentIndex) return
    setCurrentIndex(idx)
    progressStartTimeRef.current = Date.now()
    setSlideProgress(0)
  }

  // Smooth animated progress tracking for the active segmented tab
  useEffect(() => {
    if (prefersReducedMotion || isPaused || isHovered || isDragging) {
      if (progressAnimFrameRef.current) {
        cancelAnimationFrame(progressAnimFrameRef.current)
      }
      return
    }

    progressStartTimeRef.current = Date.now() - slideProgress * SLIDE_INTERVAL_MS

    const updateProgress = () => {
      const elapsed = Date.now() - progressStartTimeRef.current
      const progress = Math.min(Math.max(elapsed / SLIDE_INTERVAL_MS, 0), 1)
      setSlideProgress(progress)

      if (progress >= 1) {
        handleNext()
      } else {
        progressAnimFrameRef.current = requestAnimationFrame(updateProgress)
      }
    }

    progressAnimFrameRef.current = requestAnimationFrame(updateProgress)

    return () => {
      if (progressAnimFrameRef.current) {
        cancelAnimationFrame(progressAnimFrameRef.current)
      }
    }
  }, [currentIndex, isPaused, isHovered, isDragging, prefersReducedMotion, handleNext])

  // Keyboard navigation (ArrowLeft & ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }
      if (e.key === 'ArrowLeft') {
        handlePrev()
      } else if (e.key === 'ArrowRight') {
        handleNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrev])

  // Direct Add to Bag integration for the current slide
  const handleDirectAddToCart = (slide: HeroSlideItem) => {
    const matchedProduct = products.find(p => p.handle === slide.productHandle)

    if (matchedProduct) {
      const variant = matchedProduct.variants?.edges?.[0]?.node || {
        id: `${matchedProduct.id}-default`,
        title: 'Standard',
        price: {
          amount: parseFloat(slide.price.replace(/[^0-9.]/g, '') || '0').toFixed(2),
          currencyCode: slide.currency,
        },
      }
      addToCart(matchedProduct, variant, 1)
    } else {
      // Fallback synthetic product if catalog query is pending
      const mockProduct: ShopifyProduct = {
        id: `mock-${slide.productHandle}`,
        title: slide.title.replace(/\.$/, ''),
        handle: slide.productHandle,
        description: slide.description,
        availableForSale: true,
        images: {
          edges: [
            {
              node: {
                url: slide.cutoutImage,
                altText: slide.title,
              },
            },
          ],
        },
        priceRange: {
          minVariantPrice: {
            amount: parseFloat(slide.price.replace(/[^0-9.]/g, '') || '0').toFixed(2),
            currencyCode: slide.currency,
          },
        },
        variants: {
          edges: [
            {
              node: {
                id: `mock-var-${slide.productHandle}`,
                title: 'Standard',
                availableForSale: true,
                price: {
                  amount: parseFloat(slide.price.replace(/[^0-9.]/g, '') || '0').toFixed(2),
                  currencyCode: slide.currency,
                },
              },
            },
          ],
        },
      }
      addToCart(mockProduct, mockProduct.variants.edges[0].node, 1)
    }

    setAddedCartSlideId(slide.id)
    window.setTimeout(() => setAddedCartSlideId(null), 1400)
    openCart()
  }

  // 1:1 Gesture Drag & Momentum Projection
  const handlePointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (e.button !== 0) return
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('a')) return

    const d = dragStateRef.current
    d.active = true
    d.pointerId = e.pointerId
    d.startX = e.clientX
    d.startY = e.clientY
    d.lockedAxis = null
    d.didDrag = false
    d.samples = [{ x: e.clientX, y: e.clientY, t: performance.now() }]
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
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

    const width = sliderStageRef.current?.offsetWidth || 1200
    setDragOffsetPx(rubberband(dx, width, 0.45))
  }

  const finishPointerGesture = (
    e: React.PointerEvent<HTMLElement>,
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
      const projected = dx + projectMomentum(vx, 0.992)
      const threshold = Math.min(
        (sliderStageRef.current?.offsetWidth || 800) * 0.16,
        110
      )

      if (projected < -threshold || vx < -340) {
        handleNext()
      } else if (projected > threshold || vx > 340) {
        handlePrev()
      }
    }

    d.lockedAxis = null
    setIsDragging(false)
    setDragOffsetPx(0)
  }

  return (
    <section
      ref={sliderStageRef}
      aria-roledescription="carousel"
      aria-label="Papa Flagship Apparatus Fullpage Presentation"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={e => finishPointerGesture(e, false)}
      onPointerCancel={e => finishPointerGesture(e, true)}
      className="relative w-full min-h-[calc(100dvh-3.5rem)] lg:h-[calc(100dvh-3.5rem)] min-h-[640px] flex flex-col justify-between overflow-hidden select-none bg-[#07080a] text-white touch-pan-y"
    >
      {/* Dynamic Ambient Optical Atmosphere */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none transition-all duration-1000 ease-[var(--ease-spring)]"
        style={{
          background: `radial-gradient(ellipse 75% 65% at 66% 48%, rgba(${currentSlide.glowRgb}, 0.16) 0%, transparent 68%), radial-gradient(circle at 18% 78%, rgba(255, 255, 255, 0.02) 0%, transparent 45%)`,
        }}
      />

      {/* Atmospheric Subtle Grid Texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Top Telemetry Coordinates Bar */}
      <div className="relative z-20 pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1440px] mx-auto w-full flex items-center justify-between text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse motion-reduce:animate-none"
            style={{ backgroundColor: `rgb(${currentSlide.glowRgb})` }}
          />
          <span className="text-zinc-300 font-semibold">Papa Engineering</span>
          <span className="text-zinc-600">/</span>
          <span>{currentSlide.glowName}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-zinc-500">Continuous Exhibit</span>
          <span className="font-bold text-white tabular-nums">
            {currentSlide.indexNumber} / 05
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MAIN CINEMATIC WIDESCREEN STAGE                              */}
      {/* ============================================================ */}
      <div className="relative z-10 flex-1 flex items-center max-w-7xl 2xl:max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Wing (Columns 1-6): Monumental Typography & Value Proposition */}
          <div
            className="lg:col-span-6 space-y-4 sm:space-y-6 text-left transition-[transform,opacity] duration-400 ease-[var(--ease-spring)]"
            style={
              dragOffsetPx !== 0 && !prefersReducedMotion
                ? {
                    transform: `translate3d(${(dragOffsetPx * 0.25).toFixed(1)}px, 0, 0)`,
                  }
                : undefined
            }
          >
            {/* Category / Discipline Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs font-mono font-medium text-white/80 tracking-wider uppercase">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: `rgb(${currentSlide.glowRgb})` }}
              />
              <span>{currentSlide.categoryTag}</span>
              <span className="text-white/30">·</span>
              <span className="text-white font-semibold">{currentSlide.badge}</span>
            </div>

            {/* Monumental Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-[76px] font-semibold tracking-[-0.038em] text-white leading-[1.02]">
                {currentSlide.title}
              </h1>

              <p className="text-lg sm:text-2xl font-normal text-zinc-300 tracking-[-0.015em]">
                {currentSlide.subtitle}
              </p>
            </div>

            {/* Architectural Summary */}
            <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed max-w-xl">
              {currentSlide.description}
            </p>

            {/* 3 Spec Telemetry Readouts */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-5 pb-1 border-t border-white/10 max-w-xl">
              {currentSlide.specs.map(spec => (
                <div key={spec.label}>
                  <span className="text-base sm:text-xl font-semibold tracking-[-0.02em] text-white block tabular-nums">
                    {spec.value}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-zinc-500 mt-0.5 block font-mono uppercase tracking-wider">
                    {spec.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Direct Dual Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <Link
                to={currentSlide.primaryCta.to}
                params={currentSlide.primaryCta.params}
                search={currentSlide.primaryCta.search}
                className="px-7 py-3.5 rounded-full bg-white text-[#07080a] font-sans font-medium text-xs sm:text-sm inline-flex items-center gap-2 hover:bg-zinc-100 transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] shadow-[0_12px_28px_rgba(255,255,255,0.12)]"
              >
                <span>{currentSlide.primaryCta.label}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={() => handleDirectAddToCart(currentSlide)}
                className={`px-6 py-3.5 rounded-full text-xs sm:text-sm font-medium inline-flex items-center gap-2 border transition-[transform,background-color,border-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer ${
                  addedCartSlideId === currentSlide.id
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-white/[0.08] hover:bg-white/[0.14] text-white border-white/15'
                }`}
              >
                {addedCartSlideId === currentSlide.id ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Added to Studio Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-white/80" />
                    <span>
                      Add to Bag · {currentSlide.price}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Wing (Columns 7-12): Massive Specimen Exhibition */}
          <div className="lg:col-span-6 relative w-full h-[320px] sm:h-[440px] lg:h-[500px] flex items-center justify-center">
            {/* Ambient Backlight Halo behind Specimen */}
            <div
              aria-hidden="true"
              className="absolute w-3/4 aspect-square rounded-full blur-3xl pointer-events-none transition-opacity duration-700"
              style={{
                background: `radial-gradient(circle at 50% 50%, rgba(${currentSlide.glowRgb}, 0.28) 0%, transparent 68%)`,
              }}
            />

            {/* Specimen Floating Presentation with Drag Responsiveness */}
            <div
              className="relative z-10 w-full h-full flex items-center justify-center transition-transform duration-300 ease-[var(--ease-spring)]"
              style={
                dragOffsetPx !== 0 && !prefersReducedMotion
                  ? {
                      transform: `translate3d(${dragOffsetPx.toFixed(1)}px, 0, 0)`,
                    }
                  : undefined
              }
            >
              <img
                key={currentSlide.id}
                src={currentSlide.cutoutImage}
                alt={currentSlide.title}
                draggable={false}
                loading={currentIndex === 0 ? 'eager' : 'lazy'}
                onError={e => {
                  const img = e.currentTarget
                  if (img.src !== currentSlide.fallbackImage) {
                    img.src = currentSlide.fallbackImage
                  }
                }}
                className="max-h-[88%] max-w-[90%] w-auto h-auto object-contain drop-shadow-[0_28px_60px_rgba(0,0,0,0.85)] transition-transform duration-500 ease-[var(--ease-spring)] hover:scale-[1.03] pointer-events-none"
              />

              {/* Ground Contact Shadow */}
              <div
                aria-hidden="true"
                className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/5 h-6 bg-black/80 blur-xl rounded-[100%] pointer-events-none"
              />

              {/* Specular Ground Glow */}
              <div
                aria-hidden="true"
                className="absolute bottom-5 left-1/2 -translate-x-1/2 w-2/5 h-2 blur-md rounded-[100%] pointer-events-none"
                style={{ backgroundColor: `rgba(${currentSlide.glowRgb}, 0.35)` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* BOTTOM SEGMENTED SLIDE PROGRESS DOCK (APPLE-STYLE NAVIGATION)*/}
      {/* ============================================================ */}
      <div className="relative z-30 pb-6 sm:pb-8 pt-2 px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1440px] mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2 sm:p-2.5 rounded-2xl sm:rounded-full bg-white/[0.04] backdrop-blur-xl border border-white/10">
          {/* 5 Segmented Slide Tabs with Live Filling Progress Bars */}
          <div
            role="tablist"
            aria-label="Hardware slide selection"
            className="grid grid-cols-5 gap-2 sm:gap-3 w-full sm:flex-1"
          >
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = idx === currentIndex
              return (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Slide ${idx + 1}: ${slide.shortLabel}`}
                  onClick={() => handleSelectSlide(idx)}
                  className="group relative flex flex-col gap-1.5 p-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-full text-left transition-colors cursor-pointer"
                >
                  {/* Subtle Top Progress Track */}
                  <div className="relative w-full h-1 sm:h-1.5 rounded-full bg-white/15 overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full transition-all duration-75 ease-linear"
                      style={{
                        width: isActive
                          ? prefersReducedMotion
                            ? '100%'
                            : `${(slideProgress * 100).toFixed(1)}%`
                          : idx < currentIndex
                          ? '100%'
                          : '0%',
                        backgroundColor: isActive
                          ? `rgb(${slide.glowRgb})`
                          : 'rgba(255, 255, 255, 0.4)',
                      }}
                    />
                  </div>

                  {/* Monospace Slide Title Label */}
                  <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono uppercase tracking-wider truncate">
                    <span
                      className={`truncate transition-colors ${
                        isActive
                          ? 'text-white font-bold'
                          : 'text-zinc-500 group-hover:text-zinc-300'
                      }`}
                    >
                      <span className="hidden md:inline mr-1 opacity-50">
                        {slide.indexNumber}
                      </span>
                      {slide.shortLabel}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Controls: Play/Pause, Prev, Next */}
          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto px-2">
            {/* Play / Pause Autoplay Toggle */}
            <button
              type="button"
              onClick={() => setIsPaused(prev => !prev)}
              aria-label={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
              className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
            >
              {isPaused ? (
                <Play className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Pause className="w-3.5 h-3.5 fill-current" />
              )}
            </button>

            {/* Previous Slide Button */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous apparatus slide"
              className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Next Slide Button */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next apparatus slide"
              className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
