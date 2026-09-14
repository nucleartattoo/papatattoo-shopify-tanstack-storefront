import React from 'react'

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'model-viewer': React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> & {
            src?: string
            poster?: string
            alt?: string
            'camera-controls'?: boolean | string
            'auto-rotate'?: boolean | string
            'auto-rotate-delay'?: number | string
            'rotation-per-second'?: string
            'shadow-intensity'?: number | string
            'shadow-softness'?: number | string
            exposure?: number | string
            'environment-image'?: string
            'camera-orbit'?: string
            'min-camera-orbit'?: string
            'max-camera-orbit'?: string
            'field-of-view'?: string
            'touch-action'?: string
            ar?: boolean | string
            'ar-modes'?: string
            'ar-scale'?: string
            loading?: 'auto' | 'lazy' | 'eager'
            reveal?: 'auto' | 'interaction' | 'manual'
            className?: string
            style?: React.CSSProperties
          },
          HTMLElement
        >
      }
    }
  }
}
