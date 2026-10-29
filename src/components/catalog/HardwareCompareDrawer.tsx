import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Check, ShoppingBag, Sparkles, X, RotateCw, ArrowRight } from 'lucide-react'
import { MachineBenchmarkItem } from '../../lib/hardwareLineup'
import { formatProductImageUrl } from '../../utils/imageUrl'
import { ModelViewer3D } from '../common/ModelViewer3D'
import { useCart } from '../../context/CartContext'

interface HardwareCompareDrawerProps {
  isOpen: boolean
  onClose: () => void
  benchmarks: MachineBenchmarkItem[]
}

export const HardwareCompareDrawer: React.FC<HardwareCompareDrawerProps> = ({
  isOpen,
  onClose,
  benchmarks,
}) => {
  const { addToCart } = useCart()
  const [show3DForHandle, setShow3DForHandle] = useState<string | null>(null)
  const [addedHandles, setAddedHandles] = useState<Record<string, boolean>>({})

  if (!isOpen) return null

  const handleQuickAdd = (item: MachineBenchmarkItem) => {
    if (!item.product) return
    const variants = item.product.variants?.edges?.map(e => e.node) || []
    const firstAvailable = variants.find(v => v.availableForSale !== false) || variants[0]
    if (!firstAvailable) return

    addToCart(item.product, firstAvailable, 1)
    setAddedHandles(prev => ({ ...prev, [item.handle]: true }))
    setTimeout(() => {
      setAddedHandles(prev => ({ ...prev, [item.handle]: false }))
    }, 1500)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Hardware Model Telemetry Comparison"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 animate-in fade-in duration-200"
    >
      {/* Click outside backdrop */}
      <div
        className="fixed inset-0 -z-10"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="w-full max-w-6xl max-h-[92vh] flex flex-col rounded-t-[32px] sm:rounded-[32px] bg-[#f5f5f7] dark:bg-[#121214] border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden transition-all duration-300">
        {/* Drawer Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-black/[0.06] dark:border-white/[0.08] apple-glass-chrome flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Rotary Apparatus Architecture</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-[#f5f5f7] mt-0.5">
              Compare Rotary Machine Engineering
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close hardware comparison"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-black/[0.05] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/10 dark:hover:bg-white/15 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Scrollable Matrix Body */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-6 sm:p-8 space-y-8">
          <div className="min-w-[760px] grid grid-cols-4 gap-4 sm:gap-6">
            {benchmarks.map(item => {
              const product = item.product
              const rawImg = product?.images?.edges?.[0]?.node?.url || ''
              const imgUrl = rawImg ? formatProductImageUrl(rawImg) : ''
              const priceNum = parseFloat(
                product?.priceRange?.minVariantPrice?.amount || '0'
              )
              const isAdded = Boolean(addedHandles[item.handle])
              const is3DActive = show3DForHandle === item.handle

              return (
                <div
                  key={item.handle}
                  className="rounded-2xl bg-white dark:bg-[#1c1f28] p-5 border border-black/[0.06] dark:border-white/[0.06] flex flex-col justify-between shadow-xs space-y-5"
                >
                  {/* Top: Model Header & Photo/3D Stage */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-black/[0.04] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-white">
                        {item.roleTag}
                      </span>
                      {item.supports3D && (
                        <button
                          type="button"
                          onClick={() =>
                            setShow3DForHandle(is3DActive ? null : item.handle)
                          }
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full inline-flex items-center gap-1 transition-colors cursor-pointer ${
                            is3DActive
                              ? 'bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f]'
                              : 'bg-black/[0.04] dark:bg-white/[0.08] text-[#86868b]'
                          }`}
                        >
                          <RotateCw className="w-2.5 h-2.5" />
                          <span>3D</span>
                        </button>
                      )}
                    </div>

                    {/* Specimen Visual */}
                    <div className="aspect-square w-full rounded-xl bg-[#f8f7f4] dark:bg-[#181b22] flex items-center justify-center p-3 relative overflow-hidden">
                      {is3DActive ? (
                        <ModelViewer3D
                          src="/3d-models/papa-pen-v2.glb"
                          alt={item.fallbackName}
                          className="w-full h-full"
                        />
                      ) : (
                        <img
                          src={imgUrl}
                          alt={item.fallbackName}
                          className="max-h-[85%] max-w-[85%] object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)]"
                        />
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold text-base text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
                        {product?.title || item.fallbackName}
                      </h3>
                      <p className="text-[11px] text-[#86868b] mt-0.5 line-clamp-2">
                        {item.bestFor}
                      </p>
                    </div>

                    {/* Price & Action */}
                    <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between gap-2">
                      <div className="text-sm font-semibold tracking-tight tabular-nums text-[#1d1d1f] dark:text-[#f5f5f7]">
                        ${priceNum > 0 ? priceNum.toFixed(2) : '349.95'}
                      </div>

                      {product ? (
                        <button
                          type="button"
                          onClick={() => handleQuickAdd(item)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition-all duration-150 active:scale-[0.97] cursor-pointer ${
                            isAdded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] hover:opacity-90'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3 h-3" />
                              <span>Add</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <Link
                          to="/products/$handle"
                          params={{ handle: item.handle }}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] inline-flex items-center gap-1"
                        >
                          <span>View</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Telemetry Matrix Rows */}
                  <div className="space-y-3.5 pt-3 border-t border-black/[0.06] dark:border-white/[0.06] text-xs">
                    {/* Stroke */}
                    <div>
                      <div className="text-[10px] text-[#86868b] uppercase tracking-wider font-mono">
                        Stroke Length
                      </div>
                      <div className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tabular-nums mt-0.5">
                        {item.strokeLabel}
                      </div>
                      <div className="w-full bg-black/[0.06] dark:bg-white/[0.08] h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="h-full bg-[#1d1d1f] dark:bg-white rounded-full"
                          style={{
                            width: `${Math.min(100, (item.strokeMaxMm / 4.5) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Motor Architecture */}
                    <div>
                      <div className="text-[10px] text-[#86868b] uppercase tracking-wider font-mono">
                        Motor Drive
                      </div>
                      <div className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mt-0.5">
                        {item.motorLabel}
                      </div>
                    </div>

                    {/* Voltage Range */}
                    <div>
                      <div className="text-[10px] text-[#86868b] uppercase tracking-wider font-mono">
                        Operating Voltage
                      </div>
                      <div className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tabular-nums mt-0.5">
                        {item.voltageLabel}
                      </div>
                    </div>

                    {/* Weight (Grams) */}
                    <div>
                      <div className="text-[10px] text-[#86868b] uppercase tracking-wider font-mono">
                        Chassis Weight
                      </div>
                      <div className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tabular-nums mt-0.5">
                        {item.weightLabel}
                      </div>
                      <div className="w-full bg-black/[0.06] dark:bg-white/[0.08] h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{
                            width: `${Math.min(100, (item.weightGrams / 180) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Chassis Metallurgy */}
                    <div>
                      <div className="text-[10px] text-[#86868b] uppercase tracking-wider font-mono">
                        Metallurgy
                      </div>
                      <div className="text-[#1d1d1f] dark:text-[#f5f5f7] mt-0.5">
                        {item.chassisLabel}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="px-6 sm:px-8 py-3.5 border-t border-black/[0.06] dark:border-white/[0.08] apple-glass-chrome flex items-center justify-between text-xs text-[#86868b]">
          <span>All Papa rotary machines include a 1-year factory warranty and 14-day pro replacement guarantee.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] font-semibold text-xs cursor-pointer hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
