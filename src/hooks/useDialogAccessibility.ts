import { RefObject, useEffect, useRef } from 'react'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

let openDialogCount = 0
let savedBodyOverflow = ''

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const candidates = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
  return candidates.filter((el) => {
    if (el.getAttribute('aria-hidden') === 'true') return false
    const style = window.getComputedStyle(el)
    return style.display !== 'none' && style.visibility !== 'hidden'
  })
}

interface UseDialogAccessibilityOptions {
  isOpen: boolean
  onClose: () => void
  dialogRef: RefObject<HTMLElement | null>
  initialFocusRef?: RefObject<HTMLElement | null>
}

/**
 * Provides WCAG-compliant modal/drawer keyboard & focus behavior:
 * - Closes on Escape key
 * - Traps Tab / Shift+Tab focus cycle inside dialogRef
 * - Moves initial focus into the dialog and restores focus to trigger on close
 * - Locks document.body scroll while open
 */
export function useDialogAccessibility({
  isOpen,
  onClose,
  dialogRef,
  initialFocusRef,
}: UseDialogAccessibilityOptions): void {
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return

    const previouslyFocused = document.activeElement as HTMLElement | null

    if (openDialogCount === 0) {
      savedBodyOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }
    openDialogCount += 1

    const rafId = window.requestAnimationFrame(() => {
      const dialogEl = dialogRef.current
      if (!dialogEl) return

      if (initialFocusRef?.current) {
        initialFocusRef.current.focus()
        return
      }

      const focusables = getFocusableElements(dialogEl)
      if (focusables.length > 0) {
        focusables[0].focus()
      } else {
        dialogEl.focus()
      }
    })

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        onCloseRef.current()
        return
      }

      if (event.key !== 'Tab') return

      const dialogEl = dialogRef.current
      if (!dialogEl) return

      const focusables = getFocusableElements(dialogEl)
      if (focusables.length === 0) {
        event.preventDefault()
        dialogEl.focus()
        return
      }

      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement as HTMLElement | null

      if (event.shiftKey) {
        if (!active || active === first || !dialogEl.contains(active)) {
          event.preventDefault()
          last.focus()
        }
      } else if (!active || active === last || !dialogEl.contains(active)) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.cancelAnimationFrame(rafId)
      document.removeEventListener('keydown', handleKeyDown)

      openDialogCount = Math.max(0, openDialogCount - 1)
      if (openDialogCount === 0) {
        document.body.style.overflow = savedBodyOverflow
      }

      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        window.requestAnimationFrame(() => {
          if (document.contains(previouslyFocused)) {
            previouslyFocused.focus()
          }
        })
      }
    }
  }, [isOpen, dialogRef, initialFocusRef])
}
