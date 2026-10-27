import React from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Compass, Home, ShieldAlert, Layers } from 'lucide-react'

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[calc(100dvh-160px)] bg-[#f5f4f0] dark:bg-[#20222a] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-200">
      {/* Background ambient accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[500px] h-96 sm:h-[500px] bg-[#0d5d50]/5 dark:bg-[#38e8c6]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-xl w-full rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#22252f] shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_12px_32px_rgba(0,0,0,0.04)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_16px_40px_rgba(0,0,0,0.35)] p-8 sm:p-10 text-center space-y-7 z-10">
        {/* Engineering Specimen Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-[#0d5d50] dark:text-[#38e8c6] text-[11px] font-mono font-bold uppercase tracking-widest">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>HTTP 404 · UNMAPPED CATALOG ROUTE</span>
        </div>

        {/* Big Code & Title */}
        <div className="space-y-3">
          <div className="text-7xl sm:text-8xl font-black font-mono tabular-nums tracking-tighter text-zinc-950 dark:text-white select-none">
            4<span className="text-[#0d5d50] dark:text-[#38e8c6]">0</span>4
          </div>
          <h1 className="font-['Montserrat',sans-serif] text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-950 dark:text-white">
            SPECIMEN NOT FOUND
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            The apparatus coordinate or catalog resource does not exist in the Papa Tattoo registry. It may have been relocated, re-indexed, or decommissioned.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#0d5d50] dark:hover:bg-[#2dd4b5] active:scale-[0.97] transition-[transform,background-color,color,box-shadow] duration-150 ease-[var(--ease-out-strong)] cursor-pointer shadow-xs"
          >
            <Compass className="w-4 h-4" />
            <span>Browse Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-zinc-800 dark:text-zinc-200 hover:border-[#0d5d50]/40 dark:hover:border-[#38e8c6]/40 text-xs font-mono font-bold uppercase tracking-wider active:scale-[0.97] transition-[transform,border-color,color] duration-150 ease-[var(--ease-out-strong)] cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
        </div>

        {/* Quick Directory Anchors */}
        <div className="pt-6 border-t border-[#e2dfd8] dark:border-white/[0.08]">
          <div className="text-[11px] font-mono font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-3 flex items-center justify-center gap-1.5">
            <Layers className="w-3 h-3 text-[#0d5d50] dark:text-[#38e8c6]" />
            <span>DIRECT CATALOG SECTORS</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
            <Link
              to="/collections"
              search={{ category: 'cartridges' }}
              className="px-3 py-1.5 rounded-lg border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-zinc-700 dark:text-zinc-300 hover:border-[#0d5d50]/40 dark:hover:border-[#38e8c6]/40 hover:text-[#0d5d50] dark:hover:text-[#38e8c6] active:scale-[0.97] transition-[transform,border-color,color] duration-150 ease-[var(--ease-out-strong)]"
            >
              Needle Cartridges
            </Link>
            <Link
              to="/collections"
              search={{ category: 'machines' }}
              className="px-3 py-1.5 rounded-lg border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-zinc-700 dark:text-zinc-300 hover:border-[#0d5d50]/40 dark:hover:border-[#38e8c6]/40 hover:text-[#0d5d50] dark:hover:text-[#38e8c6] active:scale-[0.97] transition-[transform,border-color,color] duration-150 ease-[var(--ease-out-strong)]"
            >
              Rotary Machines
            </Link>
            <Link
              to="/collections"
              search={{ category: 'grips' }}
              className="px-3 py-1.5 rounded-lg border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-zinc-700 dark:text-zinc-300 hover:border-[#0d5d50]/40 dark:hover:border-[#38e8c6]/40 hover:text-[#0d5d50] dark:hover:text-[#38e8c6] active:scale-[0.97] transition-[transform,border-color,color] duration-150 ease-[var(--ease-out-strong)]"
            >
              Click Grips
            </Link>
            <Link
              to="/distributors"
              className="px-3 py-1.5 rounded-lg border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-zinc-700 dark:text-zinc-300 hover:border-[#0d5d50]/40 dark:hover:border-[#38e8c6]/40 hover:text-[#0d5d50] dark:hover:text-[#38e8c6] active:scale-[0.97] transition-[transform,border-color,color] duration-150 ease-[var(--ease-out-strong)]"
            >
              Distributors
            </Link>
            <Link
              to="/contact"
              className="px-3 py-1.5 rounded-lg border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-zinc-700 dark:text-zinc-300 hover:border-[#0d5d50]/40 dark:hover:border-[#38e8c6]/40 hover:text-[#0d5d50] dark:hover:text-[#38e8c6] active:scale-[0.97] transition-[transform,border-color,color] duration-150 ease-[var(--ease-out-strong)]"
            >
              Factory RMA
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
