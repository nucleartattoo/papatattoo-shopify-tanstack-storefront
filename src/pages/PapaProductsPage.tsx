import React, { useMemo, useRef, useState } from 'react'
import { Link, useLoaderData, useNavigate, useSearch } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ShopifyProduct } from '../types/shopify'
import {
  ArrowRight,
  Box,
  Building2,
  LayoutGrid,
  List,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'
import { catalogQueryOptions } from '../lib/catalog.queries'
import {
  buildLiveMachineBenchmarks,
  getRepresentativeImage,
  groupProductsIntoModels,
  HardwareModelGroup,
  LineupCategory,
} from '../lib/hardwareLineup'
import {
  HardwareModelCard,
  LiveMachineComparator,
  StudioSpecSheet,
} from '../components/product/HardwareLineupModules'

export type CategoryFilter = 'all' | LineupCategory
export type ViewMode = 'lineup' | 'sheet'

export interface ProductsSearchParams {
  category?: CategoryFilter
  view?: ViewMode
  compare?: boolean
  q?: string
}

interface ChapterMeta {
  id: LineupCategory
  shortLabel: string
  title: string
  specSummary: string
  heroMetric: string
  preferredHandles: string[]
  fallbackImage: string
}

const CHAPTER_CONFIG: ChapterMeta[] = [
  {
    id: 'machines',
    shortLabel: 'Machines',
    title: 'Rotary Tattoo Machines',
    specSummary: 'German coreless & direct-drive architecture · 3.5 mm to 4.5 mm stroke',
    heroMetric: '3.5–4.5 mm Stroke',
    preferredHandles: [
      'papa-pen-v3-black-full-set',
      'papa-pen-v2-1',
      'papa-pen-jet-black',
    ],
    fallbackImage: '/product-images/img_113_papa_pen_jet_black_1__cutout.webp',
  },
  {
    id: 'cartridges',
    shortLabel: 'Needles',
    title: 'Surgical 316L Needle Cartridges',
    specSummary: '62 needle configurations · Medical polycarbonate · Internal safety membrane',
    heroMetric: '62 Needle Configs',
    preferredHandles: [
      'papa-premium-tattoo-cartridges',
      'papa-standard-tattoo-cartridges',
    ],
    fallbackImage: '/product-images/papa-premium-tattoo-cartridges-round-cutout.webp',
  },
  {
    id: 'grips',
    shortLabel: 'Grips',
    title: 'CNC Click & Disposable Grips',
    specSummary: '6061-T6 billet aluminum, 316L stainless steel & EO sterile single-use sleeves',
    heroMetric: '6061-T6 Alloy',
    preferredHandles: [
      'papa-adjustable-click-grip-v2-blue',
      'papa-adjustable-click-grip-blue',
      'papa-adjustable-grip-v3-33-mm-black',
    ],
    fallbackImage: '/product-images/img_111_papa_adjustment_grips_1__cutout.webp',
  },
  {
    id: 'power',
    shortLabel: 'Power',
    title: 'Power & Drive Interfaces',
    specSummary: 'Cordless OLED battery packs, desktop voltage units & gold-plated RCA leads',
    heroMetric: '5–13 V Regulated',
    preferredHandles: [
      'papa-volt-battery',
      'papa-power-bullet',
      'papa-foot-pedal',
    ],
    fallbackImage: '/product-images/img_041_papa_volt_large_cutout.webp',
  },
  {
    id: 'gear',
    shortLabel: 'Studio',
    title: 'Studio Workstation & Gear',
    specSummary: 'Hardshell transport cases, recessed trays, stencil lock & studio apparel',
    heroMetric: 'Pro Parlor Setup',
    preferredHandles: [
      'papa-travel-case',
      'papa-tray-large',
      'papa-stencilock-stencil-solution',
    ],
    fallbackImage: '/product-images/img_021_papa_v3_full_case-2_1_cutout.webp',
  },
]

const EMPTY_PRODUCTS: ShopifyProduct[] = []

export const PapaProductsPage: React.FC = () => {
  const loaderData = useLoaderData({ from: '/products/' })
  const search = useSearch({ from: '/products/' })
  const navigate = useNavigate({ from: '/products/' })
  const catalogAnchorRef = useRef<HTMLDivElement>(null)

  const { data: queriedProducts } = useQuery({
    ...catalogQueryOptions,
    initialData:
      loaderData?.products && loaderData.products.length > 0
        ? loaderData.products
        : undefined,
  })

  const allProducts = queriedProducts ?? loaderData?.products ?? EMPTY_PRODUCTS

  const activeCategory: CategoryFilter = search.category || 'all'
  const viewMode: ViewMode = search.view || 'lineup'
  const showComparison = Boolean(search.compare)

  const [draftQuery, setDraftQuery] = useState<string | null>(null)
  const searchInput = draftQuery ?? (search.q || '')

  const updateRouteSearch = (patch: Partial<ProductsSearchParams>) => {
    const nextCategory = patch.category !== undefined ? patch.category : activeCategory
    const nextView = patch.view !== undefined ? patch.view : viewMode
    const nextCompare =
      patch.compare !== undefined ? patch.compare : showComparison
    const nextQ = patch.q !== undefined ? patch.q : searchInput.trim() || undefined

    void navigate({
      search: {
        ...(nextCategory && nextCategory !== 'all' ? { category: nextCategory } : {}),
        ...(nextView && nextView !== 'lineup' ? { view: nextView } : {}),
        ...(nextCompare ? { compare: true } : {}),
        ...(nextQ ? { q: nextQ } : {}),
      },
      replace: true,
      resetScroll: false,
    })
  }

  const allModelGroups = useMemo(
    () => groupProductsIntoModels(allProducts),
    [allProducts]
  )

  const machineBenchmarks = useMemo(
    () => buildLiveMachineBenchmarks(allProducts),
    [allProducts]
  )

  const groupsByCategory = useMemo(() => {
    const map: Record<LineupCategory, HardwareModelGroup[]> = {
      machines: [],
      cartridges: [],
      grips: [],
      power: [],
      gear: [],
    }
    for (const group of allModelGroups) {
      map[group.category].push(group)
    }
    return map
  }, [allModelGroups])

  const filteredGroups = useMemo(() => {
    const base =
      activeCategory === 'all'
        ? allModelGroups
        : groupsByCategory[activeCategory] || []

    const q = searchInput.trim().toLowerCase()
    if (!q) return base

    return base.filter(group => {
      if (
        group.masterTitle.toLowerCase().includes(q) ||
        group.specLine.toLowerCase().includes(q)
      ) {
        return true
      }
      return group.options.some(
        opt =>
          opt.label.toLowerCase().includes(q) ||
          opt.product.title.toLowerCase().includes(q) ||
          opt.product.handle.toLowerCase().includes(q) ||
          (opt.product.description && opt.product.description.toLowerCase().includes(q))
      )
    })
  }, [activeCategory, allModelGroups, groupsByCategory, searchInput])

  const filteredSkuCount = useMemo(
    () => filteredGroups.reduce((sum, g) => sum + g.options.length, 0),
    [filteredGroups]
  )

  const handleSelectFamilyTile = (cat: LineupCategory) => {
    const next: CategoryFilter = activeCategory === cat ? 'all' : cat
    updateRouteSearch({ category: next })
  }

  const isSectionedOverview =
    viewMode === 'lineup' && activeCategory === 'all' && !searchInput.trim()

  return (
    <div className="min-h-[100dvh] bg-transparent text-zinc-900 dark:text-zinc-100 font-sans pb-28 transition-colors">
      {/* ============================================================ */}
      {/* 1. ARCHITECTURAL LINEUP HEADER & 5-FAMILY SPECIMEN STAGE      */}
      {/* ============================================================ */}
      <section className="pt-8 pb-8 sm:pt-12 sm:pb-10 px-4 sm:px-6 lg:px-8 border-b border-[#e2dfd8] dark:border-white/[0.08]">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto space-y-8">
          {/* Split Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#0d5d50] dark:text-[#38e8c6]">
                <ShieldCheck className="w-4 h-4" />
                <span>Factory-Direct Tattoo Engineering</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-950 dark:text-white font-display leading-[1.06]">
                Papa Hardware Lineup
              </h1>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Explore continuous-drive rotary machines, Japanese 316L surgical needle cartridges, and CNC 6061-T6 click grips—consolidated by hardware family with live finish selection and rapid studio ordering.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div className="px-3.5 py-2 rounded-xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.03] text-xs font-mono text-zinc-600 dark:text-zinc-300 tabular-nums">
                <span className="font-bold text-zinc-950 dark:text-white">
                  {allModelGroups.length}
                </span>{' '}
                models ·{' '}
                <span className="font-bold text-zinc-950 dark:text-white">
                  {allProducts.length}
                </span>{' '}
                SKUs
              </div>

              <Link
                to="/collections"
                className="px-3.5 py-2 rounded-xl border border-[#e2dfd8] dark:border-white/15 bg-white dark:bg-white/[0.05] hover:border-zinc-400 dark:hover:border-[#38e8c6]/50 text-xs font-mono font-semibold text-zinc-800 dark:text-zinc-200 inline-flex items-center gap-1.5 transition-[border-color,transform] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] whitespace-nowrap"
              >
                <span>Needle &amp; SKU Filter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 5 Interactive Hardware Family Specimen Tiles */}
          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4"
            role="navigation"
            aria-label="Hardware families"
          >
            {CHAPTER_CONFIG.map(chapter => {
              const isSelected = activeCategory === chapter.id
              const modelCount = groupsByCategory[chapter.id]?.length || 0
              const skuCount = (groupsByCategory[chapter.id] || []).reduce(
                (acc, g) => acc + g.options.length,
                0
              )
              const imgUrl = getRepresentativeImage(
                allProducts,
                chapter.preferredHandles,
                chapter.fallbackImage
              )

              return (
                <button
                  key={chapter.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => handleSelectFamilyTile(chapter.id)}
                  className={`group text-left rounded-2xl border p-4 flex flex-col justify-between gap-3 transition-[border-color,background-color,box-shadow,transform] duration-200 ease-[var(--ease-out-strong)] active:scale-[0.98] ${
                    isSelected
                      ? 'border-[#0d5d50] dark:border-[#38e8c6] bg-white dark:bg-[#262933] ring-1 ring-[#0d5d50] dark:ring-[#38e8c6] shadow-sm'
                      : 'border-[#e2dfd8] dark:border-white/[0.08] bg-white/85 dark:bg-[#1e212a] hover:bg-white dark:hover:bg-[#262933] hover:border-zinc-300 dark:hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 w-full">
                    <span
                      className={`text-[11px] font-mono font-semibold whitespace-nowrap truncate ${
                        isSelected
                          ? 'text-[#0d5d50] dark:text-[#38e8c6]'
                          : 'text-zinc-500 dark:text-zinc-400'
                      }`}
                    >
                      {chapter.heroMetric}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md bg-[#f5f4f0] dark:bg-white/[0.07] text-[10px] font-mono font-semibold text-zinc-600 dark:text-zinc-300 tabular-nums">
                      {skuCount}
                    </span>
                  </div>

                  <div className="h-24 sm:h-28 w-full rounded-xl bg-[#f8f7f4] dark:bg-[#16181f] border border-[#eceae4] dark:border-white/[0.04] flex items-center justify-center p-2.5 overflow-hidden">
                    <img
                      src={imgUrl}
                      alt={chapter.title}
                      loading="eager"
                      className="max-h-full max-w-[85%] object-contain transition-transform duration-200 ease-[var(--ease-out-strong)] group-hover:scale-[1.06] drop-shadow-[0_6px_12px_rgba(18,18,16,0.1)] dark:drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)]"
                    />
                  </div>

                  <div>
                    <div className="font-bold text-sm text-zinc-950 dark:text-white tracking-tight">
                      {chapter.shortLabel}
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono tabular-nums">
                      {modelCount} {modelCount === 1 ? 'model' : 'models'}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. FLUSH STICKY COMMAND BAR                                  */}
      {/* ============================================================ */}
      <div
        ref={catalogAnchorRef}
        className="sticky top-16 sm:top-[93px] lg:top-[101px] z-30 w-full border-b border-[#e2dfd8]/90 dark:border-white/[0.08] bg-[#f5f4f0]/95 dark:bg-[#181a21]/92 backdrop-blur-xl"
      >
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col xl:flex-row xl:items-center justify-between gap-2.5">
          {/* Concise Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'all' as CategoryFilter, label: 'All', count: allModelGroups.length },
              ...CHAPTER_CONFIG.map(c => ({
                id: c.id as CategoryFilter,
                label: c.shortLabel,
                count: groupsByCategory[c.id]?.length || 0,
              })),
            ].map(tab => {
              const isActive = activeCategory === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => updateRouteSearch({ category: tab.id })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold whitespace-nowrap transition-[background-color,color,transform] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] inline-flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-white/[0.06]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono tabular-nums ${
                      isActive
                        ? 'bg-white/20 dark:bg-black/15 text-current'
                        : 'bg-zinc-200/80 dark:bg-white/[0.08] text-zinc-500 dark:text-zinc-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Search, Machine Benchmark Toggle & View Mode Switcher */}
          <div className="flex items-center gap-2">
            {/* Instant Search */}
            <div className="relative flex-1 xl:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
              <input
                type="search"
                value={searchInput}
                onChange={e => {
                  const val = e.target.value
                  setDraftQuery(val)
                  updateRouteSearch({ q: val.trim() || '' })
                }}
                placeholder="Search model or spec..."
                aria-label="Search hardware lineup"
                className="w-full pl-8.5 pr-7 py-1.5 text-xs font-mono rounded-lg border border-[#e2dfd8] dark:border-white/10 bg-white dark:bg-white/[0.05] text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 focus:outline-hidden focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setDraftQuery(null)
                    updateRouteSearch({ q: '' })
                  }}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-zinc-400 hover:text-zinc-800 dark:hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Compare Machines Toggle */}
            <button
              type="button"
              aria-pressed={showComparison}
              onClick={() =>
                updateRouteSearch({ compare: !showComparison })
              }
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-[border-color,background-color,color,transform] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] inline-flex items-center gap-1.5 whitespace-nowrap ${
                showComparison
                  ? 'border-[#0d5d50] dark:border-[#38e8c6] bg-[#0d5d50]/10 dark:bg-[#38e8c6]/15 text-[#0d5d50] dark:text-[#38e8c6]'
                  : 'border-[#e2dfd8] dark:border-white/10 bg-white dark:bg-white/[0.05] text-zinc-700 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-white/25'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {showComparison ? 'Comparing' : 'Compare'}
              </span>
            </button>

            {/* View Switcher: Lineup Gallery vs Studio Spec Sheet */}
            <div
              className="inline-flex items-center p-0.5 rounded-lg border border-[#e2dfd8] dark:border-white/10 bg-white dark:bg-white/[0.04] shrink-0"
              role="group"
              aria-label="Display mode"
            >
              <button
                type="button"
                aria-pressed={viewMode === 'lineup'}
                onClick={() => updateRouteSearch({ view: 'lineup' })}
                className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold inline-flex items-center gap-1.5 transition-[background-color,color] duration-150 whitespace-nowrap ${
                  viewMode === 'lineup'
                    ? 'bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Lineup</span>
              </button>

              <button
                type="button"
                aria-pressed={viewMode === 'sheet'}
                onClick={() => updateRouteSearch({ view: 'sheet' })}
                className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold inline-flex items-center gap-1.5 transition-[background-color,color] duration-150 whitespace-nowrap ${
                  viewMode === 'sheet'
                    ? 'bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Spec Sheet</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. MAIN LINEUP / COMPARATOR / SPEC SHEET WORKSPACE            */}
      {/* ============================================================ */}
      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-14">
        {/* Live Machine Telemetry Comparator */}
        {showComparison && (
          <LiveMachineComparator
            benchmarks={machineBenchmarks}
            onClose={() => updateRouteSearch({ compare: false })}
          />
        )}

        {/* Empty State */}
        {filteredGroups.length === 0 ? (
          <div className="py-20 text-center space-y-4 rounded-3xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.02] p-8">
            <Box className="w-10 h-10 text-zinc-400 mx-auto" />
            <h2 className="text-lg font-bold text-zinc-950 dark:text-white">
              No hardware matched "{searchInput}"
            </h2>
            <p className="text-xs font-mono text-zinc-500 max-w-sm mx-auto">
              Clear your search filter or switch back to the full hardware lineup.
            </p>
            <button
              type="button"
              onClick={() => {
                setDraftQuery(null)
                updateRouteSearch({ category: 'all', q: '' })
              }}
              className="px-5 py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-mono font-semibold uppercase tracking-wider active:scale-[0.97] transition-transform"
            >
              Show All Hardware
            </button>
          </div>
        ) : viewMode === 'sheet' ? (
          /* Studio Quick-Order Spec Sheet */
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-3 border-b border-[#e2dfd8] dark:border-white/[0.08]">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white tracking-tight font-display">
                  Studio Quick-Order Manifest
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  All colorways and editions expanded for rapid single-click studio restocking.
                </p>
              </div>
              <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 tabular-nums">
                {filteredSkuCount} SKUs listed
              </div>
            </div>

            <StudioSpecSheet groups={filteredGroups} />
          </section>
        ) : isSectionedOverview ? (
          /* Modular Sectioned Hardware Monograph */
          <div className="space-y-16">
            {CHAPTER_CONFIG.map(chapter => {
              const groups = groupsByCategory[chapter.id] || []
              if (groups.length === 0) return null
              const chapterSkus = groups.reduce((acc, g) => acc + g.options.length, 0)

              return (
                <section
                  key={chapter.id}
                  id={`sector-${chapter.id}`}
                  className="space-y-6 scroll-mt-36"
                >
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#e2dfd8] dark:border-white/[0.08]">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white tracking-tight font-display">
                        {chapter.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        {chapter.specSummary}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {chapter.id === 'machines' && !showComparison && (
                        <button
                          type="button"
                          onClick={() => updateRouteSearch({ compare: true })}
                          className="px-3 py-1.5 rounded-lg border border-[#e2dfd8] dark:border-white/15 bg-white dark:bg-white/[0.05] hover:border-zinc-400 dark:hover:border-[#38e8c6]/50 text-xs font-mono font-semibold text-zinc-800 dark:text-zinc-200 inline-flex items-center gap-1.5 transition-[border-color,transform] duration-150 active:scale-[0.97] whitespace-nowrap"
                        >
                          <Scale className="w-3.5 h-3.5 text-[#0d5d50] dark:text-[#38e8c6]" />
                          <span>Compare 4 Machines</span>
                        </button>
                      )}

                      <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500 tabular-nums whitespace-nowrap">
                        {groups.length} {groups.length === 1 ? 'model' : 'models'} · {chapterSkus}{' '}
                        {chapterSkus === 1 ? 'SKU' : 'SKUs'}
                      </span>
                    </div>
                  </div>

                  {chapter.id === 'cartridges' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {groups.map(group => (
                        <HardwareModelCard key={group.id} group={group} />
                      ))}

                      {/* Inline 62-Size Cartridge Engineering Architecture Card */}
                      <div className="sm:col-span-2 rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#1e212a] p-6 sm:p-8 flex flex-col justify-between gap-6">
                        <div className="space-y-3">
                          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-amber-700 dark:text-amber-400">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Japanese 316L Surgical Metallurgy</span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white tracking-tight font-display">
                            62 Precision Needle Configurations
                          </h3>
                          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
                            Every box of 20 cartridges features a medical-grade polycarbonate nozzle, high-tension safety membrane to prevent ink backflow, and EO gas batch sterilization across Round Liner, Round Shader, Magnum, and Curved Magnum tapers.
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-3 py-3.5 border-y border-[#eceae4] dark:border-white/[0.07] font-mono">
                          <div>
                            <div className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white tabular-nums">
                              RL · RS · M1 · RM
                            </div>
                            <div className="text-[11px] text-zinc-400">4 Needle Families</div>
                          </div>
                          <div>
                            <div className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white tabular-nums">
                              0.25 – 0.35 mm
                            </div>
                            <div className="text-[11px] text-zinc-400">Bugpin &amp; Standard</div>
                          </div>
                          <div>
                            <div className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white tabular-nums">
                              100% EO Gas
                            </div>
                            <div className="text-[11px] text-zinc-400">Sterile Blisters</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <Link
                            to="/collections"
                            search={{ category: 'cartridges', series: 'premium' }}
                            className="px-4 py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-mono font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity active:scale-[0.98] whitespace-nowrap"
                          >
                            <span>Filter by Needle Gauge</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() =>
                              updateRouteSearch({ category: 'cartridges', view: 'sheet' })
                            }
                            className="px-4 py-2.5 rounded-xl border border-[#e2dfd8] dark:border-white/15 text-xs font-mono font-semibold text-zinc-700 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-white/30 transition-colors whitespace-nowrap"
                          >
                            Quick-Order View
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {groups.map(group => (
                        <HardwareModelCard key={group.id} group={group} />
                      ))}
                    </div>
                  )}
                </section>
              )
            })}
          </div>
        ) : (
          /* Filtered Category or Search Results Grid */
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-[#e2dfd8] dark:border-white/[0.08]">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white tracking-tight font-display">
                  {activeCategory === 'all'
                    ? `Search Results`
                    : CHAPTER_CONFIG.find(c => c.id === activeCategory)?.title ||
                      'Hardware Lineup'}
                </h2>
                {activeCategory !== 'all' && (
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    {CHAPTER_CONFIG.find(c => c.id === activeCategory)?.specSummary}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-zinc-500 dark:text-zinc-400 tabular-nums">
                <span>
                  {filteredGroups.length} {filteredGroups.length === 1 ? 'model' : 'models'} (
                  {filteredSkuCount} {filteredSkuCount === 1 ? 'SKU' : 'SKUs'})
                </span>
                {(activeCategory !== 'all' || searchInput.trim()) && (
                  <button
                    type="button"
                    onClick={() => {
                      setDraftQuery(null)
                      updateRouteSearch({ category: 'all', q: '' })
                    }}
                    className="text-[#0d5d50] dark:text-[#38e8c6] font-semibold hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredGroups.map(group => (
                <HardwareModelCard key={group.id} group={group} />
              ))}
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* 4. STUDIO & B2B FACTORY PROCUREMENT BAND                      */}
        {/* ============================================================ */}
        <section className="rounded-3xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#1e2028] p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#0d5d50] dark:text-[#38e8c6]">
              <Building2 className="w-4 h-4" />
              <span>Studio &amp; Academy Wholesale</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white tracking-tight font-display">
              Equipping a Multi-Chair Parlor or Convention Booth?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Access tiered studio volume pricing up to 35% off, custom needle blister branding, and priority international dispatch.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/contact"
              className="px-5 py-3 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 font-mono font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-[opacity,transform] duration-150 active:scale-[0.98] whitespace-nowrap"
            >
              Request Studio Pricing
            </Link>
            <Link
              to="/distributors"
              className="px-5 py-3 rounded-xl border border-[#e2dfd8] dark:border-white/15 text-zinc-800 dark:text-zinc-200 font-mono font-semibold text-xs uppercase tracking-wider hover:bg-[#f5f4f0] dark:hover:bg-white/[0.05] transition-[background-color,transform] duration-150 active:scale-[0.98] whitespace-nowrap"
            >
              Authorized Distributors
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
