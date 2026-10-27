import React from 'react'
import { Link } from '@tanstack/react-router'
import {
  ShieldCheck,
  Globe,
  Award,
  Truck,
  RotateCcw,
  Cpu,
  Layers,
  ArrowRight,
  ExternalLink,
  Wrench,
  FileText,
  Building2,
  Sliders,
  Zap,
} from 'lucide-react'

interface PipelineStage {
  step: string
  discipline: string
  title: string
  tolerance: string
  summary: string
}

const MANUFACTURING_PIPELINE: PipelineStage[] = [
  {
    step: '01',
    discipline: '5-AXIS MILLING',
    title: 'CNC Milling & Brushless Motor Pairing',
    tolerance: '≤ 0.01mm Concentricity',
    summary:
      'Aircraft-grade 6061-T6 aluminum housings are 5-axis CNC machined and paired with custom coreless motors tested under continuous 8V to 10V load.',
  },
  {
    step: '02',
    discipline: 'METALLURGY',
    title: 'Japanese 316L Steel & 30x Optical Inspection',
    tolerance: '0.25mm to 0.35mm Gauge',
    summary:
      'Surgical 316L stainless needles are lead-free soldered and inspected under 30x magnification to eliminate micro-burrs or hook defects.',
  },
  {
    step: '03',
    discipline: 'FLUID SEAL',
    title: 'Silicone Rebound Membrane & Tip Stabilization',
    tolerance: '100% Backflow Seal',
    summary:
      'Medical-grade PC housings are fitted with high-elasticity silicone membranes that prevent pigment backflow into machine drive mechanisms.',
  },
  {
    step: '04',
    discipline: 'STERILIZATION',
    title: 'Ethylene Oxide (EO) Gas Sterilization & Lot Seal',
    tolerance: '5-Year Sterile Shelf Life',
    summary:
      'Every individual blister is sealed with dialysis-grade paper, EO gas sterilized, and stamped with verifiable batch and expiration telemetry.',
  },
]

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-[100dvh] bg-[#f5f4f0] dark:bg-[#20222a] text-zinc-900 dark:text-zinc-100 font-sans pb-24 transition-colors duration-200">
      {/* 1. HERO SECTION — SWISS INDUSTRIAL DOSSIER */}
      <section className="border-b border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#22252f] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] py-14 sm:py-20">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-[#0d5d50] dark:text-[#38e8c6] text-[11px] font-mono font-bold tracking-wider uppercase">
                <span>FACTORY DOSSIER · DIRECT MANUFACTURER SINCE 2015</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-['Montserrat',sans-serif] font-black uppercase tracking-tight text-zinc-950 dark:text-white leading-[1.06]">
                DIRECT-DRIVE APPARATUS &amp; STERILE STUDIO SUPPLY
              </h1>

              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed max-w-2xl">
                Papa Tattoo Supply engineers and manufactures rotary tattoo machines, 62-configuration sterile needle cartridges, autoclavable click grips, and wireless power architecture directly for licensed studios worldwide.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#0d5d50] dark:hover:bg-[#2dd4b5] active:scale-[0.97] transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] shadow-xs"
                >
                  <span>Explore 26 Hardware Models</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  to="/distributors"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-zinc-400 dark:hover:border-white/25 text-zinc-800 dark:text-zinc-200 text-xs font-mono font-bold uppercase tracking-wider active:scale-[0.97] transition-[transform,border-color,background-color,color] duration-150 ease-[var(--ease-out-strong)]"
                >
                  <Building2 className="w-3.5 h-3.5 text-[#0d5d50] dark:text-[#38e8c6]" />
                  <span>Authorized Distributors</span>
                </Link>
              </div>
            </div>

            {/* Right: 4-Tile Factory Telemetry Matrix */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
              <div className="p-5 rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] flex flex-col justify-between">
                <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                  FOUNDING YEAR
                </div>
                <div className="text-3xl font-black font-mono tabular-nums text-zinc-950 dark:text-white mt-2">
                  2015
                </div>
                <div className="text-[11px] font-mono text-[#0d5d50] dark:text-[#38e8c6] mt-1">
                  6061-T6 CNC Machining
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] flex flex-col justify-between">
                <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                  NEEDLE MATRIX
                </div>
                <div className="text-3xl font-black font-mono tabular-nums text-zinc-950 dark:text-white mt-2">
                  62
                </div>
                <div className="text-[11px] font-mono text-[#0d5d50] dark:text-[#38e8c6] mt-1">
                  316L Surgical Configurations
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] flex flex-col justify-between">
                <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                  STERILIZATION
                </div>
                <div className="text-3xl font-black font-mono tabular-nums text-zinc-950 dark:text-white mt-2">
                  100%
                </div>
                <div className="text-[11px] font-mono text-[#0d5d50] dark:text-[#38e8c6] mt-1">
                  EO Gas Lot Validated
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] flex flex-col justify-between">
                <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                  GLOBAL DISPATCH
                </div>
                <div className="text-3xl font-black font-mono tabular-nums text-zinc-950 dark:text-white mt-2">
                  60+
                </div>
                <div className="text-[11px] font-mono text-[#0d5d50] dark:text-[#38e8c6] mt-1">
                  DHL / UPS / FedEx Express
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 4-STAGE MANUFACTURING & STERILIZATION PIPELINE */}
      <section className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 mb-8 border-b border-[#e2dfd8] dark:border-white/[0.08]">
          <div>
            <div className="text-[11px] font-mono font-bold tracking-widest text-[#0d5d50] dark:text-[#38e8c6] uppercase">
              QUALITY CONTROL ARCHITECTURE
            </div>
            <h2 className="text-2xl sm:text-3xl font-['Montserrat',sans-serif] font-black uppercase tracking-tight text-zinc-950 dark:text-white mt-1">
              4-STAGE PRODUCTION &amp; STERILIZATION PROTOCOL
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-500 uppercase whitespace-nowrap shrink-0">
            FACTORY DIRECT · ZERO INTERMEDIARY MARKUP
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {MANUFACTURING_PIPELINE.map(item => (
            <div
              key={item.step}
              className="rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#22252f] shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] p-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#e2dfd8]/70 dark:border-white/[0.06]">
                  <span className="text-xs font-mono font-black tabular-nums text-[#0d5d50] dark:text-[#38e8c6]">
                    STAGE {item.step}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#f8f7f4] dark:bg-[#181b22] border border-[#e2dfd8] dark:border-white/[0.08] text-[10px] font-mono font-semibold text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                    {item.discipline}
                  </span>
                </div>

                <h3 className="text-base font-bold text-zinc-950 dark:text-white leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#e2dfd8]/70 dark:border-white/[0.06] flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1 font-mono">
                <span className="text-[10px] tracking-wider text-zinc-400 uppercase whitespace-nowrap">
                  TOLERANCE
                </span>
                <span className="text-[11px] font-bold tabular-nums whitespace-nowrap text-zinc-900 dark:text-zinc-200">
                  {item.tolerance}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. DIRECT MANUFACTURER MANIFESTO & APPARATUS DIVISIONS */}
      <section className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-6 rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#22252f] shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] p-7 sm:p-9 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-widest text-[#0d5d50] dark:text-[#38e8c6] uppercase">
                <Award className="w-3.5 h-3.5" />
                <span>MANUFACTURER MANIFESTO</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-['Montserrat',sans-serif] font-black uppercase tracking-tight text-zinc-950 dark:text-white leading-tight">
                BUILT FOR WORKING PARLORS, NOT RESELLER TIERS
              </h2>

              <div className="space-y-3.5 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                <p>
                  Papa Tattoo Supply operates as an integrated hardware manufacturer. Every rotary pen chassis, click-adjustment grip collar, and membrane cartridge mold is engineered in-house for daily studio reliability.
                </p>
                <p>
                  By shipping directly from our production floor and authorized regional depots to licensed studios, we eliminate distributor middleman inflation while maintaining strict batch-level quality control.
                </p>
                <p>
                  Whether equipping a single workstation with a wireless Papa Pen V3 Pro or supplying a multi-chair parlor with bulk EO-sterilized cartridge boxes, every order carries verified factory traceability.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#e2dfd8]/70 dark:border-white/[0.06] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
              <span className="text-zinc-500">ISO-COMPLIANT STERILE PACKAGING</span>
              <Link
                to="/sponsorship-artists"
                className="inline-flex items-center gap-1.5 font-bold text-[#0d5d50] dark:text-[#38e8c6] hover:underline"
              >
                <span>Meet Our 40 Sponsored Pro Artists</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right: 4 Core Hardware Divisions */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/collections"
              search={{ category: 'machines' }}
              className="group p-6 rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#22252f] shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-zinc-400 dark:hover:border-white/25 active:scale-[0.98] transition-[transform,border-color,box-shadow] duration-200 ease-[var(--ease-out-strong)] flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#f8f7f4] dark:bg-[#181b22] border border-[#e2dfd8] dark:border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-[#0d5d50] dark:text-[#38e8c6] flex items-center justify-center">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="font-mono font-bold text-sm text-zinc-950 dark:text-white uppercase group-hover:text-[#0d5d50] dark:group-hover:text-[#38e8c6] transition-colors duration-150">
                  Rotary &amp; Wireless Pens
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  6061-T6 aircraft aluminum frames with coreless brushless drive systems and RCA/wireless dual modules.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#e2dfd8]/70 dark:border-white/[0.06] flex items-center justify-between text-[11px] font-mono font-bold tabular-nums text-zinc-700 dark:text-zinc-300">
                <span>6 MACHINE FAMILIES</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200 ease-[var(--ease-out-strong)]" />
              </div>
            </Link>

            <Link
              to="/collections"
              search={{ category: 'cartridges' }}
              className="group p-6 rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#22252f] shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-zinc-400 dark:hover:border-white/25 active:scale-[0.98] transition-[transform,border-color,box-shadow] duration-200 ease-[var(--ease-out-strong)] flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#f8f7f4] dark:bg-[#181b22] border border-[#e2dfd8] dark:border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-[#0d5d50] dark:text-[#38e8c6] flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-mono font-bold text-sm text-zinc-950 dark:text-white uppercase group-hover:text-[#0d5d50] dark:group-hover:text-[#38e8c6] transition-colors duration-150">
                  316L Sterile Cartridges
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  RL, RS, M1, and CM configurations with safety rebound membranes and medical PC tips.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#e2dfd8]/70 dark:border-white/[0.06] flex items-center justify-between text-[11px] font-mono font-bold tabular-nums text-zinc-700 dark:text-zinc-300">
                <span>62 NEEDLE SIZES</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200 ease-[var(--ease-out-strong)]" />
              </div>
            </Link>

            <Link
              to="/collections"
              search={{ category: 'grips' }}
              className="group p-6 rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#22252f] shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-zinc-400 dark:hover:border-white/25 active:scale-[0.98] transition-[transform,border-color,box-shadow] duration-200 ease-[var(--ease-out-strong)] flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#f8f7f4] dark:bg-[#181b22] border border-[#e2dfd8] dark:border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-[#0d5d50] dark:text-[#38e8c6] flex items-center justify-center">
                  <Sliders className="w-5 h-5" />
                </div>
                <h3 className="font-mono font-bold text-sm text-zinc-950 dark:text-white uppercase group-hover:text-[#0d5d50] dark:group-hover:text-[#38e8c6] transition-colors duration-150">
                  Click &amp; Disposable Grips
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Autoclavable ratcheting aluminum click grips and ergonomic TPR disposable cartridge tubes.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#e2dfd8]/70 dark:border-white/[0.06] flex items-center justify-between text-[11px] font-mono font-bold tabular-nums text-zinc-700 dark:text-zinc-300">
                <span>7 GRIP SYSTEMS</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200 ease-[var(--ease-out-strong)]" />
              </div>
            </Link>

            <Link
              to="/collections"
              search={{ category: 'power' }}
              className="group p-6 rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#22252f] shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-zinc-400 dark:hover:border-white/25 active:scale-[0.98] transition-[transform,border-color,box-shadow] duration-200 ease-[var(--ease-out-strong)] flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#f8f7f4] dark:bg-[#181b22] border border-[#e2dfd8] dark:border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-[#0d5d50] dark:text-[#38e8c6] flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-mono font-bold text-sm text-zinc-950 dark:text-white uppercase group-hover:text-[#0d5d50] dark:group-hover:text-[#38e8c6] transition-colors duration-150">
                  Power &amp; Studio Cordage
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  OLED wireless battery packs, regulated benchtop power supplies, and pure-copper RCA/clip cords.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#e2dfd8]/70 dark:border-white/[0.06] flex items-center justify-between text-[11px] font-mono font-bold tabular-nums text-zinc-700 dark:text-zinc-300">
                <span>9 POWER UNITS</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200 ease-[var(--ease-out-strong)]" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. STUDIO GUARANTEES & LOGISTICS STANDARDS */}
      <section className="bg-[#f8f7f4] dark:bg-[#181b22] border-y border-[#e2dfd8] dark:border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] py-16">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-mono font-bold tracking-widest text-[#0d5d50] dark:text-[#38e8c6] uppercase">
                COMMERCIAL STUDIO STANDARDS
              </div>
              <h2 className="text-2xl sm:text-3xl font-['Montserrat',sans-serif] font-black text-zinc-950 dark:text-white uppercase tracking-tight mt-1">
                LOGISTICS, WARRANTY &amp; CHECKOUT SECURITY
              </h2>
            </div>
            <Globe className="w-5 h-5 text-zinc-400 hidden sm:block" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-7 rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#22252f] shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] space-y-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#f8f7f4] dark:bg-[#181b22] border border-[#e2dfd8] dark:border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-[#0d5d50] dark:text-[#38e8c6] flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-mono font-black text-sm text-zinc-950 dark:text-white uppercase">
                24H PRIORITY STUDIO DISPATCH
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Orders ship via UPS Ground, 3 Day Select, 2nd Day Air, Next Day Air, and DHL Express. Live airway bill tracking is issued immediately upon warehouse scan.
              </p>
            </div>

            <div className="p-7 rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#22252f] shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] space-y-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#f8f7f4] dark:bg-[#181b22] border border-[#e2dfd8] dark:border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-[#0d5d50] dark:text-[#38e8c6] flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="font-mono font-black text-sm text-zinc-950 dark:text-white uppercase">
                14-DAY FACTORY QA GUARANTEE
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Hardware or unopened consumables with any manufacturing discrepancy qualify for immediate replacement or full refund within 14 days of delivery, with return freight covered.
              </p>
            </div>

            <div className="p-7 rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#22252f] shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] space-y-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#f8f7f4] dark:bg-[#181b22] border border-[#e2dfd8] dark:border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-[#0d5d50] dark:text-[#38e8c6] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-mono font-black text-sm text-zinc-950 dark:text-white uppercase">
                PCI-DSS LEVEL 1 ENCRYPTED CHECKOUT
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                All studio transactions run over 256-bit TLS encrypted Shopify Storefront infrastructure, protecting studio billing credentials and international commercial invoices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. OFFICIAL MACHINE REPAIR & RMA SERVICE BENCH */}
      <section className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#22252f] shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] p-7 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6] uppercase">
              <Wrench className="w-4 h-4" />
              <span>OFFICIAL PAPA RMA &amp; MOTOR CALIBRATION BENCH</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-['Montserrat',sans-serif] font-black uppercase tracking-tight text-zinc-950 dark:text-white">
              PAPA MACHINE REPAIR &amp; WARRANTY SERVICE
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Need cam stroke maintenance, O-ring service, or coreless motor diagnostics for your Papa Pen or rotary machine? Download the official RMA Repair Form to enclose with your parcel, or open a service ticket with our engineering desk.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 w-full lg:w-auto">
            <a
              href="https://drive.google.com/file/d/1nMPw2A9x_AwQnlFp0yew_2XNbMBKoiEf/view"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#0d5d50] dark:hover:bg-[#2dd4b5] active:scale-[0.97] transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] cursor-pointer shadow-xs"
            >
              <FileText className="w-4 h-4" />
              <span>Download RMA Form (PDF)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <Link
              to="/contact"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-zinc-400 dark:hover:border-white/25 text-zinc-800 dark:text-zinc-200 text-xs font-mono font-bold uppercase tracking-wider active:scale-[0.97] transition-[transform,border-color,background-color,color] duration-150 ease-[var(--ease-out-strong)]"
            >
              <span>Open Service Ticket</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
