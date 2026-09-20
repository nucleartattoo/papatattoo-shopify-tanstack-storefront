import React, { useEffect } from 'react'
import { useCart } from '../../context/CartContext'
import { useLocale } from '../../context/LocaleContext'
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react'

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    totalAmount,
    totalQuantity,
    checkout,
    isCheckingOut,
  } = useCart()

  const { t } = useLocale()

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeCart])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#07080a] border-l border-zinc-200/80 dark:border-white/[0.08] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header - Gallery Top Bar */}
          <div className="p-6 border-b border-zinc-200/80 dark:border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-zinc-950 dark:text-white" />
              <h2 className="text-base font-bold text-zinc-950 dark:text-white uppercase font-sans tracking-tight">
                {t('cart_title')}
              </h2>
              {totalQuantity > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-zinc-100 dark:bg-white/[0.08] text-zinc-700 dark:text-zinc-300">
                  {totalQuantity}
                </span>
              )}
            </div>

            <button
              onClick={closeCart}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Item List - Clean Borderless Flow */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-zinc-100 dark:divide-white/[0.06]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-zinc-500">
                <ShoppingBag className="w-12 h-12 stroke-1 text-zinc-300 dark:text-zinc-700 mb-3" />
                <p className="text-sm font-bold uppercase text-zinc-700 dark:text-zinc-300 font-sans">
                  {t('cart_empty')}
                </p>
                <p className="text-xs text-zinc-400 mt-1 max-w-xs font-sans">
                  Your cart is currently empty.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-mono font-medium uppercase tracking-wider cursor-pointer hover:opacity-90 active:scale-95 transition-all shadow-xs"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            ) : (
              items.map(item => (
                <div
                  key={item.merchandiseId}
                  className="flex gap-4 py-4.5 first:pt-0 last:pb-0"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl bg-zinc-50 dark:bg-[#0b0d12] p-2 shrink-0 flex items-center justify-center border border-zinc-100 dark:border-white/[0.05]">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-full h-full object-contain drop-shadow-sm" />
                    ) : (
                      <div className="text-[10px] font-mono text-zinc-500">GEAR</div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="text-xs font-bold text-zinc-950 dark:text-white truncate font-sans">
                          {item.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.merchandiseId)}
                          className="text-zinc-400 hover:text-rose-500 transition-colors p-0.5 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.variantTitle && item.variantTitle !== 'Default Title' && (
                        <div className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 mt-0.5">
                          {item.variantTitle}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs font-bold font-mono text-zinc-950 dark:text-white">
                        ${(item.price * item.quantity).toFixed(2)} {item.currencyCode}
                      </span>

                      {/* Tactile Quantity Controls */}
                      <div className="flex items-center rounded-lg border border-zinc-200/80 dark:border-white/[0.08] bg-zinc-50 dark:bg-[#0e1117]">
                        <button
                          onClick={() => updateQuantity(item.merchandiseId, item.quantity - 1)}
                          className="p-1.5 text-zinc-500 hover:text-zinc-950 dark:hover:text-white active:scale-90 transition-transform cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-mono font-medium text-zinc-800 dark:text-zinc-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.merchandiseId, item.quantity + 1)}
                          className="p-1.5 text-zinc-500 hover:text-zinc-950 dark:hover:text-white active:scale-90 transition-transform cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-6 border-t border-zinc-200/80 dark:border-white/[0.08] bg-zinc-50/50 dark:bg-[#07080a] space-y-4">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-zinc-400 uppercase">{t('cart_subtotal')}</span>
                <span className="text-base font-bold text-zinc-950 dark:text-white font-mono">
                  ${totalAmount.toFixed(2)} USD
                </span>
              </div>

              <button
                onClick={checkout}
                disabled={isCheckingOut}
                className="w-full py-3.5 px-4 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 shadow-xs"
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting Shopify Checkout...</span>
                  </>
                ) : (
                  <>
                    <span>{t('cart_checkout')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
