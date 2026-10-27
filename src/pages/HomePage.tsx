import React, { useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useLoaderData } from '@tanstack/react-router'
import { ModelViewer3D } from '../components/common/ModelViewer3D'
import { ParallaxApparatusStage } from '../components/common/ParallaxApparatusStage'
import { HomeSlider } from '../components/home/HomeSlider'
import { HardwareModelCard } from '../components/product/HardwareLineupModules'
import { useCart } from '../context/CartContext'
import { catalogQueryOptions } from '../lib/catalog.queries'
import {
  buildLiveMachineBenchmarks,
  groupProductsIntoModels,
} from '../lib/hardwareLineup'
import { ShopifyProduct } from '../types/shopify'
import { formatProductImageUrl } from '../utils/imageUrl'
import PAPA_ARTISTS from '../data/papaArtists.json'
import {
  ShoppingBag,
  ArrowRight,
  ArrowUpRight,
  Box,
  Truck,
  FileCheck2,
  Award,
  Check,
  Image as ImageIcon,
  ShieldCheck,
} from 'lucide-react'

const EMPTY_PRODUCTS: ShopifyProduct[] = []

const HERO_FALLBACK_IMAGES: Record<string, string> = {
  'papa-pen-v3-black-full-set': '/product-images/img_214_img_5795_cutout.webp',
  'papa-pen-v2-1': '/product-images/img_026_black_cutout.webp',
  'papa-pen-jet-black': '/product-images/img_113_papa_pen_jet_black_1__cutout.webp',
  'papa-apollo-rotary-black':
    '/product-images/img_115_apollo-rotary-tattoo-machine-rca-dl-m30-black_cutout.webp',
}

const NEEDLE_CONFIG_FAMILIES = [
  {
    code: 'RL',
    name: 'Round Liner',
    spec: 'Tight grouping for crisp single-pass outlines',
  },
  {
    code: 'RS',
    name: 'Round Shader',
    spec: 'Open cylindrical matrix for soft transitions',
  },
  {
    code: 'M1',
    name: 'Weaved Magnum',
    spec: 'Dual-row flat array for high-density color packing',
  },
  {
    code: 'M1C',
    name: 'Curved Magnum',
    spec: 'Arched tip profile for seamless whip shading',
  },
] as const

