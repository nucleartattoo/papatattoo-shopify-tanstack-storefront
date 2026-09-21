import React from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { VirtualAtelier } from '../workbench/VirtualAtelier'

export const HomePromoBanners: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 lg:py-36 bg-transparent relative z-10">
      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        {/* 1. 3D Virtual Atelier & Interactive Workbench */}
        <VirtualAtelier />

        {/* 2. Dual Promo Grid: Travel Case & Foot Pedal - Seamless Sculptural Plinths */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 xl:gap-12 pt-4">
          {/* Card A: PAPA Travel Case */}
          <div className="group rounded-3xl bg-zinc-100/50 dark:bg-white/[0.03] backdrop-blur-xs p-6 sm:p-8 flex flex-col justify-between hover:shadow-2xl transition-all duration-500">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl p-6 flex items-center justify-center">
              <div className="absolute inset-0 opacity-15 blur-3xl group-hover:opacity-25 transition-opacity duration-700 bg-[#38e8c6] pointer-events-none" />
              <img
                src="/product-images/img_201_papa_travel_case_cutout.webp"
                alt="PAPA Travel Case"
                className="relative max-h-[85%] w-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] scale-120 group-hover:scale-130 transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </div>

            <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block">STUDIO GEAR</span>
                <h4 className="text-lg sm:text-xl font-bold uppercase text-zinc-950 dark:text-white tracking-tight group-hover:text-[#0d9488] dark:group-hover:text-[#38e8c6] transition-colors font-sans">
                  PAPA HEAVY-DUTY TRAVEL CASE
                </h4>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                  Rigid ballistic EVA casing with custom foam cutouts. Fits 2 machines, power supplies, cords, and cartridges.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between">
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
          <div className="group rounded-3xl bg-zinc-100/50 dark:bg-white/[0.03] backdrop-blur-xs p-6 sm:p-8 flex flex-col justify-between hover:shadow-2xl transition-all duration-500">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl p-6 flex items-center justify-center">
              <div className="absolute inset-0 opacity-15 blur-3xl group-hover:opacity-25 transition-opacity duration-700 bg-[#e6b366] pointer-events-none" />
              <img
                src="/product-images/img_139_papa_foot_pedal_cutout.webp"
                alt="Papa Foot Pedal"
                className="relative max-h-[85%] w-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] scale-120 group-hover:scale-130 transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </div>

            <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block">POWER ACCESSORY</span>
                <h4 className="text-lg sm:text-xl font-bold uppercase text-zinc-950 dark:text-white tracking-tight group-hover:text-[#0d9488] dark:group-hover:text-[#38e8c6] transition-colors font-sans">
                  PAPA 360° PRECISION FOOT PEDAL
                </h4>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                  Weighted metal chassis with anti-skid silicone base. 360° omnidirectional actuation switch for uninterrupted tattooing.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400">FOOT SWITCH</span>
                <Link
                  to="/products/$handle"
                  params={{ handle: 'papa-foot-pedal' }}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-medium uppercase text-zinc-700 dark:text-zinc-300 hover:text-[#0d9488] dark:hover:text-[#38e8c6] transition-colors"
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
