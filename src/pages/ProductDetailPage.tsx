import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from '@tanstack/react-router'
import { ShopifyProduct, ShopifyVariant } from '../types/shopify'
import { getProductByHandle, getProducts } from '../lib/shopify'
import { useCart } from '../context/CartContext'
import { useLocale } from '../context/LocaleContext'
import { ProductCard } from '../components/product/ProductCard'
import { CartridgeMatrixSelector } from '../components/product/CartridgeMatrixSelector'
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

export const ProductDetailPage: React.FC = () => {
  const { handle } = useParams({ strict: false }) as { handle: string }
  const navigate = useNavigate()
  const { addToCart, openCart } = useCart()
  const { locale } = useLocale()

  const [product, setProduct] = useState<ShopifyProduct | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<ShopifyProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<ShopifyVariant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [addedAnimation, setAddedAnimation] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'rma'>('description')
  const [mediaViewMode, setMediaViewMode] = useState<'photo' | '3d'>('photo')

  const has3DModel = Boolean(
    handle && (handle.includes('pen') || handle.includes('machine') || product?.productType?.toLowerCase().includes('machine'))
  )

  useEffect(() => {
    let isMounted = true
    async function loadData() {
      if (!handle) return
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
          const others = allProds.filter(p => p.handle !== handle).slice(0, 4)
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
  }, [handle, locale])

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
    <div className="py-8 bg-zinc-50 dark:bg-[#090A0C] min-h-screen text-zinc-900 dark:text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-8 overflow-x-auto pb-2 scrollbar-none">
          <Link to="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            HOME
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <Link
            to="/collections"
            search={{ category: isCartridge ? 'needles' : 'all' }}
            className="hover:text-zinc-900 dark:hover:text-white transition-colors shrink-0"
          >
            {isCartridge ? 'NEEDLE CARTRIDGES' : 'CATALOG'}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span className="text-zinc-900 dark:text-[#2EE6CA] font-bold truncate">
            {product.title}
          </span>
        </nav>

        {/* 2. Primary 2-Column Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column: Media Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#12151B] flex items-center justify-center p-8 group">
              {mediaViewMode === '3d' ? (
                <ModelViewer3D
                  src="/models/papapenv2.glb"
                  poster={images[activeImageIndex]?.url}
                  alt={product.title}
                  className="w-full h-full"
                />
              ) : images.length > 0 ? (
                <img
                  src={images[activeImageIndex]?.url || '/slides/slide_2_premium_cartridges.png'}
                  alt={images[activeImageIndex]?.altText || product.title}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/slides/slide_2_premium_cartridges.png'
                  }}
                />
              ) : (
                <div className="text-zinc-400 font-mono text-xs">NO ASSET IMAGE</div>
              )}

              {/* Badges Over Image */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                {isPremium && (
                  <span className="px-2.5 py-1 rounded-md bg-amber-500 text-zinc-950 font-mono text-[11px] font-black uppercase flex items-center gap-1 shadow-lg">
                    <Sparkles className="w-3 h-3" />
                    <span>PAPA PREMIUM SERIES</span>
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-md bg-zinc-900/80 text-white dark:bg-black/80 dark:text-[#2EE6CA] border border-zinc-700/50 font-mono text-[10px] font-bold uppercase backdrop-blur-md">
                  ISO 13485 CERTIFIED
                </span>
              </div>

              {/* 3D / 2D Quick Switcher */}
              {has3DModel && (
                <div className="absolute top-4 right-4 z-20 flex items-center gap-1 p-1 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 shadow-xl font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => setMediaViewMode('3d')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                      mediaViewMode === '3d'
                        ? 'bg-[#2EE6CA] text-zinc-950 shadow-xs'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>3D / AR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMediaViewMode('photo')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                      mediaViewMode === 'photo'
                        ? 'bg-zinc-800 text-white shadow-xs'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>2D</span>
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
                  className={`aspect-square rounded-xl border p-2 flex flex-col items-center justify-center gap-1 bg-zinc-950 transition-all cursor-pointer ${
                    mediaViewMode === '3d'
                      ? 'border-[#2EE6CA] shadow-[0_0_10px_rgba(46,230,202,0.3)] ring-1 ring-[#2EE6CA] text-[#2EE6CA]'
                      : 'border-zinc-200 dark:border-[#222731] text-zinc-400 hover:text-white'
                  }`}
                >
                  <Box className="w-5 h-5 text-[#2EE6CA] animate-pulse" />
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
                  className={`aspect-square rounded-xl border p-2 bg-white dark:bg-[#12151B] transition-all overflow-hidden cursor-pointer ${
                    mediaViewMode === 'photo' && activeImageIndex === idx
                      ? 'border-[#2EE6CA] shadow-[0_0_10px_rgba(46,230,202,0.3)] ring-1 ring-[#2EE6CA]'
                      : 'border-zinc-200 dark:border-[#222731] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.url}
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
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-[#2EE6CA] animate-pulse"></span>
                <span className="text-[#0d9488] dark:text-[#2EE6CA] font-bold tracking-wider uppercase">
                  IN STOCK · DISPATCHES WITHIN 24 HOURS
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-950 dark:text-white">
                {product.title}
              </h1>
              <div className="text-xs font-mono text-zinc-400 mt-1">
                ITEM REF: {product.handle.toUpperCase()}
              </div>

              {/* Short summary overview excerpt */}
              {product.description && (
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed mt-3 line-clamp-3">
                  {product.description.slice(0, 200).trim()}...
                </p>
              )}
            </div>

            {/* Price Display */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#11141A] flex items-baseline gap-3">
              <span className="text-3xl font-black font-mono text-zinc-950 dark:text-[#2EE6CA]">
                ${price.toFixed(2)}
              </span>
              <span className="text-xs font-mono text-zinc-400 uppercase">
                {currency} / UNIT
              </span>
            </div>

            {/* Volume Tier Discount Table */}
            <div className="rounded-xl border border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#101319] p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-zinc-400 uppercase">
                <span>STUDIO VOLUME TIER DISCOUNTS</span>
                <span className="text-[#0d9488] dark:text-[#2EE6CA]">WHOLESALE PRICING</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-2.5 rounded-lg border border-zinc-100 dark:border-[#1E232E] bg-zinc-50 dark:bg-[#14171E]">
                  <div className="text-zinc-500 text-[10px]">1 - 4 UNITS</div>
                  <div className="font-bold text-zinc-900 dark:text-white mt-0.5">${price.toFixed(2)}</div>
                  <div className="text-[9px] text-zinc-400 mt-0.5">STANDARD</div>
                </div>
                <div className="p-2.5 rounded-lg border border-teal-500/30 bg-teal-500/10 text-teal-700 dark:text-[#2EE6CA]">
                  <div className="text-[10px]">5 - 19 UNITS</div>
                  <div className="font-bold mt-0.5">${(price * 0.85).toFixed(2)}</div>
                  <div className="text-[9px] font-bold mt-0.5">SAVE 15%</div>
                </div>
                <div className="p-2.5 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <div className="text-[10px]">20+ UNITS</div>
                  <div className="font-bold mt-0.5">${(price * 0.75).toFixed(2)}</div>
                  <div className="text-[9px] font-bold mt-0.5">PRO SAVE 25%</div>
                </div>
              </div>
            </div>

            {/* Variant Selector: Matrix 3-Option Selector or Standard Pills */}
            {product.options && product.options.some(o => o.name.toLowerCase() === 'type') ? (
              <CartridgeMatrixSelector
                product={product}
                selectedVariant={selectedVariant}
                onSelectVariant={setSelectedVariant}
              />
            ) : product.variants.edges.length > 1 ? (
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold uppercase text-zinc-400 block">
                  CHOOSE SPECIFICATION / VARIANT:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.edges.map(({ node: v }) => {
                    const isSelected = selectedVariant?.id === v.id
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#2EE6CA] bg-zinc-900 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 shadow-sm'
                            : 'border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#12151B] text-zinc-600 dark:text-zinc-300 hover:border-zinc-400'
                        }`}
                      >
                        {v.title}
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : null}

            {/* Quantity Selector and Order Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                {/* Quantity Controls */}
                <div className="flex items-center border border-zinc-200 dark:border-[#222731] rounded-xl bg-white dark:bg-[#12151B] overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2.5 text-zinc-500 hover:text-zinc-950 dark:hover:text-white font-mono text-sm transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-2.5 text-zinc-500 hover:text-zinc-950 dark:hover:text-white font-mono text-sm transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Primary Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-6 rounded-xl bg-zinc-950 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-teal-500/10 transition-all active:scale-[0.99] cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{addedAnimation ? 'ADDED TO ORDER ✓' : 'ADD TO APPARATUS CART'}</span>
                </button>
              </div>

              {/* Instant Checkout Button */}
              <button
                onClick={() => {
                  handleAddToCart()
                  openCart()
                }}
                className="w-full py-2.5 rounded-xl border border-zinc-200 dark:border-[#222731] hover:border-[#2EE6CA] bg-zinc-100 dark:bg-[#14171E] font-mono text-xs font-bold uppercase text-zinc-800 dark:text-zinc-200 hover:text-[#2EE6CA] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>DIRECT SHOPIFY CHECKOUT</span>
              </button>
            </div>

            {/* Quality & Assurance Grid */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-200 dark:border-[#1E232E] text-xs font-mono text-zinc-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0d9488] dark:text-[#2EE6CA]" />
                <span>100% EO Gas Sterilized</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#0d9488] dark:text-[#2EE6CA]" />
                <span>Global Express Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0d9488] dark:text-[#2EE6CA]" />
                <span>ISO 13485 Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#0d9488] dark:text-[#2EE6CA]" />
                <span>Factory Batch Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Detailed Information, Specifications & RMA Tabs */}
        <section className="mb-16 rounded-2xl border border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#101319] overflow-hidden shadow-xs">
          {/* Tabs Navigation Bar */}
          <div className="flex border-b border-zinc-200 dark:border-[#1E232E] bg-zinc-50/70 dark:bg-[#0D0F14] overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('description')}
              className={`flex items-center gap-2 px-5 py-4 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 cursor-pointer ${
                activeTab === 'description'
                  ? 'border-[#0d9488] dark:border-[#2EE6CA] text-[#0d9488] dark:text-[#2EE6CA] bg-white dark:bg-[#101319]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>DESCRIPTION & APPARATUS OVERVIEW</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('specs')}
              className={`flex items-center gap-2 px-5 py-4 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 cursor-pointer ${
                activeTab === 'specs'
                  ? 'border-[#0d9488] dark:border-[#2EE6CA] text-[#0d9488] dark:text-[#2EE6CA] bg-white dark:bg-[#101319]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>TECHNICAL SPECIFICATIONS & BIOCOMPATIBILITY</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('rma')}
              className={`flex items-center gap-2 px-5 py-4 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 cursor-pointer ${
                activeTab === 'rma'
                  ? 'border-[#0d9488] dark:border-[#2EE6CA] text-[#0d9488] dark:text-[#2EE6CA] bg-white dark:bg-[#101319]'
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
                // APPARATUS PROFILE & TECHNICAL OVERVIEW
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
                    Professional tattoo apparatus engineered to medical ISO 13485 standards. Precision CNC-machined from aircraft-grade aluminum alloy and surgical stainless steel for consistent daily studio performance.
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
                // ENGINEERING SPECIFICATION SHEET
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
                      <span className="text-zinc-400">MANUFACTURING AUDIT</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        ISO 13485:2016 Certified Cleanroom
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
                      <span className="text-zinc-400">FACTORY CERTIFICATION</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        CE / FCC / ISO 13485:2016 Compliant
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
                // POST-DISPATCH SUPPORT & QUALITY PLEDGE
              </div>
              <h2 className="text-xl font-black uppercase text-zinc-950 dark:text-white mb-2">
                WARRANTY COVERAGE & FACTORY REPAIR (RMA)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-[#1E232E] bg-zinc-50/50 dark:bg-[#13161D] space-y-3">
                  <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white uppercase">
                    <ShieldCheck className="w-4 h-4 text-[#0d9488] dark:text-[#2EE6CA]" />
                    <span>14-DAY PRO REPLACEMENT GUARANTEE</span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                    If your machine or hardware specimen develops any manufacturing defects within 14 days of delivery, Papa Tattoo provides an immediate one-to-one replacement or credit adjustment.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-zinc-200 dark:border-[#1E232E] bg-zinc-50/50 dark:bg-[#13161D] space-y-3">
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
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#12151B] text-zinc-700 dark:text-zinc-300 text-xs font-mono font-bold uppercase hover:text-[#0d9488] dark:hover:text-[#2EE6CA] transition-colors"
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
          <section className="border-t border-zinc-200 dark:border-[#222731] pt-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="text-[11px] font-mono font-bold tracking-widest text-[#0d9488] dark:text-[#2EE6CA] uppercase">
                  // STUDIO COMPATIBILITY
                </div>
                <h3 className="text-xl font-black uppercase text-zinc-950 dark:text-white">
                  SUGGESTED APPARATUS COMPLEMENTS
                </h3>
              </div>
              <Link
                to="/collections"
                search={{ category: 'all' }}
                className="text-xs font-mono font-bold uppercase text-[#0d9488] dark:text-[#2EE6CA] hover:underline"
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
      </div>
    </div>
  )
}
