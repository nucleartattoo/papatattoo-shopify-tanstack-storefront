import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate, useLoaderData } from '@tanstack/react-router'
import { ShopifyProduct, ShopifyVariant } from '../types/shopify'
import { getProductByHandle, getProducts } from '../lib/shopify'
import { useCart } from '../context/CartContext'
import { useLocale } from '../context/LocaleContext'
import { ProductCard } from '../components/product/ProductCard'
import { CartridgeMatrixSelector } from '../components/product/CartridgeMatrixSelector'
import { formatProductImageUrl } from '../utils/imageUrl'
import {
  ChevronRight,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  Zap,
  CheckCircle2,
  Truck,
  RotateCcw,
  Layers,
  Cpu,
  Package,
  FileText,
  Wrench,
  Download,
  Box,
  Image as ImageIcon,
} from 'lucide-react'
import { ModelViewer3D } from '../components/common/ModelViewer3D'

interface ProductDetailPageProps {
  initialProduct?: ShopifyProduct | null
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  initialProduct: propInitialProduct,
}) => {
  const { handle } = useParams({ strict: false }) as { handle: string }
  const loaderData = useLoaderData({ strict: false }) as
    | { product?: ShopifyProduct | null }
    | undefined
  const initialProduct = propInitialProduct || loaderData?.product || null

  const navigate = useNavigate()
  const { addToCart, openCart } = useCart()
  const { locale } = useLocale()

  const has3DModel = Boolean(
    handle && (handle.includes('papa-pen-v2') || handle.includes('papapenv2'))
  )

  const [product, setProduct] = useState<ShopifyProduct | null>(initialProduct)
  const [relatedProducts, setRelatedProducts] = useState<ShopifyProduct[]>([])
  const [loading, setLoading] = useState(!initialProduct)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<ShopifyVariant | null>(
    () => initialProduct?.variants?.edges?.[0]?.node || null,
  )
  const [quantity, setQuantity] = useState(1)
  const [addedAnimation, setAddedAnimation] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'rma'>('description')
  const [mediaViewMode, setMediaViewMode] = useState<'photo' | '3d'>(
    has3DModel ? '3d' : 'photo',
  )
  const [showStickyBuy, setShowStickyBuy] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBuy(window.scrollY > 480)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    let isMounted = true
    async function loadData() {
      if (!handle) return

      if (initialProduct && initialProduct.handle === handle) {
        setProduct(initialProduct)
        if (initialProduct.variants?.edges?.length > 0) {
          setSelectedVariant(initialProduct.variants.edges[0].node)
        }
        setLoading(false)
        try {
          const allProds = await getProducts({ first: 12, language: locale })
          if (isMounted) {
            const others = allProds.filter((p) => p.handle !== handle).slice(0, 4)
            setRelatedProducts(others)
          }
        } catch {}
        return
      }

      setLoading(true)
      try {
        const prod = await getProductByHandle(handle, locale)
        if (isMounted) {
          setProduct(prod)
          if (prod && prod.variants.edges.length > 0) {
            setSelectedVariant(prod.variants.edges[0].node)
          }
          setActiveImageIndex(0)
        }

        // Fetch related products
        const allProds = await getProducts({ first: 12, language: locale })
        if (isMounted) {
          const others = allProds.filter((p) => p.handle !== handle).slice(0, 4)
          setRelatedProducts(others)
        }
      } catch (err) {
        console.error(err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadData()
    return () => {
      isMounted = false
    }
  }, [handle, locale, initialProduct])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-zinc-200 dark:bg-[#151922] rounded-2xl"></div>
          <div className="space-y-6">
            <div className="h-8 bg-zinc-200 dark:bg-[#151922] rounded-sm w-3/4"></div>
            <div className="h-6 bg-zinc-200 dark:bg-[#151922] rounded-sm w-1/4"></div>
            <div className="h-24 bg-zinc-200 dark:bg-[#151922] rounded-xl"></div>
            <div className="h-12 bg-zinc-200 dark:bg-[#151922] rounded-xl"></div>
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
          to="/collections"
          search={{ category: 'all' }}
          className="inline-block mt-6 px-6 py-2.5 rounded-lg bg-zinc-950 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 font-mono font-bold text-xs uppercase"
        >
          Return to Catalog
        </Link>
      </div>
    )
  }

  const images = product.images.edges.map(e => e.node)
  const isPremium = product.title.toLowerCase().includes('premium')
  const isCartridge = product.title.toLowerCase().includes('cartridge') || product.title.toLowerCase().includes('liner')
  const price = selectedVariant
    ? parseFloat(selectedVariant.price.amount)
    : parseFloat(product.priceRange.minVariantPrice.amount)
  const currency = selectedVariant
    ? selectedVariant.price.currencyCode
    : product.priceRange.minVariantPrice.currencyCode

  const handleAddToCart = () => {
    if (!product) return
    const activeVariant: ShopifyVariant = selectedVariant || product.variants.edges[0]?.node || {
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
    <div className="py-8 bg-zinc-50 dark:bg-[#20222a] min-h-screen text-zinc-900 dark:text-zinc-100 font-sans pb-28 transition-colors duration-300 art-aurora-bg">
      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Breadcrumbs - Clean Gallery Path */}
        <nav className="flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400 mb-8 overflow-x-auto pb-2 scrollbar-none">
          <Link to="/" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
            HOME
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600 shrink-0" />
          <Link
            to="/collections"
            search={{ category: isCartridge ? 'needles' : 'all' }}
            className="hover:text-zinc-950 dark:hover:text-white transition-colors shrink-0 uppercase"
          >
            {isCartridge ? 'NEEDLE CARTRIDGES' : 'CATALOG'}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600 shrink-0" />
          <span className="text-zinc-950 dark:text-white font-bold truncate">
            {product.title}
          </span>
        </nav>

        {/* 2. Primary 2-Column Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16 mb-16">
          {/* Left Column: Media Gallery (Apple Pro Sculpture Pedestal) */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full rounded-3xl bg-zinc-100/60 dark:bg-white/[0.03] backdrop-blur-xs flex items-center justify-center p-6 sm:p-10 group overflow-hidden shadow-2xl transition-colors duration-300">
              {/* Volumetric Studio Lighting Halo */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse 70% 60% at 50% 50%, ${
                    isPremium ? 'rgba(230,179,102,0.22)' : 'rgba(56,232,198,0.22)'
                  } 0%, transparent 68%)`,
                }}
              />

              {/* Swiss Datum Markers */}
              <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-1 font-mono text-[9px] text-zinc-400 dark:text-zinc-500 pointer-events-none uppercase tracking-widest">
                <span className="text-[#38e8c6]">+</span>
                <span>DATUM // SPECIMEN QA</span>
              </div>

              <div className="absolute top-3.5 right-3.5 z-20 font-mono text-[9px] text-zinc-400 dark:text-zinc-500 pointer-events-none uppercase tracking-widest">
                TOLERANCE ±0.005mm
              </div>

              {mediaViewMode === '3d' ? (
                <ModelViewer3D
                  src="/models/papapenv2.glb"
                  poster={formatProductImageUrl(images[activeImageIndex]?.url)}
                  alt={product.title}
                  className="w-full h-full"
                />
              ) : images.length > 0 ? (
                <img
                  src={formatProductImageUrl(images[activeImageIndex]?.url)}
                  alt={images[activeImageIndex]?.altText || product.title}
                  className="relative z-10 max-h-[92%] w-auto object-contain drop-shadow-[0_24px_50px_rgba(0,0,0,0.85)] scale-110 group-hover:scale-115 transition-transform duration-700 ease-out"
                  onError={(e) => {
                    const fallback = formatProductImageUrl(images[0]?.url)
                    if (fallback && (e.currentTarget as HTMLImageElement).src !== fallback) {
                      ;(e.currentTarget as HTMLImageElement).src = fallback
                    }
                  }}
                />
              ) : (
                <div className="text-zinc-400 font-mono text-xs">NO ASSET IMAGE</div>
              )}

              {/* Grounded Pedestal Contact Shadow with Specular Reflection Halo */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-3/4 max-w-sm h-6 bg-black/60 dark:bg-black/90 blur-2xl rounded-[100%] pointer-events-none" />
              <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1/2 max-w-xs h-2.5 blur-md rounded-[100%] pointer-events-none"
                style={{ backgroundColor: isPremium ? 'rgba(230,179,102,0.25)' : 'rgba(56,232,198,0.25)' }}
              />

              {/* Badges Over Image */}
              <div className="absolute top-10 left-3.5 flex flex-col gap-2 pointer-events-none z-20">
                {isPremium && (
                  <span className="px-3 py-1 rounded-full bg-amber-500 text-zinc-950 font-mono text-[10px] font-bold uppercase flex items-center gap-1 shadow-lg">
                    <Sparkles className="w-3 h-3" />
                    <span>PAPA PREMIUM SERIES</span>
                  </span>
                )}
                {isCartridge && (
                  <span className="px-3 py-1 rounded-full bg-black/60 text-[#38e8c6] border border-white/10 font-mono text-[10px] font-bold uppercase backdrop-blur-md">
                    MEMBRANE SEALED
                  </span>
                )}
              </div>

              {/* 3D / 2D Quick Switcher */}
              {has3DModel && (
                <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1 p-1 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md border border-zinc-200/80 dark:border-white/15 shadow-xl font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => setMediaViewMode('3d')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-[11px] transition-all cursor-pointer ${
                      mediaViewMode === '3d'
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
                    }`}
                  >
                    <Box className="w-3.5 h-3.5 text-[#38e8c6]" />
                    <span>3D MODEL</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMediaViewMode('photo')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-[11px] transition-all cursor-pointer ${
                      mediaViewMode === 'photo'
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>2D PHOTO</span>
                  </button>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            <div className="grid grid-cols-5 gap-3">
              {has3DModel && (
                <button
                  type="button"
                  onClick={() => setMediaViewMode('3d')}
                  className={`aspect-square rounded-2xl border p-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    mediaViewMode === '3d'
                      ? 'border-[#0d5d50] dark:border-[#38e8c6] bg-zinc-100 dark:bg-white/[0.08] shadow-md text-[#0d5d50] dark:text-[#38e8c6]'
                      : 'border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#262933] text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
                  }`}
                >
                  <Box className="w-5 h-5 text-[#38e8c6] animate-pulse" />
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider">3D Model</span>
                </button>
              )}

              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveImageIndex(idx)
                    setMediaViewMode('photo')
                  }}
                  className={`aspect-square rounded-2xl border p-2 transition-all overflow-hidden cursor-pointer ${
                    mediaViewMode === 'photo' && activeImageIndex === idx
                      ? 'border-[#0d5d50] dark:border-[#38e8c6] bg-zinc-100 dark:bg-white/[0.08] shadow-md'
                      : 'border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#262933] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={formatProductImageUrl(img.url)}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Specimen Data & Ordering Interface */}
          <div className="space-y-6">
            {/* Header / Title / Specimen Identifier */}
            <div className="space-y-2">
              {/* Availability Badge */}
              <div className="flex items-center gap-2 text-xs font-mono">
                {selectedVariant?.availableForSale !== false && product.availableForSale !== false ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-[#0d5d50] dark:bg-[#38e8c6] animate-pulse"></span>
                    <span className="text-[#0d5d50] dark:text-[#38e8c6] font-bold tracking-wider uppercase text-[11px]">
                      IN STOCK · CENTRAL WAREHOUSE DISPATCH
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span className="text-red-500 dark:text-red-400 font-bold tracking-wider uppercase text-[11px]">
                      OUT OF STOCK · CURRENTLY UNAVAILABLE
                    </span>
                  </>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-zinc-950 dark:text-white font-['Montserrat',sans-serif]">
                {product.title}
              </h1>

              <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                APPARATUS REF: {product.handle.toUpperCase()}
              </div>
            </div>

            {/* Price Display */}
            <div className="py-2 flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black font-mono text-zinc-950 dark:text-white">
                ${price.toFixed(2)}
              </span>
              <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                {currency} {isCartridge ? '/ BOX OF 20' : '/ APPARATUS UNIT'}
              </span>
            </div>

            {/* Variant Selector: Matrix 3-Option Selector or Standard Pills */}
            {product.options && product.options.some(o => o.name.toLowerCase() === 'type') ? (
              <CartridgeMatrixSelector
                product={product}
                selectedVariant={selectedVariant}
                onSelectVariant={setSelectedVariant}
              />
            ) : product.variants.edges.length > 1 ? (
              <div className="space-y-2.5 pt-1">
                <label className="text-xs font-mono font-bold uppercase text-zinc-500 dark:text-zinc-400 block">
                  CHOOSE SPECIFICATION / COLORWAY:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.edges.map(({ node: v }) => {
                    const isSelected = selectedVariant?.id === v.id
                    const variantInStock = v.availableForSale !== false
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`relative px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase border transition-all cursor-pointer ${
                          isSelected
                            ? variantInStock
                              ? 'border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950 shadow-md'
                              : 'border-red-500/80 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 shadow-sm'
                            : variantInStock
                            ? 'border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#262933] text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-white/25'
                            : 'border-zinc-200/50 dark:border-white/[0.04] bg-zinc-100/50 dark:bg-white/[0.02] text-zinc-400 dark:text-zinc-600 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <span>{v.title}</span>
                        {!variantInStock && (
                          <span className="ml-1.5 text-[10px] font-normal lowercase tracking-tight text-red-500">
                            (out of stock)
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : null}

            {/* Quantity Selector and Order Action Buttons */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-center gap-4">
                {/* Quantity Controls */}
                <div className="flex items-center border border-zinc-200/80 dark:border-white/[0.08] rounded-full bg-white dark:bg-[#262933] overflow-hidden px-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center text-zinc-500 hover:text-zinc-950 dark:hover:text-white font-mono text-sm transition-colors cursor-pointer active:scale-90"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center text-zinc-500 hover:text-zinc-950 dark:hover:text-white font-mono text-sm transition-colors cursor-pointer active:scale-90"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Primary Add to Cart Button */}
                {selectedVariant?.availableForSale !== false && product.availableForSale !== false ? (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 py-4 px-8 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-xl cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{addedAnimation ? 'ADDED TO ORDER ✓' : 'ADD TO APPARATUS CART'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="flex-1 py-4 px-8 rounded-full bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-not-allowed shadow-none"
                  >
                    <ShoppingBag className="w-4 h-4 opacity-50" />
                    <span>OUT OF STOCK</span>
                  </button>
                )}
              </div>

              {/* Instant Checkout Button */}
              {selectedVariant?.availableForSale !== false && product.availableForSale !== false && (
                <button
                  onClick={() => {
                    handleAddToCart()
                    openCart()
                  }}
                  className="w-full py-3 px-6 rounded-full border border-zinc-200/80 dark:border-white/[0.1] hover:border-zinc-400 dark:hover:border-white/30 bg-zinc-50/50 dark:bg-white/[0.03] font-mono text-xs font-bold uppercase text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>DIRECT SHOPIFY CHECKOUT</span>
                </button>
              )}
            </div>

            {/* Quality & Assurance Grid */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-200/80 dark:border-white/[0.08] text-xs font-mono text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0d5d50] dark:text-[#38e8c6]" />
                <span>{isCartridge ? '100% EO Gas Sterilized' : 'Factory Inspected'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#0d5d50] dark:text-[#38e8c6]" />
                <span>Global Express Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0d5d50] dark:text-[#38e8c6]" />
                <span>{isCartridge ? 'Medical 316L Grade' : 'Studio Grade Apparatus'}</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#0d5d50] dark:text-[#38e8c6]" />
                <span>Official Quality Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Detailed Information, Specifications & RMA Tabs */}
        <section className="mb-16 rounded-3xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#262933] overflow-hidden shadow-sm">
          {/* Tabs Navigation Bar */}
          <div className="flex border-b border-zinc-200/80 dark:border-white/[0.08] bg-zinc-50/70 dark:bg-black/20 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('description')}
              className={`flex items-center gap-2 px-6 py-4 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 cursor-pointer ${
                activeTab === 'description'
                  ? 'border-[#0d5d50] dark:border-[#38e8c6] text-[#0d5d50] dark:text-[#38e8c6] bg-white dark:bg-[#262933]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>DESCRIPTION & APPARATUS OVERVIEW</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('specs')}
              className={`flex items-center gap-2 px-6 py-4 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 cursor-pointer ${
                activeTab === 'specs'
                  ? 'border-[#0d5d50] dark:border-[#38e8c6] text-[#0d5d50] dark:text-[#38e8c6] bg-white dark:bg-[#262933]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>TECHNICAL SPECIFICATIONS & BIOCOMPATIBILITY</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('rma')}
              className={`flex items-center gap-2 px-6 py-4 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 cursor-pointer ${
                activeTab === 'rma'
                  ? 'border-[#0d5d50] dark:border-[#38e8c6] text-[#0d5d50] dark:text-[#38e8c6] bg-white dark:bg-[#262933]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>WARRANTY & FACTORY RMA SERVICE</span>
            </button>
          </div>

          {/* Tab 1: Description & Overview */}
          {activeTab === 'description' && (
            <div className="p-6 sm:p-8">
              <div className="text-[11px] font-mono font-bold tracking-widest text-[#0d9488] dark:text-[#2EE6CA] uppercase mb-2">
                APPARATUS PROFILE & TECHNICAL OVERVIEW
              </div>
              <h2 className="text-xl font-black uppercase text-zinc-950 dark:text-white mb-6">
                ENGINEERING DOCUMENTATION & USAGE
              </h2>

              {product.descriptionHtml ? (
                <div
                  className="product-description-content text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                />
              ) : product.description ? (
                <div className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed space-y-4">
                  {product.description.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              ) : (
                <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed space-y-3">
                  <p>
                    Professional tattoo apparatus engineered for high performance studio reliability. Precision CNC-machined from aircraft-grade aluminum alloy and surgical stainless steel for consistent daily studio performance.
                  </p>
                  <p>
                    Designed by tattooists for tattooists, balancing ergonomic weight distribution with low-vibration acoustic dampening.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Technical Specs */}
          {activeTab === 'specs' && (
            <div className="p-6 sm:p-8">
              <div className="text-[11px] font-mono font-bold tracking-widest text-[#0d9488] dark:text-[#2EE6CA] uppercase mb-2">
                ENGINEERING SPECIFICATION SHEET
              </div>
              <h2 className="text-xl font-black uppercase text-zinc-950 dark:text-white mb-6">
                TECHNICAL CHARACTERISTICS & BIOCOMPATIBILITY
              </h2>

              {isCartridge ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2.5 border-b border-zinc-100 dark:border-[#1C2028]">
                      <span className="text-zinc-400">PIN METALLURGY</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        {isPremium ? 'Japanese 316L Surgical Stainless Steel' : 'Medical 304 Surgical Grade'}
                      </span>
                    </div>
                    <div className="flex justify-between py-2.5 border-b border-zinc-100 dark:border-[#1C2028]">
                      <span className="text-zinc-400">MEMBRANE SYSTEM</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        Micro-stabilized Poly-Elastomer Anti-Backflow
                      </span>
                    </div>
                    <div className="flex justify-between py-2.5 border-b border-zinc-100 dark:border-[#1C2028]">
                      <span className="text-zinc-400">CASING PROFILE</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        Optical-grade transparent polycarbonate
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between py-2.5 border-b border-zinc-100 dark:border-[#1C2028]">
                      <span className="text-zinc-400">STERILIZATION METHOD</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        Ethylene Oxide (EO) Gas Blister Sealed
                      </span>
                    </div>
                    <div className="flex justify-between py-2.5 border-b border-zinc-100 dark:border-[#1C2028]">
                      <span className="text-zinc-400">UNIVERSAL FIT</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        Cheyenne, Bishop, FK Irons & all Rotary Pens
                      </span>
                    </div>
                    <div className="flex justify-between py-2.5 border-b border-zinc-100 dark:border-[#1C2028]">
                      <span className="text-zinc-400">PRODUCTION AUDIT</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        Factory Batch Quality Inspection
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2.5 border-b border-zinc-100 dark:border-[#1C2028]">
                      <span className="text-zinc-400">CHASSIS MATERIAL</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        6061-T6 Aircraft Grade Anodized Alloy
                      </span>
                    </div>
                    <div className="flex justify-between py-2.5 border-b border-zinc-100 dark:border-[#1C2028]">
                      <span className="text-zinc-400">DRIVE SYSTEM</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        Precision Coreless Direct Drive Motor
                      </span>
                    </div>
                    <div className="flex justify-between py-2.5 border-b border-zinc-100 dark:border-[#1C2028]">
                      <span className="text-zinc-400">STROKE OPTIONS</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        3.5mm / 4.0mm / 4.5mm Interchangeable
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between py-2.5 border-b border-zinc-100 dark:border-[#1C2028]">
                      <span className="text-zinc-400">OPERATING VOLTAGE</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        5.0V – 12.0V DC Optimal Working Range
                      </span>
                    </div>
                    <div className="flex justify-between py-2.5 border-b border-zinc-100 dark:border-[#1C2028]">
                      <span className="text-zinc-400">CONNECTION INTERFACE</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        Gold-Plated RCA Low-Resistance Terminal
                      </span>
                    </div>
                    <div className="flex justify-between py-2.5 border-b border-zinc-100 dark:border-[#1C2028]">
                      <span className="text-zinc-400">QUALITY ASSURANCE</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        100% Factory Tested & Calibrated
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Warranty & RMA Factory Service */}
          {activeTab === 'rma' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="text-[11px] font-mono font-bold tracking-widest text-[#0d9488] dark:text-[#2EE6CA] uppercase mb-1">
                POST-DISPATCH SUPPORT & QUALITY PLEDGE
              </div>
              <h2 className="text-xl font-black uppercase text-zinc-950 dark:text-white mb-2">
                WARRANTY COVERAGE & FACTORY REPAIR (RMA)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
                <div className="p-4 rounded-xl border border-zinc-200/70 dark:border-zinc-800/70 bg-zinc-50/50 dark:bg-[#13161D] space-y-3">
                  <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white uppercase">
                    <ShieldCheck className="w-4 h-4 text-[#0d9488] dark:text-[#2EE6CA]" />
                    <span>14-DAY PRO REPLACEMENT GUARANTEE</span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                    If your machine or hardware specimen develops any manufacturing defects within 14 days of delivery, Papa Tattoo provides an immediate one-to-one replacement or credit adjustment.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-zinc-200/70 dark:border-zinc-800/70 bg-zinc-50/50 dark:bg-[#13161D] space-y-3">
                  <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white uppercase">
                    <Wrench className="w-4 h-4 text-[#0d9488] dark:text-[#2EE6CA]" />
                    <span>1-YEAR FACTORY SERVICE PROGRAM</span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                    All Papa rotary machines, wireless batteries, and power supplies carry a full 1-year factory warranty covering internal motor drive assemblies, electronics, and precision bearings.
                  </p>
                </div>
              </div>

              {/* Official RMA Form Download Banner */}
              <div className="p-5 rounded-xl border border-teal-500/20 bg-teal-50/50 dark:bg-[#112022]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-mono font-bold text-[#0d9488] dark:text-[#2EE6CA] uppercase">
                    NEED MACHINE REPAIR OR SERVICE?
                  </div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-300 font-sans">
                    Download and complete the official Papa Machine Repair (RMA) form, then enclose it with your apparatus shipment.
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href="https://drive.google.com/file/d/1nMPw2A9x_AwQnlFp0yew_2XNbMBKoiEf/view"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-950 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 text-xs font-mono font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download RMA Form (PDF)</span>
                  </a>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-zinc-200/70 dark:border-zinc-800/70 bg-white dark:bg-[#12151B] text-zinc-700 dark:text-zinc-300 text-xs font-mono font-bold uppercase hover:text-[#0d9488] dark:hover:text-[#2EE6CA] transition-colors"
                  >
                    <span>Contact Support</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 4. Related Apparatus Complements */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-zinc-200/80 dark:border-white/[0.08] pt-14">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="text-[10px] font-mono font-bold tracking-widest text-[#0d5d50] dark:text-[#38e8c6] uppercase">
                  STUDIO COMPATIBILITY
                </div>
                <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-zinc-950 dark:text-white font-['Montserrat',sans-serif]">
                  SUGGESTED APPARATUS COMPLEMENTS
                </h3>
              </div>
              <Link
                to="/collections"
                search={{ category: 'all' }}
                className="text-xs font-mono font-bold uppercase text-[#0d5d50] dark:text-[#38e8c6] hover:underline"
              >
                View Full Catalog →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* 5. Mobile Sticky Quick-Buy Bar */}
        {showStickyBuy && selectedVariant?.availableForSale !== false && product.availableForSale !== false && (
          <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#1c1e24]/95 backdrop-blur-xl border-t border-zinc-200/80 dark:border-white/10 p-3.5 px-5 flex items-center justify-between gap-4 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="min-w-0">
              <div className="text-xs font-bold text-zinc-950 dark:text-white truncate font-sans">
                {selectedVariant?.title && selectedVariant.title !== 'Default Title' ? selectedVariant.title : product.title}
              </div>
              <div className="text-sm font-black font-mono text-[#0d5d50] dark:text-[#38e8c6]">
                ${price.toFixed(2)} {currency}
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="px-6 py-3 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-mono font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md shrink-0 cursor-pointer"
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
