import React, { useState, useMemo, useCallback } from 'react'
import { ShopifyProduct, ShopifyVariant } from '../../types/shopify'
import { useCart, CartBatchEntry } from '../../context/CartContext'
import {
  Check,
  CheckCircle2,
  ChevronDown,
  Layers,
  Package,
  Plus,
  Minus,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Truck,
  X,
  Zap,
} from 'lucide-react'

interface StudioReplenishmentMatrixProps {
  product: ShopifyProduct
  onClose?: () => void
}

interface ParsedVariantItem {
  variant: ShopifyVariant
  type: string
  gauge: string
  size: string
  code: string
  price: number
  inStock: boolean
}

interface StudioPresetPack {
  id: string
  name: string
  description: string
  badge: string
  items: Array<{ codePrefix: string; qty: number }>
}

export function formatNeedleCode(type: string, gauge: string, size: string): string {
  let gCode = '12'
  if (gauge.includes('8')) gCode = '08'
  else if (gauge.includes('10')) gCode = '10'
  else if (gauge.includes('12')) gCode = '12'
  else if (gauge.includes('6')) gCode = '06'
  else if (gauge.includes('4')) gCode = '04'
  else if (gauge.includes('14')) gCode = '14'

  let sCode = size.padStart(2, '0')
  if (sCode.length > 2) sCode = size

  let tCode = 'RL'
  const tUpper = type.toUpperCase()
  if (tUpper.includes('DOUBLE TIGHT')) tCode = 'RLT'
  else if (tUpper.includes('HOLLOW')) tCode = 'RLH'
  else if (tUpper.includes('SHADER')) tCode = 'RS'
  else if (tUpper.includes('CURVED')) tCode = 'M1C'
  else if (tUpper.includes('MAGNUM')) tCode = 'M1'
  else if (tUpper.includes('LINER')) tCode = 'RL'

  return `${gCode}${sCode}${tCode}`
}

const STUDIO_PRESETS: StudioPresetPack[] = [
  {
    id: 'fine-line',
    name: 'Fine Line Master Pack',
    description: 'Precision bugpin liners for micro-realism, lettering, and tight outlines.',
    badge: '10 Boxes · 200 Pins',
    items: [
      { codePrefix: '0803RL', qty: 2 },
      { codePrefix: '1003RL', qty: 3 },
      { codePrefix: '1005RL', qty: 3 },
      { codePrefix: '1007RL', qty: 2 },
    ],
  },
  {
    id: 'realism-shading',
    name: 'Black & Grey Realism Pack',
    description: 'Soft curved magnums and tight liners for seamless photo-realistic skin fades.',
    badge: '10 Boxes · 200 Pins',
    items: [
      { codePrefix: '1003RL', qty: 2 },
      { codePrefix: '1007RS', qty: 2 },
      { codePrefix: '1015M1C', qty: 3 },
      { codePrefix: '1023M1C', qty: 3 },
    ],
  },
  {
    id: 'traditional-packing',
    name: 'Bold Color & Traditional Pack',
    description: 'Standard 0.35 mm heavy grouping for solid color saturation and bold lines.',
    badge: '10 Boxes · 200 Pins',
    items: [
      { codePrefix: '1209RL', qty: 2 },
      { codePrefix: '1211RS', qty: 2 },
      { codePrefix: '1215M1', qty: 3 },
      { codePrefix: '1223M1', qty: 3 },
    ],
  },
  {
    id: 'studio-foundation',
    name: 'Studio Workstation Restock',
    description: 'Essential all-round configuration spanning 3RL, 5RL, 7RS, and 15 curved mags.',
    badge: '8 Boxes · 160 Pins',
    items: [
      { codePrefix: '1003RL', qty: 2 },
      { codePrefix: '1005RL', qty: 2 },
      { codePrefix: '1007RS', qty: 2 },
      { codePrefix: '1015M1C', qty: 2 },
    ],
  },
]

