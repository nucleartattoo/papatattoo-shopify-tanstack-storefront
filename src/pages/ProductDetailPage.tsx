import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLoaderData, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ShopifyProduct, ShopifyVariant } from '../types/shopify'
import { catalogQueryOptions, productByHandleQueryOptions } from '../lib/catalog.queries'
import { useCart } from '../context/CartContext'
import { CartridgeMatrixSelector } from '../components/product/CartridgeMatrixSelector'
import { StudioReplenishmentMatrix } from '../components/product/StudioReplenishmentMatrix'
import { HardwareModelCard } from '../components/product/HardwareLineupModules'
import {
  StickyProductSubNav,
  PdpSectionId,
} from '../components/product/StickyProductSubNav'
import { formatProductImageUrl } from '../utils/imageUrl'
import { sanitizeProductHtml } from '../utils/sanitizeHtml'
import {
  classifyApparatusCategory,
  findModelGroupForProduct,
  getHardwareTechnicalProfile,
  groupProductsIntoModels,
  hasMeaningfulHtmlText,
  LineupCategory,
} from '../lib/hardwareLineup'
import {
  Box,
  Check,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Download,
  Flame,
  Gauge,
  Image as ImageIcon,
  Layers,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  Wrench,
  Zap,
} from 'lucide-react'
import { ModelViewer3D } from '../components/common/ModelViewer3D'

interface ProductDetailPageProps {
  initialProduct?: ShopifyProduct | null
  initialCatalogProducts?: ShopifyProduct[]
}

const CATEGORY_BREADCRUMB_META: Record<
  LineupCategory,
  { label: string; collectionParam: string }
