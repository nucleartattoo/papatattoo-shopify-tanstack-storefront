import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Sparkles,
  ShoppingBag,
} from 'lucide-react'

interface NeedleFamily {
  code: string
  name: string
  role: string
  spec: string
  taper: string
  pinCount: string
  image: string
}

const NEEDLE_CONFIG_FAMILIES: NeedleFamily[] = [
  {
    code: 'RL',
    name: 'Round Liner',
    role: 'Crisp Single-Pass Outlines',
    spec: 'Tight circular grouping with micro-welded stabilization pin to prevent wobble.',
    taper: 'Long Taper (7.0 mm)',
    pinCount: '0.25 - 0.35 mm (#08, #10, #12)',
    image: '/product-images/papa-premium-tattoo-cartridges-round-cutout.webp',
  },
  {
    code: 'RS',
    name: 'Round Shader',
    role: 'Soft Shading & Lettering Fill',
    spec: 'Parallel cylindrical pin matrix for smooth ink delivery and gradual density.',
    taper: 'Medium Taper (3.5 mm)',
    pinCount: '0.30 - 0.35 mm (#10, #12)',
    image: '/product-images/img_002_papa-cartridges-needles-round_cutout.webp',
  },
  {
    code: 'M1',
    name: 'Weaved Magnum',
    role: 'Heavy Color Packing & Solid Black',
    spec: 'Dual-row alternating array maximizing ink retention without tearing skin tissue.',
    taper: 'Medium Taper (3.5 mm)',
    pinCount: '0.30 - 0.35 mm (Up to 27 Mag)',
    image: '/product-images/img_001_papa-cartridges-needles-magnum_cutout.webp',
  },
  {
    code: 'M1C',
    name: 'Curved Magnum',
    role: 'Seamless Whip Shading & Blending',
    spec: 'Arched curvature matches needle sweep angle to eliminate harsh edge tracking.',
    taper: 'Long Taper (5.5 mm)',
    pinCount: '0.30 - 0.35 mm (#10, #12)',
    image: '/product-images/img_005_papa_cartridges2_cutout.webp',
  },
]

