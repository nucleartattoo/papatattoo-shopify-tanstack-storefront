import React from 'react'
import { ArrowRight } from 'lucide-react'

interface FeaturedCategoriesProps {
  activeCategory: string
  onSelectCategory: (id: string) => void
}

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const categories = [
    {
      id: 'cartridges',
      name: 'Needle Cartridges',
      image: '/product-images/papa-premium-tattoo-cartridges-round-cutout.webp',
      glow: '#0d9488',
    },
    {
      id: 'machines',
      name: 'Rotary Machines',
      image: '/product-images/img_113_papa_pen_jet_black_1__cutout.webp',
      glow: '#00f0ff',
    },
    {
      id: 'grips',
      name: 'Adjustable Grips',
      image: '/product-images/img_111_papa_adjustment_grips_1__cutout.webp',
      glow: '#38bdf8',
    },
    {
      id: 'accessories',
      name: 'Studio Supplies',
      image: '/product-images/img_201_papa_travel_case_cutout.webp',
      glow: '#a855f7',
    },
  ]

  return (
    <section className="py-20 sm:py-24 border-b border-zinc-200/80 dark:border-white/[0.06] bg-white dark:bg-[#16181e] relative">
      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-end justify-between mb-10 pb-5 border-b border-zinc-200/80 dark:border-white/[0.08]">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-950 dark:text-white uppercase tracking-tight font-sans">
            PRODUCT CATEGORIES
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
          {categories.map(cat => {
            const isSelected = activeCategory === cat.id

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`relative aspect-square w-full rounded-2xl border transition-all duration-500 group overflow-hidden cursor-pointer flex flex-col justify-between p-6 ${
                  isSelected
                    ? 'border-[#2ee6ca] bg-zinc-50 dark:bg-[#1a1c24] shadow-[0_0_24px_rgba(46,230,202,0.15)]'
                    : 'border-zinc-200/80 dark:border-white/[0.08] bg-zinc-50/50 dark:bg-[#181a22] hover:border-zinc-300 dark:hover:border-white/20 hover:bg-white dark:hover:bg-[#20222a] hover:shadow-xl dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)]'
                }`}
              >
                {/* Subtle Organic Radial Glow Accent */}
                <div
                  className="absolute inset-0 opacity-10 blur-3xl group-hover:opacity-25 transition-opacity duration-700 pointer-events-none"
                  style={{ backgroundColor: cat.glow }}
                />

                {/* Sculptural Gallery Plinth Image Staging */}
                <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="max-h-[82%] max-w-[82%] w-auto object-contain scale-125 sm:scale-135 group-hover:scale-145 transition-transform duration-700 ease-out drop-shadow-[0_16px_24px_rgba(0,0,0,0.7)]"
                    loading="lazy"
                  />
                </div>

                {/* Minimalist Bottom Title Bar */}
                <div className="pt-4 border-t border-zinc-200/70 dark:border-white/[0.08] flex items-center justify-between gap-2 z-10">
                  <h3 className="font-bold text-xs sm:text-sm uppercase tracking-tight text-zinc-950 dark:text-white/90 group-hover:text-[#0d9488] dark:group-hover:text-[#2ee6ca] transition-colors font-sans whitespace-nowrap">
                    {cat.name}
                  </h3>
                  <span className="inline-flex items-center text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500 group-hover:text-[#2ee6ca] transition-transform duration-300 group-hover:translate-x-1 shrink-0">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
