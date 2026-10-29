import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  ShieldCheck,
  Award,
  Truck,
  FileCheck2,
  Sparkles,
  Zap,
} from 'lucide-react'

interface MasterArtist {
  id: string
  name: string
  handle: string
  city: string
  style: string
  image: string
  machinePreset: {
    voltage: string
    stroke: string
    needle: string
    speed: string
  }
  quote: string
}

const MASTER_ARTISTS: MasterArtist[] = [
  {
    id: 'alec-turner',
    name: 'Alec Turner',
    handle: '@alecturnertattoo',
    city: 'Los Angeles, USA',
    style: 'Micro-Realism & Fine-Line',
    image: '/artists/Alec_Turner_Papa_Tattoo.jpg',
    machinePreset: {
      voltage: '7.8 V DC',
      stroke: '3.5 mm Cam',
      needle: '0.25 mm 3RL Bugpin',
      speed: '9,200 RPM',
    },
    quote:
      'The forward mass balance on the Pen V3 eliminates the pendulum fatigue on 7-hour micro-portraits. Line stability is surgical.',
  },
  {
    id: 'alissa-jung',
    name: 'Alissa Jung',
    handle: '@alissajungink',
    city: 'Seoul, South Korea',
    style: 'Botanical & Soft Realism',
    image: '/artists/Alissa_Jung.jpg',
    machinePreset: {
      voltage: '6.5 V DC',
      stroke: '3.5 mm Cam',
      needle: '0.30 mm 7RS Shader',
      speed: '8,400 RPM',
    },
    quote:
      'Zero thermal drift over long shading passes. The low vibration harmonics keep my fingers completely relaxed.',
  },
  {
    id: 'allay-anderson',
    name: 'Allay Anderson',
    handle: '@allaytattoo',
    city: 'London, United Kingdom',
    style: 'Japanese Traditional & Irezumi',
    image: '/artists/Allay_Anderson.jpg',
    machinePreset: {
      voltage: '9.2 V DC',
      stroke: '4.5 mm Heavy Cam',
      needle: '0.35 mm 17M1 Curved Mag',
      speed: '10,500 RPM',
    },
    quote:
      'Pushing 17-magnums through tough skin without bogging down requires brutal motor torque. Papa Pen delivers without hesitation.',
  },
  {
    id: 'andy-trejo',
    name: 'Andy Trejo',
    handle: '@andydestroy',
    city: 'Mexico City, Mexico',
    style: 'Dark Chicano & Script Realism',
    image: '/artists/AndyTrejo.jpg',
    machinePreset: {
      voltage: '8.4 V DC',
      stroke: '4.0 mm All-Around Cam',
      needle: '0.30 mm 9RL Outlines',
      speed: '9,800 RPM',
    },
    quote:
      'Click-depth lock does not slip even a fraction of a millimeter. When you pull single-pass scripts, precision is everything.',
  },
]

export const AtelierMasterMonograph: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const activeArtist = MASTER_ARTISTS[selectedIdx] || MASTER_ARTISTS[0]

  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1440px] mx-auto text-zinc-100">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[11px] font-mono tracking-widest text-zinc-400 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2EE6CA]" />
            <span>Pro Team Monograph</span>
            <span className="text-zinc-600">//</span>
            <span>Machine Tuning Presets</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.035em] text-white leading-tight">
            Curated by Master Artists.
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
            Every apparatus in our atelier is torture-tested on human canvas by over 40 resident resident artists across the globe. Inspect their personal voltage curves, cam stroke selections, and needle configurations.
          </p>
        </div>

        <Link
          to="/sponsorship-artists"
          className="text-xs font-mono text-zinc-400 hover:text-white inline-flex items-center gap-1.5 shrink-0 transition-colors"
        >
          <span>Explore All 40+ Resident Artists</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Dual-Spread Editorial Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left 4 Cols: Artist Selector Navigation List */}
        <div className="lg:col-span-4 space-y-3">
          {MASTER_ARTISTS.map((artist, idx) => {
            const isSel = idx === selectedIdx
            return (
              <button
                key={artist.id}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                className={`w-full p-4.5 rounded-2xl border text-left flex items-center gap-4 transition-all duration-150 cursor-pointer ${
                  isSel
                    ? 'bg-white/10 border-white/30 text-white shadow-[0_4px_20px_rgba(255,255,255,0.06)]'
                    : 'bg-[#0E1014] border-white/[0.06] hover:bg-white/[0.04] text-zinc-400'
                }`}
              >
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-14 h-14 rounded-xl object-cover grayscale contrast-125 brightness-95 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white truncate">
                      {artist.name}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      0{idx + 1}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-zinc-400 block truncate">
                    {artist.handle}
                  </span>
                  <span className="text-[11px] text-[#2EE6CA] block truncate mt-0.5">
                    {artist.style}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Right 8 Cols: Active Artist Monograph Dossier & Tuning Preset */}
        <div className="lg:col-span-8 rounded-[32px] bg-[#0E1014] border border-white/[0.08] p-8 sm:p-12 flex flex-col justify-between shadow-[0_24px_50px_rgba(0,0,0,0.6)] space-y-8">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#2EE6CA] block">
                  RESIDENT STUDIO DOSSIER
                </span>
                <h3 className="text-2xl sm:text-3xl font-semibold text-white mt-1">
                  {activeArtist.name}
                </h3>
                <span className="text-xs font-mono text-zinc-400 mt-0.5 block">
                  {activeArtist.city} · {activeArtist.style}
                </span>
              </div>

              <div className="px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 font-mono text-xs text-zinc-300">
                <span>VERIFIED PRO TEAM RESIDENT</span>
              </div>
            </div>

            {/* Testimonial Quote */}
            <blockquote className="text-lg sm:text-xl text-zinc-200 font-serif italic leading-relaxed border-l-2 border-[#2EE6CA] pl-5">
              "{activeArtist.quote}"
            </blockquote>

            {/* Tuning Preset Grid */}
            <div className="space-y-3 pt-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 block">
                MACHINE TUNING TELEMETRY // DAILY PRESET
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div className="p-3.5 rounded-xl bg-[#08090C] border border-white/[0.05]">
                  <span className="text-[10px] text-zinc-500 uppercase block">VOLTAGE</span>
                  <span className="text-base font-semibold text-white block mt-0.5">
                    {activeArtist.machinePreset.voltage}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#08090C] border border-white/[0.05]">
                  <span className="text-[10px] text-zinc-500 uppercase block">STROKE CAM</span>
                  <span className="text-base font-semibold text-white block mt-0.5">
                    {activeArtist.machinePreset.stroke}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#08090C] border border-white/[0.05]">
                  <span className="text-[10px] text-zinc-500 uppercase block">CORE SPEED</span>
                  <span className="text-base font-semibold text-[#2EE6CA] block mt-0.5">
                    {activeArtist.machinePreset.speed}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#08090C] border border-white/[0.05]">
                  <span className="text-[10px] text-zinc-500 uppercase block">FAVORITE PIN</span>
                  <span className="text-xs font-semibold text-white block mt-0.5 truncate">
                    {activeArtist.machinePreset.needle}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Accreditation Ledger Footer */}
          <div className="pt-6 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#2EE6CA] shrink-0" />
              <span>Priority Air Freight</span>
            </div>
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-[#2EE6CA] shrink-0" />
              <span>Class 100k Cleanroom</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2EE6CA] shrink-0" />
              <span>Factory Direct Warranty</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
