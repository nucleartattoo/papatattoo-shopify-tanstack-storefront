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
      glow: '#2ee6ca',
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
    <section className="py-16 sm:py-20 border-b border-zinc-200/70 dark:border-zinc-800/70 bg-white dark:bg-[#0A0C0F]">
      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 pb-5 border-b border-zinc-200/70 dark:border-zinc-800/70">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 dark:text-white uppercase tracking-tight">
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
                className={`relative text-left p-5 rounded-2xl border transition-all duration-300 group overflow-hidden cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#0d9488] dark:border-[#2EE6CA] bg-zinc-50 dark:bg-[#141720] shadow-[0_10px_30px_rgba(46,230,202,0.12)]'
                    : 'border-zinc-200/70 dark:border-zinc-800/70 bg-zinc-50/60 dark:bg-[#11141B] hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-white dark:hover:bg-[#151922] hover:shadow-lg'
                }`}
              >
                {/* Square Product Image Stage */}
                <div className="relative aspect-square w-full rounded-xl bg-white dark:bg-[#080A0E] p-4 flex items-center justify-center overflow-hidden border border-zinc-100 dark:border-zinc-800/50">
                  <div
                    className="absolute inset-0 opacity-10 blur-xl group-hover:opacity-25 transition-opacity duration-500 pointer-events-none"
                    style={{ backgroundColor: cat.glow }}
                  />
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="relative w-full h-full object-contain transition-transform duration-500 group-hover:scale-108 drop-shadow-md"
                    loading="lazy"
                  />
                </div>

                {/* Title & Action */}
                <div className="mt-5 flex items-center justify-between gap-2">
                  <h3 className="font-bold text-base uppercase tracking-tight text-zinc-950 dark:text-white group-hover:text-[#0d9488] dark:group-hover:text-[#2EE6CA] transition-colors">
                    {cat.name}
                  </h3>
                  <span className="inline-flex items-center text-xs font-mono font-bold text-[#0d9488] dark:text-[#2EE6CA] transition-transform group-hover:translate-x-1 shrink-0">
                    <ArrowRight className="w-4 h-4" />
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
