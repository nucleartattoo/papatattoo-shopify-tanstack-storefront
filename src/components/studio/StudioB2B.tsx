import React from 'react'
import { Link } from '@tanstack/react-router'
import { useLocale } from '../../context/LocaleContext'
import { Box, Truck, FileCheck2, Mail, ExternalLink, ArrowRight, ShieldCheck, Zap } from 'lucide-react'

export const StudioB2B: React.FC = () => {
  const { t } = useLocale()

  return (
    <section className="py-20 sm:py-24 border-t border-b border-zinc-200/70 dark:border-zinc-800/70 bg-gradient-to-b from-zinc-50 to-white dark:from-[#06070a] dark:to-[#0a0d14] relative overflow-hidden">
      {/* Background Cyber Glow & Grid */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#00f0ff]/5 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 sacred-grid-bg opacity-15 pointer-events-none" />

      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-black text-zinc-950 dark:text-white uppercase tracking-tight font-sans">
            STUDIO & WHOLESALE SUPPLY
          </h2>

          <p className="mt-4 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
            Direct factory pricing, custom batch orders, and dedicated accounts for professional studios and distributors worldwide.
          </p>
        </div>

        {/* 3 Core Commercial Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-8">
          {/* Pillar 1 */}
          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0b0e14] p-7 flex flex-col justify-between hover:border-zinc-400 dark:hover:border-[#00f0ff]/50 transition-all shadow-xs dark:hover:shadow-[0_0_25px_rgba(0,240,255,0.12)] hud-corner-bracket">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-widest">FACTORY DIRECT</span>
                <Box className="w-5 h-5 text-zinc-400" />
              </div>
              <div className="text-xl font-black text-zinc-950 dark:text-white uppercase font-sans">
                STERILE BATCH INVENTORY
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2.5 leading-relaxed font-sans">
                Medical-grade surgical steel cartridges and CNC machined apparatus directly from our central manufacturing warehouse.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 text-[11px] font-mono text-zinc-500 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-500" />
              <span>Certified Batch Sterilization</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="rounded-2xl border-2 border-teal-600/60 dark:border-[#00f0ff] bg-white dark:bg-[#0e121a] p-7 flex flex-col justify-between relative shadow-md dark:shadow-[0_0_30px_rgba(0,240,255,0.15)] hud-corner-bracket">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0d9488] dark:bg-[#00f0ff] text-white dark:text-zinc-950 text-[10px] font-mono font-black uppercase tracking-widest px-3.5 py-0.5 rounded-full shadow-xs">
              WORLDWIDE
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono font-bold text-[#0d9488] dark:text-[#00f0ff] uppercase tracking-widest">EXPRESS SHIPPING</span>
                <Truck className="w-5 h-5 text-[#0d9488] dark:text-[#00f0ff]" />
              </div>
              <div className="text-xl font-black text-zinc-950 dark:text-white uppercase font-sans">
                PRIORITY WORLDWIDE TRANSIT
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2.5 leading-relaxed font-sans">
                Expedited international logistics with dedicated customs clearance for tattoo studios and supply stores across 40+ countries.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 text-[11px] font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#00f0ff]" />
              <span>Priority Warehouse Dispatch</span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0b0e14] p-7 flex flex-col justify-between hover:border-zinc-400 dark:hover:border-[#00f0ff]/50 transition-all shadow-xs dark:hover:shadow-[0_0_25px_rgba(0,240,255,0.12)] hud-corner-bracket">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-widest">STUDIO ACCOUNTS</span>
                <ShieldCheck className="w-5 h-5 text-zinc-400" />
              </div>
              <div className="text-xl font-black text-zinc-950 dark:text-white uppercase font-sans">
                VOLUME TIER PRICING
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2.5 leading-relaxed font-sans">
                Tiered volume discounts, pro invoicing, and dedicated commercial support for verified studios and retail partners.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 text-[11px] font-mono text-zinc-500 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Commercial Account Service</span>
            </div>
          </div>
        </div>

        {/* Official Contact Dispatch Strip */}
        <div className="mt-12 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-[#090c12] p-7 flex flex-wrap items-center justify-between gap-6 hud-corner-bracket">
          <div>
            <div className="text-xs font-mono font-bold text-zinc-950 dark:text-zinc-200 uppercase tracking-wider">
              NEED CUSTOM INVOICE OR STUDIO CONTRACT?
            </div>
            <div className="text-xs text-zinc-500 mt-0.5 font-sans">
              Direct inquiries dispatched to our central manufacturing liaison.
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
            <Link
              to="/wholesale"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-950 text-white dark:bg-[#00f0ff] dark:text-zinc-950 font-bold uppercase tracking-wider hover:shadow-[0_0_15px_rgba(0,240,255,0.35)] transition-all"
            >
              <span>Wholesale Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <a
              href="mailto:papatattoosupply@gmail.com"
              className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 hover:text-[#0d9488] dark:hover:text-[#00f0ff] transition-colors"
            >
              <Mail className="w-4 h-4 text-[#0d9488] dark:text-[#00f0ff]" />
              <span>papatattoosupply@gmail.com</span>
            </a>

            <a
              href="https://instagram.com/papatattoosupply"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 hover:text-[#0d9488] dark:hover:text-[#00f0ff] transition-colors"
            >
              <svg className="w-4 h-4 text-[#0d9488] dark:text-[#00f0ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
              <span>@papatattoosupply</span>
            </a>

            <a
              href="https://www.papatattoo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 hover:text-[#0d9488] dark:hover:text-[#00f0ff] transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-[#0d9488] dark:text-[#00f0ff]" />
              <span>www.papatattoo.com</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
