import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import {
  ChevronDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  LayoutGrid,
  Award,
  Mail,
  Building2,
} from 'lucide-react'
import { MEGA_MENU_DATA } from './MegaMenu'

interface RadixMegaMenuProps {
  onSelectCategory: (categoryId: string, searchKeyword?: string, series?: 'premium' | 'standard') => void
}

export const RadixMegaMenu: React.FC<RadixMegaMenuProps> = ({ onSelectCategory }) => {
  const navigate = useNavigate()
  const [value, setValue] = React.useState<string>('')

  const handleSelect = (categoryId: string, searchKeyword?: string, series?: 'premium' | 'standard') => {
    onSelectCategory(categoryId, searchKeyword, series)
    setValue('')
  }

  return (
    <NavigationMenu.Root
      value={value}
      onValueChange={setValue}
      delayDuration={100}
      className="relative z-50 flex items-center"
    >
      <NavigationMenu.List className="flex items-center gap-1 font-mono text-xs">
        {/* 1. Papa Products Panoramic Mega Menu Item */}
        <NavigationMenu.Item value="products">
          <NavigationMenu.Trigger
            onClick={() => {
              navigate({ to: '/collections', search: { category: 'all' } })
              setValue('')
            }}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-[#2ee6ca] bg-zinc-100/80 dark:bg-[#14171D] hover:bg-zinc-200/80 dark:hover:bg-[#1B1F27] border border-zinc-200 dark:border-[#222731] transition-all data-[state=open]:bg-zinc-900 data-[state=open]:text-white dark:data-[state=open]:bg-[#2EE6CA] dark:data-[state=open]:text-zinc-950 cursor-pointer"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-[#0d9488] dark:text-[#2ee6ca] group-data-[state=open]:text-white dark:group-data-[state=open]:text-zinc-950" />
            <span>Papa Products</span>
            <ChevronDown className="w-3 h-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </NavigationMenu.Trigger>

          <NavigationMenu.Content className="fixed inset-x-0 top-[99px] z-50 flex justify-center px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="w-full max-w-7xl mx-auto rounded-2xl border border-zinc-200 dark:border-[#222731] bg-white/95 dark:bg-[#0A0C0F]/95 backdrop-blur-2xl shadow-2xl p-6">
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-100 dark:border-[#1C2028] text-[11px]">
                <div className="flex items-center gap-2 text-[#0d9488] dark:text-[#2ee6ca] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#2ee6ca] animate-pulse"></span>
                  <span>// PAPA PRODUCTS & CATEGORIES (ALL PRODUCT LINES)</span>
                </div>
                <div className="flex items-center gap-4 text-zinc-500">
                  <button
                    onClick={() => {
                      navigate({ to: '/collections', search: { category: 'all' } })
                      setValue('')
                    }}
                    className="flex items-center gap-1 font-bold text-[#0d9488] dark:text-[#2ee6ca] hover:underline cursor-pointer"
                  >
                    <span>View All Products</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span>•</span>
                  <span>ISO 13485 CERTIFIED</span>
                  <span>•</span>
                  <span>GLOBAL EXPRESS LOGISTICS</span>
                </div>
              </div>

              {/* 6-Column Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {MEGA_MENU_DATA.map(col => (
                  <div
                    key={col.id}
                    className="group/card flex flex-col justify-between rounded-xl p-3 border border-zinc-100 dark:border-[#1E232E] hover:border-zinc-300 dark:hover:border-[#2ee6ca]/40 bg-zinc-50/60 dark:bg-[#11141A] transition-all duration-200"
                  >
                    <div>
                      {/* Banner Photo */}
                      <button
                        onClick={() => handleSelect(col.categoryId)}
                        className="relative aspect-16/10 w-full rounded-lg overflow-hidden bg-zinc-200 dark:bg-[#1A1E27] mb-2.5 block text-left"
                      >
                        <img
                          src={col.image}
                          alt={col.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <span
                          className={`absolute bottom-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase ${
                            col.badgeColor === 'amber'
                              ? 'bg-amber-500 text-zinc-950'
                              : col.badgeColor === 'emerald'
                              ? 'bg-emerald-500 text-zinc-950'
                              : 'bg-[#2ee6ca] text-zinc-950'
                          }`}
                        >
                          {col.badge}
                        </span>
                      </button>

                      {/* Title */}
                      <button
                        onClick={() => handleSelect(col.categoryId)}
                        className="text-left w-full"
                      >
                        <h4 className="text-xs font-black uppercase text-zinc-900 dark:text-zinc-100 tracking-wider group-hover/card:text-[#0d9488] dark:group-hover/card:text-[#2ee6ca] transition-colors truncate">
                          {col.title}
                        </h4>
                        <div className="text-[10px] text-zinc-500 line-clamp-1 mt-0.5">
                          {col.subtitle}
                        </div>
                      </button>

                      {/* Sub-links */}
                      <ul className="mt-3 space-y-1 border-t border-zinc-200/60 dark:border-[#1E232E] pt-2.5 text-[11px]">
                        {col.subcategories.map((sub, idx) => (
                          <li key={idx}>
                            <button
                              onClick={() => {
                                if (sub.series === 'premium') {
                                  navigate({ to: '/products/$handle', params: { handle: 'papa-premium-tattoo-cartridges' } })
                                  setValue('')
                                } else if (sub.series === 'standard' || sub.label.includes('Standard')) {
                                  navigate({ to: '/products/$handle', params: { handle: 'papa-standard-tattoo-cartridges' } })
                                  setValue('')
                                } else {
                                  handleSelect(col.categoryId, sub.query, sub.series)
                                }
                              }}
                              className={`w-full text-left py-1 px-1 rounded transition-colors flex items-center justify-between group/sub ${
                                sub.series === 'premium'
                                  ? 'text-amber-600 dark:text-amber-400 font-bold hover:bg-amber-500/10'
                                  : sub.isFeatured
                                  ? 'text-zinc-900 dark:text-zinc-200 font-bold hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60'
                                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#181C25]'
                              }`}
                            >
                              <span className="truncate pr-1">{sub.label}</span>
                              {sub.series === 'premium' ? (
                                <Sparkles className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                              ) : (
                                <ArrowRight className="w-2.5 h-2.5 opacity-0 group-hover/sub:opacity-100 transition-opacity text-[#2ee6ca] shrink-0" />
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Jump link */}
                    <button
                      onClick={() => handleSelect(col.categoryId)}
                      className="mt-3 pt-2 border-t border-zinc-200/40 dark:border-[#1A1E26] text-[10px] uppercase text-zinc-400 hover:text-[#2ee6ca] flex items-center justify-between w-full transition-colors"
                    >
                      <span>Explore all</span>
                      <span>→</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Bottom Pro Footer */}
              <div className="mt-6 pt-4 border-t border-zinc-200/80 dark:border-[#1C2028] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-zinc-500">
                  <ShieldCheck className="w-4 h-4 text-[#0d9488] dark:text-[#2ee6ca]" />
                  <span>Wholesale studio accounts receive tiered volume pricing & priority dispatch.</span>
                </div>
                <button
                  onClick={() => {
                    navigate({ to: '/wholesale' })
                    setValue('')
                  }}
                  className="font-bold text-[#0d9488] dark:text-[#2ee6ca] hover:underline flex items-center gap-1"
                >
                  <span>STUDIO WHOLESALE APPLICATION</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        {/* 2. Sponsorship Artists Direct Link */}
        <NavigationMenu.Item>
          <button
            onClick={() => {
              navigate({ to: '/sponsorship-artists' })
              setValue('')
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-[#2ee6ca] hover:bg-zinc-100/70 dark:hover:bg-[#14171E] transition-all cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-[#0d9488] dark:text-[#2ee6ca]" />
            <span>Sponsorship Artists</span>
          </button>
        </NavigationMenu.Item>

        {/* 3. Distributors Direct Link */}
        <NavigationMenu.Item>
          <button
            onClick={() => {
              navigate({ to: '/distributors' })
              setValue('')
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-[#2ee6ca] hover:bg-zinc-100/70 dark:hover:bg-[#14171E] transition-all cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-[#0d9488] dark:text-[#2ee6ca]" />
            <span>Distributors</span>
          </button>
        </NavigationMenu.Item>

        {/* 4. Contact Direct Link */}
        <NavigationMenu.Item>
          <button
            onClick={() => {
              navigate({ to: '/contact' })
              setValue('')
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-[#2ee6ca] hover:bg-zinc-100/70 dark:hover:bg-[#14171E] transition-all cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-[#0d9488] dark:text-[#2ee6ca]" />
            <span>Contact</span>
          </button>
        </NavigationMenu.Item>
      </NavigationMenu.List>

      {/* Click-outside Backdrop Blur */}
      {value && (
        <div
          onClick={() => setValue('')}
          className="fixed inset-0 top-[99px] z-40 bg-black/40 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-150"
        />
      )}
    </NavigationMenu.Root>
  )
}
