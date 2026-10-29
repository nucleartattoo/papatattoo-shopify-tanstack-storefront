import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Cpu, Layers, Zap, CheckCircle2 } from 'lucide-react'

interface EngineeringPillar {
  id: string
  pillLabel: string
  headline: string
  subheadline: string
  primaryMetric: string
  metricLabel: string
  secondaryMetric: string
  secondaryMetricLabel: string
  narrative: string
  bulletPoints: string[]
  imageSrc: string
  imageAlt: string
  productHandle: string
  ctaText: string
}

const ARCHITECTURE_PILLARS: EngineeringPillar[] = [
  {
    id: 'coreless-drive',
    pillLabel: 'Motor Engineering',
    headline: 'High-Torque German Coreless Drive',
    subheadline: 'Steady rotational inertia at 10,500 RPM with near-zero deflection.',
    primaryMetric: '10,500 RPM',
    metricLabel: 'Peak Torque Velocity',
    secondaryMetric: '< 0.02 mm',
    secondaryMetricLabel: 'Needle Cam Play',
    narrative:
      'Engineered specifically for pro tattooers who demand consistent needle hit without thermal drift. The direct-drive rotor eliminates micro-stalls across dense fibrous skin.',
    bulletPoints: [
      'Low vibration harmonics reduce hand tingling over 8-hour passes',
      'Instantaneous needle start-stop protects delicate epidermal layers',
      'Stable torque delivery from 5V delicate shading up to 12V heavy packing',
    ],
    imageSrc: '/product-images/img_214_img_5795_cutout.webp',
    imageAlt: 'Papa Pen V3 German Coreless Motor Assembly',
    productHandle: 'papa-pen-v3-black-full-set',
    ctaText: 'Explore Papa Pen V3',
  },
  {
    id: 'billet-chassis',
    pillLabel: 'Chassis Metallurgy',
    headline: 'Monolithic 6061-T6 Aerospace Alloy',
    subheadline: 'Forward-weighted mass center relieves tendon and wrist tension.',
    primaryMetric: '134 g',
    metricLabel: 'Forward-Biased Mass',
    secondaryMetric: '35 µm',
    secondaryMetricLabel: 'Hard Anodized Depth',
    narrative:
      'Milled from a solid billet of aircraft-grade 6061-T6 aluminum. Every curve and taper is mathematically biased toward the needle cartridge tip for natural gravity balance.',
    bulletPoints: [
      'Ergonomic 33 mm grip contour matches natural artist pencil pinch',
      'Resistant to hospital-grade sanitizers and ultrasonic bath cleaners',
      'Autoclave compatible detachable grip housing rated to 134 °C',
    ],
    imageSrc: '/product-images/img_026_black_cutout.webp',
    imageAlt: 'Papa Pen V2 Aerospace 6061-T6 Billet Chassis',
    productHandle: 'papa-pen-v2-1',
    ctaText: 'Explore Papa Pen V2',
  },
  {
    id: 'modular-power',
    pillLabel: 'Wireless Interface',
    headline: 'Papa Volt Cordless Dock Architecture',
    subheadline: 'Up to 8 hours of regulated clean voltage without tether drag.',
    primaryMetric: '2,000 mAh',
    metricLabel: 'Pure Lithium Cell',
    secondaryMetric: '5V - 12V',
    secondaryMetricLabel: 'OLED Stepped Control',
    narrative:
      'Eliminate bulky clip cords and pedal tangles. The modular battery docks directly onto the machine tail with balanced weight distribution and tactile push-button voltage steps.',
    bulletPoints: [
      'USB-C fast charge protocol restores 80% capacity in 45 minutes',
      'Gold-plated RCA contacts maintain zero signal resistance',
      'Integrated jumpstart circuit kicks stiffest 27-magnum needle bars',
    ],
    imageSrc: '/product-images/img_041_papa_volt_large_cutout.webp',
    imageAlt: 'Papa Volt Modular Wireless Battery Dock',
    productHandle: 'papa-volt-battery',
    ctaText: 'Explore Papa Volt',
  },
]

