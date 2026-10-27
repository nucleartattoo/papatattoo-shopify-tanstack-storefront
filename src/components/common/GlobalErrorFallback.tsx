import React from 'react'
import { Link } from '@tanstack/react-router'
import { AlertTriangle, RefreshCw, Home, Mail, ShieldAlert } from 'lucide-react'

interface GlobalErrorFallbackProps {
  error?: unknown
  reset?: () => void
}

export const GlobalErrorFallback: React.FC<GlobalErrorFallbackProps> = ({ error, reset }) => {
  const errorMessage =
    error instanceof Error ? error.message : 'An unexpected storefront execution failure occurred.'

  return (
    <div className="min-h-[calc(100dvh-160px)] bg-[#f5f4f0] dark:bg-[#20222a] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-200">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[500px] h-96 sm:h-[500px] bg-red-500/5 dark:bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-lg w-full rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#22252f] shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_12px_32px_rgba(0,0,0,0.04)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_16px_40px_rgba(0,0,0,0.35)] p-8 sm:p-10 text-center space-y-6 z-10">
        {/* Hardware Exception Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 text-[11px] font-mono font-bold uppercase tracking-widest">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>APPARATUS EXCEPTION · PROTOCOL RECOVERY</span>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="font-['Montserrat',sans-serif] text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-950 dark:text-white">
            EXECUTION INTERRUPTED
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            The storefront connection encountered an unexpected latency or data stream interruption.
          </p>
        </div>

        {/* Technical Notice Box (Sanitized) */}
        <div className="p-4 rounded-xl border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-left">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1 flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3 text-amber-500" />
            <span>DIAGNOSTIC STATUS</span>
          </div>
          <div className="text-xs font-mono text-zinc-700 dark:text-zinc-300 break-words line-clamp-2">
            {errorMessage}
          </div>
        </div>

        {/* Recovery Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              if (reset) {
                reset()
              } else if (typeof window !== 'undefined') {
                window.location.reload()
              }
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#0d5d50] dark:hover:bg-[#2dd4b5] active:scale-[0.97] transition-[transform,background-color,color,box-shadow] duration-150 ease-[var(--ease-out-strong)] cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-4 h-4" />
            <span>RETRY CONNECTION</span>
          </button>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-zinc-800 dark:text-zinc-200 hover:border-[#0d5d50]/40 dark:hover:border-[#38e8c6]/40 text-xs font-mono font-bold uppercase tracking-wider active:scale-[0.97] transition-[transform,border-color,color] duration-150 ease-[var(--ease-out-strong)] cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>RETURN HOME</span>
          </Link>
        </div>

        {/* Support Link */}
        <div className="pt-4 border-t border-[#e2dfd8] dark:border-white/[0.08] text-xs font-mono text-zinc-500 dark:text-zinc-400 flex items-center justify-center gap-2">
          <span>Need urgent support?</span>
          <a
            href="mailto:papatattoosupply@gmail.com"
            className="text-[#0d5d50] dark:text-[#38e8c6] font-bold hover:underline flex items-center gap-1"
          >
            <Mail className="w-3 h-3" />
            <span>papatattoosupply@gmail.com</span>
          </a>
        </div>
      </div>
    </div>
  )
}
