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
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[500px] h-96 sm:h-[500px] bg-red-500/5 dark:bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-lg w-full text-center space-y-6 z-10">
        {/* Hardware Exception Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-mono font-bold uppercase tracking-widest">
          <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
          <span>APPARATUS EXCEPTION · PROTOCOL RECOVERY</span>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-950 dark:text-white">
            EXECUTION INTERRUPTED
          </h1>
          <p className="text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            The storefront connection encountered an unexpected latency or data stream interruption.
          </p>
        </div>

        {/* Technical Notice Box (Sanitized) */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/70 dark:bg-[#14171E]/80 backdrop-blur-xs text-left">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-1 flex items-center gap-1.5">
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-950 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 text-xs font-mono font-bold uppercase tracking-wider shadow-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>RETRY CONNECTION</span>
          </button>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.04] backdrop-blur-xs text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-white/30 text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>RETURN HOME</span>
          </Link>
        </div>

        {/* Support Link */}
        <div className="pt-4 text-xs font-mono text-zinc-400 flex items-center justify-center gap-2">
          <span>Need urgent support?</span>
          <a
            href="mailto:papatattoosupply@gmail.com"
            className="text-[#0d9488] dark:text-[#2EE6CA] hover:underline flex items-center gap-1"
          >
            <Mail className="w-3 h-3" />
            <span>papatattoosupply@gmail.com</span>
          </a>
        </div>
      </div>
    </div>
  )
}
