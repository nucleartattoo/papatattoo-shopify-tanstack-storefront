import React from 'react'
import { useLocale } from '../../context/LocaleContext'
import { Shield, Sparkles, ChevronRight, Zap } from 'lucide-react'

interface HeroProps {
  onCtaClick?: () => void
  onStudioClick?: () => void
}

export const Hero: React.FC<HeroProps> = ({ onCtaClick, onStudioClick }) => {
  const { t } = useLocale()

  return (
    <section className="relative overflow-hidden border-b border-zinc-200 dark:border-[#222731] bg-gradient-to-b from-zinc-50 via-white to-zinc-100 dark:from-[#090A0C] dark:via-[#0D0F13] dark:to-[#090A0C] py-16 md:py-24">
      {/* Sacred Geometry Background Decorative SVG Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-25 dark:opacity-20 flex items-center justify-center overflow-hidden">
        <svg
          width="800"
          height="800"
          viewBox="0 0 800 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="scale-125 md:scale-150 animate-[spin_180s_linear_infinite]"
        >
          <circle cx="400" cy="400" r="380" stroke="#2EE6CA" strokeWidth="1" strokeDasharray="4 8" />
          <circle cx="400" cy="400" r="280" stroke="#2EE6CA" strokeWidth="1.5" />
          <circle cx="400" cy="400" r="160" stroke="#2EE6CA" strokeWidth="1" strokeDasharray="6 6" />

          {/* Sacred Polygon wireframes */}
          <polygon points="400,120 642,260 642,540 400,680 158,540 158,260" stroke="#2EE6CA" strokeWidth="1.5" />
          <polygon points="400,680 642,540 642,260 400,120 158,260 158,540" stroke="#94A3B8" strokeWidth="1" strokeOpacity="0.4" />

          {/* Cross lines */}
          <line x1="400" y1="20" x2="400" y2="780" stroke="#2EE6CA" strokeWidth="1" strokeOpacity="0.3" />
          <line x1="20" y1="400" x2="780" y2="400" stroke="#2EE6CA" strokeWidth="1" strokeOpacity="0.3" />
          <line x1="131" y1="131" x2="669" y2="669" stroke="#2EE6CA" strokeWidth="0.8" strokeOpacity="0.2" />
          <line x1="131" y1="669" x2="669" y2="131" stroke="#2EE6CA" strokeWidth="0.8" strokeOpacity="0.2" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Manifesto & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Tech Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-600/30 dark:border-[#2EE6CA]/30 bg-teal-500/10 dark:bg-[#2EE6CA]/10 text-teal-700 dark:text-[#2EE6CA] text-[11px] font-mono font-bold tracking-widest uppercase">
              <Zap className="w-3.5 h-3.5" />
              <span>{t('hero_tag')}</span>
            </div>

            {/* Giant Title */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-zinc-950 dark:text-white uppercase font-sans leading-[1.05]">
              {t('hero_title').split(' ')[0]}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500 dark:from-[#2EE6CA] dark:to-cyan-400 drop-shadow-[0_0_20px_rgba(46,230,202,0.25)]">
                {t('hero_title').split(' ').slice(1).join(' ')}
              </span>
            </h1>

            {/* Technical Manifesto */}
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
              {t('hero_desc')}
            </p>

            {/* Precision Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-lg border border-zinc-200 dark:border-[#222731] bg-white/70 dark:bg-[#14171D]/80">
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">CHASSIS MATERIAL</div>
                <div className="text-xs font-bold text-zinc-900 dark:text-zinc-200 mt-0.5">{t('specs_aircraft_aluminum')}</div>
              </div>

              <div className="p-3 rounded-lg border border-zinc-200 dark:border-[#222731] bg-white/70 dark:bg-[#14171D]/80">
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">BALL BEARING LOCK</div>
                <div className="text-xs font-bold text-zinc-900 dark:text-zinc-200 mt-0.5">{t('specs_precision')}</div>
              </div>

              <div className="p-3 rounded-lg border border-zinc-200 dark:border-[#222731] bg-white/70 dark:bg-[#14171D]/80">
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">SUPPLY CHAIN</div>
                <div className="text-xs font-bold text-zinc-900 dark:text-zinc-200 mt-0.5">{t('specs_worldwide')}</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={onCtaClick}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-zinc-950 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_25px_rgba(46,230,202,0.4)] transition-all transform active:scale-95"
              >
                <span>{t('hero_cta')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={onStudioClick}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-zinc-300 dark:border-[#222731] hover:border-zinc-500 dark:hover:border-zinc-500 text-zinc-800 dark:text-zinc-200 font-bold text-xs uppercase tracking-widest bg-white/60 dark:bg-[#14171D]/60 transition-all"
              >
                <span>{t('hero_secondary')}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-2xl border border-zinc-300 dark:border-[#222731] bg-zinc-100/80 dark:bg-[#121419]/90 p-6 flex flex-col justify-between shadow-2xl overflow-hidden group">
              {/* Corner crosshair decals */}
              <div className="absolute top-2 left-2 text-[10px] font-mono text-zinc-400 dark:text-zinc-600 select-none">+ 01</div>
              <div className="absolute top-2 right-2 text-[10px] font-mono text-zinc-400 dark:text-zinc-600 select-none">PAPA-SPEC</div>
              <div className="absolute bottom-2 left-2 text-[10px] font-mono text-zinc-400 dark:text-zinc-600 select-none">SYS: CLICK-32</div>
              <div className="absolute bottom-2 right-2 text-[10px] font-mono text-zinc-400 dark:text-zinc-600 select-none">+ 02</div>

              {/* Top info badge */}
              <div className="flex justify-between items-center z-10">
                <span className="px-2.5 py-1 rounded bg-[#0d9488]/15 dark:bg-[#2EE6CA]/15 text-[#0d9488] dark:text-[#2EE6CA] text-[10px] font-mono font-bold tracking-wider uppercase">
                  FLAGSHIP SPECIMEN
                </span>
                <span className="text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400">
                  AUTOCLAVABLE
                </span>
              </div>

              {/* Main Product Showcase Image */}
              <div className="my-auto relative flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-[#2EE6CA]/10 blur-3xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-700"></div>
                <img
                  src="https://cdn.shopify.com/s/files/1/0780/2955/3716/files/papa_adjustment_grips_1.jpg?v=1789096517"
                  alt="Papa Adjustable Click Grip"
                  className="relative max-h-56 object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.6)] transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Bottom spec caption */}
              <div className="z-10 bg-white/90 dark:bg-[#090A0C]/90 p-3 rounded-lg border border-zinc-200 dark:border-[#222731] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-zinc-950 dark:text-white uppercase font-sans">
                    Papa Adjustable Click Grip
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500">
                    Precision Cartridge System · Dual Stainless Detents
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-extrabold text-[#0d9488] dark:text-[#2EE6CA]">
                    $69.00 USD
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
