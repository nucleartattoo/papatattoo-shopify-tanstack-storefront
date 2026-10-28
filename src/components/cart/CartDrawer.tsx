import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useCart } from '../../context/CartContext'
import { useLocale } from '../../context/LocaleContext'
import { useDialogAccessibility } from '../../hooks/useDialogAccessibility'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import {
  appleSpringParams,
  computeReleaseVelocity,
  projectMomentum,
  rubberband,
  stepSpring1D,
  VelocitySample,
} from '../../utils/appleSpring'
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2, Tag, Check } from 'lucide-react'

const DEFAULT_DRAWER_WIDTH = 448

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
  const prefersReducedMotion = usePrefersReducedMotion()
  const dialogRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const [isRendered, setIsRendered] = useState(isOpen)
  const [codeInput, setCodeInput] = useState(promoCode)
  const [prevPromoCode, setPrevPromoCode] = useState(promoCode)
  const [showCodeInput, setShowCodeInput] = useState(!!promoCode)

  if (prevPromoCode !== promoCode) {
    setPrevPromoCode(promoCode)
    setCodeInput(promoCode)
  }

  // Ensure drawer mounts immediately when opened so spring starts from live presentation value
  if (isOpen && !isRendered) {
    setIsRendered(true)
  }

  // Spring & 1:1 gesture state (stored in ref for zero-re-render 60/120fps updates)
  const motionRef = useRef({
    x: DEFAULT_DRAWER_WIDTH,
    vx: 0,
    targetX: isOpen ? 0 : DEFAULT_DRAWER_WIDTH,
    rafId: 0,
    lastTime: 0,
    dragging: false,
    pointerId: -1,
    startClientX: 0,
    startClientY: 0,
    grabOffsetX: 0,
    gestureLocked: null as 'horizontal' | 'vertical' | null,
    samples: [] as VelocitySample[],
  })

  const applyTransform = useCallback(
    (x: number, width: number) => {
      const panel = dialogRef.current
      const backdrop = backdropRef.current
      if (panel) {
        panel.style.transform = prefersReducedMotion
          ? 'none'
          : `translate3d(${x.toFixed(2)}px, 0, 0)`
        if (prefersReducedMotion) {
          panel.style.opacity = x < width * 0.5 ? '1' : '0'
        } else {
          panel.style.opacity = '1'
        }
      }
      if (backdrop) {
        const progress = Math.max(0, Math.min(1, 1 - Math.max(0, x) / Math.max(width, 1)))
        backdrop.style.opacity = progress.toFixed(3)
      }
    },
    [prefersReducedMotion]
  )

  const runSpringTo = useCallback(
    (
      targetX: number,
      initialVelocityPxPerSec?: number,
      dampingRatio = 1.0,
      response = 0.32,
      onRest?: () => void
    ) => {
      const m = motionRef.current
      m.targetX = targetX
      if (typeof initialVelocityPxPerSec === 'number') {
        m.vx = initialVelocityPxPerSec
      }

      const width = dialogRef.current?.offsetWidth || DEFAULT_DRAWER_WIDTH

      if (prefersReducedMotion) {
        if (m.rafId) {
          cancelAnimationFrame(m.rafId)
          m.rafId = 0
        }
        m.x = targetX
        m.vx = 0
        applyTransform(targetX, width)
        onRest?.()
        return
      }

      const { stiffness, damping } = appleSpringParams(dampingRatio, response)

      if (m.rafId) {
        cancelAnimationFrame(m.rafId)
        m.rafId = 0
      }
      m.lastTime = performance.now()

      const step = (now: number) => {
        const elapsedSec = (now - m.lastTime) / 1000
        m.lastTime = now

        const next = stepSpring1D(
          m.x,
          m.vx,
          m.targetX,
          elapsedSec,
          stiffness,
          damping
        )
        m.x = next.x
        m.vx = next.vx

        const currentWidth = dialogRef.current?.offsetWidth || DEFAULT_DRAWER_WIDTH
        applyTransform(m.x, currentWidth)

        const settled =
          Math.abs(m.x - m.targetX) < 0.5 && Math.abs(m.vx) < 6

        if (settled) {
          m.x = m.targetX
          m.vx = 0
          m.rafId = 0
          applyTransform(m.x, currentWidth)
          onRest?.()
          return
        }

        m.rafId = requestAnimationFrame(step)
      }

      m.rafId = requestAnimationFrame(step)
    },
    [applyTransform, prefersReducedMotion]
  )

  // Synchronize open/close state with interruptible spring (§3, §4, §7)
  useEffect(() => {
    if (!isRendered) return
    const m = motionRef.current
    const width = dialogRef.current?.offsetWidth || DEFAULT_DRAWER_WIDTH

    if (isOpen) {
      // If opening from fully closed, seed starting position at panel width
      if (m.x >= width * 0.98 && m.rafId === 0) {
        m.x = width
        applyTransform(m.x, width)
      }
      // Critically damped spring (ζ = 1.0, response = 0.32s)
      runSpringTo(0, undefined, 1.0, 0.32)
    } else {
      // Dismiss along the exact same horizontal path to the right
      runSpringTo(width, undefined, 1.0, 0.28, () => {
        setIsRendered(false)
      })
      // Fallback timer in case tab is hidden and rAF is throttled by the browser
      const fallbackTimer = window.setTimeout(() => {
        if (!isOpen) {
          if (m.rafId) {
            cancelAnimationFrame(m.rafId)
            m.rafId = 0
          }
          m.x = width
          m.vx = 0
          setIsRendered(false)
        }
      }, 360)
      return () => window.clearTimeout(fallbackTimer)
    }
  }, [applyTransform, isOpen, isRendered, runSpringTo])

  useEffect(() => {
    const m = motionRef.current
    return () => {
      if (m.rafId) {
        cancelAnimationFrame(m.rafId)
        m.rafId = 0
      }
    }
  }, [])

  useDialogAccessibility({
    isOpen,
    onClose: closeCart,
    dialogRef,
    initialFocusRef: closeButtonRef,
  })

  // 1:1 Pointer Drag + Hysteresis + Rubber-banding + Velocity Handoff (§2, §5, §6, §9, §10)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    const target = e.target as HTMLElement
    if (target.closest('button, a, input, textarea, select, [role="button"]')) {
      return
    }

    const m = motionRef.current
    // Interrupt any in-flight spring immediately at its live presentation value (§3)
    if (m.rafId) {
      cancelAnimationFrame(m.rafId)
      m.rafId = 0
    }

    m.dragging = true
    m.pointerId = e.pointerId
    m.startClientX = e.clientX
    m.startClientY = e.clientY
    m.grabOffsetX = m.x
    m.gestureLocked = null
    m.samples = [{ x: e.clientX, y: e.clientY, t: performance.now() }]
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const m = motionRef.current
    if (!m.dragging || e.pointerId !== m.pointerId) return

    const dx = e.clientX - m.startClientX
    const dy = e.clientY - m.startClientY

    // ~10px hysteresis before committing to horizontal drawer drag vs vertical scroll (§10)
    if (!m.gestureLocked) {
      if (Math.hypot(dx, dy) < 9) return
      if (Math.abs(dx) > Math.abs(dy) * 1.15) {
        m.gestureLocked = 'horizontal'
        e.currentTarget.setPointerCapture?.(e.pointerId)
      } else {
        m.gestureLocked = 'vertical'
        m.dragging = false
        return
      }
    }

    if (m.gestureLocked !== 'horizontal') return

    const now = performance.now()
    m.samples.push({ x: e.clientX, y: e.clientY, t: now })
    if (m.samples.length > 8) m.samples.shift()

    const width = dialogRef.current?.offsetWidth || DEFAULT_DRAWER_WIDTH
    const rawX = m.grabOffsetX + dx

    // Rubber-band when pulling left past the open boundary (rawX < 0) (§9)
    const nextX =
      rawX < 0 ? rubberband(rawX, width, 0.22) : Math.min(rawX, width)

    m.x = nextX
    applyTransform(nextX, width)
  }

  const finishPointerDrag = (e: React.PointerEvent<HTMLDivElement>, cancelled = false) => {
    const m = motionRef.current
    if (!m.dragging || e.pointerId !== m.pointerId) return
    m.dragging = false

    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }

    if (m.gestureLocked !== 'horizontal') {
      m.gestureLocked = null
      return
    }
    m.gestureLocked = null

    const width = dialogRef.current?.offsetWidth || DEFAULT_DRAWER_WIDTH
    const { vx } = cancelled
      ? { vx: 0 }
      : computeReleaseVelocity(m.samples, performance.now())

    // Project resting endpoint from release velocity (§6 Momentum projection)
    const projectedX = m.x + projectMomentum(vx, 0.993)
    const shouldDismiss =
      !cancelled &&
      (vx > 420 || (vx >= -120 && projectedX > width * 0.35))

    if (shouldDismiss) {
      // Hand off release velocity into the dismiss spring (§5)
      runSpringTo(width, vx, 0.92, 0.28, () => {
        setIsRendered(false)
      })
      closeCart()
    } else {
      // Spring back to open state with slight bounce only if gesture carried momentum (§4)
      const dampingRatio = Math.abs(vx) > 300 ? 0.86 : 1.0
      runSpringTo(0, vx, dampingRatio, 0.32)
    }
  }

  if (!isRendered) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay — dims proportionally to drawer progress (§12) */}
      <div
        ref={backdropRef}
        aria-hidden="true"
        onClick={closeCart}
        className="absolute inset-0 bg-black/35 dark:bg-black/65 backdrop-blur-xs transition-none"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-drawer-title"
          tabIndex={-1}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={e => finishPointerDrag(e, false)}
          onPointerCancel={e => finishPointerDrag(e, true)}
          className="pointer-events-auto w-screen max-w-md h-[100dvh] apple-glass-sheet shadow-[-24px_0_64px_rgba(0,0,0,0.16)] dark:shadow-[-24px_0_64px_rgba(0,0,0,0.6)] flex flex-col justify-between will-change-transform outline-hidden touch-pan-y"
        >
          {/* Header - Translucent Gallery Top Bar */}
          <div className="px-6 pt-6 pb-4 flex items-center justify-between select-none">
            <div className="flex items-center gap-3">
                            <h2
                id="cart-drawer-title"
                className="text-2xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-[-0.025em]"
              >
                {t('cart_title')}
              </h2>
              {totalQuantity > 0 && (
                <span className="text-sm font-medium tabular-nums text-[#86868b]">
                  {totalQuantity}
                </span>
              )}
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeCart}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-black/[0.05] dark:bg-white/[0.1] hover:bg-black/[0.09] dark:hover:bg-white/[0.16] text-[#1d1d1f]/70 dark:text-[#f5f5f7]/70 hover:text-[#1d1d1f] dark:hover:text-white active:scale-[0.92] transition-[transform,color,background-color] duration-150 ease-[var(--ease-out-strong)] cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Item List - Clean Borderless Flow */}
          <div className="flex-1 overflow-y-auto px-6 py-2 divide-y divide-black/[0.06] dark:divide-white/[0.08]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#86868b]">
                <div className="w-16 h-16 rounded-full bg-black/[0.04] dark:bg-white/[0.08] flex items-center justify-center mb-5">
                  <ShoppingBag className="w-7 h-7 stroke-[1.5] text-[#86868b]" />
                </div>
                <p className="text-2xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-[-0.025em]">
                  {t('cart_empty')}
                </p>
                <p className="text-sm text-[#86868b] mt-2 max-w-xs leading-relaxed">
                  Machines, cartridges and grips you add will appear here.
                </p>
                <button
                  type="button"
                  onClick={closeCart}
                  className="mt-6 px-6 py-3 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-sm font-medium cursor-pointer hover:opacity-85 active:scale-[0.97] transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)]"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.merchandiseId}
                  className="flex gap-4 py-5"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-2xl bg-white dark:bg-[#1c1c1e] p-2 shrink-0 flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain drop-shadow-sm"
                      />
                    ) : (
                      <ShoppingBag className="w-5 h-5 text-[#86868b]" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-semibold tracking-[-0.01em] text-[#1d1d1f] dark:text-[#f5f5f7] line-clamp-2">
                          {item.title}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.merchandiseId)}
                          className="text-[#86868b] hover:text-red-500 active:scale-[0.94] transition-[color,transform] duration-150 ease-[var(--ease-out-strong)] p-1 -mr-1 cursor-pointer"
                          aria-label={`Remove ${item.title} from cart`}
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.variantTitle && item.variantTitle !== 'Default Title' && (
                        <div className="text-xs text-[#86868b] mt-0.5 truncate">
                          {item.variantTitle}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm font-semibold tabular-nums whitespace-nowrap text-[#1d1d1f] dark:text-[#f5f5f7]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>

                      {/* Tactile Quantity Controls */}
                      <div className="flex items-center rounded-full bg-black/[0.05] dark:bg-white/[0.08] px-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.merchandiseId, item.quantity - 1)}
                          className="p-1.5 text-zinc-500 hover:text-zinc-950 dark:hover:text-white active:scale-[0.92] transition-[transform,color] duration-150 ease-[var(--ease-out-strong)] cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold tabular-nums text-[#1d1d1f] dark:text-[#f5f5f7]">
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
            <div className="p-6 border-t border-black/[0.06] dark:border-white/[0.08] space-y-4">
              {/* Promo & VIP Discount Input */}
              <div className="space-y-2">
                {!showCodeInput ? (
                  <button
                    type="button"
                    onClick={() => setShowCodeInput(true)}
                    className="text-xs text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white flex items-center gap-1.5 transition-colors duration-150 cursor-pointer"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>Add a promo or sponsor code</span>
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
                      className="flex-1 px-4 py-2 text-xs bg-black/[0.045] dark:bg-white/[0.08] border border-transparent rounded-full focus:outline-hidden focus:border-black/15 dark:focus:border-white/20 placeholder:text-[#86868b] text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors duration-150"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPromoCode(codeInput.trim())
                      }}
                      className="px-4 py-2 bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-xs font-medium rounded-full cursor-pointer hover:opacity-85 active:scale-[0.96] transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)]"
                    >
                      {promoCode && promoCode === codeInput.trim() ? 'Applied' : 'Apply'}
                    </button>
                  </div>
                )}
                {promoCode && (
                  <div className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-500/[0.08] px-3.5 py-2 rounded-full">
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
                      className="text-[#86868b] hover:text-red-500 transition-colors duration-150 cursor-pointer"
                      aria-label="Remove code"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Automatic BOGO Discount hint */}
              <div className="text-xs text-[#86868b] flex items-center justify-between">
                <span>Discounts</span>
                <span className="text-[#1d1d1f] dark:text-[#f5f5f7]">
                  Applied at checkout
                </span>
              </div>

              <div className="flex justify-between items-baseline text-sm">
                <span className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">{t('cart_subtotal')}</span>
                <span className="text-lg font-semibold tracking-[-0.015em] tabular-nums whitespace-nowrap text-[#1d1d1f] dark:text-[#f5f5f7]">
                  ${totalAmount.toFixed(2)} USD
                </span>
              </div>

              <button
                type="button"
                onClick={checkout}
                disabled={isCheckingOut}
                className="w-full h-12 px-4 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-sm font-medium flex items-center justify-center gap-2 hover:opacity-85 active:scale-[0.98] transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] cursor-pointer disabled:opacity-50"
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Opening checkout…</span>
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
