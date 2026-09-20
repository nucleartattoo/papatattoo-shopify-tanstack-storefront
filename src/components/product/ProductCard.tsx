import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ShopifyProduct, ShopifyVariant } from '../../types/shopify'
import { useCart } from '../../context/CartContext'
import { useLocale } from '../../context/LocaleContext'
import { ShoppingBag, Check, Sparkles, ArrowRight } from 'lucide-react'
import { formatProductImageUrl } from '../../utils/imageUrl'

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
  const rawImage = images[currentImageIndex] || images[0] || ''
  const currentImage = formatProductImageUrl(rawImage)

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

  // Check inventory stock status
  const isAnyVariantAvailable = variants.length > 0
    ? variants.some(v => v.availableForSale !== false)
    : product.availableForSale !== false

  const isSelectedAvailable = selectedVariant
    ? selectedVariant.availableForSale !== false
    : isAnyVariantAvailable

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
      className={`group relative rounded-2xl border p-5 flex flex-col justify-between transition-all duration-500 ${
        isPremiumCartridge
          ? 'border-amber-500/20 dark:border-amber-500/30 bg-white dark:bg-[#262933] hover:border-amber-500/40 dark:hover:border-amber-400/50 hover:shadow-xl dark:hover:shadow-[0_12px_32px_rgba(245,158,11,0.08)]'
          : 'border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#262933] hover:border-zinc-300 dark:hover:border-white/20 hover:shadow-xl dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)]'
      }`}
    >
      {/* Top Header Tags */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3.5">
          {/* Contextual Category / Series Badge */}
          {isPremiumCartridge ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono font-medium tracking-wider uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>PREMIUM</span>
            </span>
          ) : (
            <span className="text-[10px] font-mono font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
              {isNeedle ? "CARTRIDGES" : isGrip ? "GRIPS" : isPen ? "MACHINES" : "EQUIPMENT"}
            </span>
          )}

          {isAnyVariantAvailable ? (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
              <span>{t('card_in_stock')}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600" />
              <span>OUT OF STOCK</span>
            </span>
          )}
        </div>

        {/* Product Image Stage */}
        <Link
          to="/products/$handle"
          params={{ handle: product.handle }}
          className="relative aspect-square w-full rounded-xl bg-zinc-50 dark:bg-[#1c1e24] flex items-center justify-center overflow-hidden border border-zinc-100 dark:border-white/[0.05]"
        >
          {/* Visual Color Glow Accent behind product */}
          <div
            className="absolute inset-0 opacity-10 blur-3xl transition-opacity duration-700 group-hover:opacity-25 pointer-events-none"
            style={{ backgroundColor: accentColor }}
          />

          <img
            src={currentImage}
            alt={product.title}
            className="relative max-h-[82%] max-w-[82%] w-auto h-auto object-contain scale-125 sm:scale-135 group-hover:scale-145 transition-transform duration-700 ease-out drop-shadow-[0_16px_28px_rgba(0,0,0,0.8)]"
            loading="lazy"
            onError={(e) => {
              const fallback = formatProductImageUrl(images[0])
              if (fallback && (e.currentTarget as HTMLImageElement).src !== fallback) {
                (e.currentTarget as HTMLImageElement).src = fallback
              }
            }}
          />
        </Link>

        {/* Title & Info */}
        <div className="mt-4">
          <Link
            to="/products/$handle"
            params={{ handle: product.handle }}
            className="block"
          >
            <h3
              className={`font-bold text-sm sm:text-base leading-snug tracking-tight transition-colors line-clamp-2 ${
                isPremiumCartridge
                  ? 'text-zinc-950 dark:text-white/95 group-hover:text-amber-500 dark:group-hover:text-amber-400'
                  : 'text-zinc-950 dark:text-white/95 group-hover:text-[#0d9488] dark:group-hover:text-[#2ee6ca]'
              }`}
            >
              {product.title}
            </h3>
          </Link>
        </div>
      </div>

      {/* Bottom Section: Pricing & Dynamic Action Button */}
      <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-white/[0.08] flex items-center justify-between gap-3">
        {/* Price display */}
        <div className="min-w-0">
          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
            {isNeedle ? 'BOX OF 20' : variants.length > 1 ? 'FROM' : 'PRICE'}
          </span>
          <span
            className={`text-base sm:text-lg font-bold font-mono tracking-tight ${
              isPremiumCartridge
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-zinc-950 dark:text-white'
            }`}
          >
            {priceFormatted}
          </span>
        </div>

        {/* Dynamic Action Button: Multiple variants -> "Options →"; Single/No variant -> "+ ShoppingBag" */}
        {!isAnyVariantAvailable ? (
          <Link
            to="/products/$handle"
            params={{ handle: product.handle }}
            className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg font-mono text-[10px] font-medium uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-white/[0.06] shrink-0"
          >
            <span>OUT OF STOCK</span>
          </Link>
        ) : variants.length > 1 ? (
          <Link
            to="/products/$handle"
            params={{ handle: product.handle }}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-medium uppercase tracking-wider transition-all duration-200 transform active:scale-95 shrink-0 cursor-pointer ${
              isPremiumCartridge
                ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400 shadow-xs'
                : 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-xs'
            }`}
          >
            <span>Options</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : isSelectedAvailable ? (
          <button
            type="button"
            onClick={handleAddToCart}
            className={`inline-flex items-center justify-center p-2.5 rounded-xl font-mono text-xs font-medium uppercase tracking-wider transition-all duration-200 transform active:scale-95 shrink-0 cursor-pointer ${
              addedAnimation
                ? 'bg-emerald-500 text-white'
                : isPremiumCartridge
                ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400 shadow-xs'
                : 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-xs'
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
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg font-mono text-[10px] font-medium uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-white/[0.06] cursor-not-allowed shrink-0"
          >
            OUT OF STOCK
          </button>
        )}
      </div>
    </div>
  )
}
