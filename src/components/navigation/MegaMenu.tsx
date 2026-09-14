import React from 'react'
import { ArrowRight, Sparkles, ChevronRight, ShieldCheck } from 'lucide-react'

export interface MegaMenuCategory {
  id: string
  title: string
  subtitle: string
  badge: string
  badgeColor?: 'cyan' | 'amber' | 'emerald' | 'zinc'
  image: string
  categoryId: string // matches main category filter: 'machines' | 'needles' | 'grips' | 'all'
  subcategories: {
    label: string
    query?: string
    isFeatured?: boolean
    series?: 'premium' | 'standard'
  }[]
}

export const MEGA_MENU_DATA: MegaMenuCategory[] = [
  {
    id: 'machines',
    title: 'PAPA MACHINES',
    subtitle: 'Direct-Drive Rotary Pens',
    badge: 'PRO MOTORS',
    badgeColor: 'cyan',
    image: 'https://cdn.shopify.com/s/files/1/0780/2955/3716/files/1.jpg?v=1789099921',
    categoryId: 'machines',
    subcategories: [
      { label: 'Papa Pen', query: 'Papa Pen' },
      { label: 'Papa Pen V2', query: 'Papa Pen V2' },
      { label: 'Papa Pen V3', query: 'Papa Pen V3', isFeatured: true },
      { label: 'PAPA PEN V3 - BLACK (FULL SET)', query: 'Full Set' },
      { label: 'Papa Apollo Rotary', query: 'Apollo' },
    ],
  },
  {
    id: 'cartridges',
    title: 'PAPA CARTRIDGES',
    subtitle: 'Medical 316L Surgical Steel',
    badge: 'SAFETY MEMBRANE',
    badgeColor: 'amber',
    image: 'https://cdn.shopify.com/s/files/1/0780/2955/3716/files/new_premium-1_47.jpg?v=1789098619',
    categoryId: 'needles',
    subcategories: [
      { label: '⭐ Papa Premium Cartridges', series: 'premium', isFeatured: true },
      { label: 'Papa Standard Cartridges', series: 'standard', isFeatured: true },
    ],
  },
  {
    id: 'grips',
    title: 'CARTRIDGE GRIPS',
    subtitle: '6061-T6 Aircraft Alloy & Foam',
    badge: 'CLICK SYSTEM',
    badgeColor: 'cyan',
    image: 'https://cdn.shopify.com/s/files/1/0780/2955/3716/files/papa_adjustment_grips_1.jpg?v=1789096517',
    categoryId: 'grips',
    subcategories: [
      { label: 'Disposable Cartridge Grips', query: 'disposable' },
      { label: 'Adjustable Click Grip V2', query: 'Grip V2' },
      { label: 'Adjustable Click Grip V3', query: 'Grip V3', isFeatured: true },
      { label: 'Autoclavable Click Grip', query: 'Adjustable Click Grip' },
    ],
  },
  {
    id: 'apparel',
    title: 'PAPA APPAREL',
    subtitle: 'Official Studio Uniforms',
    badge: 'STUDIO WEAR',
    badgeColor: 'zinc',
    image: 'https://cdn.shopify.com/s/files/1/0780/2955/3716/files/papa_shirt1.jpg?v=1789099455',
    categoryId: 'all',
    subcategories: [
      { label: 'PAPA Tattoo Hat', query: 'Hat' },
      { label: 'Papa Tattoo Shirt Small Logo', query: 'Shirt' },
      { label: 'Papa Apron', query: 'Apron', isFeatured: true },
    ],
  },
  {
    id: 'power',
    title: 'PAPA POWER SUPPLY',
    subtitle: 'Pure Copper & Digital Control',
    badge: 'VOLT REGULATION',
    badgeColor: 'emerald',
    image: 'https://cdn.shopify.com/s/files/1/0780/2955/3716/files/papa_foot_pedal.jpg?v=1789099419',
    categoryId: 'all',
    subcategories: [
      { label: 'RCA Cord (Straight & Angled)', query: 'RCA' },
      { label: 'Papa Foot Pedal (360° Switch)', query: 'Foot Pedal', isFeatured: true },
      { label: 'Papa Power Bullet', query: 'Power Bullet' },
      { label: 'Papa Volt Battery Pack', query: 'Volt' },
    ],
  },
  {
    id: 'accessories',
    title: 'PAPA ACCESSORIES',
    subtitle: 'Station Hygiene & Essentials',
    badge: 'WORKFLOW GEAR',
    badgeColor: 'zinc',
    image: 'https://cdn.shopify.com/s/files/1/0780/2955/3716/files/stationttray1.jpg?v=1789097560',
    categoryId: 'all',
    subcategories: [
      { label: 'PAPA Travel Case', query: 'Travel Case' },
      { label: 'Finger Ledge Grip', query: 'Finger Ledge' },
      { label: 'StenciLock Stencil Solution', query: 'Stencil', isFeatured: true },
      { label: 'Papa Station Ink Tray', query: 'Tray' },
    ],
  },
]

