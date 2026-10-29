import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, ShoppingBag, Check, ShieldCheck } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { ShopifyProduct } from '../../types/shopify'

interface FinishOption {
  id: string
  label: string
  colorName: string
  hex: string
  image: string
}

const FINISHES: FinishOption[] = [
  {
    id: 'black',
    label: 'Jet Black',
    colorName: 'Type III Hard Anodized',
    hex: '#1d1d1f',
    image: '/product-images/img_113_papa_pen_jet_black_1__cutout.webp',
  },
  {
    id: 'bronze',
    label: 'Artisan Bronze',
    colorName: 'Satin-Brushed Alloy',
    hex: '#8a6240',
    image: '/product-images/img_124_papa_pen_bronze_1__cutout.webp',
  },
  {
    id: 'red',
    label: 'Anodized Scarlet',
    colorName: 'High-Chroma Studio Red',
    hex: '#a3202e',
    image: '/product-images/img_095_papa_pen_red_2__cutout.webp',
  },
]

export const CleanroomHero: React.FC<{ products?: ShopifyProduct[] }> = ({
  products = [],
}) => {
  const { addToCart, openCart } = useCart()
  const [selectedFinish, setSelectedFinish] = useState<FinishOption>(FINISHES[0])
  const [added, setAdded] = useState(false)

  const handleQuickAdd = () => {
    const penProduct = products.find(p => p.handle === 'papa-pen-v3-black-full-set')
    if (penProduct && penProduct.variants?.edges?.[0]?.node) {
      addToCart(penProduct, penProduct.variants.edges[0].node, 1)
    }
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1400)
    openCart()
  }

  return (
    <section className="relative w-full bg-white dark:bg-[#000000] text-[#1d1d1f] dark:text-[#f5f5f7] pt-12 sm:pt-20 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 border-b border-black/[0.04] dark:border-white/[0.06] overflow-hidden">
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto flex flex-col items-center text-center">
        {/* Subtle Discipline Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-xs font-medium text-[#1d1d1f]/80 dark:text-white/80 mb-6 sm:mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0d5d50] dark:bg-[#38e8c6]" />
          <span>Papa Pen V3 Flagship Set</span>
          <span className="opacity-30">·</span>
          <span>Aerospace 6061-T6 Billet</span>
        </div>

        {/* Display Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold tracking-[-0.038em] text-[#1d1d1f] dark:text-white leading-[1.02] max-w-4xl">
          Sculpted from pure aerospace billet.
        </h1>

        {/* Subtitle */}
        <p className="mt-5 sm:mt-6 text-lg sm:text-2xl text-[#86868b] font-normal tracking-[-0.015em] max-w-2xl leading-relaxed">
          German coreless power. Forward-biased mass balance. The quietest 10,500 RPM precision machine engineered for pro studios.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm font-medium inline-flex items-center gap-2 transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer shadow-[0_8px_20px_rgba(0,0,0,0.12)] ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-[#1d1d1f] text-white hover:bg-black dark:bg-white dark:text-[#1d1d1f] dark:hover:bg-zinc-100'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Studio Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Order Pen V3 Set · $799.95</span>
              </>
            )}
          </button>

          <Link
            to="/products/$handle"
            params={{ handle: 'papa-pen-v3-black-full-set' }}
            className="px-6 sm:px-7 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 text-[#1d1d1f] dark:text-white bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97]"
          >
            <span>Explore Engineering Specs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Floating Product Sculpture with Finish Selector */}
        <div className="relative mt-12 sm:mt-16 w-full max-w-3xl flex flex-col items-center">
          {/* Subtle Ambient Radial Highlight */}
          <div
            aria-hidden="true"
            className="absolute -top-12 left-1/2 -translate-x-1/2 w-4/5 aspect-square rounded-full bg-radial from-black/[0.03] dark:from-white/[0.04] to-transparent blur-3xl pointer-events-none"
          />

          {/* Floating Product Cutout */}
          <div className="relative z-10 w-full min-h-[300px] sm:min-h-[420px] flex items-center justify-center">
            <img
              key={selectedFinish.id}
              src={selectedFinish.image}
              alt={`Papa Pen V3 ${selectedFinish.label}`}
              className="max-h-[320px] sm:max-h-[420px] w-auto object-contain drop-shadow-[0_28px_50px_rgba(0,0,0,0.14)] dark:drop-shadow-[0_32px_60px_rgba(0,0,0,0.85)] transition-transform duration-300 ease-[var(--ease-spring)] hover:scale-[1.03]"
            />
          </div>

          {/* Soft Diffuse Floor Shadow */}
          <div
            aria-hidden="true"
            className="w-3/5 h-6 bg-black/[0.12] dark:bg-black/80 blur-xl rounded-[100%] pointer-events-none"
          />

          {/* Clean Finish Selector Dots */}
          <div className="mt-8 flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              {FINISHES.map(f => {
                const isSelected = f.id === selectedFinish.id
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFinish(f)}
                    aria-label={`Select ${f.label}`}
                    className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-black/[0.06] dark:bg-white/[0.12] shadow-2xs'
                        : 'hover:bg-black/[0.03] dark:hover:bg-white/[0.05]'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full border border-black/10 dark:border-white/20 transition-transform ${
                        isSelected ? 'scale-110 ring-2 ring-[#1d1d1f] dark:ring-white ring-offset-2 dark:ring-offset-black' : ''
                      }`}
                      style={{ backgroundColor: f.hex }}
                    />
                    <span className="text-xs font-medium text-[#1d1d1f] dark:text-white">
                      {f.label}
                    </span>
                  </button>
                )
              })}
            </div>
            <span className="text-[11px] text-[#86868b]">
              {selectedFinish.colorName}
            </span>
          </div>
        </div>

        {/* 3 Quiet Metric Pillars */}
        <div className="mt-16 sm:mt-24 pt-10 sm:pt-14 border-t border-black/[0.06] dark:border-white/[0.08] w-full grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-[#1d1d1f] dark:text-white block tabular-nums">
              10,500 RPM
            </span>
            <span className="text-xs text-[#86868b] block font-medium">
              German Coreless Direct-Drive
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-[#1d1d1f] dark:text-white block tabular-nums">
              134 g
            </span>
            <span className="text-xs text-[#86868b] block font-medium">
              Forward-Biased Center of Mass
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-[#1d1d1f] dark:text-white block tabular-nums">
              &lt; 0.02 mm
            </span>
            <span className="text-xs text-[#86868b] block font-medium">
              Sub-Millimeter Cam Tolerance
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
