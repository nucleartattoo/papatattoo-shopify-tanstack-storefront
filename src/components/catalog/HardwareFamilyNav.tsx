import React from 'react'
import { ShopifyProduct } from '../../types/shopify'
import { getRepresentativeImage } from '../../lib/hardwareLineup'

export interface FamilyNavDefinition {
  id: string
  label: string
  sublabel: string
  telemetry: string
  preferredHandles: string[]
  fallbackImage: string
}

export const HARDWARE_FAMILIES: FamilyNavDefinition[] = [
  {
    id: 'all',
    label: 'All Apparatus',
    sublabel: 'Full Hardware Archive',
    telemetry: 'Consolidated',
    preferredHandles: [
      'papa-pen-v3-black-full-set',
      'papa-premium-tattoo-cartridges',
      'papa-adjustable-click-grip-v2-blue',
    ],
    fallbackImage: '/product-images/img_113_papa_pen_jet_black_1__cutout.webp',
  },
  {
    id: 'machines',
    label: 'Rotary Machines',
    sublabel: 'Pen V3, V2 & Apollo',
    telemetry: '3.5 to 4.5 mm',
    preferredHandles: [
      'papa-pen-v3-black-full-set',
      'papa-pen-v2-1',
      'papa-pen-jet-black',
    ],
    fallbackImage: '/product-images/img_113_papa_pen_jet_black_1__cutout.webp',
  },
  {
    id: 'cartridges',
    label: 'Cartridges',
    sublabel: 'Premium 316L & Standard',
    telemetry: '62 Configs',
    preferredHandles: [
      'papa-premium-tattoo-cartridges',
      'papa-standard-tattoo-cartridges',
    ],
    fallbackImage: '/product-images/papa-premium-tattoo-cartridges-round-cutout.webp',
  },
  {
    id: 'grips',
    label: 'Click Grips',
    sublabel: 'V2, V3 & Disposables',
    telemetry: '6061-T6 Alloy',
    preferredHandles: [
      'papa-adjustable-click-grip-v2-blue',
      'papa-adjustable-click-grip-blue',
      'papa-adjustable-grip-v3-33-mm-black',
    ],
    fallbackImage: '/product-images/img_111_papa_adjustment_grips_1__cutout.webp',
  },
  {
    id: 'power',
    label: 'Wireless Power',
    sublabel: 'Volt OLED & Gold RCA',
    telemetry: '5 to 13 V DC',
    preferredHandles: [
      'papa-volt-battery',
      'papa-power-bullet',
      'papa-foot-pedal',
    ],
    fallbackImage: '/product-images/img_041_papa_volt_large_cutout.webp',
  },
  {
    id: 'accessories',
    label: 'Studio & Gear',
    sublabel: 'Workstation Trays & Cases',
    telemetry: 'Parlor Setup',
    preferredHandles: [
      'papa-travel-case',
      'papa-tray-large',
      'stencilock',
      'papa-apron',
    ],
    fallbackImage: '/product-images/img_021_papa_v3_full_case-2_1_cutout.webp',
  },
]

interface HardwareFamilyNavProps {
  activeCategory: string
  onSelectCategory: (category: string) => void
  categoryCounts: Record<string, number>
  products: ShopifyProduct[]
}

export const HardwareFamilyNav: React.FC<HardwareFamilyNavProps> = ({
  activeCategory,
  onSelectCategory,
  categoryCounts,
  products,
}) => {
  return (
    <nav
      aria-label="Hardware Families Navigation"
      className="w-full"
    >
      {/* Mobile: Horizontal scroll with edge padding; Desktop: 6-column grid */}
      <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto no-scrollbar py-1 px-1 -mx-1">
        {HARDWARE_FAMILIES.map(family => {
          const isSelected = activeCategory === family.id
          const count =
            family.id === 'all'
              ? categoryCounts.all || products.length
              : categoryCounts[family.id] ?? 0

          const specimenImg = getRepresentativeImage(
            products,
            family.preferredHandles,
            family.fallbackImage
          )

          return (
            <button
              key={family.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelectCategory(family.id)}
              className={`group text-left shrink-0 w-[148px] sm:w-auto rounded-2xl p-3 flex flex-col justify-between transition-[background-color,border-color,box-shadow,transform] duration-200 ease-[var(--ease-out-strong)] active:scale-[0.98] cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-white dark:bg-[#1c1f28] border-2 border-[#1d1d1f] dark:border-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                  : 'bg-white/80 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] hover:bg-white dark:hover:bg-white/[0.06] hover:border-black/15 dark:hover:border-white/20'
              }`}
            >
              {/* Top Row: Hero Metric & Count Tag */}
              <div className="flex items-center justify-between gap-1 w-full">
                <span
                  className={`text-[10px] font-mono font-medium tracking-tight truncate ${
                    isSelected
                      ? 'text-[#1d1d1f] dark:text-white font-semibold'
                      : 'text-[#86868b]'
                  }`}
                >
                  {family.telemetry}
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono tabular-nums ${
                    isSelected
                      ? 'bg-black text-white dark:bg-white dark:text-black font-semibold'
                      : 'bg-black/[0.04] dark:bg-white/[0.06] text-[#86868b]'
                  }`}
                >
                  {count}
                </span>
              </div>

              {/* Center: Hardware Specimen Cutout Graphic */}
              <div className="h-20 sm:h-22 w-full my-2 flex items-center justify-center overflow-hidden">
                <img
                  src={specimenImg}
                  alt={family.label}
                  loading="eager"
                  className="max-h-full max-w-[85%] object-contain transition-transform duration-250 ease-[var(--ease-spring)] group-hover:scale-[1.08] drop-shadow-[0_8px_16px_rgba(0,0,0,0.08)] dark:drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                />
              </div>

              {/* Bottom: Family Label & Sublabel */}
              <div className="w-full">
                <div
                  className={`text-xs font-semibold tracking-tight truncate ${
                    isSelected
                      ? 'text-[#1d1d1f] dark:text-white'
                      : 'text-[#1d1d1f]/90 dark:text-[#f5f5f7]/90'
                  }`}
                >
                  {family.label}
                </div>
                <div className="text-[10px] text-[#86868b] truncate">
                  {family.sublabel}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
