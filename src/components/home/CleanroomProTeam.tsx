import React from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Truck, FileCheck2, ShieldCheck, Award } from 'lucide-react'

const RESIDENT_ARTISTS = [
  {
    name: 'Alec Turner',
    handle: '@alecturnertattoo',
    city: 'Los Angeles, USA',
    image: '/artists/Alec_Turner_Papa_Tattoo.jpg',
  },
  {
    name: 'Alissa Jung',
    handle: '@alissajungink',
    city: 'Seoul, South Korea',
    image: '/artists/Alissa_Jung.jpg',
  },
  {
    name: 'Allay Anderson',
    handle: '@allaytattoo',
    city: 'London, UK',
    image: '/artists/Allay_Anderson.jpg',
  },
  {
    name: 'Andy Trejo',
    handle: '@andydestroy',
    city: 'Mexico City, Mexico',
    image: '/artists/AndyTrejo.jpg',
  },
  {
    name: 'Angel Reynosa',
    handle: '@angelreynosa',
    city: 'California, USA',
    image: '/artists/Angel_Reynosa_from_Papa_Tattoo.jpg',
  },
  {
    name: 'Arnoldo Bautista',
    handle: '@arnoldobautista',
    city: 'Texas, USA',
    image: '/artists/Arnoldo_Bautista.jpg',
  },
  {
    name: 'Ashton Vermillion',
    handle: '@ashtonvermillion',
    city: 'New York, USA',
    image: '/artists/Ashton_Vermillion.jpg',
  },
  {
    name: 'Audie Fulfer',
    handle: '@audiefulfer',
    city: 'Denver, USA',
    image: '/artists/AudieFulfer.jpg',
  },
]

export const CleanroomProTeam: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1440px] mx-auto text-[#1d1d1f] dark:text-[#f5f5f7]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left 7 Cols: Curated Pro Team Roster */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">
                Official Pro Team
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f] dark:text-white">
                Trusted by 40+ Resident Artists.
              </h2>
            </div>

            <Link
              to="/sponsorship-artists"
              className="text-xs font-medium text-[#1d1d1f] dark:text-white hover:underline inline-flex items-center gap-1 shrink-0"
            >
              <span>Full Artist Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {RESIDENT_ARTISTS.map(artist => (
              <Link
                key={artist.name}
                to="/sponsorship-artists"
                className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-black/[0.04] dark:border-white/[0.06]"
              >
                <img
                  src={artist.image}
                  alt={artist.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-300 group-hover:scale-104"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"
                />
                <div className="absolute bottom-3 inset-x-3 text-left">
                  <div className="text-xs font-semibold text-white truncate">
                    {artist.name}
                  </div>
                  <div className="text-[11px] text-white/70 truncate">
                    {artist.handle}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: Global Studio Service Guarantees */}
        <div className="lg:col-span-5 rounded-[32px] bg-[#F5F5F7] dark:bg-[#121214] p-8 sm:p-10 divide-y divide-black/[0.06] dark:divide-white/[0.08] border border-black/[0.03] dark:border-white/[0.05]">
          <div className="pb-6 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#1d1d1f] dark:text-white">
                40+ Countries Priority Air Dispatch
              </h3>
              <Truck className="w-4 h-4 text-[#86868b] shrink-0" />
            </div>
            <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
              Priority air logistics and verified regional distributors serving tattoo studios across North America, Europe, United Kingdom, and Australia.
            </p>
            <div className="pt-1">
              <Link
                to="/distributors"
                className="text-xs font-medium text-[#1d1d1f] dark:text-white hover:underline inline-flex items-center gap-1"
              >
                <span>Authorized Distributors</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="py-6 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#1d1d1f] dark:text-white">
                Class 100,000 ISO Cleanroom Sterility
              </h3>
              <FileCheck2 className="w-4 h-4 text-[#86868b] shrink-0" />
            </div>
            <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
              Every cartridge needle and disposable grip is individually blister-sealed and certified with chemical EO Gas batch reaction indicators.
            </p>
            <div className="pt-1">
              <Link
                to="/about"
                className="text-xs font-medium text-[#1d1d1f] dark:text-white hover:underline inline-flex items-center gap-1"
              >
                <span>Engineering Standards</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="pt-6 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#1d1d1f] dark:text-white">
                Direct Factory Warranty &amp; Studio Wholesale
              </h3>
              <ShieldCheck className="w-4 h-4 text-[#86868b] shrink-0" />
            </div>
            <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
              Dedicated studio volume pricing, custom anodized batch runs, and in-house rotary motor servicing with zero middleman markups.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
