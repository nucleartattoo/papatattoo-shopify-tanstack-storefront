import React, { useState, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import {
  Users,
  Search,
  ArrowUpRight,
  Sparkles,
  Mail,
  ShieldCheck,
  FileText,
} from 'lucide-react'
import PAPA_ARTISTS from '../data/papaArtists.json'

interface Artist {
  id: string
  name: string
  handle: string
  instagram: string
  image: string
}

export const SponsorshipArtistsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Filter purely by authentic artist name or Instagram handle
  const filteredArtists = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return PAPA_ARTISTS as Artist[]

    return (PAPA_ARTISTS as Artist[]).filter(artist => {
      const nameMatch = artist.name.toLowerCase().includes(q)
      const handleMatch = artist.handle.toLowerCase().includes(q)
      return nameMatch || handleMatch
    })
  }, [searchQuery])

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#090A0C] text-zinc-900 dark:text-zinc-100 font-sans pb-20 transition-colors duration-200">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-[#1E232E] bg-white dark:bg-[#0E1015] py-16 sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(#2ee6ca_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        <div className="absolute -top-32 right-1/4 w-96 h-96 bg-[#2EE6CA]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2EE6CA]/30 bg-[#2EE6CA]/10 text-[#0d9488] dark:text-[#2EE6CA] text-xs font-mono font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OFFICIAL PRO TEAM // SPONSORSHIP DIRECTORY</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-zinc-950 dark:text-white leading-tight">
              PAPA SPONSORSHIP{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d9488] to-[#2EE6CA]">
                ARTISTS
              </span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              Official roster of professional tattoo artists worldwide sponsored by Papa Tattoo Supply apparatus &amp; precision cartridge needles.
            </p>

            {/* Official Sponsorship Application Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSfgQxxTK1SsF62fydK8bJuJyZ-KIilUX8N-fvpclkZvngMeOA/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 font-mono font-bold uppercase text-xs tracking-wider flex items-center gap-2 hover:bg-zinc-800 dark:hover:bg-[#26cbb1] active:scale-[0.99] transition-all shadow-sm cursor-pointer"
              >
                <span>JOIN OUR TEAM (APPLY ONLINE)</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://drive.google.com/file/d/1zMU7VE6YcrKKkjqP3wMo2H69Fz9SnOr1/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#14171E] text-zinc-700 dark:text-zinc-300 hover:text-[#0d9488] dark:hover:text-[#2EE6CA] hover:border-[#0d9488] dark:hover:border-[#2EE6CA] font-mono font-bold uppercase text-xs tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                <span>DOWNLOAD APPLICATION (PDF)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ARTIST ROSTER & SEARCH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Search & Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-zinc-200 dark:border-[#1E232E]">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
            <Users className="w-4 h-4 text-[#0d9488] dark:text-[#2EE6CA]" />
            <span>
              OFFICIAL ROSTER ({filteredArtists.length} / {PAPA_ARTISTS.length} PRO ARTISTS)
            </span>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72 md:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search artist or @handle..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#12151B] text-xs font-mono text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden focus:border-[#0d9488] dark:focus:border-[#2EE6CA] focus:ring-2 focus:ring-[#2EE6CA]/15 transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Artist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredArtists.map(artist => (
            <div
              key={artist.id}
              className="group rounded-2xl border border-zinc-200 dark:border-[#1E232E] bg-white dark:bg-[#0E1015] overflow-hidden flex flex-col justify-between hover:border-[#0d9488] dark:hover:border-[#2EE6CA]/60 transition-all duration-300 shadow-xs hover:shadow-xl hover:-translate-y-1"
            >
              {/* Photo Area */}
              <div className="relative aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                <img
                  src={artist.image}
                  alt={artist.name}
                  decoding="async"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  onError={e => {
                    const target = e.currentTarget
                    target.onerror = null
                    target.src =
                      'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=600&q=80'
                  }}
                />

                {/* Top Badge */}
                <div className="absolute top-3 right-3 pointer-events-none">
                  <span className="px-2 py-0.5 rounded-md bg-zinc-950/80 dark:bg-[#2EE6CA] text-white dark:text-zinc-950 text-[10px] font-mono font-black uppercase tracking-wider backdrop-blur-md shadow-xs">
                    PAPA PRO
                  </span>
                </div>
              </div>

              {/* Card Body: Name, Handle & Link */}
              <div className="p-4 border-t border-zinc-100 dark:border-[#1A1D24] bg-white dark:bg-[#0E1015] space-y-3">
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight text-zinc-950 dark:text-white truncate">
                    {artist.name}
                  </h3>
                  <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                    {artist.handle}
                  </div>
                </div>

                <a
                  href={artist.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl border border-zinc-200 dark:border-[#222731] bg-zinc-50 dark:bg-[#141720] hover:bg-zinc-100 dark:hover:bg-[#1C212B] text-zinc-800 dark:text-zinc-200 hover:text-[#0d9488] dark:hover:text-[#2EE6CA] hover:border-[#0d9488] dark:hover:border-[#2EE6CA] text-xs font-mono font-bold transition-all flex items-center justify-between cursor-pointer"
                  title={`Open ${artist.name}'s Instagram`}
                >
                  <span className="flex items-center gap-1.5">
                    <svg
                      className="w-3.5 h-3.5 text-[#0d9488] dark:text-[#2EE6CA]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                    <span>Instagram</span>
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#2EE6CA]" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state if search returns nothing */}
        {filteredArtists.length === 0 && (
          <div className="text-center py-16 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl p-8 font-mono text-xs text-zinc-500">
            No artists found matching &quot;{searchQuery}&quot;. Try searching another artist name or handle.
          </div>
        )}
      </section>

      {/* 3. AUTHENTIC SPONSORSHIP CONNECT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="rounded-3xl border border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#0E1015] shadow-xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#0d9488] dark:text-[#2EE6CA] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>PAPA ARTIST RELATIONS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-zinc-950 dark:text-white">
              CONNECT WITH PAPA TATTOO
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              Interested in joining the Papa Pro Team? Submit your artist application online, enclose your portfolio, or connect with our artist relations desk on Instagram.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full md:w-auto shrink-0">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfgQxxTK1SsF62fydK8bJuJyZ-KIilUX8N-fvpclkZvngMeOA/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-zinc-950 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 font-mono font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2 hover:bg-zinc-800 dark:hover:bg-[#26cbb1] active:scale-[0.99] transition-all shadow-sm cursor-pointer"
            >
              <span>JOIN OUR TEAM</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <a
              href="https://drive.google.com/file/d/1zMU7VE6YcrKKkjqP3wMo2H69Fz9SnOr1/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-3 rounded-xl border border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#14171E] text-zinc-800 dark:text-zinc-200 hover:text-[#0d9488] dark:hover:text-[#2EE6CA] hover:border-[#2EE6CA] font-mono font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
              <span>APPLICATION (PDF)</span>
            </a>

            <a
              href="https://instagram.com/papatattoosupply"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-3 rounded-xl border border-zinc-200 dark:border-[#222731] bg-zinc-50 dark:bg-[#14171E] text-zinc-700 dark:text-zinc-300 hover:text-[#0d9488] dark:hover:text-[#2EE6CA] hover:border-[#2EE6CA] font-mono font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              <span>@papatattoosupply</span>
            </a>

            <Link
              to="/contact"
              className="w-full sm:w-auto px-4 py-3 rounded-xl border border-zinc-200 dark:border-[#222731] bg-zinc-50 dark:bg-[#14171E] text-zinc-700 dark:text-zinc-300 hover:text-[#0d9488] dark:hover:text-[#2EE6CA] hover:border-[#2EE6CA] font-mono font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-[#0d9488] dark:text-[#2EE6CA]" />
              <span>Contact</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
