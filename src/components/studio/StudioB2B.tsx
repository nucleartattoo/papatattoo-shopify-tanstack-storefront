import React from 'react'
import { useLocale } from '../../context/LocaleContext'
import { Award, Box, Truck, FileCheck2, Mail, ExternalLink } from 'lucide-react'

export const StudioB2B: React.FC = () => {
  const { t } = useLocale()

  return (
    <section className="py-20 border-t border-b border-zinc-200 dark:border-[#222731] bg-gradient-to-b from-zinc-100 to-white dark:from-[#090A0C] dark:to-[#0F1218] relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#2EE6CA]/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-600/30 dark:border-[#2EE6CA]/30 bg-teal-500/10 dark:bg-[#2EE6CA]/10 text-teal-700 dark:text-[#2EE6CA] text-[10px] font-mono font-bold uppercase tracking-widest mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>COMMERCIAL ALLOCATION</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-zinc-950 dark:text-white uppercase tracking-tight font-sans">
            {t('studio_banner_title')}
          </h2>

          <p className="mt-4 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {t('studio_banner_desc')}
          </p>
        </div>

        {/* Volume Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tier 1 */}
          <div className="rounded-xl border border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#14171E] p-6 flex flex-col justify-between hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono font-bold text-zinc-500 uppercase">TIER I · STUDIO STARTER</span>
                <Box className="w-5 h-5 text-zinc-400" />
              </div>
              <div className="text-2xl font-black text-zinc-950 dark:text-white uppercase font-sans">
                {t('studio_tier_1')}
              </div>
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                Ideal for independent artists stocking backup machine grips and primary daily stations.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-[#1E232E] text-[11px] font-mono text-zinc-500 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-500" />
              <span>Standard Batch Certificate</span>
            </div>
          </div>

          {/* Tier 2 */}
          <div className="rounded-xl border-2 border-teal-600/60 dark:border-[#2EE6CA] bg-white dark:bg-[#151922] p-6 flex flex-col justify-between relative shadow-lg dark:shadow-[0_0_30px_rgba(46,230,202,0.15)]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0d9488] dark:bg-[#2EE6CA] text-white dark:text-zinc-950 text-[10px] font-mono font-black uppercase tracking-widest px-3 py-0.5 rounded-full">
              MOST POPULAR FOR SHOPS
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono font-bold text-[#0d9488] dark:text-[#2EE6CA] uppercase">TIER II · PARLOR ALLIANCE</span>
                <Truck className="w-5 h-5 text-[#0d9488] dark:text-[#2EE6CA]" />
              </div>
              <div className="text-2xl font-black text-zinc-950 dark:text-white uppercase font-sans">
                {t('studio_tier_2')}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                Tailored for multi-station tattoo parlors. Mix & match across all anodized colorways (Black, Blue, Silver, Pink, Green).
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-[#1E232E] text-[11px] font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#2EE6CA]" />
              <span>Priority Warehouse Dispatch</span>
            </div>
          </div>

          {/* Tier 3 */}
          <div className="rounded-xl border border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#14171E] p-6 flex flex-col justify-between hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono font-bold text-zinc-500 uppercase">TIER III · MASTER DISTRO</span>
                <Award className="w-5 h-5 text-zinc-400" />
              </div>
              <div className="text-2xl font-black text-zinc-950 dark:text-white uppercase font-sans">
                {t('studio_tier_3')}
              </div>
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                Full studio outfit with custom studio laser logo marking and dedicated account concierge.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-[#1E232E] text-[11px] font-mono text-zinc-500 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Dedicated Commercial Line</span>
            </div>
          </div>
        </div>

        {/* Official Contact Dispatch Strip */}
        <div className="mt-12 rounded-xl border border-zinc-200 dark:border-[#222731] bg-zinc-50 dark:bg-[#101217] p-6 flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="text-xs font-mono font-bold text-zinc-950 dark:text-zinc-200 uppercase tracking-wider">
              NEED CUSTOM INVOICE OR STUDIO CONTRACT?
            </div>
            <div className="text-xs text-zinc-500 mt-0.5">
              Direct inquiries dispatched to our central manufacturing liaison.
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
            <a
              href="mailto:papatattoosupply@gmail.com"
              className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 hover:text-[#0d9488] dark:hover:text-[#2EE6CA] transition-colors"
            >
              <Mail className="w-4 h-4 text-[#0d9488] dark:text-[#2EE6CA]" />
              <span>papatattoosupply@gmail.com</span>
            </a>

            <a
              href="https://instagram.com/papatattoosupply"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 hover:text-[#0d9488] dark:hover:text-[#2EE6CA] transition-colors"
            >
              <svg className="w-4 h-4 text-[#0d9488] dark:text-[#2EE6CA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 hover:text-[#0d9488] dark:hover:text-[#2EE6CA] transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-[#0d9488] dark:text-[#2EE6CA]" />
              <span>www.papatattoo.com</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
