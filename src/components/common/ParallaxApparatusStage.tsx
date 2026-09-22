import React, { useEffect, useRef, useState } from 'react'

interface ParallaxApparatusStageProps {
  imageSrc: string
  alt: string
  accentColor?: 'cyan' | 'amber' | 'emerald'
  baseRotation?: number
  className?: string
  priorityTag?: string
}

export const ParallaxApparatusStage: React.FC<ParallaxApparatusStageProps> = ({
  imageSrc,
  alt,
  accentColor = 'cyan',
  baseRotation = 0,
  className = '',
  priorityTag,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0.5)
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  // Scroll listener tracking element position relative to viewport
  useEffect(() => {
    let animationFrameId: number

    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const vh = window.innerHeight
      const totalSpan = vh + rect.height

      // Progress from 0 (just entering bottom) to 1 (leaving top)
      const rawProgress = (vh - rect.top) / totalSpan
      const progress = Math.min(Math.max(rawProgress, 0), 1)

      animationFrameId = requestAnimationFrame(() => {
        setScrollProgress(progress)
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  // Interactive 3D cursor tracking for desktop
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    setMouseOffset({ x, y })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setMouseOffset({ x: 0, y: 0 })
  }

  // Derived transforms based on scroll
  // centerOffset: -1 (at bottom of screen) -> 0 (dead center) -> +1 (at top of screen)
  const centerOffset = (scrollProgress - 0.5) * 2

  // 1. Vertical float: glides opposite to scroll
  const translateY = centerOffset * -50 + (isHovered ? mouseOffset.y * -8 : 0)

  // 2. 3D Tilt: pitch & yaw responsive to scroll and cursor
  const rotateX = centerOffset * -14 + (isHovered ? mouseOffset.y * -10 : 0)
  const rotateY = centerOffset * 12 + (isHovered ? mouseOffset.x * 12 : 0)
  const rotateZ = baseRotation + centerOffset * 8

  // 3. Scale: gently swells as it reaches center stage
  const scale = 1.02 + (1 - Math.abs(centerOffset)) * 0.08 + (isHovered ? 0.04 : 0)

  // 4. Contact shadow properties
  const shadowBlur = 24 + (1 - Math.abs(centerOffset)) * 12
  const shadowOpacity = 0.7 - Math.abs(centerOffset) * 0.25

  // Accent glow styling
  const glowStyles = {
    cyan: {
      spotlight: 'rgba(56, 232, 198, 0.25)',
      halo: 'rgba(56, 232, 198, 0.18)',
    },
    amber: {
      spotlight: 'rgba(230, 179, 102, 0.28)',
      halo: 'rgba(230, 179, 102, 0.18)',
    },
    emerald: {
      spotlight: 'rgba(13, 93, 80, 0.32)',
      halo: 'rgba(56, 232, 198, 0.15)',
    },
  }[accentColor]

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full aspect-square max-w-[480px] sm:max-w-[540px] flex items-center justify-center p-4 sm:p-8 select-none perspective-[1200px] ${className}`}
      style={{ perspective: '1200px' }}
    >
      {/* Dynamic Ambient Spotlight that moves opposite to scroll */}
      <div
        className="absolute inset-0 rounded-full blur-3xl pointer-events-none transition-transform duration-700 ease-out"
        style={{
          background: `radial-gradient(circle at ${50 + centerOffset * 20}% ${50 - centerOffset * 20}%, ${glowStyles.spotlight} 0%, transparent 70%)`,
          opacity: 0.9 - Math.abs(centerOffset) * 0.2,
          transform: `scale(${1 + (1 - Math.abs(centerOffset)) * 0.25})`,
        }}
      />

      {/* Floating Apparatus Artwork with 3D Matrix Transform */}
      <div
        className="relative z-10 w-full h-full flex items-center justify-center transition-transform duration-100 ease-out will-change-transform"
        style={{
          transform: `translate3d(0, ${translateY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
          transformStyle: 'preserve-3d',
        }}
      >
        <img
          src={imageSrc}
          alt={alt}
          loading="lazy"
          className="relative max-h-[82%] max-w-[85%] w-auto object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.45)] dark:drop-shadow-[0_35px_70px_rgba(0,0,0,0.85)] filter transition-all duration-300 pointer-events-none"
        />

        {/* Floating Precision Specimen Tag */}
        {priorityTag && (
          <div
            className="absolute bottom-6 sm:bottom-10 -right-2 sm:right-4 z-20 px-3 py-1 rounded-full border border-zinc-200/80 dark:border-white/15 bg-white/85 dark:bg-black/80 backdrop-blur-md text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-800 dark:text-white shadow-lg pointer-events-none transition-transform duration-300"
            style={{
              transform: `translate3d(0, ${centerOffset * 10}px, 20px)`,
            }}
          >
            <span>{priorityTag}</span>
          </div>
        )}
      </div>

      {/* Ground Contact Shadow: dynamically expands & blurs as object levitates */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 max-w-sm h-7 bg-black blur-xl rounded-[100%] pointer-events-none transition-all duration-150 ease-out"
        style={{
          opacity: shadowOpacity,
          filter: `blur(${shadowBlur}px)`,
          transform: `translateX(-50%) scale(${1 - Math.abs(centerOffset) * 0.15})`,
        }}
      />

      {/* Specular Ground Halo */}
      <div
        className="absolute bottom-5 left-1/2 -translate-x-1/2 w-1/2 max-w-xs h-3 rounded-[100%] blur-md pointer-events-none transition-all duration-150 ease-out"
        style={{
          background: glowStyles.halo,
          opacity: 0.8 - Math.abs(centerOffset) * 0.4,
        }}
      />
    </div>
  )
}
