import React from 'react'
import {
  ArrowUpDown,
  Check,
  Grid2X2,
  Layers,
  RotateCcw,
  Scale,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'

export interface TelemetryFilterValues {
  stroke: string | null
  motor: string | null
  metallurgy: string | null
  series: 'all' | 'premium' | 'standard'
  needleGroup: string | null
  inStockOnly: boolean
}

export interface SubcategoryPill {
  id: string
  label: string
  badge?: string
  count?: number
}

interface HardwareTelemetryFilterBarProps {
  activeCategory: string
  subcategories?: SubcategoryPill[]
  activeSubcategory: string | null
  onSelectSubcategory: (subId: string | null) => void
  telemetry: TelemetryFilterValues
  onChangeTelemetry: (patch: Partial<TelemetryFilterValues>) => void
  searchQuery: string
  onSearchChange: (q: string) => void
  displayMode: 'grouped' | 'skus'
  onChangeDisplayMode: (mode: 'grouped' | 'skus') => void
  sortOption: string
  onChangeSort: (sort: string) => void
  totalCount: number
  filteredCount: number
  onResetFilters: () => void
  hasActiveFilters: boolean
  onOpenCompare?: () => void
  showCompareButton?: boolean
}

export const STROKE_OPTIONS = [
  { id: '3.5', label: '3.5 mm Fixed' },
  { id: '4.0', label: '4.0 mm Punch' },
  { id: '4.5', label: '3.5 to 4.5 mm Modular' },
]

export const MOTOR_OPTIONS = [
  { id: 'coreless', label: 'German Coreless' },
  { id: 'direct', label: 'Direct-Drive' },
]

export const METALLURGY_OPTIONS = [
  { id: '6061', label: '6061-T6 Billet' },
  { id: '316l', label: '316L Stainless' },
  { id: 'disposable', label: 'Sterile Disposable' },
]

export const NEEDLE_GROUP_OPTIONS = [
  { id: 'liner', label: 'Liners (RL / RLT / RLH)' },
  { id: 'shader', label: 'Shaders (RS)' },
  { id: 'magnum', label: 'Magnums (M1 / M1C)' },
]

export const HardwareTelemetryFilterBar: React.FC<HardwareTelemetryFilterBarProps> = ({
  activeCategory,
  subcategories = [],
  activeSubcategory,
  onSelectSubcategory,
  telemetry,
  onChangeTelemetry,
  searchQuery,
  onSearchChange,
  displayMode,
  onChangeDisplayMode,
  sortOption,
  onChangeSort,
  totalCount,
  filteredCount,
  onResetFilters,
  hasActiveFilters,
  onOpenCompare,
  showCompareButton = false,
}) => {
  const isMachinesCategory = activeCategory === 'machines'
  const isCartridgesCategory = activeCategory === 'cartridges'
  const isGripsCategory = activeCategory === 'grips'
  const isAllCategory = activeCategory === 'all'

  return (
    <div className="sticky top-14 z-20 w-full apple-glass-chrome border-y border-black/[0.06] dark:border-white/[0.08] transition-colors duration-200">
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 space-y-2.5">
        {/* Top Control Strip: Search, Compare Button, Layout Mode, and Sort */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left: Instant Telemetry Search & Reset Button */}
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                placeholder="Search models, stroke, alloy, or specs..."
                aria-label="Filter hardware apparatus by telemetry or name"
                className="w-full pl-8.5 pr-8 py-1.5 rounded-full border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] text-xs text-[#1d1d1f] dark:text-[#f5f5f7] placeholder:text-[#86868b] focus:outline-hidden focus:border-[#1d1d1f] dark:focus:border-white focus:bg-white dark:focus:bg-[#1a1c22] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer p-0.5"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="px-2.5 py-1.5 rounded-full text-[11px] font-medium text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                title="Reset all active filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>

          {/* Right: Compare Trigger, Grouping Mode Switcher & Sort Selector */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 justify-between md:justify-end">
            {/* Compare Models Action Trigger */}
            {showCompareButton && onOpenCompare && (
              <button
                type="button"
                onClick={onOpenCompare}
                className="px-3 py-1.5 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-xs font-semibold inline-flex items-center gap-1.5 hover:opacity-88 active:scale-[0.97] transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] cursor-pointer shadow-xs whitespace-nowrap"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Compare Machines</span>
              </button>
            )}

            {/* Model Grouping vs SKU Grid */}
            <div
              role="group"
              aria-label="Display mode"
              className="inline-flex items-center p-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-[11px]"
            >
              <button
                type="button"
                onClick={() => onChangeDisplayMode('grouped')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium transition-[background-color,color,box-shadow] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer ${
                  displayMode === 'grouped'
                    ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-2xs font-semibold'
                    : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>By Model</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeDisplayMode('skus')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium transition-[background-color,color,box-shadow] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer ${
                  displayMode === 'skus'
                    ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-2xs font-semibold'
                    : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                }`}
              >
                <Grid2X2 className="w-3 h-3" />
                <span>All Finishes</span>
              </button>
            </div>

            {/* In-Stock Filter Pill */}
            <button
              type="button"
              onClick={() => onChangeTelemetry({ inStockOnly: !telemetry.inStockOnly })}
              className={`px-2.5 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5 transition-[background-color,color,border-color] duration-150 cursor-pointer ${
                telemetry.inStockOnly
                  ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 font-semibold'
                  : 'bg-black/[0.03] dark:bg-white/[0.05] text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white border border-transparent'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  telemetry.inStockOnly ? 'bg-emerald-500' : 'bg-zinc-400'
                }`}
              />
              <span>In Stock</span>
            </button>

            {/* Sort Selector Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-[#86868b]">
              <ArrowUpDown className="w-3 h-3" />
              <select
                value={sortOption}
                onChange={e => onChangeSort(e.target.value)}
                aria-label="Sort catalog items"
                className="pl-2 pr-1 py-1 rounded-full border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] text-xs text-[#1d1d1f] dark:text-[#f5f5f7] focus:outline-hidden focus:border-[#1d1d1f] dark:focus:border-white"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="title-asc">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bottom Filter Strip: Adaptive Telemetry Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
          {/* Subcategory Pills (if available for current category) */}
          {subcategories.length > 0 && (
            <div className="flex items-center gap-1.5 pr-2 mr-2 border-r border-black/[0.08] dark:border-white/10 shrink-0">
              <button
                type="button"
                onClick={() => onSelectSubcategory(null)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-[background-color,color] duration-150 whitespace-nowrap cursor-pointer ${
                  activeSubcategory === null
                    ? 'bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] font-semibold'
                    : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white bg-black/[0.03] dark:bg-white/[0.05]'
                }`}
              >
                All Series
              </button>
              {subcategories.map(sub => {
                const isSubActive = activeSubcategory === sub.id
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => onSelectSubcategory(isSubActive ? null : sub.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-[background-color,color] duration-150 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      isSubActive
                        ? 'bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] font-semibold'
                        : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white bg-black/[0.03] dark:bg-white/[0.05]'
                    }`}
                  >
                    <span>{sub.label}</span>
                    {sub.badge && (
                      <span className="text-[9px] px-1 py-0.2 rounded font-semibold bg-black/[0.08] dark:bg-white/[0.12]">
                        {sub.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}

          {/* Stroke Quick Pills (Machines or All) */}
          {(isMachinesCategory || isAllCategory) && (
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[11px] text-[#86868b] font-medium hidden sm:inline">
                Stroke:
              </span>
              {STROKE_OPTIONS.map(opt => {
                const isActive = telemetry.stroke === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      onChangeTelemetry({ stroke: isActive ? null : opt.id })
                    }
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-[background-color,color] duration-150 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] font-semibold'
                        : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white bg-black/[0.03] dark:bg-white/[0.05]'
                    }`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          )}

          {/* Needle Series & Geometry Pills (Cartridges) */}
          {isCartridgesCategory && (
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[11px] text-[#86868b] font-medium hidden sm:inline">
                Series:
              </span>
              {[
                { id: 'all' as const, label: 'All Needles' },
                { id: 'premium' as const, label: 'Papa Premium 316L' },
                { id: 'standard' as const, label: 'Papa Standard EO' },
              ].map(s => {
                const isActive = telemetry.series === s.id
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onChangeTelemetry({ series: s.id })}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-[background-color,color] duration-150 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] font-semibold'
                        : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white bg-black/[0.03] dark:bg-white/[0.05]'
                    }`}
                  >
                    {s.label}
                  </button>
                )
              })}

              <span className="text-[11px] text-[#86868b] font-medium ml-2 hidden sm:inline">
                Geometry:
              </span>
              {NEEDLE_GROUP_OPTIONS.map(g => {
                const isActive = telemetry.needleGroup === g.id
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() =>
                      onChangeTelemetry({ needleGroup: isActive ? null : g.id })
                    }
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-[background-color,color] duration-150 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] font-semibold'
                        : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white bg-black/[0.03] dark:bg-white/[0.05]'
                    }`}
                  >
                    {g.label}
                  </button>
                )
              })}
            </div>
          )}

          {/* Grips Metallurgy Pills */}
          {isGripsCategory && (
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[11px] text-[#86868b] font-medium hidden sm:inline">
                Alloy:
              </span>
              {METALLURGY_OPTIONS.map(m => {
                const isActive = telemetry.metallurgy === m.id
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() =>
                      onChangeTelemetry({ metallurgy: isActive ? null : m.id })
                    }
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-[background-color,color] duration-150 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] font-semibold'
                        : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white bg-black/[0.03] dark:bg-white/[0.05]'
                    }`}
                  >
                    {m.label}
                  </button>
                )
              })}
            </div>
          )}

          {/* Result Count Status Badge */}
          <div className="ml-auto text-[11px] text-[#86868b] font-mono tabular-nums shrink-0 pl-2">
            Showing <strong className="text-[#1d1d1f] dark:text-white font-semibold">{filteredCount}</strong> of {totalCount}
          </div>
        </div>
      </div>
    </div>
  )
}
