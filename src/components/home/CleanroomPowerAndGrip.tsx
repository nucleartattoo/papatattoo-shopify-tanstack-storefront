import React from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, BatteryCharging, Gauge } from 'lucide-react'
import { ParallaxApparatusStage } from '../common/ParallaxApparatusStage'

export const CleanroomPowerAndGrip: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1440px] mx-auto text-[#1d1d1f] dark:text-[#f5f5f7]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
        {/* Module 1: Papa Volt Wireless Battery */}
        <div className="rounded-[32px] bg-[#F5F5F7] dark:bg-[#121214] p-8 sm:p-12 flex flex-col justify-between border border-black/[0.03] dark:border-white/[0.05]">
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider block">
              5V - 12V Regulated DC · Universal RCA
            </span>
            <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f] dark:text-white">
              Papa Volt Wireless Power.
            </h2>
            <p className="text-sm sm:text-base text-[#86868b] leading-relaxed">
              Ultra-compact 2,000 mAh pure lithium dock delivering up to 8 hours of low-ripple voltage without cord drag.
            </p>
          </div>

          <div className="my-8 flex items-center justify-center">
            <ParallaxApparatusStage
              imageSrc="/product-images/img_041_papa_volt_large_cutout.webp"
              alt="Papa Volt Wireless Battery"
              accentColor="cyan"
              baseRotation={4}
              className="max-w-[320px] sm:max-w-[360px]"
            />
          </div>

          <div className="space-y-6 pt-6 border-t border-black/[0.06] dark:border-white/[0.08]">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="text-xl sm:text-2xl font-semibold text-[#1d1d1f] dark:text-white block tabular-nums">
                  2,000 mAh
                </span>
                <span className="text-xs text-[#86868b]">Lithium Cell</span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-semibold text-[#1d1d1f] dark:text-white block tabular-nums">
                  5V - 12V
                </span>
                <span className="text-xs text-[#86868b]">Clean Drive</span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-semibold text-[#1d1d1f] dark:text-white block">
                  USB-C
                </span>
                <span className="text-xs text-[#86868b]">Fast Charge</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                to="/products/$handle"
                params={{ handle: 'papa-volt-battery' }}
                className="px-6 py-3 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-xs font-medium inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity"
              >
                <span>Explore Papa Volt</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-xs font-medium text-[#86868b]">
                $129.00 USD
              </span>
            </div>
          </div>
        </div>

        {/* Module 2: CNC Click Grips */}
        <div className="rounded-[32px] bg-[#F5F5F7] dark:bg-[#121214] p-8 sm:p-12 flex flex-col justify-between border border-black/[0.03] dark:border-white/[0.05]">
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider block">
              6061-T6 Billet Aluminum · Autoclavable
            </span>
            <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f] dark:text-white">
              CNC Ratchet Click Grips.
            </h2>
            <p className="text-sm sm:text-base text-[#86868b] leading-relaxed">
              Ratcheted millimeter click-stop needle depth locking shifts balance forward to eliminate wrist tendon strain.
            </p>
          </div>

          <div className="my-8 flex items-center justify-center">
            <ParallaxApparatusStage
              imageSrc="/product-images/img_111_papa_adjustment_grips_1__cutout.webp"
              alt="Papa CNC Adjustable Click Grip"
              accentColor="emerald"
              baseRotation={-4}
              className="max-w-[320px] sm:max-w-[360px]"
            />
          </div>

          <div className="space-y-6 pt-6 border-t border-black/[0.06] dark:border-white/[0.08]">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="text-xl sm:text-2xl font-semibold text-[#1d1d1f] dark:text-white block">
                  6061-T6
                </span>
                <span className="text-xs text-[#86868b]">Anodized Alloy</span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-semibold text-[#1d1d1f] dark:text-white block">
                  Click-Stop
                </span>
                <span className="text-xs text-[#86868b]">Depth Lock</span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-semibold text-[#1d1d1f] dark:text-white block tabular-nums">
                  134 °C
                </span>
                <span className="text-xs text-[#86868b]">Autoclave Safe</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                to="/products"
                search={{ category: 'grips' }}
                className="px-6 py-3 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-xs font-medium inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity"
              >
                <span>Explore 8 Grip Models</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-xs font-medium text-[#86868b]">
                From $79.95 USD
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
