import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, CheckCircle2, ShieldCheck, ArrowUpRight } from 'lucide-react'

interface NeedleSpecimen {
  code: string
  name: string
  description: string
  spec: string
  taper: string
  image: string
}

const SPECIMENS: NeedleSpecimen[] = [
  {
    code: 'RL',
    name: 'Round Liner',
    description: 'Tight micro-welded circular pin grouping for sharp, single-pass outlines.',
    spec: '0.25 - 0.35 mm (#08, #10, #12)',
    taper: 'Long Taper 7.0 mm',
    image: '/product-images/papa-premium-tattoo-cartridges-round-cutout.webp',
  },
  {
    code: 'RS',
    name: 'Round Shader',
    description: 'Parallel cylindrical pin matrix providing smooth ink dispersion for lettering and greywash.',
    spec: '0.30 - 0.35 mm (#10, #12)',
    taper: 'Medium Taper 3.5 mm',
    image: '/product-images/img_002_papa-cartridges-needles-round_cutout.webp',
  },
  {
    code: 'M1',
    name: 'Weaved Magnum',
    description: 'Dual-row alternating array maximizing ink payload for solid black saturation and heavy packing.',
    spec: 'Up to 27 Magnum',
    taper: 'Medium Taper 3.5 mm',
    image: '/product-images/img_001_papa-cartridges-needles-magnum_cutout.webp',
  },
  {
    code: 'M1C',
    name: 'Curved Magnum',
    description: 'Arched pin contour matching natural wrist sweep to prevent harsh needle edge tracking.',
    spec: '0.30 - 0.35 mm (#10, #12)',
    taper: 'Long Taper 5.5 mm',
    image: '/product-images/img_005_papa_cartridges2_cutout.webp',
  },
]

export const CleanroomNeedleMatrix: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0)
  const activeSpecimen = SPECIMENS[activeIdx] || SPECIMENS[0]

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1440px] mx-auto text-[#1d1d1f] dark:text-[#f5f5f7]">
      {/* Section Header */}
      <div className="max-w-3xl mb-12 sm:mb-16 space-y-2.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">
          Class 100,000 Cleanroom Sterility
        </p>
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.035em] text-[#1d1d1f] dark:text-white leading-tight">
          Japanese 316L Surgical Metallurgy.
        </h2>
        <p className="text-base text-[#86868b] leading-relaxed">
          Electro-polished surgical steel pins set in automated micro-fixtures eliminate needle wobble. An internal medical silicone membrane completely isolates motor cavities from pigment backflow.
        </p>
      </div>

      {/* Main 2-Column Cleanroom Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left 7 Cols: Floating Specimen Chamber */}
        <div className="lg:col-span-7 rounded-[32px] bg-[#F5F5F7] dark:bg-[#121214] p-8 sm:p-12 flex flex-col justify-between border border-black/[0.03] dark:border-white/[0.05]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-[#86868b] uppercase tracking-wider block">
                {activeSpecimen.code} · {activeSpecimen.name}
              </span>
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f] dark:text-white mt-1">
                {activeSpecimen.name} Precision.
              </h3>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-[#86868b] block">BOX OF 20</span>
              <span className="text-2xl font-semibold text-[#1d1d1f] dark:text-white tabular-nums tracking-tight">
                $22.00 - $25.00
              </span>
            </div>
          </div>

          {/* Clean Specimen Image */}
          <div className="my-10 flex items-center justify-center min-h-[240px] sm:min-h-[280px]">
            <img
              key={activeSpecimen.code}
              src={activeSpecimen.image}
              alt={activeSpecimen.name}
              loading="lazy"
              className="max-h-[220px] sm:max-h-[260px] w-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_24px_50px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-[var(--ease-spring)] hover:scale-[1.03]"
            />
          </div>

          <div className="pt-6 border-t border-black/[0.06] dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs text-[#86868b]">
              <span>100% EO Gas Sterilized</span>
              <span>·</span>
              <span>Medical Polycarbonate</span>
            </div>

            <Link
              to="/products/$handle"
              params={{ handle: 'papa-premium-tattoo-cartridges' }}
              className="px-6 py-3 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-xs font-medium inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity"
            >
              <span>Configure 62 Sizes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right 5 Cols: Geometry Selection & High-Volume Supply */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Card 1: 4 Needle Geometry Selectors */}
          <div className="flex-1 rounded-[32px] bg-[#F5F5F7] dark:bg-[#121214] p-8 flex flex-col justify-between border border-black/[0.03] dark:border-white/[0.05]">
            <div className="space-y-1 mb-5">
              <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider block">
                CONFIGURATION
              </span>
              <h3 className="text-xl font-semibold text-[#1d1d1f] dark:text-white">
                Four Pin Geometries
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SPECIMENS.map((spec, idx) => {
                const isSelected = idx === activeIdx
                return (
                  <button
                    key={spec.code}
                    type="button"
                    onClick={() => setActiveIdx(idx)}
                    className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white dark:bg-[#202227] border-black/10 dark:border-white/20 shadow-xs'
                        : 'bg-white/60 dark:bg-white/[0.03] border-transparent hover:bg-white dark:hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#1d1d1f] dark:text-white">
                        {spec.code}
                      </span>
                      <ArrowUpRight
                        className={`w-3.5 h-3.5 ${
                          isSelected ? 'text-[#1d1d1f] dark:text-white' : 'text-[#86868b]'
                        }`}
                      />
                    </div>
                    <div className="text-xs font-medium text-[#1d1d1f] dark:text-white mt-1">
                      {spec.name}
                    </div>
                    <p className="text-[11px] text-[#86868b] mt-1 line-clamp-1">
                      {spec.taper}
                    </p>
                  </button>
                )
              })}
            </div>

            <p className="mt-5 pt-4 border-t border-black/[0.06] dark:border-white/[0.08] text-xs text-[#86868b] leading-relaxed">
              {activeSpecimen.description}
            </p>
          </div>

          {/* Card 2: High-Volume Studio Replenishment Tile */}
          <div className="rounded-[32px] bg-[#F5F5F7] dark:bg-[#121214] p-8 flex items-center justify-between gap-5 border border-black/[0.03] dark:border-white/[0.05]">
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider block">
                HIGH-VOLUME REPLENISHMENT
              </span>
              <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-white">
                Standard Series Cartridges
              </h3>
              <p className="text-xs text-[#86868b] leading-relaxed max-w-xs">
                Universal twist-fit daily workhorse lining and shading at $22.00 per box.
              </p>
              <div className="pt-1">
                <Link
                  to="/products/$handle"
                  params={{ handle: 'papa-standard-tattoo-cartridges' }}
                  className="text-xs font-medium text-[#1d1d1f] dark:text-white hover:underline inline-flex items-center gap-1"
                >
                  <span>Shop Standard Series</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <img
              src="/product-images/img_001_papa-cartridges-needles-magnum_cutout.webp"
              alt="Standard Series"
              loading="lazy"
              className="w-20 h-20 object-contain shrink-0 drop-shadow-md"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
