import React, { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ModelViewer3D } from '../components/common/ModelViewer3D'
import { ParallaxApparatusStage } from '../components/common/ParallaxApparatusStage'
import { useCart } from '../context/CartContext'
import { ShopifyProduct } from '../types/shopify'
import { getProductByHandle } from '../lib/shopify'
import {
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Box,
  Truck,
  FileCheck2,
  ChevronDown,
  Award,
  Zap,
} from 'lucide-react'

export const HomePage: React.FC = () => {
  const { addToCart, openCart } = useCart()
  const [penProduct, setPenProduct] = useState<ShopifyProduct | null>(null)

  useEffect(() => {
    async function loadCoreProducts() {
      try {
        const pen = await getProductByHandle('papa-pen-v2-1')
        if (pen) setPenProduct(pen)
      } catch (err) {
        console.error('Failed to load homepage core products:', err)
      }
    }
    loadCoreProducts()
  }, [])

  const handleBuyPen = () => {
    if (penProduct && penProduct.variants?.edges?.[0]?.node) {
      addToCart(penProduct, penProduct.variants.edges[0].node, 1)
      openCart()
    }
  }

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="w-full bg-transparent text-zinc-900 dark:text-zinc-100 font-sans select-none overflow-x-hidden">
      {/* ============================================================ */}
      {/* ACT 1: HERO - PAPA PEN V2 3D GRAND CENTERED STAGE */}
      {/* ============================================================ */}
      <section className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center pt-16 pb-16 sm:pt-20 sm:pb-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        {/* Background Architectural Typographic Monument (Apple Keynote Style) */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] font-black uppercase tracking-tighter text-zinc-950/[0.035] dark:text-white/[0.03] pointer-events-none select-none whitespace-nowrap font-['Montserrat',sans-serif] z-0"
        >
          PAPA PEN
        </div>

        {/* Ambient Radial Spotlight */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1000px] h-[400px] sm:h-[600px] bg-[radial-gradient(circle,rgba(56,232,198,0.18)_0%,transparent_65%)] pointer-events-none z-0" />

        {/* Hero Header & Narrative */}
        <div className="max-w-3xl space-y-3 relative z-10 mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] text-[10px] font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6] uppercase tracking-widest backdrop-blur-md shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0d5d50] dark:bg-[#38e8c6] animate-pulse" />
            <span>PAPA TATTOO APPARATUS · THE BENCHMARK</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-zinc-950 dark:text-white font-['Montserrat',sans-serif] leading-none">
            PAPA PEN V2
          </h1>

          <p className="text-base sm:text-xl font-medium text-zinc-600 dark:text-zinc-300 font-sans max-w-lg mx-auto tracking-tight">
            Engineered for mastery. Driven by precision.
          </p>

          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-sans max-w-md mx-auto leading-relaxed">
            Continuous-drive rotary machine with custom German coreless motor. Fixed 3.5mm stroke for zero-vibration line work and dense color packing.
          </p>
        </div>

        {/* 3D Auto-Rotating Hero Apparatus Stage (Grand Centered Centerpiece) */}
        <div className="relative w-full max-w-3xl h-[360px] sm:h-[460px] lg:h-[500px] flex items-center justify-center z-10 my-3">
          {/* 3D Drag To Rotate Badge */}
          <div className="absolute top-2 sm:top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 dark:bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-mono font-medium text-white pointer-events-none shadow-sm">
            <Box className="w-3 h-3 text-[#38e8c6]" />
            <span>3D INTERACTIVE · DRAG TO ROTATE</span>
          </div>

          <ModelViewer3D
            src="/models/papapenv2.glb"
            poster="/product-images/img_113_papa_pen_jet_black_1__cutout.webp"
            alt="Papa Pen V2 Precision Rotary Machine"
            className="w-full h-full"
            autoRotate={true}
            cameraOrbit="35deg 82deg 2.0m"
            fieldOfView="28deg"
          />

          {/* Grounded Pedestal Contact Shadow with Specular Reflection Halo */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3/4 max-w-sm h-6 bg-black/60 dark:bg-black/90 blur-2xl rounded-[100%] pointer-events-none" />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-1/2 max-w-xs h-2.5 bg-[#38e8c6]/20 blur-md rounded-[100%] pointer-events-none" />
        </div>

        {/* Action Buttons & Bottom Spec Anchors */}
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleBuyPen}
              className="px-8 py-3.5 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-mono font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-xl cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>BUY NOW — $199.00 USD</span>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('showcase-cartridges')}
              className="px-7 py-3.5 rounded-full border border-zinc-300/80 dark:border-white/15 hover:border-zinc-500 dark:hover:border-white/30 text-xs font-mono font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 bg-white/40 dark:bg-white/[0.02] backdrop-blur-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Arsenal ↓</span>
            </button>
          </div>

          {/* Quick Engineering Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-1 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#0d5d50] dark:bg-[#38e8c6]" />
              <span>3.5mm Direct Stroke</span>
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">·</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#0d5d50] dark:bg-[#38e8c6]" />
              <span>German Coreless Motor</span>
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">·</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#0d5d50] dark:bg-[#38e8c6]" />
              <span>150g Balanced Ergonomics</span>
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* ACT 2: PAPA PREMIUM NEEDLE CARTRIDGES (FULL-PAGE CINEMATIC SHOWCASE) */}
      {/* ============================================================ */}
      <section
        id="showcase-cartridges"
        className="min-h-[85vh] flex items-center py-24 sm:py-36 px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1536px] mx-auto relative"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/10 text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                <Sparkles className="w-3 h-3" />
                <span>01 // MICRON NEEDLE METALLURGY</span>
              </div>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-zinc-950 dark:text-white font-['Montserrat',sans-serif]">
                PAPA CARTRIDGES
              </h2>
              <p className="text-xs font-mono uppercase tracking-wider text-amber-500 font-bold">
                JAPANESE 316L SURGICAL STEEL PINS · MEMBRANE SEALED
              </p>
            </div>

            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              Engineered on automated precision fixtures to eliminate needle deflection. Flexible silicone safety membrane eliminates ink backflow into machine motors. 62 configurations across Round Liner, Shader, Magnum, and Curved Magnum.
            </p>

            {/* Spec Matrix Grid */}
            <div className="grid grid-cols-3 gap-4 py-4 border-y border-zinc-200/80 dark:border-white/[0.08] text-center font-mono">
              <div className="space-y-0.5">
                <div className="text-base sm:text-lg font-black text-zinc-950 dark:text-white">62 Sizes</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">RL · RS · M1 · M1C</div>
              </div>
              <div className="space-y-0.5 border-x border-zinc-200/80 dark:border-white/[0.08]">
                <div className="text-base sm:text-lg font-black text-zinc-950 dark:text-white">316L</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">Surgical Steel</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-base sm:text-lg font-black text-zinc-950 dark:text-white">Box of 20</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">Sterile Blister</div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/products/$handle"
                params={{ handle: 'papa-premium-tattoo-cartridges' }}
                className="px-8 py-4 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-mono font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-xl"
              >
                <span>Select from 62 Sizes</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-xs font-mono font-bold text-zinc-500">
                FROM $25.00 USD
              </span>
            </div>
          </div>

          {/* Right Visual Column (Apple Scroll Parallax Apparatus Stage) */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <ParallaxApparatusStage
              imageSrc="/product-images/papa-premium-tattoo-cartridges-round-cutout.webp"
              alt="Papa Premium Needle Cartridge"
              accentColor="amber"
              baseRotation={-8}
              priorityTag="316L SURGICAL PIN MATRIX"
            />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* ACT 3: PAPA VOLT WIRELESS POWER DOCK (FULL-PAGE CINEMATIC SHOWCASE) */}
      {/* ============================================================ */}
      <section className="min-h-[85vh] flex items-center py-24 sm:py-36 px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1536px] mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
          {/* Left Visual Column (Apple Scroll Parallax Apparatus Stage) */}
          <div className="lg:col-span-6 order-2 lg:order-1 flex items-center justify-center">
            <ParallaxApparatusStage
              imageSrc="/product-images/img_041_papa_volt_large_cutout.webp"
              alt="Papa Volt Wireless Battery Dock"
              accentColor="cyan"
              baseRotation={6}
              priorityTag="CORD-FREE 5-12V CLEAN POWER"
            />
          </div>

          {/* Right Text Column */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#0d5d50]/20 dark:border-[#38e8c6]/20 bg-[#38e8c6]/10 text-[10px] font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6] uppercase tracking-widest">
                <Zap className="w-3 h-3" />
                <span>02 // CORD-FREE CONTINUOUS REVOLUTION</span>
              </div>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-zinc-950 dark:text-white font-['Montserrat',sans-serif]">
                PAPA VOLT POWER
              </h2>
              <p className="text-xs font-mono uppercase tracking-wider text-[#0d5d50] dark:text-[#38e8c6] font-bold">
                UNINTERRUPTED 5–12V CLEAN CURRENT DRIVE
              </p>
            </div>

            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              Ultra-compact, lightweight lithium battery dock engineered with universal RCA fitment. Delivers up to 8 continuous hours of regulated, low-ripple voltage without tethering cables.
            </p>

            {/* Spec Matrix Grid */}
            <div className="grid grid-cols-3 gap-4 py-4 border-y border-zinc-200/80 dark:border-white/[0.08] text-center font-mono">
              <div className="space-y-0.5">
                <div className="text-base sm:text-lg font-black text-zinc-950 dark:text-white">2,000 mAh</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">Lithium Cell</div>
              </div>
              <div className="space-y-0.5 border-x border-zinc-200/80 dark:border-white/[0.08]">
                <div className="text-base sm:text-lg font-black text-zinc-950 dark:text-white">5V – 12V</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">Regulated Output</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-base sm:text-lg font-black text-zinc-950 dark:text-white">USB-C</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">Fast Charge</div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/collections"
                search={{ category: 'accessories', q: 'Volt' }}
                className="px-8 py-4 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-mono font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-xl"
              >
                <span>Shop Papa Volt Battery</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* ACT 4: CNC ADJUSTABLE GRIPS (FULL-PAGE CINEMATIC SHOWCASE) */}
      {/* ============================================================ */}
      <section className="min-h-[85vh] flex items-center py-24 sm:py-36 px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1536px] mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-white/[0.04] text-[10px] font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6] uppercase tracking-widest">
                <Box className="w-3 h-3" />
                <span>03 // CNC 6061 AIRCRAFT INTERFACE</span>
              </div>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-zinc-950 dark:text-white font-['Montserrat',sans-serif]">
                ADJUSTABLE GRIPS
              </h2>
              <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-bold">
                MILLIMETER CLICK-STOP PROJECTION LOCKING
              </p>
            </div>

            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              Machined from solid aerospace 6061-T6 aluminum billet with non-slip knurled geometry. Ergonomically shifts machine weight forward to eliminate wrist strain during multi-hour marathon sessions.
            </p>

            {/* Spec Matrix Grid */}
            <div className="grid grid-cols-3 gap-4 py-4 border-y border-zinc-200/80 dark:border-white/[0.08] text-center font-mono">
              <div className="space-y-0.5">
                <div className="text-base sm:text-lg font-black text-zinc-950 dark:text-white">6061-T6</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">Anodized Billet</div>
              </div>
              <div className="space-y-0.5 border-x border-zinc-200/80 dark:border-white/[0.08]">
                <div className="text-base sm:text-lg font-black text-zinc-950 dark:text-white">Click-Stop</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">Needle Dial</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-base sm:text-lg font-black text-zinc-950 dark:text-white">100%</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">Autoclavable</div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/collections"
                search={{ category: 'grips' }}
                className="px-8 py-4 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-mono font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-xl"
              >
                <span>Explore Grip Lineup</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Visual Column (Apple Scroll Parallax Apparatus Stage) */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <ParallaxApparatusStage
              imageSrc="/product-images/img_111_papa_adjustment_grips_1__cutout.webp"
              alt="Papa CNC Adjustable Grip"
              accentColor="emerald"
              baseRotation={-6}
              priorityTag="6061-T6 AIRCRAFT ALLOY"
            />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* ACT 5: STUDIO HARDWARE & BALLISTIC PROTECTION */}
      {/* ============================================================ */}
      <section className="py-24 sm:py-36 px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1536px] mx-auto">
        <div className="rounded-3xl bg-zinc-100/60 dark:bg-white/[0.03] backdrop-blur-xs p-8 sm:p-14 overflow-hidden relative shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="text-[10px] font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6] uppercase tracking-widest">
                04 // BALLISTIC PROTECTION &amp; 360° ACTUATION
              </div>
              <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-zinc-950 dark:text-white font-['Montserrat',sans-serif]">
                HEAVY-DUTY TRAVEL CASE &amp; FOOT PEDAL
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                Rigid EVA ballistic outer shell custom cutout for 2 machines, power supplies, cords, and cartridges, paired with weighted cast-metal 360° omnidirectional foot switch.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/products/$handle"
                  params={{ handle: 'papa-travel-case' }}
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#0d5d50] dark:text-[#38e8c6] hover:underline"
                >
                  <span>Travel Case Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-zinc-300 dark:text-zinc-700">·</span>
                <Link
                  to="/products/$handle"
                  params={{ handle: 'papa-foot-pedal' }}
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#0d5d50] dark:text-[#38e8c6] hover:underline"
                >
                  <span>360° Foot Switch</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 flex items-center justify-center">
              <ParallaxApparatusStage
                imageSrc="/product-images/img_201_papa_travel_case_cutout.webp"
                alt="Papa Travel Case"
                accentColor="cyan"
                baseRotation={4}
                priorityTag="BALLISTIC EVA CASE & HARDWARE"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* ACT 6: GLOBAL STUDIO STANDARDS & PRO TEAM ROSTER */}
      {/* ============================================================ */}
      <section className="py-24 sm:py-36 px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1536px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="text-[10px] font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6] uppercase tracking-widest">
            + GLOBAL DISPATCH &amp; QUALITY ASSURANCE
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-zinc-950 dark:text-white font-['Montserrat',sans-serif]">
            STUDIO &amp; WHOLESALE NETWORK
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
            Direct central manufacturing distribution to verified tattoo studios, resident artists, and supply retailers worldwide.
          </p>
        </div>

        {/* 3 Modern Minimalist Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <div className="rounded-3xl bg-zinc-100/50 dark:bg-white/[0.03] p-8 space-y-4">
            <Truck className="w-6 h-6 text-[#0d5d50] dark:text-[#38e8c6]" />
            <h4 className="text-lg font-bold uppercase text-zinc-950 dark:text-white font-sans">
              40+ COUNTRIES DISPATCH
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              Express international air logistics with dedicated customs clearance for tattoo studios across the US, EU, UK, Canada, and Australia.
            </p>
          </div>

          <div className="rounded-3xl bg-zinc-100/50 dark:bg-white/[0.03] p-8 space-y-4">
            <FileCheck2 className="w-6 h-6 text-amber-500" />
            <h4 className="text-lg font-bold uppercase text-zinc-950 dark:text-white font-sans">
              STERILE BATCH AUDIT
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              Manufactured in Class 100,000 cleanrooms. 100% individual EO Gas blister packed with verifiable batch indicators.
            </p>
          </div>

          <div className="rounded-3xl bg-zinc-100/50 dark:bg-white/[0.03] p-8 space-y-4">
            <Award className="w-6 h-6 text-[#0d5d50] dark:text-[#38e8c6]" />
            <h4 className="text-lg font-bold uppercase text-zinc-950 dark:text-white font-sans">
              PRO TEAM ROSTER
            </h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              Sponsored international resident artists creating world-class black &amp; grey, realism, and traditional work on Papa apparatus.
            </p>
            <div className="pt-2">
              <Link
                to="/sponsorship-artists"
                className="text-xs font-mono font-bold uppercase text-[#0d5d50] dark:text-[#38e8c6] hover:underline inline-flex items-center gap-1"
              >
                <span>Meet Sponsored Artists</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