const FEATURED_ARTISTS = PAPA_ARTISTS.slice(0, 8)

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
    }, 160)
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

  const cleanStrokeLabel = (activeBenchmark?.strokeLabel || '3.5 mm')
    .replace(/[–—]/g, '-')
    .replace(/\s*Precision/i, '')
  const cleanVoltageLabel = (activeBenchmark?.voltageLabel || '5V - 12V')
    .replace(/[–—]/g, '-')
    .replace(/\s*DC/i, '')
  const cleanWeightLabel = (activeBenchmark?.weightLabel || '134 g')
    .replace(/[–—]/g, '-')
    .replace(/\s*\(?forward-biased\)?/i, '')
    .replace(/\s*\(machine\)/i, '')

  return (
    <div className="w-full bg-transparent text-zinc-900 dark:text-zinc-100 font-sans overflow-x-hidden">
      {/* ============================================================ */}
      {/* ACT 1: FLAGSHIP SPECIMEN STAGE (PRIMARY ABOVE-THE-FOLD HERO) */}
      {/* ============================================================ */}
      <section className="relative pt-6 pb-10 sm:pt-10 sm:pb-14 lg:py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Machine Switcher, Headline, Telemetry & Direct Action */}
            <div className="lg:col-span-6 space-y-5">
              {/* Flagship Machine Selector Tabs */}
              <div
                role="tablist"
                aria-label="Select flagship rotary machine"
                className="inline-flex flex-wrap lg:flex-nowrap items-center gap-1 p-1 rounded-xl bg-[#eceae4]/90 dark:bg-[#181b22] border border-[#e2dfd8] dark:border-white/[0.07]"
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
                      className={`px-2.5 xl:px-3.5 py-1.5 rounded-lg text-[11px] xl:text-xs font-mono font-semibold whitespace-nowrap transition-[transform,background-color,color,box-shadow] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer ${
                        isSelected
                          ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                      }`}
                    >
                      {shortLabel}
                    </button>
                  )
                })}
              </div>

              {/* Active Machine Headline & Summary */}
              <div className="space-y-2.5">
                <div className="text-xs font-mono text-[#0d5d50] dark:text-[#38e8c6] font-semibold">
                  {activeBenchmark?.roleTag} · {activeBenchmark?.chassisLabel}
                </div>

                <h1 className="text-4xl sm:text-5xl xl:text-[60px] font-black tracking-tighter text-zinc-950 dark:text-white font-['Montserrat',sans-serif] leading-[0.95]">
                  {activeBenchmark?.handle === 'papa-pen-v3-black-full-set'
                    ? 'PAPA PEN V3'
                    : activeBenchmark?.handle === 'papa-pen-v2-1'
                    ? 'PAPA PEN V2'
                    : activeBenchmark?.handle === 'papa-apollo-rotary-black'
                    ? 'APOLLO ROTARY'
                    : 'PAPA PEN CLASSIC'}
                </h1>

                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-lg">
                  {activeBenchmark?.bestFor}. Driven by a{' '}
                  <span className="font-semibold text-zinc-950 dark:text-white">
                    {activeBenchmark?.motorLabel.toLowerCase()}
                  </span>{' '}
                  for zero-bogging torque across lining and dense color packing.
                </p>
              </div>

              {/* 3-Column Live Engineering Telemetry Strip */}
              <div className="grid grid-cols-3 gap-2.5 p-3.5 rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white/85 dark:bg-[#1a1d24]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md">
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 block">
                    Stroke Cam
                  </span>
                  <span className="text-xs sm:text-sm font-mono font-bold text-zinc-950 dark:text-white mt-0.5 block tabular-nums truncate">
                    {cleanStrokeLabel}
                  </span>
                </div>
                <div className="border-x border-[#eceae4] dark:border-white/[0.08] px-3">
                  <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 block">
                    Operating Range
                  </span>
                  <span className="text-xs sm:text-sm font-mono font-bold text-zinc-950 dark:text-white mt-0.5 block tabular-nums truncate">
                    {cleanVoltageLabel}
                  </span>
                </div>
                <div className="pl-1">
                  <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 block">
                    Balance Mass
                  </span>
                  <span className="text-xs sm:text-sm font-mono font-bold text-zinc-950 dark:text-white mt-0.5 block tabular-nums truncate">
                    {cleanWeightLabel}
                  </span>
                </div>
              </div>

              {/* Authentic Price & Primary Actions */}
              <div className="pt-1 flex flex-wrap sm:flex-nowrap items-center gap-2.5 xl:gap-3.5">
                <div className="pr-1.5 xl:pr-2.5 shrink-0">
                  <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 block">
                    Factory Direct
                  </span>
                  <div className="flex items-baseline gap-1 tabular-nums">
                    <span className="text-2xl xl:text-3xl font-black font-mono text-zinc-950 dark:text-white tracking-tight">
                      ${activePrice.toFixed(2)}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                      {activeCurrency}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleBuyActiveMachine}
                  className={`px-4 xl:px-6 py-3 rounded-xl font-mono font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 whitespace-nowrap shrink-0 transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] shadow-sm cursor-pointer ${
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
                  className="px-3.5 xl:px-5 py-3 rounded-xl border border-[#d6d3cb] dark:border-white/15 bg-white/80 dark:bg-[#22252f] hover:border-zinc-950 dark:hover:border-white text-xs font-mono font-semibold text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-[transform,border-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97]"
                >
                  <span>View Specs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Column: High-Contrast Specimen Stage with Optional 3D Toggle */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-square w-full rounded-3xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white/85 dark:bg-[#181b22] p-6 sm:p-10 flex items-center justify-center overflow-hidden shadow-[0_24px_60px_-20px_rgba(18,18,16,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] dark:shadow-[0_28px_70px_-20px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.07)]">
                {/* Subtle Radial Instrument Glow */}
                <div
                  aria-hidden="true"
                  className="absolute inset-8 rounded-full bg-[radial-gradient(circle,rgba(56,232,198,0.14)_0%,transparent_68%)] pointer-events-none"
                />

                {/* On-Demand 2D Studio Photo / 3D Interactive Switcher */}
                {activeBenchmark?.supports3D && (
                  <div className="absolute top-5 right-5 z-20 inline-flex items-center p-1 rounded-xl bg-[#f5f4f0]/90 dark:bg-[#22252f]/90 border border-[#e2dfd8] dark:border-white/10 backdrop-blur-md">
                    <button
                      type="button"
                      onClick={() => setStageMode('photo')}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-semibold inline-flex items-center gap-1.5 transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer ${
                        stageMode === 'photo'
                          ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                          : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Photo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStageMode('3d')}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-semibold inline-flex items-center gap-1.5 transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer ${
                        stageMode === '3d'
                          ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                          : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                      }`}
                    >
                      <Box className="w-3.5 h-3.5 text-[#0d5d50] dark:text-[#38e8c6]" />
                      <span>3D Model</span>
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
                      className={`max-h-[82%] max-w-[82%] w-auto h-auto object-contain transition-[transform,opacity,filter] duration-200 ease-[var(--ease-out-strong)] group-hover:scale-[1.035] drop-shadow-[0_20px_34px_rgba(18,18,16,0.16)] dark:drop-shadow-[0_24px_44px_rgba(0,0,0,0.65)] ${
                        isBlurTransitioning
                          ? 'opacity-65 blur-[2px] scale-[0.97]'
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

                {/* Bottom Specimen Bar */}
                <div className="absolute bottom-5 inset-x-5 z-20 flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-[#f5f4f0]/90 dark:bg-[#22252f]/90 backdrop-blur-md border border-[#e2dfd8] dark:border-white/[0.08] text-xs font-mono">
                  <span className="text-zinc-600 dark:text-zinc-300 truncate">
                    {activeBenchmark?.motorLabel}
                  </span>
                  <Link
                    to="/products"
                    className="text-[#0d5d50] dark:text-[#38e8c6] font-semibold hover:underline shrink-0 inline-flex items-center gap-1"
                  >
                    <span>Compare {allModelGroups.length || 28} Models</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* ACT 2: WIDESCREEN EXHIBITION RELEASES (7 STUDIO BANNERS)     */}
      {/* ============================================================ */}
      <HomeSlider />

      {/* ============================================================ */}
      {/* ACT 3: INTERACTIVE FLAGSHIP SHOWROOM (SWATCH FAMILIES)       */}
      {/* ============================================================ */}
      {featuredModels.length > 0 && (
        <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1440px] mx-auto border-b border-[#e2dfd8] dark:border-white/[0.08]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="space-y-2 max-w-xl">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-white font-['Montserrat',sans-serif]">
                FLAGSHIP STUDIO SYSTEMS
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
                Select anodized finishes and cartridge series directly inside each hardware family.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Link
                to="/products"
                className="px-4 py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-mono font-semibold inline-flex items-center gap-1.5 whitespace-nowrap hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97]"
              >
                <span>Open Hardware Lineup</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/products"
                search={{ view: 'sheet' }}
                className="px-4 py-2.5 rounded-xl border border-[#d6d3cb] dark:border-white/15 bg-white dark:bg-[#22252f] text-xs font-mono font-semibold text-zinc-700 dark:text-zinc-200 whitespace-nowrap hover:border-zinc-950 dark:hover:border-white transition-[transform,border-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97]"
              >
                <span>Quick-Order Sheet ({products.length || 46} SKUs)</span>
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
      {/* ACT 4: 316L NEEDLE ARCHITECTURE (ASYMMETRIC BENTO GRID)      */}
      {/* ============================================================ */}
      <section
        id="showcase-cartridges"
        className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1440px] mx-auto border-b border-[#e2dfd8] dark:border-white/[0.08]"
      >
        <div className="max-w-2xl mb-10 space-y-2.5">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            Japanese 316L Surgical Metallurgy
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-950 dark:text-white font-['Montserrat',sans-serif]">
            PAPA NEEDLE CARTRIDGES
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Automated micro-fixture soldering eliminates needle deflection. Internal silicone membrane prevents pigment backflow into rotary motors.
          </p>
        </div>

        {/* 3-Cell Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Cell 1 (7 Cols): Tinted Architectural Specimen Showcase */}
          <div className="lg:col-span-7 relative rounded-3xl bg-[#efeae0]/85 dark:bg-[#14161d] text-zinc-950 dark:text-white border border-amber-500/25 dark:border-white/[0.08] p-7 sm:p-10 flex flex-col justify-between overflow-hidden shadow-[0_20px_50px_-20px_rgba(18,18,16,0.08),inset_0_1px_0_rgba(255,255,255,0.7)] dark:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-16 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(230,179,102,0.22)_0%,transparent_70%)] pointer-events-none"
            />

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-mono text-amber-700 dark:text-amber-400 font-semibold">
                  62 Configurations · Sterile Blister Box of 20
                </span>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight font-['Montserrat',sans-serif]">
                  MEMBRANE SEALED PRECISION
                </h3>
              </div>

              <div className="text-right font-mono">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">Box of 20</span>
                <span className="text-xl sm:text-2xl font-black text-amber-700 dark:text-amber-400 tabular-nums">
                  $22.00 - $25.00
                </span>
              </div>
            </div>

            <div className="relative z-10 my-6 flex items-center justify-center min-h-[240px] sm:min-h-[280px]">
              <img
                src="/product-images/papa-premium-tattoo-cartridges-round-cutout.webp"
                alt="Papa Premium 316L Needle Cartridges"
                loading="lazy"
                className="max-h-[250px] sm:max-h-[290px] w-auto object-contain drop-shadow-[0_20px_36px_rgba(18,18,16,0.18)] dark:drop-shadow-[0_28px_50px_rgba(0,0,0,0.75)] transition-transform duration-300 ease-[var(--ease-out-strong)] hover:scale-[1.03]"
              />
            </div>

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-amber-900/10 dark:border-white/[0.08]">
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-600 dark:text-zinc-300">
                <span>100% EO Gas Sterilized</span>
                <span className="text-zinc-400 dark:text-white/25">|</span>
                <span>Medical Polycarbonate Housing</span>
              </div>

              <Link
                to="/products/$handle"
                params={{ handle: 'papa-premium-tattoo-cartridges' }}
                className="px-6 py-3 rounded-xl bg-zinc-950 text-white dark:bg-amber-400 dark:text-zinc-950 font-mono font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 hover:bg-zinc-800 dark:hover:bg-amber-300 transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97]"
              >
                <span>Configure 62 Sizes</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column (5 Cols): 2 Stacked Engineering Bento Cells */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Cell 2: 4 Needle Taper Configurations */}
            <div className="flex-1 rounded-3xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#1a1d24] p-6 sm:p-7 flex flex-col justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <div className="flex items-center justify-between gap-2 mb-4">
                <h3 className="text-base font-bold text-zinc-950 dark:text-white tracking-tight">
                  Four Needle Geometries
                </h3>
                <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  0.25 mm - 0.35 mm Gauges
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {NEEDLE_CONFIG_FAMILIES.map(item => (
                  <Link
                    key={item.code}
                    to="/products/$handle"
                    params={{ handle: 'papa-premium-tattoo-cartridges' }}
                    className="group p-3.5 rounded-2xl border border-[#eceae4] dark:border-white/[0.06] bg-[#f8f7f4] dark:bg-[#22252f]/70 hover:border-amber-500/50 transition-[transform,border-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.98]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono font-black text-amber-700 dark:text-amber-400">
                        {item.code}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors" />
                    </div>
                    <div className="text-xs font-bold text-zinc-950 dark:text-white mt-1">
                      {item.name}
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
                      {item.spec}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Cell 3: Standard vs Premium Comparison Tile */}
            <div className="rounded-3xl border border-[#e2dfd8] dark:border-white/[0.08] bg-[#eceae4]/75 dark:bg-[#1e212a] p-6 sm:p-7 flex items-center justify-between gap-5">
              <div className="space-y-2">
                <span className="text-xs font-mono font-semibold text-[#0d5d50] dark:text-[#38e8c6]">
                  High-Volume Studio Pack
                </span>
                <h3 className="text-lg font-black text-zinc-950 dark:text-white font-['Montserrat',sans-serif]">
                  STANDARD SERIES CARTRIDGES
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-xs">
                  Universal twist-fit housing for daily workhorse lining and shading at $22.00 per box.
                </p>
                <div className="pt-1">
                  <Link
                    to="/products/$handle"
                    params={{ handle: 'papa-standard-tattoo-cartridges' }}
                    className="text-xs font-mono font-bold text-zinc-950 dark:text-white hover:text-[#0d5d50] dark:hover:text-[#38e8c6] inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>Shop Standard Series</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <img
                src="/product-images/img_001_papa-cartridges-needles-magnum_cutout.webp"
                alt="Papa Standard Needle Cartridge"
                loading="lazy"
                className="w-24 sm:w-28 h-24 sm:h-28 object-contain shrink-0 drop-shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* ACT 5: CORDLESS POWER & CNC GRIPS (DUAL MONOLITH SHOWCASE)   */}
      {/* ============================================================ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1440px] mx-auto border-b border-[#e2dfd8] dark:border-white/[0.08]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* Monolith 1: Papa Volt Wireless Power */}
          <div className="rounded-3xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white/80 dark:bg-[#181b22] p-7 sm:p-10 flex flex-col justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <div className="space-y-3">
              <div className="text-xs font-mono font-semibold text-[#0d5d50] dark:text-[#38e8c6]">
                5V - 12V Regulated Output · Universal RCA Fitment
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-white font-['Montserrat',sans-serif]">
                PAPA VOLT WIRELESS POWER
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Ultra-compact 2,000 mAh lithium dock delivering up to 8 hours of low-ripple voltage without tethering cords.
              </p>
            </div>

            <div className="my-4 flex items-center justify-center">
              <ParallaxApparatusStage
                imageSrc="/product-images/img_041_papa_volt_large_cutout.webp"
                alt="Papa Volt Wireless Battery Dock"
                accentColor="cyan"
                baseRotation={5}
                className="max-w-[360px] sm:max-w-[400px]"
              />
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[#f5f4f0] dark:bg-[#22252f] text-center font-mono">
                <div>
                  <span className="text-sm font-black text-zinc-950 dark:text-white block">
                    2,000 mAh
                  </span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                    Lithium Cell
                  </span>
                </div>
                <div className="border-x border-[#e2dfd8] dark:border-white/[0.08]">
                  <span className="text-sm font-black text-zinc-950 dark:text-white block">
                    5V - 12V
                  </span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                    Clean Drive
                  </span>
                </div>
                <div>
                  <span className="text-sm font-black text-zinc-950 dark:text-white block">
                    USB-C
                  </span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                    Fast Charge
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <Link
                  to="/products/$handle"
                  params={{ handle: 'papa-volt-battery' }}
                  className="px-6 py-3 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-mono font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97]"
                >
                  <span>Explore Papa Volt</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/products"
                  search={{ category: 'power' }}
                  className="text-xs font-mono font-semibold text-[#0d5d50] dark:text-[#38e8c6] hover:underline"
                >
                  All Power Units →
                </Link>
              </div>
            </div>
          </div>

          {/* Monolith 2: CNC Adjustable Click Grips */}
          <div className="rounded-3xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white/80 dark:bg-[#181b22] p-7 sm:p-10 flex flex-col justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <div className="space-y-3">
              <div className="text-xs font-mono font-semibold text-[#0d5d50] dark:text-[#38e8c6]">
                Aerospace 6061-T6 Billet · 316L Stainless Backstem
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-white font-['Montserrat',sans-serif]">
                CNC CLICK GRIPS
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Ratcheted millimeter click-stop needle depth locking shifts balance forward to reduce wrist fatigue.
              </p>
            </div>

            <div className="my-4 flex items-center justify-center">
              <ParallaxApparatusStage
                imageSrc="/product-images/img_111_papa_adjustment_grips_1__cutout.webp"
                alt="Papa CNC Adjustable Click Grip"
                accentColor="emerald"
                baseRotation={-5}
                className="max-w-[360px] sm:max-w-[400px]"
              />
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[#f5f4f0] dark:bg-[#22252f] text-center font-mono">
                <div>
                  <span className="text-sm font-black text-zinc-950 dark:text-white block">
                    6061-T6
                  </span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                    Anodized Alloy
                  </span>
                </div>
                <div className="border-x border-[#e2dfd8] dark:border-white/[0.08]">
                  <span className="text-sm font-black text-zinc-950 dark:text-white block">
                    Click-Stop
                  </span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                    Depth Lock
                  </span>
                </div>
                <div>
                  <span className="text-sm font-black text-zinc-950 dark:text-white block">
                    134 °C
                  </span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                    Autoclavable
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <Link
                  to="/products"
                  search={{ category: 'grips' }}
                  className="px-6 py-3 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-mono font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97]"
                >
                  <span>Explore 8 Grip Models</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400 tabular-nums">
                  From $79.95 USD
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* ACT 6: SPONSORED PRO TEAM & GLOBAL STUDIO LEDGER (7:5 SPLIT) */}
      {/* ============================================================ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left 7 Columns: Authentic Pro Team Artist Portrait Wall */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1.5">
                <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#0d5d50] dark:text-[#38e8c6]">
                  Official Pro Team Roster
                </div>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-white font-['Montserrat',sans-serif]">
                  TRUSTED BY 40+ RESIDENT ARTISTS
                </h2>
              </div>

              <Link
                to="/sponsorship-artists"
                className="text-xs font-mono font-bold text-zinc-950 dark:text-white hover:text-[#0d5d50] dark:hover:text-[#38e8c6] inline-flex items-center gap-1.5 shrink-0 transition-colors"
              >
                <span>Full Artist Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {FEATURED_ARTISTS.map(artist => (
                <Link
                  key={artist.id}
                  to="/sponsorship-artists"
                  className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-[#e2dfd8] dark:border-white/[0.08] bg-zinc-900"
                >
                  <img
                    src={artist.image}
                    alt={artist.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-center transition-transform duration-300 ease-[var(--ease-out-strong)] group-hover:scale-[1.05]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"
                  />
                  <div className="absolute bottom-3 inset-x-3 text-left">
                    <div className="text-xs font-bold text-white truncate">
                      {artist.name}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-300 truncate">
                      {artist.handle}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right 5 Columns: Architectural Studio & Wholesale Ledger */}
          <div className="lg:col-span-5 rounded-3xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#181b22] p-7 sm:p-9 divide-y divide-[#eceae4] dark:divide-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <div className="pb-6 space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-zinc-950 dark:text-white tracking-tight">
                  40+ Countries Express Dispatch
                </h3>
                <Truck className="w-5 h-5 text-[#0d5d50] dark:text-[#38e8c6] shrink-0" />
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Priority air logistics and verified regional distributors serving tattoo studios across North America, Europe, UK, and Australia.
              </p>
              <div className="pt-1">
                <Link
                  to="/distributors"
                  className="text-xs font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6] hover:underline inline-flex items-center gap-1"
                >
                  <span>Authorized Distributors</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="py-6 space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-zinc-950 dark:text-white tracking-tight">
                  Class 100,000 Cleanroom Sterility
                </h3>
                <FileCheck2 className="w-5 h-5 text-amber-500 shrink-0" />
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Every cartridge needle and disposable grip is individually blister-sealed and certified with EO Gas batch indicators.
              </p>
              <div className="pt-1">
                <Link
                  to="/about"
                  className="text-xs font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6] hover:underline inline-flex items-center gap-1"
                >
                  <span>Engineering Standards</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="pt-6 space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-zinc-950 dark:text-white tracking-tight">
                  Direct Factory Warranty &amp; Wholesale
                </h3>
                <ShieldCheck className="w-5 h-5 text-[#0d5d50] dark:text-[#38e8c6] shrink-0" />
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Dedicated studio volume pricing, custom anodized batch runs, and in-house rotary motor servicing.
              </p>
              <div className="pt-1 flex flex-wrap items-center gap-4">
                <Link
                  to="/contact"
                  className="text-xs font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6] hover:underline inline-flex items-center gap-1"
                >
                  <span>Direct Factory Inquiry</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/sponsorship-artists"
                  className="text-xs font-mono font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white inline-flex items-center gap-1 transition-colors"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Apply for Sponsorship</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
