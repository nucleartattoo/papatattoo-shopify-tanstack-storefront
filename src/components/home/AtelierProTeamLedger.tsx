import React from 'react'
import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  Truck,
  FileCheck2,
  ShieldCheck,
  Award,
  Sparkles,
} from 'lucide-react'
import PAPA_ARTISTS from '../../data/papaArtists.json'

const FEATURED_ARTISTS = PAPA_ARTISTS.slice(0, 8)

export const AtelierProTeamLedger: React.FC = () => {
  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1440px] mx-auto text-zinc-100">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left 7 Columns: Pro Team Noir Artist Wall */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[11px] font-mono tracking-widest text-zinc-400 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2EE6CA]" />
                <span>Resident Artists</span>
                <span className="text-zinc-600">/</span>
                <span>40+ Worldwide</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-white">
                Official Pro Team Roster.
              </h2>
            </div>

            <Link
              to="/sponsorship-artists"
              className="text-xs font-mono text-zinc-400 hover:text-white inline-flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <span>Full Artist Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {FEATURED_ARTISTS.map(artist => (
              <Link
                key={artist.id}
                to="/sponsorship-artists"
                className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#0E1014] border border-white/[0.08] hover:border-white/25 transition-[transform,border-color] duration-200 hover:-translate-y-1"
              >
                <img
                  src={artist.image}
                  alt={artist.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-center grayscale contrast-125 brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300 ease-[var(--ease-spring)]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"
                />
                <div className="absolute bottom-3 inset-x-3 text-left">
                  <div className="text-xs font-semibold text-white truncate">
                    {artist.name}
                  </div>
                  <div className="text-[11px] font-mono text-zinc-400 truncate">
                    {artist.handle}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right 5 Columns: Atelier Studio Ledger & Wholesale Guarantees */}
        <div className="lg:col-span-5 rounded-[32px] bg-[#0E1014] border border-white/[0.08] p-8 sm:p-10 divide-y divide-white/[0.06] shadow-[0_24px_50px_rgba(0,0,0,0.6)]">
          {/* Item 1: Express Dispatch */}
          <div className="pb-6 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-[#2EE6CA]">
                AIR LOGISTICS
              </span>
              <Truck className="w-4 h-4 text-zinc-400" />
            </div>
            <h3 className="text-lg font-semibold text-white tracking-[-0.015em]">
              40+ Countries Priority Air Dispatch
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
              Priority air logistics and verified regional distributors serving tattoo studios across North America, Europe, United Kingdom, and Australia.
            </p>
            <div className="pt-1">
              <Link
                to="/distributors"
                className="text-xs font-mono text-zinc-300 hover:text-[#2EE6CA] inline-flex items-center gap-1 transition-colors"
              >
                <span>Authorized Distributors</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Item 2: Cleanroom Sterility */}
          <div className="py-6 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-[#2EE6CA]">
                CLEANROOM STANDARD
              </span>
              <FileCheck2 className="w-4 h-4 text-zinc-400" />
            </div>
            <h3 className="text-lg font-semibold text-white tracking-[-0.015em]">
              Class 100,000 ISO Sterility
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
              Every cartridge needle and disposable grip is individually blister-sealed and certified with chemical EO Gas batch reaction indicators.
            </p>
            <div className="pt-1">
              <Link
                to="/about"
                className="text-xs font-mono text-zinc-300 hover:text-[#2EE6CA] inline-flex items-center gap-1 transition-colors"
              >
                <span>Engineering Standards</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Item 3: Factory Direct Wholesale */}
          <div className="pt-6 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-[#2EE6CA]">
                FACTORY WHOLESALE
              </span>
              <ShieldCheck className="w-4 h-4 text-zinc-400" />
            </div>
            <h3 className="text-lg font-semibold text-white tracking-[-0.015em]">
              Direct Factory Warranty &amp; Studio Tier
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
              Dedicated studio volume deductions, custom anodized batch runs, and in-house rotary motor servicing with zero third-party markups.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
