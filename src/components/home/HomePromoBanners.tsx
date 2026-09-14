import React from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Sparkles, ShieldCheck, Gauge, Sliders, Zap } from 'lucide-react'

export const HomePromoBanners: React.FC = () => {
  return (
    <section className="py-16 bg-zinc-100/60 dark:bg-[#0B0D11] border-b border-zinc-200 dark:border-[#1E232E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-zinc-200 dark:border-[#1E232E] gap-4">
          <div>
            <div className="text-[11px] font-mono font-bold tracking-widest text-[#0d9488] dark:text-[#2EE6CA] uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>// ENGINEERING SPOTLIGHT & HARDWARE SUITE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white uppercase tracking-tight">
              PRO APPARATUS & STUDIO ESSENTIALS
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            OFFICIAL FACTORY CERTIFIED HARDWARE
          </span>
        </div>

        {/* 1. Large Showcase: Papa Pen V3 Black Full Set */}
        <div className="group relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-[#1F2430] bg-white dark:bg-[#11141B] shadow-xl hover:border-zinc-300 dark:hover:border-[#2ee6ca]/40 transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Left Image Showcase */}
            <div className="lg:col-span-7 relative overflow-hidden bg-zinc-950 aspect-16/10 lg:aspect-auto lg:h-[380px] flex items-center justify-center">
              <img
                src="/promos/papapenfullstack.jpeg"
                alt="Papa Pen V3 Black Full Set"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#11141B]/90" />

              {/* Badge */}
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#2ee6ca]/30 text-[#2ee6ca] text-[10px] font-mono font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2ee6ca] animate-pulse" />
                <span>FLAGSHIP ROTARY APPARATUS</span>
              </div>
            </div>

            {/* Right Details & Specs */}
            <div className="lg:col-span-5 p-8 sm:p-10 space-y-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="text-xs font-mono font-bold text-[#0d9488] dark:text-[#2EE6CA] tracking-wider uppercase flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>TRIPLE-STROKE MODULAR SYSTEM</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-950 dark:text-white leading-tight">
                  PAPA PEN V3 · BLACK <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d9488] to-[#2EE6CA]">
                    FULL STUDIO SET
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                  Engineered with 3 interchangeable stroke configurations to suit fine-line realism, bold American traditional lining, and velvety black-and-grey shading. Sub-0.01mm concentricity tolerance delivers direct fluid control with zero needle wobble.
                </p>
              </div>

              {/* Spec Highlights */}
              <div className="grid grid-cols-3 gap-3 py-3 border-y border-zinc-100 dark:border-[#1E232E] text-center font-mono">
                <div>
                  <div className="text-sm font-black text-zinc-950 dark:text-white">3 STROKES</div>
                  <div className="text-[10px] text-zinc-500 uppercase">2.6 / 3.5 / 4.0mm</div>
                </div>
                <div className="border-x border-zinc-100 dark:border-[#1E232E]">
                  <div className="text-sm font-black text-zinc-950 dark:text-white">6061-T6</div>
                  <div className="text-[10px] text-zinc-500 uppercase">Aero Alloy</div>
                </div>
                <div>
                  <div className="text-sm font-black text-[#0d9488] dark:text-[#2EE6CA]">0.01mm</div>
                  <div className="text-[10px] text-zinc-500 uppercase">Tolerance</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to="/products/$handle"
                  params={{ handle: 'papa-pen-black' }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-950 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 text-xs font-mono font-bold uppercase tracking-wider hover:shadow-lg transition-all"
                >
                  <span>Shop Pen V3</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  to="/collections"
                  search={{ category: 'machines' }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-zinc-300 dark:border-[#2A303C] hover:border-zinc-500 dark:hover:border-[#2ee6ca]/50 text-zinc-800 dark:text-zinc-200 text-xs font-mono font-bold uppercase tracking-wider transition-colors"
                >
                  <span>All Machines</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Dual Promo Grid: Travel Case & Foot Pedal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card A: PAPA Travel Case */}
          <div className="group rounded-2xl border border-zinc-200 dark:border-[#1F2430] bg-white dark:bg-[#11141B] overflow-hidden flex flex-col justify-between hover:border-zinc-400 dark:hover:border-[#2EE6CA]/50 shadow-lg transition-all duration-300">
            <div className="relative aspect-16/9 overflow-hidden bg-zinc-100 dark:bg-[#161A22]">
              <img
                src="/promos/trabag.jpg"
                alt="PAPA Travel Case"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 text-white font-mono text-xs font-bold uppercase flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2EE6CA]" />
                <span>HEAVY-DUTY EVA SHELL</span>
              </div>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h4 className="text-lg font-black uppercase text-zinc-950 dark:text-white tracking-tight group-hover:text-[#0d9488] dark:group-hover:text-[#2EE6CA] transition-colors">
                  PAPA HEAVY-DUTY TRAVEL CASE
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                  Rigid ballistic EVA casing with precision-cut custom foam partitions. Securely fits 2 rotary machines, wireless battery packs, RCA cords, cartridges, and station essentials for guest spots and international conventions.
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-[#1C2028] flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-500">STUDIO GEAR</span>
                <Link
                  to="/products/$handle"
                  params={{ handle: 'papa-travel-case' }}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-[#0d9488] dark:text-[#2EE6CA] hover:underline"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card B: Papa Foot Pedal */}
          <div className="group rounded-2xl border border-zinc-200 dark:border-[#1F2430] bg-white dark:bg-[#11141B] overflow-hidden flex flex-col justify-between hover:border-zinc-400 dark:hover:border-[#2EE6CA]/50 shadow-lg transition-all duration-300">
            <div className="relative aspect-16/9 overflow-hidden bg-zinc-100 dark:bg-[#161A22]">
              <img
                src="/promos/ppfs.jpg"
                alt="Papa Foot Pedal"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 text-white font-mono text-xs font-bold uppercase flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#2EE6CA]" />
                <span>360° ACTUATION SWITCH</span>
              </div>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h4 className="text-lg font-black uppercase text-zinc-950 dark:text-white tracking-tight group-hover:text-[#0d9488] dark:group-hover:text-[#2EE6CA] transition-colors">
                  PAPA 360° PRECISION FOOT PEDAL
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                  Constructed with a heavy-gauge weighted metal chassis and deep-groove silicone anti-skid pad. Responsive 360-degree round switch trigger allows uninterrupted artist focus without slipping across studio flooring.
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-[#1C2028] flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-500">POWER ACCESSORY</span>
                <Link
                  to="/products/$handle"
                  params={{ handle: 'papa-foot-pedal' }}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-[#0d9488] dark:text-[#2EE6CA] hover:underline"
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