> = {
  machines: { label: 'ROTARY MACHINES', collectionParam: 'machines' },
  cartridges: { label: 'NEEDLE CARTRIDGES', collectionParam: 'cartridges' },
  grips: { label: 'CLICK GRIPS & TUBES', collectionParam: 'grips' },
  power: { label: 'POWER & WIRELESS', collectionParam: 'power' },
  gear: { label: 'STUDIO WORKSTATION', collectionParam: 'accessories' },
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  initialProduct: propInitialProduct,
  initialCatalogProducts: propInitialCatalog,
}) => {
  const { handle } = useParams({ strict: false }) as { handle: string }
  const loaderData = useLoaderData({ strict: false }) as
    | { product?: ShopifyProduct | null; catalogProducts?: ShopifyProduct[] }
    | undefined

  const seedProduct =
    (propInitialProduct && propInitialProduct.handle === handle
      ? propInitialProduct
      : loaderData?.product && loaderData.product.handle === handle
      ? loaderData.product
      : undefined) ?? undefined

  const seedCatalog = propInitialCatalog ?? loaderData?.catalogProducts

  const { data: product, isLoading: productLoading } = useQuery({
    ...productByHandleQueryOptions(handle || ''),
    initialData: seedProduct,
    enabled: Boolean(handle),
  })

  const { data: catalogProducts = [] } = useQuery({
    ...catalogQueryOptions,
    initialData: seedCatalog && seedCatalog.length > 0 ? seedCatalog : undefined,
  })

  const { addToCart, openCart } = useCart()

  const has3DModel = Boolean(
    handle && (handle.includes('papa-pen-v2') || handle.includes('papapenv2'))
  )

  const [prevHandle, setPrevHandle] = useState(handle)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [selectedVariantState, setSelectedVariant] = useState<ShopifyVariant | null>(
    () => product?.variants?.edges?.[0]?.node || null
  )
  const [quantity, setQuantity] = useState(1)
  const [addedAnimation, setAddedAnimation] = useState(false)
  const [mediaViewMode, setMediaViewMode] = useState<'photo' | '3d'>('photo')
  const [showStickyBuy, setShowStickyBuy] = useState(false)
  const [activeSection, setActiveSection] = useState<PdpSectionId>('overview')

  const primaryActionRef = useRef<HTMLDivElement>(null)
  const overviewRef = useRef<HTMLElement>(null)
  const replenishmentRef = useRef<HTMLElement>(null)
  const engineeringRef = useRef<HTMLElement>(null)
  const specsRef = useRef<HTMLElement>(null)
  const serviceRef = useRef<HTMLElement>(null)

  const firstVariant = product?.variants?.edges?.[0]?.node || null

  if (handle !== prevHandle) {
    setPrevHandle(handle)
    setActiveImageIndex(0)
    setSelectedVariant(firstVariant)
    setMediaViewMode('photo')
    setActiveSection('overview')
  }

  const selectedVariant =
    selectedVariantState &&
    product?.variants?.edges?.some(e => e.node.id === selectedVariantState.id)
      ? selectedVariantState
      : firstVariant

  // IntersectionObserver for mobile bottom sticky buy pill
  useEffect(() => {
    const target = primaryActionRef.current
    if (!target || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBuy(!entry.isIntersecting && entry.boundingClientRect.top < 0)
      },
      { threshold: 0 }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [product?.id])

  // Track active section for sub-nav highlight
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleScroll = () => {
      const scrollY = window.scrollY + 160
      const serviceTop = serviceRef.current?.offsetTop ?? Infinity
      const specsTop = specsRef.current?.offsetTop ?? Infinity
      const engineeringTop = engineeringRef.current?.offsetTop ?? Infinity
      const replenishmentTop = replenishmentRef.current?.offsetTop ?? Infinity

      if (scrollY >= serviceTop) {
        setActiveSection('service')
      } else if (scrollY >= specsTop) {
        setActiveSection('specs')
      } else if (scrollY >= engineeringTop) {
        setActiveSection('engineering')
      } else if (scrollY >= replenishmentTop && replenishmentRef.current) {
        setActiveSection('replenishment')
      } else {
        setActiveSection('overview')
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [product?.id])

  const handleNavigateSection = (sectionId: PdpSectionId) => {
    setActiveSection(sectionId)
    let targetEl: HTMLElement | null = null
    if (sectionId === 'overview') targetEl = overviewRef.current
    else if (sectionId === 'replenishment') targetEl = replenishmentRef.current
    else if (sectionId === 'engineering') targetEl = engineeringRef.current
    else if (sectionId === 'specs') targetEl = specsRef.current
    else if (sectionId === 'service') targetEl = serviceRef.current

    if (targetEl) {
      const yOffset = -115 // accounts for sticky header (56px) + sub-nav (48px) + clearance
      const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
    }
  }

  const siblingModelGroup = useMemo(
    () => (product ? findModelGroupForProduct(catalogProducts, product.handle) : null),
    [catalogProducts, product]
  )

  const complementaryGroups = useMemo(() => {
    if (!product || catalogProducts.length === 0) return []
    const allGroups = groupProductsIntoModels(catalogProducts)
    const currentGroupId = siblingModelGroup?.id || product.id
    const currentCategory = classifyApparatusCategory(product)

    const sameCategory = allGroups.filter(
      g => g.id !== currentGroupId && g.category === currentCategory
    )
    const crossCategory = allGroups.filter(
      g => g.id !== currentGroupId && g.category !== currentCategory
    )
    return [...sameCategory, ...crossCategory].slice(0, 4)
  }, [catalogProducts, product, siblingModelGroup?.id])

  if (productLoading && !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-zinc-200 dark:bg-[#1c1c1e] rounded-2xl" />
          <div className="space-y-6">
            <div className="h-8 bg-zinc-200 dark:bg-[#1c1c1e] rounded-sm w-3/4" />
            <div className="h-6 bg-zinc-200 dark:bg-[#1c1c1e] rounded-sm w-1/4" />
            <div className="h-24 bg-zinc-200 dark:bg-[#1c1c1e] rounded-xl" />
            <div className="h-12 bg-zinc-200 dark:bg-[#1c1c1e] rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-3xl font-semibold tracking-[-0.028em] text-[#1d1d1f] dark:text-[#f5f5f7]">
          Product not found
        </h2>
        <p className="text-sm text-[#86868b] mt-2">
          The requested hardware item may have been archived or repositioned.
        </p>
        <Link
          to="/products"
          className="inline-block mt-6 px-6 py-2.5 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] font-semibold text-xs"
        >
          Browse all products
        </Link>
      </div>
    )
  }

  const images = product.images?.edges?.map(e => e.node) || []
  const category = classifyApparatusCategory(product)
  const breadcrumbMeta = CATEGORY_BREADCRUMB_META[category]
  const techProfile = getHardwareTechnicalProfile(product)
  const hasRichHtmlDescription = hasMeaningfulHtmlText(product.descriptionHtml)
  const hasPlainDescription = Boolean(
    product.description && product.description.trim().length >= 24
  )

  const isCartridge = category === 'cartridges'
  const isMachine = category === 'machines'
  const isPower = category === 'power'
  const isGrip = category === 'grips'

  const price = selectedVariant
    ? parseFloat(selectedVariant.price.amount)
    : parseFloat(product.priceRange.minVariantPrice.amount)
  const currency = selectedVariant
    ? selectedVariant.price.currencyCode
    : product.priceRange.minVariantPrice.currencyCode

  const activeSiblingOption =
    siblingModelGroup && siblingModelGroup.options.length > 1
      ? siblingModelGroup.options.find(
          o => o.product.handle.toLowerCase() === product.handle.toLowerCase()
        )
      : null

  const displayMasterTitle =
    siblingModelGroup && siblingModelGroup.options.length > 1
      ? siblingModelGroup.masterTitle
      : product.title

  const handleSelectVariant = (v: ShopifyVariant) => {
    setSelectedVariant(v)

    if (v.image?.url) {
      const vImgUrlClean = v.image.url.split('?')[0]
      const vFileName = vImgUrlClean.split('/').pop() || ''
      const imgIndex = images.findIndex(img => {
        const urlClean = img.url.split('?')[0]
        return urlClean === vImgUrlClean || (vFileName && urlClean.endsWith(vFileName))
      })
      if (imgIndex !== -1) {
        setActiveImageIndex(imgIndex)
      }
      setMediaViewMode('photo')
      return
    }

    if (v.selectedOptions && v.selectedOptions.length > 0) {
      for (const opt of v.selectedOptions) {
        const valLower = opt.value.toLowerCase()
        const optWords = valLower.split(/\s+/).filter(w => w.length > 2)
        const matchedIndex = images.findIndex(img => {
          const url = img.url.toLowerCase()
          const alt = (img.altText || '').toLowerCase()
          return (
            url.includes(valLower) ||
            alt.includes(valLower) ||
            optWords.some(w => url.includes(w) || alt.includes(w))
          )
        })
        if (matchedIndex !== -1) {
          setActiveImageIndex(matchedIndex)
          setMediaViewMode('photo')
          return
        }
      }
    }

    const titleClean = v.title.toLowerCase().replace(/[^a-z0-9]/g, '_')
    const titleWords = v.title.toLowerCase().split(/\s+/).filter(w => w.length > 2)
    const matchedIndex = images.findIndex(img => {
      const url = img.url.toLowerCase()
      const alt = (img.altText || '').toLowerCase()
      if (url.includes(titleClean) || alt.includes(v.title.toLowerCase())) {
        return true
      }
      return titleWords.some(w => url.includes(w) || alt.includes(w))
    })

    if (matchedIndex !== -1) {
      setActiveImageIndex(matchedIndex)
      setMediaViewMode('photo')
    }
  }

  const handleAddToCart = () => {
    const activeVariant: ShopifyVariant = selectedVariant ||
      product.variants?.edges?.[0]?.node || {
        id: `${product.id}-default`,
        title: 'Standard',
        price: product.priceRange.minVariantPrice,
      }

    addToCart(product, activeVariant, quantity)
    setAddedAnimation(true)
    setTimeout(() => setAddedAnimation(false), 2000)
    openCart()
  }

  const isAvailableForSale =
    selectedVariant?.availableForSale !== false && product.availableForSale !== false

  // Category-specific engineering telemetry pillars
  const engineeringPillars = useMemo(() => {
    if (isMachine) {
      return [
        {
          icon: <Cpu className="w-5 h-5 text-indigo-500" />,
          title: 'German Coreless Drive',
          metric: '10,500 RPM',
          metricLabel: 'Peak Velocity',
          description:
            'Steady rotational inertia with zero thermal drift. Eliminates needle drag and bogging on dense skin passes.',
        },
        {
          icon: <Layers className="w-5 h-5 text-amber-500" />,
          title: '6061-T6 Billet Chassis',
          metric: '150 g',
          metricLabel: 'Forward-Biased Mass',
          description:
            'Milled from monolithic aerospace alloy. Lowers wrist fatigue by placing balance directly over the needle cartridge tip.',
        },
        {
          icon: <Gauge className="w-5 h-5 text-emerald-500" />,
          title: 'Precision Cam Stability',
          metric: '< 0.02 mm',
          metricLabel: 'Lateral Runout',
          description:
            'Precision dual-bearing guide stabilizes needle throw for ultra-fine single needle lines and flawless realism.',
        },
      ]
    }

    if (isCartridge) {
      return [
        {
          icon: <Sparkles className="w-5 h-5 text-indigo-500" />,
          title: 'Japanese 316L Surgical Steel',
          metric: '0.30 - 0.35 mm',
          metricLabel: 'Micron Needle Gauge',
          description:
            'Electrolytically polished pins with zero micro-burrs under 40x magnification for minimal trauma and rapid healing.',
        },
        {
          icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
          title: 'Full Silicone Safety Membrane',
          metric: '100%',
          metricLabel: 'Backflow Isolation',
          description:
            'High-elasticity silicone diaphragm prevents pigment and fluids from entering machine grips or motor housings.',
        },
        {
          icon: <Flame className="w-5 h-5 text-amber-500" />,
          title: 'Optical Polycarbonate Housing',
          metric: 'EO Gas',
          metricLabel: 'Blister Certified',
          description:
            'Crystal-clear reservoir tip provides unobstructed needle visibility and calibrated ink saturation per stroke.',
        },
      ]
    }

    if (isPower) {
      return [
        {
          icon: <Zap className="w-5 h-5 text-amber-500" />,
          title: 'Regulated Pure DC Output',
          metric: '5V - 12V',
          metricLabel: '0.1V Increments',
          description:
            'Clean ripple-free voltage delivery ensures consistent motor torque without micro-stutters across long sessions.',
        },
        {
          icon: <Cpu className="w-5 h-5 text-indigo-500" />,
          title: 'High-Density Lithium Cell',
          metric: '2,000 mAh',
          metricLabel: 'Up to 8h Runtime',
          description:
            'Cord-free freedom with balanced center of gravity and USB-C fast charging restored in under 90 minutes.',
        },
        {
          icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
          title: 'Gold-Plated RCA Interface',
          metric: '< 0.05 Ω',
          metricLabel: 'Terminal Resistance',
          description:
            'Precision gold contacts eliminate signal loss and heat buildup during continuous heavy magnum packing.',
        },
      ]
    }

    return [
      {
        icon: <Layers className="w-5 h-5 text-indigo-500" />,
        title: 'Studio Grade Durability',
        metric: '100%',
        metricLabel: 'Sanitizer Safe',
        description:
          'Engineered for daily parlour use with resistance to Cavicide, isopropyl alcohol, and ultrasonic cleaning.',
      },
      {
        icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
        title: 'Precision Calibration',
        metric: 'Factory QC',
        metricLabel: 'Individually Tested',
        description:
          'Every component is verified prior to dispatch to meet professional tattoo equipment standards.',
      },
      {
        icon: <Truck className="w-5 h-5 text-amber-500" />,
        title: 'Professional Logistics',
        metric: '24h',
        metricLabel: 'Rapid Dispatch',
        description:
          'Fast global studio fulfillment with secure protective packing to ensure intact delivery.',
      },
    ]
  }, [isMachine, isCartridge, isPower])

  return (
    <div className="bg-transparent min-h-[100dvh] text-[#1d1d1f] dark:text-[#f5f5f7] pb-28 transition-colors duration-300">
      {/* 1. Contextual Sticky Product Sub-Navigation (Apple Sub-Nav Dock) */}
      <StickyProductSubNav
        title={displayMasterTitle}
        specLine={siblingModelGroup?.specLine || techProfile.headline}
        price={price}
        currency={currency}
        unitLabel={isCartridge ? 'Box of 20' : 'Unit'}
        activeSection={activeSection}
        onSelectSection={handleNavigateSection}
        onAddToCart={handleAddToCart}
        isAvailable={isAvailableForSale}
        isAddedAnimation={addedAnimation}
        hasReplenishment={isCartridge}
      />

      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Breadcrumb Hierarchy */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-[#86868b] mb-6 sm:mb-8 overflow-x-auto pb-1 no-scrollbar"
        >
          <Link to="/" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600 shrink-0" />
          <Link
            to="/products"
            className="hover:text-zinc-950 dark:hover:text-white transition-colors shrink-0"
          >
            Products
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600 shrink-0" />
          <Link
            to="/collections"
            search={{ category: breadcrumbMeta.collectionParam }}
            className="hover:text-zinc-950 dark:hover:text-white transition-colors shrink-0"
          >
            {breadcrumbMeta.label}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600 shrink-0" />
          <span className="text-[#1d1d1f] dark:text-[#f5f5f7] truncate">
            {displayMasterTitle}
          </span>
        </nav>

        {/* =========================================================================
            ACT 1: Specimen Stage & Studio Configuration Console (#overview)
        ========================================================================= */}
        <section
          id="overview"
          ref={overviewRef}
          className="scroll-mt-28 grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 mb-20 items-start"
        >
          {/* Left Column (6 cols): Specimen Showcase Stage */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-[32px] bg-white dark:bg-[#121214] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.06)] dark:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.7)] flex items-center justify-center p-8 sm:p-12 group overflow-hidden">
              {/* Subtle Ambient Radial Glow */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-radial from-black/[0.03] dark:from-white/[0.04] to-transparent pointer-events-none"
              />

              {mediaViewMode === '3d' && has3DModel ? (
                <ModelViewer3D
                  src="/models/papapenv2.glb"
                  poster={formatProductImageUrl(images[activeImageIndex]?.url)}
                  alt={product.title}
                  className="w-full h-full relative z-10"
                />
              ) : images.length > 0 ? (
                <img
                  key={`${product.handle}-${activeImageIndex}`}
                  src={formatProductImageUrl(images[activeImageIndex]?.url)}
                  alt={images[activeImageIndex]?.altText || product.title}
                  className="relative z-10 max-h-[86%] max-w-[86%] w-auto object-contain transition-transform duration-300 ease-[var(--ease-spring)] group-hover:scale-[1.03] drop-shadow-[0_20px_38px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_24px_48px_rgba(0,0,0,0.65)]"
                  onError={e => {
                    const image = e.currentTarget
                    const fallback = images[activeImageIndex]?.url
                    if (fallback && image.src !== fallback) {
                      image.src = fallback
                    }
                  }}
                />
              ) : (
                <div className="text-zinc-400 text-xs">No image available</div>
              )}

              {/* 2D Studio Photography vs 3D Interactive Model Toggle */}
              {has3DModel && (
                <div className="absolute bottom-4 left-4 z-20 flex items-center gap-0.5 p-1 rounded-full bg-[#f5f5f7]/90 dark:bg-[#1c1c1e]/90 backdrop-blur-md text-xs shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setMediaViewMode('photo')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-medium text-[11px] transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer ${
                      mediaViewMode === 'photo'
                        ? 'bg-white text-[#1d1d1f] dark:bg-[#2c2c2e] dark:text-white shadow-2xs'
                        : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaViewMode('3d')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-medium text-[11px] transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer ${
                      mediaViewMode === '3d'
                        ? 'bg-white text-[#1d1d1f] dark:bg-[#2c2c2e] dark:text-white shadow-2xs'
                        : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                    }`}
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>3D View</span>
                  </button>
                </div>
              )}

              {/* Image Position Indicator */}
              {images.length > 1 && mediaViewMode === 'photo' && (
                <div className="absolute bottom-4 right-4 z-20 px-2.5 py-1 rounded-full bg-[#f5f5f7]/90 dark:bg-[#1c1c1e]/90 text-[11px] font-medium tabular-nums text-[#86868b] backdrop-blur-md shadow-2xs">
                  {activeImageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Carousel Strip */}
            {(images.length > 1 || has3DModel) && (
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2.5">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActiveImageIndex(idx)
                      setMediaViewMode('photo')
                    }}
                    className={`aspect-square rounded-2xl border p-2 transition-[transform,border-color,opacity,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.96] overflow-hidden cursor-pointer ${
                      mediaViewMode === 'photo' && activeImageIndex === idx
                        ? 'border-[#1d1d1f] dark:border-white bg-white dark:bg-[#121214] ring-1 ring-[#1d1d1f] dark:ring-white'
                        : 'border-transparent bg-white dark:bg-[#121214] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={formatProductImageUrl(img.url)}
                      alt=""
                      className="w-full h-full object-contain"
                      onError={e => {
                        const image = e.currentTarget
                        if (img.url && image.src !== img.url) {
                          image.src = img.url
                        }
                      }}
                    />
                  </button>
                ))}

                {has3DModel && (
                  <button
                    type="button"
                    onClick={() => setMediaViewMode('3d')}
                    className={`aspect-square rounded-2xl border p-2 flex flex-col items-center justify-center gap-1 transition-[transform,border-color,color,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.96] cursor-pointer ${
                      mediaViewMode === '3d'
                        ? 'border-[#1d1d1f] dark:border-white bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-[#f5f5f7] ring-1 ring-[#1d1d1f] dark:ring-white'
                        : 'border-transparent bg-white dark:bg-[#121214] text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                    }`}
                  >
                    <Box className="w-5 h-5" />
                    <span className="text-[9px] font-semibold">3D Model</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Column (6 cols): Specimen Data & Ordering Console */}
          <div className="lg:col-span-6 space-y-6">
            {/* Status Beacon + Title + Spec Summary */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs">
                  {isAvailableForSale ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      In stock and ready to ship
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 font-medium text-xs">
                      Sold out
                    </span>
                  )}
                </div>

                {selectedVariant?.sku && (
                  <span className="text-[11px] text-[#86868b] font-mono">
                    SKU: {selectedVariant.sku}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.035em] text-[#1d1d1f] dark:text-[#f5f5f7] leading-[1.05]">
                {product.title}
              </h1>

              <p className="text-sm sm:text-base text-[#86868b] flex flex-wrap items-center gap-x-2 gap-y-1">
                {(siblingModelGroup?.specLine || techProfile.headline)
                  .split(/\s*·\s*/)
                  .map((segment, idx, arr) => (
                    <React.Fragment key={idx}>
                      <span className="whitespace-nowrap">{segment}</span>
                      {idx < arr.length - 1 && (
                        <span aria-hidden="true" className="opacity-40">
                          ·
                        </span>
                      )}
                    </React.Fragment>
                  ))}
              </p>
            </div>

            {/* Apple Hardware Key Telemetry Strip */}
            <div className="flex flex-wrap gap-2 py-1">
              {techProfile.highlights.map(highlight => (
                <span
                  key={highlight}
                  className="px-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.07] text-xs font-medium text-[#1d1d1f]/85 dark:text-[#f5f5f7]/85 whitespace-nowrap"
                >
                  {highlight}
                </span>
              ))}
            </div>

            {/* Price Block */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#121214] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <div className="text-xs text-[#86868b] mb-1">Professional Pricing</div>
              <div className="flex items-baseline gap-2.5 whitespace-nowrap">
                <span className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] tabular-nums text-[#1d1d1f] dark:text-[#f5f5f7]">
                  ${price.toFixed(2)}
                </span>
                <span className="text-xs text-[#86868b] whitespace-nowrap">
                  {currency} {isCartridge ? '/ Box of 20' : '/ Unit'}
                </span>
              </div>
              <p className="text-[11px] text-[#86868b] mt-1.5">
                Free standard shipping for orders over $150. Factory sealed.
              </p>
            </div>

            {/* Sibling Model / Finish Switcher */}
            {siblingModelGroup && siblingModelGroup.options.length > 1 && (
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                    {siblingModelGroup.swatchLabelPrefix || 'Finish'}:{' '}
                    <strong className="font-normal text-[#86868b]">
                      {activeSiblingOption?.label || product.title}
                    </strong>
                  </span>
                  <span className="text-xs text-[#86868b]">
                    {siblingModelGroup.options.length}{' '}
                    {siblingModelGroup.swatchLabelPrefix || 'Finish'} Options
                  </span>
                </div>

                {siblingModelGroup.options[0]?.swatchType === 'dot' ? (
                  <div className="flex flex-wrap items-center gap-2.5">
                    {siblingModelGroup.options.map(opt => {
                      const isCurrent =
                        opt.product.handle.toLowerCase() === product.handle.toLowerCase()
                      return (
                        <Link
                          key={opt.product.id}
                          to="/products/$handle"
                          params={{ handle: opt.product.handle }}
                          resetScroll={false}
                          className={`group/swatch inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs transition-[transform,background-color,border-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] ${
                            isCurrent
                              ? 'border-[#1d1d1f] dark:border-white bg-white dark:bg-[#121214] text-[#1d1d1f] dark:text-white font-semibold ring-1 ring-[#1d1d1f] dark:ring-white shadow-2xs'
                              : 'border-black/[0.12] dark:border-white/15 bg-white dark:bg-[#121214] text-[#1d1d1f]/85 dark:text-[#f5f5f7]/85 hover:border-black/30 dark:hover:border-white/35'
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-black/20 dark:border-white/25 shrink-0 relative"
                            style={{ background: opt.swatchCss }}
                          >
                            {!opt.available && (
                              <span className="absolute inset-0 flex items-center justify-center">
                                <span className="w-full h-[1.5px] bg-red-500 rotate-45" />
                              </span>
                            )}
                          </span>
                          <span>{opt.label}</span>
                          {!opt.available && (
                            <span className="text-[9px] text-red-500 font-normal">
                              Sold Out
                            </span>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-2">
                    {siblingModelGroup.options.map(opt => {
                      const isCurrent =
                        opt.product.handle.toLowerCase() === product.handle.toLowerCase()
                      const optPrice = parseFloat(
                        opt.product.priceRange?.minVariantPrice?.amount || '0'
                      )
                      return (
                        <Link
                          key={opt.product.id}
                          to="/products/$handle"
                          params={{ handle: opt.product.handle }}
                          resetScroll={false}
                          className={`px-4 py-3 rounded-xl border text-xs font-medium transition-[transform,background-color,border-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] flex items-center gap-2 ${
                            isCurrent
                              ? 'border-[#1d1d1f] dark:border-white bg-white dark:bg-[#121214] text-[#1d1d1f] dark:text-white font-semibold ring-1 ring-[#1d1d1f] dark:ring-white shadow-2xs'
                              : 'border-black/[0.12] dark:border-white/15 bg-white dark:bg-[#121214] text-[#1d1d1f]/85 dark:text-[#f5f5f7]/85 hover:border-black/30 dark:hover:border-white/35'
                          }`}
                        >
                          <span>{opt.label}</span>
                          <span className="text-[10px] text-[#86868b]">
                            ${optPrice.toFixed(2)}
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Cartridge B2B Quick Jump Banner */}
            {isCartridge && (
              <div className="p-4 rounded-2xl bg-emerald-500/[0.05] dark:bg-emerald-500/[0.08] border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>B2B Studio Procurement Matrix</span>
                  </div>
                  <div className="text-[11px] text-[#86868b]">
                    Need multiple needle sizes? Allocate multi-box orders with 1-click presets and up to 15% volume allowance.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleNavigateSection('replenishment')}
                  className="px-3.5 py-1.5 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-xs font-medium shrink-0 hover:opacity-88 active:scale-[0.97] transition-all cursor-pointer shadow-xs whitespace-nowrap"
                >
                  Open Studio Matrix ›
                </button>
              </div>
            )}

            {/* Variant / Needle Matrix Selector */}
            {product.options && product.options.some(o => o.name.toLowerCase() === 'type') ? (
              <CartridgeMatrixSelector
                product={product}
                selectedVariant={selectedVariant}
                onSelectVariant={handleSelectVariant}
              />
            ) : product.variants?.edges && product.variants.edges.length > 1 ? (
              <div className="space-y-2.5 pt-1">
                <label className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] block">
                  Configuration
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.edges.map(({ node: v }) => {
                    const isSelected = selectedVariant?.id === v.id
                    const variantInStock = v.availableForSale !== false
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => handleSelectVariant(v)}
                        className={`relative px-4 py-3 rounded-xl text-xs font-medium border transition-[transform,background-color,border-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer ${
                          isSelected
                            ? variantInStock
                              ? 'border-[#1d1d1f] dark:border-white bg-white dark:bg-[#121214] text-[#1d1d1f] dark:text-white font-semibold ring-1 ring-[#1d1d1f] dark:ring-white shadow-2xs'
                              : 'border-red-500/80 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300'
                            : variantInStock
                            ? 'border-black/[0.12] dark:border-white/15 bg-white dark:bg-[#121214] text-[#1d1d1f]/85 dark:text-[#f5f5f7]/85 hover:border-black/30 dark:hover:border-white/35'
                            : 'border-black/[0.05] dark:border-white/[0.04] bg-zinc-100/50 dark:bg-white/[0.02] text-zinc-400 dark:text-zinc-600 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <span>{v.title}</span>
                        {!variantInStock && (
                          <span className="ml-1.5 text-[10px] font-normal lowercase tracking-[-0.02em] text-red-500">
                            (sold out)
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : null}

            {/* Quantity Stepper and Procurement Action Box */}
            <div ref={primaryActionRef} className="space-y-3 pt-2">
              <div className="flex items-center gap-3.5">
                {/* Ergonomic Stepper */}
                <div className="flex items-center rounded-full bg-black/[0.05] dark:bg-white/[0.08] overflow-hidden px-1 h-13 shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-full flex items-center justify-center text-zinc-500 hover:text-zinc-950 dark:hover:text-white text-base transition-[transform,color] duration-150 ease-[var(--ease-out-strong)] cursor-pointer active:scale-90"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-sm font-semibold tabular-nums text-[#1d1d1f] dark:text-[#f5f5f7]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-full flex items-center justify-center text-zinc-500 hover:text-zinc-950 dark:hover:text-white text-base transition-[transform,color] duration-150 ease-[var(--ease-out-strong)] cursor-pointer active:scale-90"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Primary Add to Studio Bag Action */}
                {isAvailableForSale ? (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 h-13 px-6 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] font-medium text-sm flex items-center justify-center gap-2 hover:opacity-88 active:scale-[0.98] transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] cursor-pointer shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      {addedAnimation
                        ? 'Added to Bag'
                        : `Add to Bag · $${(price * quantity).toFixed(2)}`}
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="flex-1 h-13 px-6 rounded-full bg-black/[0.05] text-[#86868b] dark:bg-white/[0.08] font-medium text-sm flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <ShoppingBag className="w-4 h-4 opacity-50" />
                    <span>Out of Stock</span>
                  </button>
                )}
              </div>

              {/* Instant Buy Now Button */}
              {isAvailableForSale && (
                <button
                  type="button"
                  onClick={() => {
                    handleAddToCart()
                    openCart()
                  }}
                  className="w-full h-12 px-6 rounded-full bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7] transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <span>Instant Studio Checkout</span>
                </button>
              )}
            </div>

            {/* Professional Studio Assurance Strip */}
            <div className="grid grid-cols-2 gap-3.5 pt-5 border-t border-black/[0.06] dark:border-white/[0.08] text-xs text-[#86868b]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  {isCartridge
                    ? '100% EO Gas Sterilized'
                    : isGrip
                    ? 'Precision Depth Calibration'
                    : 'Factory QC Calibrated'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#86868b] shrink-0" />
                <span>Global Express Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  {isCartridge
                    ? 'Medical 316L Surgical Pins'
                    : isGrip
                    ? 'Autoclavable / Sterile Rated'
                    : '1-Year Factory Warranty'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#86868b] shrink-0" />
                <span>14-Day Pro Replacement Guarantee</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            ACT 2 (Cartridge Specialization): Studio Replenishment Matrix (#replenishment)
        ========================================================================= */}
        {isCartridge && (
          <section
            id="replenishment"
            ref={replenishmentRef}
            className="scroll-mt-28 mb-24 pt-6"
          >
            <StudioReplenishmentMatrix product={product} />
          </section>
        )}

        {/* =========================================================================
            ACT 3: Engineering Highlights & Macro Anatomy Showcase (#engineering)
        ========================================================================= */}
        <section
          id="engineering"
          ref={engineeringRef}
          className="scroll-mt-28 mb-24 pt-12 border-t border-black/[0.06] dark:border-white/[0.08]"
        >
          {/* Section Header */}
          <div className="max-w-3xl mb-12 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">
              Engineering Architecture
            </span>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.035em] text-[#1d1d1f] dark:text-[#f5f5f7] leading-[1.05]">
              {techProfile.headline}
            </h2>
            <p className="text-base sm:text-lg text-[#86868b] leading-relaxed">
              Every curve, tolerance, and internal bearing is calibrated for unyielding performance across demanding studio sessions.
            </p>
          </div>

          {/* 3-Pillar Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {engineeringPillars.map((pillar, idx) => (
              <div
                key={idx}
                className="p-8 rounded-[28px] bg-white dark:bg-[#121214] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_12px_36px_-16px_rgba(0,0,0,0.04)] dark:shadow-[0_16px_40px_-16px_rgba(0,0,0,0.6)] flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-2xl bg-black/[0.04] dark:bg-white/[0.08] flex items-center justify-center">
                    {pillar.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-[#f5f5f7]">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#86868b] mt-2 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
                  <span className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] tabular-nums text-[#1d1d1f] dark:text-[#f5f5f7] block">
                    {pillar.metric}
                  </span>
                  <span className="text-xs text-[#86868b] mt-0.5 block">
                    {pillar.metricLabel}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Narrative Story Deep Dive */}
          <div className="rounded-[32px] bg-white dark:bg-[#121214] p-8 sm:p-12 lg:p-14 border border-black/[0.06] dark:border-white/[0.08] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.04)]">
            <div className="max-w-4xl space-y-6">
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-[#1d1d1f] dark:text-[#f5f5f7]">
                Designed for the Hands of Masters
              </h3>

              {hasRichHtmlDescription ? (
                <div
                  className="product-description-content text-sm sm:text-base text-[#1d1d1f]/85 dark:text-[#f5f5f7]/85 leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeProductHtml(product.descriptionHtml || ''),
                  }}
                />
              ) : hasPlainDescription ? (
                <div className="text-sm sm:text-base text-[#1d1d1f]/85 dark:text-[#f5f5f7]/85 leading-relaxed space-y-4">
                  {(product.description || '').split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              ) : (
                <div className="text-sm sm:text-base text-[#1d1d1f]/85 dark:text-[#f5f5f7]/85 leading-relaxed space-y-4">
                  {techProfile.summaryParagraphs.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =========================================================================
            ACT 3: Structured Precision Technical Specifications Matrix (#specs)
        ========================================================================= */}
        <section
          id="specs"
          ref={specsRef}
          className="scroll-mt-28 mb-24 pt-12 border-t border-black/[0.06] dark:border-white/[0.08]"
        >
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">
                Hardware Specifications
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-[#1d1d1f] dark:text-[#f5f5f7]">
                Precision Calibrated.
              </h2>
            </div>
            <span className="text-xs text-[#86868b]">
              Factory tested under load before release
            </span>
          </div>

          <div className="rounded-[32px] bg-white dark:bg-[#121214] p-8 sm:p-12 border border-black/[0.06] dark:border-white/[0.08] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.04)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              {techProfile.specs.map(spec => (
                <div
                  key={spec.label}
                  className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 py-4 border-b border-black/[0.06] dark:border-white/[0.08]"
                >
                  <span className="text-xs font-medium uppercase tracking-wide text-[#86868b] sm:max-w-[40%]">
                    {spec.label}
                  </span>
                  <span className="text-sm font-medium tabular-nums text-[#1d1d1f] dark:text-[#f5f5f7] sm:text-right">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Certification and Standards Bar */}
            <div className="mt-10 pt-8 border-t border-black/[0.06] dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-4 text-xs text-[#86868b]">
              <div className="flex items-center gap-6">
                <span className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                  Standards Compliance:
                </span>
                <span>ISO 9001 Factory Quality</span>
                <span>CE Certified</span>
                <span>Class 100,000 Cleanroom Packed</span>
              </div>
              <div className="text-[11px]">
                Papa Tattoo Supply Technical Division · Calibrated in Germany &amp; Japan
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            ACT 4: Warranty, Service & Studio Guarantee (#service)
        ========================================================================= */}
        <section
          id="service"
          ref={serviceRef}
          className="scroll-mt-28 mb-24 pt-12 border-t border-black/[0.06] dark:border-white/[0.08]"
        >
          <div className="space-y-2 mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">
              Factory Backing
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-[#1d1d1f] dark:text-[#f5f5f7]">
              Warranty &amp; Professional Service.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Card 1: 14-Day Pro Guarantee */}
            <div className="p-8 rounded-[28px] bg-white dark:bg-[#121214] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_12px_36px_-16px_rgba(0,0,0,0.04)] space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-[#f5f5f7]">
                14-Day Pro Replacement Guarantee
              </h3>
              <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                If your machine or hardware specimen develops any manufacturing defects within 14 days of delivery, Papa Tattoo provides an immediate one-to-one replacement or credit adjustment with zero hassle.
              </p>
            </div>

            {/* Card 2: 1-Year Factory Warranty */}
            <div className="p-8 rounded-[28px] bg-white dark:bg-[#121214] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_12px_36px_-16px_rgba(0,0,0,0.04)] space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                <Wrench className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-[#f5f5f7]">
                1-Year Factory Service Program
              </h3>
              <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                All Papa rotary machines, wireless batteries, and power consoles carry a full 1-year factory warranty covering internal motor assemblies, precision bearings, and power electronics.
              </p>
            </div>
          </div>

          {/* RMA Factory Service Action Callout */}
          <div className="p-8 rounded-[28px] bg-[#f5f5f7] dark:bg-[#1c1c1e] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-xl">
              <div className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                Need Machine Repair or Re-Calibration?
              </div>
              <div className="text-xs text-[#86868b] leading-relaxed">
                Download and complete the official Papa Machine Repair (RMA) form, then enclose it with your apparatus shipment for expert factory service.
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href="https://drive.google.com/file/d/1nMPw2A9x_AwQnlFp0yew_2XNbMBKoiEf/view"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-xs font-medium hover:opacity-88 transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>RMA Form (PDF)</span>
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] text-xs font-medium hover:opacity-80 transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] border border-black/[0.06] dark:border-white/[0.08]"
              >
                <span>Contact Support</span>
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
            ACT 5: Compatible Studio Apparatus (Complete Your Setup)
        ========================================================================= */}
        {complementaryGroups.length > 0 && (
          <section className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">
                  Studio Ecosystem
                </span>
                <h3 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-[#1d1d1f] dark:text-[#f5f5f7]">
                  Complete your setup.
                </h3>
              </div>
              <Link
                to="/products"
                className="text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7] hover:opacity-70 transition-opacity"
              >
                See all products ›
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {complementaryGroups.map(group => (
                <HardwareModelCard key={group.id} group={group} />
              ))}
            </div>
          </section>
        )}

        {/* 6. Mobile Sticky Quick-Buy Bar */}
        {isAvailableForSale && (
          <div
            aria-hidden={!showStickyBuy}
            className={`lg:hidden fixed bottom-0 inset-x-0 z-40 apple-glass-chrome border-t border-black/[0.06] dark:border-white/10 p-3.5 px-5 flex items-center justify-between gap-4 shadow-2xl transition-[transform,opacity] duration-250 ease-[var(--ease-drawer)] motion-reduce:transition-opacity ${
              showStickyBuy
                ? 'translate-y-0 opacity-100 pointer-events-auto'
                : 'translate-y-full opacity-0 pointer-events-none'
            }`}
          >
            <div className="min-w-0">
              <div className="text-xs font-medium text-[#86868b] truncate">
                {selectedVariant?.title && selectedVariant.title !== 'Default Title'
                  ? selectedVariant.title
                  : product.title}
              </div>
              <div className="text-sm font-semibold tabular-nums text-[#1d1d1f] dark:text-[#f5f5f7]">
                ${price.toFixed(2)} {currency}
              </div>
            </div>

            <button
              type="button"
              tabIndex={showStickyBuy ? 0 : -1}
              onClick={handleAddToCart}
              className="px-6 py-3 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] font-medium text-sm flex items-center gap-2 hover:opacity-88 active:scale-[0.97] transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] shrink-0 cursor-pointer"
            >
              {addedAnimation ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Bag</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
