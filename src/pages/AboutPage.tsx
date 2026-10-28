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
    discipline: '5-Axis Milling',
    title: 'CNC Milling & Motor Pairing',
    tolerance: '≤ 0.01mm Concentricity',
    summary:
      'Aircraft-grade 6061-T6 aluminum housings are 5-axis CNC machined and paired with custom coreless motors tested under continuous 8V to 10V load.',
  },
  {
    step: '02',
    discipline: 'Metallurgy',
    title: 'Japanese 316L Steel & 30x Optical QC',
    tolerance: '0.25mm to 0.35mm Gauge',
    summary:
      'Surgical 316L stainless needles are lead-free soldered and inspected under 30x magnification to eliminate micro-burrs or hook defects.',
  },
  {
    step: '03',
    discipline: 'Fluid Seal',
    title: 'Silicone Rebound Membrane',
    tolerance: '100% Backflow Seal',
    summary:
      'Medical-grade PC housings are fitted with high-elasticity silicone membranes that prevent pigment backflow into machine drive mechanisms.',
  },
  {
    step: '04',
    discipline: 'Sterilization',
    title: 'Ethylene Oxide (EO) Gas Sterilization',
    tolerance: '5-Year Sterile Shelf Life',
    summary:
      'Every individual blister is sealed with dialysis-grade paper, EO gas sterilized, and stamped with verifiable batch and expiration telemetry.',
  },
]

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-[100dvh] bg-[#f5f5f7] dark:bg-black text-[#1d1d1f] dark:text-[#f5f5f7] font-sans pb-24 transition-colors duration-200">
      {/* 1. HERO SECTION */}
      <section className="pt-12 sm:pt-20 pb-12 sm:pb-16">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/[0.045] dark:bg-white/[0.08] text-xs font-medium text-[#86868b]">
                <span>Factory Dossier · Direct Manufacturer Since 2015</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-semibold tracking-[-0.035em] text-[#1d1d1f] dark:text-[#f5f5f7] leading-[1.06]">
                Direct-Drive Apparatus &amp; Sterile Studio Supply
              </h1>

              <p className="text-base sm:text-lg text-[#86868b] leading-relaxed max-w-2xl font-normal">
                Papa Tattoo Supply engineers and manufactures rotary tattoo machines, 62-configuration sterile needle cartridges, autoclavable click grips, and wireless power architecture directly for licensed studios worldwide.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-sm font-medium hover:opacity-85 active:scale-[0.97] transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] cursor-pointer"
                >
                  <span>Explore 26 Hardware Models</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/distributors"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7] active:scale-[0.97] transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-[#86868b]" />
                  <span>Authorized Distributors</span>
                </Link>
              </div>
            </div>

            {/* Right: 4-Tile Factory Telemetry Matrix */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="p-6 rounded-[24px] bg-white dark:bg-[#121214] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)] flex flex-col justify-between">
                <div className="text-xs font-medium text-[#86868b]">
                  Founding Year
                </div>
                <div className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] tabular-nums text-[#1d1d1f] dark:text-[#f5f5f7] mt-3">
                  2015
                </div>
                <div className="text-xs text-[#86868b] mt-1.5 font-medium">
                  6061-T6 CNC Machining
                </div>
              </div>

              <div className="p-6 rounded-[24px] bg-white dark:bg-[#121214] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)] flex flex-col justify-between">
                <div className="text-xs font-medium text-[#86868b]">
                  Needle Matrix
                </div>
                <div className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] tabular-nums text-[#1d1d1f] dark:text-[#f5f5f7] mt-3">
                  62
                </div>
                <div className="text-xs text-[#86868b] mt-1.5 font-medium">
                  316L Surgical Configs
                </div>
              </div>

              <div className="p-6 rounded-[24px] bg-white dark:bg-[#121214] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)] flex flex-col justify-between">
                <div className="text-xs font-medium text-[#86868b]">
                  Sterilization
                </div>
                <div className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] tabular-nums text-[#1d1d1f] dark:text-[#f5f5f7] mt-3">
                  100%
                </div>
                <div className="text-xs text-[#86868b] mt-1.5 font-medium">
                  EO Gas Lot Validated
                </div>
              </div>

              <div className="p-6 rounded-[24px] bg-white dark:bg-[#121214] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)] flex flex-col justify-between">
                <div className="text-xs font-medium text-[#86868b]">
                  Global Dispatch
                </div>
                <div className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] tabular-nums text-[#1d1d1f] dark:text-[#f5f5f7] mt-3">
                  60+
                </div>
                <div className="text-xs text-[#86868b] mt-1.5 font-medium">
                  Express Air Logistics
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 4-STAGE MANUFACTURING & STERILIZATION PIPELINE */}
      <section className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 mb-10 border-b border-black/[0.06] dark:border-white/[0.08]">
          <div>
            <div className="text-xs font-medium text-[#86868b]">
              Quality Control Architecture
            </div>
            <h2 className="text-2xl sm:text-4xl font-semibold tracking-[-0.025em] text-[#1d1d1f] dark:text-[#f5f5f7] mt-1.5">
              4-Stage Production &amp; Sterilization Protocol
            </h2>
          </div>
          <span className="text-xs font-medium text-[#86868b] whitespace-nowrap shrink-0">
            Factory Direct · Zero Intermediary Markup
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MANUFACTURING_PIPELINE.map(item => (
            <div
              key={item.step}
              className="rounded-[28px] bg-white dark:bg-[#121214] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)] p-7 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
                  <span className="text-xs font-semibold tabular-nums text-[#86868b]">
                    Stage {item.step}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-black/[0.045] dark:bg-white/[0.08] text-[11px] font-medium text-[#86868b]">
                    {item.discipline}
                  </span>
                </div>

                <h3 className="text-base font-semibold tracking-[-0.015em] text-[#1d1d1f] dark:text-[#f5f5f7] leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-xs">
                <span className="text-[#86868b]">Tolerance</span>
                <span className="font-semibold tabular-nums text-[#1d1d1f] dark:text-[#f5f5f7]">
                  {item.tolerance}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. DIRECT MANUFACTURER MANIFESTO & APPARATUS DIVISIONS */}
      <section className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-6 rounded-[32px] bg-white dark:bg-[#121214] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)] p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#86868b]">
                <Award className="w-4 h-4 text-[#86868b]" />
                <span>Manufacturer Manifesto</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-semibold tracking-[-0.025em] text-[#1d1d1f] dark:text-[#f5f5f7] leading-tight">
                Built for Working Parlors, Not Reseller Tiers
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-[#86868b] leading-relaxed font-normal">
                <p>
                  Papa Tattoo Supply operates as an integrated hardware manufacturer. Every rotary pen chassis, click-adjustment grip collar, and membrane cartridge mold is engineered in-house for daily studio reliability.
                </p>
                <p>
                  By shipping directly from our production floor and authorized regional depots to licensed studios, we eliminate distributor middleman inflation while maintaining strict batch-level quality control.
                </p>
                <p>
                  Whether equipping a single workstation with a wireless Papa Pen V3 or supplying a multi-chair parlor with bulk EO-sterilized cartridge boxes, every order carries verified factory traceability.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-black/[0.06] dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-4 text-xs">
              <span className="text-[#86868b]">ISO-Compliant Sterile Packaging</span>
              <Link
                to="/sponsorship-artists"
                className="inline-flex items-center gap-1.5 font-medium text-[#1d1d1f] dark:text-[#f5f5f7] hover:underline"
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
              className="group p-6 rounded-[28px] bg-white dark:bg-[#121214] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)] active:scale-[0.98] transition-[transform,box-shadow] duration-200 ease-[var(--ease-out-strong)] flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center justify-center">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-base text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors duration-150">
                  Rotary &amp; Wireless Pens
                </h3>
                <p className="text-xs text-[#86868b] leading-relaxed">
                  6061-T6 aircraft aluminum frames with coreless brushless drive systems and RCA/wireless dual modules.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
                <span>6 Machine Families</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200 ease-[var(--ease-out-strong)]" />
              </div>
            </Link>

            <Link
              to="/collections"
              search={{ category: 'cartridges' }}
              className="group p-6 rounded-[28px] bg-white dark:bg-[#121214] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)] active:scale-[0.98] transition-[transform,box-shadow] duration-200 ease-[var(--ease-out-strong)] flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-base text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors duration-150">
                  316L Sterile Cartridges
                </h3>
                <p className="text-xs text-[#86868b] leading-relaxed">
                  RL, RS, M1, and CM configurations with safety rebound membranes and medical PC tips.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
                <span>62 Needle Sizes</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200 ease-[var(--ease-out-strong)]" />
              </div>
            </Link>

            <Link
              to="/collections"
              search={{ category: 'grips' }}
              className="group p-6 rounded-[28px] bg-white dark:bg-[#121214] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)] active:scale-[0.98] transition-[transform,box-shadow] duration-200 ease-[var(--ease-out-strong)] flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center justify-center">
                  <Sliders className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-base text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors duration-150">
                  Click &amp; Disposable Grips
                </h3>
                <p className="text-xs text-[#86868b] leading-relaxed">
                  Autoclavable ratcheting aluminum click grips and ergonomic TPR disposable cartridge tubes.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
                <span>7 Grip Systems</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200 ease-[var(--ease-out-strong)]" />
              </div>
            </Link>

            <Link
              to="/collections"
              search={{ category: 'power' }}
              className="group p-6 rounded-[28px] bg-white dark:bg-[#121214] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)] active:scale-[0.98] transition-[transform,box-shadow] duration-200 ease-[var(--ease-out-strong)] flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-base text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors duration-150">
                  Power &amp; Studio Cordage
                </h3>
                <p className="text-xs text-[#86868b] leading-relaxed">
                  OLED wireless battery packs, regulated benchtop power supplies, and pure-copper RCA/clip cords.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
                <span>9 Power Units</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200 ease-[var(--ease-out-strong)]" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. STUDIO GUARANTEES & LOGISTICS STANDARDS */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-medium text-[#86868b]">
                Commercial Studio Standards
              </div>
              <h2 className="text-2xl sm:text-4xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-[-0.025em] mt-1.5">
                Logistics, Warranty &amp; Checkout Security
              </h2>
            </div>
            <Globe className="w-5 h-5 text-[#86868b] hidden sm:block" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-[28px] bg-white dark:bg-[#121214] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-[#1d1d1f] dark:text-[#f5f5f7] tracking-[-0.015em]">
                24h Priority Studio Dispatch
              </h3>
              <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                Orders ship via UPS Ground, 3 Day Select, 2nd Day Air, Next Day Air, and DHL Express. Live airway bill tracking is issued immediately upon warehouse scan.
              </p>
            </div>

            <div className="p-8 rounded-[28px] bg-white dark:bg-[#121214] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-[#1d1d1f] dark:text-[#f5f5f7] tracking-[-0.015em]">
                14-Day Factory QA Guarantee
              </h3>
              <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                Hardware or unopened consumables with any manufacturing discrepancy qualify for immediate replacement or full refund within 14 days of delivery, with return freight covered.
              </p>
            </div>

            <div className="p-8 rounded-[28px] bg-white dark:bg-[#121214] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-[#1d1d1f] dark:text-[#f5f5f7] tracking-[-0.015em]">
                PCI-DSS Level 1 Encrypted Checkout
              </h3>
              <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                All studio transactions run over 256-bit TLS encrypted Shopify Storefront infrastructure, protecting studio billing credentials and international commercial invoices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. OFFICIAL MACHINE REPAIR & RMA SERVICE BENCH */}
      <section className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[32px] bg-white dark:bg-[#121214] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)] p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-[#86868b]">
              <Wrench className="w-4 h-4" />
              <span>Official Papa RMA &amp; Motor Calibration Bench</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-[#1d1d1f] dark:text-[#f5f5f7]">
              Papa Machine Repair &amp; Warranty Service
            </h3>
            <p className="text-sm text-[#86868b] leading-relaxed">
              Need cam stroke maintenance, O-ring service, or coreless motor diagnostics for your Papa Pen or rotary machine? Download the official RMA Repair Form to enclose with your parcel, or open a service ticket with our engineering desk.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 w-full lg:w-auto">
            <a
              href="https://drive.google.com/file/d/1nMPw2A9x_AwQnlFp0yew_2XNbMBKoiEf/view"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-sm font-medium hover:opacity-85 active:scale-[0.97] transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Download RMA Form</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>

            <Link
              to="/contact"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7] active:scale-[0.97] transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)]"
            >
              <span>Open Service Ticket</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
