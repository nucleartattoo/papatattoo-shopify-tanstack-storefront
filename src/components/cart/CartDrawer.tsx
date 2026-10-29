import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
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
import { formatNeedleCode } from '../product/StudioReplenishmentMatrix'
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Layers,
  Loader2,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Tag,
  Trash2,
  Truck,
  X,
  Zap,
} from 'lucide-react'

const DEFAULT_DRAWER_WIDTH = 480

export interface ParsedItemMetadata {
  isCartridge: boolean
  code?: string
  specSummary?: string
  pinCount?: number
  categoryLabel: string
}

export function parseItemHardwareMetadata(item: {
  title: string
  variantTitle?: string
  quantity: number
}): ParsedItemMetadata {
  const titleLower = item.title.toLowerCase()
  const variantTitle = item.variantTitle || ''

  if (titleLower.includes('cartridge')) {
    let type = ''
    let gauge = ''
    let size = ''
    let code = ''

    const codeMatch = variantTitle.match(/\b(0[468]|1[024])\d{2}(RLT?|RLH|RS|M1C?)\b/i)
    if (codeMatch) {
      code = codeMatch[0].toUpperCase()
    } else if (variantTitle.includes('/')) {
      const parts = variantTitle.split('/').map(p => p.trim())
      for (const part of parts) {
        const pUpper = part.toUpperCase()
        if (
          pUpper.includes('LINER') ||
          pUpper.includes('SHADER') ||
          pUpper.includes('MAGNUM') ||
          pUpper.includes('ROUND')
        ) {
          type = part
        } else if (
          pUpper.includes('#') ||
          pUpper.includes('BUGPIN') ||
          pUpper.includes('0.') ||
          pUpper.includes('GAUGE')
        ) {
          gauge = part
        } else if (/^\d{1,2}$/.test(part)) {
          size = part
        }
      }
      if (type && gauge && size) {
        code = formatNeedleCode(type, gauge, size)
      }
    }

    let specSummary = ''
    if (type || gauge || size) {
      specSummary = [type, gauge, size ? `Size ${size}` : ''].filter(Boolean).join(' · ')
    } else if (variantTitle && variantTitle !== 'Default Title') {
      specSummary = variantTitle
    }

    return {
      isCartridge: true,
      code: code || undefined,
      specSummary: specSummary || undefined,
      pinCount: item.quantity * 20,
      categoryLabel: titleLower.includes('premium')
        ? 'PREMIUM 316L NEEDLES'
        : 'SURGICAL CARTRIDGES',
    }
  }

  if (
    titleLower.includes('pen') ||
    titleLower.includes('apollo') ||
    titleLower.includes('rotary') ||
    titleLower.includes('machine')
  ) {
    return {
      isCartridge: false,
      specSummary:
        variantTitle && variantTitle !== 'Default Title' ? variantTitle : undefined,
      categoryLabel: 'ROTARY APPARATUS',
    }
  }

  if (titleLower.includes('grip')) {
    return {
      isCartridge: false,
      specSummary:
        variantTitle && variantTitle !== 'Default Title' ? variantTitle : undefined,
      categoryLabel: 'CLICK GRIP',
    }
  }

  if (
    titleLower.includes('volt') ||
    titleLower.includes('power') ||
    titleLower.includes('battery') ||
    titleLower.includes('pedal')
  ) {
    return {
      isCartridge: false,
      specSummary:
        variantTitle && variantTitle !== 'Default Title' ? variantTitle : undefined,
      categoryLabel: 'WIRELESS POWER',
    }
  }

  return {
    isCartridge: false,
    specSummary:
      variantTitle && variantTitle !== 'Default Title' ? variantTitle : undefined,
    categoryLabel: 'STUDIO GEAR',
  }
}

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

  // Synchronize open/close state with interruptible spring
  useEffect(() => {
    if (!isRendered) return
    const m = motionRef.current
    const width = dialogRef.current?.offsetWidth || DEFAULT_DRAWER_WIDTH

    if (isOpen) {
      if (m.x >= width * 0.98 && m.rafId === 0) {
        m.x = width
        applyTransform(m.x, width)
      }
      runSpringTo(0, undefined, 1.0, 0.32)
    } else {
      runSpringTo(width, undefined, 1.0, 0.28, () => {
        setIsRendered(false)
      })
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

  // 1:1 Pointer Drag + Hysteresis + Rubber-banding + Velocity Handoff
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    const target = e.target as HTMLElement
    if (target.closest('button, a, input, textarea, select, [role="button"]')) {
      return
    }

    const m = motionRef.current
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

    const projectedX = m.x + projectMomentum(vx, 0.993)
    const shouldDismiss =
      !cancelled &&
      (vx > 420 || (vx >= -120 && projectedX > width * 0.35))

    if (shouldDismiss) {
      runSpringTo(width, vx, 0.92, 0.28, () => {
        setIsRendered(false)
      })
      closeCart()
    } else {
      const dampingRatio = Math.abs(vx) > 300 ? 0.86 : 1.0
      runSpringTo(0, vx, dampingRatio, 0.32)
    }
  }

  // B2B Studio Volume Engine & Needle Telemetry Calculations
  const {
    itemsWithMeta,
    cartridgeBoxes,
    cartridgePins,
    cartridgeSubtotal,
    grossSubtotal,
    volumeDiscountPercent,
    volumeDiscountAmount,
    netSubtotal,
    freeShippingUnlocked,
    freeShippingGap,
    nextTierBoxesNeeded,
    nextTierPercent,
    tierName,
  } = useMemo(() => {
    let boxes = 0
    let cSubtotal = 0

    const enriched = items.map(item => {
      const meta = parseItemHardwareMetadata(item)
      if (meta.isCartridge) {
        boxes += item.quantity
        cSubtotal += item.price * item.quantity
      }
      return { item, meta }
    })

    const gross = totalAmount

    // Tier calculation:
    // 5+ Boxes: 5% off cartridges + Free express freight
    // 10+ Boxes: 10% off cartridges
    // 20+ Boxes: 15% off cartridges
    let pct = 0
    let nextNeeded = 0
    let nextPct = 5
    let tName = 'Standard Studio'

    if (boxes >= 20) {
      pct = 15
      nextNeeded = 0
      nextPct = 15
      tName = 'Distributor Wholesale'
    } else if (boxes >= 10) {
      pct = 10
      nextNeeded = 20 - boxes
      nextPct = 15
      tName = 'Master Parlor'
    } else if (boxes >= 5) {
      pct = 5
      nextNeeded = 10 - boxes
      nextPct = 10
      tName = 'Studio Restock'
    } else if (boxes > 0) {
      pct = 0
      nextNeeded = 5 - boxes
      nextPct = 5
      tName = 'Single Pack'
    } else {
      pct = 0
      nextNeeded = 5
      nextPct = 5
      tName = 'Apparatus Studio'
    }

    const discAmount = (cSubtotal * pct) / 100
    const net = Math.max(0, gross - discAmount)

    // Free express air shipping unlocked at $150+ order OR 5+ cartridge boxes
    const freeShip = gross >= 150 || boxes >= 5
    const shipGap = freeShip ? 0 : Math.max(0, 150 - gross)

    return {
      itemsWithMeta: enriched,
      cartridgeBoxes: boxes,
      cartridgePins: boxes * 20,
      cartridgeSubtotal: cSubtotal,
      grossSubtotal: gross,
      volumeDiscountPercent: pct,
      volumeDiscountAmount: discAmount,
      netSubtotal: net,
      freeShippingUnlocked: freeShip,
      freeShippingGap: shipGap,
      nextTierBoxesNeeded: nextNeeded,
      nextTierPercent: nextPct,
      tierName: tName,
    }
  }, [items, totalAmount])

  if (!isRendered) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div
        ref={backdropRef}
        aria-hidden="true"
        onClick={closeCart}
        className="absolute inset-0 bg-black/35 dark:bg-black/65 backdrop-blur-xs transition-none"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 pointer-events-none">
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
          className="pointer-events-auto w-screen max-w-md sm:max-w-[480px] h-[100dvh] apple-glass-sheet shadow-[-24px_0_64px_rgba(0,0,0,0.16)] dark:shadow-[-24px_0_64px_rgba(0,0,0,0.6)] flex flex-col justify-between will-change-transform outline-hidden touch-pan-y"
        >
          {/* Header - Translucent Apple Chrome Top Bar */}
          <div className="px-6 pt-5 pb-3.5 border-b border-black/[0.06] dark:border-white/[0.08] shrink-0 select-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <h2
                  id="cart-drawer-title"
                  className="text-xl sm:text-2xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-[-0.025em]"
                >
                  {t('cart_title')}
                </h2>
                {totalQuantity > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-semibold tabular-nums bg-black/[0.05] dark:bg-white/[0.1] text-[#1d1d1f] dark:text-[#f5f5f7]">
                    {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
                    {cartridgePins > 0 && ` · ${cartridgePins} pins`}
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
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* B2B Studio Volume & Freight Telemetry Bar */}
            {items.length > 0 && (
              <div className="mt-3.5 pt-3 border-t border-black/[0.05] dark:border-white/[0.06] space-y-2">
                {/* Cartridge Replenishment Allowance Tier */}
                {cartridgeBoxes > 0 ? (
                  <div className="rounded-xl bg-white/70 dark:bg-white/[0.04] p-2.5 border border-black/[0.04] dark:border-white/[0.06] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-semibold text-[#1d1d1f] dark:text-white">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>{tierName} Tier</span>
                        {volumeDiscountPercent > 0 && (
                          <span className="px-1.5 py-0.2 rounded-md text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                            {volumeDiscountPercent}% Off
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-[#86868b] tabular-nums">
                        {cartridgeBoxes} {cartridgeBoxes === 1 ? 'Box' : 'Boxes'} · {cartridgePins} Pins
                      </span>
                    </div>

                    {/* Progress track for 5 -> 10 -> 20 boxes */}
                    <div className="space-y-1">
                      <div className="w-full bg-black/[0.06] dark:bg-white/[0.08] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(100, (cartridgeBoxes / 20) * 100)}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-[#86868b]">
                        <span className={cartridgeBoxes >= 5 ? 'text-emerald-800 dark:text-emerald-300 font-semibold' : ''}>
                          5 bx (5%)
                        </span>
                        <span className={cartridgeBoxes >= 10 ? 'text-emerald-800 dark:text-emerald-300 font-semibold' : ''}>
                          10 bx (10%)
                        </span>
                        <span className={cartridgeBoxes >= 20 ? 'text-emerald-800 dark:text-emerald-300 font-semibold' : ''}>
                          20 bx (15%)
                        </span>
                      </div>
                    </div>

                    {/* Incentive hint */}
                    <div className="text-[11px] text-[#86868b] flex items-center justify-between">
                      {nextTierBoxesNeeded > 0 ? (
                        <span>
                          Add <strong className="text-[#1d1d1f] dark:text-white">{nextTierBoxesNeeded}</strong> more {nextTierBoxesNeeded === 1 ? 'box' : 'boxes'} for <strong className="text-emerald-800 dark:text-emerald-300">{nextTierPercent}% Studio Allowance</strong>
                        </span>
                      ) : (
                        <span className="text-emerald-800 dark:text-emerald-300 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Maximum wholesale studio tier active</span>
                        </span>
                      )}
                    </div>
                  </div>
                ) : null}

                {/* Free Worldwide Freight Status Pill */}
                <div className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg bg-black/[0.03] dark:bg-white/[0.03]">
                  <div className="flex items-center gap-1.5 text-[#1d1d1f] dark:text-[#f5f5f7]">
                    <Truck className={`w-3.5 h-3.5 ${freeShippingUnlocked ? 'text-emerald-800 dark:text-emerald-300' : 'text-[#86868b]'}`} />
                    <span className="text-[11px]">
                      {freeShippingUnlocked ? (
                        <strong className="text-emerald-800 dark:text-emerald-300 font-semibold">
                          Free Worldwide Express Freight Unlocked
                        </strong>
                      ) : (
                        <span>
                          Add <strong className="text-[#1d1d1f] dark:text-white tabular-nums">${freeShippingGap.toFixed(2)}</strong> for Free Express Air Freight
                        </span>
                      )}
                    </span>
                  </div>
                  {freeShippingUnlocked && (
                    <span className="text-[10px] font-mono font-semibold text-emerald-800 dark:text-emerald-300">
                      $0.00
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Item List - Apple-Grade Clean Flow */}
          <div className="flex-1 overflow-y-auto px-6 py-2 divide-y divide-black/[0.06] dark:divide-white/[0.08]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#86868b]">
                <div className="w-16 h-16 rounded-full bg-black/[0.04] dark:bg-white/[0.08] flex items-center justify-center mb-5">
                  <ShoppingBag className="w-7 h-7 stroke-[1.5] text-[#86868b]" />
                </div>
                <p className="text-xl sm:text-2xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-[-0.025em]">
                  {t('cart_empty')}
                </p>
                <p className="text-xs sm:text-sm text-[#86868b] mt-2 max-w-xs leading-relaxed">
                  Precision rotary apparatus, sterile cartridges, and click grips you select will appear here.
                </p>
                <Link
                  to="/collections"
                  onClick={closeCart}
                  className="mt-6 px-6 py-2.5 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-xs font-semibold inline-flex items-center gap-1.5 hover:opacity-88 active:scale-[0.97] transition-all duration-150 ease-[var(--ease-out-strong)] cursor-pointer shadow-xs"
                >
                  <span>Explore Hardware Lineup</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              itemsWithMeta.map(({ item, meta }) => {
                const itemOriginalTotal = item.price * item.quantity
                const hasDiscount = meta.isCartridge && volumeDiscountPercent > 0
                const itemDiscountedTotal = hasDiscount
                  ? itemOriginalTotal * (1 - volumeDiscountPercent / 100)
                  : itemOriginalTotal

                return (
                  <div
                    key={item.merchandiseId}
                    className="flex gap-4 py-4.5"
                  >
                    {/* Thumbnail Specimen Box */}
                    <div className="w-20 h-20 rounded-2xl bg-white dark:bg-[#1c1c1e] p-2 shrink-0 flex items-center justify-center border border-black/[0.04] dark:border-white/[0.06] relative overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-contain drop-shadow-sm"
                        />
                      ) : (
                        <ShoppingBag className="w-6 h-6 text-[#86868b]" />
                      )}
                    </div>

                    {/* Hardware Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        {/* Top Metadata Badges & Remove Trigger */}
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-[#86868b]">
                              {meta.categoryLabel}
                            </span>
                            {meta.code && (
                              <span className="px-1.5 py-0.2 rounded-md text-[10px] font-mono font-bold bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] tracking-tight">
                                {meta.code}
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.merchandiseId)}
                            className="text-[#86868b] hover:text-red-500 active:scale-[0.92] transition-[color,transform] duration-150 ease-[var(--ease-out-strong)] p-1 -mr-1 cursor-pointer shrink-0"
                            aria-label={`Remove ${item.title} from cart`}
                            title="Remove apparatus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Apparatus Title */}
                        <h4 className="text-sm font-semibold tracking-[-0.01em] text-[#1d1d1f] dark:text-[#f5f5f7] line-clamp-1 mt-0.5">
                          {item.title}
                        </h4>

                        {/* Specs Subtitle */}
                        {meta.specSummary && (
                          <div className="text-xs text-[#86868b] truncate mt-0.5">
                            {meta.specSummary}
                          </div>
                        )}

                        {/* Needle Cartridge Quantity & Pin Details */}
                        {meta.isCartridge && (
                          <div className="text-[11px] text-[#86868b] mt-0.5 font-mono">
                            {item.quantity} {item.quantity === 1 ? 'box' : 'boxes'} · {meta.pinCount} pins · 20/box
                          </div>
                        )}
                      </div>

                      {/* Bottom Row: Line Price & Tactile Quantity Controls */}
                      <div className="flex items-center justify-between mt-3 pt-1">
                        <div className="flex items-baseline gap-1.5">
                          {hasDiscount && (
                            <span className="text-xs line-through text-[#86868b] tabular-nums">
                              ${itemOriginalTotal.toFixed(2)}
                            </span>
                          )}
                          <span
                            className={`text-sm font-semibold tabular-nums whitespace-nowrap ${
                              hasDiscount
                                ? 'text-emerald-800 dark:text-emerald-300'
                                : 'text-[#1d1d1f] dark:text-[#f5f5f7]'
                            }`}
                          >
                            ${itemDiscountedTotal.toFixed(2)}
                          </span>
                        </div>

                        {/* Tactile Stepper */}
                        <div className="flex items-center rounded-full bg-black/[0.05] dark:bg-white/[0.08] px-0.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.merchandiseId, item.quantity - 1)}
                            className="p-1.5 text-zinc-500 hover:text-zinc-950 dark:hover:text-white active:scale-[0.92] transition-[transform,color] duration-150 ease-[var(--ease-out-strong)] cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-semibold tabular-nums text-[#1d1d1f] dark:text-[#f5f5f7]">
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
                )
              })
            )}
          </div>

          {/* Footer & Express Studio Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-black/[0.06] dark:border-white/[0.08] space-y-3.5 shrink-0 apple-glass-chrome">
              {/* Promo & VIP Discount Input */}
              <div className="space-y-1.5">
                {!showCodeInput ? (
                  <button
                    type="button"
                    onClick={() => setShowCodeInput(true)}
                    className="text-xs text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white flex items-center gap-1.5 transition-colors duration-150 cursor-pointer"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>Add promo or artist sponsor code</span>
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <input
                      id="cart-promo-code"
                      aria-label="Promo or sponsor code"
                      type="text"
                      value={codeInput}
                      onChange={e => setCodeInput(e.target.value.toUpperCase())}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          setPromoCode(codeInput.trim())
                        }
                      }}
                      placeholder="e.g. SACHKOART, SPONSOR50"
                      className="flex-1 px-4 py-2 text-xs bg-black/[0.045] dark:bg-white/[0.08] border border-transparent rounded-full focus:outline-hidden focus:border-black/15 dark:focus:border-white/20 placeholder:text-[#86868b] text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors duration-150 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setPromoCode(codeInput.trim())}
                      className="px-4 py-2 bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-xs font-semibold rounded-full cursor-pointer hover:opacity-88 active:scale-[0.96] transition-all"
                    >
                      {promoCode && promoCode === codeInput.trim() ? 'Applied' : 'Apply'}
                    </button>
                  </div>
                )}
                {promoCode && (
                  <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-500/[0.08] px-3.5 py-1.5 rounded-full">
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

              {/* Financial Line Item Breakdown */}
              <div className="space-y-1.5 pt-2 border-t border-black/[0.05] dark:border-white/[0.06] text-xs">
                <div className="flex justify-between items-center text-[#86868b]">
                  <span>Items Subtotal</span>
                  <span className="tabular-nums font-mono text-[#1d1d1f] dark:text-[#f5f5f7]">
                    ${grossSubtotal.toFixed(2)} USD
                  </span>
                </div>

                {volumeDiscountAmount > 0 && (
                  <div className="flex justify-between items-center text-emerald-800 dark:text-emerald-300">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Studio Volume Allowance ({volumeDiscountPercent}%)</span>
                    </span>
                    <span className="tabular-nums font-mono font-semibold">
                      - ${volumeDiscountAmount.toFixed(2)} USD
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center text-[#86868b]">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3 h-3" />
                    <span>Worldwide Express Freight</span>
                  </span>
                  <span className={`tabular-nums font-mono ${freeShippingUnlocked ? 'text-emerald-800 dark:text-emerald-300 font-semibold' : 'text-[#86868b]'}`}>
                    {freeShippingUnlocked ? 'Complimentary ($0.00)' : 'Calculated at checkout'}
                  </span>
                </div>

                <div className="flex justify-between items-baseline pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
                  <span className="font-semibold text-sm text-[#1d1d1f] dark:text-[#f5f5f7]">
                    {t('cart_subtotal')}
                  </span>
                  <div className="text-right">
                    <span className="text-xl font-bold tracking-tight tabular-nums whitespace-nowrap text-[#1d1d1f] dark:text-[#f5f5f7]">
                      ${netSubtotal.toFixed(2)} USD
                    </span>
                  </div>
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                type="button"
                onClick={checkout}
                disabled={isCheckingOut}
                className="w-full h-12 px-5 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-88 active:scale-[0.98] transition-all duration-150 ease-[var(--ease-out-strong)] cursor-pointer disabled:opacity-50 shadow-xs"
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Opening secure checkout...</span>
                  </>
                ) : (
                  <>
                    <span>Express Studio Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Studio Trust Guarantee Micro-Strip */}
              <div className="flex items-center justify-center gap-2 text-[10px] text-[#86868b] font-medium tracking-tight">
                <span>100% EO Sterilized</span>
                <span>·</span>
                <span>14-Day Pro Exchange</span>
                <span>·</span>
                <span>Factory Warranty</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
