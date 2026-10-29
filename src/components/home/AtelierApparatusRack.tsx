import React, { useState, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  ShoppingBag,
  Check,
  Cpu,
  Layers,
  Scale,
  Sparkles,
} from 'lucide-react'
import { HardwareModelGroup } from '../../lib/hardwareLineup'
import { ShopifyProduct, ShopifyVariant } from '../../types/shopify'
import { useCart } from '../../context/CartContext'
import { formatProductImageUrl } from '../../utils/imageUrl'

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

interface AtelierApparatusRackProps {
  groups: HardwareModelGroup[]
}

const SERIAL_CODES: Record<string, string> = {
  'family-papa-pen-v3': 'PTS-MOD-PEN3-6061',
  'family-click-grip-v2': 'PTS-CNC-GRIP-33MM',
  'family-papa-apollo-rotary': 'PTS-ROT-APOLLO-X',
  'papa-premium-tattoo-cartridges': 'PTS-316L-MED-CART',
}

const TELEMETRY_DETAILS: Record<
  string,
  { balance: string; mass: string; tolerance: string }
> = {
  'family-papa-pen-v3': {
    balance: '42% Forward Bias',
    mass: '134 g Net',
    tolerance: '± 0.02 mm',
  },
  'family-click-grip-v2': {
    balance: 'Center-Locked',
    mass: '88 g Net',
    tolerance: '± 0.01 mm',
  },
  'family-papa-apollo-rotary': {
    balance: 'Direct-Drive Cam',
    mass: '142 g Net',
    tolerance: '± 0.02 mm',
  },
}