export const StudioReplenishmentMatrix: React.FC<StudioReplenishmentMatrixProps> = ({
  product,
  onClose,
}) => {
  const { addBatchToCart } = useCart()

  // State: quantity per variant ID
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL')
  const [selectedGaugeFilter, setSelectedGaugeFilter] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedbackSuccess, setFeedbackSuccess] = useState(false)

  // 1. Parse and catalog all variants
  const parsedVariants: ParsedVariantItem[] = useMemo(() => {
    const edges = product.variants?.edges || []
    return edges.map(({ node: v }) => {
      const type =
        v.selectedOptions?.find(o => o.name.toLowerCase() === 'type')?.value || 'ROUND LINER'
      const gauge =
        v.selectedOptions?.find(o => o.name.toLowerCase() === 'gauge')?.value || '#12 STANDARD (0.35)'
      const size =
        v.selectedOptions?.find(o => o.name.toLowerCase() === 'size')?.value || '3'

      const code = formatNeedleCode(type, gauge, size)
      const price =
        parseFloat(v.price?.amount || '0') ||
        parseFloat(product.priceRange?.minVariantPrice?.amount || '25.00')
      const inStock = v.availableForSale !== false

      return {
        variant: v,
        type,
        gauge,
        size,
        code,
        price,
        inStock,
      }
    })
  }, [product])

  // Extract distinct types & gauges
  const availableTypes = useMemo(() => {
    const set = new Set(parsedVariants.map(v => v.type))
    return Array.from(set)
  }, [parsedVariants])

  const availableGauges = useMemo(() => {
    const set = new Set(parsedVariants.map(v => v.gauge))
    return Array.from(set)
  }, [parsedVariants])

  // Filtered variants
  const filteredVariants = useMemo(() => {
    return parsedVariants.filter(item => {
      if (selectedTypeFilter !== 'ALL' && item.type !== selectedTypeFilter) {
        return false
      }
      if (selectedGaugeFilter !== 'ALL' && item.gauge !== selectedGaugeFilter) {
        return false
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchCode = item.code.toLowerCase().includes(q)
        const matchType = item.type.toLowerCase().includes(q)
        const matchGauge = item.gauge.toLowerCase().includes(q)
        const matchSize = item.size.toLowerCase() === q
        if (!matchCode && !matchType && !matchGauge && !matchSize) {
          return false
        }
      }
      return true
    })
  }, [parsedVariants, selectedTypeFilter, selectedGaugeFilter, searchQuery])

  // Computed totals
  const { totalBoxes, totalPins, subtotal, selectedEntries } = useMemo(() => {
    let boxes = 0
    let cost = 0
    const entries: Array<{ item: ParsedVariantItem; qty: number }> = []

    for (const item of parsedVariants) {
      const q = quantities[item.variant.id] || 0
      if (q > 0) {
        boxes += q
        cost += q * item.price
        entries.push({ item, qty: q })
      }
    }

    return {
      totalBoxes: boxes,
      totalPins: boxes * 20,
      subtotal: cost,
      selectedEntries: entries,
    }
  }, [quantities, parsedVariants])

  // Volume Tier Calculation
  // 5+ Boxes: Free Studio Freight + 5% Volume Allowance
  // 10+ Boxes: Master Parlor Tier (10% Volume Allowance)
  // 20+ Boxes: Distributor Tier (15% Volume Allowance)
  const volumeDiscountPercent = useMemo(() => {
    if (totalBoxes >= 20) return 15
    if (totalBoxes >= 10) return 10
    if (totalBoxes >= 5) return 5
    return 0
  }, [totalBoxes])

  const discountAmount = useMemo(() => {
    return (subtotal * volumeDiscountPercent) / 100
  }, [subtotal, volumeDiscountPercent])

  const finalTotal = useMemo(() => {
    return Math.max(0, subtotal - discountAmount)
  }, [subtotal, discountAmount])

  // Stepper handlers
  const handleSetQuantity = useCallback((variantId: string, qty: number) => {
    const val = Math.max(0, Math.min(999, qty))
    setQuantities(prev => {
      if (val === 0) {
        const next = { ...prev }
        delete next[variantId]
        return next
      }
      return { ...prev, [variantId]: val }
    })
  }, [])

  const handleQuickAdd = useCallback((variantId: string, addQty: number) => {
    setQuantities(prev => {
      const current = prev[variantId] || 0
      return { ...prev, [variantId]: current + addQty }
    })
  }, [])

  const handleResetAll = useCallback(() => {
    setQuantities({})
  }, [])

  // Apply a preset pack
  const handleApplyPreset = useCallback(
    (preset: StudioPresetPack) => {
      const nextQuantities: Record<string, number> = { ...quantities }

      for (const presetItem of preset.items) {
        // Find best matching variant
        const match = parsedVariants.find(
          v => v.code.toLowerCase() === presetItem.codePrefix.toLowerCase()
        )
        if (match) {
          nextQuantities[match.variant.id] =
            (nextQuantities[match.variant.id] || 0) + presetItem.qty
        } else {
          // Fallback match prefix
          const partialMatch = parsedVariants.find(v =>
            v.code.toLowerCase().includes(presetItem.codePrefix.toLowerCase())
          )
          if (partialMatch) {
            nextQuantities[partialMatch.variant.id] =
              (nextQuantities[partialMatch.variant.id] || 0) + presetItem.qty
          }
        }
      }

      setQuantities(nextQuantities)
    },
    [quantities, parsedVariants]
  )

  // Batch Add to Cart
  const handleBatchAddToCart = useCallback(() => {
    if (selectedEntries.length === 0) return

    setIsSubmitting(true)

    const batch: CartBatchEntry[] = selectedEntries.map(({ item, qty }) => ({
      product,
      variant: item.variant,
      quantity: qty,
    }))

    addBatchToCart(batch, true)
    setFeedbackSuccess(true)
    setTimeout(() => {
      setFeedbackSuccess(false)
      setIsSubmitting(false)
    }, 1500)
  }, [selectedEntries, product, addBatchToCart])

  return (
    <div className="rounded-[32px] bg-white dark:bg-[#121214] border border-black/[0.08] dark:border-white/[0.08] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.08)] dark:shadow-[0_30px_70px_-24px_rgba(0,0,0,0.8)] overflow-hidden transition-colors duration-300">
      {/* 1. Header & Studio Tier Banner */}
      <div className="p-6 sm:p-8 lg:p-10 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                B2B Studio Procurement
              </span>
              <span className="text-xs text-[#86868b]">
                Box of 20 Sterile Needles · EO Gas Certified
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-semibold tracking-[-0.03em] text-[#1d1d1f] dark:text-[#f5f5f7]">
              Studio Replenishment Matrix
            </h2>
            <p className="text-xs sm:text-sm text-[#86868b] max-w-2xl leading-relaxed">
              Batch order multiple needle geometries and gauges simultaneously with real-time volume incentives and unified studio dispatch.
            </p>
          </div>

          {/* Volume Incentive Tiers */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#f5f5f7] dark:bg-[#1c1c1e] border border-black/[0.04] dark:border-white/[0.06] shrink-0 space-y-2.5 min-w-[280px]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Volume Allowance</span>
              </span>
              <span className="text-[#86868b] tabular-nums">
                {totalBoxes < 5
                  ? `${5 - totalBoxes} boxes to 5% off`
                  : totalBoxes < 10
                  ? `${10 - totalBoxes} boxes to 10% off`
                  : totalBoxes < 20
                  ? `${20 - totalBoxes} boxes to 15% off`
                  : '15% Max Tier Active'}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300 ease-[var(--ease-spring)]"
                style={{
                  width: `${Math.min(100, (totalBoxes / 20) * 100)}%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#86868b]">
              <span className={totalBoxes >= 5 ? 'text-emerald-600 font-semibold' : ''}>
                5+ (5% off)
              </span>
              <span className={totalBoxes >= 10 ? 'text-emerald-600 font-semibold' : ''}>
                10+ (10% off)
              </span>
              <span className={totalBoxes >= 20 ? 'text-emerald-600 font-semibold' : ''}>
                20+ (15% off)
              </span>
            </div>
          </div>
        </div>

        {/* 2. Studio Preset Quick-Packs */}
        <div className="mt-8 pt-6 border-t border-black/[0.06] dark:border-white/[0.08]">
          <div className="flex items-center justify-between mb-3.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#86868b] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Studio Quick-Packs (One-Click Preload)</span>
            </span>
            <span className="text-xs text-[#86868b] hidden sm:inline">
              Pre-fills matrix with resident artist setups
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {STUDIO_PRESETS.map(preset => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.08] text-left transition-[transform,background-color,border-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.98] cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-semibold text-xs text-[#1d1d1f] dark:text-[#f5f5f7] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {preset.name}
                  </span>
                </div>
                <p className="text-[11px] text-[#86868b] line-clamp-2 leading-relaxed mb-2">
                  {preset.description}
                </p>
                <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <span>+ {preset.badge}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Filter & Search Control Console */}
      <div className="p-6 sm:px-8 lg:px-10 bg-[#fbfbfd] dark:bg-[#161618] border-b border-black/[0.06] dark:border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Type & Gauge Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-black/[0.05] dark:bg-white/[0.08] overflow-x-auto no-scrollbar max-w-full">
            <button
              type="button"
              onClick={() => setSelectedTypeFilter('ALL')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer whitespace-nowrap ${
                selectedTypeFilter === 'ALL'
                  ? 'bg-white text-[#1d1d1f] dark:bg-[#2c2c2e] dark:text-white shadow-2xs font-semibold'
                  : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
              }`}
            >
              All Types
            </button>
            {availableTypes.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedTypeFilter(t)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer whitespace-nowrap ${
                  selectedTypeFilter === t
                    ? 'bg-white text-[#1d1d1f] dark:bg-[#2c2c2e] dark:text-white shadow-2xs font-semibold'
                    : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Gauge Filter */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-black/[0.05] dark:bg-white/[0.08] overflow-x-auto no-scrollbar max-w-full">
            <button
              type="button"
              onClick={() => setSelectedGaugeFilter('ALL')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer whitespace-nowrap ${
                selectedGaugeFilter === 'ALL'
                  ? 'bg-white text-[#1d1d1f] dark:bg-[#2c2c2e] dark:text-white shadow-2xs font-semibold'
                  : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
              }`}
            >
              All Gauges
            </button>
            {availableGauges.map(g => (
              <button
                key={g}
                type="button"
                onClick={() => setSelectedGaugeFilter(g)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer whitespace-nowrap ${
                  selectedGaugeFilter === g
                    ? 'bg-white text-[#1d1d1f] dark:bg-[#2c2c2e] dark:text-white shadow-2xs font-semibold'
                    : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                }`}
              >
                {g.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-[#86868b] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search code (e.g. 1003, 1215)..."
            className="w-full h-9 pl-9 pr-8 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-xs text-[#1d1d1f] dark:text-[#f5f5f7] focus:outline-none focus:ring-1 focus:ring-[#1d1d1f] dark:focus:ring-white transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 4. High-Density Replenishment Matrix Table */}
      <div className="overflow-x-auto no-scrollbar max-h-[580px] overflow-y-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="sticky top-0 z-20 bg-white dark:bg-[#121214] border-b border-black/[0.08] dark:border-white/[0.08] text-[#86868b] uppercase tracking-wider font-semibold text-[11px]">
            <tr>
              <th className="py-3 px-6 sm:px-8">Needle Code</th>
              <th className="py-3 px-4">Configuration Specification</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Box Price</th>
              <th className="py-3 px-6 sm:px-8 text-center min-w-[200px]">Order Allocation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.06]">
            {filteredVariants.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-[#86868b]">
                  No needle configurations match your active filter or search query.
                </td>
              </tr>
            ) : (
              filteredVariants.map(item => {
                const qty = quantities[item.variant.id] || 0
                const isConfigured = qty > 0

                return (
                  <tr
                    key={item.variant.id}
                    className={`transition-colors duration-150 ${
                      isConfigured
                        ? 'bg-emerald-500/[0.04] dark:bg-emerald-500/[0.06]'
                        : 'hover:bg-black/[0.015] dark:hover:bg-white/[0.02]'
                    }`}
                  >
                    {/* Code Badge */}
                    <td className="py-3.5 px-6 sm:px-8 font-mono">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-lg font-bold text-xs tracking-tight ${
                            isConfigured
                              ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-zinc-950 shadow-2xs'
                              : 'bg-black/[0.06] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7]'
                          }`}
                        >
                          {item.code}
                        </span>
                      </div>
                    </td>

                    {/* Specification Details */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                        {item.type}
                      </div>
                      <div className="text-[#86868b] text-[11px] mt-0.5">
                        {item.gauge} · Size {item.size}
                      </div>
                    </td>

                    {/* Availability */}
                    <td className="py-3.5 px-4">
                      {item.inStock ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium inline-flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>In Stock</span>
                        </span>
                      ) : (
                        <span className="text-red-500 font-medium">Sold Out</span>
                      )}
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 text-right tabular-nums font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                      ${item.price.toFixed(2)}
                      <span className="text-[10px] text-[#86868b] block font-normal">
                        per box
                      </span>
                    </td>

                    {/* Quantity Controls & Quick-Add Buttons */}
                    <td className="py-3.5 px-6 sm:px-8">
                      <div className="flex items-center justify-center gap-2">
                        {/* Stepper */}
                        <div className="flex items-center rounded-full bg-black/[0.05] dark:bg-white/[0.08] overflow-hidden px-1 h-9">
                          <button
                            type="button"
                            disabled={!item.inStock}
                            onClick={() => handleSetQuantity(item.variant.id, qty - 1)}
                            className="w-7 h-full flex items-center justify-center text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer active:scale-90"
                            aria-label={`Decrease ${item.code}`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <input
                            type="number"
                            min="0"
                            max="999"
                            disabled={!item.inStock}
                            value={qty === 0 ? '' : qty}
                            onChange={e =>
                              handleSetQuantity(
                                item.variant.id,
                                parseInt(e.target.value, 10) || 0
                              )
                            }
                            placeholder="0"
                            className="w-10 text-center font-semibold text-xs tabular-nums text-[#1d1d1f] dark:text-[#f5f5f7] bg-transparent focus:outline-none"
                          />
                          <button
                            type="button"
                            disabled={!item.inStock}
                            onClick={() => handleSetQuantity(item.variant.id, qty + 1)}
                            className="w-7 h-full flex items-center justify-center text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer active:scale-90"
                            aria-label={`Increase ${item.code}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Quick Box Add Pills (+1, +5) */}
                        <div className="hidden sm:flex items-center gap-1">
                          <button
                            type="button"
                            disabled={!item.inStock}
                            onClick={() => handleQuickAdd(item.variant.id, 1)}
                            className="px-2 py-1 rounded-md text-[10px] font-semibold bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] text-[#1d1d1f] dark:text-[#f5f5f7] active:scale-95 transition-transform cursor-pointer"
                          >
                            +1
                          </button>
                          <button
                            type="button"
                            disabled={!item.inStock}
                            onClick={() => handleQuickAdd(item.variant.id, 5)}
                            className="px-2 py-1 rounded-md text-[10px] font-semibold bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] text-[#1d1d1f] dark:text-[#f5f5f7] active:scale-95 transition-transform cursor-pointer"
                          >
                            +5
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 5. Docked Studio Replenishment Checkout Bar */}
      <div className="p-6 sm:px-8 lg:px-10 bg-[#f5f5f7] dark:bg-[#1c1c1e] border-t border-black/[0.08] dark:border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Summary Metrics */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-xl sm:text-2xl font-semibold tracking-[-0.025em] text-[#1d1d1f] dark:text-[#f5f5f7] tabular-nums">
              {totalBoxes} Boxes Selected
            </span>
            <span className="text-xs text-[#86868b] tabular-nums">
              ({totalPins} sterile needle pins)
            </span>
            {volumeDiscountPercent > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold text-xs">
                {volumeDiscountPercent}% Studio Allowance Applied
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs text-[#86868b]">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Complimentary Studio Freight on 5+ boxes</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>100% EO Gas Sterilized</span>
            </span>
          </div>
        </div>

        {/* Right: Subtotal + Action Button */}
        <div className="flex items-center gap-4 shrink-0">
          {totalBoxes > 0 && (
            <button
              type="button"
              onClick={handleResetAll}
              className="text-xs text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors cursor-pointer underline underline-offset-4"
            >
              Clear All
            </button>
          )}

          <div className="text-right">
            <div className="text-xs text-[#86868b]">Studio Total</div>
            <div className="flex items-baseline gap-1.5 justify-end">
              {discountAmount > 0 && (
                <span className="text-xs text-[#86868b] line-through tabular-nums">
                  ${subtotal.toFixed(2)}
                </span>
              )}
              <span className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] tabular-nums text-[#1d1d1f] dark:text-[#f5f5f7]">
                ${finalTotal.toFixed(2)}
              </span>
              <span className="text-xs text-[#86868b]">USD</span>
            </div>
          </div>

          <button
            type="button"
            disabled={totalBoxes === 0 || isSubmitting}
            onClick={handleBatchAddToCart}
            className={`h-12 px-7 rounded-full text-sm font-medium inline-flex items-center gap-2 transition-[transform,opacity,background-color] duration-150 ease-[var(--ease-out-strong)] ${
              totalBoxes > 0
                ? 'bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] hover:opacity-88 active:scale-[0.97] cursor-pointer shadow-md'
                : 'bg-black/[0.05] text-[#86868b] dark:bg-white/[0.08] cursor-not-allowed'
            }`}
          >
            {feedbackSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
                <span>Added to Studio Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {totalBoxes === 0
                    ? 'Select Configurations'
                    : `Batch Add ${totalBoxes} Boxes`}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
