import React, { useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useLoaderData } from '@tanstack/react-router'
import { ModelViewer3D } from '../components/common/ModelViewer3D'
import { ParallaxApparatusStage } from '../components/common/ParallaxApparatusStage'
import { HardwareArchitectureStory } from '../components/home/HardwareArchitectureStory'
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
    image: '/product-images/papa-premium-tattoo-cartridges-round-cutout.webp',
  },
  {
    code: 'RS',
    name: 'Round Shader',
    spec: 'Open cylindrical matrix for soft transitions',
    image: '/product-images/img_002_papa-cartridges-needles-round_cutout.webp',
  },
  {
    code: 'M1',
    name: 'Weaved Magnum',
    spec: 'Dual-row flat array for high-density color packing',
    image: '/product-images/img_001_papa-cartridges-needles-magnum_cutout.webp',
  },
  {
    code: 'M1C',
    name: 'Curved Magnum',
    spec: 'Arched tip profile for seamless whip shading',
    image: '/product-images/img_005_papa_cartridges2_cutout.webp',
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
  const [activeNeedleIndex, setActiveNeedleIndex] = useState(0)
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
    <div className="w-full bg-transparent text-[#1d1d1f] dark:text-[#f5f5f7] font-sans overflow-x-hidden">
      {/* ============================================================ */}
      {/* ACT 1: FLAGSHIP CENTER STAGE SPECIMEN THEATER (HERO)        */}
      {/* ============================================================ */}
      <section className="relative pt-6 pb-12 sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto relative z-10 flex flex-col items-center text-center">
          {/* Flagship Machine Selector Tabs (Apple Segmented Pill Control) */}
          <div
            role="tablist"
            aria-label="Select flagship rotary machine"
            className="inline-flex max-w-full overflow-x-auto no-scrollbar items-center gap-1 p-1 rounded-full bg-black/[0.05] dark:bg-white/[0.08] mb-6 sm:mb-8"
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
                  className={`px-4 sm:px-5 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-[transform,background-color,color,box-shadow] duration-200 ease-[var(--ease-spring)] active:scale-[0.97] cursor-pointer ${
                    isSelected
                      ? 'bg-white text-[#1d1d1f] dark:bg-[#2c2c2e] dark:text-white shadow-[0_2px_10px_rgba(0,0,0,0.08)]'
                      : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                  }`}
                >
                  {shortLabel}
                </button>
              )
            })}
          </div>

          {/* Active Machine Title & Value Prop */}
          <div className="space-y-3 max-w-3xl mx-auto mb-8 sm:mb-10">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-[80px] font-semibold tracking-[-0.038em] text-[#1d1d1f] dark:text-[#f5f5f7] leading-[1.02]">
              {activeBenchmark?.handle === 'papa-pen-v3-black-full-set'
                ? 'Papa Pen V3'
                : activeBenchmark?.handle === 'papa-pen-v2-1'
                ? 'Papa Pen V2'
                : activeBenchmark?.handle === 'papa-apollo-rotary-black'
                ? 'Apollo Rotary'
                : 'Papa Pen Classic'}
            </h1>

            <p className="text-base sm:text-lg text-[#86868b] leading-relaxed max-w-xl mx-auto font-normal">
              {activeBenchmark?.bestFor}. German coreless power with forward-balanced mass.
            </p>
          </div>

          {/* Central Specimen Stage (Architectural Theater with 2D / 3D Switcher) */}
          <div className="relative w-full max-w-5xl aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/10] rounded-[32px] bg-white dark:bg-[#121214] p-6 sm:p-10 flex items-center justify-center overflow-hidden shadow-[0_24px_60px_-24px_rgba(0,0,0,0.06)] dark:shadow-[0_28px_70px_-24px_rgba(0,0,0,0.7)] mb-8 sm:mb-10">
            {/* Ambient Backlight Halo */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-radial from-black/[0.03] dark:from-white/[0.03] to-transparent pointer-events-none"
            />

            {/* On-Demand 2D Studio Photo / 3D Interactive Switcher */}
            {activeBenchmark?.supports3D && (
              <div className="absolute top-5 right-5 z-20 inline-flex items-center p-1 rounded-full bg-[#f5f5f7]/90 dark:bg-[#1c1c1e]/90 backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => setStageMode('photo')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5 transition-[transform,background-color,color,box-shadow] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer ${
                    stageMode === 'photo'
                      ? 'bg-white text-[#1d1d1f] dark:bg-[#2c2c2e] dark:text-white shadow-2xs'
                      : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStageMode('3d')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1.5 transition-[transform,background-color,color,box-shadow] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer ${
                    stageMode === '3d'
                      ? 'bg-white text-[#1d1d1f] dark:bg-[#2c2c2e] dark:text-white shadow-2xs'
                      : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                  }`}
                >
                  <Box className="w-3.5 h-3.5" />
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
                  className={`max-h-[86%] max-w-[86%] w-auto h-auto object-contain transition-[transform,opacity,filter] duration-300 ease-[var(--ease-spring)] group-hover:scale-[1.03] drop-shadow-[0_20px_40px_rgba(0,0,0,0.14)] dark:drop-shadow-[0_24px_50px_rgba(0,0,0,0.75)] ${
                    isBlurTransitioning
                      ? 'opacity-60 blur-[3px] scale-[0.975]'
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

            {/* Subtle Top-Left Chassis Spec */}
            <div className="absolute top-5 left-6 z-20 text-xs text-[#86868b] hidden sm:block">
              {activeBenchmark?.roleTag} · {activeBenchmark?.chassisLabel}
            </div>

            {/* Minimal Bottom Caption */}
            <div className="absolute bottom-5 inset-x-6 z-20 flex items-center justify-between gap-3 text-xs text-[#86868b]">
              <span className="truncate">
                {activeBenchmark?.motorLabel}
              </span>
              <Link
                to="/products"
                className="text-[#1d1d1f] dark:text-[#f5f5f7] font-medium hover:opacity-70 shrink-0 inline-flex items-center gap-1 transition-opacity"
              >
                <span>Compare all {allModelGroups.length || 28} models</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Telemetry & Direct Action Command Bar (Apple-Style Floating Dock) */}
          <div className="w-full max-w-5xl rounded-2xl bg-white/80 dark:bg-[#161618]/80 backdrop-blur-md border border-black/[0.06] dark:border-white/[0.08] p-4 sm:p-6 shadow-[0_12px_36px_-12px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* 3 Telemetry Metrics */}
              <div className="grid grid-cols-3 gap-6 sm:gap-10 text-left w-full md:w-auto">
                <div>
                  <span className="text-lg sm:text-2xl font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-[#f5f5f7] block tabular-nums">
                    {cleanStrokeLabel}
                  </span>
                  <span className="text-[11px] sm:text-xs text-[#86868b] mt-0.5 block">
                    Stroke Cam
                  </span>
                </div>
                <div>
                  <span className="text-lg sm:text-2xl font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-[#f5f5f7] block tabular-nums">
                    {cleanVoltageLabel}
                  </span>
                  <span className="text-[11px] sm:text-xs text-[#86868b] mt-0.5 block">
                    Operating Range
                  </span>
                </div>
                <div>
                  <span className="text-lg sm:text-2xl font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-[#f5f5f7] block tabular-nums">
                    {cleanWeightLabel}
                  </span>
                  <span className="text-[11px] sm:text-xs text-[#86868b] mt-0.5 block">
                    Balance Mass
                  </span>
                </div>
              </div>

              {/* Pricing & Actions */}
              <div className="flex items-center gap-3 sm:gap-4 shrink-0 w-full md:w-auto justify-end">
                <div className="text-right pr-2">
                  <span className="text-[10px] text-[#86868b] block">From</span>
                  <div className="flex items-baseline gap-1 tabular-nums">
                    <span className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-[-0.025em]">
                      ${activePrice.toFixed(2)}
                    </span>
                    <span className="text-xs text-[#86868b]">
                      {activeCurrency}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleBuyActiveMachine}
                  className={`px-6 py-3 rounded-full font-sans font-medium text-xs sm:text-sm inline-flex items-center gap-2 whitespace-nowrap shrink-0 transition-[transform,background-color,opacity] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer ${
                    addedHeroCart
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] hover:opacity-88'
                  }`}
                >
                  {addedHeroCart ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
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
                  className="px-5 py-3 rounded-full bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/[0.09] dark:hover:bg-white/[0.14] text-xs sm:text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97]"
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* ACT 2: ARCHITECTURE & PRECISION ENGINEERING STORY            */}
      {/* ============================================================ */}
      <HardwareArchitectureStory />

      {/* ============================================================ */}
      {/* ACT 3: INTERACTIVE FLAGSHIP SHOWROOM (SWATCH FAMILIES)       */}
      {/* ============================================================ */}
      {featuredModels.length > 0 && (
        <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-2.5 max-w-xl">
              <p className="text-xs font-medium text-[#86868b]">
                Precision Hardware
              </p>
              <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] text-[#1d1d1f] dark:text-[#f5f5f7]">
                Flagship Studio Systems.
              </h2>
              <p className="text-base text-[#86868b]">
                Explore anodized finishes and sterile configurations across each hardware family.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Link
                to="/products"
                className="px-5 py-2.5 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-xs font-medium inline-flex items-center gap-1.5 whitespace-nowrap hover:opacity-85 transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97]"
              >
                <span>Explore all hardware</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/products"
                search={{ view: 'sheet' }}
                className="px-5 py-2.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/[0.09] dark:hover:bg-white/[0.14] text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] whitespace-nowrap transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97]"
              >
                <span>Quick-order sheet ({products.length || 46})</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1440px] mx-auto"
      >
        <div className="max-w-2xl mb-12 space-y-2.5">
          <div className="text-xs font-medium text-[#86868b]">
            Japanese 316L Surgical Metallurgy
          </div>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] text-[#1d1d1f] dark:text-[#f5f5f7]">
            Papa Needle Cartridges.
          </h2>
          <p className="text-base text-[#86868b] leading-relaxed">
            Automated micro-fixture soldering eliminates needle deflection. Internal silicone membrane prevents pigment backflow into rotary motors.
          </p>
        </div>

        {/* 3-Cell Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Cell 1 (7 Cols): Clean Architectural Specimen Showcase */}
          <div className="lg:col-span-7 relative rounded-[32px] bg-white dark:bg-[#121214] text-[#1d1d1f] dark:text-[#f5f5f7] p-8 sm:p-10 flex flex-col justify-between overflow-hidden shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)]">
            <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-medium text-[#86868b]">
                  {NEEDLE_CONFIG_FAMILIES[activeNeedleIndex]?.code} · {NEEDLE_CONFIG_FAMILIES[activeNeedleIndex]?.name} · Sterile Box of 20
                </span>
                <h3 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em]">
                  {NEEDLE_CONFIG_FAMILIES[activeNeedleIndex]?.name} Precision.
                </h3>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-[#86868b] block">Box of 20</span>
                <span className="text-xl sm:text-2xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tabular-nums tracking-tight">
                  $22.00 - $25.00
                </span>
              </div>
            </div>

            <div className="relative z-10 my-8 flex items-center justify-center min-h-[240px] sm:min-h-[280px]">
              <img
                key={NEEDLE_CONFIG_FAMILIES[activeNeedleIndex]?.code}
                src={NEEDLE_CONFIG_FAMILIES[activeNeedleIndex]?.image}
                alt={`Papa ${NEEDLE_CONFIG_FAMILIES[activeNeedleIndex]?.name} Needles`}
                loading="lazy"
                className="max-h-[250px] sm:max-h-[290px] w-auto object-contain drop-shadow-[0_20px_36px_rgba(0,0,0,0.14)] dark:drop-shadow-[0_28px_50px_rgba(0,0,0,0.75)] transition-transform duration-300 ease-[var(--ease-spring)] hover:scale-[1.03]"
              />
            </div>

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-black/[0.06] dark:border-white/[0.08]">
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#86868b]">
                <span>100% EO Gas Sterilized</span>
                <span className="opacity-40">·</span>
                <span>Medical Polycarbonate Housing</span>
              </div>

              <Link
                to="/products/$handle"
                params={{ handle: 'papa-premium-tattoo-cartridges' }}
                className="px-6 py-3 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] font-medium text-xs inline-flex items-center gap-2 hover:opacity-85 transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97]"
              >
                <span>Configure 62 Sizes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column (5 Cols): 2 Stacked Engineering Bento Cells */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Cell 2: 4 Needle Taper Configurations */}
            <div className="flex-1 rounded-[32px] bg-white dark:bg-[#121214] p-7 sm:p-8 flex flex-col justify-between shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between gap-2 mb-5">
                <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-[-0.015em]">
                  Four Needle Geometries
                </h3>
                <span className="text-xs text-[#86868b]">
                  0.25 - 0.35 mm
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {NEEDLE_CONFIG_FAMILIES.map((item, idx) => {
                  const isCurrent = idx === activeNeedleIndex
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => setActiveNeedleIndex(idx)}
                      className={`text-left group p-4 rounded-2xl transition-[transform,background-color,box-shadow] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.98] cursor-pointer ${
                        isCurrent
                          ? 'bg-[#e5e5ea] dark:bg-[#2c2c2e] shadow-[0_4px_16px_rgba(0,0,0,0.08)]'
                          : 'bg-[#f5f5f7] dark:bg-[#1c1c1e] hover:bg-black/[0.05] dark:hover:bg-white/[0.07]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                          {item.code}
                        </span>
                        <ArrowUpRight
                          className={`w-3.5 h-3.5 transition-colors ${
                            isCurrent
                              ? 'text-[#1d1d1f] dark:text-white'
                              : 'text-[#86868b] group-hover:text-[#1d1d1f] dark:group-hover:text-white'
                          }`}
                        />
                      </div>
                      <div className="text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mt-1">
                        {item.name}
                      </div>
                      <p className="text-[11px] text-[#86868b] mt-0.5 leading-snug">
                        {item.spec}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Cell 3: Standard vs Premium Comparison Tile */}
            <div className="rounded-[32px] bg-white dark:bg-[#121214] p-7 sm:p-8 flex items-center justify-between gap-5 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)]">
              <div className="space-y-2">
                <span className="text-xs font-medium text-[#86868b]">
                  High-Volume Studio Pack
                </span>
                <h3 className="text-xl font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-[#f5f5f7]">
                  Standard Series Cartridges
                </h3>
                <p className="text-xs text-[#86868b] leading-relaxed max-w-xs">
                  Universal twist-fit housing for daily workhorse lining and shading at $22.00 per box.
                </p>
                <div className="pt-1">
                  <Link
                    to="/products/$handle"
                    params={{ handle: 'papa-standard-tattoo-cartridges' }}
                    className="text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] hover:opacity-70 inline-flex items-center gap-1 transition-opacity"
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
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* Monolith 1: Papa Volt Wireless Power */}
          <div className="rounded-[32px] bg-white dark:bg-[#121214] p-8 sm:p-10 flex flex-col justify-between shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)]">
            <div className="space-y-2.5">
              <div className="text-xs font-medium text-[#86868b]">
                5V - 12V Regulated Output · Universal RCA Fitment
              </div>
              <h2 className="text-2xl sm:text-4xl font-semibold tracking-[-0.028em] text-[#1d1d1f] dark:text-[#f5f5f7]">
                Papa Volt Wireless Power.
              </h2>
              <p className="text-sm sm:text-base text-[#86868b] leading-relaxed">
                Ultra-compact 2,000 mAh lithium dock delivering up to 8 hours of low-ripple voltage without tethering cords.
              </p>
            </div>

            <div className="my-6 flex items-center justify-center">
              <ParallaxApparatusStage
                imageSrc="/product-images/img_041_papa_volt_large_cutout.webp"
                alt="Papa Volt Wireless Battery Dock"
                accentColor="cyan"
                baseRotation={5}
                className="max-w-[360px] sm:max-w-[400px]"
              />
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4 pt-5 border-t border-black/[0.06] dark:border-white/[0.08]">
                <div>
                  <span className="text-lg sm:text-xl font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-[#f5f5f7] block tabular-nums">
                    2,000 mAh
                  </span>
                  <span className="text-xs text-[#86868b]">
                    Lithium Cell
                  </span>
                </div>
                <div>
                  <span className="text-lg sm:text-xl font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-[#f5f5f7] block tabular-nums">
                    5V - 12V
                  </span>
                  <span className="text-xs text-[#86868b]">
                    Clean Drive
                  </span>
                </div>
                <div>
                  <span className="text-lg sm:text-xl font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-[#f5f5f7] block">
                    USB-C
                  </span>
                  <span className="text-xs text-[#86868b]">
                    Fast Charge
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <Link
                  to="/products/$handle"
                  params={{ handle: 'papa-volt-battery' }}
                  className="px-6 py-3 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] font-medium text-xs inline-flex items-center gap-2 hover:opacity-85 transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97]"
                >
                  <span>Explore Papa Volt</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/products"
                  search={{ category: 'power' }}
                  className="text-xs font-medium text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>All power units</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Monolith 2: CNC Adjustable Click Grips */}
          <div className="rounded-[32px] bg-white dark:bg-[#121214] p-8 sm:p-10 flex flex-col justify-between shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)]">
            <div className="space-y-2.5">
              <div className="text-xs font-medium text-[#86868b]">
                Aerospace 6061-T6 Billet · 316L Stainless Backstem
              </div>
              <h2 className="text-2xl sm:text-4xl font-semibold tracking-[-0.028em] text-[#1d1d1f] dark:text-[#f5f5f7]">
                CNC Click Grips.
              </h2>
              <p className="text-sm sm:text-base text-[#86868b] leading-relaxed">
                Ratcheted millimeter click-stop needle depth locking shifts balance forward to reduce wrist fatigue.
              </p>
            </div>

            <div className="my-6 flex items-center justify-center">
              <ParallaxApparatusStage
                imageSrc="/product-images/img_111_papa_adjustment_grips_1__cutout.webp"
                alt="Papa CNC Adjustable Click Grip"
                accentColor="emerald"
                baseRotation={-5}
                className="max-w-[360px] sm:max-w-[400px]"
              />
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4 pt-5 border-t border-black/[0.06] dark:border-white/[0.08]">
                <div>
                  <span className="text-lg sm:text-xl font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-[#f5f5f7] block">
                    6061-T6
                  </span>
                  <span className="text-xs text-[#86868b]">
                    Anodized Alloy
                  </span>
                </div>
                <div>
                  <span className="text-lg sm:text-xl font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-[#f5f5f7] block">
                    Click-Stop
                  </span>
                  <span className="text-xs text-[#86868b]">
                    Depth Lock
                  </span>
                </div>
                <div>
                  <span className="text-lg sm:text-xl font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-[#f5f5f7] block tabular-nums">
                    134 °C
                  </span>
                  <span className="text-xs text-[#86868b]">
                    Autoclavable
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <Link
                  to="/products"
                  search={{ category: 'grips' }}
                  className="px-6 py-3 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] font-medium text-xs inline-flex items-center gap-2 hover:opacity-85 transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97]"
                >
                  <span>Explore 8 Grip Models</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-xs font-medium text-[#86868b] tabular-nums">
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
                <div className="text-xs font-medium text-[#86868b]">
                  Official Pro Team Roster
                </div>
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.028em] text-[#1d1d1f] dark:text-[#f5f5f7]">
                  Trusted by 40+ Resident Artists.
                </h2>
              </div>

              <Link
                to="/sponsorship-artists"
                className="text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] hover:opacity-70 inline-flex items-center gap-1 shrink-0 transition-opacity"
              >
                <span>Full artist directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {FEATURED_ARTISTS.map(artist => (
                <Link
                  key={artist.id}
                  to="/sponsorship-artists"
                  className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-900"
                >
                  <img
                    src={artist.image}
                    alt={artist.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-center transition-transform duration-300 ease-[var(--ease-spring)] group-hover:scale-[1.04]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent"
                  />
                  <div className="absolute bottom-3.5 inset-x-3.5 text-left">
                    <div className="text-xs font-semibold text-white truncate">
                      {artist.name}
                    </div>
                    <div className="text-[11px] text-white/70 truncate">
                      {artist.handle}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right 5 Columns: Architectural Studio & Wholesale Ledger */}
          <div className="lg:col-span-5 rounded-[32px] bg-white dark:bg-[#121214] p-8 sm:p-10 divide-y divide-black/[0.06] dark:divide-white/[0.08] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)]">
            <div className="pb-6 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-[-0.015em]">
                  40+ Countries Express Dispatch
                </h3>
                <Truck className="w-4.5 h-4.5 text-[#86868b] shrink-0" />
              </div>
              <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                Priority air logistics and verified regional distributors serving tattoo studios across North America, Europe, UK, and Australia.
              </p>
              <div className="pt-1">
                <Link
                  to="/distributors"
                  className="text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] hover:opacity-70 inline-flex items-center gap-1 transition-opacity"
                >
                  <span>Authorized distributors</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="py-6 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-[-0.015em]">
                  Class 100,000 Cleanroom Sterility
                </h3>
                <FileCheck2 className="w-4.5 h-4.5 text-[#86868b] shrink-0" />
              </div>
              <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                Every cartridge needle and disposable grip is individually blister-sealed and certified with EO Gas batch indicators.
              </p>
              <div className="pt-1">
                <Link
                  to="/about"
                  className="text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] hover:opacity-70 inline-flex items-center gap-1 transition-opacity"
                >
                  <span>Engineering standards</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="pt-6 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-[-0.015em]">
                  Direct Factory Warranty &amp; Wholesale
                </h3>
                <ShieldCheck className="w-4.5 h-4.5 text-[#86868b] shrink-0" />
              </div>
              <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                Dedicated studio volume pricing, custom anodized batch runs, and in-house rotary motor servicing.
              </p>
              <div className="pt-1 flex flex-wrap items-center gap-5">
                <Link
                  to="/contact"
                  className="text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] hover:opacity-70 inline-flex items-center gap-1 transition-opacity"
                >
                  <span>Direct factory inquiry</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
                <Link
                  to="/sponsorship-artists"
                  className="text-xs font-medium text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white inline-flex items-center gap-1 transition-colors"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Apply for sponsorship</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
