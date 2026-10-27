import React, { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  Check,
  Minus,
  Plus,
  RotateCw,
  Scale,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react'
import { ShopifyProduct, ShopifyVariant } from '../../types/shopify'
import { useCart } from '../../context/CartContext'
import { useLocale } from '../../context/LocaleContext'
import { formatProductImageUrl } from '../../utils/imageUrl'
import { ModelViewer3D } from '../common/ModelViewer3D'
import { HardwareModelGroup, MachineBenchmarkItem } from '../../lib/hardwareLineup'

function resolveDefaultVariant(product: ShopifyProduct): ShopifyVariant {
  const variants = product.variants?.edges?.map(e => e.node) || []
  return (
    variants.find(v => v.availableForSale !== false) ||
    variants[0] || {
      id: `${product.id}-default`,
      title: 'Standard',
      availableForSale: product.availableForSale !== false,
      price: {
        amount: product.priceRange?.minVariantPrice?.amount || '25.00',
        currencyCode: product.priceRange?.minVariantPrice?.currencyCode || 'USD',
      },
    }
  )
}

export const HardwareModelCard: React.FC<{ group: HardwareModelGroup }> = ({ group }) => {
  const { addToCart } = useCart()
  const { t } = useLocale()

  const firstAvailableIdx = group.options.findIndex(o => o.available)
  const [selectedIdx, setSelectedIdx] = useState(firstAvailableIdx >= 0 ? firstAvailableIdx : 0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [addedFeedback, setAddedFeedback] = useState(false)
  const transitionTimer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (transitionTimer.current) window.clearTimeout(transitionTimer.current)
    }
  }, [])

  const safeIdx = selectedIdx < group.options.length ? selectedIdx : 0
  const activeOption = group.options[safeIdx]
  const activeProduct = activeOption.product
  const variants = activeProduct.variants?.edges?.map(e => e.node) || []
  const selectedVariant = resolveDefaultVariant(activeProduct)

  const rawImage = activeProduct.images?.edges?.[0]?.node?.url || ''
  const currentImage = formatProductImageUrl(rawImage)

  const amountFormatted = `$${parseFloat(selectedVariant.price.amount).toFixed(2)}`
  const currencyCode = selectedVariant.price.currencyCode || 'USD'
  const hasMultipleVariants = variants.length > 1
  const hasSwatches = group.options.length > 1
  const titleLower = activeProduct.title.toLowerCase()

  const handleSelectOption = (idx: number) => {
    if (idx === safeIdx) return
    setIsTransitioning(true)
    setSelectedIdx(idx)
    if (transitionTimer.current) window.clearTimeout(transitionTimer.current)
    transitionTimer.current = window.setTimeout(() => {
      setIsTransitioning(false)
    }, 140)
  }

  const handleQuickAdd = () => {
    if (!activeOption.available) return
    addToCart(activeProduct, selectedVariant, 1)
    setAddedFeedback(true)
    window.setTimeout(() => setAddedFeedback(false), 1200)
  }

  const categoryBadge =
    group.category === 'machines'
      ? 'ROTARY'
      : group.category === 'cartridges'
      ? '316L NEEDLES'
      : group.category === 'grips'
      ? 'GRIP INTERFACE'
      : group.category === 'power'
      ? 'POWER & DRIVE'
      : 'STUDIO GEAR'

  return (
    <article
      className={`group relative rounded-2xl border p-5 flex flex-col justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-[border-color,box-shadow,transform] duration-200 ease-[var(--ease-out-strong)] ${
        group.isFlagshipAmber
          ? 'border-amber-500/30 dark:border-amber-500/35 bg-white dark:bg-[#22252f] hover:border-amber-500/55 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_16px_34px_-12px_rgba(180,115,20,0.18)] dark:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_16px_34px_rgba(245,158,11,0.12)]'
          : 'border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#22252f] hover:border-zinc-300 dark:hover:border-white/20 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_16px_34px_-12px_rgba(18,18,16,0.1)] dark:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_16px_34px_rgba(0,0,0,0.45)]'
      }`}
    >
      <div>
        {/* Header Metadata Row */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          {group.isFlagshipAmber ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-semibold tracking-wider uppercase bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Flagship Series</span>
            </span>
          ) : (
            <span className="text-[10px] font-mono font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              {categoryBadge}
            </span>
          )}

          {activeOption.available ? (
            <span className="text-[10px] font-mono font-semibold text-[#0d5d50] dark:text-[#38e8c6] whitespace-nowrap">
              {t('card_in_stock')}
            </span>
          ) : (
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
              Sold out
            </span>
          )}
        </div>

        {/* Specimen Stage */}
        <Link
          to="/products/$handle"
          params={{ handle: activeProduct.handle }}
          className="relative aspect-square w-full rounded-xl bg-[#f8f7f4] dark:bg-[#181b22] flex items-center justify-center p-4 overflow-hidden border border-[#eceae4] dark:border-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
        >
          <div
            className="absolute inset-6 rounded-full opacity-[0.07] dark:opacity-[0.14] blur-2xl transition-opacity duration-200 ease-[var(--ease-out-strong)] group-hover:opacity-[0.15] dark:group-hover:opacity-[0.24] pointer-events-none"
            style={{
              background: group.isFlagshipAmber
                ? '#f59e0b'
                : activeOption.swatchCss || '#2ee6ca',
            }}
          />

          <img
            src={currentImage}
            alt={activeProduct.title}
            loading="lazy"
            className={`relative max-h-[86%] max-w-[86%] w-auto h-auto object-contain transition-[transform,opacity,filter] duration-200 ease-[var(--ease-out-strong)] group-hover:scale-[1.04] drop-shadow-[0_10px_18px_rgba(18,18,16,0.1)] dark:drop-shadow-[0_14px_24px_rgba(0,0,0,0.5)] ${
              isTransitioning ? 'opacity-75 blur-[1.5px]' : 'opacity-100 blur-0'
            }`}
            onError={e => {
              const image = e.currentTarget
              if (rawImage && image.src !== rawImage) {
                image.src = rawImage
              }
            }}
          />
        </Link>

        {/* Anodized Swatches / Edition Selector */}
        {hasSwatches && (
          <div className="mt-3.5 pt-0.5">
            {group.options[0].swatchType === 'dot' ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                  <span className="text-zinc-400 dark:text-zinc-500">
                    {group.swatchLabelPrefix || 'Finish'} ({group.options.length})
                  </span>
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium truncate">
                    {activeOption.label}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label={`${group.masterTitle} finish`}>
                  {group.options.map((opt, idx) => {
                    const isSelected = idx === safeIdx
                    return (
                      <button
                        key={opt.product.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={`${opt.label}${opt.available ? '' : ' (Sold out)'}`}
                        title={`${opt.label}${opt.available ? '' : ' · Sold out'}`}
                        onClick={() => handleSelectOption(idx)}
                        className={`relative w-5 h-5 rounded-full transition-transform duration-150 ease-[var(--ease-out-strong)] active:scale-90 ${
                          isSelected
                            ? 'ring-2 ring-offset-2 ring-zinc-900 dark:ring-[#38e8c6] ring-offset-white dark:ring-offset-[#22252f] scale-105'
                            : 'ring-1 ring-black/15 dark:ring-white/20 hover:scale-110 opacity-85 hover:opacity-100'
                        }`}
                        style={{ background: opt.swatchCss }}
                      >
                        <span className="absolute inset-0 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.45)] pointer-events-none" />
                        {!opt.available && (
                          <span
                            aria-hidden="true"
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                          >
                            <span className="w-5 h-[1.5px] bg-red-500/90 -rotate-45 rounded-full" />
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-1.5" role="radiogroup" aria-label={`${group.masterTitle} edition`}>
                {group.options.map((opt, idx) => {
                  const isSelected = idx === safeIdx
                  return (
                    <button
                      key={opt.product.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => handleSelectOption(idx)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-[background-color,color,border-color,transform] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] border ${
                        isSelected
                          ? 'bg-zinc-950 text-white border-zinc-950 dark:bg-[#38e8c6] dark:text-zinc-950 dark:border-[#38e8c6]'
                          : 'bg-[#f8f7f4] dark:bg-[#181b22] text-zinc-600 dark:text-zinc-300 border-[#e2dfd8] dark:border-white/10 hover:border-zinc-400 dark:hover:border-white/25'
                      }`}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Title & Technical Spec Line */}
        <div className="mt-3.5 space-y-1">
          <Link
            to="/products/$handle"
            params={{ handle: activeProduct.handle }}
            className="block"
          >
            <h3
              className={`font-bold text-[15px] leading-snug tracking-tight transition-colors duration-150 line-clamp-2 ${
                group.isFlagshipAmber
                  ? 'text-zinc-950 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400'
                  : 'text-zinc-950 dark:text-white group-hover:text-[#0d5d50] dark:group-hover:text-[#38e8c6]'
              }`}
            >
              {group.masterTitle}
            </h3>
          </Link>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
            {group.specLine}
          </p>
        </div>
      </div>

      {/* Pricing & Direct Action */}
      <div className="mt-5 pt-3.5 border-t border-[#eceae4] dark:border-white/[0.08] flex items-center justify-between gap-2.5">
        <div className="min-w-0">
          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
            {group.category === 'cartridges' || titleLower.includes('disposable')
              ? 'Box of 20'
              : hasMultipleVariants
              ? 'From'
              : 'Unit'}
          </span>
          <div className="flex items-baseline gap-1 whitespace-nowrap tabular-nums">
            <span
              className={`text-base sm:text-[17px] font-bold font-mono tracking-tight ${
                group.isFlagshipAmber
                  ? 'text-amber-700 dark:text-amber-400'
                  : 'text-zinc-950 dark:text-white'
              }`}
            >
              {amountFormatted}
            </span>
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
              {currencyCode}
            </span>
          </div>
        </div>

        {!activeOption.available ? (
          <Link
            to="/products/$handle"
            params={{ handle: activeProduct.handle }}
            className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg font-mono text-[10px] font-semibold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-white/[0.06] shrink-0 whitespace-nowrap"
          >
            Sold out
          </Link>
        ) : hasMultipleVariants ? (
          <Link
            to="/products/$handle"
            params={{ handle: activeProduct.handle }}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] shrink-0 whitespace-nowrap ${
              group.isFlagshipAmber
                ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400 shadow-xs'
                : 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-xs'
            }`}
          >
            <span>Select</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl font-mono text-xs font-semibold transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] shrink-0 whitespace-nowrap ${
              addedFeedback
                ? 'bg-emerald-600 text-white'
                : group.isFlagshipAmber
                ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400 shadow-xs'
                : 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-xs'
            }`}
            aria-label={`Add ${activeProduct.title} to cart`}
          >
            {addedFeedback ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <ShoppingBag className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        )}
      </div>
    </article>
  )
}

export const LiveMachineComparator: React.FC<{
  benchmarks: MachineBenchmarkItem[]
  onClose?: () => void
}> = ({ benchmarks, onClose }) => {
  const [show3DStage, setShow3DStage] = useState(false)

  return (
    <section
      aria-label="Rotary Machine Benchmark Comparison"
      className="rounded-3xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#1c1f28] p-5 sm:p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_18px_40px_-18px_rgba(18,18,16,0.12)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_50px_rgba(0,0,0,0.45)]"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#eceae4] dark:border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#0d5d50] dark:text-[#38e8c6]">
            <Scale className="w-3.5 h-3.5" />
            <span>Live Machine Telemetry · Side-by-Side</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white tracking-tight mt-1 font-display">
            Rotary Machine Architecture Comparison
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShow3DStage(prev => !prev)}
            className="px-3.5 py-2 rounded-xl border border-[#e2dfd8] dark:border-white/15 bg-[#f8f7f4] dark:bg-white/[0.05] text-xs font-mono font-semibold text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-[#38e8c6]/50 transition-[border-color,transform] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] inline-flex items-center gap-1.5 whitespace-nowrap"
          >
            <RotateCw className="w-3.5 h-3.5 text-[#0d5d50] dark:text-[#38e8c6]" />
            <span>{show3DStage ? 'Hide 3D Specimen' : '3D Pen V2 Stage'}</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl border border-[#e2dfd8] dark:border-white/10 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-[color,border-color,transform] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.95]"
              aria-label="Close machine comparison"
              title="Close comparison"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {show3DStage && (
        <div className="mt-6 p-4 rounded-2xl border border-[#eceae4] dark:border-white/[0.06] bg-[#f8f7f4] dark:bg-[#14161c] relative min-h-[320px] flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="absolute top-3.5 left-3.5 z-10 px-3 py-1 rounded-lg bg-zinc-950/85 text-white text-[11px] font-mono">
            Papa Pen V2 · Interactive 3D Specimen (Drag to Orbit)
          </div>
          <ModelViewer3D
            src="/models/papapenv2.glb"
            poster="/product-images/img_113_papa_pen_jet_black_1__cutout.webp"
            alt="Papa Pen V2 3D Model"
            className="w-full h-[300px]"
            cameraOrbit="35deg 82deg 2.0m"
            fieldOfView="28deg"
            autoRotate={true}
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 pt-6">
        {benchmarks.map(item => {
          const p = item.product
          const rawImg = p?.images?.edges?.[0]?.node?.url || ''
          const imgSrc =
            formatProductImageUrl(rawImg) ||
            '/product-images/img_113_papa_pen_jet_black_1__cutout.webp'
          const liveAmount = p?.priceRange?.minVariantPrice?.amount
            ? `$${parseFloat(p.priceRange.minVariantPrice.amount).toFixed(2)}`
            : 'Inquire'
          const currency = p?.priceRange?.minVariantPrice?.currencyCode || 'USD'
          const displayTitle = p ? p.title : item.fallbackName
          const strokePct = Math.round(((item.strokeMaxMm - 2.5) / 2.3) * 100)
          const weightPct = Math.round(((item.weightGrams - 110) / 75) * 100)

          return (
            <div
              key={item.handle}
              className="rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4]/80 dark:bg-[#22252f] p-5 flex flex-col justify-between gap-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-white dark:bg-white/[0.06] border border-[#e2dfd8] dark:border-white/10 text-[10px] font-mono font-semibold text-[#0d5d50] dark:text-[#38e8c6] uppercase whitespace-nowrap">
                    {item.roleTag}
                  </span>
                  <span className="text-sm font-mono font-bold text-zinc-950 dark:text-white tabular-nums whitespace-nowrap">
                    {liveAmount}{' '}
                    <span className="text-[10px] font-normal text-zinc-400">{currency}</span>
                  </span>
                </div>

                <Link
                  to="/products/$handle"
                  params={{ handle: item.handle }}
                  className="aspect-[16/10] w-full rounded-xl bg-white dark:bg-[#181b22] border border-[#eceae4] dark:border-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] flex items-center justify-center p-3 overflow-hidden group/img"
                >
                  <img
                    src={imgSrc}
                    alt={displayTitle}
                    loading="lazy"
                    className="max-h-28 max-w-[85%] w-auto h-auto object-contain transition-transform duration-200 ease-[var(--ease-out-strong)] group-hover/img:scale-105 drop-shadow-[0_8px_16px_rgba(18,18,16,0.1)] dark:drop-shadow-[0_12px_20px_rgba(0,0,0,0.5)]"
                  />
                </Link>

                <div>
                  <h3 className="text-base font-bold text-zinc-950 dark:text-white tracking-tight line-clamp-1">
                    {displayTitle}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-2">
                    {item.bestFor}
                  </p>
                </div>

                <dl className="space-y-3 pt-3 border-t border-[#e2dfd8]/80 dark:border-white/[0.06] text-xs font-mono">
                  <div>
                    <div className="flex items-center justify-between text-[11px]">
                      <dt className="text-zinc-400 dark:text-zinc-500">Stroke</dt>
                      <dd className="font-semibold text-zinc-800 dark:text-zinc-200 tabular-nums whitespace-nowrap">
                        {item.strokeLabel}
                      </dd>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-zinc-200/80 dark:bg-white/[0.08] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#0d5d50] dark:bg-[#38e8c6]"
                        style={{ width: `${Math.min(100, Math.max(25, strokePct))}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px]">
                      <dt className="text-zinc-400 dark:text-zinc-500">Mass</dt>
                      <dd className="font-semibold text-zinc-800 dark:text-zinc-200 tabular-nums whitespace-nowrap">
                        {item.weightLabel}
                      </dd>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-zinc-200/80 dark:bg-white/[0.08] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-zinc-700 dark:bg-zinc-300"
                        style={{ width: `${Math.min(100, Math.max(25, weightPct))}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <dt className="text-[11px] text-zinc-400 dark:text-zinc-500 shrink-0">Drive</dt>
                    <dd className="text-[11px] font-medium text-zinc-800 dark:text-zinc-200 text-right truncate">
                      {item.motorLabel}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-[11px] text-zinc-400 dark:text-zinc-500 shrink-0">Voltage</dt>
                    <dd className="text-[11px] font-medium text-zinc-800 dark:text-zinc-200 tabular-nums whitespace-nowrap">
                      {item.voltageLabel}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-[11px] text-zinc-400 dark:text-zinc-500 shrink-0">Chassis</dt>
                    <dd className="text-[11px] font-medium text-zinc-800 dark:text-zinc-200 text-right truncate">
                      {item.chassisLabel}
                    </dd>
                  </div>
                </dl>
              </div>

              <Link
                to="/products/$handle"
                params={{ handle: item.handle }}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-mono font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-[background-color,transform] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.98] whitespace-nowrap"
              >
                <span>Inspect Machine</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )
        })}
      </div>
    </section>
  )
}

interface SpecSheetRowProps {
  product: ShopifyProduct
  specLine: string
  categoryLabel: string
  isFlagshipAmber?: boolean
}

const SpecSheetRow: React.FC<SpecSheetRowProps> = ({
  product,
  specLine,
  categoryLabel,
  isFlagshipAmber,
}) => {
  const { addToCart } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const variants = product.variants?.edges?.map(e => e.node) || []
  const defaultVariant = resolveDefaultVariant(product)
  const isAvailable =
    variants.length > 0
      ? variants.some(v => v.availableForSale !== false)
      : product.availableForSale !== false
  const hasMultipleVariants = variants.length > 1

  const rawImg = product.images?.edges?.[0]?.node?.url || ''
  const imgSrc = formatProductImageUrl(rawImg)
  const unitPrice = `$${parseFloat(defaultVariant.price.amount).toFixed(2)}`
  const currency = defaultVariant.price.currencyCode || 'USD'

  const handleAdd = () => {
    if (!isAvailable) return
    addToCart(product, defaultVariant, qty)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1200)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-3 md:gap-4 px-4 sm:px-6 py-3.5 hover:bg-[#f8f7f4] dark:hover:bg-white/[0.03] transition-colors">
      {/* Col 1-5: Specimen Thumbnail & Title */}
      <div className="md:col-span-5 flex items-center gap-3.5 min-w-0">
        <Link
          to="/products/$handle"
          params={{ handle: product.handle }}
          className="w-12 h-12 rounded-xl bg-[#f8f7f4] dark:bg-[#181b22] border border-[#eceae4] dark:border-white/[0.06] flex items-center justify-center p-1.5 shrink-0"
        >
          <img
            src={imgSrc}
            alt={product.title}
            loading="lazy"
            className="max-h-full max-w-full object-contain"
          />
        </Link>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-mono font-semibold uppercase tracking-wider ${
                isFlagshipAmber
                  ? 'text-amber-700 dark:text-amber-400'
                  : 'text-zinc-400 dark:text-zinc-500'
              }`}
            >
              {categoryLabel}
            </span>
          </div>
          <Link
            to="/products/$handle"
            params={{ handle: product.handle }}
            className="font-semibold text-sm text-zinc-950 dark:text-white hover:text-[#0d5d50] dark:hover:text-[#38e8c6] transition-colors truncate block"
          >
            {product.title}
          </Link>
        </div>
      </div>

      {/* Col 6-8: Engineering Spec */}
      <div className="md:col-span-3 text-xs text-zinc-500 dark:text-zinc-400 truncate">
        {specLine}
      </div>

      {/* Col 9-10: Availability & Price */}
      <div className="md:col-span-2 flex md:flex-col items-center md:items-end justify-between gap-1">
        <div className="font-mono font-bold text-sm text-zinc-950 dark:text-white tabular-nums whitespace-nowrap">
          {hasMultipleVariants && (
            <span className="text-[10px] font-normal text-zinc-400 mr-1">From</span>
          )}
          {unitPrice}{' '}
          <span className="text-[10px] font-normal text-zinc-400">{currency}</span>
        </div>
        <span
          className={`text-[10px] font-mono whitespace-nowrap ${
            isAvailable
              ? 'text-[#0d5d50] dark:text-[#38e8c6]'
              : 'text-zinc-400 dark:text-zinc-500'
          }`}
        >
          {isAvailable ? 'In stock' : 'Sold out'}
        </span>
      </div>

      {/* Col 11-12: Quick Order Controls */}
      <div className="md:col-span-2 flex items-center justify-end gap-2">
        {!isAvailable ? (
          <span className="px-3 py-1.5 rounded-lg text-[11px] font-mono text-zinc-400 bg-zinc-100 dark:bg-white/[0.04] whitespace-nowrap">
            Unavailable
          </span>
        ) : hasMultipleVariants ? (
          <Link
            to="/products/$handle"
            params={{ handle: product.handle }}
            className="px-3 py-1.5 rounded-lg border border-[#e2dfd8] dark:border-white/15 bg-white dark:bg-white/[0.04] hover:border-zinc-400 dark:hover:border-[#38e8c6]/50 text-xs font-mono font-semibold text-zinc-900 dark:text-white inline-flex items-center gap-1 transition-[border-color,transform] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] whitespace-nowrap"
          >
            <span>Configure</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        ) : (
          <>
            <div className="inline-flex items-center rounded-lg border border-[#e2dfd8] dark:border-white/10 bg-[#f8f7f4] dark:bg-[#181b22]">
              <button
                type="button"
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-[color,transform] duration-150 active:scale-90"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-6 text-center text-xs font-mono font-semibold text-zinc-900 dark:text-white tabular-nums">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty(q => Math.min(20, q + 1))}
                className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-[color,transform] duration-150 active:scale-90"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold transition-[background-color,transform] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] inline-flex items-center gap-1 whitespace-nowrap ${
                added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 hover:opacity-90'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export const StudioSpecSheet: React.FC<{ groups: HardwareModelGroup[] }> = ({ groups }) => {
  const flatRows = groups.flatMap(g => {
    const categoryLabel =
      g.category === 'machines'
        ? 'Rotary Machine'
        : g.category === 'cartridges'
        ? '316L Cartridge'
        : g.category === 'grips'
        ? 'Grip Interface'
        : g.category === 'power'
        ? 'Power & Drive'
        : 'Studio Gear'

    return g.options.map(opt => ({
      product: opt.product,
      specLine: g.specLine,
      categoryLabel,
      isFlagshipAmber: g.isFlagshipAmber,
    }))
  })

  return (
    <div className="rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#22252f] overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 bg-[#f8f7f4] dark:bg-[#181b22] border-b border-[#e2dfd8] dark:border-white/[0.08] text-[11px] font-mono font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
        <div className="col-span-5">Apparatus / SKU</div>
        <div className="col-span-3">Engineering Specification</div>
        <div className="col-span-2 text-right">Unit Price</div>
        <div className="col-span-2 text-right">Quick Order</div>
      </div>

      <div className="divide-y divide-[#eceae4] dark:divide-white/[0.06]">
        {flatRows.map(row => (
          <SpecSheetRow
            key={row.product.id}
            product={row.product}
            specLine={row.specLine}
            categoryLabel={row.categoryLabel}
            isFlagshipAmber={row.isFlagshipAmber}
          />
        ))}
      </div>
    </div>
  )
}
