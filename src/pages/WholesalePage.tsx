import React from 'react'
import { Link } from '@tanstack/react-router'
import { StudioB2B } from '../components/studio/StudioB2B'
import { ChevronRight, ShieldCheck, Truck, Percent, Award } from 'lucide-react'

export const WholesalePage: React.FC = () => {
  return (
    <div className="py-8 bg-zinc-50 dark:bg-[#090A0C] min-h-screen text-zinc-900 dark:text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-8">
          <Link to="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            HOME
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-zinc-900 dark:text-[#2EE6CA] font-bold uppercase">
            STUDIO WHOLESALE
          </span>
        </nav>

        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#11141A]">
            <Percent className="w-6 h-6 text-[#0d9488] dark:text-[#2EE6CA] mb-2" />
            <div className="text-xs font-mono font-bold uppercase text-zinc-900 dark:text-white">
              TIERED STUDIO MARGINS
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">
              Up to 35% discount on bulk cartridge orders and hardware sets.
            </div>
          </div>

          <div className="p-5 rounded-xl border border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#11141A]">
            <Truck className="w-6 h-6 text-amber-500 mb-2" />
            <div className="text-xs font-mono font-bold uppercase text-zinc-900 dark:text-white">
              PRIORITY FACTORY LOGISTICS
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">
              Dedicated studio logistics line with expedited customs clearance.
            </div>
          </div>

          <div className="p-5 rounded-xl border border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#11141A]">
            <Award className="w-6 h-6 text-[#0d9488] dark:text-[#2EE6CA] mb-2" />
            <div className="text-xs font-mono font-bold uppercase text-zinc-900 dark:text-white">
              CUSTOM OEM PACKAGING
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">
              Custom studio branding & needle configuration blister printing.
            </div>
          </div>

          <div className="p-5 rounded-xl border border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#11141A]">
            <ShieldCheck className="w-6 h-6 text-[#0d9488] dark:text-[#2EE6CA] mb-2" />
            <div className="text-xs font-mono font-bold uppercase text-zinc-900 dark:text-white">
              DEDICATED ACCOUNT REP
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">
              Direct line via WhatsApp & email for restock schedule management.
            </div>
          </div>
        </div>

        {/* Core Wholesale Application Section */}
        <StudioB2B />
      </div>
    </div>
  )
}
