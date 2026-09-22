import React, { useMemo } from 'react'
import { ShopifyProduct, ShopifyVariant } from '../../types/shopify'

interface CartridgeMatrixSelectorProps {
  product: ShopifyProduct
  selectedVariant: ShopifyVariant | null
  onSelectVariant: (variant: ShopifyVariant) => void
}

// Canonical display order from user reference specification
const ALL_TYPES = [
  'ROUND LINER',
  'ROUND LINER TIGHT',
  'ROUND LINER DOUBLE TIGHT',
  'ROUND LINER HOLLOW',
  'ROUND SHADER',
  'MAGNUM',
  'MAGNUM CURVED',
  'MAGNUM (OPEN)',
  'MAGNUM CURVED (OPEN)',
  'SAMPLE PACK',
]

const ALL_GAUGES = [
  '#14 EXTRA THICK (0.40)',
  '#12 STANDARD (0.35)',
  '#10 BUGPIN (0.30)',
  '#8 BUGPIN (0.25)',
  '#6 BUGPIN (0.20)',
  '#4 BUGPIN (0.18)',
  'SAMPLE PACK',
]

const ALL_SIZES = [
  '1', '3', '4', '5', '6', '7', '8', '9', '10', '11', '13', '14', '15', '17', '18', '23', '27', 'SAMPLE PACK'
]

