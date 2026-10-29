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
  { id: 'A-F', label: 'A to F' },
  { id: 'G-M', label: 'G to M' },
  { id: 'N-S', label: 'N to S' },
  { id: 'T-Z', label: 'T to Z' },
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
  return `No. ${String(index + 1).padStart(2, '0')}`
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

  // Filter by artist name, Instagram handle, and alphabetical index
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
    <div className="min-h-[100dvh] bg-[#f5f5f7] dark:bg-black text-[#1d1d1f] dark:text-[#f5f5f7] font-sans pb-24 transition-colors duration-200">
      {/* 1. HERO SECTION */}
      <section className="pt-12 sm:pt-20 pb-12 sm:pb-16">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/[0.045] dark:bg-white/[0.08] text-xs font-medium text-[#86868b]">
                <span>Official Pro Team · Sponsorship Directory</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-semibold tracking-[-0.035em] text-[#1d1d1f] dark:text-[#f5f5f7] leading-[1.06]">
                Papa Sponsorship Artists
              </h1>

              <p className="text-base sm:text-lg text-[#86868b] leading-relaxed max-w-2xl font-normal">
                Official roster of {allArtists.length} professional tattoo artists worldwide sponsored by Papa Tattoo Supply rotary machines, click grips, and 316L sterile cartridge systems.
              </p>

              {/* Official Sponsorship Application Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSfgQxxTK1SsF62fydK8bJuJyZ-KIilUX8N-fvpclkZvngMeOA/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-sm font-medium flex items-center gap-2 hover:opacity-85 active:scale-[0.97] transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] cursor-pointer"
                >
                  <span>Join Our Pro Team (Apply Online)</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                <a
                  href="https://drive.google.com/file/d/1zMU7VE6YcrKKkjqP3wMo2H69Fz9SnOr1/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center gap-2 active:scale-[0.97] transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#86868b]" />
                  <span>Download Application</span>
                </a>
              </div>
            </div>

            {/* Right: Pro Roster Telemetry */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-4">
              <div className="p-6 rounded-[24px] bg-white dark:bg-[#121214] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)] flex flex-col justify-between">
                <div className="text-xs font-medium text-[#86868b]">
                  Verified Roster
                </div>
                <div className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] tabular-nums text-[#1d1d1f] dark:text-[#f5f5f7] mt-3">
                  {allArtists.length}
                </div>
                <div className="text-xs text-[#86868b] mt-1.5 font-medium">
                  Sponsored Artists
                </div>
              </div>

              <div className="p-6 rounded-[24px] bg-white dark:bg-[#121214] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)] flex flex-col justify-between">
                <div className="text-xs font-medium text-[#86868b]">
                  Pro Hardware
                </div>
                <div className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] tabular-nums text-[#1d1d1f] dark:text-[#f5f5f7] mt-3">
                  316L
                </div>
                <div className="text-xs text-[#86868b] mt-1.5 font-medium">
                  EO Sterile Supply
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ARTIST ROSTER CONTROLS & EXHIBITION GRID */}
      <section className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Control Bar: Count + Search + View Switcher + Alphabetical Index */}
        <div className="rounded-[28px] bg-white dark:bg-[#121214] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)] p-5 sm:p-6 mb-10 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-[#86868b]">
              <Users className="w-4 h-4" />
              <span>
                Showing {filteredArtists.length} of {allArtists.length} sponsored artists
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search Input */}
              <div className="relative flex-1 sm:w-72">
                <Search className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  aria-label="Search sponsored artist by name or Instagram handle"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search artist or @handle…"
                  className="w-full pl-9 pr-8 py-2 rounded-full bg-black/[0.045] dark:bg-white/[0.08] text-xs font-medium text-[#1d1d1f] dark:text-white placeholder-[#86868b] focus:outline-hidden focus:ring-2 focus:ring-[#1d1d1f]/15 dark:focus:ring-white/20 transition-all duration-150"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* View Mode Switcher */}
              <div
                role="group"
                aria-label="Roster layout mode"
                className="inline-flex items-center p-1 rounded-full bg-black/[0.05] dark:bg-white/[0.08] self-start sm:self-auto"
              >
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  aria-pressed={viewMode === 'grid'}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium active:scale-[0.97] transition-[background-color,color,transform] duration-150 ease-[var(--ease-out-strong)] cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-2xs'
                      : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Portraits</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('directory')}
                  aria-pressed={viewMode === 'directory'}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium active:scale-[0.97] transition-[background-color,color,transform] duration-150 ease-[var(--ease-out-strong)] cursor-pointer ${
                    viewMode === 'directory'
                      ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-2xs'
                      : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>Index</span>
                </button>
              </div>
            </div>
          </div>

          {/* Alphabetical Filter Pills */}
          <div className="flex items-center gap-2 pt-4 border-t border-black/[0.06] dark:border-white/[0.08] overflow-x-auto no-scrollbar">
            <span className="text-xs font-medium text-[#86868b] mr-1 shrink-0">
              Filter:
            </span>
            <div className="inline-flex items-center gap-1 p-1 rounded-full bg-black/[0.05] dark:bg-white/[0.08] shrink-0">
              {ALPHA_BANDS.map(band => {
                const active = activeBand === band.id
                return (
                  <button
                    key={band.id}
                    type="button"
                    onClick={() => setActiveBand(band.id)}
                    aria-pressed={active}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap active:scale-[0.97] transition-[background-color,color,transform] duration-150 ease-[var(--ease-out-strong)] cursor-pointer ${
                      active
                        ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-2xs'
                        : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                    }`}
                  >
                    {band.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Artist Roster Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredArtists.map(({ artist, rosterIndex }, idx) => (
              <article
                key={artist.id}
                className="group rounded-[28px] bg-white dark:bg-[#121214] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col justify-between hover:shadow-xl transition-[transform,box-shadow] duration-200"
              >
                {/* Photo Area: 3:4 Vertical Exhibition Framing */}
                <button
                  type="button"
                  onClick={() => setSelectedArtist({ artist, rosterIndex })}
                  className="relative aspect-[3/4] w-full overflow-hidden bg-black/[0.045] dark:bg-white/[0.08] text-left cursor-pointer focus:outline-hidden"
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

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none" />

                  {/* Roster Index Pill */}
                  <div className="absolute top-3.5 left-3.5 pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 text-white text-[11px] font-medium tabular-nums backdrop-blur-md">
                      {rosterIndex}
                    </span>
                  </div>

                  <div className="absolute top-3.5 right-3.5 pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 text-[#f5f5f7] text-[11px] font-medium backdrop-blur-md">
                      Pro Team
                    </span>
                  </div>

                  <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-xs text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <span className="px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md font-medium">
                      Inspect Dossier
                    </span>
                  </div>
                </button>

                {/* Card Body */}
                <div className="p-5 border-t border-black/[0.06] dark:border-white/[0.08] space-y-4">
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold tracking-[-0.015em] text-[#1d1d1f] dark:text-[#f5f5f7] truncate">
                      {artist.name}
                    </h3>
                    <div className="text-xs text-[#86868b] truncate mt-0.5 font-normal">
                      {artist.handle}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedArtist({ artist, rosterIndex })}
                      className="py-2 px-3 rounded-full bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] text-[#1d1d1f] dark:text-[#f5f5f7] text-xs font-medium active:scale-[0.97] transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] cursor-pointer text-center"
                    >
                      Dossier
                    </button>

                    <a
                      href={artist.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] hover:opacity-85 text-xs font-medium active:scale-[0.97] transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] flex items-center justify-center gap-1 cursor-pointer"
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
          /* Directory Index Mode */
          <div className="rounded-[28px] bg-white dark:bg-[#121214] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)] overflow-hidden divide-y divide-black/[0.06] dark:divide-white/[0.08]">
            {filteredArtists.map(({ artist, rosterIndex }) => (
              <div
                key={artist.id}
                className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors duration-150"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="text-xs font-medium tabular-nums text-[#86868b] w-14 shrink-0">
                    {rosterIndex}
                  </span>
                  <img
                    src={artist.image}
                    alt={artist.name}
                    loading="lazy"
                    decoding="async"
                    className="w-12 h-12 rounded-2xl object-cover bg-black/[0.05] dark:bg-white/[0.08] shrink-0"
                    onError={e => {
                      const target = e.currentTarget
                      target.onerror = null
                      target.src = '/slides/slide_2_premium_cartridges.png'
                    }}
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] truncate">
                      {artist.name}
                    </div>
                    <div className="text-xs text-[#86868b] truncate mt-0.5">
                      {artist.handle}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedArtist({ artist, rosterIndex })}
                    className="px-4 py-2 rounded-full bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] cursor-pointer active:scale-[0.97] transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)]"
                  >
                    Inspect Dossier
                  </button>
                  <a
                    href={artist.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-xs font-medium inline-flex items-center gap-1.5 hover:opacity-85 cursor-pointer active:scale-[0.97] transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)]"
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
          <div className="text-center py-16 rounded-[28px] p-8 bg-white dark:bg-[#121214] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)] space-y-4">
            <div className="text-sm text-[#86868b]">
              No sponsored artists matched &quot;{searchQuery}&quot; in index [{activeBand}].
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setActiveBand('ALL')
              }}
              className="px-5 py-2.5 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-xs font-medium active:scale-[0.97] transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] cursor-pointer"
            >
              Reset Roster Filters
            </button>
          </div>
        )}
      </section>

      {/* 3. AUTHENTIC SPONSORSHIP CONNECT BANNER */}
      <section className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="rounded-[32px] bg-white dark:bg-[#121214] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)] p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#86868b]">
              <ShieldCheck className="w-4 h-4 text-[#86868b]" />
              <span>Papa Artist Relations Desk</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-semibold tracking-[-0.025em] text-[#1d1d1f] dark:text-[#f5f5f7]">
              Apply for Pro Team Sponsorship
            </h2>
            <p className="text-sm text-[#86868b] leading-relaxed">
              Working full-time in a licensed studio and running Papa Tattoo apparatus? Submit your portfolio online or download our official Sponsorship Application PDF.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto shrink-0">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfgQxxTK1SsF62fydK8bJuJyZ-KIilUX8N-fvpclkZvngMeOA/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-6 py-3.5 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-sm font-medium flex items-center justify-center gap-2 hover:opacity-85 active:scale-[0.97] transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] cursor-pointer"
            >
              <span>Apply Online</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <a
              href="https://drive.google.com/file/d/1zMU7VE6YcrKKkjqP3wMo2H69Fz9SnOr1/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-6 py-3.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] text-[#1d1d1f] dark:text-[#f5f5f7] text-sm font-medium flex items-center justify-center gap-2 active:scale-[0.97] transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#86868b]" />
              <span>Application (PDF)</span>
            </a>

            <Link
              to="/contact"
              className="flex-1 sm:flex-initial px-6 py-3.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] text-[#1d1d1f] dark:text-[#f5f5f7] text-sm font-medium flex items-center justify-center gap-2 active:scale-[0.97] transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] cursor-pointer"
            >
              <Mail className="w-4 h-4 text-[#86868b]" />
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/75 backdrop-blur-md animate-in fade-in duration-200 ease-[var(--ease-out-strong)] motion-reduce:animate-none"
          onClick={() => setSelectedArtist(null)}
        >
          <div
            className="relative w-full max-w-2xl rounded-[32px] bg-white dark:bg-[#1c1c1e] shadow-[0_32px_80px_rgba(0,0,0,0.25)] dark:shadow-[0_32px_80px_rgba(0,0,0,0.7)] overflow-hidden animate-in zoom-in-95 fade-in duration-200 ease-[var(--ease-out-strong)] motion-reduce:animate-none"
            onClick={e => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 sm:grid-cols-12">
              <div className="sm:col-span-5 aspect-[4/4] sm:aspect-auto sm:min-h-[360px] bg-black/[0.045] dark:bg-white/[0.08] relative overflow-hidden">
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
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/65 text-white text-xs font-medium tabular-nums backdrop-blur-md">
                  {selectedArtist.rosterIndex}
                </span>
              </div>

              <div className="sm:col-span-7 p-7 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-medium text-[#86868b]">
                        Official Sponsored Artist
                      </div>
                      <h2
                        id="artist-dossier-title"
                        className="text-2xl font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-[#f5f5f7] mt-1"
                      >
                        {selectedArtist.artist.name}
                      </h2>
                      <div className="text-xs text-[#86868b] mt-0.5">
                        {selectedArtist.artist.handle}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedArtist(null)}
                      aria-label="Close artist dossier"
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-black/[0.05] dark:bg-white/[0.1] hover:bg-black/[0.09] dark:hover:bg-white/[0.16] text-[#1d1d1f]/70 dark:text-[#f5f5f7]/70 hover:text-[#1d1d1f] dark:hover:text-white active:scale-[0.92] transition-[transform,color,background-color] cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                    Verified member of the Papa Tattoo Supply Pro Team roster, equipped with factory-sterilized 316L membrane cartridges and precision direct-drive rotary hardware.
                  </p>

                  {/* Pro Team Hardware Links */}
                  <div className="p-4 rounded-2xl bg-black/[0.035] dark:bg-white/[0.05] space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-[#86868b]">
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Pro Team Standard Issue</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to="/collections"
                        search={{ category: 'cartridges' }}
                        onClick={() => setSelectedArtist(null)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white dark:bg-[#2c2c2e] text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] shadow-2xs active:scale-[0.97] transition-transform duration-150"
                      >
                        <span>316L Cartridges</span>
                        <ArrowRight className="w-3 h-3 text-[#86868b]" />
                      </Link>
                      <Link
                        to="/collections"
                        search={{ category: 'machines' }}
                        onClick={() => setSelectedArtist(null)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white dark:bg-[#2c2c2e] text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] shadow-2xs active:scale-[0.97] transition-transform duration-150"
                      >
                        <span>Rotary Pens</span>
                        <ArrowRight className="w-3 h-3 text-[#86868b]" />
                      </Link>
                      <Link
                        to="/collections"
                        search={{ category: 'grips' }}
                        onClick={() => setSelectedArtist(null)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white dark:bg-[#2c2c2e] text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] shadow-2xs active:scale-[0.97] transition-transform duration-150"
                      >
                        <span>Click Grips</span>
                        <ArrowRight className="w-3 h-3 text-[#86868b]" />
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-black/[0.06] dark:border-white/[0.08]">
                  <a
                    href={selectedArtist.artist.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-5 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-xs font-medium inline-flex items-center justify-center gap-1.5 hover:opacity-85 active:scale-[0.97] transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)]"
                  >
                    <span>Open Instagram Portfolio</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setSelectedArtist(null)}
                    className="py-3 px-5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] active:scale-[0.97] transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] cursor-pointer"
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
