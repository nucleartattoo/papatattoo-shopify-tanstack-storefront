import React, { useEffect, useState, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { ShopifyProduct } from '../types/shopify'
import { getProducts, getProductByHandle } from '../lib/shopify'
import { ProductCard } from '../components/product/ProductCard'
import { ModelViewer3D } from '../components/common/ModelViewer3D'
import { AppleScrollytelling } from '../components/common/AppleScrollytelling'
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Box,
  Layers,
  ChevronRight,
  Sliders,
  CheckCircle2,
  PackageCheck,
  Compass,
  FileCheck2,
  Activity,
  Cpu,
  CircleDot,
} from 'lucide-react'

interface TimelineNodeProps {
  epochNumber: string
  epochYear: string
  title: string
  subtitle: string
  description: string
  specs: { label: string; value: string }[]
  ctaText: string
  ctaLink: string
  align: 'left' | 'right'
  visualContent: React.ReactNode
  products?: ShopifyProduct[]
}

const TimelineNode: React.FC<TimelineNodeProps> = ({
  epochNumber,
  epochYear,
  title,
  subtitle,
  description,
  specs,
  ctaText,
  ctaLink,
  align,
  visualContent,
  products,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const nodeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.15 }
    )

    if (nodeRef.current) {
      observer.observe(nodeRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const isLeft = align === 'left'

  return (
    <div
      ref={nodeRef}
      className={`relative py-20 sm:py-28 lg:py-36 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-20'
      }`}
    >
      {/* Central Laser Timeline Node Beacon */}
      <div className="hidden lg:flex absolute left-1/2 top-20 -translate-x-1/2 z-20 items-center justify-center">
        <div className="relative flex items-center justify-center">
          <span className="w-5 h-5 rounded-full bg-[#2ee6ca]/20 animate-ping absolute" />
          <span className="w-3.5 h-3.5 rounded-full bg-[#2ee6ca] shadow-[0_0_12px_#2ee6ca] border-2 border-[#07080a]" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        {/* Left Column (Content or Visual depending on alignment) */}
        <div
          className={`lg:col-span-6 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isLeft ? 'lg:order-1' : 'lg:order-2'
          } ${
            isVisible
              ? 'opacity-100 translate-x-0 scale-100'
              : isLeft
              ? 'opacity-0 -translate-x-12 scale-95'
              : 'opacity-0 translate-x-12 scale-95'
          }`}
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200/80 dark:border-white/[0.1] bg-white dark:bg-white/[0.04] text-[10px] font-mono font-bold text-[#0d9488] dark:text-[#2ee6ca] uppercase tracking-widest">
                <CircleDot className="w-2.5 h-2.5 text-[#0d9488] dark:text-[#2ee6ca]" />
                <span>{epochNumber} · {epochYear}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-zinc-950 dark:text-white font-['Montserrat',sans-serif]">
                {title}
              </h2>

              <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {subtitle}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              {description}
            </p>

            {/* Spec Matrix Grid - Clean Borderless Layout */}
            <div className="grid grid-cols-3 gap-4 py-3 text-center font-mono">
              {specs.map((s) => (
                <div key={s.label} className="space-y-0.5">
                  <div className="text-base sm:text-lg font-black text-zinc-950 dark:text-white tracking-tight">{s.value}</div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                to={ctaLink}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-white/90 font-mono font-bold text-xs uppercase tracking-wider active:scale-95 transition-all shadow-md"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Seamless Sculptural Visual Stage (Chiaroscuro Pedestal & Swiss Micro-Graticule) */}
        <div
          className={`lg:col-span-6 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isLeft ? 'lg:order-2' : 'lg:order-1'
          } ${
            isVisible
              ? 'opacity-100 translate-x-0 scale-100 rotate-0'
              : isLeft
              ? 'opacity-0 translate-x-14 scale-90 rotate-2'
              : 'opacity-0 -translate-x-14 scale-90 -rotate-2'
          }`}
        >
          <div className="relative w-full flex items-center justify-center p-4 sm:p-8 group/stage min-h-[340px] sm:min-h-[420px]">
            {/* 1. Volumetric Chiaroscuro Studio Spotlight */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_50%_45%,rgba(56,232,198,0.22)_0%,rgba(56,232,198,0.03)_50%,transparent_70%)] pointer-events-none" />

            {/* 2. Precision Swiss Micro-Graticule Architectural Datum */}
            <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 font-mono text-[9px] text-zinc-500/60 dark:text-zinc-400/50 pointer-events-none uppercase tracking-widest">
              <span className="text-[#38e8c6]">+</span>
              <span>DATUM // {epochNumber}</span>
            </div>

            <div className="absolute top-2 right-2 z-10 font-mono text-[9px] text-zinc-500/60 dark:text-zinc-400/50 pointer-events-none uppercase tracking-widest">
              TOLERANCE ±0.005mm
            </div>

            <div className="absolute bottom-2 left-2 z-10 font-mono text-[9px] text-zinc-500/60 dark:text-zinc-400/50 pointer-events-none uppercase tracking-widest hidden sm:block">
              METRIC SPEC // 316L &amp; CNC 6061
            </div>

            <div className="absolute bottom-2 right-2 z-10 font-mono text-[9px] text-zinc-500/60 dark:text-zinc-400/50 pointer-events-none tracking-tighter hidden sm:block">
              |··· 25mm ···|··· 50mm ···|
            </div>

            {/* 3. The Floating Hardware Visual Content */}
            <div className="relative z-10 w-full flex items-center justify-center">
              {visualContent}
            </div>

            {/* 4. Elliptical Pedestal Contact Shadow with Specular Reflection Halo */}
            <div className="absolute bottom-1 sm:bottom-2 left-1/2 -translate-x-1/2 w-3/4 max-w-sm h-6 bg-black/60 dark:bg-black/80 blur-xl rounded-[100%] pointer-events-none" />
            <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 w-1/2 max-w-xs h-2.5 bg-[#38e8c6]/20 blur-md rounded-[100%] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Embedded Product Cards under timeline node */}
      {products && products.length > 0 && (
        <div
          className={`mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}

export const PapaProductsPage: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [premiumCartridge, setPremiumCartridge] = useState<ShopifyProduct | null>(null)
  const [standardCartridge, setStandardCartridge] = useState<ShopifyProduct | null>(null)
  const [machines, setMachines] = useState<ShopifyProduct[]>([])
  const [grips, setGrips] = useState<ShopifyProduct[]>([])
  const [studioGear, setStudioGear] = useState<ShopifyProduct[]>([])

  // Track laser timeline scroll height progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min(Math.max((scrollY / (docHeight || 1)) * 100, 0), 100)
      setScrollProgress(progress)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    async function loadCatalog() {
      try {
        const [allProds, pPremium, pStandard] = await Promise.all([
          getProducts({ first: 60 }),
          getProductByHandle('papa-premium-tattoo-cartridges'),
          getProductByHandle('papa-standard-tattoo-cartridges'),
        ])

        if (pPremium) setPremiumCartridge(pPremium)
        if (pStandard) setStandardCartridge(pStandard)

        const foundMachines = allProds.filter(p => {
          const t = p.title.toLowerCase()
          return (t.includes('pen') || t.includes('machine') || p.handle.includes('pen')) && !t.includes('grip')
        })
        setMachines(foundMachines.slice(0, 4))

        const foundGrips = allProds.filter(p => {
          const t = p.title.toLowerCase()
          return t.includes('grip')
        })
        setGrips(foundGrips.slice(0, 4))

        const foundGear = allProds.filter(p => {
          const t = p.title.toLowerCase()
          return t.includes('case') || t.includes('pedal') || t.includes('cord') || t.includes('power') || t.includes('tray')
        })
        setStudioGear(foundGear.slice(0, 4))
      } catch (err) {
        console.error('Failed to load Papa products catalog:', err)
      } finally {
        setLoading(false)
      }
    }
    loadCatalog()
  }, [])

  const scrollToEpoch = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#20222a] text-zinc-900 dark:text-zinc-100 font-sans pb-32 relative overflow-hidden transition-colors duration-300 art-aurora-bg">
      {/* 2. Hero Monograph Header */}
      <section className="relative overflow-hidden pt-20 pb-12 sm:pt-28 sm:pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(46,230,202,0.12)_0%,transparent_65%)] pointer-events-none" />

        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-950 dark:text-white uppercase font-['Montserrat',sans-serif]">
            PAPA PRODUCTS
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
            From surgical needle metallurgy to precision continuous rotary machines. Explore the chronological evolution of official Papa Tattoo Supply apparatus.
          </p>

          {/* Quick Epoch Navigation Pills */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={() => scrollToEpoch('epoch-cartridges')}
              className="px-3.5 py-1.5 rounded-full border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-white/[0.04] hover:border-[#0d9488] dark:hover:border-[#2ee6ca] text-[11px] font-mono text-zinc-700 dark:text-zinc-300 hover:text-[#0d9488] dark:hover:text-[#2ee6ca] transition-all cursor-pointer shadow-xs"
            >
              EPOCH 01 · CARTRIDGES
            </button>
            <button
              onClick={() => scrollToEpoch('epoch-machines')}
              className="px-3.5 py-1.5 rounded-full border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-white/[0.04] hover:border-[#0d9488] dark:hover:border-[#2ee6ca] text-[11px] font-mono text-zinc-700 dark:text-zinc-300 hover:text-[#0d9488] dark:hover:text-[#2ee6ca] transition-all cursor-pointer shadow-xs"
            >
              EPOCH 02 · ROTARY (3D)
            </button>
            <button
              onClick={() => scrollToEpoch('epoch-grips')}
              className="px-3.5 py-1.5 rounded-full border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-white/[0.04] hover:border-[#0d9488] dark:hover:border-[#2ee6ca] text-[11px] font-mono text-zinc-700 dark:text-zinc-300 hover:text-[#0d9488] dark:hover:text-[#2ee6ca] transition-all cursor-pointer shadow-xs"
            >
              EPOCH 03 · GRIPS
            </button>
            <button
              onClick={() => scrollToEpoch('epoch-gear')}
              className="px-3.5 py-1.5 rounded-full border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-white/[0.04] hover:border-[#0d9488] dark:hover:border-[#2ee6ca] text-[11px] font-mono text-zinc-700 dark:text-zinc-300 hover:text-[#0d9488] dark:hover:text-[#2ee6ca] transition-all cursor-pointer shadow-xs"
            >
              EPOCH 04 · HARDWARE
            </button>
          </div>
        </div>
      </section>

      {/* 3. DYNAMIC LASER TIMELINE STAGE */}
      <div className="relative max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Central Vertical Glowing Laser Line Track */}
        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-0.5 z-0 pointer-events-none">
          {/* Inactive Base Rail */}
          <div className="w-full h-full bg-zinc-200 dark:bg-white/[0.08]" />
          {/* Active Laser Flow Line that extends with scroll */}
          <div
            className="w-full bg-[#0d9488] dark:bg-[#2ee6ca] absolute top-0 shadow-[0_0_12px_#2ee6ca] transition-all duration-300 ease-out"
            style={{ height: `${Math.min(scrollProgress * 1.25, 100)}%` }}
          />
        </div>

        {/* NODE 01: NEEDLE CARTRIDGES */}
        <div id="epoch-cartridges">
          <TimelineNode
            epochNumber="EPOCH 01"
            epochYear="METALLURGY"
            title="MICRON CARTRIDGE METALLURGY"
            subtitle="JAPANESE 316L SURGICAL PINS · MEMBRANE SEALED"
            description="Engineered on continuous automated precision fixtures to eliminate needle deflection. Certified medical-grade PC housing with flexible silicone safety membrane preventing ink backflow into the machine chassis."
            specs={[
              { label: 'Surgical Steel', value: '316L' },
              { label: 'Safety Seal', value: 'Membrane' },
              { label: 'Sterile Box', value: '20 PCS' },
            ]}
            ctaText="Configure Needles (62 Sizes)"
            ctaLink="/products/papa-premium-tattoo-cartridges"
            align="left"
            visualContent={
              <div className="relative w-full h-[320px] sm:h-[400px] flex items-center justify-center p-4">
                <img
                  src="/product-images/papa-premium-tattoo-cartridges-round-cutout.webp"
                  alt="Papa Premium Needle Cartridge"
                  className="max-h-[85%] w-auto object-contain drop-shadow-[0_24px_45px_rgba(0,0,0,0.85)] scale-125 group-hover/stage:scale-135 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-mono text-[#2ee6ca]">
                  316L STAINLESS TIP
                </div>
              </div>
            }
            products={
              [premiumCartridge, standardCartridge].filter(Boolean) as ShopifyProduct[]
            }
          />
        </div>

        {/* NODE 02: ROTARY MACHINES (APPLE SCROLLYTELLING 3D EXPERIENCE) */}
        <div id="epoch-machines" className="py-12 sm:py-20 relative">
          <AppleScrollytelling />

          {/* Machine Lineup Grid under Scrollytelling */}
          {machines.length > 0 && (
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
              {machines.map(m => (
                <ProductCard key={m.id} product={m} />
              ))}
            </div>
          )}
        </div>

        {/* NODE 03: ADJUSTABLE GRIPS */}
        <div id="epoch-grips">
          <TimelineNode
            epochNumber="EPOCH 03"
            epochYear="ERGONOMIC INTERFACE"
            title="AEROSPACE CNC ADJUSTABLE GRIPS"
            subtitle="KNURLED ANODIZED ALLOY · CLICK-STOP PROJECTION"
            description="Precision threaded millimeter depth adjustment with tactile click-stop locking. Ergonomic contouring shifts the center of gravity forward, significantly reducing hand fatigue during multi-hour marathon tattoo sessions."
            specs={[
              { label: 'Machined Alloy', value: 'CNC 6061' },
              { label: 'Adjustment', value: 'Click-Stop' },
              { label: 'Autoclavable', value: '100% Yes' },
            ]}
            ctaText="Explore Grip Series"
            ctaLink="/collections?category=grips"
            align="left"
            visualContent={
              <div className="relative w-full h-[320px] sm:h-[400px] flex items-center justify-center p-4">
                <img
                  src="/product-images/img_111_papa_adjustment_grips_1__cutout.webp"
                  alt="Papa CNC Adjustable Grip"
                  className="max-h-[85%] w-auto object-contain drop-shadow-[0_24px_45px_rgba(0,0,0,0.85)] scale-125 group-hover/stage:scale-135 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-mono text-[#2ee6ca]">
                  MILLIMETER CLICK LOCK
                </div>
              </div>
            }
            products={grips}
          />
        </div>

        {/* NODE 04: STUDIO GEAR */}
        <div id="epoch-gear">
          <TimelineNode
            epochNumber="EPOCH 04"
            epochYear="HEAVY APPARATUS"
            title="STUDIO HARDWARE &amp; LOGISTICS"
            subtitle="360° OMNIDIRECTIONAL PEDALS · BALLISTIC TRAVEL SYSTEMS"
            description="Heavy-duty weighted cast metal foot switches with non-skid silicone base, paired with custom foam-cut ballistic EVA travel cases built for resident artists and international convention travel."
            specs={[
              { label: 'Foot Actuation', value: '360°' },
              { label: 'Case Material', value: 'EVA Shell' },
              { label: 'Worldwide Export', value: '40+ Countries' },
            ]}
            ctaText="View Studio Supplies"
            ctaLink="/collections?category=all"
            align="right"
            visualContent={
              <div className="relative w-full h-[320px] sm:h-[400px] flex items-center justify-center p-4">
                <img
                  src="/product-images/img_201_papa_travel_case_cutout.webp"
                  alt="Papa Heavy-Duty Travel Case"
                  className="max-h-[85%] w-auto object-contain drop-shadow-[0_24px_45px_rgba(0,0,0,0.85)] scale-125 group-hover/stage:scale-135 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-mono text-[#2ee6ca]">
                  STUDIO HEAVY GEAR
                </div>
              </div>
            }
            products={studioGear}
          />
        </div>
      </div>
    </div>
  )
}
