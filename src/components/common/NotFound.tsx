import React from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Compass, Home, ShieldAlert, Sparkles, Layers } from 'lucide-react'

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[500px] h-96 sm:h-[500px] bg-[#2ee6ca]/5 dark:bg-[#2ee6ca]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-xl w-full text-center space-y-8 z-10">
        {/* Engineering Specimen Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold uppercase tracking-widest">
          <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
          <span>REGISTRY 404 · UNMAPPED APPARATUS</span>
        </div>

        {/* Big Code & Title */}
        <div className="space-y-3">
          <div className="text-7xl sm:text-9xl font-black font-mono tracking-tighter text-zinc-950 dark:text-white select-none">
            4<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d9488] via-[#2EE6CA] to-teal-400">0</span>4
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-950 dark:text-white">
            SPECIMEN NOT FOUND
          </h1>
          <p className="text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            The apparatus coordinate or catalog resource does not exist in the Papa Tattoo registry. It may have been relocated, re-indexed, or decommissioned.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-950 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 text-xs font-mono font-bold uppercase tracking-wider shadow-lg hover:shadow-[0_0_24px_rgba(46,230,202,0.3)] transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Browse Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] backdrop-blur-xs text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-white/30 text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
        </div>

        {/* Quick Directory Anchors */}
        <div className="pt-6 border-t border-zinc-200/80 dark:border-white/[0.08]">
          <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest mb-3 flex items-center justify-center gap-1.5">
            <Layers className="w-3 h-3 text-[#0d9488] dark:text-[#2ee6ca]" />
            <span>DIRECT REGISTRY SECTORS</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
            <Link
              to="/collections"
              search={{ category: 'cartridges' }}
              className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] hover:border-[#2ee6ca] dark:hover:border-[#2ee6ca] hover:text-[#0d9488] dark:hover:text-[#2ee6ca] transition-colors"
            >
              Needle Cartridges
            </Link>
            <Link
              to="/collections"
              search={{ category: 'machines' }}
              className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] hover:border-[#2ee6ca] dark:hover:border-[#2ee6ca] hover:text-[#0d9488] dark:hover:text-[#2ee6ca] transition-colors"
            >
              Rotary Machines
            </Link>
            <Link
              to="/collections"
              search={{ category: 'grips' }}
              className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] hover:border-[#2ee6ca] dark:hover:border-[#2ee6ca] hover:text-[#0d9488] dark:hover:text-[#2ee6ca] transition-colors"
            >
              Click Grips
            </Link>
            <Link
              to="/wholesale"
              className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] hover:border-[#2ee6ca] dark:hover:border-[#2ee6ca] hover:text-[#0d9488] dark:hover:text-[#2ee6ca] transition-colors"
            >
              Studio Wholesale
            </Link>
            <Link
              to="/contact"
              className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] hover:border-[#2ee6ca] dark:hover:border-[#2ee6ca] hover:text-[#0d9488] dark:hover:text-[#2ee6ca] transition-colors"
            >
              Factory RMA
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
