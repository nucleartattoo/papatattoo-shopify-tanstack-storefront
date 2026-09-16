import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Sparkles, ShieldCheck, Gauge, Sliders, Zap, Box, Image as ImageIcon, Cpu } from 'lucide-react'
import { ModelViewer3D } from '../common/ModelViewer3D'

export const HomePromoBanners: React.FC = () => {
  const [penViewMode, setPenViewMode] = useState<'3d' | '2d'>('3d')
  return (
    <section className="py-20 sm:py-24 bg-zinc-100/40 dark:bg-[#06070a] border-b border-zinc-200/70 dark:border-zinc-800/70 relative">
      {/* Background cyber grid */}
      <div className="absolute inset-0 sacred-grid-bg opacity-20 pointer-events-none" />

      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Section Header */}
        <div className="flex items-end justify-between pb-5 border-b border-zinc-200/70 dark:border-zinc-800/70">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 dark:text-white uppercase tracking-tight font-sans">
            SPOTLIGHT
          </h2>
        </div>

        {/* 1. Large Showcase: Papa Pen V2 Precision Rotary Machine */}
        <div className="group relative rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0a0d14] shadow-lg hover:border-zinc-300 dark:hover:border-[#00f0ff]/50 hover:shadow-xl dark:hover:shadow-[0_0_30px_rgba(0,240,255,0.18)] transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Left Image/3D Showcase */}
            <div className="lg:col-span-7 p-4 sm:p-5 lg:p-6 border-b lg:border-b-0 lg:border-r border-zinc-100 dark:border-zinc-800/70 flex items-center justify-center">
              <div className="relative w-full h-[340px] sm:h-[400px] lg:h-[440px] rounded-xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-[#07090e] transition-colors group/stage hud-corner-bracket">
                {/* Backlight Studio Glow so dark apparatus chassis pops */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.18)_0%,rgba(0,240,255,0.04)_45%,transparent_75%)] pointer-events-none" />

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
                      className="max-h-[340px] w-auto object-contain drop-shadow-2xl scale-110 group-hover:scale-120 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* 2D / 3D Mode Switcher Pills */}
                <div className="absolute top-3 left-3 z-20 flex items-center gap-1 p-1 rounded-xl bg-white/85 dark:bg-black/80 backdrop-blur-md border border-zinc-200 dark:border-[#00f0ff]/20 shadow-xl font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => setPenViewMode('3d')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                      penViewMode === '3d'
                        ? 'bg-[#0d9488] text-white dark:bg-[#00f0ff] dark:text-zinc-950 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                        : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
                    }`}
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>3D INTERACTIVE</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPenViewMode('2d')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                      penViewMode === '2d'
                        ? 'bg-zinc-950 text-white dark:bg-zinc-800 dark:text-white shadow-xs'
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
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-950 dark:text-white leading-tight font-sans">
                  PAPA PEN V2 ROTARY MACHINE
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                  Precision rotary machine engineered for continuous, low-vibration operation with custom German motor. Fixed 3.5mm stroke, 6–12.6V operating voltage, 150g weight.
                </p>
              </div>

              {/* Spec Highlights */}
              <div className="grid grid-cols-3 gap-3 py-3.5 border-y border-zinc-100 dark:border-zinc-800/70 text-center font-mono">
                <div>
                  <div className="text-sm font-black text-[#0d9488] dark:text-[#00f0ff]">3.5mm</div>
                  <div className="text-[10px] text-zinc-500 uppercase">Fixed Stroke</div>
                </div>
                <div className="border-x border-zinc-100 dark:border-zinc-800/70">
                  <div className="text-sm font-black text-zinc-950 dark:text-white">6 - 12.6V</div>
                  <div className="text-[10px] text-zinc-500 uppercase">Operating Volt</div>
                </div>
                <div>
                  <div className="text-sm font-black text-[#0d9488] dark:text-[#00f0ff]">150g</div>
                  <div className="text-[10px] text-zinc-500 uppercase">Total Weight</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to="/products/$handle"
                  params={{ handle: 'papa-pen-v2-1' }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-950 text-white dark:bg-[#00f0ff] dark:text-zinc-950 text-xs font-mono font-bold uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all"
                >
                  <span>Shop Papa Pen V2</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  to="/collections"
                  search={{ category: 'machines', sub: 'papa-pen-v2' }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 dark:hover:border-[#00f0ff]/50 text-zinc-800 dark:text-zinc-200 text-xs font-mono font-bold uppercase tracking-wider transition-colors"
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
          <div className="group rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0a0d14] overflow-hidden flex flex-col justify-between hover:border-zinc-400 dark:hover:border-[#00f0ff]/40 shadow-sm hover:shadow-lg dark:hover:shadow-[0_0_25px_rgba(0,240,255,0.15)] transition-all duration-300">
            <div className="relative aspect-[16/10] overflow-hidden bg-zinc-50 dark:bg-[#06070a] border-b border-zinc-100 dark:border-zinc-800/60 p-6 flex items-center justify-center hud-corner-bracket">
              <div className="absolute inset-0 opacity-15 blur-2xl group-hover:opacity-30 transition-opacity duration-500 bg-[#00f0ff] pointer-events-none" />
              <img
                src="/product-images/img_201_papa_travel_case_cutout.webp"
                alt="PAPA Travel Case"
                className="relative max-h-[85%] w-auto object-contain drop-shadow-2xl scale-135 group-hover:scale-145 transition-transform duration-500"
                loading="lazy"
              />
            </div>

            <div className="p-7 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h4 className="text-lg font-black uppercase text-zinc-950 dark:text-white tracking-tight group-hover:text-[#0d9488] dark:group-hover:text-[#00f0ff] transition-colors font-sans">
                  PAPA HEAVY-DUTY TRAVEL CASE
                </h4>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                  Rigid ballistic EVA casing with custom foam cutouts. Fits 2 machines, power supplies, cords, and cartridges.
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/70 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-500">STUDIO GEAR</span>
                <Link
                  to="/products/$handle"
                  params={{ handle: 'papa-travel-case' }}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-[#0d9488] dark:text-[#00f0ff] hover:underline"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card B: Papa Foot Pedal */}
          <div className="group rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0a0d14] overflow-hidden flex flex-col justify-between hover:border-zinc-400 dark:hover:border-[#00f0ff]/40 shadow-sm hover:shadow-lg dark:hover:shadow-[0_0_25px_rgba(0,240,255,0.15)] transition-all duration-300">
            <div className="relative aspect-[16/10] overflow-hidden bg-zinc-50 dark:bg-[#06070a] border-b border-zinc-100 dark:border-zinc-800/60 p-6 flex items-center justify-center hud-corner-bracket">
              <div className="absolute inset-0 opacity-15 blur-2xl group-hover:opacity-30 transition-opacity duration-500 bg-[#38bdf8] pointer-events-none" />
              <img
                src="/product-images/img_139_papa_foot_pedal_cutout.webp"
                alt="Papa Foot Pedal"
                className="relative max-h-[85%] w-auto object-contain drop-shadow-2xl scale-135 group-hover:scale-145 transition-transform duration-500"
                loading="lazy"
              />
            </div>

            <div className="p-7 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h4 className="text-lg font-black uppercase text-zinc-950 dark:text-white tracking-tight group-hover:text-[#0d9488] dark:group-hover:text-[#00f0ff] transition-colors font-sans">
                  PAPA 360° PRECISION FOOT PEDAL
                </h4>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                  Weighted metal chassis with anti-skid silicone base. 360° omnidirectional actuation switch for uninterrupted tattooing.
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/70 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-500">POWER ACCESSORY</span>
                <Link
                  to="/products/$handle"
                  params={{ handle: 'papa-foot-pedal' }}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-[#0d9488] dark:text-[#00f0ff] hover:underline"
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
