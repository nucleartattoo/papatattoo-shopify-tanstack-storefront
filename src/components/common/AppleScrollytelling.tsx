import React, { useEffect, useState, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { useCart } from '../../context/CartContext'
import { ShopifyProduct } from '../../types/shopify'
import { getProductByHandle } from '../../lib/shopify'
import { ShoppingBag, ArrowRight, Sparkles, Box, ShieldCheck, Cpu } from 'lucide-react'

export const AppleScrollytelling: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const modelViewerRef = useRef<any>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [penProduct, setPenProduct] = useState<ShopifyProduct | null>(null)
  const { addToCart, openCart } = useCart()

  // Load Papa Pen V2 product data
  useEffect(() => {
    async function loadPen() {
      try {
        const prod = await getProductByHandle('papa-pen-v2-1')
        if (prod) setPenProduct(prod)
      } catch (err) {
        console.error('Failed to load Papa Pen product:', err)
      }
    }
    loadPen()
  }, [])

  // Dynamically import @google/model-viewer
  useEffect(() => {
    let mounted = true
    import('@google/model-viewer')
      .then(() => {
        if (mounted) {
          // Model viewer custom element registered
        }
      })
      .catch(err => console.error('Failed to load @google/model-viewer:', err))
    return () => {
      mounted = false
    }
  }, [])

  // Scroll listener tracking container progress (0 to 1)
  useEffect(() => {
    let animationFrameId: number

    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const totalHeight = rect.height - window.innerHeight
      if (totalHeight <= 0) return

      // Calculate progress through this 300vh section: 0 to 1
      const progress = Math.min(Math.max(-rect.top / totalHeight, 0), 1)

      animationFrameId = requestAnimationFrame(() => {
        setScrollProgress(progress)

        // Scrub 3D camera orbit smoothly as user scrolls
        if (modelViewerRef.current) {
          // 360-degree continuous rotation driven by scroll position
          const theta = 35 + progress * 360
          // Smooth elevation dip and zoom: 70deg -> 85deg -> 65deg
          const phi = 70 + Math.sin(progress * Math.PI) * 12
          // Camera zoom distance: pull close in the middle, pull back at start/end
          const radius = 2.2 - Math.sin(progress * Math.PI) * 0.35

          modelViewerRef.current.cameraOrbit = `${theta}deg ${phi}deg ${radius}m`
          modelViewerRef.current.jumpCameraToGoal?.()
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  const handleBuyNow = () => {
    if (penProduct && penProduct.variants?.edges?.[0]?.node) {
      addToCart(penProduct, penProduct.variants.edges[0].node, 1)
      openCart()
    }
  }

  // Act 1: 0% to 25%
  const act1Opacity = scrollProgress <= 0.25 ? Math.max(1 - scrollProgress * 4, 0) : 0
  // Act 2: 25% to 55%
  const act2Opacity =
    scrollProgress > 0.2 && scrollProgress <= 0.55
      ? Math.sin(((scrollProgress - 0.2) / 0.35) * Math.PI)
      : 0
  // Act 3: 55% to 80%
  const act3Opacity =
    scrollProgress > 0.5 && scrollProgress <= 0.8
      ? Math.sin(((scrollProgress - 0.5) / 0.3) * Math.PI)
      : 0
  // Act 4: 80% to 100%
  const act4Opacity = scrollProgress > 0.75 ? Math.min((scrollProgress - 0.75) * 4, 1) : 0

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[280vh] bg-transparent select-none"
      aria-label="Papa Pen Scroll-Driven 3D Scrollytelling"
    >
      {/* Sticky Fullscreen Stage (Apple Keynote Style) */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Deep Atmospheric Radial Spotlight behind 3D Apparatus */}
        <div
          className="absolute inset-0 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 70% 60% at 50% 50%, rgba(56,232,198,${0.15 + Math.sin(scrollProgress * Math.PI) * 0.12}) 0%, transparent 70%)`,
          }}
        />

        {/* Precision Swiss Datum Watermarks */}
        <div className="absolute top-28 left-6 sm:left-12 z-20 font-mono text-[9px] sm:text-[10px] text-zinc-500/60 dark:text-zinc-400/50 pointer-events-none uppercase tracking-widest">
          <span>+ DATUM // CHRONO SCROLL</span>
          <div className="text-[#38e8c6] font-bold mt-0.5">
            ROTATION: {Math.round(scrollProgress * 360)}°
          </div>
        </div>

        <div className="absolute top-28 right-6 sm:right-12 z-20 font-mono text-[9px] sm:text-[10px] text-zinc-500/60 dark:text-zinc-400/50 pointer-events-none uppercase tracking-widest text-right">
          <span>SCROLL PROGRESS</span>
          <div className="text-white font-bold mt-0.5">
            {Math.round(scrollProgress * 100)}%
          </div>
        </div>

        {/* 3D Model Center Stage */}
        <div className="relative w-full max-w-4xl h-[420px] sm:h-[540px] lg:h-[620px] flex items-center justify-center z-10">
          <model-viewer
            ref={modelViewerRef}
            src="/models/papapenv2.glb"
            poster="/product-images/img_113_papa_pen_jet_black_1__cutout.webp"
            alt="Papa Pen V2 Precision Machine"
            shadow-intensity="1.2"
            shadow-softness="0.9"
            exposure="1.6"
            tone-mapping="neutral"
            camera-orbit="35deg 70deg 2.2m"
            field-of-view="30deg"
            interaction-prompt="none"
            className="w-full h-full cursor-grab active:cursor-grabbing"
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'transparent',
              outline: 'none',
            }}
          />

          {/* Elliptical Contact Shadow under 3D Model */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-3/4 max-w-md h-8 bg-black/70 dark:bg-black/90 blur-2xl rounded-[100%] pointer-events-none" />
          <div className="absolute bottom-7 left-1/2 -translate-x-1/2 w-1/2 max-w-xs h-3 bg-[#38e8c6]/20 blur-lg rounded-[100%] pointer-events-none" />
        </div>

        {/* ==================================================== */}
        {/* Apple-Style Floating Typography Narrative (4 Acts) */}
        {/* ==================================================== */}

        {/* ACT 1: Intro (0% - 25%) */}
        <div
          className="absolute bottom-16 sm:bottom-24 left-6 sm:left-16 max-w-lg z-20 pointer-events-none transition-opacity duration-300"
          style={{ opacity: act1Opacity, transform: `translateY(${(1 - act1Opacity) * 20}px)` }}
        >
          <div className="space-y-2">
            <div className="text-[10px] font-mono font-bold text-[#38e8c6] uppercase tracking-widest">
              01 // THE ARCHITECTURE
            </div>
            <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-zinc-950 dark:text-white font-['Montserrat',sans-serif]">
              PAPA PEN V2
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
              Scroll down to deconstruct the internal engineering of our flagship continuous-drive rotary apparatus.
            </p>
          </div>
        </div>

        {/* ACT 2: Motor & Stroke (25% - 55%) */}
        <div
          className="absolute top-1/3 right-6 sm:right-16 max-w-md z-20 pointer-events-none transition-opacity duration-300"
          style={{ opacity: act2Opacity, transform: `translateY(${(1 - act2Opacity) * 20}px)` }}
        >
          <div className="space-y-3 text-right">
            <div className="text-[10px] font-mono font-bold text-[#38e8c6] uppercase tracking-widest">
              02 // DIRECT DRIVE CAM
            </div>
            <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-950 dark:text-white font-['Montserrat',sans-serif]">
              3.5MM FIXED STROKE
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
              Engineered with custom German coreless motor. Delivers zero-vibration needle puncture force for crisp single-pass lines.
            </p>
            <div className="inline-flex items-center gap-3 font-mono text-xs text-[#38e8c6] font-bold">
              <span>6V – 12.6V OPERATING</span>
              <span>·</span>
              <span>9,800 MAX RPM</span>
            </div>
          </div>
        </div>

        {/* ACT 3: Metallurgy & Ergonomics (55% - 80%) */}
        <div
          className="absolute bottom-20 left-6 sm:left-16 max-w-md z-20 pointer-events-none transition-opacity duration-300"
          style={{ opacity: act3Opacity, transform: `translateY(${(1 - act3Opacity) * 20}px)` }}
        >
          <div className="space-y-3">
            <div className="text-[10px] font-mono font-bold text-[#e6b366] uppercase tracking-widest">
              03 // CNC METALLURGY
            </div>
            <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-950 dark:text-white font-['Montserrat',sans-serif]">
              150G BALANCED ALLOY
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
              Machined from solid aerospace 6061-T6 aluminum billet. Center of gravity shifted forward to eliminate wrist strain during all-day sessions.
            </p>
            <div className="text-xs font-mono text-zinc-400">
              UNIVERSAL CARTRIDGE KEYWAY DOCK
            </div>
          </div>
        </div>

        {/* ACT 4: Master Conversion & CTA (80% - 100%) */}
        <div
          className="absolute bottom-12 sm:bottom-20 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-20 transition-opacity duration-300 text-center space-y-4"
          style={{
            opacity: act4Opacity,
            transform: `translate(-50%, ${(1 - act4Opacity) * 25}px)`,
            pointerEvents: act4Opacity > 0.5 ? 'auto' : 'none',
          }}
        >
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] text-[10px] font-mono font-bold text-[#38e8c6] uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE MASTER APPARATUS</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-black uppercase text-zinc-950 dark:text-white font-['Montserrat',sans-serif]">
              OWN THE PAPA PEN V2
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans">
              Includes heavy-duty RCA cord, protective case, and 1-year manufacturing warranty.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleBuyNow}
              className="px-8 py-4 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-mono font-black text-xs uppercase tracking-wider flex items-center gap-2.5 hover:opacity-90 active:scale-95 transition-all shadow-2xl cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>ADD TO CART — $199.00 USD</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/products/$handle"
              params={{ handle: 'papa-pen-v2-1' }}
              className="px-6 py-4 rounded-full border border-zinc-200/80 dark:border-white/15 hover:border-zinc-400 dark:hover:border-white/30 text-xs font-mono font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 transition-colors"
            >
              <span>Full Specifications</span>
            </Link>
          </div>
        </div>

        {/* Bottom Scroll Indicator Pill */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 font-mono text-[9px] text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-[#38e8c6] animate-pulse" />
          <span>SCROLL TO ROTATE &amp; DISCOVER</span>
        </div>
      </div>
    </div>
  )
}
