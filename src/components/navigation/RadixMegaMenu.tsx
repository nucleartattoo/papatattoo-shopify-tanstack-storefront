import React, { useEffect } from 'react'
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
  X,
  Compass,
} from 'lucide-react'
import { MEGA_MENU_DATA } from './MegaMenu'

interface RadixMegaMenuProps {
  onSelectCategory: (
    categoryId: string,
    query?: string,
    series?: 'premium' | 'standard',
    sub?: string
  ) => void
}

export const RadixMegaMenu: React.FC<RadixMegaMenuProps> = ({ onSelectCategory }) => {
  const navigate = useNavigate()
  const [value, setValue] = React.useState<string>('')

  const handleSelect = (
    categoryId: string,
    query?: string,
    series?: 'premium' | 'standard',
    sub?: string
  ) => {
    onSelectCategory(categoryId, query, series, sub)
    setValue('')
  }

  // Prevent background scrolling behind fullscreen menu + support ESC key closing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setValue('')
      }
    }

    if (value === 'products') {
      window.addEventListener('keydown', handleKeyDown)
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        window.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = prevOverflow
      }
    }
  }, [value])

  return (
    <NavigationMenu.Root
      value={value}
      onValueChange={setValue}
      delayDuration={100}
      className="relative z-50 flex items-center"
    >
      <NavigationMenu.List className="flex items-center gap-2 font-mono">
        {/* 1. Papa Products Panoramic Fullscreen Mega Menu Item */}
        <NavigationMenu.Item value="products">
          <NavigationMenu.Trigger
            onClick={e => {
              e.preventDefault()
              setValue(prev => (prev === 'products' ? '' : 'products'))
            }}
            className="group flex items-center gap-2.5 px-4 py-2 rounded-lg text-[15px] font-black uppercase tracking-wider text-zinc-950 dark:text-zinc-50 hover:text-black dark:hover:text-[#2ee6ca] bg-zinc-100/90 dark:bg-[#14171D] hover:bg-zinc-200 dark:hover:bg-[#1B1F27] border border-zinc-200 dark:border-[#222731] transition-all data-[state=open]:bg-zinc-950 data-[state=open]:text-white dark:data-[state=open]:bg-[#2EE6CA] dark:data-[state=open]:text-zinc-950 cursor-pointer shadow-xs"
          >
            <LayoutGrid className="w-4.5 h-4.5 text-[#0d9488] dark:text-[#2ee6ca] group-data-[state=open]:text-white dark:group-data-[state=open]:text-zinc-950 shrink-0" />
            <span>Papa Products</span>
            <ChevronDown className="w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-180 shrink-0 opacity-70" />
          </NavigationMenu.Trigger>

          {/* Fullscreen Open-Architecture Canvas */}
          <NavigationMenu.Content
            style={{ height: 'calc(100vh - 98px)' }}
            className="fixed inset-x-0 top-[72px] sm:top-[76px] lg:top-[98px] bottom-0 z-50 bg-white dark:bg-[#07090D] border-t border-zinc-200 dark:border-[#1E232E] overflow-y-auto flex flex-col justify-between animate-in fade-in slide-in-from-top-1 duration-150 shadow-2xl"
          >
            {/* Top Control Bar */}
            <div className="w-full border-b border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/70 dark:bg-[#0A0C10]/80 py-3.5 px-6 sm:px-10 lg:px-12 shrink-0">
              <div className="max-w-[1720px] mx-auto flex items-center justify-between">
                {/* Section Identifier */}
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#0d9488] dark:bg-[#2EE6CA] animate-pulse"></span>
                  <span className="text-xs font-mono font-bold tracking-widest text-[#0d9488] dark:text-[#2EE6CA] uppercase">
                    // PAPA TATTOO DIRECTORY ARCHITECTURE · 7 CORE DISCIPLINES
                  </span>
                </div>

                {/* Right Actions: All Catalog Link + Esc Close */}
                <div className="flex items-center gap-5">
                  <button
                    onClick={() => {
                      navigate({ to: '/collections', search: { category: 'all' } })
                      setValue('')
                    }}
                    className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 hover:text-[#0d9488] dark:hover:text-[#2EE6CA] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5 text-[#0d9488] dark:text-[#2EE6CA]" />
                    <span>View Complete Shop Catalog (50 Apparatus)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <span className="text-zinc-300 dark:text-zinc-700">|</span>

                  <button
                    onClick={() => setValue('')}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono text-zinc-500 hover:text-zinc-950 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors cursor-pointer"
                    title="Close Menu (ESC)"
                  >
                    <span>CLOSE</span>
                    <span className="text-[10px] text-zinc-400">[ESC]</span>
                    <X className="w-3.5 h-3.5 ml-0.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Main 7-Column Open-Style Directory Grid */}
            <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-12 py-8 sm:py-10 flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-7 gap-6 lg:gap-8 divide-y sm:divide-y-0 lg:divide-x lg:divide-zinc-200/40 dark:lg:divide-zinc-800/50">
                {MEGA_MENU_DATA.map((col, idx) => (
                  <div
                    key={col.id}
                    className={`min-w-0 flex flex-col justify-between pt-6 sm:pt-0 ${
                      idx !== 0 ? 'lg:pl-6 2xl:pl-8' : ''
                    } group/col`}
                  >
                    <div className="min-w-0">
                      {/* Numeric Index & Badge */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-mono font-bold text-[#0d9488] dark:text-[#2EE6CA] tracking-widest">
                          // {col.number}
                        </span>
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded tracking-wider uppercase ${
                            col.badgeColor === 'amber'
                              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                              : col.badgeColor === 'emerald'
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                              : 'bg-[#2ee6ca]/15 text-[#0d9488] dark:text-[#2ee6ca] border border-[#2ee6ca]/30'
                          }`}
                        >
                          {col.badge}
                        </span>
                      </div>

                      {/* Large Category Heading */}
                      <button
                        onClick={() => handleSelect(col.categoryId)}
                        className="text-left w-full block group/title mb-1 min-w-0"
                      >
                        <h3 className="text-sm lg:text-base font-black uppercase text-zinc-950 dark:text-white tracking-wider group-hover/title:text-[#0d9488] dark:group-hover/title:text-[#2EE6CA] transition-colors truncate">
                          {col.title}
                        </h3>
                        <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 block mt-0.5 truncate">
                          {col.subtitle}
                        </span>
                      </button>

                      {/* Frameless Hero Visual Cutout */}
                      <button
                        onClick={() => handleSelect(col.categoryId)}
                        className="relative h-28 w-full my-3.5 rounded-xl overflow-hidden bg-gradient-to-b from-zinc-100/60 to-zinc-200/40 dark:from-[#11141C]/80 dark:to-[#0B0D12]/90 border border-zinc-200/50 dark:border-zinc-800/60 p-2 flex items-center justify-center group/visual block text-left transition-all hover:border-[#0d9488]/40 dark:hover:border-[#2ee6ca]/50 shadow-xs"
                      >
                        <img
                          src={col.image}
                          alt={col.title}
                          className="max-h-24 w-auto object-contain transition-transform duration-500 group-hover/visual:scale-110 drop-shadow-md"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/10 dark:to-black/30 pointer-events-none"></div>
                      </button>

                      {/* Open-Style Subcategory Link List */}
                      <ul className="space-y-2 mt-4 text-[11px] font-mono min-w-0">
                        {col.subcategories.map((sub, sIdx) => (
                          <li key={sIdx} className="min-w-0">
                            <button
                              onClick={() => {
                                if (sub.handle) {
                                  navigate({
                                    to: '/products/$handle',
                                    params: { handle: sub.handle },
                                  })
                                  setValue('')
                                } else {
                                  handleSelect(
                                    col.categoryId,
                                    sub.query,
                                    sub.series,
                                    sub.subId
                                  )
                                }
                              }}
                              className={`w-full text-left py-1 flex items-start justify-between gap-1 group/link transition-all cursor-pointer min-w-0 ${
                                sub.series === 'premium'
                                  ? 'text-amber-600 dark:text-amber-400 font-bold'
                                  : sub.isFeatured
                                  ? 'text-zinc-900 dark:text-zinc-100 font-semibold'
                                  : 'text-zinc-500 dark:text-zinc-400'
                              } hover:text-[#0d9488] dark:hover:text-[#2EE6CA]`}
                            >
                              <span className="flex items-center gap-1.5 min-w-0 transition-transform duration-150 group-hover/link:translate-x-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 group-hover/link:bg-[#0d9488] dark:group-hover/link:bg-[#2EE6CA] transition-colors shrink-0"></span>
                                <span className="break-words leading-snug">{sub.label}</span>
                              </span>
                              {sub.series === 'premium' ? (
                                <Sparkles className="w-3 h-3 text-amber-500 shrink-0 ml-1 mt-0.5" />
                              ) : (
                                <ArrowRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 text-[#0d9488] dark:text-[#2EE6CA] transition-opacity shrink-0 ml-1 mt-0.5" />
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom Category Direct Jump */}
                    <button
                      onClick={() => handleSelect(col.categoryId)}
                      className="mt-6 pt-3 border-t border-zinc-200/50 dark:border-zinc-800/60 text-[11px] font-mono uppercase font-bold text-zinc-400 hover:text-[#0d9488] dark:hover:text-[#2EE6CA] flex items-center justify-between w-full transition-colors cursor-pointer"
                    >
                      <span className="truncate">Explore {col.title.replace('PAPA ', '')}</span>
                      <span className="shrink-0 ml-1">→</span>
                    </button>
                  </div>
                ))}

                {/* 8th Balanced Slot: Pro Studio Wholesale & Global Logistics */}
                <div className="min-w-0 flex flex-col justify-between pt-6 sm:pt-0 lg:pl-6 2xl:pl-8 group/col border-t sm:border-t-0 border-zinc-200/40 dark:border-zinc-800/50">
                  <div className="min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono font-bold text-[#0d9488] dark:text-[#2EE6CA] tracking-widest">
                        // 08
                      </span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded tracking-wider uppercase bg-[#2ee6ca]/15 text-[#0d9488] dark:text-[#2ee6ca] border border-[#2ee6ca]/30">
                        DIRECT STUDIO
                      </span>
                    </div>

                    <div className="text-left w-full block mb-1 min-w-0">
                      <h3 className="text-sm xl:text-base font-black uppercase text-zinc-950 dark:text-white tracking-wider truncate">
                        STUDIO WHOLESALE
                      </h3>
                      <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 block mt-0.5 truncate">
                        B2B Tier & Priority Cargo
                      </span>
                    </div>

                    <div className="relative h-28 w-full my-3.5 rounded-xl overflow-hidden bg-gradient-to-b from-[#0d9488]/10 to-[#2ee6ca]/5 dark:from-[#2EE6CA]/10 dark:to-transparent border border-[#0d9488]/30 dark:border-[#2ee6ca]/30 p-3 flex flex-col justify-between text-left">
                      <div className="flex items-center justify-between">
                        <ShieldCheck className="w-5 h-5 text-[#0d9488] dark:text-[#2EE6CA]" />
                        <span className="text-[9px] font-mono text-zinc-500 uppercase">TIER 1 DISPATCH</span>
                      </div>
                      <div className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                        Volume Pricing for Licensed Tattoo Studios
                      </div>
                    </div>

                    <ul className="space-y-2 mt-4 text-[11px] font-mono min-w-0">
                      <li>
                        <button
                          onClick={() => {
                            navigate({ to: '/wholesale' })
                            setValue('')
                          }}
                          className="w-full text-left py-1 flex items-start justify-between gap-1 text-zinc-700 dark:text-zinc-300 hover:text-[#0d9488] dark:hover:text-[#2EE6CA] font-bold transition-all cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5 min-w-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0d9488] dark:bg-[#2EE6CA] shrink-0"></span>
                            <span className="break-words leading-tight">Wholesale Studio Application</span>
                          </span>
                          <ArrowRight className="w-3 h-3 shrink-0 ml-1 mt-0.5 text-[#0d9488] dark:text-[#2EE6CA]" />
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            navigate({ to: '/sponsorship-artists' })
                            setValue('')
                          }}
                          className="w-full text-left py-1 flex items-start justify-between gap-1 text-zinc-600 dark:text-zinc-400 hover:text-[#0d9488] dark:hover:text-[#2EE6CA] transition-all cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5 min-w-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 shrink-0"></span>
                            <span className="break-words leading-tight">Sponsorship Artists Program</span>
                          </span>
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            navigate({ to: '/contact' })
                            setValue('')
                          }}
                          className="w-full text-left py-1 flex items-start justify-between gap-1 text-zinc-600 dark:text-zinc-400 hover:text-[#0d9488] dark:hover:text-[#2EE6CA] transition-all cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5 min-w-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 shrink-0"></span>
                            <span className="break-words leading-tight">Studio OEM / Bulk Inquiries</span>
                          </span>
                        </button>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      navigate({ to: '/wholesale' })
                      setValue('')
                    }}
                    className="mt-6 pt-3 border-t border-zinc-200/50 dark:border-zinc-800/60 text-[11px] font-mono uppercase font-bold text-[#0d9488] dark:text-[#2EE6CA] hover:underline flex items-center justify-between w-full transition-colors cursor-pointer"
                  >
                    <span>Open Wholesale Portal</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Atmospheric Brand Credentials Strip */}
            <div className="w-full border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100/60 dark:bg-[#0A0C10]/80 py-4 px-6 sm:px-10 lg:px-12 text-xs font-mono shrink-0">
              <div className="max-w-[1720px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
                  <ShieldCheck className="w-4 h-4 text-[#0d9488] dark:text-[#2EE6CA] shrink-0" />
                  <span className="tracking-wide">
                    ISO 13485 CERTIFIED MEDICAL SPECIFICATION · 6061-T6 AEROSPACE ALLOY · ZERO TOLERANCE STABILIZATION
                  </span>
                </div>

                <div className="flex items-center gap-6 text-zinc-600 dark:text-zinc-400 shrink-0">
                  <button
                    onClick={() => {
                      navigate({ to: '/wholesale' })
                      setValue('')
                    }}
                    className="font-bold text-[#0d9488] dark:text-[#2EE6CA] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Studio Wholesale Application</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <span>•</span>

                  <button
                    onClick={() => {
                      navigate({ to: '/sponsorship-artists' })
                      setValue('')
                    }}
                    className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    Sponsorship Artists
                  </button>
                </div>
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
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-[15px] font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-100 hover:text-black dark:hover:text-[#2ee6ca] hover:bg-zinc-100 dark:hover:bg-[#14171E] transition-all cursor-pointer"
          >
            <Award className="w-4.5 h-4.5 text-[#0d9488] dark:text-[#2ee6ca] shrink-0" />
            <span>Sponsorship Artists</span>
          </button>
        </NavigationMenu.Item>

        {/* 3. Contact Direct Link */}
        <NavigationMenu.Item>
          <button
            onClick={() => {
              navigate({ to: '/contact' })
              setValue('')
            }}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-[15px] font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-100 hover:text-black dark:hover:text-[#2ee6ca] hover:bg-zinc-100 dark:hover:bg-[#14171E] transition-all cursor-pointer"
          >
            <Mail className="w-4.5 h-4.5 text-[#0d9488] dark:text-[#2ee6ca] shrink-0" />
            <span>Contact</span>
          </button>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  )
}
