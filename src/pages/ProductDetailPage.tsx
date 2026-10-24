import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLoaderData, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ShopifyProduct, ShopifyVariant } from '../types/shopify'
import { catalogQueryOptions, productByHandleQueryOptions } from '../lib/catalog.queries'
import { useCart } from '../context/CartContext'
import { CartridgeMatrixSelector } from '../components/product/CartridgeMatrixSelector'
import { HardwareModelCard } from '../components/product/HardwareLineupModules'
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
  CheckCircle2,
  ChevronRight,
  Cpu,
  Download,
  FileText,
  Image as ImageIcon,
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

  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<ShopifyVariant | null>(
    () => product?.variants?.edges?.[0]?.node || null
  )
  const [quantity, setQuantity] = useState(1)
  const [addedAnimation, setAddedAnimation] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'rma'>('description')
  const [mediaViewMode, setMediaViewMode] = useState<'photo' | '3d'>('photo')
  const [showStickyBuy, setShowStickyBuy] = useState(false)

  useEffect(() => {
    setActiveImageIndex(0)
    setSelectedVariant(product?.variants?.edges?.[0]?.node || null)
    setMediaViewMode('photo')
  }, [handle, product?.id])

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBuy(window.scrollY > 480)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
          <div className="aspect-square bg-zinc-200 dark:bg-[#151922] rounded-2xl" />
          <div className="space-y-6">
            <div className="h-8 bg-zinc-200 dark:bg-[#151922] rounded-sm w-3/4" />
            <div className="h-6 bg-zinc-200 dark:bg-[#151922] rounded-sm w-1/4" />
            <div className="h-24 bg-zinc-200 dark:bg-[#151922] rounded-xl" />
            <div className="h-12 bg-zinc-200 dark:bg-[#151922] rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-2xl font-black uppercase text-zinc-900 dark:text-white">
          Apparatus Specimen Not Found
        </h2>
        <p className="text-xs text-zinc-500 mt-2">
          The requested hardware item may have been archived or repositioned.
        </p>
        <Link
          to="/products"
          className="inline-block mt-6 px-6 py-2.5 rounded-lg bg-zinc-950 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 font-mono font-bold text-xs uppercase"
        >
          Return to Hardware Lineup
        </Link>
      </div>
    )
  }

  const images = product.images?.edges?.map(e => e.node) || []
  const category = classifyApparatusCategory(product)
  const breadcrumbMeta = CATEGORY_BREADCRUMB_META[category]
  const techProfile = getHardwareTechnicalProfile(product)
  const hasRichHtmlDescription = hasMeaningfulHtmlText(product.descriptionHtml)
  const hasPlainDescription = Boolean(product.description && product.description.trim().length >= 24)

  const isPremium = product.title.toLowerCase().includes('premium')
  const isCartridge = category === 'cartridges'
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

  return (
    <div className="py-8 bg-zinc-50 dark:bg-[#14161b] min-h-[100dvh] text-zinc-900 dark:text-zinc-100 font-sans pb-28 transition-colors duration-300">
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400 mb-8 overflow-x-auto pb-2 scrollbar-none"
        >
          <Link to="/" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
            HOME
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600 shrink-0" />
          <Link
            to="/products"
            className="hover:text-zinc-950 dark:hover:text-white transition-colors shrink-0"
          >
            HARDWARE LINEUP
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600 shrink-0" />
          <Link
            to="/collections"
            search={{ category: breadcrumbMeta.collectionParam }}
            className="hover:text-zinc-950 dark:hover:text-white transition-colors shrink-0 uppercase"
          >
            {breadcrumbMeta.label}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600 shrink-0" />
          <span className="text-zinc-950 dark:text-white font-bold truncate">
            {siblingModelGroup && siblingModelGroup.options.length > 1
              ? siblingModelGroup.masterTitle
              : product.title}
          </span>
        </nav>

        {/* 2. Primary 2-Column Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 mb-16 items-start">
          {/* Left Column (6 cols): Specimen Gallery Stage */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#1c1e24] flex items-center justify-center p-8 sm:p-12 group overflow-hidden">
              {/* Subtle radial studio spotlight */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 45%, ${
                    isPremium ? 'rgba(245,158,11,0.12)' : 'rgba(56,232,198,0.10)'
                  } 0%, transparent 68%)`,
                }}
              />

              {/* Top Header Bar Inside Stage */}
              <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-white/90 dark:bg-black/60 border border-zinc-200/80 dark:border-white/10 font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 backdrop-blur-md">
                    {breadcrumbMeta.label}
                  </span>
                  {isPremium && (
                    <span className="px-2.5 py-1 rounded-md bg-amber-500 text-zinc-950 font-mono text-[10px] font-bold uppercase flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-3 h-3" />
                      <span>316L Flagship</span>
                    </span>
                  )}
                </div>

                {activeSiblingOption && (
                  <span className="px-2.5 py-1 rounded-md bg-white/90 dark:bg-black/60 border border-zinc-200/80 dark:border-white/10 font-mono text-[10px] font-bold uppercase tracking-wider text-[#0d5d50] dark:text-[#38e8c6] backdrop-blur-md">
                    {activeSiblingOption.label}
                  </span>
                )}
              </div>

              {mediaViewMode === '3d' && has3DModel ? (
                <ModelViewer3D
                  src="/models/papapenv2.glb"
                  poster={formatProductImageUrl(images[activeImageIndex]?.url)}
                  alt={product.title}
                  className="w-full h-full"
                />
              ) : images.length > 0 ? (
                <img
                  key={`${product.handle}-${activeImageIndex}`}
                  src={formatProductImageUrl(images[activeImageIndex]?.url)}
                  alt={images[activeImageIndex]?.altText || product.title}
                  className="relative z-10 max-h-[86%] max-w-[86%] w-auto object-contain transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  onError={e => {
                    const image = e.currentTarget
                    const fallback = images[activeImageIndex]?.url
                    if (fallback && image.src !== fallback) {
                      image.src = fallback
                    }
                  }}
                />
              ) : (
                <div className="text-zinc-400 font-mono text-xs">NO SPECIMEN IMAGE</div>
              )}

              {/* 3D / 2D Quick Switcher */}
              {has3DModel && (
                <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1 p-1 rounded-lg bg-white/90 dark:bg-black/80 backdrop-blur-md border border-zinc-200/80 dark:border-white/15 shadow-sm font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => setMediaViewMode('photo')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold text-[11px] transition-all cursor-pointer ${
                      mediaViewMode === 'photo'
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                        : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>STUDIO PHOTO</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaViewMode('3d')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold text-[11px] transition-all cursor-pointer ${
                      mediaViewMode === '3d'
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                        : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
                    }`}
                  >
                    <Box className="w-3.5 h-3.5 text-[#0d5d50] dark:text-[#38e8c6]" />
                    <span>INTERACTIVE 3D</span>
                  </button>
                </div>
              )}

              {/* Image Counter */}
              {images.length > 1 && mediaViewMode === 'photo' && (
                <div className="absolute bottom-4 right-4 z-20 px-2.5 py-1 rounded-md bg-white/85 dark:bg-black/65 border border-zinc-200/80 dark:border-white/10 font-mono text-[10px] font-bold text-zinc-600 dark:text-zinc-300">
                  {activeImageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
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
                    className={`aspect-square rounded-xl border p-2 transition-all overflow-hidden cursor-pointer ${
                      mediaViewMode === 'photo' && activeImageIndex === idx
                        ? 'border-zinc-950 dark:border-[#38e8c6] bg-white dark:bg-[#222631] ring-2 ring-zinc-950/10 dark:ring-[#38e8c6]/20'
                        : 'border-zinc-200/80 dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#1c1e24] opacity-75 hover:opacity-100'
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
                    className={`aspect-square rounded-xl border p-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      mediaViewMode === '3d'
                        ? 'border-zinc-950 dark:border-[#38e8c6] bg-white dark:bg-[#222631] text-[#0d5d50] dark:text-[#38e8c6]'
                        : 'border-zinc-200/80 dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#1c1e24] text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
                    }`}
                  >
                    <Box className="w-5 h-5 text-[#0d5d50] dark:text-[#38e8c6]" />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider">
                      3D View
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Column (6 cols): Specimen Data & Ordering Console */}
          <div className="lg:col-span-6 space-y-6">
            {/* Availability + Title + Engineering Spec Line */}
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-mono">
                  {selectedVariant?.availableForSale !== false &&
                  product.availableForSale !== false ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-[#0d5d50] dark:text-[#38e8c6] font-bold tracking-wider uppercase text-[11px]">
                        IN STOCK · READY FOR STUDIO DISPATCH
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-red-600 dark:text-red-400 font-bold tracking-wider uppercase text-[11px]">
                        CURRENTLY SOLD OUT
                      </span>
                    </>
                  )}
                </div>

                <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 uppercase">
                  SKU REF: {product.handle}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-zinc-950 dark:text-white font-['Montserrat',sans-serif] leading-[1.08]">
                {product.title}
              </h1>

              <p className="text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400">
                {siblingModelGroup?.specLine || techProfile.headline}
              </p>
            </div>

            {/* Price & Quick Spec Highlights */}
            <div className="p-4 sm:p-5 rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-0.5">
                  OFFICIAL STUDIO PRICE
                </div>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl sm:text-4xl font-black font-mono text-zinc-950 dark:text-white">
                    ${price.toFixed(2)}
                  </span>
                  <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase">
                    {currency} {isCartridge ? '/ Box of 20' : '/ Unit'}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 sm:justify-end">
                {techProfile.highlights.map(highlight => (
                  <span
                    key={highlight}
                    className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200/70 dark:border-white/[0.08] font-mono text-[10px] font-bold text-zinc-700 dark:text-zinc-300"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>

            {/* Sibling Hardware Model Switcher (for multi-finish / multi-edition families stored as separate Shopify products) */}
            {siblingModelGroup && siblingModelGroup.options.length > 1 && (
              <div className="p-4 sm:p-5 rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    {siblingModelGroup.swatchLabelPrefix || 'Finish'}:{' '}
                    <strong className="text-zinc-950 dark:text-white">
                      {activeSiblingOption?.label || product.title}
                    </strong>
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                    {siblingModelGroup.options.length} {siblingModelGroup.swatchLabelPrefix || 'Finish'} Options
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
                          className={`group/swatch inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-mono transition-all ${
                            isCurrent
                              ? 'border-zinc-950 dark:border-[#38e8c6] bg-zinc-950 text-white dark:bg-[#38e8c6]/15 dark:text-white font-bold shadow-xs'
                              : 'border-zinc-200/80 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.03] text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-white/25'
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
                            <span className="text-[9px] uppercase text-red-500 font-normal">
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
                          className={`px-3.5 py-2.5 rounded-xl border text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 ${
                            isCurrent
                              ? 'border-zinc-950 bg-zinc-950 text-white dark:border-[#38e8c6] dark:bg-[#38e8c6] dark:text-zinc-950 shadow-xs'
                              : 'border-zinc-200/80 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.03] text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-white/25'
                          }`}
                        >
                          <span>{opt.label}</span>
                          <span
                            className={`text-[10px] ${
                              isCurrent
                                ? 'text-zinc-300 dark:text-zinc-800'
                                : 'text-zinc-400 dark:text-zinc-500'
                            }`}
                          >
                            ${optPrice.toFixed(2)}
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Variant Selector: Matrix 3-Option Selector or Standard Pills */}
            {product.options && product.options.some(o => o.name.toLowerCase() === 'type') ? (
              <CartridgeMatrixSelector
                product={product}
                selectedVariant={selectedVariant}
                onSelectVariant={handleSelectVariant}
              />
            ) : product.variants?.edges && product.variants.edges.length > 1 ? (
              <div className="space-y-2.5 pt-1">
                <label className="text-xs font-mono font-bold uppercase text-zinc-500 dark:text-zinc-400 block">
                  CHOOSE SPECIFICATION / SIZE:
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
                        className={`relative px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase border transition-all cursor-pointer ${
                          isSelected
                            ? variantInStock
                              ? 'border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950 shadow-sm'
                              : 'border-red-500/80 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300'
                            : variantInStock
                            ? 'border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-white/25'
                            : 'border-zinc-200/50 dark:border-white/[0.04] bg-zinc-100/50 dark:bg-white/[0.02] text-zinc-400 dark:text-zinc-600 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <span>{v.title}</span>
                        {!variantInStock && (
                          <span className="ml-1.5 text-[10px] font-normal lowercase tracking-tight text-red-500">
                            (sold out)
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : null}

            {/* Quantity Selector and Order Action Buttons */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-3.5">
                {/* Quantity Controls */}
                <div className="flex items-center border border-zinc-200/80 dark:border-white/[0.1] rounded-xl bg-white dark:bg-[#1c1e24] overflow-hidden px-1 h-13">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-full flex items-center justify-center text-zinc-500 hover:text-zinc-950 dark:hover:text-white font-mono text-base transition-colors cursor-pointer active:scale-90"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-full flex items-center justify-center text-zinc-500 hover:text-zinc-950 dark:hover:text-white font-mono text-base transition-colors cursor-pointer active:scale-90"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Primary Add to Cart Button */}
                {selectedVariant?.availableForSale !== false &&
                product.availableForSale !== false ? (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 h-13 px-6 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      {addedAnimation
                        ? 'ADDED TO ORDER ✓'
                        : `ADD TO CART · $${(price * quantity).toFixed(2)}`}
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="flex-1 h-13 px-6 rounded-xl bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <ShoppingBag className="w-4 h-4 opacity-50" />
                    <span>OUT OF STOCK</span>
                  </button>
                )}
              </div>

              {/* Instant Checkout Button */}
              {selectedVariant?.availableForSale !== false &&
                product.availableForSale !== false && (
                  <button
                    type="button"
                    onClick={() => {
                      handleAddToCart()
                      openCart()
                    }}
                    className="w-full py-3 px-6 rounded-xl border border-zinc-200/80 dark:border-white/[0.1] hover:border-zinc-400 dark:hover:border-white/30 bg-white dark:bg-[#1c1e24] font-mono text-xs font-bold uppercase text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>DIRECT SHOPIFY CHECKOUT</span>
                  </button>
                )}
            </div>

            {/* Quality & Assurance Grid */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-200/80 dark:border-white/[0.08] text-xs font-mono text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0d5d50] dark:text-[#38e8c6] shrink-0" />
                <span>
                  {isCartridge
                    ? '100% EO Gas Sterilized'
                    : category === 'grips'
                    ? 'Precision Depth Calibration'
                    : 'Factory QC Inspected'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#0d5d50] dark:text-[#38e8c6] shrink-0" />
                <span>Global Express Studio Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0d5d50] dark:text-[#38e8c6] shrink-0" />
                <span>
                  {isCartridge
                    ? 'Medical 316L Surgical Pins'
                    : category === 'grips'
                    ? 'Autoclavable / Sterile Rated'
                    : '1-Year Factory Warranty'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#0d5d50] dark:text-[#38e8c6] shrink-0" />
                <span>14-Day Pro Replacement Pledge</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Engineering Overview, Technical Specifications & RMA Tabs */}
        <section className="mb-16 rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] overflow-hidden">
          <div className="flex border-b border-zinc-200/80 dark:border-white/[0.08] bg-zinc-50/80 dark:bg-black/20 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('description')}
              className={`flex items-center gap-2 px-6 py-4 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 cursor-pointer ${
                activeTab === 'description'
                  ? 'border-[#0d5d50] dark:border-[#38e8c6] text-[#0d5d50] dark:text-[#38e8c6] bg-white dark:bg-[#1c1e24]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>ENGINEERING OVERVIEW</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('specs')}
              className={`flex items-center gap-2 px-6 py-4 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 cursor-pointer ${
                activeTab === 'specs'
                  ? 'border-[#0d5d50] dark:border-[#38e8c6] text-[#0d5d50] dark:text-[#38e8c6] bg-white dark:bg-[#1c1e24]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>TECHNICAL SPECIFICATIONS ({techProfile.specs.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('rma')}
              className={`flex items-center gap-2 px-6 py-4 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 cursor-pointer ${
                activeTab === 'rma'
                  ? 'border-[#0d5d50] dark:border-[#38e8c6] text-[#0d5d50] dark:text-[#38e8c6] bg-white dark:bg-[#1c1e24]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>WARRANTY & FACTORY RMA</span>
            </button>
          </div>

          {/* Tab 1: Engineering Overview */}
          {activeTab === 'description' && (
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="text-[11px] font-mono font-bold tracking-widest text-[#0d5d50] dark:text-[#38e8c6] uppercase mb-1.5">
                {techProfile.eyebrow}
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-zinc-950 dark:text-white mb-6 font-['Montserrat',sans-serif]">
                {techProfile.headline}
              </h2>

              {hasRichHtmlDescription ? (
                <div
                  className="product-description-content text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeProductHtml(product.descriptionHtml || ''),
                  }}
                />
              ) : hasPlainDescription ? (
                <div className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed space-y-4 max-w-3xl">
                  {(product.description || '').split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-7 text-sm text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed space-y-4">
                    {techProfile.summaryParagraphs.map((para, idx) => (
                      <p key={idx}>{para}</p>
                    ))}
                  </div>
                  <div className="lg:col-span-5 p-5 rounded-xl border border-zinc-200/80 dark:border-white/[0.08] bg-zinc-50/70 dark:bg-black/20 space-y-3">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0d5d50] dark:text-[#38e8c6]">
                      KEY APPARATUS PARAMETERS
                    </div>
                    <dl className="space-y-2.5 text-xs font-mono">
                      {techProfile.specs.slice(0, 4).map(row => (
                        <div
                          key={row.label}
                          className="flex flex-col sm:flex-row sm:justify-between gap-1 pb-2 border-b border-zinc-200/60 dark:border-white/[0.06] last:border-b-0 last:pb-0"
                        >
                          <dt className="text-zinc-400">{row.label}</dt>
                          <dd className="font-bold text-zinc-900 dark:text-zinc-100 sm:text-right">
                            {row.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Category-Accurate Technical Specifications */}
          {activeTab === 'specs' && (
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="text-[11px] font-mono font-bold tracking-widest text-[#0d5d50] dark:text-[#38e8c6] uppercase mb-1.5">
                {techProfile.eyebrow}
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-zinc-950 dark:text-white mb-6 font-['Montserrat',sans-serif]">
                TECHNICAL SPECIFICATION SHEET
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-xs font-mono">
                {techProfile.specs.map(spec => (
                  <div
                    key={spec.label}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-3 border-b border-zinc-200/70 dark:border-white/[0.08]"
                  >
                    <span className="text-zinc-400 dark:text-zinc-500">{spec.label}</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 sm:text-right">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Warranty & RMA Factory Service */}
          {activeTab === 'rma' && (
            <div className="p-6 sm:p-8 lg:p-10 space-y-6">
              <div>
                <div className="text-[11px] font-mono font-bold tracking-widest text-[#0d5d50] dark:text-[#38e8c6] uppercase mb-1">
                  POST-DISPATCH SUPPORT & QUALITY PLEDGE
                </div>
                <h2 className="text-xl sm:text-2xl font-black uppercase text-zinc-950 dark:text-white font-['Montserrat',sans-serif]">
                  WARRANTY COVERAGE & FACTORY REPAIR (RMA)
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
                <div className="p-5 rounded-xl border border-zinc-200/80 dark:border-white/[0.08] bg-zinc-50/60 dark:bg-black/20 space-y-2.5">
                  <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white uppercase">
                    <ShieldCheck className="w-4 h-4 text-[#0d5d50] dark:text-[#38e8c6]" />
                    <span>14-DAY PRO REPLACEMENT GUARANTEE</span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                    If your machine or hardware specimen develops any manufacturing defects within
                    14 days of delivery, Papa Tattoo provides an immediate one-to-one replacement
                    or credit adjustment.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-zinc-200/80 dark:border-white/[0.08] bg-zinc-50/60 dark:bg-black/20 space-y-2.5">
                  <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white uppercase">
                    <Wrench className="w-4 h-4 text-[#0d5d50] dark:text-[#38e8c6]" />
                    <span>1-YEAR FACTORY SERVICE PROGRAM</span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                    All Papa rotary machines, wireless batteries, and power supplies carry a full
                    1-year factory warranty covering internal motor drive assemblies, electronics,
                    and precision bearings.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-zinc-200/80 dark:border-white/[0.08] bg-zinc-50/80 dark:bg-black/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6] uppercase">
                    NEED MACHINE REPAIR OR CALIBRATION?
                  </div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-300 font-sans">
                    Download and complete the official Papa Machine Repair (RMA) form, then enclose
                    it with your apparatus shipment.
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href="https://drive.google.com/file/d/1nMPw2A9x_AwQnlFp0yew_2XNbMBKoiEf/view"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 text-xs font-mono font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download RMA Form (PDF)</span>
                  </a>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-[#1c1e24] text-zinc-700 dark:text-zinc-300 text-xs font-mono font-bold uppercase hover:text-[#0d5d50] dark:hover:text-[#38e8c6] transition-colors"
                  >
                    <span>Contact Support</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 4. Complementary Studio Apparatus (Consolidated HardwareModelCards) */}
        {complementaryGroups.length > 0 && (
          <section className="border-t border-zinc-200/80 dark:border-white/[0.08] pt-14">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="text-[10px] font-mono font-bold tracking-widest text-[#0d5d50] dark:text-[#38e8c6] uppercase">
                  STUDIO COMPATIBILITY
                </div>
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-zinc-950 dark:text-white font-['Montserrat',sans-serif]">
                  COMPLEMENTARY STUDIO APPARATUS
                </h3>
              </div>
              <Link
                to="/products"
                className="text-xs font-mono font-bold uppercase text-[#0d5d50] dark:text-[#38e8c6] hover:underline"
              >
                Explore All 26 Families →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {complementaryGroups.map(group => (
                <HardwareModelCard key={group.id} group={group} />
              ))}
            </div>
          </section>
        )}

        {/* 5. Mobile Sticky Quick-Buy Bar */}
        {showStickyBuy &&
          selectedVariant?.availableForSale !== false &&
          product.availableForSale !== false && (
            <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#1c1e24]/95 backdrop-blur-xl border-t border-zinc-200/80 dark:border-white/10 p-3.5 px-5 flex items-center justify-between gap-4 shadow-2xl">
              <div className="min-w-0">
                <div className="text-xs font-bold text-zinc-950 dark:text-white truncate font-sans">
                  {selectedVariant?.title && selectedVariant.title !== 'Default Title'
                    ? selectedVariant.title
                    : product.title}
                </div>
                <div className="text-sm font-black font-mono text-[#0d5d50] dark:text-[#38e8c6]">
                  ${price.toFixed(2)} {currency}
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="px-6 py-3 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 font-mono font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shrink-0 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{addedAnimation ? 'ADDED ✓' : 'ADD TO CART'}</span>
              </button>
            </div>
          )}
      </div>
    </div>
  )
}