interface MegaMenuProps {
  isOpen: boolean
  onClose: () => void
  onSelectCategory: (categoryId: string, searchKeyword?: string, series?: 'premium' | 'standard') => void
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose, onSelectCategory }) => {
  if (!isOpen) return null

  const handleItemClick = (
    categoryId: string,
    query?: string,
    series?: 'premium' | 'standard'
  ) => {
    onSelectCategory(categoryId, query, series)
    onClose()
  }

  return (
    <div
      className="absolute top-full left-0 w-full z-50 bg-white/95 dark:bg-[#0A0C0F]/95 backdrop-blur-xl border-b border-zinc-200 dark:border-[#222731] shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-top-2"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between pb-5 mb-6 border-b border-zinc-100 dark:border-[#1C2028] text-[11px] font-mono">
          <div className="flex items-center gap-2 text-[#0d9488] dark:text-[#2ee6ca] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#2ee6ca] animate-pulse"></span>
            <span>// PAPA PRODUCTS & CATEGORIES (6 MAIN CATEGORIES)</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-500">
            <span>DIRECT FACTORY SHIPMENT</span>
            <span>•</span>
            <span>WHOLESALE VOLUME DISCOUNTS</span>
          </div>
        </div>

        {/* 6-Column Grid Layout directly reflecting Magento 2 Architecture */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {MEGA_MENU_DATA.map(col => (
            <div
              key={col.id}
              className="group flex flex-col justify-between rounded-xl p-3 border border-zinc-100 dark:border-[#1E232E] hover:border-zinc-300 dark:hover:border-[#2ee6ca]/40 bg-zinc-50/50 dark:bg-[#101319] transition-all duration-200"
            >
              <div>
                {/* Header Banner Image */}
                <div
                  onClick={() => handleItemClick(col.categoryId)}
                  className="relative aspect-16/10 w-full rounded-lg overflow-hidden bg-zinc-200 dark:bg-[#1A1E27] mb-3 cursor-pointer"
                >
                  <img
                    src={col.image}
                    alt={col.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  {/* Badge */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded tracking-wider uppercase ${
                        col.badgeColor === 'amber'
                          ? 'bg-amber-500/90 text-zinc-950'
                          : col.badgeColor === 'emerald'
                          ? 'bg-emerald-500/90 text-zinc-950'
                          : 'bg-[#2ee6ca]/90 text-zinc-950'
                      }`}
                    >
                      {col.badge}
                    </span>
                  </div>
                </div>

                {/* Column Main Title */}
                <button
                  onClick={() => handleItemClick(col.categoryId)}
                  className="text-left w-full group/title"
                >
                  <h3 className="text-xs font-mono font-black uppercase text-zinc-900 dark:text-zinc-100 tracking-wider group-hover/title:text-[#0d9488] dark:group-hover/title:text-[#2ee6ca] transition-colors flex items-center justify-between">
                    <span>{col.title}</span>
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover/title:opacity-100 -translate-x-1 group-hover/title:translate-x-0 transition-all text-[#2ee6ca]" />
                  </h3>
                  <div className="text-[10px] text-zinc-500 font-mono line-clamp-1 mt-0.5">
                    {col.subtitle}
                  </div>
                </button>

                {/* Subcategory Links */}
                <ul className="mt-3.5 space-y-1.5 border-t border-zinc-200/60 dark:border-[#1E232E] pt-3 text-xs font-mono">
                  {col.subcategories.map((sub, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => handleItemClick(col.categoryId, sub.query, sub.series)}
                        className={`w-full text-left py-1 px-1.5 rounded transition-all flex items-center justify-between group/sub ${
                          sub.series === 'premium'
                            ? 'text-amber-600 dark:text-amber-400 font-bold hover:bg-amber-500/10'
                            : sub.isFeatured
                            ? 'text-zinc-900 dark:text-zinc-200 font-bold hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60'
                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#181C25]'
                        }`}
                      >
                        <span className="truncate pr-1">{sub.label}</span>
                        {sub.series === 'premium' ? (
                          <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                        ) : (
                          <ArrowRight className="w-2.5 h-2.5 opacity-0 group-hover/sub:opacity-100 transition-opacity text-[#2ee6ca] shrink-0" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Quick Category Jump */}
              <button
                onClick={() => handleItemClick(col.categoryId)}
                className="mt-4 pt-2 border-t border-zinc-200/40 dark:border-[#1A1E26] text-[10px] font-mono uppercase tracking-wider text-zinc-400 hover:text-zinc-950 dark:hover:text-[#2ee6ca] flex items-center justify-between w-full transition-colors"
              >
                <span>View All</span>
                <span>→</span>
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Callout for Tattoo Artists & Studios */}
        <div className="mt-8 pt-6 border-t border-zinc-200/80 dark:border-[#1C2028] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-[#0d9488] dark:text-[#2ee6ca] shrink-0" />
            <span className="text-zinc-600 dark:text-zinc-400">
              Need custom needle grouping OEM or studio volume tier pricing?
            </span>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById('studio-section')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
              onClose()
            }}
            className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-[#2ee6ca] hover:underline"
          >
            <span>DISCUSS STUDIO WHOLESALE ACCOUNT</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
