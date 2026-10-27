import React, { useState, useMemo, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import {
  Users,
  Search,
  ArrowUpRight,
  Mail,
  ShieldCheck,
  FileText,
  LayoutGrid,
  List,
  X,
  ArrowRight,
  Sliders,
} from 'lucide-react'
import PAPA_ARTISTS from '../data/papaArtists.json'

interface Artist {
  id: string
  name: string
  handle: string
  instagram: string
  image: string
}

type AlphaBand = 'ALL' | 'A-F' | 'G-M' | 'N-S' | 'T-Z'
type RosterViewMode = 'grid' | 'directory'

const ALPHA_BANDS: { id: AlphaBand; label: string }[] = [
  { id: 'ALL', label: 'All Roster' },
  { id: 'A-F', label: 'A - F' },
  { id: 'G-M', label: 'G - M' },
  { id: 'N-S', label: 'N - S' },
  { id: 'T-Z', label: 'T - Z' },
]

function matchesAlphaBand(name: string, band: AlphaBand): boolean {
  if (band === 'ALL') return true
  const firstChar = name.trim().charAt(0).toUpperCase()
  if (band === 'A-F') return firstChar >= 'A' && firstChar <= 'F'
  if (band === 'G-M') return firstChar >= 'G' && firstChar <= 'M'
  if (band === 'N-S') return firstChar >= 'N' && firstChar <= 'S'
  if (band === 'T-Z') return firstChar >= 'T' && firstChar <= 'Z'
  return true
}

function formatRosterIndex(index: number): string {
  return `NO. ${String(index + 1).padStart(2, '0')}`
}

export const SponsorshipArtistsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [activeBand, setActiveBand] = useState<AlphaBand>('ALL')
  const [viewMode, setViewMode] = useState<RosterViewMode>('grid')
  const [selectedArtist, setSelectedArtist] = useState<{
    artist: Artist
    rosterIndex: string
  } | null>(null)

  const allArtists = PAPA_ARTISTS as Artist[]

  // Close modal on Escape key
  useEffect(() => {
    if (!selectedArtist) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedArtist(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedArtist])

  // Filter by authentic artist name, Instagram handle, and alphabetical index
  const filteredArtists = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return allArtists
      .map((artist, idx) => ({
        artist,
        rosterIndex: formatRosterIndex(idx),
      }))
      .filter(({ artist }) => {
        if (!matchesAlphaBand(artist.name, activeBand)) return false
        if (!q) return true
        const nameMatch = artist.name.toLowerCase().includes(q)
        const handleMatch = artist.handle.toLowerCase().includes(q)
        return nameMatch || handleMatch
      })
  }, [allArtists, searchQuery, activeBand])

  return (
    <div className="min-h-[100dvh] bg-[#f5f4f0] dark:bg-[#20222a] text-zinc-900 dark:text-zinc-100 font-sans pb-20 transition-colors duration-200">
      {/* 1. HERO SECTION — SWISS INDUSTRIAL PRO ROSTER */}
      <section className="border-b border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#22252f] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] py-14 sm:py-20">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-[#0d5d50] dark:text-[#38e8c6] text-[11px] font-mono font-bold tracking-wider uppercase">
                <span>OFFICIAL PRO TEAM · SPONSORSHIP DIRECTORY</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-['Montserrat',sans-serif] font-black uppercase tracking-tight text-zinc-950 dark:text-white leading-[1.06]">
                PAPA SPONSORSHIP ARTISTS
              </h1>

              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed max-w-2xl">
                Official roster of {allArtists.length} professional tattoo artists worldwide sponsored by Papa Tattoo Supply rotary machines, click grips, and 316L sterile cartridge systems.
              </p>

              {/* Official Sponsorship Application Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSfgQxxTK1SsF62fydK8bJuJyZ-KIilUX8N-fvpclkZvngMeOA/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 font-mono font-bold uppercase text-xs tracking-wider flex items-center gap-2 hover:bg-[#0d5d50] dark:hover:bg-[#2dd4b5] active:scale-[0.97] transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] shadow-xs cursor-pointer"
                >
                  <span>Join Our Pro Team (Apply Online)</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://drive.google.com/file/d/1zMU7VE6YcrKKkjqP3wMo2H69Fz9SnOr1/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-xl border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-white/25 font-mono font-bold uppercase text-xs tracking-wider flex items-center gap-2 active:scale-[0.97] transition-[transform,border-color,background-color,color] duration-150 ease-[var(--ease-out-strong)] cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-[#0d5d50] dark:text-[#38e8c6]" />
                  <span>Download Application (PDF)</span>
                </a>
              </div>
            </div>

            {/* Right: Pro Roster Telemetry */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-3.5">
              <div className="p-4 rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                  VERIFIED ROSTER
                </div>
                <div className="text-3xl font-black font-mono tabular-nums text-zinc-950 dark:text-white mt-1">
                  {allArtists.length}
                </div>
                <div className="text-[11px] font-mono text-[#0d5d50] dark:text-[#38e8c6] mt-0.5">
                  Sponsored Artists
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                  PRO HARDWARE
                </div>
                <div className="text-3xl font-black font-mono tabular-nums text-zinc-950 dark:text-white mt-1">
                  316L
                </div>
                <div className="text-[11px] font-mono text-[#0d5d50] dark:text-[#38e8c6] mt-0.5">
                  EO Sterile Supply
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ARTIST ROSTER CONTROLS & EXHIBITION GRID */}
      <section className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Control Bar: Count + Alphabetical Index + Search + View Switcher */}
        <div className="rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#22252f] shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] p-4 sm:p-5 mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold tabular-nums text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
              <Users className="w-4 h-4 text-[#0d5d50] dark:text-[#38e8c6]" />
              <span>
                SHOWING {filteredArtists.length} OF {allArtists.length} SPONSORED ARTISTS
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search Input */}
              <div className="relative flex-1 sm:w-72">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  aria-label="Search sponsored artist by name or Instagram handle"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search artist name or @handle..."
                  className="w-full pl-9 pr-8 py-2 rounded-xl border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-xs font-mono text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden focus:border-[#0d5d50] dark:focus:border-[#38e8c6] transition-colors duration-150"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition-colors duration-150 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* View Mode Switcher */}
              <div
                role="group"
                aria-label="Roster layout mode"
                className="inline-flex items-center p-1 rounded-xl border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] self-start sm:self-auto"
              >
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  aria-pressed={viewMode === 'grid'}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold uppercase active:scale-[0.97] transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Portraits</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('directory')}
                  aria-pressed={viewMode === 'directory'}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold uppercase active:scale-[0.97] transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] cursor-pointer ${
                    viewMode === 'directory'
                      ? 'bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>Index</span>
                </button>
              </div>
            </div>
          </div>

          {/* Alphabetical Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#e2dfd8]/70 dark:border-white/[0.06]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mr-1">
              INDEX FILTER:
            </span>
            {ALPHA_BANDS.map(band => {
              const active = activeBand === band.id
              return (
                <button
                  key={band.id}
                  type="button"
                  onClick={() => setActiveBand(band.id)}
                  aria-pressed={active}
                  className={`px-3 py-1 rounded-lg text-[11px] font-mono font-bold uppercase whitespace-nowrap active:scale-[0.97] transition-[transform,background-color,border-color,color] duration-150 ease-[var(--ease-out-strong)] cursor-pointer ${
                    active
                      ? 'bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950'
                      : 'bg-[#f8f7f4] dark:bg-[#181b22] text-zinc-600 dark:text-zinc-400 border border-[#e2dfd8] dark:border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-zinc-400 dark:hover:border-white/25'
                  }`}
                >
                  {band.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Artist Roster Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredArtists.map(({ artist, rosterIndex }, idx) => (
              <article
                key={artist.id}
                className="group rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#22252f] shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden flex flex-col justify-between hover:border-zinc-400 dark:hover:border-white/25 transition-colors duration-200"
              >
                {/* Photo Area: 3:4 Vertical Exhibition Framing */}
                <button
                  type="button"
                  onClick={() => setSelectedArtist({ artist, rosterIndex })}
                  className="relative aspect-[3/4] w-full overflow-hidden bg-[#f8f7f4] dark:bg-[#181b22] text-left cursor-pointer focus:outline-hidden"
                  aria-label={`Inspect pro dossier for ${artist.name}`}
                >
                  <img
                    src={artist.image}
                    alt={artist.name}
                    loading={idx < 4 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="w-full h-full object-cover object-center grayscale group-hover:grayscale-0 scale-100 group-hover:scale-[1.03] transition-[transform,filter] duration-500 ease-[var(--ease-out-strong)]"
                    onError={e => {
                      const target = e.currentTarget
                      target.onerror = null
                      target.src = '/slides/slide_2_premium_cartridges.png'
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-50 group-hover:opacity-25 transition-opacity duration-300 pointer-events-none" />

                  {/* Roster Index Pill */}
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <span className="px-2 py-0.5 rounded-md bg-black/70 border border-white/15 text-white text-[10px] font-mono font-bold tabular-nums uppercase tracking-wider backdrop-blur-xs">
                      {rosterIndex}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 pointer-events-none">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/65 border border-white/15 text-[#38e8c6] text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-xs">
                      PRO TEAM
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <span className="px-2 py-1 rounded-md bg-black/75 border border-white/15 uppercase tracking-wider">
                      Inspect Dossier
                    </span>
                  </div>
                </button>

                {/* Card Body */}
                <div className="p-4.5 border-t border-[#e2dfd8]/80 dark:border-white/[0.06] bg-white dark:bg-[#22252f] space-y-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-bold uppercase tracking-tight text-zinc-950 dark:text-white truncate">
                        {artist.name}
                      </h3>
                      <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                        {artist.handle}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedArtist({ artist, rosterIndex })}
                      className="py-2 px-3 rounded-xl border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-zinc-400 dark:hover:border-white/25 text-zinc-800 dark:text-zinc-200 text-[11px] font-mono font-bold uppercase active:scale-[0.97] transition-[transform,border-color,background-color,color] duration-150 ease-[var(--ease-out-strong)] cursor-pointer"
                    >
                      Dossier
                    </button>

                    <a
                      href={artist.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-xl border border-[#e2dfd8] dark:border-white/[0.08] bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 hover:bg-[#0d5d50] dark:hover:bg-[#2dd4b5] text-[11px] font-mono font-bold uppercase active:scale-[0.97] transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] flex items-center justify-center gap-1 cursor-pointer"
                      title={`Open ${artist.name}'s Instagram`}
                    >
                      <span>Instagram</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Compact Directory Index Mode */
          <div className="rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#22252f] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden divide-y divide-[#e2dfd8]/80 dark:divide-white/[0.06]">
            {filteredArtists.map(({ artist, rosterIndex }) => (
              <div
                key={artist.id}
                className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#f8f7f4] dark:hover:bg-[#181b22] transition-colors duration-150"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="text-xs font-mono font-bold tabular-nums text-[#0d5d50] dark:text-[#38e8c6] w-16 shrink-0">
                    {rosterIndex}
                  </span>
                  <img
                    src={artist.image}
                    alt={artist.name}
                    loading="lazy"
                    decoding="async"
                    className="w-11 h-11 rounded-xl object-cover bg-[#f8f7f4] dark:bg-[#181b22] border border-[#e2dfd8] dark:border-white/[0.08] shrink-0"
                    onError={e => {
                      const target = e.currentTarget
                      target.onerror = null
                      target.src = '/slides/slide_2_premium_cartridges.png'
                    }}
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-bold uppercase text-zinc-950 dark:text-white truncate">
                      {artist.name}
                    </div>
                    <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 truncate">
                      {artist.handle}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedArtist({ artist, rosterIndex })}
                    className="px-3.5 py-2 rounded-xl border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-xs font-mono font-bold uppercase text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-white/25 cursor-pointer active:scale-[0.97] transition-[transform,border-color,background-color,color] duration-150 ease-[var(--ease-out-strong)]"
                  >
                    Inspect Dossier
                  </button>
                  <a
                    href={artist.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 text-xs font-mono font-bold uppercase inline-flex items-center gap-1.5 hover:bg-[#0d5d50] dark:hover:bg-[#2dd4b5] cursor-pointer active:scale-[0.97] transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)]"
                  >
                    <span>Instagram</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state if search returns nothing */}
        {filteredArtists.length === 0 && (
          <div className="text-center py-16 border border-dashed border-[#e2dfd8] dark:border-white/15 rounded-2xl p-8 bg-white dark:bg-[#22252f] space-y-3">
            <div className="font-mono text-xs text-zinc-500">
              No sponsored artists matched &quot;{searchQuery}&quot; in index [{activeBand}].
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setActiveBand('ALL')
              }}
              className="px-4 py-2 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 text-xs font-mono font-bold uppercase active:scale-[0.97] transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] cursor-pointer"
            >
              Reset Roster Filters
            </button>
          </div>
        )}
      </section>

      {/* 3. AUTHENTIC SPONSORSHIP CONNECT BANNER */}
      <section className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <div className="rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#22252f] shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] p-7 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>PAPA ARTIST RELATIONS DESK</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-['Montserrat',sans-serif] font-black uppercase text-zinc-950 dark:text-white">
              APPLY FOR PRO TEAM SPONSORSHIP
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              Working full-time in a licensed studio and running Papa Tattoo apparatus? Submit your portfolio online or download our official Sponsorship Application PDF.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto shrink-0">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfgQxxTK1SsF62fydK8bJuJyZ-KIilUX8N-fvpclkZvngMeOA/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 font-mono font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2 hover:bg-[#0d5d50] dark:hover:bg-[#2dd4b5] active:scale-[0.97] transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] cursor-pointer shadow-xs"
            >
              <span>Apply Online</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <a
              href="https://drive.google.com/file/d/1zMU7VE6YcrKKkjqP3wMo2H69Fz9SnOr1/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-xl border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-white/25 font-mono font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2 active:scale-[0.97] transition-[transform,border-color,background-color,color] duration-150 ease-[var(--ease-out-strong)] cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#0d5d50] dark:text-[#38e8c6]" />
              <span>Application (PDF)</span>
            </a>

            <Link
              to="/contact"
              className="px-4 py-3 rounded-xl border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-white/25 font-mono font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2 active:scale-[0.97] transition-[transform,border-color,background-color,color] duration-150 ease-[var(--ease-out-strong)] cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-[#0d5d50] dark:text-[#38e8c6]" />
              <span>Contact Desk</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. ACCESSIBLE ARTIST DOSSIER MODAL */}
      {selectedArtist && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="artist-dossier-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 dark:bg-black/80 backdrop-blur-xs animate-in fade-in duration-200 ease-[var(--ease-out-strong)] motion-reduce:animate-none"
          onClick={() => setSelectedArtist(null)}
        >
          <div
            className="relative w-full max-w-2xl rounded-2xl border border-[#e2dfd8] dark:border-white/[0.12] bg-white dark:bg-[#22252f] shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_24px_64px_rgba(0,0,0,0.35)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_64px_rgba(0,0,0,0.65)] overflow-hidden animate-in zoom-in-95 fade-in duration-200 ease-[var(--ease-out-strong)] motion-reduce:animate-none"
            onClick={e => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 sm:grid-cols-12">
              <div className="sm:col-span-5 aspect-[4/4] sm:aspect-auto sm:min-h-[340px] bg-[#f8f7f4] dark:bg-[#181b22] relative overflow-hidden">
                <img
                  src={selectedArtist.artist.image}
                  alt={selectedArtist.artist.name}
                  className="sm:absolute sm:inset-0 w-full h-full object-cover object-center"
                  onError={e => {
                    const target = e.currentTarget
                    target.onerror = null
                    target.src = '/slides/slide_2_premium_cartridges.png'
                  }}
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/75 border border-white/15 text-white text-[10px] font-mono font-bold tabular-nums uppercase">
                  {selectedArtist.rosterIndex}
                </span>
              </div>

              <div className="sm:col-span-7 p-6 sm:p-7 flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0d5d50] dark:text-[#38e8c6]">
                        OFFICIAL SPONSORED ARTIST
                      </div>
                      <h2
                        id="artist-dossier-title"
                        className="text-xl sm:text-2xl font-['Montserrat',sans-serif] font-black uppercase text-zinc-950 dark:text-white mt-0.5"
                      >
                        {selectedArtist.artist.name}
                      </h2>
                      <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
                        {selectedArtist.artist.handle}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedArtist(null)}
                      aria-label="Close artist dossier"
                      className="p-2 rounded-xl border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] text-zinc-500 hover:text-zinc-950 dark:hover:text-white active:scale-[0.95] transition-[transform,color,background-color] duration-150 ease-[var(--ease-out-strong)] cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    Verified member of the Papa Tattoo Supply Pro Team roster, equipped with factory-sterilized 316L membrane cartridges and precision direct-drive rotary hardware.
                  </p>

                  {/* Pro Team Hardware Links */}
                  <div className="p-3.5 rounded-xl border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] space-y-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase text-zinc-500">
                      <Sliders className="w-3.5 h-3.5 text-[#0d5d50] dark:text-[#38e8c6]" />
                      <span>PRO TEAM STANDARD ISSUE</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to="/collections"
                        search={{ category: 'cartridges' }}
                        onClick={() => setSelectedArtist(null)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-[#22252f] border border-[#e2dfd8] dark:border-white/[0.08] text-[11px] font-mono font-semibold text-zinc-800 dark:text-zinc-200 hover:border-[#0d5d50] dark:hover:border-[#38e8c6] active:scale-[0.97] transition-[transform,border-color,color] duration-150 ease-[var(--ease-out-strong)]"
                      >
                        <span>316L Cartridges</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                      <Link
                        to="/collections"
                        search={{ category: 'machines' }}
                        onClick={() => setSelectedArtist(null)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-[#22252f] border border-[#e2dfd8] dark:border-white/[0.08] text-[11px] font-mono font-semibold text-zinc-800 dark:text-zinc-200 hover:border-[#0d5d50] dark:hover:border-[#38e8c6] active:scale-[0.97] transition-[transform,border-color,color] duration-150 ease-[var(--ease-out-strong)]"
                      >
                        <span>Rotary Pens</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                      <Link
                        to="/collections"
                        search={{ category: 'grips' }}
                        onClick={() => setSelectedArtist(null)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-[#22252f] border border-[#e2dfd8] dark:border-white/[0.08] text-[11px] font-mono font-semibold text-zinc-800 dark:text-zinc-200 hover:border-[#0d5d50] dark:hover:border-[#38e8c6] active:scale-[0.97] transition-[transform,border-color,color] duration-150 ease-[var(--ease-out-strong)]"
                      >
                        <span>Click Grips</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-[#e2dfd8]/70 dark:border-white/[0.06]">
                  <a
                    href={selectedArtist.artist.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 text-xs font-mono font-bold uppercase inline-flex items-center justify-center gap-1.5 hover:bg-[#0d5d50] dark:hover:bg-[#2dd4b5] active:scale-[0.97] transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)]"
                  >
                    <span>Open Instagram Portfolio</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setSelectedArtist(null)}
                    className="py-2.5 px-4 rounded-xl border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] text-xs font-mono font-bold uppercase text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-white/25 active:scale-[0.97] transition-[transform,border-color,color] duration-150 ease-[var(--ease-out-strong)] cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