export const CartridgeMatrixSelector: React.FC<CartridgeMatrixSelectorProps> = ({
  product,
  selectedVariant,
  onSelectVariant,
}) => {
  // 1. Build lookup index for all variants
  const variants = useMemo(() => {
    return product.variants.edges.map(e => e.node)
  }, [product])

  // Filter types, gauges, sizes that are supported in this product catalog
  const catalogTypes = useMemo(() => {
    const existing = new Set(variants.map(v => v.selectedOptions?.find(o => o.name.toLowerCase() === 'type')?.value).filter(Boolean))
    return ALL_TYPES.filter(t => existing.has(t))
  }, [variants])

  const catalogGauges = useMemo(() => {
    const existing = new Set(variants.map(v => v.selectedOptions?.find(o => o.name.toLowerCase() === 'gauge')?.value).filter(Boolean))
    return ALL_GAUGES.filter(g => existing.has(g))
  }, [variants])

  const catalogSizes = useMemo(() => {
    const existing = new Set(variants.map(v => v.selectedOptions?.find(o => o.name.toLowerCase() === 'size')?.value).filter(Boolean))
    return ALL_SIZES.filter(s => existing.has(s))
  }, [variants])

  // Extract selected option values
  const currentType = useMemo(() => {
    return selectedVariant?.selectedOptions?.find(o => o.name.toLowerCase() === 'type')?.value || catalogTypes[0] || 'ROUND LINER'
  }, [selectedVariant, catalogTypes])

  const currentGauge = useMemo(() => {
    return selectedVariant?.selectedOptions?.find(o => o.name.toLowerCase() === 'gauge')?.value || catalogGauges[0] || '#12 STANDARD (0.35)'
  }, [selectedVariant, catalogGauges])

  const currentSize = useMemo(() => {
    return selectedVariant?.selectedOptions?.find(o => o.name.toLowerCase() === 'size')?.value || catalogSizes[0] || '3'
  }, [selectedVariant, catalogSizes])

  // 2. Discover available options based on existing variants
  const availableCombinations = useMemo(() => {
    const set = new Set<string>()
    for (const v of variants) {
      const t = v.selectedOptions?.find(o => o.name.toLowerCase() === 'type')?.value
      const g = v.selectedOptions?.find(o => o.name.toLowerCase() === 'gauge')?.value
      const s = v.selectedOptions?.find(o => o.name.toLowerCase() === 'size')?.value
      if (t && g && s) {
        set.add(`${t}:::${g}:::${s}`)
      }
    }
    return set
  }, [variants])

  // Find exact or closest variant
  const handleSelect = (newType: string, newGauge: string, newSize: string) => {
    // 1. Exact match
    const exact = variants.find(v => {
      const t = v.selectedOptions?.find(o => o.name.toLowerCase() === 'type')?.value
      const g = v.selectedOptions?.find(o => o.name.toLowerCase() === 'gauge')?.value
      const s = v.selectedOptions?.find(o => o.name.toLowerCase() === 'size')?.value
      return t === newType && g === newGauge && s === newSize
    })

    if (exact) {
      onSelectVariant(exact)
      return
    }

    // 2. Closest match with newType + newGauge (any size)
    const matchTypeGauge = variants.find(v => {
      const t = v.selectedOptions?.find(o => o.name.toLowerCase() === 'type')?.value
      const g = v.selectedOptions?.find(o => o.name.toLowerCase() === 'gauge')?.value
      return t === newType && g === newGauge
    })
    if (matchTypeGauge) {
      onSelectVariant(matchTypeGauge)
      return
    }

    // 3. Match newType (any gauge, any size)
    const matchType = variants.find(v => {
      const t = v.selectedOptions?.find(o => o.name.toLowerCase() === 'type')?.value
      return t === newType
    })
    if (matchType) {
      onSelectVariant(matchType)
    }
  }

  return (
    <div className="space-y-6 pt-2 pb-4 border-y border-zinc-200/80 dark:border-white/[0.08]">
      {/* 1. TYPE SELECTOR */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-mono font-black uppercase tracking-wider text-zinc-950 dark:text-white flex items-center gap-2">
            <span>Type:</span>
            <span className="text-[#0d5d50] dark:text-[#38e8c6] font-mono text-[11px] font-bold">
              {currentType}
            </span>
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          {catalogTypes.map(type => {
            const isSelected = currentType === type
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleSelect(type, currentGauge, currentSize)}
                className={`px-3.5 py-2 text-xs font-mono font-bold tracking-tight rounded-xl border transition-all cursor-pointer select-none active:scale-95 ${
                  isSelected
                    ? 'border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950 shadow-md ring-1 ring-zinc-950/20 dark:ring-white/30'
                    : 'border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#262933] text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-white/30 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                {type}
              </button>
            )
          })}
        </div>
      </div>

      <hr className="border-zinc-200/70 dark:border-white/[0.08]" />

      {/* 2. GAUGE SELECTOR */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-mono font-black uppercase tracking-wider text-zinc-950 dark:text-white flex items-center gap-2">
            <span>Gauge:</span>
            <span className="text-[#0d5d50] dark:text-[#38e8c6] font-mono text-[11px] font-bold">
              {currentGauge}
            </span>
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          {catalogGauges.map(gauge => {
            const isSelected = currentGauge === gauge
            // Check if any size exists for currentType + this gauge
            const hasCombinations = ALL_SIZES.some(s => availableCombinations.has(`${currentType}:::${gauge}:::${s}`))

            return (
              <button
                key={gauge}
                type="button"
                onClick={() => handleSelect(currentType, gauge, currentSize)}
                className={`px-3.5 py-2 text-xs font-mono font-bold tracking-tight rounded-xl border transition-all select-none active:scale-95 ${
                  isSelected
                    ? 'border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950 shadow-md ring-1 ring-zinc-950/20 dark:ring-white/30 cursor-pointer'
                    : hasCombinations
                    ? 'border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#262933] text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-white/30 hover:text-zinc-950 dark:hover:text-white cursor-pointer'
                    : 'border-zinc-200 dark:border-white/[0.04] bg-zinc-100/40 dark:bg-white/[0.02] text-zinc-400 dark:text-zinc-600 opacity-40 cursor-not-allowed'
                }`}
              >
                {gauge}
              </button>
            )
          })}
        </div>
      </div>

      <hr className="border-zinc-100 dark:border-[#1E232E]" />

      {/* 3. SIZE SELECTOR */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-mono font-black uppercase tracking-wider text-zinc-950 dark:text-white flex items-center gap-2">
            <span>Size:</span>
            <span className="text-[#0d5d50] dark:text-[#38e8c6] font-mono text-[11px] font-bold">
              {currentSize}
            </span>
          </label>
          <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
            {variants.length} VARIANT MATRIX
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {catalogSizes.map(size => {
            const isSelected = currentSize === size
            const isAvailable = availableCombinations.has(`${currentType}:::${currentGauge}:::${size}`)
            const matchingVariant = variants.find(v => {
              const t = v.selectedOptions?.find(o => o.name.toLowerCase() === 'type')?.value
              const g = v.selectedOptions?.find(o => o.name.toLowerCase() === 'gauge')?.value
              const s = v.selectedOptions?.find(o => o.name.toLowerCase() === 'size')?.value
              return t === currentType && g === currentGauge && s === size
            })
            const inStock = matchingVariant ? matchingVariant.availableForSale !== false : true

            return (
              <button
                key={size}
                type="button"
                onClick={() => isAvailable && handleSelect(currentType, currentGauge, size)}
                disabled={!isAvailable}
                className={`relative min-w-[44px] h-10 px-2.5 flex items-center justify-center text-xs font-mono font-bold rounded-xl border transition-all select-none active:scale-95 text-center ${
                  isSelected
                    ? inStock
                      ? 'border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950 shadow-md ring-1 ring-zinc-950/20 dark:ring-white/30 cursor-pointer'
                      : 'border-red-500 bg-red-950/30 text-red-400 dark:border-red-400 dark:bg-red-950/50 dark:text-red-300 shadow-sm cursor-pointer'
                    : isAvailable
                    ? inStock
                      ? 'border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#262933] text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-white/30 hover:text-zinc-950 dark:hover:text-white cursor-pointer'
                      : 'border-red-300/60 dark:border-red-900/50 bg-red-50/30 dark:bg-red-950/20 text-zinc-400 dark:text-zinc-500 hover:border-red-400 cursor-pointer'
                    : 'border-zinc-200/50 dark:border-white/[0.04] bg-zinc-100/40 dark:bg-white/[0.02] text-zinc-300 dark:text-zinc-700 opacity-40 cursor-not-allowed line-through'
                }`}
                title={
                  !isAvailable
                    ? 'Configuration unavailable'
                    : !inStock
                    ? `${currentType} ${currentGauge} Size ${size} - OUT OF STOCK`
                    : `${currentType} ${currentGauge} Size ${size}`
                }
              >
                <span>{size}</span>
                {isAvailable && !inStock && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#11141A]" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
