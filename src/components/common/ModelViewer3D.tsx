import React, { useEffect, useState, useRef } from 'react'
import { RotateCw, RefreshCw, Maximize2, Box } from 'lucide-react'

interface ModelViewer3DProps {
  src: string
  poster?: string
  alt?: string
  className?: string
  autoRotate?: boolean
  cameraOrbit?: string
  fieldOfView?: string
}

export const ModelViewer3D: React.FC<ModelViewer3DProps> = ({
  src,
  poster,
  alt = 'Papa Tattoo 3D Apparatus',
  className = '',
  autoRotate = true,
  cameraOrbit = '45deg 75deg 2.5m',
  fieldOfView = '30deg',
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isRotating, setIsRotating] = useState(autoRotate)
  const modelViewerRef = useRef<any>(null)

  // Dynamically load the @google/model-viewer custom element
  useEffect(() => {
    let mounted = true
    import('@google/model-viewer')
      .then(() => {
        if (mounted) {
          // Custom element is registered
        }
      })
      .catch((err) => {
        console.error('Failed to load @google/model-viewer:', err)
      })

    return () => {
      mounted = false
    }
  }, [])

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
      className={`relative w-full h-full overflow-hidden bg-transparent select-none ${className}`}
    >
      {/* 3D Model Viewer Web Component */}
      <model-viewer
        ref={modelViewerRef}
        src={src}
        poster={poster}
        alt={alt}
        camera-controls
        auto-rotate={isRotating ? '' : undefined}
        rotation-per-second="20deg"
        shadow-intensity="1.2"
        shadow-softness="0.8"
        exposure="1.0"
        camera-orbit={cameraOrbit}
        field-of-view={fieldOfView}
        touch-action="pan-y"
        ar
        ar-modes="webxr scene-viewer quick-look"
        loading="eager"
        reveal="auto"
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
              className="w-full h-full object-cover opacity-60"
            />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Box className="w-8 h-8 text-[#0d9488] dark:text-[#2EE6CA] animate-pulse" />
              <span className="text-xs font-mono">LOADING 3D APPARATUS...</span>
            </div>
          )}
        </div>
      </model-viewer>

      {/* Top Right Quick Controls */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/80 dark:bg-black/60 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-lg p-1 shadow-xs">
        <button
          type="button"
          onClick={toggleAutoRotate}
          title={isRotating ? 'Pause Auto-Rotation' : 'Resume Auto-Rotation'}
          className={`p-1.5 rounded-md transition-colors cursor-pointer ${
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
          title="Reset Camera Angle"
          className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={handleFullscreen}
          title="Fullscreen 3D View"
          className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
