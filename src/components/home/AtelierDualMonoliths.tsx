import React from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Zap, ShieldCheck, BatteryCharging, Gauge } from 'lucide-react'
import { ParallaxApparatusStage } from '../common/ParallaxApparatusStage'

export const AtelierDualMonoliths: React.FC = () => {
  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1440px] mx-auto text-zinc-100">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
        {/* Monolith 1: Papa Volt Cordless Power System */}
        <div className="relative rounded-[32px] bg-[#0E1014] border border-white/[0.08] hover:border-white/20 p-8 sm:p-10 flex flex-col justify-between overflow-hidden shadow-[0_24px_50px_rgba(0,0,0,0.6)] transition-[border-color,box-shadow] duration-200">
          {/* Top Machined Bezel Rim */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#38e8c6]/30 to-transparent pointer-events-none"
          />

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[11px] font-mono tracking-widest text-zinc-400 uppercase">
              <BatteryCharging className="w-3.5 h-3.5 text-[#38e8c6]" />
              <span>Universal RCA · 5V - 12V Regulated</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-semibold tracking-[-0.03em] text-white">
              Papa Volt Cordless Dock.
            </h2>

            <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
              Ultra-compact 2,000 mAh pure lithium dock delivering up to 8 hours of low-ripple voltage without tethering cables. Instant digital step readout.
            </p>
          </div>

          {/* 3D Specimen Parallax Stage */}
          <div className="my-8 flex items-center justify-center">
            <ParallaxApparatusStage
              imageSrc="/product-images/img_041_papa_volt_large_cutout.webp"
              alt="Papa Volt Wireless Battery Dock"
              accentColor="cyan"
              baseRotation={5}
              className="max-w-[340px] sm:max-w-[380px]"
            />
          </div>

          {/* Technical Telemetry & Action Footer */}
          <div className="space-y-6 pt-5 border-t border-white/[0.06]">
            <div className="grid grid-cols-3 gap-4 font-mono">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-lg sm:text-xl font-semibold text-white block tabular-nums">
                  2,000 mAh
                </span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                  Pure Lithium
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-lg sm:text-xl font-semibold text-white block tabular-nums">
                  5V - 12V
                </span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                  Clean Stepped
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-lg sm:text-xl font-semibold text-[#38e8c6] block">
                  USB-C
                </span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                  Fast Charge
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                to="/products/$handle"
                params={{ handle: 'papa-volt-battery' }}
                className="px-6 py-3 rounded-full bg-white text-[#090A0C] font-medium text-xs inline-flex items-center gap-2 hover:bg-zinc-200 transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] shadow-[0_4px_16px_rgba(255,255,255,0.08)]"
              >
                <span>Explore Papa Volt</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/products"
                search={{ category: 'power' }}
                className="text-xs font-mono text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
              >
                <span>All Power Units</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Monolith 2: CNC Adjustable Click Grips */}
        <div className="relative rounded-[32px] bg-[#0E1014] border border-white/[0.08] hover:border-white/20 p-8 sm:p-10 flex flex-col justify-between overflow-hidden shadow-[0_24px_50px_rgba(0,0,0,0.6)] transition-[border-color,box-shadow] duration-200">
          {/* Top Machined Bezel Rim */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
          />

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[11px] font-mono tracking-widest text-zinc-400 uppercase">
              <Gauge className="w-3.5 h-3.5 text-zinc-300" />
              <span>Aerospace 6061-T6 Billet · Autoclavable</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-semibold tracking-[-0.03em] text-white">
              CNC Ratchet Click Grips.
            </h2>

            <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
              Ratcheted millimeter click-stop needle depth locking shifts balance forward to eliminate wrist tendon fatigue during long studio passes.
            </p>
          </div>

          {/* 3D Specimen Parallax Stage */}
          <div className="my-8 flex items-center justify-center">
            <ParallaxApparatusStage
              imageSrc="/product-images/img_111_papa_adjustment_grips_1__cutout.webp"
              alt="Papa CNC Adjustable Click Grip"
              accentColor="emerald"
              baseRotation={-5}
              className="max-w-[340px] sm:max-w-[380px]"
            />
          </div>

          {/* Technical Telemetry & Action Footer */}
          <div className="space-y-6 pt-5 border-t border-white/[0.06]">
            <div className="grid grid-cols-3 gap-4 font-mono">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-lg sm:text-xl font-semibold text-white block">
                  6061-T6
                </span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                  Anodized Billet
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-lg sm:text-xl font-semibold text-white block">
                  Click-Stop
                </span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                  Depth Lock
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-lg sm:text-xl font-semibold text-white block tabular-nums">
                  134 °C
                </span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                  Autoclave Safe
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                to="/products"
                search={{ category: 'grips' }}
                className="px-6 py-3 rounded-full bg-white text-[#090A0C] font-medium text-xs inline-flex items-center gap-2 hover:bg-zinc-200 transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] shadow-[0_4px_16px_rgba(255,255,255,0.08)]"
              >
                <span>Explore 8 Grip Models</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-xs font-mono text-zinc-400 tabular-nums">
                From $79.95 USD
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
