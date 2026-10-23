import React, { useEffect, useState, useRef, useCallback } from 'react'
import { RotateCw, RefreshCw, Maximize2, Box, Sparkles, Loader2 } from 'lucide-react'

interface ModelViewer3DProps {
  src: string
  poster?: string
  alt?: string
  className?: string
  autoRotate?: boolean
  cameraOrbit?: string
  fieldOfView?: string
  /**
   * If true, delays loading the 1MB @google/model-viewer bundle until the element enters the viewport.
   * Default: true
   */
  lazyLoad?: boolean
  /**
   * 'auto' will reveal the model as soon as loaded; 'interaction' requires user tap/click.
   * Default: 'auto'
   */
  reveal?: 'auto' | 'interaction'
}

export const ModelViewer3D: React.FC<ModelViewer3DProps> = ({
  src,
  poster,
  alt = 'Papa Tattoo 3D Apparatus',
  className = '',
  autoRotate = true,
  cameraOrbit = '45deg 75deg 2.5m',
  fieldOfView = '30deg',
  lazyLoad = true,
  reveal = 'auto',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const modelViewerRef = useRef<any>(null)

  const [isScriptLoaded, setIsScriptLoaded] = useState(() => {
    return typeof window !== 'undefined' && !!customElements.get('model-viewer')
  })
  const [isInView, setIsInView] = useState(!lazyLoad)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isRotating, setIsRotating] = useState(autoRotate)
  const [isActivating, setIsActivating] = useState(false)

  // Dynamically load @google/model-viewer only when needed
  const loadScript = useCallback(() => {
    if (typeof window === 'undefined') return
    if (customElements.get('model-viewer')) {
      setIsScriptLoaded(true)
      return
    }

    setIsActivating(true)
    import('@google/model-viewer')
      .then(() => {
        setIsScriptLoaded(true)
      })
      .catch((err) => {
        console.error('Failed to load @google/model-viewer:', err)
      })
      .finally(() => {
        setIsActivating(false)
      })
  }, [])

  // Viewport Observer: trigger script loading when within near distance of viewport (200px ahead)
  useEffect(() => {
    if (!lazyLoad || isInView) return
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [lazyLoad, isInView])

  // Load script when in view
  useEffect(() => {
    if (isInView && !isScriptLoaded) {
      loadScript()
    }
  }, [isInView, isScriptLoaded, loadScript])

  const handleResetCamera = () => {
    if (modelViewerRef.current) {
      modelViewerRef.current.cameraOrbit = cameraOrbit
      modelViewerRef.current.fieldOfView = fieldOfView
      modelViewerRef.current.jumpCameraToGoal?.()
    }
  }

  const toggleAutoRotate = () => {
    setIsRotating((prev) => !prev)
  }

  const handleFullscreen = () => {
    if (modelViewerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen?.()
      } else {
        modelViewerRef.current.requestFullscreen?.()
      }
    }
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => {
        if (!isScriptLoaded) loadScript()
      }}
      className={`relative w-full h-full overflow-hidden bg-transparent select-none ${className}`}
    >
      {/* If script is not ready yet, render high-performance WebP poster preview immediately */}
      {!isScriptLoaded ? (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          {poster ? (
            <img
              src={poster}
              alt={alt}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.5)] transition-opacity duration-300"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-zinc-500">
              <Box className="w-8 h-8 text-[#0d9488] dark:text-[#2EE6CA] animate-pulse" />
              <span className="text-xs font-mono">LOADING 3D APPARATUS...</span>
            </div>
          )}

          {/* Quick Activate Trigger Overlay on Poster */}
          <button
            type="button"
            onClick={loadScript}
            aria-label="Activate interactive 3D model"
            className="absolute bottom-14 sm:bottom-4 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 dark:bg-black/85 backdrop-blur-md border border-white/20 text-white text-[11px] font-mono tracking-wider uppercase whitespace-nowrap hover:bg-black transition-all cursor-pointer shadow-lg"
          >
            {isActivating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 text-[#2EE6CA] animate-spin" />
                <span>INITIALIZING 3D ENGINE...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#2EE6CA]" />
                <span>CLICK TO INTERACT 3D</span>
              </>
            )}
          </button>
        </div>
      ) : (
        /* 3D Model Viewer Web Component */
        <model-viewer
          ref={modelViewerRef}
          src={src}
          poster={poster}
          alt={alt}
          camera-controls
          auto-rotate={isRotating ? '' : undefined}
          rotation-per-second="20deg"
          shadow-intensity="1.2"
          shadow-softness="0.9"
          exposure="1.6"
          tone-mapping="neutral"
          camera-orbit={cameraOrbit}
          field-of-view={fieldOfView}
          touch-action="pan-y"
          ar
          ar-modes="webxr scene-viewer quick-look"
          loading="lazy"
          reveal={reveal}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            outline: 'none',
          }}
          onLoad={() => setIsLoaded(true)}
        >
          {/* Fallback Slot for Loading Indicator */}
          <div
            slot="poster"
            className="w-full h-full flex flex-col items-center justify-center bg-transparent text-zinc-400"
          >
            {poster ? (
              <img
                src={poster}
                alt={alt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain opacity-80"
              />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Box className="w-8 h-8 text-[#0d9488] dark:text-[#2EE6CA] animate-pulse" />
                <span className="text-xs font-mono">RENDERING 3D MESH...</span>
              </div>
            )}
          </div>
        </model-viewer>
      )}

      {/* Bottom Right Quick Controls (Accessible with aria-labels) */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 bg-white/85 dark:bg-black/80 backdrop-blur-md border border-zinc-200 dark:border-white/15 rounded-xl p-1.5 shadow-xl">
        <button
          type="button"
          onClick={toggleAutoRotate}
          aria-label={isRotating ? 'Pause auto-rotation' : 'Resume auto-rotation'}
          title={isRotating ? 'Pause Auto-Rotation' : 'Resume Auto-Rotation'}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            isRotating
              ? 'bg-[#2EE6CA]/20 text-[#0d9488] dark:text-[#2EE6CA]'
              : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
          }`}
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={handleResetCamera}
          aria-label="Reset camera angle"
          title="Reset Camera Angle"
          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={handleFullscreen}
          aria-label="Toggle fullscreen 3D view"
          title="Fullscreen 3D View"
          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
