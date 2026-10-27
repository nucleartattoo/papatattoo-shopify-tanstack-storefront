import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ShopifyProduct, ShopifyVariant } from '../../types/shopify'
import { useCart } from '../../context/CartContext'
import { useLocale } from '../../context/LocaleContext'
import { ShoppingBag, Check, Sparkles, ArrowRight } from 'lucide-react'
import { formatProductImageUrl } from '../../utils/imageUrl'
import { classifyApparatusCategory } from '../../lib/hardwareLineup'

interface ProductCardProps {
  product: ShopifyProduct
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart()
  const { t } = useLocale()

  const variants = product.variants?.edges?.map(e => e.node) || []
  const [selectedVariant] = useState<ShopifyVariant>(
    () =>
      variants[0] || {
        id: `${product.id}-default`,
        title: 'Standard',
        price: {
          amount: product.priceRange?.minVariantPrice?.amount || '25.0',
          currencyCode: 'USD',
        },
      }
  )

  const [addedAnimation, setAddedAnimation] = useState(false)

  const images = product.images?.edges?.map(e => e.node.url) || []
  const rawImage = images[0] || ''
  const currentImage = formatProductImageUrl(rawImage)

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, 1)
    setAddedAnimation(true)
    setTimeout(() => setAddedAnimation(false), 1200)
  }

  const titleLower = product.title.toLowerCase()
  const category = classifyApparatusCategory(product)
  const isNeedle = category === 'cartridges'
  const isPremiumCartridge = isNeedle && titleLower.includes('premium')

  const isAnyVariantAvailable =
    variants.length > 0
      ? variants.some(v => v.availableForSale !== false)
      : product.availableForSale !== false

  const isSelectedAvailable = selectedVariant
    ? selectedVariant.availableForSale !== false
    : isAnyVariantAvailable

  const amountFormatted = `$${parseFloat(selectedVariant.price.amount).toFixed(2)}`
  const currencyCode = selectedVariant.price.currencyCode || 'USD'

  const categoryLabel =
    category === 'cartridges'
      ? 'CARTRIDGES'
      : category === 'machines'
      ? 'MACHINES'
      : category === 'grips'
      ? 'GRIPS'
      : category === 'power'
      ? 'POWER & DRIVE'
      : 'STUDIO GEAR'

  const getAccentColor = () => {
    if (isPremiumCartridge) return '#f59e0b'
    if (titleLower.includes('blue')) return '#38bdf8'
    if (titleLower.includes('black')) return '#64748b'
    if (titleLower.includes('silver') || titleLower.includes('stainless')) return '#94a3b8'
    if (titleLower.includes('green')) return '#34d399'
    if (titleLower.includes('pink')) return '#f472b6'
    if (titleLower.includes('red')) return '#f87171'
    return '#2ee6ca'
  }

  const accentColor = getAccentColor()

  return (
    <div
      className={`group relative rounded-2xl border p-5 flex flex-col justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-[border-color,box-shadow,transform] duration-200 ease-[var(--ease-out-strong)] ${
        isPremiumCartridge
          ? 'border-amber-500/25 dark:border-amber-500/30 bg-white dark:bg-[#22252f] hover:border-amber-500/45 dark:hover:border-amber-400/50 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_14px_30px_-12px_rgba(180,115,20,0.16)] dark:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_14px_32px_rgba(245,158,11,0.1)]'
          : 'border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#22252f] hover:border-zinc-300 dark:hover:border-white/20 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_14px_30px_-12px_rgba(18,18,16,0.1)] dark:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_14px_32px_rgba(0,0,0,0.45)]'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3.5">
          {isPremiumCartridge ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-semibold tracking-wider uppercase bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>PREMIUM</span>
            </span>
          ) : (
            <span className="text-[10px] font-mono font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              {categoryLabel}
            </span>
          )}

          {isAnyVariantAvailable ? (
            <span className="text-[10px] font-mono font-semibold text-[#0d5d50] dark:text-[#38e8c6] whitespace-nowrap">
              {t('card_in_stock')}
            </span>
          ) : (
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
              Sold out
            </span>
          )}
        </div>

        <Link
          to="/products/$handle"
          params={{ handle: product.handle }}
          className="relative aspect-square w-full rounded-xl bg-[#f8f7f4] dark:bg-[#181b22] flex items-center justify-center p-4 overflow-hidden border border-[#eceae4] dark:border-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
        >
          <div
            className="absolute inset-6 rounded-full opacity-[0.08] dark:opacity-[0.14] blur-2xl transition-opacity duration-200 ease-[var(--ease-out-strong)] group-hover:opacity-[0.16] dark:group-hover:opacity-[0.24] pointer-events-none"
            style={{ backgroundColor: accentColor }}
          />

          <img
            src={currentImage}
            alt={product.title}
            className="relative max-h-[86%] max-w-[86%] w-auto h-auto object-contain transition-transform duration-200 ease-[var(--ease-out-strong)] group-hover:scale-[1.04] drop-shadow-[0_10px_18px_rgba(18,18,16,0.1)] dark:drop-shadow-[0_14px_24px_rgba(0,0,0,0.5)]"
            loading="lazy"
            onError={e => {
              const image = e.currentTarget
              if (rawImage && image.src !== rawImage) {
                image.src = rawImage
              }
            }}
          />
        </Link>

        <div className="mt-4">
          <Link
            to="/products/$handle"
            params={{ handle: product.handle }}
            className="block"
          >
            <h3
              className={`font-bold text-sm sm:text-[15px] leading-snug tracking-tight transition-colors duration-150 line-clamp-2 ${
                isPremiumCartridge
                  ? 'text-zinc-950 dark:text-white/95 group-hover:text-amber-600 dark:group-hover:text-amber-400'
                  : 'text-zinc-950 dark:text-white/95 group-hover:text-[#0d5d50] dark:group-hover:text-[#38e8c6]'
              }`}
            >
              {product.title}
            </h3>
          </Link>
        </div>
      </div>

      <div className="mt-5 pt-3.5 border-t border-[#eceae4] dark:border-white/[0.08] flex items-center justify-between gap-2.5">
        <div className="min-w-0">
          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
            {isNeedle || titleLower.includes('disposable') ? 'Box of 20' : variants.length > 1 ? 'From' : 'Unit'}
          </span>
          <div className="flex items-baseline gap-1 whitespace-nowrap tabular-nums">
            <span
              className={`text-base sm:text-[17px] font-bold font-mono tracking-tight ${
                isPremiumCartridge
                  ? 'text-amber-700 dark:text-amber-400'
                  : 'text-zinc-950 dark:text-white'
              }`}
            >
              {amountFormatted}
            </span>
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
              {currencyCode}
            </span>
          </div>
        </div>

        {!isAnyVariantAvailable ? (
          <Link
            to="/products/$handle"
            params={{ handle: product.handle }}
            className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg font-mono text-[10px] font-semibold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-white/[0.06] shrink-0 whitespace-nowrap"
          >
            <span>Sold out</span>
          </Link>
        ) : variants.length > 1 ? (
          <Link
            to="/products/$handle"
            params={{ handle: product.handle }}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] shrink-0 whitespace-nowrap ${
              isPremiumCartridge
                ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400 shadow-xs'
                : 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-xs'
            }`}
          >
            <span>Select</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : isSelectedAvailable ? (
          <button
            type="button"
            onClick={handleAddToCart}
            className={`inline-flex items-center justify-center px-3 py-2 rounded-xl font-mono text-xs font-semibold transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] shrink-0 whitespace-nowrap ${
              addedAnimation
                ? 'bg-emerald-600 text-white'
                : isPremiumCartridge
                ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400 shadow-xs'
                : 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-xs'
            }`}
            aria-label={`Add ${product.title} to cart`}
            title="Quick add to cart"
          >
            {addedAnimation ? (
              <Check className="w-4 h-4" />
            ) : (
              <span className="inline-flex items-center gap-1">
                <span className="text-sm font-bold leading-none">+</span>
                <ShoppingBag className="w-3.5 h-3.5" />
              </span>
            )}
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg font-mono text-[10px] font-semibold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-white/[0.06] shrink-0 whitespace-nowrap"
          >
            Sold out
          </button>
        )}
      </div>
    </div>
  )
}
