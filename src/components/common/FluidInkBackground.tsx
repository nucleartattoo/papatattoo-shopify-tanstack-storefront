import React from 'react'

export const FluidInkBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
    >
      {/* Ink Cloud 1: Deep Emerald Tattoo Pigment (Top-Left Drift) */}
      <div
        className="absolute -top-32 -left-32 w-[600px] h-[600px] sm:w-[900px] sm:h-[900px] rounded-full opacity-70 dark:opacity-85 blur-[90px] sm:blur-[130px] bg-[radial-gradient(circle,rgba(56,232,198,0.35)_0%,rgba(13,93,80,0.18)_45%,transparent_70%)] animate-[fluid-ink-drift_22s_ease-in-out_infinite_alternate]"
      />

      {/* Ink Cloud 2: Warm Artisan Amber Pigment Swirl (Right-Center Swirl) */}
      <div
        className="absolute top-[30%] -right-32 w-[550px] h-[550px] sm:w-[850px] sm:h-[850px] rounded-full opacity-65 dark:opacity-80 blur-[90px] sm:blur-[140px] bg-[radial-gradient(circle,rgba(230,179,102,0.30)_0%,rgba(163,111,57,0.14)_50%,transparent_70%)] animate-[fluid-ink-drift-reverse_26s_ease-in-out_infinite_alternate]"
      />

      {/* Ink Cloud 3: Midnight Cyan & Emerald Smoke (Left-Bottom Drift) */}
      <div
        className="absolute top-[65%] -left-28 w-[500px] h-[500px] sm:w-[750px] sm:h-[750px] rounded-full opacity-60 dark:opacity-75 blur-[100px] sm:blur-[150px] bg-[radial-gradient(circle,rgba(56,232,198,0.28)_0%,rgba(20,80,70,0.12)_50%,transparent_70%)] animate-[fluid-ink-drift_20s_ease-in-out_infinite_alternate]"
      />

      {/* Ink Cloud 4: Golden Bronze Crucible Glow (Bottom-Right Anchor) */}
      <div
        className="absolute -bottom-28 right-1/4 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full opacity-55 dark:opacity-70 blur-[100px] sm:blur-[140px] bg-[radial-gradient(circle,rgba(230,179,102,0.25)_0%,transparent_65%)] animate-[fluid-ink-pulse_18s_ease-in-out_infinite_alternate]"
      />
    </div>
  )
}
