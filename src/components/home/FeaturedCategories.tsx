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
    <section className="py-16 sm:py-20 border-b border-zinc-200/70 dark:border-zinc-800/70 bg-white dark:bg-[#06070a] relative">
      {/* Ambient background grid */}
      <div className="absolute inset-0 sacred-grid-bg opacity-25 pointer-events-none" />

      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-end justify-between mb-8 pb-5 border-b border-zinc-200/70 dark:border-zinc-800/70">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 dark:text-white uppercase tracking-tight font-sans">
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
                className={`relative aspect-square w-full rounded-2xl border transition-all duration-300 group overflow-hidden cursor-pointer flex flex-col justify-between p-5 hud-corner-bracket ${
                  isSelected
                    ? 'border-[#00f0ff] bg-zinc-50 dark:bg-[#0f131c] shadow-[0_0_30px_rgba(0,240,255,0.2)]'
                    : 'border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-[#0a0d14] hover:border-zinc-400 dark:hover:border-[#00f0ff]/60 hover:bg-white dark:hover:bg-[#0f131e] hover:shadow-lg dark:hover:shadow-[0_0_30px_rgba(0,240,255,0.18)]'
                }`}
              >
                {/* Visual Radial Glow Accent */}
                <div
                  className="absolute inset-0 opacity-15 blur-2xl group-hover:opacity-35 transition-opacity duration-500 pointer-events-none"
                  style={{ backgroundColor: cat.glow }}
                />

                {/* Heroic Product Image Staging (takes prominent space) */}
                <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="max-h-[85%] max-w-[85%] w-auto object-contain scale-140 sm:scale-150 group-hover:scale-160 transition-transform duration-500 drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)]"
                    loading="lazy"
                  />
                </div>

                {/* Bottom Title Bar */}
                <div className="pt-3 border-t border-zinc-200/60 dark:border-zinc-800/70 flex items-center justify-between gap-1 z-10">
                  <h3 className="font-bold text-xs sm:text-sm lg:text-base uppercase tracking-tight text-zinc-950 dark:text-white group-hover:text-[#0d9488] dark:group-hover:text-[#00f0ff] transition-colors font-sans whitespace-nowrap">
                    {cat.name}
                  </h3>
                  <span className="inline-flex items-center text-xs font-mono font-bold text-zinc-400 dark:text-zinc-500 group-hover:text-[#00f0ff] transition-transform group-hover:translate-x-1 shrink-0">
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
