import React, { useEffect, useMemo, useRef, useState } from 'react'
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
  Truck,
  Wrench,
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
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'rma'>('description')
  const [mediaViewMode, setMediaViewMode] = useState<'photo' | '3d'>('photo')
  const [showStickyBuy, setShowStickyBuy] = useState(false)
  const primaryActionRef = useRef<HTMLDivElement>(null)

  const firstVariant = product?.variants?.edges?.[0]?.node || null

  if (handle !== prevHandle) {
    setPrevHandle(handle)
    setActiveImageIndex(0)
    setSelectedVariant(firstVariant)
    setMediaViewMode('photo')
  }

  const selectedVariant =
    selectedVariantState &&
    product?.variants?.edges?.some(e => e.node.id === selectedVariantState.id)
      ? selectedVariantState
      : firstVariant

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
  const hasPlainDescription = Boolean(product.description && product.description.trim().length >= 24)

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
    <div className="py-8 bg-transparent min-h-[100dvh] text-[#1d1d1f] dark:text-[#f5f5f7] pb-28 transition-colors duration-300">
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-[#86868b] mb-8 overflow-x-auto pb-2 scrollbar-none"
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
            {siblingModelGroup && siblingModelGroup.options.length > 1
              ? siblingModelGroup.masterTitle
              : product.title}
          </span>
        </nav>

        {/* 2. Primary 2-Column Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 mb-16 items-start">
          {/* Left Column (6 cols): Specimen Gallery Stage */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-[32px] bg-white dark:bg-[#121214] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.06)] flex items-center justify-center p-8 sm:p-12 group overflow-hidden">

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
                  className="relative z-10 max-h-[86%] max-w-[86%] w-auto object-contain transition-transform duration-300 ease-[var(--ease-out-strong)] group-hover:scale-[1.03] drop-shadow-[0_20px_38px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_24px_48px_rgba(0,0,0,0.65)]"
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

              {/* 3D / 2D Quick Switcher */}
              {has3DModel && (
                <div className="absolute bottom-4 left-4 z-20 flex items-center gap-0.5 p-1 rounded-full bg-[#f5f5f7]/90 dark:bg-[#1c1c1e]/90 backdrop-blur-md text-xs">
                  <button
                    type="button"
                    onClick={() => setMediaViewMode('photo')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-medium text-[11px] transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer ${
                      mediaViewMode === 'photo'
                        ? 'bg-white text-[#1d1d1f] dark:bg-[#2c2c2e] dark:text-white shadow-2xs': 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
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
                        ? 'bg-white text-[#1d1d1f] dark:bg-[#2c2c2e] dark:text-white shadow-2xs': 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                    }`}
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>3D View</span>
                  </button>
                </div>
              )}

              {/* Image Counter */}
              {images.length > 1 && mediaViewMode === 'photo' && (
                <div className="absolute bottom-4 right-4 z-20 px-2.5 py-1 rounded-full bg-[#f5f5f7]/90 dark:bg-[#1c1c1e]/90 text-[11px] font-medium tabular-nums text-[#86868b]">
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
                    className={`aspect-square rounded-2xl border p-2 transition-[transform,border-color,opacity,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.96] overflow-hidden cursor-pointer ${
                      mediaViewMode === 'photo' && activeImageIndex === idx
                        ? 'border-[#1d1d1f] dark:border-white bg-white dark:bg-[#121214]'
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
                        ? 'border-[#1d1d1f] dark:border-white bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-[#f5f5f7]'
                        : 'border-transparent bg-white dark:bg-[#121214] text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                    }`}
                  >
                    <Box className="w-5 h-5" />
                    <span className="text-[9px] font-semibold">
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
                <div className="flex items-center gap-2 text-xs">
                  {selectedVariant?.availableForSale !== false &&
                  product.availableForSale !== false ? (
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium text-xs">
                      In stock and ready to ship
                    </span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400 font-medium text-xs">
                      Sold out
                    </span>
                  )}
                </div>

                {selectedVariant?.sku && (
                  <span className="text-[11px] text-[#86868b]">
                    SKU {selectedVariant.sku}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.032em] text-[#1d1d1f] dark:text-[#f5f5f7] leading-[1.05]">
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

            {/* Price & Quick Spec Highlights */}
            <div className="pt-1 flex flex-col gap-4">
              <div className="shrink-0">
                <div className="text-xs text-[#86868b] mb-0.5">
                  Price
                </div>
                <div className="flex items-baseline gap-2.5 whitespace-nowrap">
                  <span className="text-3xl sm:text-4xl font-semibold tracking-[-0.028em] tabular-nums text-[#1d1d1f] dark:text-[#f5f5f7]">
                    ${price.toFixed(2)}
                  </span>
                  <span className="text-xs text-[#86868b] whitespace-nowrap">
                    {currency} {isCartridge ? '/ Box of 20' : '/ Unit'}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {techProfile.highlights.map(highlight => (
                  <span
                    key={highlight}
                    className="px-3 py-1 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-[11px] font-medium text-[#1d1d1f]/80 dark:text-[#f5f5f7]/80 whitespace-nowrap"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>

            {/* Sibling Hardware Model Switcher (for multi-finish / multi-edition families stored as separate Shopify products) */}
            {siblingModelGroup && siblingModelGroup.options.length > 1 && (
              <div className="pt-2 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                    {siblingModelGroup.swatchLabelPrefix || 'Finish'}:{' '}
                    <strong className="font-normal text-[#86868b]">
                      {activeSiblingOption?.label || product.title}
                    </strong>
                  </span>
                  <span className="text-xs text-[#86868b]">
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
                          className={`group/swatch inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs transition-[transform,background-color,border-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] ${
                            isCurrent
                              ? 'border-[#1d1d1f] dark:border-white bg-white dark:bg-[#121214] text-[#1d1d1f] dark:text-white font-semibold ring-1 ring-[#1d1d1f] dark:ring-white'
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
                              ? 'border-[#1d1d1f] dark:border-white bg-white dark:bg-[#121214] text-[#1d1d1f] dark:text-white font-semibold ring-1 ring-[#1d1d1f] dark:ring-white'
                              : 'border-black/[0.12] dark:border-white/15 bg-white dark:bg-[#121214] text-[#1d1d1f]/85 dark:text-[#f5f5f7]/85 hover:border-black/30 dark:hover:border-white/35'
                          }`}
                        >
                          <span>{opt.label}</span>
                          <span
                            className={`text-[10px] ${
                              isCurrent
                                ? 'text-[#86868b]'
                                : 'text-[#86868b]'
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
                <label className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] block">
                  Size
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
                              ? 'border-[#1d1d1f] dark:border-white bg-white dark:bg-[#121214] text-[#1d1d1f] dark:text-white font-semibold ring-1 ring-[#1d1d1f] dark:ring-white'
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

            {/* Quantity Selector and Order Action Buttons */}
            <div ref={primaryActionRef} className="space-y-3 pt-1">
              <div className="flex items-center gap-3.5">
                {/* Quantity Controls */}
                <div className="flex items-center rounded-full bg-black/[0.05] dark:bg-white/[0.08] overflow-hidden px-1 h-13">
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

                {/* Primary Add to Cart Button */}
                {selectedVariant?.availableForSale !== false &&
                product.availableForSale !== false ? (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 h-13 px-6 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] font-medium text-sm flex items-center justify-center gap-2 hover:opacity-85 active:scale-[0.98] transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] cursor-pointer"
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

              {/* Instant Checkout Button */}
              {selectedVariant?.availableForSale !== false &&
                product.availableForSale !== false && (
                  <button
                    type="button"
                    onClick={() => {
                      handleAddToCart()
                      openCart()
                    }}
                    className="w-full h-12 px-6 rounded-full bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7] transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    <span>Buy Now</span>
                  </button>
                )}
            </div>

            {/* Quality & Assurance Grid */}
            <div className="grid grid-cols-2 gap-3 pt-5 border-t border-black/[0.06] dark:border-white/[0.08] text-xs text-[#86868b]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#86868b] shrink-0" />
                <span>
                  {isCartridge
                    ? '100% EO Gas Sterilized'
                    : category === 'grips'
                    ? 'Precision Depth Calibration'
                    : 'Factory QC Inspected'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#86868b] shrink-0" />
                <span>Global Express Studio Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#86868b] shrink-0" />
                <span>
                  {isCartridge
                    ? 'Medical 316L Surgical Pins'
                    : category === 'grips'
                    ? 'Autoclavable / Sterile Rated'
                    : '1-Year Factory Warranty'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#86868b] shrink-0" />
                <span>14-Day Pro Replacement Pledge</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Engineering Overview, Technical Specifications & RMA Tabs */}
        <section className="mb-20 rounded-[32px] bg-white dark:bg-[#121214] overflow-hidden shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)]">
          <div className="flex justify-center px-4 pt-6 sm:pt-8 overflow-x-auto scrollbar-none">
            <div className="inline-flex items-center gap-1 p-1 rounded-full bg-black/[0.05] dark:bg-white/[0.08] shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('description')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-[color,background-color,box-shadow] duration-150 ease-[var(--ease-out-strong)] shrink-0 cursor-pointer ${
                activeTab === 'description'
                  ? 'bg-white text-[#1d1d1f] dark:bg-[#2c2c2e] dark:text-white shadow-2xs'
                  : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('specs')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-[color,background-color,box-shadow] duration-150 ease-[var(--ease-out-strong)] shrink-0 cursor-pointer ${
                activeTab === 'specs'
                  ? 'bg-white text-[#1d1d1f] dark:bg-[#2c2c2e] dark:text-white shadow-2xs'
                  : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Tech Specs</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('rma')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-[color,background-color,box-shadow] duration-150 ease-[var(--ease-out-strong)] shrink-0 cursor-pointer ${
                activeTab === 'rma'
                  ? 'bg-white text-[#1d1d1f] dark:bg-[#2c2c2e] dark:text-white shadow-2xs'
                  : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Warranty &amp; Service</span>
            </button>
            </div>
          </div>

          {/* Tab 1: Engineering Overview */}
          {activeTab === 'description' && (
            <div className="p-6 sm:p-8 lg:p-10">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-[#1d1d1f] dark:text-[#f5f5f7] mb-6">
                {techProfile.headline}
              </h2>

              {hasRichHtmlDescription ? (
                <div
                  className="product-description-content text-xs sm:text-sm text-[#1d1d1f]/80 dark:text-[#f5f5f7]/80 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeProductHtml(product.descriptionHtml || ''),
                  }}
                />
              ) : hasPlainDescription ? (
                <div className="text-xs sm:text-sm text-[#1d1d1f]/80 dark:text-[#f5f5f7]/80 leading-relaxed space-y-4 max-w-3xl">
                  {(product.description || '').split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-7 text-sm text-[#1d1d1f]/80 dark:text-[#f5f5f7]/80 leading-relaxed space-y-4">
                    {techProfile.summaryParagraphs.map((para, idx) => (
                      <p key={idx}>{para}</p>
                    ))}
                  </div>
                  <div className="lg:col-span-5 p-6 rounded-2xl bg-[#f5f5f7] dark:bg-[#1c1c1e] space-y-3">
                    <div className="text-xs font-medium text-[#86868b]">
                      Key Specs
                    </div>
                    <dl className="space-y-2.5 text-xs">
                      {techProfile.specs.slice(0, 4).map(row => (
                        <div
                          key={row.label}
                          className="flex flex-col sm:flex-row sm:justify-between gap-1 pb-2 border-b border-black/[0.06] dark:border-white/[0.06] last:border-b-0 last:pb-0"
                        >
                          <dt className="text-[#86868b]">{row.label}</dt>
                          <dd className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7] sm:text-right">
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
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-[#1d1d1f] dark:text-[#f5f5f7] mb-6">
                Tech Specs
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-xs">
                {techProfile.specs.map(spec => (
                  <div
                    key={spec.label}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-3 border-b border-black/[0.06] dark:border-white/[0.08]"
                  >
                    <span className="text-[#86868b]">{spec.label}</span>
                    <span className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7] sm:text-right">
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
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-[#1d1d1f] dark:text-[#f5f5f7]">
                Warranty &amp; Service
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="p-6 rounded-2xl bg-[#f5f5f7] dark:bg-[#1c1c1e] space-y-2.5">
                  <div className="flex items-center gap-2 font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                    <ShieldCheck className="w-4 h-4 text-[#1d1d1f] dark:text-[#f5f5f7]" />
                    <span>14-Day Pro Replacement Guarantee</span>
                  </div>
                  <p className="text-[#86868b] leading-relaxed">
                    If your machine or hardware specimen develops any manufacturing defects within
                    14 days of delivery, Papa Tattoo provides an immediate one-to-one replacement
                    or credit adjustment.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#f5f5f7] dark:bg-[#1c1c1e] space-y-2.5">
                  <div className="flex items-center gap-2 font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                    <Wrench className="w-4 h-4 text-[#1d1d1f] dark:text-[#f5f5f7]" />
                    <span>1-Year Factory Service Program</span>
                  </div>
                  <p className="text-[#86868b] leading-relaxed">
                    All Papa rotary machines, wireless batteries, and power supplies carry a full
                    1-year factory warranty covering internal motor drive assemblies, electronics,
                    and precision bearings.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#f5f5f7] dark:bg-[#1c1c1e] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                    Need Machine Repair or Calibration?
                  </div>
                  <div className="text-xs text-[#86868b]">
                    Download and complete the official Papa Machine Repair (RMA) form, then enclose
                    it with your apparatus shipment.
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href="https://drive.google.com/file/d/1nMPw2A9x_AwQnlFp0yew_2XNbMBKoiEf/view"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-xs font-medium hover:opacity-85 transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>RMA Form (PDF)</span>
                  </a>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] text-xs font-medium hover:opacity-80 transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97]"
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
          <section className="pt-4">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
              <h3 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-[#1d1d1f] dark:text-[#f5f5f7]">
                Complete your setup.
              </h3>
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

        {/* 5. Mobile Sticky Quick-Buy Bar — symmetric slide/fade along bottom path with translucent chrome (§7, §12) */}
        {selectedVariant?.availableForSale !== false &&
          product.availableForSale !== false && (
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
                className="px-6 py-3 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] font-medium text-sm flex items-center gap-2 hover:opacity-85 active:scale-[0.97] transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] shrink-0 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{addedAnimation ? 'Added' : 'Add to Bag'}</span>
              </button>
            </div>
          )}
      </div>
    </div>
  )
}
