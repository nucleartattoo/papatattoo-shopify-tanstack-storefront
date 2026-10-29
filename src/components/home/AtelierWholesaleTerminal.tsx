import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  ShoppingBag,
  Check,
  Truck,
  Plus,
  Minus,
  Percent,
  Plane,
} from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { ShopifyProduct } from '../../types/shopify'

interface MatrixRow {
  code: string
  name: string
  unitPrice: number
  qty: number
}

export const AtelierWholesaleTerminal: React.FC<{ products?: ShopifyProduct[] }> = ({
  products = [],
}) => {
  const { addToCart, openCart } = useCart()
  const [rows, setRows] = useState<MatrixRow[]>([
    { code: '0303RL', name: 'Papa 316L Round Liner 0.30mm #10', unitPrice: 25.0, qty: 5 },
    { code: '0305RL', name: 'Papa 316L Round Liner 0.35mm #12', unitPrice: 25.0, qty: 5 },
    { code: '0315M1', name: 'Papa 316L Weaved Magnum 15 Mag', unitPrice: 25.0, qty: 5 },
    { code: '0309M1C', name: 'Papa 316L Curved Magnum 9 Mag', unitPrice: 25.0, qty: 5 },
  ])
  const [added, setAdded] = useState(false)

  const updateQty = (index: number, delta: number) => {
    setRows(prev =>
      prev.map((r, i) => (i === index ? { ...r, qty: Math.max(0, r.qty + delta) } : r))
    )
  }

  const totalBoxes = rows.reduce((sum, r) => sum + r.qty, 0)
  const subtotal = rows.reduce((sum, r) => sum + r.qty * r.unitPrice, 0)

  // Volume deduction tiers
  const discountRate =
    totalBoxes >= 20 ? 0.15 : totalBoxes >= 10 ? 0.1 : totalBoxes >= 5 ? 0.05 : 0
  const discountAmount = subtotal * discountRate
  const netTotal = subtotal - discountAmount

  const handleBatchDispatch = () => {
    const cartridgeProd = products.find(
      p => p.handle === 'papa-premium-tattoo-cartridges'
    )
    if (cartridgeProd && cartridgeProd.variants?.edges?.[0]?.node) {
      addToCart(cartridgeProd, cartridgeProd.variants.edges[0].node, totalBoxes || 1)
    }
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1400)
    openCart()
  }

  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1440px] mx-auto text-zinc-100">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[11px] font-mono tracking-widest text-zinc-400 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2EE6CA]" />
            <span>Commercial Supply Terminal</span>
            <span className="text-zinc-600">//</span>
            <span>Studio Tier Replenishment</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.035em] text-white leading-tight">
            High-Volume Replenishment Matrix.
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
            Direct factory dispatch for registered studios. Dynamic volume deductions apply instantly: 5% at 5 boxes, 10% at 10 boxes, 15% at 20+ boxes. Complimentary worldwide priority air freight on qualifying orders.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-zinc-400">
          <Plane className="w-4 h-4 text-[#2EE6CA]" />
          <span>Priority Air Dispatch · 40+ Countries</span>
        </div>
      </div>

      {/* Terminal Command Deck Box */}
      <div className="rounded-[32px] bg-[#0E1014] border border-white/[0.08] p-6 sm:p-10 shadow-[0_24px_50px_rgba(0,0,0,0.6)]">
        {/* Terminal Header */}
        <div className="hidden sm:grid sm:grid-cols-12 gap-4 pb-4 border-b border-white/[0.08] text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
          <div className="col-span-2">Configuration</div>
          <div className="col-span-5">Apparatus Specification</div>
          <div className="col-span-2 text-right">Box Price</div>
          <div className="col-span-3 text-right">Quantity (Boxes of 20)</div>
        </div>

        {/* Matrix Rows */}
        <div className="divide-y divide-white/[0.06]">
          {rows.map((row, idx) => (
            <div
              key={row.code}
              className="py-4.5 sm:py-5 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-center font-mono"
            >
              <div className="sm:col-span-2 flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-white/[0.04] border border-white/10 text-xs font-semibold text-[#2EE6CA]">
                  {row.code}
                </span>
              </div>

              <div className="sm:col-span-5 text-sm font-sans text-zinc-200">
                {row.name}
              </div>

              <div className="sm:col-span-2 text-xs sm:text-sm sm:text-right text-zinc-400 tabular-nums">
                ${row.unitPrice.toFixed(2)} USD
              </div>

              <div className="sm:col-span-3 flex items-center sm:justify-end gap-3">
                <div className="inline-flex items-center rounded-xl bg-white/[0.03] border border-white/10 p-1">
                  <button
                    type="button"
                    onClick={() => updateQty(idx, -1)}
                    className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-xs font-semibold text-white tabular-nums">
                    {row.qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQty(idx, 1)}
                    className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="w-20 text-right text-sm font-semibold text-white tabular-nums">
                  ${(row.qty * row.unitPrice).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Terminal Summary & Dispatch Footer */}
        <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-6 font-mono text-xs text-zinc-400">
            <div>
              <span className="text-zinc-500 block text-[10px]">TOTAL BOXES</span>
              <span className="text-lg font-semibold text-white tabular-nums">{totalBoxes} Boxes</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px]">VOLUME TIER</span>
              <span className="text-lg font-semibold text-[#2EE6CA] tabular-nums">
                {discountRate * 100}% DEDUCTION
              </span>
            </div>
            {discountAmount > 0 && (
              <div>
                <span className="text-zinc-500 block text-[10px]">STUDIO SAVINGS</span>
                <span className="text-lg font-semibold text-emerald-400 tabular-nums">
                  -${discountAmount.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
            <div className="text-left sm:text-right font-mono">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">
                COMMERCIAL NET TOTAL
              </span>
              <span className="text-2xl sm:text-3xl font-semibold text-white tabular-nums tracking-tight">
                ${netTotal.toFixed(2)} USD
              </span>
            </div>

            <button
              type="button"
              onClick={handleBatchDispatch}
              className={`w-full sm:w-auto px-8 py-4 rounded-full text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer ${
                added
                  ? 'bg-emerald-500 text-black'
                  : 'bg-white text-[#08090C] hover:bg-zinc-200 shadow-[0_12px_28px_rgba(255,255,255,0.12)]'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Batch Requisitioned</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Dispatch Studio Batch ({totalBoxes} Boxes)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
