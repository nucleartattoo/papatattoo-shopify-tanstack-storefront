import React from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, ShoppingBag, ArrowUpRight } from 'lucide-react'
import { ShopifyProduct } from '../../types/shopify'

interface LineupItem {
  id: string
  category: string
  title: string
  subtitle: string
  spec: string
  price: string
  handle: string
  image: string
  badge?: string
}

const LINEUP_ITEMS: LineupItem[] = [
  {
    id: 'pen-v3',
    category: 'Modular Rotary Apparatus',
    title: 'Papa Pen V3',
    subtitle: 'The Flagship Studio System',
    spec: 'Aerospace 6061-T6 Billet · 10,500 RPM Coreless Motor',
    price: '$799.95',
    handle: 'papa-pen-v3-black-full-set',
    image: '/product-images/img_021_papa_v3_full_case-2_1_cutout.webp',
    badge: 'Full Set with 5 Boxes',
  },
  {
    id: 'cartridges',
    category: 'Surgical Metallurgy',
    title: '316L Cartridges',
    subtitle: 'Japanese Steel · 62 Geometries',
    spec: 'Zero-Deflection Solder · Silicone Anti-Backflow Seal',
    price: '$25.00',
    handle: 'papa-premium-tattoo-cartridges',
    image: '/product-images/papa-premium-tattoo-cartridges-round-cutout.webp',
    badge: 'Class 100k Sterile',
  },
  {
    id: 'power',
    category: 'Cordless Power Interface',
    title: 'Papa Volt Power',
    subtitle: '2,000 mAh Pure Lithium Dock',
    spec: '5V - 12V Regulated DC · Universal RCA Fitment',
    price: '$129.00',
    handle: 'papa-volt-battery',
    image: '/product-images/img_041_papa_volt_large_cutout.webp',
    badge: 'Up to 8 Hours',
  },
  {
    id: 'grips',
    category: 'CNC Precision Grips',
    title: 'Click Grip V2',
    subtitle: 'Ratcheted Depth Locking',
    spec: '6061-T6 Aluminum · Autoclavable to 134 °C',
    price: '$99.95',
    handle: 'papa-adjustable-grip-v3-33-mm-black',
    image: '/product-images/img_111_papa_adjustment_grips_1__cutout.webp',
    badge: '8 Anodized Finishes',
  },
]

export const CleanroomHardwareLineup: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1440px] mx-auto text-[#1d1d1f] dark:text-[#f5f5f7]">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
        <div className="space-y-2.5 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">
            Pro Studio Systems
          </p>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.035em] text-[#1d1d1f] dark:text-white leading-tight">
            The Hardware Collection.
          </h2>
          <p className="text-base text-[#86868b] leading-relaxed">
            Every instrument is engineered for uncompromised reliability, balanced ergonomic mass, and clinical-grade cleanroom sterility.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/products"
            className="px-6 py-3 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-xs font-medium inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/products"
            search={{ view: 'sheet' }}
            className="px-5 py-3 rounded-full bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.07] dark:hover:bg-white/[0.12] text-xs font-medium transition-colors"
          >
            <span>Quick Order Sheet</span>
          </Link>
        </div>
      </div>

      {/* 4 Clean Minimalist Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {LINEUP_ITEMS.map(item => (
          <div
            key={item.id}
            className="group rounded-[32px] bg-[#F5F5F7] dark:bg-[#121214] p-8 sm:p-10 flex flex-col justify-between overflow-hidden transition-all duration-200 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-black/[0.03] dark:border-white/[0.05]"
          >
            {/* Top Text & Category */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">
                  {item.category}
                </span>
                {item.badge && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-black/[0.05] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-zinc-300">
                    {item.badge}
                  </span>
                )}
              </div>

              <h3 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-[#1d1d1f] dark:text-white">
                {item.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                {item.spec}
              </p>
            </div>

            {/* Central Clean Specimen Floating Showcase */}
            <div className="my-8 sm:my-10 flex items-center justify-center min-h-[220px] sm:min-h-[260px] relative">
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="max-h-[200px] sm:max-h-[240px] w-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_24px_50px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-[var(--ease-spring)] group-hover:scale-[1.03]"
              />
            </div>

            {/* Price and Action Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-black/[0.06] dark:border-white/[0.08]">
              <div>
                <span className="text-[11px] text-[#86868b] block">STUDIO PRICE</span>
                <span className="text-xl sm:text-2xl font-semibold text-[#1d1d1f] dark:text-white tracking-tight tabular-nums">
                  {item.price}
                </span>
              </div>

              <Link
                to="/products/$handle"
                params={{ handle: item.handle }}
                className="px-6 py-3 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-xs font-medium inline-flex items-center gap-1.5 hover:opacity-90 transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97]"
              >
                <span>Configure</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
