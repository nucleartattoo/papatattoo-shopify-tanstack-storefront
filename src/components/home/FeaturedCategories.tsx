import React from 'react'
import { Sliders, Disc, Sparkles, Layers } from 'lucide-react'

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
      id: 'grips',
      name: 'Adjustable Grips',
      desc: 'Dual-click stainless steel detent systems & aircraft alloy sleeves',
      icon: Sliders,
      count: '5 Models',
    },
    {
      id: 'machines',
      name: 'Rotary Machines',
      desc: 'Direct-drive brushless motors engineered for ultra-smooth shading & lining',
      icon: Disc,
      count: 'Pro Grade',
    },
    {
      id: 'needles',
      name: 'Needle Cartridges',
      desc: 'Membrane-sealed medical grade 316L surgical steel configurations',
      icon: Layers,
      count: 'All Gauges',
    },
    {
      id: 'studio',
      name: 'Studio Supplies',
      desc: 'Autoclave pouches, barrier film, disposable grips & sanitization gear',
      icon: Sparkles,
      count: 'Bulk Packs',
    },
  ]

  return (
    <section className="py-12 border-b border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#0C0E12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-[11px] font-mono font-bold tracking-widest text-[#0d9488] dark:text-[#2EE6CA] uppercase">
              // PRODUCT CATEGORIES
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white uppercase tracking-tight">
              PAPA PRODUCT CATEGORIES
            </h2>
          </div>
          <div className="text-xs font-mono text-zinc-500">
            ENGINEERED TO MEDICAL ISO STANDARDS
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map(cat => {
            const Icon = cat.icon
            const isSelected = activeCategory === cat.id

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`relative text-left p-5 rounded-xl border transition-all duration-300 group overflow-hidden ${
                  isSelected
                    ? 'border-[#2EE6CA] bg-zinc-100 dark:bg-[#151921] shadow-[0_0_20px_rgba(46,230,202,0.15)]'
                    : 'border-zinc-200 dark:border-[#222731] bg-zinc-50/70 dark:bg-[#121419]/70 hover:border-zinc-400 dark:hover:border-zinc-600'
                }`}
              >
                {/* Background subtle wireframe hint */}
                <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full border border-zinc-200 dark:border-[#222731] pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>

                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-[#2EE6CA] text-zinc-950'
                        : 'bg-zinc-200/80 dark:bg-[#1A1E27] text-zinc-800 dark:text-[#2EE6CA] group-hover:bg-[#2EE6CA] group-hover:text-zinc-950'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-200/60 dark:bg-[#1B202A] text-zinc-600 dark:text-zinc-400">
                    {cat.count}
                  </span>
                </div>

                <h3 className="text-base font-bold text-zinc-950 dark:text-white uppercase mb-1">
                  {cat.name}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {cat.desc}
                </p>

                <div className="mt-4 flex items-center gap-1 text-[11px] font-mono font-bold text-[#0d9488] dark:text-[#2EE6CA]">
                  <span>EXPLORE CATEGORY</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
