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
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'

interface NeedleSpecimen {
  code: string
  name: string
  taper: string
  geometry: string
  recommendation: string
  image: string
}

const NEEDLE_SPECIMENS: NeedleSpecimen[] = [
  {
    code: 'RL',
    name: 'Round Liner',
    taper: 'Long Taper 7.0 mm',
    geometry: 'Tight Micro-Circle',
    recommendation: 'Crisp single-pass outline, lettering, fine-line portraits.',
    image: '/product-images/papa-premium-tattoo-cartridges-round-cutout.webp',
  },
  {
    code: 'RS',
    name: 'Round Shader',
    taper: 'Medium Taper 3.5 mm',
    geometry: 'Open Cylinder Matrix',
    recommendation: 'Color transitions, gentle greywash blending, whip shading.',
    image: '/product-images/img_002_papa-cartridges-needles-round_cutout.webp',
  },
  {
    code: 'M1',
    name: 'Weaved Magnum',
    taper: 'Medium Taper 3.5 mm',
    geometry: 'Dual-Row Flat Array',
    recommendation: 'High-density pigment packing, deep solid black saturation.',
    image: '/product-images/img_001_papa-cartridges-needles-magnum_cutout.webp',
  },
  {
    code: 'M1C',
    name: 'Curved Magnum',
    taper: 'Long Taper 5.5 mm',
    geometry: 'Arched Edge Sweep',
    recommendation: 'Seamless gradients, zero trauma edging, photo-realistic blending.',
    image: '/product-images/img_005_papa_cartridges2_cutout.webp',
  },
]

