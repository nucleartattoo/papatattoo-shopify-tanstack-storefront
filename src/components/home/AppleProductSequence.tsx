import React, { useEffect, useState, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { Sparkles, ArrowRight, ShieldCheck, Box, Zap, Layers, Cpu } from 'lucide-react'

export const AppleProductSequence: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Track scroll through the 280vh container: 0 to 1
  useEffect(() => {
    let animationFrameId: number

    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const totalHeight = rect.height - window.innerHeight
      if (totalHeight <= 0) return

      const progress = Math.min(Math.max(-rect.top / totalHeight, 0), 1)

      animationFrameId = requestAnimationFrame(() => {
        setScrollProgress(progress)
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  // Product 1 (Cartridges): 0% to 35%
  const p1Progress = Math.min(Math.max(scrollProgress / 0.35, 0), 1)
  const p1Opacity =
    scrollProgress <= 0.28
      ? Math.min(scrollProgress * 5, 1)
      : Math.max(1 - (scrollProgress - 0.28) / 0.1, 0)
  const p1Scale = 1.05 + p1Progress * 0.25
  const p1Rotate = -4 + p1Progress * 6

  // Product 2 (Papa Volt Wireless Battery): 33% to 68%
  const p2Progress = Math.min(Math.max((scrollProgress - 0.33) / 0.35, 0), 1)
  const p2Opacity =
    scrollProgress > 0.3 && scrollProgress <= 0.64
      ? Math.sin(((scrollProgress - 0.3) / 0.34) * Math.PI)
      : 0
  const p2Scale = 1.05 + p2Progress * 0.2
  const p2Rotate = 3 - p2Progress * 5

  // Product 3 (CNC Adjustable Grip): 66% to 100%
  const p3Progress = Math.min(Math.max((scrollProgress - 0.66) / 0.34, 0), 1)
  const p3Opacity =
    scrollProgress > 0.64
      ? Math.min((scrollProgress - 0.64) * 4, 1)
      : 0
  const p3Scale = 1.05 + p3Progress * 0.2
  const p3Rotate = -3 + p3Progress * 4

  // Determine current active chapter title
  const currentChapter =
    scrollProgress < 0.33
      ? '01 // MICRON NEEDLE METALLURGY'
      : scrollProgress < 0.66
      ? '02 // PAPA VOLT WIRELESS DRIVE'
      : '03 // CNC ERGONOMIC INTERFACE'

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[280vh] bg-transparent select-none"
      aria-label="Apple-Style Multi-Product Scroll Sequence"
    >
      {/* Sticky Fullscreen Stage (Apple Keynote Style) */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Dynamic Studio Ambient Halo */}
        <div
          className="absolute inset-0 transition-opacity duration-700 pointer-events-none"
          style={{
            background:
              scrollProgress < 0.35
                ? 'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(230,179,102,0.18) 0%, transparent 65%)'
                : scrollProgress < 0.68
                ? 'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(56,232,198,0.20) 0%, transparent 65%)'
                : 'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(56,232,198,0.18) 0%, rgba(230,179,102,0.08) 50%, transparent 70%)',
          }}
        />

        {/* Top Swiss Telemetry Markers */}
        <div className="absolute top-24 sm:top-28 left-6 sm:left-12 z-20 font-mono text-[9px] sm:text-[10px] text-zinc-500/70 dark:text-zinc-400/60 pointer-events-none uppercase tracking-widest">
          <div className="flex items-center gap-1.5">
            <span className="text-[#38e8c6]">+</span>
            <span>SPECIFICATION 02 // PRO SEQUENCE</span>
          </div>
          <div className="text-zinc-900 dark:text-white font-bold mt-0.5">
            {currentChapter}
          </div>
        </div>

        <div className="absolute top-24 sm:top-28 right-6 sm:right-12 z-20 font-mono text-[9px] sm:text-[10px] text-zinc-500/70 dark:text-zinc-400/60 pointer-events-none uppercase tracking-widest text-right">
          <span>SEQUENCE DISCOVERY</span>
          <div className="text-[#38e8c6] font-bold mt-0.5">
            {Math.round(scrollProgress * 100)}%
          </div>
        </div>

        {/* ============================================================ */}
        {/* CENTER STAGE: 3-PRODUCT HARDWARE SEQUENCE DISPLAY */}
        {/* ============================================================ */}
        <div className="relative w-full max-w-xl sm:max-w-2xl h-[340px] sm:h-[460px] flex items-center justify-center z-10">
          {/* PRODUCT 1: Papa Premium Needle Cartridges (0% to 35%) */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-all duration-300"
            style={{
              opacity: p1Opacity,
              transform: `scale(${p1Scale}) rotate(${p1Rotate}deg) translateY(${(1 - p1Opacity) * 30}px)`,
              pointerEvents: p1Opacity > 0.5 ? 'auto' : 'none',
            }}
          >
            <img
              src="/product-images/papa-premium-tattoo-cartridges-round-cutout.webp"
              alt="Papa Premium Needle Cartridge"
              className="max-h-[85%] w-auto object-contain drop-shadow-[0_25px_55px_rgba(0,0,0,0.85)]"
            />
            {/* Ground Contact Shadow */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/60 blur-xl rounded-[100%] pointer-events-none" />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-1/2 h-2.5 bg-[#e6b366]/20 blur-md rounded-[100%] pointer-events-none" />
          </div>

          {/* PRODUCT 2: Papa Volt Wireless Battery Pack (33% to 68%) */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-all duration-300"
            style={{
              opacity: p2Opacity,
              transform: `scale(${p2Scale}) rotate(${p2Rotate}deg) translateY(${(1 - p2Opacity) * 30}px)`,
              pointerEvents: p2Opacity > 0.5 ? 'auto' : 'none',
            }}
          >
            <img
              src="/product-images/img_041_papa_volt_large_cutout.webp"
              alt="Papa Volt Wireless Battery System"
              className="max-h-[85%] w-auto object-contain drop-shadow-[0_25px_55px_rgba(0,0,0,0.85)]"
            />
            {/* Ground Contact Shadow */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/60 blur-xl rounded-[100%] pointer-events-none" />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-1/2 h-2.5 bg-[#38e8c6]/25 blur-md rounded-[100%] pointer-events-none" />
          </div>

          {/* PRODUCT 3: Papa CNC Adjustable Grip (66% to 100%) */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-all duration-300"
            style={{
              opacity: p3Opacity,
              transform: `scale(${p3Scale}) rotate(${p3Rotate}deg) translateY(${(1 - p3Opacity) * 30}px)`,
              pointerEvents: p3Opacity > 0.5 ? 'auto' : 'none',
            }}
          >
            <img
              src="/product-images/img_111_papa_adjustment_grips_1__cutout.webp"
              alt="Papa CNC Adjustable Grip"
              className="max-h-[85%] w-auto object-contain drop-shadow-[0_25px_55px_rgba(0,0,0,0.85)]"
            />
            {/* Ground Contact Shadow */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/60 blur-xl rounded-[100%] pointer-events-none" />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-1/2 h-2.5 bg-[#38e8c6]/20 blur-md rounded-[100%] pointer-events-none" />
          </div>
        </div>

        {/* ============================================================ */}
        {/* APPLE-STYLE PROGRESSIVE FLOATING TYPOGRAPHY NARRATIVE */}
        {/* ============================================================ */}

        {/* ACT 1 TYPOGRAPHY: Needle Cartridges (0% - 35%) */}
        <div
          className="absolute bottom-16 sm:bottom-24 left-6 sm:left-16 max-w-md z-20 pointer-events-none transition-all duration-300"
          style={{
            opacity: p1Opacity,
            transform: `translateY(${(1 - p1Opacity) * 20}px)`,
          }}
        >
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/10 text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase">
              <Sparkles className="w-3 h-3" />
              <span>ACT 01 // MICRON NEEDLE ARCHITECTURE</span>
            </div>
            <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-zinc-950 dark:text-white font-['Montserrat',sans-serif]">
              PAPA CARTRIDGES
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              Medical 316L Japanese surgical steel pins welded on automated fixtures. Flexible silicone safety membrane eliminating ink backflow into machine motors.
            </p>
            <div className="pt-2 flex items-center gap-2 font-mono text-xs font-bold text-amber-500">
              <span>62 SIZES</span>
              <span>·</span>
              <span>#12 0.35MM &amp; #10 0.30MM</span>
              <span>·</span>
              <span>BOX OF 20</span>
            </div>
          </div>
        </div>

        {/* ACT 2 TYPOGRAPHY: Papa Volt Wireless Battery (33% - 68%) */}
        <div
          className="absolute top-1/3 right-6 sm:right-16 max-w-md z-20 pointer-events-none transition-all duration-300 text-right"
          style={{
            opacity: p2Opacity,
            transform: `translateY(${(1 - p2Opacity) * 20}px)`,
          }}
        >
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#0d5d50]/20 dark:border-[#38e8c6]/20 bg-[#38e8c6]/10 text-[10px] font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6] uppercase">
              <Zap className="w-3 h-3" />
              <span>ACT 02 // CORD-FREE REVOLUTION</span>
            </div>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-zinc-950 dark:text-white font-['Montserrat',sans-serif]">
              PAPA VOLT POWER
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              Ultra-lightweight lithium battery dock delivering uninterrupted 5–12V clean current for up to 8 continuous hours of tattooing.
            </p>
            <div className="pt-1 flex items-center justify-end gap-2.5 font-mono text-xs font-bold text-[#38e8c6]">
              <span>RCA UNIVERSAL DOCK</span>
              <span>·</span>
              <span>USB-C FAST CHARGE</span>
            </div>
          </div>
        </div>

        {/* ACT 3 TYPOGRAPHY: CNC Adjustable Grips & CTA (66% - 100%) */}
        <div
          className="absolute bottom-16 sm:bottom-24 left-6 sm:left-16 max-w-lg z-20 transition-all duration-300 space-y-4"
          style={{
            opacity: p3Opacity,
            transform: `translateY(${(1 - p3Opacity) * 20}px)`,
            pointerEvents: p3Opacity > 0.5 ? 'auto' : 'none',
          }}
        >
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#0d5d50]/20 dark:border-[#38e8c6]/20 bg-[#38e8c6]/10 text-[10px] font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6] uppercase">
              <Box className="w-3 h-3" />
              <span>ACT 03 // ERGONOMIC ALLOY INTERFACE</span>
            </div>
            <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-zinc-950 dark:text-white font-['Montserrat',sans-serif]">
              CNC ADJUSTABLE GRIPS
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              Machined from solid aerospace 6061 billet with millimeter click-stop projection lock. Shifts weight forward to eliminate wrist fatigue.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/collections"
              search={{ category: 'cartridges' }}
              className="px-6 py-3.5 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-xl"
            >
              <span>Explore 62 Needle Sizes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/collections"
              search={{ category: 'grips' }}
              className="px-6 py-3.5 rounded-full border border-zinc-300 dark:border-white/15 text-xs font-mono font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 hover:border-zinc-500 dark:hover:border-white/30 transition-colors"
            >
              <span>View Grip Lineup</span>
            </Link>
          </div>
        </div>

        {/* Bottom Scroll Indicator Pill */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 font-mono text-[9px] text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-[#38e8c6] animate-pulse" />
          <span>SCROLL TO ADVANCE ARSENAL SEQUENCE</span>
        </div>
      </div>
    </div>
  )
}
