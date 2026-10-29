import React, { useState, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  ShoppingBag,
  Check,
  Activity,
  Cpu,
  Layers,
  Scale,
  Sparkles,
  Volume2,
  ShieldCheck,
} from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { ShopifyProduct } from '../../types/shopify'

interface FinishOption {
  id: string
  label: string
  specimenCode: string
  hex: string
  image: string
  description: string
}

const PEN_V3_FINISHES: FinishOption[] = [
  {
    id: 'stealth-black',
    label: 'Obsidian Black',
    specimenCode: 'PTS-V3-BLK-01',
    hex: '#16171a',
    image: '/product-images/img_113_papa_pen_jet_black_1__cutout.webp',
    description: 'Type III Hard-Anodized Military Matte Obsidian finish with forward gravity bias.',
  },
  {
    id: 'titanium-bronze',
    label: 'Artisan Bronze',
    specimenCode: 'PTS-V3-BRZ-02',
    hex: '#8a6240',
    image: '/product-images/img_124_papa_pen_bronze_1__cutout.webp',
    description: 'Warm artisan bronze alloy finish with satin-brushed grip contours.',
  },
  {
    id: 'anodized-crimson',
    label: 'Anodized Crimson',
    specimenCode: 'PTS-V3-RED-03',
    hex: '#9e1c28',
    image: '/product-images/img_095_papa_pen_red_2__cutout.webp',
    description: 'High-chroma anodized scarlet red with anti-glare studio finish.',
  },
]

interface AnatomyModule {
  id: string
  tag: string
  title: string
  primaryMetric: string
  metricLabel: string
  secondaryMetric: string
  secondaryLabel: string
  summary: string
}

const ANATOMY_MODULES: AnatomyModule[] = [
  {
    id: 'motor',
    tag: '01 / ROTARY CORE',
    title: 'German High-Torque Coreless Motor',
    primaryMetric: '10,500 RPM',
    metricLabel: 'Peak Torque Velocity',
    secondaryMetric: '< 0.02 mm',
    secondaryLabel: 'Needle Cam Play',
    summary:
      'Direct-drive rotary core delivers unwavering penetration force through dense fibrous tissue without thermal stall or voltage sag.',
  },
  {
    id: 'chassis',
    tag: '02 / MONOLITHIC CHASSIS',
    title: '6061-T6 Aerospace Billet Block',
    primaryMetric: '134 g',
    metricLabel: 'Net Apparatus Mass',
    secondaryMetric: '35 µm',
    secondaryLabel: 'Type III Anodized Depth',
    summary:
      'Carved from a continuous billet of 6061-T6 alloy. Seamless unibody housing eliminates resonance frequencies and hand tingling.',
  },
  {
    id: 'balance',
    tag: '03 / ERGONOMIC DYNAMICS',
    title: 'Forward-Biased Center of Gravity',
    primaryMetric: '42%',
    metricLabel: 'Forward Mass Bias',
    secondaryMetric: '33 mm',
    secondaryLabel: 'Pencil Pinch Diameter',
    summary:
      'Weight center shifted deliberately towards the needle tip, naturally leveraging gravity to relieve carpal tendon strain during 8-hour sessions.',
  },
  {
    id: 'cam',
    tag: '04 / NEEDLE CAM INTERFACE',
    title: 'Interchangeable 3.5 - 4.5 mm Stroke Cam',
    primaryMetric: '4.0 mm',
    metricLabel: 'Standard Factory Stroke',
    secondaryMetric: '134 °C',
    secondaryLabel: 'Autoclave Safe Rating',
    summary:
      'Precision ratcheted depth control locking mechanism. Fully detachable front grip section rated for clinical ultrasonic and steam autoclaves.',
  },
]