export const HardwareArchitectureStory: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0)
  const currentPillar = ARCHITECTURE_PILLARS[activeTab] || ARCHITECTURE_PILLARS[0]

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1440px] mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.035em] text-[#1d1d1f] dark:text-[#f5f5f7] leading-[1.05]">
          Precision Engineering. Inside and Out.
        </h2>
        <p className="text-base sm:text-lg text-[#86868b] leading-relaxed max-w-2xl mx-auto">
          Every tolerance is calibrated to sub-millimeter precision for unyielding reliability in professional studios.
        </p>
      </div>

      {/* Apple-Style Segmented Navigation Bar */}
      <div className="flex justify-center mb-10 sm:mb-14">
        <div
          role="tablist"
          aria-label="Engineering innovations"
          className="inline-flex max-w-full overflow-x-auto no-scrollbar items-center gap-1.5 p-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08]"
        >
          {ARCHITECTURE_PILLARS.map((pillar, index) => {
            const isSelected = index === activeTab
            return (
              <button
                key={pillar.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveTab(index)}
                className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-[transform,background-color,color,box-shadow] duration-200 ease-[var(--ease-spring)] active:scale-[0.97] cursor-pointer ${
                  isSelected
                    ? 'bg-white text-[#1d1d1f] dark:bg-[#2c2c2e] dark:text-white shadow-[0_2px_10px_rgba(0,0,0,0.08)]'
                    : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                }`}
              >
                {pillar.pillLabel}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Architectural Showcase Container */}
      <div className="rounded-[32px] bg-white dark:bg-[#121214] p-8 sm:p-12 lg:p-16 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.06)] dark:shadow-[0_30px_70px_-24px_rgba(0,0,0,0.7)] transition-all duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Visual Apparatus Specimen */}
          <div className="lg:col-span-6 flex items-center justify-center relative min-h-[300px] sm:min-h-[380px] lg:min-h-[460px] rounded-2xl bg-[#f5f5f7] dark:bg-[#1c1c1e]/60 p-8 overflow-hidden group">
            {/* Subtle Radial Glow */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-radial from-black/[0.03] dark:from-white/[0.04] to-transparent pointer-events-none"
            />

            <img
              key={currentPillar.id}
              src={currentPillar.imageSrc}
              alt={currentPillar.imageAlt}
              className="relative z-10 max-h-[320px] sm:max-h-[380px] w-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_24px_50px_rgba(0,0,0,0.8)] transition-all duration-300 ease-[var(--ease-spring)] group-hover:scale-[1.03]"
              loading="lazy"
            />
          </div>

          {/* Right Column: Detailed Engineering Data & Telemetry */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2.5">
              <span className="text-xs font-semibold text-[#86868b] uppercase tracking-wide">
                {currentPillar.pillLabel}
              </span>
              <h3 className="text-2xl sm:text-4xl font-semibold tracking-[-0.03em] text-[#1d1d1f] dark:text-[#f5f5f7] leading-tight">
                {currentPillar.headline}
              </h3>
              <p className="text-base text-[#86868b] leading-relaxed">
                {currentPillar.subheadline}
              </p>
            </div>

            {/* Apple-Style Telemetry Metrics Strip */}
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-black/[0.06] dark:border-white/[0.08]">
              <div>
                <span className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-[#1d1d1f] dark:text-[#f5f5f7] tabular-nums block">
                  {currentPillar.primaryMetric}
                </span>
                <span className="text-xs text-[#86868b] mt-0.5 block">
                  {currentPillar.metricLabel}
                </span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-[#1d1d1f] dark:text-[#f5f5f7] tabular-nums block">
                  {currentPillar.secondaryMetric}
                </span>
                <span className="text-xs text-[#86868b] mt-0.5 block">
                  {currentPillar.secondaryMetricLabel}
                </span>
              </div>
            </div>

            {/* Technical Highlights Checklist */}
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#1d1d1f]/85 dark:text-[#f5f5f7]/85">
              {currentPillar.bulletPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            {/* Direct Action Link */}
            <div className="pt-2">
              <Link
                to="/products/$handle"
                params={{ handle: currentPillar.productHandle }}
                className="px-6 py-3 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-xs sm:text-sm font-medium inline-flex items-center gap-2 hover:opacity-88 transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97]"
              >
                <span>{currentPillar.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
