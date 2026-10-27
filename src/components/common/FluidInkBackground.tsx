import React from 'react'

/**
 * Restrained architectural studio lighting atmosphere.
 * Replaces heavy, high-opacity neon blobs with subtle, museum-grade ambient
 * illumination and a fixed, non-repainting micro-grain surface texture.
 */
export const FluidInkBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
    >
      {/* Top-Left Architectural Key Light: Subtle Emerald/Cyan Studio Wash */}
      <div
        className="absolute -top-48 -left-48 w-[640px] h-[640px] sm:w-[960px] sm:h-[960px] rounded-full opacity-25 dark:opacity-30 blur-[120px] sm:blur-[160px] bg-[radial-gradient(circle,rgba(56,232,198,0.22)_0%,rgba(13,93,80,0.08)_48%,transparent_72%)]"
      />

      {/* Right-Center Warm Rim Light: Restrained Anodized Bronze Accent */}
      <div
        className="absolute top-[28%] -right-48 w-[560px] h-[560px] sm:w-[820px] sm:h-[820px] rounded-full opacity-20 dark:opacity-25 blur-[130px] sm:blur-[170px] bg-[radial-gradient(circle,rgba(230,179,102,0.18)_0%,rgba(163,111,57,0.06)_52%,transparent_72%)]"
      />

      {/* Bottom-Left Deep Studio Fill */}
      <div
        className="absolute -bottom-48 left-1/4 w-[520px] h-[520px] sm:w-[760px] sm:h-[760px] rounded-full opacity-15 dark:opacity-20 blur-[130px] sm:blur-[160px] bg-[radial-gradient(circle,rgba(56,232,198,0.16)_0%,transparent_68%)]"
      />
    </div>
  )
}
