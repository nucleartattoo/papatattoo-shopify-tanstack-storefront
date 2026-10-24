import React, { useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useLoaderData } from '@tanstack/react-router'
import { ModelViewer3D } from '../components/common/ModelViewer3D'
import { ParallaxApparatusStage } from '../components/common/ParallaxApparatusStage'
import { HardwareModelCard } from '../components/product/HardwareLineupModules'
import { useCart } from '../context/CartContext'
import { catalogQueryOptions } from '../lib/catalog.queries'
import {
  buildLiveMachineBenchmarks,
  groupProductsIntoModels,
} from '../lib/hardwareLineup'
import { ShopifyProduct } from '../types/shopify'
import { formatProductImageUrl } from '../utils/imageUrl'
import {
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Box,
  Truck,
  FileCheck2,
  Award,
  Zap,
  Check,
  Layers,
  Image as ImageIcon,
} from 'lucide-react'

const EMPTY_PRODUCTS: ShopifyProduct[] = []

const HERO_FALLBACK_IMAGES: Record<string, string> = {
  'papa-pen-v3-black-full-set': '/product-images/img_214_img_5795_cutout.webp',
  'papa-pen-v2-1': '/product-images/img_026_black_cutout.webp',
  'papa-pen-jet-black': '/product-images/img_113_papa_pen_jet_black_1__cutout.webp',
  'papa-apollo-rotary-black':
    '/product-images/img_115_apollo-rotary-tattoo-machine-rca-dl-m30-black_cutout.webp',
}