export const AtelierHeroMonolith: React.FC<{ products?: ShopifyProduct[] }> = ({
  products = [],
}) => {
  const { addToCart, openCart } = useCart()
  const [selectedFinish, setSelectedFinish] = useState<FinishOption>(PEN_V3_FINISHES[0])
  const [activeModule, setActiveModule] = useState<AnatomyModule>(ANATOMY_MODULES[0])
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 })
  const [added, setAdded] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = heroRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100)
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100)
    setGlarePosition({ x, y })
  }

  const handleQuickAdd = () => {
    const penProduct = products.find(p => p.handle === 'papa-pen-v3-black-full-set')
    if (penProduct && penProduct.variants?.edges?.[0]?.node) {
      addToCart(penProduct, penProduct.variants.edges[0].node, 1)
    }
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1400)
    openCart()
  }

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[92dvh] w-full bg-[#08090C] text-white overflow-hidden flex flex-col justify-between select-none py-8 lg:py-12 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08]"
    >
      {/* 1. Volumetric Specular Ambient Light (Tracks Cursor) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none transition-all duration-700 ease-[var(--ease-spring)]"
        style={{
          background: `radial-gradient(circle 650px at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.06) 0%, transparent 70%), radial-gradient(ellipse 80% 60% at 50% 35%, rgba(46, 230, 202, 0.08) 0%, transparent 65%)`,
        }}
      />

      {/* 2. Top Precision Coordinates Ticker */}
      <div className="relative z-20 max-w-7xl 2xl:max-w-[1440px] mx-auto w-full flex items-center justify-between pb-6 border-b border-white/[0.06] text-[11px] font-mono tracking-widest uppercase text-zinc-400">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#2EE6CA] animate-pulse" />
          <span className="text-zinc-200 font-semibold">Nuclear Tattoo Supply</span>
          <span className="text-zinc-600">//</span>
          <span>Atelier Architecture v3.4</span>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-zinc-500">
          <span>SPECIMEN ID: {selectedFinish.specimenCode}</span>
          <span className="text-zinc-700">|</span>
          <span className="text-[#2EE6CA]">GERMAN CORELESS 10,500 RPM</span>
        </div>
      </div>

      {/* 3. Hero Center Stage: Monolith Headline & 3D Specimen */}
      <div className="relative z-10 max-w-7xl 2xl:max-w-[1440px] mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-6 sm:my-10">
        {/* Left Wing (Cols 1-6): Monumental Haute-Couture Typography */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs font-mono text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2EE6CA]" />
            <span>FLAGSHIP MACHINE BUNDLE</span>
            <span className="text-white/20">·</span>
            <span className="text-white font-semibold">5 CARTRIDGE BOXES INCLUDED</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-semibold tracking-[-0.04em] text-white leading-[0.98]">
              Papa Pen V3.
            </h1>
            <p className="text-xl sm:text-2xl text-zinc-300 font-normal tracking-[-0.015em] max-w-lg">
              Machined from a single monolithic billet of aerospace 6061-T6.
            </p>
          </div>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl font-sans">
            Engineered exclusively for tattoo artists who reject compromises. Unyielding torque delivery, zero cam deflection, and forward-biased ergonomics that liberate hand tension.
          </p>

          {/* Anodized Finish Selector */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 max-w-md">
              <span>ANODIZED FINISH: {selectedFinish.label.toUpperCase()}</span>
              <span className="text-[11px] text-zinc-500">{selectedFinish.specimenCode}</span>
            </div>

            <div className="flex items-center gap-3">
              {PEN_V3_FINISHES.map(f => {
                const isSelected = f.id === selectedFinish.id
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFinish(f)}
                    className={`group flex items-center gap-2.5 px-4 py-2 rounded-full border transition-[transform,background-color,border-color,box-shadow] duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-white/15 border-white/40 text-white shadow-[0_2px_14px_rgba(255,255,255,0.12)] scale-105'
                        : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/30"
                      style={{ backgroundColor: f.hex }}
                    />
                    <span className="text-xs font-mono font-medium">{f.label}</span>
                  </button>
                )
              })}
            </div>
            <p className="text-[11px] font-mono text-zinc-500 pt-1">
              {selectedFinish.description}
            </p>
          </div>

          {/* Direct Requisition & PDP Action Bar */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              to="/products/$handle"
              params={{ handle: 'papa-pen-v3-black-full-set' }}
              className="px-8 py-4 rounded-full bg-white text-[#08090C] font-semibold text-xs sm:text-sm inline-flex items-center gap-2.5 hover:bg-zinc-200 transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] shadow-[0_12px_32px_rgba(255,255,255,0.14)]"
            >
              <span>Explore Apparatus &amp; Specs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={handleQuickAdd}
              className={`px-7 py-4 rounded-full text-xs sm:text-sm font-semibold inline-flex items-center gap-2 border transition-[transform,background-color,border-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer ${
                added
                  ? 'bg-emerald-500 text-black border-emerald-400'
                  : 'bg-white/[0.08] hover:bg-white/[0.14] text-white border-white/15'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Studio Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-white/80" />
                  <span>Instant Requisition · $799.95</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Wing (Cols 7-12): Massive Sculptural Exhibition Stage */}
        <div className="lg:col-span-6 relative flex flex-col items-center justify-center min-h-[380px] sm:min-h-[480px]">
          {/* Backlit Focal Halo */}
          <div
            aria-hidden="true"
            className="absolute w-4/5 aspect-square rounded-full bg-radial from-[#2EE6CA]/20 via-white/[0.03] to-transparent blur-3xl pointer-events-none"
          />

          {/* Precision Circular Grid Reticle */}
          <div
            aria-hidden="true"
            className="absolute w-[360px] sm:w-[460px] aspect-square rounded-full border border-white/[0.06] flex items-center justify-center pointer-events-none"
          >
            <div className="w-3/4 aspect-square rounded-full border border-dashed border-white/[0.04]" />
            <div className="absolute inset-x-0 top-1/2 h-px bg-white/[0.05]" />
            <div className="absolute inset-y-0 left-1/2 w-px bg-white/[0.05]" />
          </div>

          {/* Machine Specimen Image with Physics Depth */}
          <div className="relative z-10 w-full flex items-center justify-center">
            <img
              key={selectedFinish.id}
              src={selectedFinish.image}
              alt={`Papa Pen V3 ${selectedFinish.label}`}
              className="max-h-[360px] sm:max-h-[460px] w-auto object-contain drop-shadow-[0_32px_60px_rgba(0,0,0,0.95)] transition-all duration-300 ease-[var(--ease-spring)] hover:scale-[1.04]"
            />
          </div>

          {/* Specimen Ground Pedestal Reflection */}
          <div
            aria-hidden="true"
            className="w-3/5 h-6 bg-black/95 blur-xl rounded-[100%] mt-2 pointer-events-none"
          />
        </div>
      </div>

      {/* 4. Bottom Interactive Hardware Anatomy Strip (4 Modular Pillars) */}
      <div className="relative z-20 max-w-7xl 2xl:max-w-[1440px] mx-auto w-full pt-8 border-t border-white/[0.08]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#2EE6CA]">
              LIVE ANATOMY EXPLORER
            </span>
            <h3 className="text-lg font-semibold text-white tracking-tight">
              Select Subsystem to Inspect Micrometer Tolerances
            </h3>
          </div>

          {/* 4 Module Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {ANATOMY_MODULES.map(mod => {
              const isActive = mod.id === activeModule.id
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => setActiveModule(mod)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#08090C] font-semibold shadow-[0_2px_12px_rgba(255,255,255,0.15)]'
                      : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  {mod.tag.split('/')[1]?.trim() || mod.id}
                </button>
              )
            })}
          </div>
        </div>

        {/* Selected Module Detail Panel */}
        <div className="p-6 sm:p-8 rounded-[24px] bg-[#0E1014] border border-white/[0.08] grid grid-cols-1 lg:grid-cols-12 gap-6 items-center shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
          <div className="lg:col-span-6 space-y-2">
            <span className="text-[11px] font-mono text-[#2EE6CA] uppercase tracking-wider block">
              {activeModule.tag}
            </span>
            <h4 className="text-xl sm:text-2xl font-semibold text-white tracking-[-0.02em]">
              {activeModule.title}
            </h4>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
              {activeModule.summary}
            </p>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4 font-mono">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-2xl sm:text-3xl font-semibold text-white block tabular-nums">
                {activeModule.primaryMetric}
              </span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mt-1">
                {activeModule.metricLabel}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-2xl sm:text-3xl font-semibold text-white block tabular-nums">
                {activeModule.secondaryMetric}
              </span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mt-1">
                {activeModule.secondaryLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
