import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ShopifyProduct, ShopifyVariant } from '../../types/shopify'
import { useCart } from '../../context/CartContext'
import { useLocale } from '../../context/LocaleContext'
import { ShoppingBag, Check, Sparkles, Shield, Cpu, Zap, Layers, ArrowRight, SlidersHorizontal } from 'lucide-react'

interface ProductCardProps {
  product: ShopifyProduct
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart()
  const { t } = useLocale()

  const variants = product.variants?.edges?.map(e => e.node) || []
  const [selectedVariant, setSelectedVariant] = useState<ShopifyVariant>(() => variants[0] || {
    id: `${product.id}-default`,
    title: 'Standard',
    price: { amount: product.priceRange?.minVariantPrice?.amount || '25.0', currencyCode: 'USD' },
  })

  const [addedAnimation, setAddedAnimation] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const images = product.images?.edges?.map(e => e.node.url) || []
  const currentImage = images[currentImageIndex] || images[0] || '/slides/slide_2_premium_cartridges.png'

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, 1)
    setAddedAnimation(true)
    setTimeout(() => setAddedAnimation(false), 1200)
  }

  // Identify category and series
  const titleLower = product.title.toLowerCase()
  const isPremiumCartridge = titleLower.includes('premium')
  const isStandardCartridge = titleLower.includes('cartridge') && !isPremiumCartridge
  const isGrip = titleLower.includes('grip')
  const isPen = titleLower.includes('pen') || titleLower.includes('machine')

  // Extract needle configuration (e.g. 3 Round Liner, 11 Magnum)
  const isNeedle = isPremiumCartridge || isStandardCartridge || titleLower.includes('liner') || titleLower.includes('shader') || titleLower.includes('magnum')

  const priceFormatted = `$${parseFloat(selectedVariant.price.amount).toFixed(2)} ${selectedVariant.price.currencyCode || 'USD'}`

  // Derive color accent from title or series
  const getAccentColor = () => {
    if (isPremiumCartridge) return '#f59e0b' // Amber Gold for Premium
    if (titleLower.includes('blue')) return '#38bdf8'
    if (titleLower.includes('black')) return '#475569'
    if (titleLower.includes('silver')) return '#cbd5e1'
    if (titleLower.includes('green')) return '#34d399'
    if (titleLower.includes('pink')) return '#f472b6'
    if (titleLower.includes('purple')) return '#c084fc'
    if (titleLower.includes('bronze')) return '#d97706'
    if (titleLower.includes('red')) return '#f87171'
    return '#2ee6ca'
  }

  const accentColor = getAccentColor()

  return (
    <div
      className={`group relative rounded-xl border p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${
        isPremiumCartridge
          ? 'border-amber-500/40 dark:border-amber-500/30 bg-white dark:bg-[#141517] hover:border-amber-400 dark:hover:border-amber-400/80 hover:shadow-[0_10px_30px_rgba(245,158,11,0.15)]'
          : 'border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#12151B] hover:border-zinc-400 dark:hover:border-[#2ee6ca]/60 dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
      }`}
    >
      {/* Top Header Tags */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          {/* Contextual Badge */}
          {isPremiumCartridge ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono font-black tracking-wider uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
              <span>PAPA PREMIUM</span>
            </span>
          ) : isStandardCartridge ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-zinc-100 dark:bg-[#1B1F28] text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-[#272D3A]">
              <Layers className="w-3 h-3 text-[#0d9488] dark:text-[#2ee6ca]" />
              <span>STANDARD CART</span>
            </span>
          ) : isGrip ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-zinc-100 dark:bg-[#1B1F28] text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-[#272D3A]">
              <Cpu className="w-3 h-3 text-[#0d9488] dark:text-[#2ee6ca]" />
              <span>6061 ALLOY</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-zinc-100 dark:bg-[#1B1F28] text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-[#272D3A]">
              <Zap className="w-3 h-3 text-[#0d9488] dark:text-[#2ee6ca]" />
              <span>PRO MOTOR</span>
            </span>
          )}

          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {t('card_in_stock')}
          </span>
        </div>

        {/* Product Image Stage */}
        <Link
          to="/products/$handle"
          params={{ handle: product.handle }}
          className="relative aspect-square w-full rounded-lg bg-zinc-50 dark:bg-[#0A0C0F] p-4 flex items-center justify-center overflow-hidden border border-zinc-100 dark:border-[#1E232E]/60 block"
        >
          {/* Visual Color Glow Accent behind product */}
          <div
            className="absolute inset-0 opacity-15 blur-2xl transition-opacity duration-500 group-hover:opacity-35"
            style={{ backgroundColor: accentColor }}
          ></div>

          <img
            src={currentImage}
            alt={product.title}
            className="relative max-h-52 object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-md"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/slides/slide_2_premium_cartridges.png'
            }}
          />

          {/* Alternate Thumbnail Dots if multiple images */}
          {images.length > 1 && (
            <div
              onClick={e => e.preventDefault()}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-white/70 dark:bg-black/60 px-2 py-1 rounded-full backdrop-blur-xs"
            >
              {images.slice(0, 4).map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setCurrentImageIndex(idx)
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentImageIndex === idx
                      ? isPremiumCartridge ? 'bg-amber-400 scale-125' : 'bg-[#2ee6ca] scale-125'
                      : 'bg-zinc-400/60 dark:bg-zinc-600'
                  }`}
                  aria-label={`View photo ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </Link>

        {/* Title & Info */}
        <div className="mt-4">
          <Link
            to="/products/$handle"
            params={{ handle: product.handle }}
            className="block"
          >
            <h3
              className={`font-bold text-base leading-snug tracking-tight transition-colors ${
                isPremiumCartridge
                  ? 'text-zinc-950 dark:text-zinc-100 group-hover:text-amber-500 dark:group-hover:text-amber-400'
                  : 'text-zinc-950 dark:text-zinc-100 group-hover:text-[#0d9488] dark:group-hover:text-[#2ee6ca]'
              }`}
            >
              {product.title}
            </h3>
          </Link>

          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed font-mono">
            {product.description && !product.description.toLowerCase().startsWith('papa')
              ? product.description
              : isPremiumCartridge
              ? 'Ultra-stabilized safety membrane · 316L Japanese surgical stainless steel · 20 pcs/box'
              : isStandardCartridge
              ? 'Medical grade polymer casing · Precision micro-grouping · 20 pcs/box'
              : product.description || 'Precision tattoo apparatus engineered for professional studio artists.'}
          </p>
        </div>
      </div>

      {/* Bottom Section: Pricing & Dynamic Action Button */}
      <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-[#1E232E] flex items-center justify-between gap-3">
        {/* Price display */}
        <div className="min-w-0">
          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block truncate">
            {isNeedle ? 'BOX OF 20' : variants.length > 1 ? 'STARTING AT' : 'STUDIO PRICE'}
          </span>
          <span
            className={`text-lg font-extrabold font-mono tracking-tight ${
              isPremiumCartridge
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-zinc-950 dark:text-[#2ee6ca]'
            }`}
          >
            {priceFormatted}
          </span>
        </div>

        {/* Dynamic Action Button: Multiple variants -> "Options →"; Single/No variant -> "+ ShoppingBag" */}
        {variants.length > 1 ? (
          <Link
            to="/products/$handle"
            params={{ handle: product.handle }}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all transform active:scale-95 shrink-0 cursor-pointer shadow-xs ${
              isPremiumCartridge
                ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-zinc-950 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-[#26cbb1] hover:shadow-[0_0_15px_rgba(46,230,202,0.25)]'
            }`}
          >
            <span>Options</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleAddToCart}
            className={`inline-flex items-center justify-center p-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all transform active:scale-95 shrink-0 cursor-pointer shadow-xs ${
              addedAnimation
                ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                : isPremiumCartridge
                ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-zinc-950 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-[#26cbb1] hover:shadow-[0_0_15px_rgba(46,230,202,0.25)]'
            }`}
            title="Quick add to cart"
          >
            {addedAnimation ? (
              <Check className="w-4 h-4" />
            ) : (
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold leading-none">+</span>
                <ShoppingBag className="w-4 h-4" />
              </div>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