export const AtelierCaliperMetrology: React.FC = () => {
  const [depthMm, setDepthMm] = useState(1.8)
  const [selectedSpecimen, setSelectedSpecimen] = useState(NEEDLE_SPECIMENS[0])

  // Resolve Epidermal Layer Dynamics
  const resolveLayerInfo = (depth: number) => {
    if (depth <= 1.2) {
      return {
        zone: 'EPIDERMIS (SUPERFICIAL)',
        status: 'Sub-Optimal Ink Retention',
        color: 'text-amber-400',
        barColor: 'bg-amber-400',
        detail:
          'Pigment placed too shallow. Cells shed naturally through epidermal turnover, resulting in faded heals.',
      }
    }
    if (depth <= 2.3) {
      return {
        zone: 'UPPER DERMIS (OPTIMAL RETENTION)',
        status: 'Clinical Golden Depth',
        color: 'text-[#2EE6CA]',
        barColor: 'bg-[#2EE6CA]',
        detail:
          'Macrophage encapsulation zone. Pigment permanently locks without blowout or subcutaneous spreading.',
      }
    }
    if (depth <= 3.2) {
      return {
        zone: 'RETICULAR DERMIS',
        status: 'Deep Shading Threshold',
        color: 'text-sky-400',
        barColor: 'bg-sky-400',
        detail:
          'Firm collagen lattice. Suitable for dense color fill with disciplined hand speed and voltage control.',
      }
    }
    return {
      zone: 'SUBCUTANEOUS TISSUE (TRAUMA RISK)',
      status: 'Excessive Depth Warning',
      color: 'text-rose-400',
      barColor: 'bg-rose-400',
      detail:
        'Penetrates adipose layer. High risk of blowouts, micro-scarring, and pigment halo diffusion.',
    }
  }

  const layerInfo = resolveLayerInfo(depthMm)

  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1440px] mx-auto text-zinc-100">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[11px] font-mono tracking-widest text-zinc-400 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2EE6CA]" />
            <span>Surgical Metrology &amp; Metallurgy</span>
            <span className="text-zinc-600">//</span>
            <span>Class 100,000 Cleanroom</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.035em] text-white leading-tight">
            Micro-Tolerance Penetration Caliper.
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
            Drag the digital micrometer caliper to examine real-time needle penetration dynamics across anatomical dermal layers. Japanese 316L medical stainless pins with automated zero-wobble solder alignment.
          </p>
        </div>

        <Link
          to="/products/$handle"
          params={{ handle: 'papa-premium-tattoo-cartridges' }}
          className="px-6 py-3 rounded-full bg-white text-[#08090C] font-semibold text-xs inline-flex items-center gap-2 hover:bg-zinc-200 transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] shrink-0 shadow-[0_4px_20px_rgba(255,255,255,0.08)]"
        >
          <span>Configure 62 Needle Sizes</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main 12-Column Caliper HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Side (7 Cols): The Caliper & Epidermal Simulator */}
        <div className="lg:col-span-7 rounded-[32px] bg-[#0E1014] border border-white/[0.08] p-8 sm:p-10 flex flex-col justify-between shadow-[0_24px_50px_rgba(0,0,0,0.6)] space-y-8">
          {/* Caliper Readout Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
            <div>
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest block">
                DIGITAL CALIPER STROKE
              </span>
              <div className="text-3xl sm:text-4xl font-semibold text-white tracking-tight tabular-nums font-mono mt-1">
                {depthMm.toFixed(2)} <span className="text-sm text-zinc-500">mm</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest block">
                ANATOMICAL TARGET
              </span>
              <span className={`text-sm sm:text-base font-semibold font-mono mt-1 block ${layerInfo.color}`}>
                {layerInfo.zone}
              </span>
            </div>
          </div>

          {/* Interactive Caliper Slider Control */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-mono text-zinc-400">
              <span>0.0 mm (Retracted)</span>
              <span className="text-[#2EE6CA] font-semibold">1.5 - 2.2 mm (Golden Depth)</span>
              <span>4.0 mm (Max Out)</span>
            </div>

            <div className="relative py-2">
              <input
                type="range"
                min="0.0"
                max="4.0"
                step="0.05"
                value={depthMm}
                onChange={e => setDepthMm(parseFloat(e.target.value))}
                className="w-full h-2 rounded-lg bg-zinc-800 appearance-none cursor-pointer accent-[#2EE6CA]"
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#08090C] border border-white/[0.05] flex items-start gap-3">
              <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${layerInfo.color}`} />
              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                {layerInfo.detail}
              </p>
            </div>
          </div>

          {/* Graphical Epidermal Depth Visualization */}
          <div className="relative h-44 rounded-2xl bg-[#08090C] border border-white/[0.05] p-4 flex flex-col justify-between overflow-hidden font-mono text-[10px]">
            {/* Epidermis Layer */}
            <div className="h-1/3 border-b border-dashed border-white/10 flex items-center justify-between px-3 text-zinc-400">
              <span>EPIDERMIS (0.0 - 1.2 mm)</span>
              <span className="text-zinc-600">Cell Turnover Layer</span>
            </div>

            {/* Dermis Golden Zone */}
            <div className="h-1/3 bg-[#2EE6CA]/[0.04] border-b border-dashed border-[#2EE6CA]/20 flex items-center justify-between px-3 text-[#2EE6CA]">
              <span className="font-semibold">DERMIS GOLDEN ZONE (1.3 - 2.3 mm)</span>
              <span>Zero-Diffusion Lock</span>
            </div>

            {/* Reticular & Subcutaneous */}
            <div className="h-1/3 flex items-center justify-between px-3 text-zinc-400">
              <span>RETICULAR DERMIS / SUBCUTANEOUS (2.4 - 4.0 mm)</span>
              <span className="text-rose-400/80">Trauma Risk Zone</span>
            </div>

            {/* Simulated Live Needle Indicator */}
            <div
              className="absolute left-1/2 -translate-x-1/2 top-0 w-1 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] transition-all duration-75 pointer-events-none"
              style={{ height: `${(depthMm / 4.0) * 100}%` }}
            >
              <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-[#2EE6CA] ring-4 ring-[#2EE6CA]/20" />
            </div>
          </div>
        </div>

        {/* Right Side (5 Cols): 4 Needle Geometry Specimens */}
        <div className="lg:col-span-5 rounded-[32px] bg-[#0E1014] border border-white/[0.08] p-8 flex flex-col justify-between shadow-[0_24px_50px_rgba(0,0,0,0.6)] space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest">
                JAPANESE 316L GEOMETRIES
              </span>
              <span className="text-xs font-mono text-[#2EE6CA]">
                {selectedSpecimen.code} SELECT
              </span>
            </div>

            {/* Specimen Cutout Stage */}
            <div className="relative py-6 px-4 rounded-2xl bg-[#08090C] border border-white/[0.05] flex items-center justify-center min-h-[190px]">
              <img
                src={selectedSpecimen.image}
                alt={selectedSpecimen.name}
                className="max-h-[150px] w-auto object-contain drop-shadow-[0_16px_30px_rgba(0,0,0,0.9)]"
              />
            </div>

            {/* 4 Geometry Switcher Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              {NEEDLE_SPECIMENS.map(spec => {
                const isSel = spec.code === selectedSpecimen.code
                return (
                  <button
                    key={spec.code}
                    type="button"
                    onClick={() => setSelectedSpecimen(spec)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSel
                        ? 'bg-white/15 border-white/40 text-white shadow-md'
                        : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold font-mono text-white">
                        {spec.code}
                      </span>
                      <ArrowUpRight
                        className={`w-3.5 h-3.5 ${isSel ? 'text-[#2EE6CA]' : 'text-zinc-600'}`}
                      />
                    </div>
                    <span className="text-[11px] text-zinc-300 block mt-1">
                      {spec.name}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Detailed Specimen Attributes */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-zinc-500">TAPER PROFILE:</span>
                <span className="text-white">{selectedSpecimen.taper}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">PIN ARRAY:</span>
                <span className="text-white">{selectedSpecimen.geometry}</span>
              </div>
              <div className="pt-2 border-t border-white/[0.05] text-[11px] text-zinc-400 font-sans">
                {selectedSpecimen.recommendation}
              </div>
            </div>
          </div>

          <Link
            to="/products/$handle"
            params={{ handle: 'papa-premium-tattoo-cartridges' }}
            className="w-full py-3.5 rounded-full bg-white text-[#08090C] font-semibold text-xs inline-flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors"
          >
            <span>Order Box of 20 · $25.00</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