export const AtelierApparatusRack: React.FC<AtelierApparatusRackProps> = ({
  groups,
}) => {
  const { addToCart, openCart } = useCart()
  const [selectedIndices, setSelectedIndices] = useState<Record<string, number>>({})
  const [addedFeedback, setAddedFeedback] = useState<Record<string, boolean>>({})

  const handleSelectOption = (groupId: string, optionIdx: number) => {
    setSelectedIndices(prev => ({ ...prev, [groupId]: optionIdx }))
  }

  const handleQuickAdd = (group: HardwareModelGroup) => {
    const activeIdx = selectedIndices[group.id] || 0
    const activeOption = group.options[activeIdx] || group.options[0]
    if (!activeOption || !activeOption.available) return

    const product = activeOption.product
    const variant = resolveDefaultVariant(product)
    addToCart(product, variant, 1)

    setAddedFeedback(prev => ({ ...prev, [group.id]: true }))
    window.setTimeout(() => {
      setAddedFeedback(prev => ({ ...prev, [group.id]: false }))
    }, 1400)
    openCart()
  }

  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1440px] mx-auto text-zinc-100">
      {/* Top Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[11px] font-mono tracking-widest text-zinc-400 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2EE6CA] animate-pulse" />
            <span>Atelier Hardware Vault</span>
            <span className="text-zinc-600">/</span>
            <span>01 - 04 Deployments</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.035em] text-white leading-tight">
            Flagship Apparatus Rack.
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
            Each instrument rests in a recessed custom-milled foam dock. Inspect anodized finishes, weight distribution telemetry, and laser-marked engineering tolerances.
          </p>
        </div>

        {/* Global Navigation CTAs */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            to="/products"
            className="px-5 py-2.5 rounded-full bg-white text-[#090A0C] font-medium text-xs inline-flex items-center gap-1.5 hover:bg-zinc-200 transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] shadow-[0_4px_20px_rgba(255,255,255,0.08)]"
          >
            <span>All Studio Systems</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/products"
            search={{ view: 'sheet' }}
            className="px-5 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-xs font-medium text-zinc-300 border border-white/10 whitespace-nowrap transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97]"
          >
            <span>B2B Quick Sheet</span>
          </Link>
        </div>
      </div>

      {/* The Atelier Tray Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {groups.map(group => {
          const activeIdx = selectedIndices[group.id] || 0
          const activeOption = group.options[activeIdx] || group.options[0]
          if (!activeOption) return null

          const activeProduct = activeOption.product
          const selectedVariant = resolveDefaultVariant(activeProduct)
          const rawImage = activeProduct.images?.edges?.[0]?.node?.url || ''
          const currentImage = formatProductImageUrl(rawImage)
          const serial = SERIAL_CODES[group.id] || `PTS-${group.id.slice(0, 8).toUpperCase()}`
          const telemetry = TELEMETRY_DETAILS[group.id] || {
            balance: 'Sub-Gram Calibrated',
            mass: 'Pro Studio Mass',
            tolerance: '± 0.02 mm',
          }
          const isAdded = addedFeedback[group.id]

          return (
            <div
              key={group.id}
              className="group relative rounded-[28px] bg-[#0E1014] border border-white/[0.08] hover:border-white/20 p-6 flex flex-col justify-between overflow-hidden transition-[transform,border-color,box-shadow] duration-250 ease-[var(--ease-spring)] hover:-translate-y-1 shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
            >
              {/* Top Machined Bezel Rim Glow */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none"
              />

              {/* Laser Serial Badge */}
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-4 pb-3 border-b border-white/[0.06]">
                <span className="text-zinc-400 font-semibold tracking-wider">{serial}</span>
                <span className="text-[#2EE6CA] text-[10px] tracking-wide">
                  {telemetry.tolerance}
                </span>
              </div>

              {/* Title and Category */}
              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
                  {group.category}
                </span>
                <h3 className="text-xl font-semibold tracking-[-0.02em] text-white group-hover:text-zinc-100 transition-colors">
                  {group.masterTitle}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-1">{group.specLine}</p>
              </div>

              {/* Recessed Instrument Foam Dock with Specimen Image */}
              <div className="relative my-6 py-6 px-4 rounded-2xl bg-[#090A0C] border border-white/[0.05] flex items-center justify-center min-h-[220px] overflow-hidden">
                {/* Specular Ambient Glow */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-radial from-white/[0.04] to-transparent pointer-events-none"
                />

                {/* Recessed Foam Cutout Contour Shadow */}
                <div
                  aria-hidden="true"
                  className="absolute inset-4 rounded-xl bg-black/60 shadow-[inset_0_4px_16px_rgba(0,0,0,0.9)] pointer-events-none"
                />

                <img
                  src={currentImage}
                  alt={activeProduct.title}
                  loading="lazy"
                  className="relative z-10 max-h-[170px] w-auto object-contain drop-shadow-[0_16px_30px_rgba(0,0,0,0.9)] transition-transform duration-300 ease-[var(--ease-spring)] group-hover:scale-[1.04]"
                />
              </div>

              {/* Anodized Finish Swatches */}
              {group.options.length > 1 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mb-2">
                    <span>FINISH: {activeOption.label.toUpperCase()}</span>
                    <span>{group.options.length} SHADES</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {group.options.map((opt, idx) => {
                      const isSelected = idx === activeIdx
                      return (
                        <button
                          key={opt.product.id}
                          type="button"
                          onClick={() => handleSelectOption(group.id, idx)}
                          aria-label={`Select ${opt.label}`}
                          className={`relative w-6 h-6 rounded-full transition-transform duration-150 cursor-pointer ${
                            isSelected
                              ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#0E1014]'
                              : 'opacity-70 hover:opacity-100 hover:scale-105'
                          }`}
                          style={{
                            background: opt.swatchCss || '#3f3f46',
                          }}
                        />
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Mass & Telemetry Pill Row */}
              <div className="grid grid-cols-2 gap-2 py-3 border-t border-white/[0.06] text-[11px] font-mono text-zinc-400">
                <div className="flex items-center gap-1.5 truncate">
                  <Scale className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span className="truncate">{telemetry.mass}</span>
                </div>
                <div className="flex items-center gap-1.5 justify-end truncate">
                  <Cpu className="w-3.5 h-3.5 text-[#2EE6CA] shrink-0" />
                  <span className="truncate text-zinc-300">{telemetry.balance}</span>
                </div>
              </div>

              {/* Pricing & Quick Requisition Action */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/[0.06]">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                    PRICE
                  </span>
                  <span className="text-lg font-semibold text-white tracking-tight tabular-nums">
                    ${parseFloat(selectedVariant.price.amount).toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to="/products/$handle"
                    params={{ handle: activeProduct.handle }}
                    className="p-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 transition-colors"
                    aria-label={`View ${activeProduct.title} details`}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleQuickAdd(group)}
                    className={`px-3.5 py-2.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5 transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.96] cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-500 text-black font-semibold'
                        : 'bg-white text-[#090A0C] hover:bg-zinc-200'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span className="hidden xl:inline">Requisition</span>
                        <span className="xl:hidden">Bag</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
