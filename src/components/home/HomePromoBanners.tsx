import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Sparkles, ShieldCheck, Gauge, Sliders, Zap, Box, Image as ImageIcon, Cpu } from 'lucide-react'
import { ModelViewer3D } from '../common/ModelViewer3D'

export const HomePromoBanners: React.FC = () => {
  const [penViewMode, setPenViewMode] = useState<'3d' | '2d'>('3d')
  return (
    <section className="py-20 sm:py-24 bg-zinc-50/50 dark:bg-transparent border-b border-zinc-200/80 dark:border-white/[0.06] relative z-10">
      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Section Header */}
        <div className="flex items-end justify-between pb-5 border-b border-zinc-200/80 dark:border-white/[0.08]">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-950 dark:text-white uppercase tracking-tight font-sans">
            SPOTLIGHT
          </h2>
        </div>

        {/* 1. Large Showcase: Papa Pen V2 Precision Rotary Machine */}
        <div className="group relative rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#262933] shadow-sm hover:border-zinc-300 dark:hover:border-white/20 hover:shadow-xl dark:hover:shadow-[0_16px_36px_rgba(0,0,0,0.5)] transition-all duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Left Image/3D Showcase */}
            <div className="lg:col-span-7 p-4 sm:p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-zinc-100 dark:border-white/[0.06] flex items-center justify-center">
              <div className="relative w-full h-[340px] sm:h-[400px] lg:h-[440px] rounded-xl overflow-hidden border border-zinc-100 dark:border-white/[0.05] bg-zinc-50 dark:bg-[#07080a] transition-colors group/stage">
                {/* Backlight Studio Glow so dark apparatus chassis pops */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(46,230,202,0.12)_0%,rgba(46,230,202,0.02)_45%,transparent_75%)] pointer-events-none" />

                {penViewMode === '3d' ? (
                  <ModelViewer3D
                    src="/models/papapenv2.glb"
                    poster="/product-images/img_113_papa_pen_jet_black_1__cutout.webp"
                    alt="Papa Pen V2 Precision Rotary Machine"
                    className="w-full h-full"
                    cameraOrbit="45deg 65deg 2.2m"
                  />
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center p-6 overflow-hidden">
                    <img
                      src="/product-images/img_113_papa_pen_jet_black_1__cutout.webp"
                      alt="Papa Pen V2 Precision Machine"
                      className="max-h-[340px] w-auto object-contain drop-shadow-2xl scale-110 group-hover:scale-115 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* 2D / 3D Mode Switcher Segmented Control (Apple / Emil style) */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-1 p-1 rounded-xl bg-white/90 dark:bg-black/75 backdrop-blur-md border border-zinc-200/80 dark:border-white/[0.1] shadow-md font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => setPenViewMode('3d')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-[11px] transition-all duration-200 cursor-pointer ${
                      penViewMode === '3d'
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
                    }`}
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>3D MODEL</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPenViewMode('2d')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-[11px] transition-all duration-200 cursor-pointer ${
                      penViewMode === '2d'
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>2D PHOTO</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Details & Specs */}
            <div className="lg:col-span-5 p-8 sm:p-10 space-y-6 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[11px] font-mono font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                  PRECISION APPARATUS
                </span>
                <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-zinc-950 dark:text-white leading-tight font-sans">
                  PAPA PEN V2 ROTARY MACHINE
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                  Precision rotary machine engineered for continuous, low-vibration operation with custom German motor. Fixed 3.5mm stroke, 6–12.6V operating voltage, 150g weight.
                </p>
              </div>

              {/* Spec Highlights: Clean Architectural Hairline Grid */}
              <div className="grid grid-cols-3 gap-3 py-4 border-y border-zinc-100 dark:border-white/[0.08] text-center font-mono">
                <div>
                  <div className="text-sm font-bold text-zinc-950 dark:text-white">3.5mm</div>
                  <div className="text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">Fixed Stroke</div>
                </div>
                <div className="border-x border-zinc-100 dark:border-white/[0.08]">
                  <div className="text-sm font-bold text-zinc-950 dark:text-white">6 - 12.6V</div>
                  <div className="text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">Operating Volt</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-950 dark:text-white">150g</div>
                  <div className="text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">Total Weight</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to="/products/$handle"
                  params={{ handle: 'papa-pen-v2-1' }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-mono font-medium uppercase tracking-wider hover:opacity-90 transition-all duration-200 active:scale-95 shadow-xs"
                >
                  <span>Shop Papa Pen V2</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  to="/collections"
                  search={{ category: 'machines', sub: 'papa-pen-v2' }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-zinc-200 dark:border-white/[0.1] hover:border-zinc-400 dark:hover:border-white/25 text-zinc-700 dark:text-zinc-300 text-xs font-mono font-medium uppercase tracking-wider transition-colors duration-200"
                >
                  <span>All Machines</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Dual Promo Grid: Travel Case & Foot Pedal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8">
          {/* Card A: PAPA Travel Case */}
          <div className="group rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#262933] overflow-hidden flex flex-col justify-between hover:border-zinc-300 dark:hover:border-white/20 shadow-sm hover:shadow-xl dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)] transition-all duration-500">
            <div className="relative aspect-[16/10] overflow-hidden bg-zinc-50 dark:bg-[#1c1e24] border-b border-zinc-100 dark:border-white/[0.06] p-6 flex items-center justify-center">
              <div className="absolute inset-0 opacity-15 blur-3xl group-hover:opacity-25 transition-opacity duration-700 bg-[#38e8c6] pointer-events-none" />
              <img
                src="/product-images/img_201_papa_travel_case_cutout.webp"
                alt="PAPA Travel Case"
                className="relative max-h-[82%] w-auto object-contain drop-shadow-2xl scale-125 group-hover:scale-135 transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </div>

            <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block">STUDIO GEAR</span>
                <h4 className="text-base sm:text-lg font-bold uppercase text-zinc-950 dark:text-white tracking-tight group-hover:text-[#0d9488] dark:group-hover:text-[#38e8c6] transition-colors font-sans">
                  PAPA HEAVY-DUTY TRAVEL CASE
                </h4>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                  Rigid ballistic EVA casing with custom foam cutouts. Fits 2 machines, power supplies, cords, and cartridges.
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-200/80 dark:border-white/[0.08] flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400">STUDIO TRAVEL</span>
                <Link
                  to="/products/$handle"
                  params={{ handle: 'papa-travel-case' }}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-medium uppercase text-zinc-700 dark:text-zinc-300 hover:text-[#0d9488] dark:hover:text-[#38e8c6] transition-colors"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card B: Papa Foot Pedal */}
          <div className="group rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#262933] overflow-hidden flex flex-col justify-between hover:border-zinc-300 dark:hover:border-white/20 shadow-sm hover:shadow-xl dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)] transition-all duration-500">
            <div className="relative aspect-[16/10] overflow-hidden bg-zinc-50 dark:bg-[#1c1e24] border-b border-zinc-100 dark:border-white/[0.06] p-6 flex items-center justify-center">
              <div className="absolute inset-0 opacity-15 blur-3xl group-hover:opacity-25 transition-opacity duration-700 bg-[#e6b366] pointer-events-none" />
              <img
                src="/product-images/img_139_papa_foot_pedal_cutout.webp"
                alt="Papa Foot Pedal"
                className="relative max-h-[82%] w-auto object-contain drop-shadow-2xl scale-125 group-hover:scale-135 transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </div>

            <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">POWER ACCESSORY</span>
                <h4 className="text-base sm:text-lg font-bold uppercase text-zinc-950 dark:text-white tracking-tight group-hover:text-[#0d9488] dark:group-hover:text-[#2ee6ca] transition-colors font-sans">
                  PAPA 360° PRECISION FOOT PEDAL
                </h4>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                  Weighted metal chassis with anti-skid silicone base. 360° omnidirectional actuation switch for uninterrupted tattooing.
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-white/[0.08] flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400">FOOT SWITCH</span>
                <Link
                  to="/products/$handle"
                  params={{ handle: 'papa-foot-pedal' }}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-medium uppercase text-zinc-700 dark:text-zinc-300 hover:text-[#0d9488] dark:hover:text-[#2ee6ca] transition-colors"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
