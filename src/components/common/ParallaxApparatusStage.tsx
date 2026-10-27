import React, { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

interface ParallaxApparatusStageProps {
  imageSrc: string
  alt: string
  accentColor?: 'cyan' | 'amber' | 'emerald'
  baseRotation?: number
  className?: string
  priorityTag?: string
}

const GLOW_PALETTES = {
  cyan: {
    spotlight: 'rgba(56, 232, 198, 0.20)',
    halo: 'rgba(56, 232, 198, 0.14)',
  },
  amber: {
    spotlight: 'rgba(230, 179, 102, 0.22)',
    halo: 'rgba(230, 179, 102, 0.15)',
  },
  emerald: {
    spotlight: 'rgba(13, 93, 80, 0.24)',
    halo: 'rgba(56, 232, 198, 0.12)',
  },
} as const

/**
 * Zero-re-render 3D specimen stage with damped spring physics.
 * Uses IntersectionObserver for viewport reveal and direct DOM transform
 * updates for pointer-driven spring tilt (no scroll listeners, no React state churn).
 */
export const ParallaxApparatusStage: React.FC<ParallaxApparatusStageProps> = ({
  imageSrc,
  alt,
  accentColor = 'cyan',
  baseRotation = 0,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const spotlightRef = useRef<HTMLDivElement>(null)
  const shadowRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  const physicsRef = useRef({
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    velX: 0,
    velY: 0,
    hovered: false,
    rafId: 0 as number,
    lastTime: 0,
  })

  useEffect(() => {
    const stageEl = stageRef.current
    const physics = physicsRef.current
    if (!stageEl) return

    if (prefersReducedMotion) {
      stageEl.style.transform = `translate3d(0, 0, 0) rotateZ(${baseRotation}deg) scale(1)`
      return
    }

    stageEl.style.transform = `translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) rotateZ(${baseRotation}deg) scale(1)`

    return () => {
      if (physics.rafId) {
        cancelAnimationFrame(physics.rafId)
        physics.rafId = 0
      }
    }
  }, [baseRotation, prefersReducedMotion])

  const startSpringLoop = () => {
    const state = physicsRef.current
    if (state.rafId) return

    state.lastTime = performance.now()

    const step = (now: number) => {
      const dt = Math.min((now - state.lastTime) / 1000, 0.032)
      state.lastTime = now

      // Damped harmonic oscillator (stiffness 150, damping 18)
      const stiffness = 150
      const damping = 18

      const forceX = (state.targetX - state.currentX) * stiffness
      const forceY = (state.targetY - state.currentY) * stiffness

      state.velX = (state.velX + forceX * dt) * Math.exp(-damping * dt)
      state.velY = (state.velY + forceY * dt) * Math.exp(-damping * dt)

      state.currentX += state.velX * dt
      state.currentY += state.velY * dt

      const rotateX = state.currentY * -9
      const rotateY = state.currentX * 11
      const rotateZ = baseRotation + state.currentX * 2.5
      const translateY = state.currentY * -6
      const scale = state.hovered ? 1.035 : 1

      if (stageRef.current) {
        stageRef.current.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) rotateZ(${rotateZ.toFixed(2)}deg) scale(${scale})`
      }

      if (spotlightRef.current) {
        const spotX = (state.currentX * -14).toFixed(1)
        const spotY = (state.currentY * -14).toFixed(1)
        spotlightRef.current.style.transform = `translate3d(${spotX}px, ${spotY}px, 0) scale(${state.hovered ? 1.08 : 1})`
      }

      if (shadowRef.current) {
        const shadowX = (state.currentX * -10).toFixed(1)
        shadowRef.current.style.transform = `translate3d(${shadowX}px, 0, 0) scale(${state.hovered ? 0.92 : 1})`
      }

      const isSettled =
        !state.hovered &&
        Math.abs(state.targetX - state.currentX) < 0.002 &&
        Math.abs(state.targetY - state.currentY) < 0.002 &&
        Math.abs(state.velX) < 0.002 &&
        Math.abs(state.velY) < 0.002

      if (isSettled) {
        state.currentX = 0
        state.currentY = 0
        state.rafId = 0
        if (stageRef.current) {
          stageRef.current.style.transform = `translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) rotateZ(${baseRotation}deg) scale(1)`
        }
        return
      }

      state.rafId = requestAnimationFrame(step)
    }

    state.rafId = requestAnimationFrame(step)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || e.pointerType !== 'mouse' || !containerRef.current) {
      return
    }
    const rect = containerRef.current.getBoundingClientRect()
    const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2

    physicsRef.current.targetX = Math.max(-1, Math.min(1, normX))
    physicsRef.current.targetY = Math.max(-1, Math.min(1, normY))
    physicsRef.current.hovered = true
    startSpringLoop()
  }

  const handlePointerLeave = () => {
    if (prefersReducedMotion) return
    physicsRef.current.targetX = 0
    physicsRef.current.targetY = 0
    physicsRef.current.hovered = false
    startSpringLoop()
  }

  const palette = GLOW_PALETTES[accentColor] || GLOW_PALETTES.cyan

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative w-full aspect-square max-w-[460px] sm:max-w-[520px] flex items-center justify-center p-6 sm:p-10 select-none ${className}`}
      style={{ perspective: '1200px' }}
    >
      {/* Studio Optical Pedestal Surface */}
      <div
        aria-hidden="true"
        className="absolute inset-4 sm:inset-6 rounded-3xl border border-[#e2dfd8]/90 dark:border-white/[0.07] bg-white/60 dark:bg-[#1a1d24]/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] pointer-events-none"
      />

      {/* Dynamic Ambient Key Light */}
      <div
        ref={spotlightRef}
        aria-hidden="true"
        className="absolute inset-10 rounded-full blur-3xl pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${palette.spotlight} 0%, transparent 70%)`,
        }}
      />

      {/* Floating Hardware Specimen */}
      <div
        ref={stageRef}
        className="relative z-10 w-full h-full flex items-center justify-center will-change-transform"
        style={{
          transform: `translate3d(0, 0, 0) rotateZ(${baseRotation}deg) scale(1)`,
          transformStyle: 'preserve-3d',
          transition: prefersReducedMotion
            ? 'none'
            : 'transform 180ms cubic-bezier(0.23, 1, 0.32, 1)',
        }}
      >
        <img
          src={imageSrc}
          alt={alt}
          loading="lazy"
          className="relative max-h-[82%] max-w-[84%] w-auto object-contain drop-shadow-[0_22px_40px_rgba(18,18,16,0.22)] dark:drop-shadow-[0_28px_56px_rgba(0,0,0,0.75)] pointer-events-none"
        />
      </div>

      {/* Ground Contact Shadow */}
      <div
        ref={shadowRef}
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-3/5 max-w-xs h-5 bg-black/45 dark:bg-black/75 blur-xl rounded-[100%] pointer-events-none"
      />

      {/* Specular Ground Reflection */}
      <div
        aria-hidden="true"
        className="absolute bottom-9 left-1/2 -translate-x-1/2 w-2/5 max-w-[200px] h-2 rounded-[100%] blur-md pointer-events-none"
        style={{ background: palette.halo }}
      />
    </div>
  )
}
