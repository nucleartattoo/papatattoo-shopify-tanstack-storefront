import React, { useRef, useState } from 'react'
import { useCart } from '../../context/CartContext'
import { useLocale } from '../../context/LocaleContext'
import { useDialogAccessibility } from '../../hooks/useDialogAccessibility'
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2, Tag, Check } from 'lucide-react'

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
    promoCode,
    setPromoCode,
  } = useCart()

  const { t } = useLocale()
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [codeInput, setCodeInput] = useState(promoCode)
  const [prevPromoCode, setPrevPromoCode] = useState(promoCode)
  const [showCodeInput, setShowCodeInput] = useState(!!promoCode)

  if (prevPromoCode !== promoCode) {
    setPrevPromoCode(promoCode)
    setCodeInput(promoCode)
  }

  useDialogAccessibility({
    isOpen,
    onClose: closeCart,
    dialogRef,
    initialFocusRef: closeButtonRef,
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div
        aria-hidden="true"
        onClick={closeCart}
        className="absolute inset-0 bg-black/55 dark:bg-black/75 backdrop-blur-xs transition-opacity duration-200 ease-[var(--ease-out-strong)] animate-in fade-in motion-reduce:animate-none"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-drawer-title"
          tabIndex={-1}
          className="w-screen max-w-md h-[100dvh] bg-[#f5f4f0] dark:bg-[#20222a] border-l border-[#e2dfd8] dark:border-white/[0.08] shadow-[inset_1px_0_0_rgba(255,255,255,0.75),-24px_0_64px_rgba(0,0,0,0.22)] dark:shadow-[inset_1px_0_0_rgba(255,255,255,0.06),-24px_0_64px_rgba(0,0,0,0.55)] flex flex-col justify-between animate-in slide-in-from-right duration-300 ease-[var(--ease-drawer)] motion-reduce:animate-none outline-hidden"
        >
          {/* Header - Gallery Top Bar */}
          <div className="px-6 py-5 bg-white/85 dark:bg-[#22252f]/90 backdrop-blur-md border-b border-[#e2dfd8] dark:border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#f8f7f4] dark:bg-[#181b22] border border-[#e2dfd8] dark:border-white/[0.08] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-zinc-950 dark:text-white" />
              </div>
              <h2
                id="cart-drawer-title"
                className="text-sm font-black text-zinc-950 dark:text-white uppercase font-display tracking-tight"
              >
                {t('cart_title')}
              </h2>
              {totalQuantity > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold tabular-nums bg-white dark:bg-[#181b22] border border-[#e2dfd8] dark:border-white/[0.08] text-[#0d5d50] dark:text-[#38e8c6]">
                  {totalQuantity}
                </span>
              )}
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeCart}
              className="p-2 rounded-xl border border-transparent hover:border-[#e2dfd8] dark:hover:border-white/[0.08] hover:bg-white dark:hover:bg-[#181b22] text-zinc-500 hover:text-zinc-950 dark:hover:text-white active:scale-[0.95] transition-[transform,color,background-color,border-color] duration-150 ease-[var(--ease-out-strong)] cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Item List - Clean Borderless Flow */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-[#e2dfd8]/80 dark:divide-white/[0.06]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-zinc-500">
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-[#22252f] border border-[#e2dfd8] dark:border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] flex items-center justify-center mb-4">
                  <ShoppingBag className="w-7 h-7 stroke-[1.5] text-zinc-400 dark:text-zinc-500" />
                </div>
                <p className="text-sm font-black uppercase text-zinc-900 dark:text-white font-display tracking-tight">
                  {t('cart_empty')}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 max-w-xs font-sans leading-relaxed">
                  Select precision grips, rotary machines, or sterilized needle cartridges to build your dispatch order.
                </p>
                <button
                  type="button"
                  onClick={closeCart}
                  className="mt-6 px-6 py-3 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer hover:bg-[#0d5d50] dark:hover:bg-[#2dd4b5] active:scale-[0.97] transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] shadow-xs"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.merchandiseId}
                  className="flex gap-4 py-4.5 first:pt-0 last:pb-0"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl bg-white dark:bg-[#181b22] p-2 shrink-0 flex items-center justify-center border border-[#e2dfd8] dark:border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain drop-shadow-sm"
                      />
                    ) : (
                      <div className="text-[10px] font-mono text-zinc-500">GEAR</div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-bold text-zinc-950 dark:text-white truncate font-sans">
                          {item.title}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.merchandiseId)}
                          className="text-zinc-400 hover:text-rose-500 active:scale-[0.94] transition-[color,transform] duration-150 ease-[var(--ease-out-strong)] p-1 -mr-1 cursor-pointer"
                          aria-label={`Remove ${item.title} from cart`}
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.variantTitle && item.variantTitle !== 'Default Title' && (
                        <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
                          {item.variantTitle}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs font-bold font-mono tabular-nums whitespace-nowrap text-zinc-950 dark:text-white">
                        ${(item.price * item.quantity).toFixed(2)} {item.currencyCode}
                      </span>

                      {/* Tactile Quantity Controls */}
                      <div className="flex items-center rounded-xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.merchandiseId, item.quantity - 1)}
                          className="p-1.5 text-zinc-500 hover:text-zinc-950 dark:hover:text-white active:scale-[0.92] transition-[transform,color] duration-150 ease-[var(--ease-out-strong)] cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-mono font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.merchandiseId, item.quantity + 1)}
                          className="p-1.5 text-zinc-500 hover:text-zinc-950 dark:hover:text-white active:scale-[0.92] transition-[transform,color] duration-150 ease-[var(--ease-out-strong)] cursor-pointer"
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
            <div className="p-6 border-t border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#22252f] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] space-y-3.5">
              {/* Promo & VIP Discount Input */}
              <div className="space-y-2">
                {!showCodeInput ? (
                  <button
                    type="button"
                    onClick={() => setShowCodeInput(true)}
                    className="text-[11px] font-mono text-zinc-500 hover:text-[#0d5d50] dark:hover:text-[#38e8c6] flex items-center gap-1.5 transition-colors duration-150 cursor-pointer"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>Have a promo or Sponsor code?</span>
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <input
                      id="cart-promo-code"
                      aria-label="Promo or sponsor code"
                      type="text"
                      value={codeInput}
                      onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          setPromoCode(codeInput.trim())
                        }
                      }}
                      placeholder="e.g. SACHKOART, SPONSOR50"
                      className="flex-1 px-3 py-2 text-xs font-mono uppercase bg-[#f8f7f4] dark:bg-[#181b22] border border-[#e2dfd8] dark:border-white/[0.08] rounded-xl focus:outline-hidden focus:border-[#0d5d50] dark:focus:border-[#38e8c6] text-zinc-900 dark:text-white transition-colors duration-150"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPromoCode(codeInput.trim())
                      }}
                      className="px-3.5 py-2 bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 text-[11px] font-mono font-bold rounded-xl uppercase cursor-pointer hover:bg-[#0d5d50] dark:hover:bg-[#2dd4b5] active:scale-[0.96] transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)]"
                    >
                      {promoCode && promoCode === codeInput.trim() ? 'Applied' : 'Apply'}
                    </button>
                  </div>
                )}
                {promoCode && (
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#0d5d50] dark:text-[#38e8c6] bg-[#0d5d50]/10 dark:bg-[#38e8c6]/10 border border-[#0d5d50]/20 dark:border-[#38e8c6]/20 px-3 py-1.5 rounded-xl">
                    <span className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      <span>Code <strong>{promoCode}</strong> active at checkout</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setPromoCode('')
                        setCodeInput('')
                      }}
                      className="text-zinc-400 hover:text-rose-500 transition-colors duration-150 cursor-pointer"
                      aria-label="Remove code"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Automatic BOGO Discount hint */}
              <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 flex items-center justify-between py-1.5 border-t border-[#e2dfd8]/70 dark:border-white/[0.06]">
                <span>Automatic Discounts:</span>
                <span className="text-[#0d5d50] dark:text-[#38e8c6] font-bold">
                  BOGO Applied at Checkout
                </span>
              </div>

              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-zinc-500 dark:text-zinc-400 uppercase">{t('cart_subtotal')}</span>
                <span className="text-base font-bold tabular-nums whitespace-nowrap text-zinc-950 dark:text-white font-mono">
                  ${totalAmount.toFixed(2)} USD
                </span>
              </div>

              <button
                type="button"
                onClick={checkout}
                disabled={isCheckingOut}
                className="w-full py-3.5 px-4 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#0d5d50] dark:hover:bg-[#2dd4b5] active:scale-[0.98] transition-[transform,background-color,color,opacity] duration-150 ease-[var(--ease-out-strong)] cursor-pointer disabled:opacity-50 shadow-xs"
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
