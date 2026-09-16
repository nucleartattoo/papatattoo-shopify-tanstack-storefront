import React from 'react'
import { ArrowRight, Sparkles, ChevronRight, ShieldCheck } from 'lucide-react'

export interface MegaMenuSubcategory {
  label: string
  subId?: string
  query?: string
  series?: 'premium' | 'standard'
  handle?: string
  isFeatured?: boolean
}

export interface MegaMenuCategory {
  id: string
  number: string
  title: string
  subtitle: string
  badge: string
  badgeColor?: 'cyan' | 'amber' | 'emerald' | 'zinc'
  image: string
  categoryId: string
  subcategories: MegaMenuSubcategory[]
}

export const MEGA_MENU_DATA: MegaMenuCategory[] = [
  {
    id: 'machines',
    number: '01',
    title: 'Papa Machines',
    subtitle: '',
    badge: '',
    image: '/product-images/img_113_papa_pen_jet_black_1__cutout.webp',
    categoryId: 'machines',
    subcategories: [
      { label: 'Papa Pen', subId: 'papa-pen' },
      { label: 'Papa Pen V2', subId: 'papa-pen-v2' },
      { label: 'Papa Pen V3', subId: 'papa-pen-v3' },
      { label: 'Papa Apollo Rotary', subId: 'papa-apollo' },
    ],
  },
  {
    id: 'cartridges',
    number: '02',
    title: 'Papa Cartridges',
    subtitle: '',
    badge: '',
    image: '/product-images/papa-premium-tattoo-cartridges-round-cutout.webp',
    categoryId: 'cartridges',
    subcategories: [
      {
        label: 'Premium Cartridges',
        series: 'premium',
        subId: 'premium',
        handle: 'papa-premium-tattoo-cartridges',
      },
      {
        label: 'Standard Cartridges',
        series: 'standard',
        subId: 'standard',
        handle: 'papa-standard-tattoo-cartridges',
      },
    ],
  },
  {
    id: 'grips',
    number: '03',
    title: 'Cartridge Grips',
    subtitle: '',
    badge: '',
    image: '/product-images/img_111_papa_adjustment_grips_1__cutout.webp',
    categoryId: 'grips',
    subcategories: [
      { label: 'Adjustable Click Grip V2', subId: 'adjustable-v2' },
      { label: 'Adjustable Grip V3', subId: 'adjustable-v3' },
      { label: 'Autoclavable Click Grip', subId: 'adjustable-click' },
      { label: 'Disposable Grips', subId: 'disposable-grips' },
      { label: 'Foam Grips', subId: 'foam-cover-grips' },
    ],
  },
  {
    id: 'power',
    number: '04',
    title: 'Papa Power Supply',
    subtitle: '',
    badge: '',
    image: '/product-images/img_139_papa_foot_pedal_cutout.webp',
    categoryId: 'power',
    subcategories: [
      { label: 'Foot Pedal', subId: 'pedal' },
      { label: 'Power Bullet', subId: 'power-units' },
      { label: 'Volt Battery', subId: 'power-units' },
      { label: 'RCA & Clip Cords', subId: 'cords' },
    ],
  },
  {
    id: 'apparel',
    number: '05',
    title: 'Papa Apparel',
    subtitle: '',
    badge: '',
    image: '/product-images/img_163_papa_hat_cutout.webp',
    categoryId: 'apparel',
    subcategories: [
      { label: 'Apron', subId: 'apron' },
      { label: 'Hat', subId: 'hat' },
      { label: 'Shirt', subId: 'shirt' },
    ],
  },
  {
    id: 'accessories',
    number: '06',
    title: 'Papa Accessories',
    subtitle: '',
    badge: '',
    image: '/product-images/img_020_img_4371_1_cutout.webp',
    categoryId: 'accessories',
    subcategories: [
      { label: 'Station Trays', subId: 'trays' },
      { label: 'Travel Case', subId: 'travel-case' },
      { label: 'Phone Holder', query: 'Phone Holder' },
    ],
  },
  {
    id: 'stencil',
    number: '07',
    title: 'Papa Stencil',
    subtitle: '',
    badge: '',
    image: '/product-images/img_236_9d0d527d6aac9a314dddb0b577f0fb9b_cutout.webp',
    categoryId: 'stencil',
    subcategories: [
      { label: 'StenciLock Solution', query: 'Stencil' },
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
      className="absolute top-full left-0 w-full z-50 bg-white/98 dark:bg-[#0A0C10]/98 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 shadow-2xl transition-all duration-200 animate-in fade-in slide-in-from-top-1"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-100 dark:border-zinc-800/80 text-xs font-mono">
          <span className="font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">
            Categories
          </span>
          <button
            onClick={() => {
              onSelectCategory('all')
              onClose()
            }}
            className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300 hover:text-[#0d9488] dark:hover:text-[#2ee6ca] transition-colors"
          >
            <span>All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 7-Column Minimalist Square Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-5 xl:gap-6">
          {MEGA_MENU_DATA.map(col => (
            <div key={col.id} className="flex flex-col">
              {/* Square Image Box */}
              <button
                type="button"
                onClick={() => handleItemClick(col.categoryId)}
                className="group/img w-full aspect-square rounded-xl bg-zinc-50 dark:bg-[#12151C] border border-zinc-200/80 dark:border-zinc-800 p-3.5 flex items-center justify-center overflow-hidden hover:border-zinc-400 dark:hover:border-zinc-600 transition-all cursor-pointer"
              >
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover/img:scale-105"
                  loading="lazy"
                />
              </button>

              {/* Category Title */}
              <button
                type="button"
                onClick={() => handleItemClick(col.categoryId)}
                className="text-left w-full mt-3 block group/title"
              >
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 group-hover/title:text-[#0d9488] dark:group-hover/title:text-[#2ee6ca] transition-colors leading-snug">
                  {col.title}
                </h3>
              </button>

              {/* Subcategories List */}
              <ul className="mt-2 space-y-1 text-xs font-mono">
                {col.subcategories.map((sub, idx) => (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={() => handleItemClick(col.categoryId, sub.query, sub.series)}
                      className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white py-0.5 block text-left transition-colors cursor-pointer w-full truncate"
                    >
                      {sub.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