export const HomePage: React.FC = () => {
  const { addToCart, openCart } = useCart()
  const loaderData = useLoaderData({ strict: false }) as
    | { products?: ShopifyProduct[] }
    | undefined
  const loaderProducts = loaderData?.products

  const { data: queryProducts } = useQuery({
    ...catalogQueryOptions,
    ...(loaderProducts && loaderProducts.length > 0
      ? { initialData: loaderProducts }
      : {}),
  })
  const products = queryProducts ?? loaderProducts ?? EMPTY_PRODUCTS

  const machineBenchmarks = useMemo(
    () => buildLiveMachineBenchmarks(products),
    [products]
  )

  // Default to Papa Pen V2 (index 1) or first available benchmark
  const [activeMachineIndex, setActiveMachineIndex] = useState(1)
  const [stageMode, setStageMode] = useState<'photo' | '3d'>('photo')
  const [isBlurTransitioning, setIsBlurTransitioning] = useState(false)
  const [addedHeroCart, setAddedHeroCart] = useState(false)
  const blurTimerRef = useRef<number | null>(null)

  const activeBenchmark =
    machineBenchmarks[activeMachineIndex] || machineBenchmarks[0]
  const activeProduct = activeBenchmark?.product

  const activeVariant = activeProduct?.variants?.edges?.[0]?.node
  const activePrice = activeVariant?.price?.amount
    ? parseFloat(activeVariant.price.amount)
    : activeProduct?.priceRange?.minVariantPrice?.amount
    ? parseFloat(activeProduct.priceRange.minVariantPrice.amount)
    : activeBenchmark?.handle === 'papa-pen-v3-black-full-set'
    ? 799.95
    : activeBenchmark?.handle === 'papa-pen-v2-1'
    ? 469.0
    : activeBenchmark?.handle === 'papa-apollo-rotary-black'
    ? 349.95
    : 395.0

  const activeCurrency =
    activeVariant?.price?.currencyCode ||
    activeProduct?.priceRange?.minVariantPrice?.currencyCode ||
    'USD'

  const rawHeroImage =
    activeProduct?.images?.edges?.[0]?.node?.url ||
    HERO_FALLBACK_IMAGES[activeBenchmark?.handle || 'papa-pen-v2-1'] ||
    '/product-images/img_113_papa_pen_jet_black_1__cutout.webp'
  const heroImageUrl = formatProductImageUrl(rawHeroImage)

  const handleSelectHeroMachine = (idx: number) => {
    if (idx === activeMachineIndex) return
    setIsBlurTransitioning(true)
    setActiveMachineIndex(idx)
    if (!machineBenchmarks[idx]?.supports3D) {
      setStageMode('photo')
    }
    if (blurTimerRef.current) {
      window.clearTimeout(blurTimerRef.current)
    }
    blurTimerRef.current = window.setTimeout(() => {
      setIsBlurTransitioning(false)
    }, 150)
  }

  const handleBuyActiveMachine = () => {
    if (!activeProduct) return
    const variant = activeVariant || {
      id: `${activeProduct.id}-default`,
      title: 'Standard',
      price: {
        amount: activePrice.toFixed(2),
        currencyCode: activeCurrency,
      },
    }
    addToCart(activeProduct, variant, 1)
    setAddedHeroCart(true)
    window.setTimeout(() => setAddedHeroCart(false), 1200)
    openCart()
  }

  // Consolidated model groups for the catalog
  const allModelGroups = useMemo(
    () => groupProductsIntoModels(products),
    [products]
  )

  // Featured consolidated models for the interactive showroom strip
  const featuredModels = useMemo(() => {
    const allGroups = allModelGroups
    const targetIds = [
      'family-papa-pen-v3',
      'family-click-grip-v2',
      'family-papa-apollo-rotary',
    ]
    const picked = targetIds
      .map(id => allGroups.find(g => g.id === id))
      .filter((g): g is NonNullable<typeof g> => Boolean(g))

    const premiumCartridge = allGroups.find(g =>
      g.options.some(o => o.product.handle === 'papa-premium-tattoo-cartridges')
    )
    if (premiumCartridge) {
      picked.splice(1, 0, premiumCartridge)
    }
    if (picked.length < 4) {
      for (const g of allGroups) {
        if (!picked.some(p => p.id === g.id)) {
          picked.push(g)
          if (picked.length >= 4) break
        }
      }
    }
    return picked.slice(0, 4)
  }, [allModelGroups])

  return (
    <div className="w-full bg-transparent text-zinc-900 dark:text-zinc-100 font-sans overflow-x-hidden">
      {/* ============================================================ */}
      {/* ACT 1: SPLIT SPECIMEN STAGE (100% ABOVE-THE-FOLD & LIVE TELEMETRY) */}
      {/* ============================================================ */}
      <section className="relative border-b border-[#e2dfd8] dark:border-white/[0.08] pt-8 pb-12 sm:pt-12 sm:pb-16 lg:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Machine Switcher, Authentic Pricing & Engineering Telemetry */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#0d5d50]/25 dark:border-[#38e8c6]/25 bg-[#0d5d50]/[0.06] dark:bg-[#38e8c6]/[0.08] text-[11px] font-mono font-semibold text-[#0d5d50] dark:text-[#38e8c6] uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0d5d50] dark:bg-[#38e8c6]" />
                <span>Factory-Direct Rotary Engineering</span>
              </div>

              {/* Flagship Machine Selector Tabs */}
              <div
                role="tablist"
                aria-label="Select flagship rotary machine"
                className="flex flex-wrap items-center gap-1.5 pt-1"
              >
                {machineBenchmarks.map((bm, idx) => {
                  const isSelected = idx === activeMachineIndex
                  const shortLabel =
                    bm.handle === 'papa-pen-v3-black-full-set'
                      ? 'Papa Pen V3'
                      : bm.handle === 'papa-pen-v2-1'
                      ? 'Papa Pen V2'
                      : bm.handle === 'papa-apollo-rotary-black'
                      ? 'Apollo Rotary'
                      : 'Papa Pen Classic'
                  return (
                    <button
                      key={bm.handle}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => handleSelectHeroMachine(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-[transform,background-color,color,border-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer ${
                        isSelected
                          ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border border-zinc-950 dark:border-white shadow-xs'
                          : 'bg-white/80 dark:bg-[#262933] text-zinc-600 dark:text-zinc-300 border border-[#e2dfd8] dark:border-white/[0.08] hover:border-zinc-400 dark:hover:border-white/20 hover:text-zinc-950 dark:hover:text-white'
                      }`}
                    >
                      {shortLabel}
                    </button>
                  )
                })}
              </div>

              {/* Active Machine Headline & Summary */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="uppercase tracking-wider font-semibold text-[#0d5d50] dark:text-[#38e8c6]">
                    {activeBenchmark?.roleTag}
                  </span>
                  <span>·</span>
                  <span>{activeBenchmark?.chassisLabel}</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-zinc-950 dark:text-white font-['Montserrat',sans-serif] leading-[0.96]">
                  {activeBenchmark?.handle === 'papa-pen-v3-black-full-set'
                    ? 'PAPA PEN V3'
                    : activeBenchmark?.handle === 'papa-pen-v2-1'
                    ? 'PAPA PEN V2'
                    : activeBenchmark?.handle === 'papa-apollo-rotary-black'
                    ? 'APOLLO ROTARY'
                    : 'PAPA PEN CLASSIC'}
                </h1>

                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-xl">
                  {activeBenchmark?.bestFor}. Engineered with a{' '}
                  <span className="font-medium text-zinc-900 dark:text-white">
                    {activeBenchmark?.motorLabel.toLowerCase()}
                  </span>{' '}
                  for zero-bogging torque across lining, whip shading, and dense color packing.
                </p>
              </div>

              {/* 3-Column Live Engineering Telemetry Strip */}
              <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white/85 dark:bg-[#262933]/90 backdrop-blur-md">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">
                    Stroke Cam
                  </span>
                  <span className="text-xs sm:text-sm font-mono font-bold text-zinc-950 dark:text-white mt-0.5 block">
                    {activeBenchmark?.strokeLabel}
                  </span>
                </div>
                <div className="border-x border-[#eceae4] dark:border-white/[0.08] px-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">
                    Operating Range
                  </span>
                  <span className="text-xs sm:text-sm font-mono font-bold text-zinc-950 dark:text-white mt-0.5 block">
                    {activeBenchmark?.voltageLabel}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">
                    Balance Mass
                  </span>
                  <span className="text-xs sm:text-sm font-mono font-bold text-zinc-950 dark:text-white mt-0.5 block">
                    {activeBenchmark?.weightLabel}
                  </span>
                </div>
              </div>

              {/* Authentic Price & Primary Actions (Always Visible Above the Fold) */}
              <div className="pt-1 flex flex-wrap items-center gap-3 sm:gap-4">
                <div className="pr-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">
                    Factory Direct Price
                  </span>
                  <div className="flex items-baseline gap-1.5 tabular-nums">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-zinc-950 dark:text-white tracking-tight">
                      ${activePrice.toFixed(2)}
                    </span>
                    <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                      {activeCurrency}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleBuyActiveMachine}
                  className={`px-6 py-3.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] shadow-sm cursor-pointer ${
                    addedHeroCart
                      ? 'bg-emerald-600 text-white'
                      : 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200'
                  }`}
                >
                  {addedHeroCart ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <Link
                  to="/products/$handle"
                  params={{
                    handle:
                      activeProduct?.handle ||
                      activeBenchmark?.handle ||
                      'papa-pen-v2-1',
                  }}
                  className="px-5 py-3.5 rounded-xl border border-[#d6d3cb] dark:border-white/15 bg-white/80 dark:bg-[#262933] hover:border-zinc-950 dark:hover:border-white text-xs font-mono font-semibold text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white inline-flex items-center gap-2 transition-[transform,border-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97]"
                >
                  <span>Inspect Specimen</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Column: High-Contrast Specimen Stage with Optional 3D Toggle */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-square w-full rounded-3xl border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#1c1e24] p-6 sm:p-10 flex items-center justify-center overflow-hidden shadow-sm">
                {/* Subtle Radial Instrument Glow */}
                <div
                  aria-hidden="true"
                  className="absolute inset-10 rounded-full bg-[radial-gradient(circle,rgba(56,232,198,0.12)_0%,transparent_70%)] pointer-events-none"
                />

                {/* Top Corner Specimen Markers */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-white/90 dark:bg-[#262933]/90 border border-[#e2dfd8] dark:border-white/10 text-[10px] font-mono font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">
                    REF // {(activeProduct?.handle || activeBenchmark?.handle || 'PAPA-PEN').toUpperCase()}
                  </span>
                </div>

                {/* On-Demand 2D Studio Photo / 3D Interactive Switcher */}
                {activeBenchmark?.supports3D && (
                  <div className="absolute top-4 right-4 z-20 inline-flex items-center p-1 rounded-xl bg-white/90 dark:bg-[#262933]/90 border border-[#e2dfd8] dark:border-white/10 shadow-xs">
                    <button
                      type="button"
                      onClick={() => setStageMode('photo')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer ${
                        stageMode === 'photo'
                          ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                          : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                      }`}
                    >
                      <ImageIcon className="w-3 h-3" />
                      <span>Studio Photo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStageMode('3d')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer ${
                        stageMode === '3d'
                          ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                          : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                      }`}
                    >
                      <Box className="w-3 h-3 text-[#0d5d50] dark:text-[#38e8c6]" />
                      <span>3D View</span>
                    </button>
                  </div>
                )}

                {stageMode === '3d' && activeBenchmark?.supports3D ? (
                  <ModelViewer3D
                    src="/models/papapenv2.glb"
                    poster={heroImageUrl}
                    alt={activeProduct?.title || 'Papa Pen 3D Specimen'}
                    className="w-full h-full"
                    autoRotate={true}
                    cameraOrbit="75deg 78deg 2.2m"
                    fieldOfView="28deg"
                  />
                ) : (
                  <Link
                    to="/products/$handle"
                    params={{
                      handle:
                        activeProduct?.handle ||
                        activeBenchmark?.handle ||
                        'papa-pen-v2-1',
                    }}
                    className="relative z-10 w-full h-full flex items-center justify-center group"
                  >
                    <img
                      src={heroImageUrl}
                      alt={activeProduct?.title || activeBenchmark?.fallbackName}
                      className={`max-h-[84%] max-w-[84%] w-auto h-auto object-contain transition-[transform,opacity,filter] duration-200 ease-[var(--ease-out-strong)] group-hover:scale-[1.03] drop-shadow-[0_16px_28px_rgba(18,18,16,0.14)] dark:drop-shadow-[0_20px_36px_rgba(0,0,0,0.55)] ${
                        isBlurTransitioning
                          ? 'opacity-70 blur-[1.5px] scale-[0.985]'
                          : 'opacity-100 blur-0 scale-100'
                      }`}
                      fetchPriority="high"
                      onError={e => {
                        const img = e.currentTarget
                        if (rawHeroImage && img.src !== rawHeroImage) {
                          img.src = rawHeroImage
                        }
                      }}
                    />
                  </Link>
                )}

                {/* Bottom Specimen Caption Bar */}
                <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-white/85 dark:bg-[#262933]/85 backdrop-blur-md border border-[#e2dfd8] dark:border-white/[0.08] text-[11px] font-mono">
                  <span className="text-zinc-600 dark:text-zinc-300 truncate">
                    {activeBenchmark?.motorLabel}
                  </span>
                  <Link
                    to="/products"
                    className="text-[#0d5d50] dark:text-[#38e8c6] font-semibold hover:underline shrink-0 inline-flex items-center gap-1"
                  >
                    <span>All {allModelGroups.length || 28} Models</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* ACT 2: INTERACTIVE FLAGSHIP SHOWROOM (CONSOLIDATED SWATCH MODELS) */}
      {/* ============================================================ */}
      {featuredModels.length > 0 && (
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1440px] mx-auto border-b border-[#e2dfd8] dark:border-white/[0.08]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold text-[#0d5d50] dark:text-[#38e8c6] uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" />
                <span>Modular Hardware Families · Live Swatch Selection</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-950 dark:text-white font-['Montserrat',sans-serif] mt-1">
                Flagship Studio Systems
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                to="/products"
                className="px-4 py-2 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-mono font-semibold inline-flex items-center gap-1.5 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97]"
              >
                <span>Open Hardware Lineup</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/products"
                search={{ view: 'sheet' }}
                className="px-4 py-2 rounded-xl border border-[#d6d3cb] dark:border-white/15 bg-white dark:bg-[#262933] text-xs font-mono font-semibold text-zinc-700 dark:text-zinc-200 hover:border-zinc-950 dark:hover:border-white transition-colors"
              >
                <span>Quick-Order Spec Sheet ({products.length || 46} SKUs)</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredModels.map(group => (
              <HardwareModelCard key={group.id} group={group} />
            ))}
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* ACT 3: PAPA PREMIUM NEEDLE CARTRIDGES (316L METALLURGY) */}
      {/* ============================================================ */}
      <section
        id="showcase-cartridges"
        className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1440px] mx-auto border-b border-[#e2dfd8] dark:border-white/[0.08]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/25 bg-amber-500/10 text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest">
                <Sparkles className="w-3 h-3" />
                <span>01 // MICRON NEEDLE METALLURGY</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-zinc-950 dark:text-white font-['Montserrat',sans-serif]">
                PAPA CARTRIDGES
              </h2>
              <p className="text-xs font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold">
                JAPANESE 316L SURGICAL STEEL PINS · MEMBRANE SEALED
              </p>
            </div>

            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              Engineered on automated precision fixtures to eliminate needle deflection. Flexible silicone safety membrane eliminates ink backflow into machine motors. 62 configurations across Round Liner, Shader, Magnum, and Curved Magnum.
            </p>

            <div className="grid grid-cols-3 gap-4 py-4 border-y border-[#e2dfd8] dark:border-white/[0.08] text-center font-mono">
              <div className="space-y-0.5">
                <div className="text-base sm:text-lg font-black text-zinc-950 dark:text-white">62 Sizes</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">RL · RS · M1 · M1C</div>
              </div>
              <div className="space-y-0.5 border-x border-[#e2dfd8] dark:border-white/[0.08]">
                <div className="text-base sm:text-lg font-black text-zinc-950 dark:text-white">316L</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">Surgical Steel</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-base sm:text-lg font-black text-zinc-950 dark:text-white">Box of 20</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">Sterile Blister</div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/products/$handle"
                params={{ handle: 'papa-premium-tattoo-cartridges' }}
                className="px-7 py-3.5 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-mono font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-[0.97] transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] shadow-sm"
              >
                <span>Configure 62 Needle Sizes</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400 tabular-nums">
                STANDARD $22.00 · PREMIUM $25.00 USD
              </span>
            </div>
          </div>

          <div className="lg:col-span-6 flex items-center justify-center">
            <ParallaxApparatusStage
              imageSrc="/product-images/papa-premium-tattoo-cartridges-round-cutout.webp"
              alt="Papa Premium Needle Cartridge"
              accentColor="amber"
              baseRotation={-8}
              priorityTag="316L SURGICAL PIN MATRIX"
            />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* ACT 4: PAPA VOLT WIRELESS POWER DOCK */}
      {/* ============================================================ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1440px] mx-auto border-b border-[#e2dfd8] dark:border-white/[0.08]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
          <div className="lg:col-span-6 order-2 lg:order-1 flex items-center justify-center">
            <ParallaxApparatusStage
              imageSrc="/product-images/img_041_papa_volt_large_cutout.webp"
              alt="Papa Volt Wireless Battery Dock"
              accentColor="cyan"
              baseRotation={6}
              priorityTag="CORD-FREE 5-12V CLEAN POWER"
            />
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#0d5d50]/20 dark:border-[#38e8c6]/20 bg-[#38e8c6]/10 text-[10px] font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6] uppercase tracking-widest">
                <Zap className="w-3 h-3" />
                <span>02 // CORD-FREE CONTINUOUS REVOLUTION</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-zinc-950 dark:text-white font-['Montserrat',sans-serif]">
                PAPA VOLT POWER
              </h2>
              <p className="text-xs font-mono uppercase tracking-wider text-[#0d5d50] dark:text-[#38e8c6] font-bold">
                UNINTERRUPTED 5–12V CLEAN CURRENT DRIVE
              </p>
            </div>

            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              Ultra-compact, lightweight lithium battery dock engineered with universal RCA fitment. Delivers up to 8 continuous hours of regulated, low-ripple voltage without tethering cables.
            </p>

            <div className="grid grid-cols-3 gap-4 py-4 border-y border-[#e2dfd8] dark:border-white/[0.08] text-center font-mono">
              <div className="space-y-0.5">
                <div className="text-base sm:text-lg font-black text-zinc-950 dark:text-white">2,000 mAh</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">Lithium Cell</div>
              </div>
              <div className="space-y-0.5 border-x border-[#e2dfd8] dark:border-white/[0.08]">
                <div className="text-base sm:text-lg font-black text-zinc-950 dark:text-white">5V – 12V</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">Regulated Output</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-base sm:text-lg font-black text-zinc-950 dark:text-white">USB-C</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">Fast Charge</div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/products/$handle"
                params={{ handle: 'papa-volt-battery' }}
                className="px-7 py-3.5 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-mono font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-[0.97] transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] shadow-sm"
              >
                <span>Inspect Papa Volt Battery</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/products"
                search={{ category: 'power' }}
                className="text-xs font-mono font-semibold text-[#0d5d50] dark:text-[#38e8c6] hover:underline"
              >
                View All Power &amp; Cords →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* ACT 5: CNC ADJUSTABLE GRIPS */}
      {/* ============================================================ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1440px] mx-auto border-b border-[#e2dfd8] dark:border-white/[0.08]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#e2dfd8] dark:border-white/10 bg-white dark:bg-white/[0.04] text-[10px] font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6] uppercase tracking-widest">
                <Box className="w-3 h-3" />
                <span>03 // CNC 6061 AIRCRAFT INTERFACE</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-zinc-950 dark:text-white font-['Montserrat',sans-serif]">
                ADJUSTABLE GRIPS
              </h2>
              <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-bold">
                MILLIMETER CLICK-STOP PROJECTION LOCKING · 8 ANODIZED FINISHES
              </p>
            </div>

            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              Machined from solid aerospace 6061-T6 aluminum billet and surgical 316L stainless steel with non-slip knurled geometry. Ergonomically shifts machine weight forward to eliminate wrist strain during multi-hour marathon sessions.
            </p>

            <div className="grid grid-cols-3 gap-4 py-4 border-y border-[#e2dfd8] dark:border-white/[0.08] text-center font-mono">
              <div className="space-y-0.5">
                <div className="text-base sm:text-lg font-black text-zinc-950 dark:text-white">6061-T6</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">Anodized Billet</div>
              </div>
              <div className="space-y-0.5 border-x border-[#e2dfd8] dark:border-white/[0.08]">
                <div className="text-base sm:text-lg font-black text-zinc-950 dark:text-white">Click-Stop</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">Needle Dial</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-base sm:text-lg font-black text-zinc-950 dark:text-white">134 °C</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">Autoclavable</div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/products"
                search={{ category: 'grips' }}
                className="px-7 py-3.5 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-mono font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-[0.97] transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] shadow-sm"
              >
                <span>Explore 8 Grip Models</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400 tabular-nums">
                FROM $79.95 USD
              </span>
            </div>
          </div>

          <div className="lg:col-span-6 flex items-center justify-center">
            <ParallaxApparatusStage
              imageSrc="/product-images/img_111_papa_adjustment_grips_1__cutout.webp"
              alt="Papa CNC Adjustable Grip"
              accentColor="emerald"
              baseRotation={-6}
              priorityTag="6061-T6 AIRCRAFT ALLOY"
            />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* ACT 6: GLOBAL STUDIO STANDARDS & PRO TEAM ROSTER */}
      {/* ============================================================ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1440px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="text-[10px] font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6] uppercase tracking-widest">
            + GLOBAL DISPATCH &amp; QUALITY ASSURANCE
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-zinc-950 dark:text-white font-['Montserrat',sans-serif]">
            STUDIO &amp; WHOLESALE NETWORK
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
            Direct central manufacturing distribution to verified tattoo studios, resident artists, and supply retailers worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#262933] p-7 space-y-3.5">
            <Truck className="w-6 h-6 text-[#0d5d50] dark:text-[#38e8c6]" />
            <h3 className="text-base font-bold uppercase text-zinc-950 dark:text-white font-sans">
              40+ COUNTRIES DISPATCH
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              Express international air logistics with dedicated customs clearance for tattoo studios across the US, EU, UK, Canada, and Australia.
            </p>
            <div className="pt-1">
              <Link
                to="/distributors"
                className="text-xs font-mono font-bold uppercase text-[#0d5d50] dark:text-[#38e8c6] hover:underline inline-flex items-center gap-1"
              >
                <span>Authorized Distributors</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#262933] p-7 space-y-3.5">
            <FileCheck2 className="w-6 h-6 text-amber-500" />
            <h3 className="text-base font-bold uppercase text-zinc-950 dark:text-white font-sans">
              STERILE BATCH AUDIT
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              Manufactured in Class 100,000 cleanrooms. 100% individual EO Gas blister packed with verifiable batch indicators.
            </p>
            <div className="pt-1">
              <Link
                to="/about"
                className="text-xs font-mono font-bold uppercase text-[#0d5d50] dark:text-[#38e8c6] hover:underline inline-flex items-center gap-1"
              >
                <span>Engineering Standards</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#262933] p-7 space-y-3.5">
            <Award className="w-6 h-6 text-[#0d5d50] dark:text-[#38e8c6]" />
            <h3 className="text-base font-bold uppercase text-zinc-950 dark:text-white font-sans">
              PRO TEAM ROSTER
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              Sponsored international resident artists creating world-class black &amp; grey, realism, and traditional work on Papa apparatus.
            </p>
            <div className="pt-1">
              <Link
                to="/sponsorship-artists"
                className="text-xs font-mono font-bold uppercase text-[#0d5d50] dark:text-[#38e8c6] hover:underline inline-flex items-center gap-1"
              >
                <span>Meet 40 Sponsored Artists</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