export const AtelierNeedleChamber: React.FC = () => {
  const [activeNeedleIndex, setActiveNeedleIndex] = useState(0)
  const activeNeedle = NEEDLE_CONFIG_FAMILIES[activeNeedleIndex] || NEEDLE_CONFIG_FAMILIES[0]

  return (
    <section
      id="showcase-cartridges"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1440px] mx-auto text-zinc-100"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[11px] font-mono tracking-widest text-zinc-400 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2EE6CA]" />
            <span>Japanese 316L Metallurgy</span>
            <span className="text-zinc-600">/</span>
            <span>Cleanroom Class 100,000</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.035em] text-white leading-tight">
            Papa 316L Cartridge Chamber.
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
            Automated micro-soldering fixtures eliminate pin deflection. Japanese 316L surgical steel combined with an internal medical silicone membrane prevents ink backflow into rotary motors.
          </p>
        </div>

        <Link
          to="/products/$handle"
          params={{ handle: 'papa-premium-tattoo-cartridges' }}
          className="px-6 py-3 rounded-full bg-white text-[#090A0C] font-medium text-xs inline-flex items-center gap-2 hover:bg-zinc-200 transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] shrink-0 shadow-[0_4px_20px_rgba(255,255,255,0.08)]"
        >
          <span>Configure 62 Geometries</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Specimen Chamber Stage (7 : 5 Split) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column (7 cols): The Darkroom Specimen Showcase */}
        <div className="lg:col-span-7 relative rounded-[32px] bg-[#0E1014] border border-white/[0.08] p-8 sm:p-10 flex flex-col justify-between overflow-hidden shadow-[0_24px_50px_rgba(0,0,0,0.6)]">
          {/* Top Stage Lighting & Crosshair Reticle */}
          <div
            aria-hidden="true"
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-radial from-[#2EE6CA]/15 to-transparent blur-3xl pointer-events-none"
          />

          {/* Specimen Header & Price Badge */}
          <div className="relative z-10 flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-white/[0.06]">
            <div className="space-y-1">
              <span className="text-[11px] font-mono tracking-widest text-[#2EE6CA] uppercase block">
                SPECIMEN CODE: {activeNeedle.code} · {activeNeedle.name}
              </span>
              <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-[-0.025em]">
                {activeNeedle.role}
              </h3>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                BOX OF 20 STERILE PINS
              </span>
              <span className="text-xl sm:text-2xl font-semibold text-white tabular-nums tracking-tight">
                $22.00 - $25.00
              </span>
            </div>
          </div>

          {/* Central Illuminated Cartridge Apparatus */}
          <div className="relative z-10 my-8 py-4 flex flex-col items-center justify-center min-h-[260px] sm:min-h-[300px]">
            {/* Alignment Reticle / Crosshair Markings */}
            <div
              aria-hidden="true"
              className="absolute inset-x-8 top-1/2 h-px bg-white/[0.06] pointer-events-none"
            />
            <div
              aria-hidden="true"
              className="absolute inset-y-8 left-1/2 w-px bg-white/[0.06] pointer-events-none"
            />

            <img
              key={activeNeedle.code}
              src={activeNeedle.image}
              alt={`Papa ${activeNeedle.name} Needle Cartridge`}
              loading="lazy"
              className="relative z-10 max-h-[230px] sm:max-h-[260px] w-auto object-contain drop-shadow-[0_24px_45px_rgba(0,0,0,0.9)] transition-transform duration-300 ease-[var(--ease-spring)] hover:scale-[1.04]"
            />

            {/* Optical Specimen Plate Shadow */}
            <div
              aria-hidden="true"
              className="w-48 h-5 bg-black/90 blur-md rounded-[100%] mt-4 pointer-events-none"
            />
          </div>

          {/* Specimen Telemetry Footer */}
          <div className="relative z-10 space-y-4 pt-5 border-t border-white/[0.06]">
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
              {activeNeedle.spec}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px] font-mono text-zinc-400">
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <span className="text-zinc-500 block text-[10px]">TAPER PROFILE</span>
                <span className="text-white font-medium">{activeNeedle.taper}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <span className="text-zinc-500 block text-[10px]">DIAMETER RANGE</span>
                <span className="text-white font-medium">{activeNeedle.pinCount}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] col-span-2 sm:col-span-1">
                <span className="text-zinc-500 block text-[10px]">STERILITY LOT</span>
                <span className="text-[#2EE6CA] font-medium">100% EO Gas Sealed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Interactive Geometry Selector & High-Volume Card */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Card 1: 4 Tactile Needle Selector Tiles */}
          <div className="flex-1 rounded-[32px] bg-[#0E1014] border border-white/[0.08] p-7 sm:p-8 flex flex-col justify-between shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between gap-2 mb-5 pb-3 border-b border-white/[0.06]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">
                  GEOMETRY MATRIX
                </span>
                <h3 className="text-lg font-semibold text-white tracking-[-0.015em]">
                  Select Needle Architecture
                </h3>
              </div>
              <span className="text-xs font-mono text-[#2EE6CA]">4 Geometries</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {NEEDLE_CONFIG_FAMILIES.map((item, idx) => {
                const isCurrent = idx === activeNeedleIndex
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => setActiveNeedleIndex(idx)}
                    className={`text-left p-4 rounded-2xl border transition-[transform,background-color,border-color,box-shadow] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.98] cursor-pointer ${
                      isCurrent
                        ? 'bg-white/[0.12] border-white/30 text-white shadow-[0_4px_20px_rgba(255,255,255,0.06)]'
                        : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.07] hover:border-white/15 text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold font-mono text-white">
                        {item.code}
                      </span>
                      <ArrowUpRight
                        className={`w-3.5 h-3.5 transition-colors ${
                          isCurrent ? 'text-[#2EE6CA]' : 'text-zinc-500'
                        }`}
                      />
                    </div>
                    <div className="text-xs font-medium text-white mt-1">
                      {item.name}
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1 leading-snug">
                      {item.role}
                    </p>
                  </button>
                )
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400 font-mono">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#2EE6CA]" />
                <span>Zero Deflection Cam</span>
              </span>
              <span>ISO 13485 Std</span>
            </div>
          </div>

          {/* Card 2: Standard Series High-Volume Studio Replenishment Tile */}
          <div className="rounded-[32px] bg-[#0E1014] border border-white/[0.08] p-7 sm:p-8 flex items-center justify-between gap-5 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">
                HIGH-VOLUME REPLENISHMENT
              </span>
              <h3 className="text-xl font-semibold tracking-[-0.02em] text-white">
                Standard Series Cartridges
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-xs">
                Universal twist-fit housing for daily studio workhorse lining and shading at $22.00 per box.
              </p>
              <div className="pt-2">
                <Link
                  to="/products/$handle"
                  params={{ handle: 'papa-standard-tattoo-cartridges' }}
                  className="text-xs font-medium text-white hover:text-[#2EE6CA] inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Shop Standard Series ($22.00)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <img
              src="/product-images/img_001_papa-cartridges-needles-magnum_cutout.webp"
              alt="Papa Standard Needle Cartridge"
              loading="lazy"
              className="w-24 sm:w-28 h-24 sm:h-28 object-contain shrink-0 drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
