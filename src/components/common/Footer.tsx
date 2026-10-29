import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Logo } from './Logo'
import { useLocale } from '../../context/LocaleContext'
import {
  ArrowUpRight,
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  Cpu,
  Globe,
  Layers,
  Loader2,
  Mail,
  Radio,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react'
import {
  submitStorefrontInquiry,
  type StorefrontInquiryResult,
} from '../../lib/inquiries.functions'

interface AccreditationItem {
  id: string
  code: string
  title: string
  subtitle: string
  detail: string
  icon: React.ComponentType<{ className?: string }>
}

const ACCREDITATIONS: AccreditationItem[] = [
  {
    id: 'iso-sterilization',
    code: 'ISO 11135:2014 & EN 556-1',
    title: 'Medical EO Gas Sterilization',
    subtitle: '100% Individual Blister Sterility',
    detail: 'Every cartridge lot is sterilized with Ethylene Oxide and verified with active chemical indicator strips.',
    icon: ShieldCheck,
  },
  {
    id: 'astm-316l',
    code: 'ASTM F138 & AISI 316L',
    title: 'Surgical Implant Metallurgy',
    subtitle: 'Micro-Polished Surgical Steel Pins',
    detail: 'Medical implant grade stainless steel wire electro-polished for effortless ink flow and minimal skin trauma.',
    icon: CheckCircle2,
  },
  {
    id: 'alloy-cnc',
    code: 'AEROSPACE 6061-T6',
    title: 'Monolithic Billet CNC Milling',
    subtitle: 'Micrometer Tolerances (±0.01 mm)',
    detail: 'Aircraft-grade solid billet chassis machined on 5-axis CNC centers with dual vibration-damped bearings.',
    icon: Layers,
  },
  {
    id: 'motor-drive',
    code: 'GERMAN CORELESS DRIVE',
    title: 'Precision Micro-Motor Drive',
    subtitle: 'High-Torque Continuous Operation',
    detail: 'Precision-balanced direct drive architecture engineered for 2,000+ continuous professional hours.',
    icon: Cpu,
  },
  {
    id: 'ce-rohs',
    code: 'CE DIRECTIVE & ROHS 2.0',
    title: 'European Union Safety Standards',
    subtitle: 'EMC Directive & Hazardous Substance Free',
    detail: 'Full conformity with European electromagnetic shielding and biocompatible toxin-free surface treatments.',
    icon: BadgeCheck,
  },
  {
    id: 'fcc-telemetry',
    code: 'FCC PART 15 & UN38.3',
    title: 'Digital Wireless Telemetry',
    subtitle: 'Class B Shielding & Air Freight Safe',
    detail: 'Studio-grade EMI suppression for wireless battery apparatus with certified safe air cargo transport.',
    icon: Radio,
  },
]

export const Footer: React.FC = () => {
  const { t } = useLocale()
  const [dispatchEmail, setDispatchEmail] = useState('')
  const [dispatchLoading, setDispatchLoading] = useState(false)
  const [dispatchError, setDispatchError] = useState<string | null>(null)
  const [dispatchResult, setDispatchResult] = useState<StorefrontInquiryResult | null>(null)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleDispatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setDispatchError(null)
    setDispatchLoading(true)

    try {
      const result = await submitStorefrontInquiry({
        data: {
          kind: 'newsletter',
          email: dispatchEmail,
        },
      })
      setDispatchResult(result)
      if (result.delivered) {
        setDispatchEmail('')
      }
    } catch (err) {
      setDispatchError(err instanceof Error ? err.message : 'Please enter a valid email address.')
    } finally {
      setDispatchLoading(false)
    }
  }

  return (
    <footer className="border-t border-black/[0.06] dark:border-white/[0.08] bg-[#f5f5f7] dark:bg-[#0c0d0f] text-[#86868b] font-sans transition-colors duration-200">
      {/* 1. Hardware Engineering Accreditation & Certification Matrix */}
      <section
        aria-labelledby="hardware-accreditations-heading"
        className="border-b border-black/[0.06] dark:border-white/[0.08] py-12 lg:py-16 bg-white/50 dark:bg-black/30 backdrop-blur-xs"
      >
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="max-w-3xl mb-10 space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-mono font-semibold tracking-wider uppercase text-[#1d1d1f] dark:text-[#f5f5f7]">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Hardware Accreditation &amp; Quality Engineering</span>
            </div>
            <h2
              id="hardware-accreditations-heading"
              className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-[#1d1d1f] dark:text-[#f5f5f7]"
            >
              Certified Medical Standards &amp; Precision Machining.
            </h2>
            <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
              Every rotary chassis, adjustable click grip, and sterilized cartridge is manufactured to verified international surgical standards and calibrated for zero-fatigue parlor performance.
            </p>
          </div>

          {/* 6-Card Accreditation Matrix Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {ACCREDITATIONS.map(item => {
              const IconComponent = item.icon
              return (
                <div
                  key={item.id}
                  className="rounded-2xl p-5 bg-white dark:bg-[#15171c] border border-black/[0.06] dark:border-white/[0.08] hover:border-black/15 dark:hover:border-white/20 transition-all duration-200 shadow-2xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold tracking-tight bg-black/[0.05] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-white">
                        {item.code}
                      </span>
                      <IconComponent className="w-4 h-4 text-[#1d1d1f] dark:text-white shrink-0" />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
                        {item.title}
                      </h3>
                      <div className="text-[11px] font-medium text-emerald-800 dark:text-emerald-300 mt-0.5">
                        {item.subtitle}
                      </div>
                    </div>

                    <p className="text-xs text-[#86868b] leading-relaxed">
                      {item.detail}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-[#86868b]">
                    <span>Factory Validated</span>
                    <span className="text-emerald-800 dark:text-emerald-300 font-medium">Compliance Active</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 2. Apple-Style Directory & Hardware Lineup Grid */}
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-18">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand & Mission Profile */}
          <div className="md:col-span-4 space-y-5">
            <Logo size="lg" />
            <p className="text-xs sm:text-sm text-[#86868b] max-w-sm leading-relaxed">
              {t('footer_tagline')}
            </p>

            <div className="space-y-2.5 text-xs pt-1">
              <a
                href="mailto:papatattoosupply@gmail.com"
                className="inline-flex items-center gap-2 text-[#1d1d1f]/80 dark:text-[#f5f5f7]/80 hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150"
              >
                <Mail className="w-3.5 h-3.5 text-[#86868b]" />
                <span className="font-mono">papatattoosupply@gmail.com</span>
              </a>

              <div>
                <a
                  href="https://instagram.com/papatattoosupply"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#1d1d1f]/80 dark:text-[#f5f5f7]/80 hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150"
                >
                  <svg className="w-3.5 h-3.5 text-[#86868b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                  <span className="font-mono">@papatattoosupply</span>
                </a>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#86868b]">
                <Globe className="w-3.5 h-3.5" />
                <span>Global Express Air Cargo to 40+ Countries</span>
              </div>
            </div>
          </div>

          {/* Directory Columns (Accordion on Mobile, Grid on Desktop) */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Column 1: Rotary Apparatus */}
            <div className="border-b sm:border-b-0 border-black/[0.06] dark:border-white/[0.08] pb-4 sm:pb-0">
              <button
                type="button"
                onClick={() => toggleSection('machines')}
                className="w-full flex items-center justify-between text-left text-xs font-semibold tracking-[-0.01em] text-[#1d1d1f] dark:text-[#f5f5f7] sm:cursor-default py-1 sm:py-0"
              >
                <span>Rotary Apparatus</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 sm:hidden transition-transform duration-200 ${
                    openSections.machines ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <ul
                className={`${
                  openSections.machines ? 'block' : 'hidden'
                } sm:block space-y-2.5 text-xs pt-3 sm:pt-3 text-[#86868b]`}
              >
                <li>
                  <Link
                    to="/products/$handle"
                    params={{ handle: 'papa-pen-v3-black-full-set' }}
                    className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150"
                  >
                    Papa Pen V3 (3.5 mm / 4.0 mm)
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products/$handle"
                    params={{ handle: 'papa-pen-v2-1' }}
                    className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150"
                  >
                    Papa Pen V2 Direct-Drive
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products/$handle"
                    params={{ handle: 'papa-apollo-rotary' }}
                    className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150"
                  >
                    Papa Apollo Rotary
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products/$handle"
                    params={{ handle: 'papa-pen-jet-black' }}
                    className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150"
                  >
                    Papa Pen Classic Jet Black
                  </Link>
                </li>
                <li>
                  <Link
                    to="/collections"
                    search={{ category: 'machines' }}
                    className="text-[#1d1d1f] dark:text-[#f5f5f7] font-medium inline-flex items-center gap-1 hover:opacity-75 pt-1"
                  >
                    <span>Compare Engineering</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Cartridges & Needles */}
            <div className="border-b sm:border-b-0 border-black/[0.06] dark:border-white/[0.08] pb-4 sm:pb-0">
              <button
                type="button"
                onClick={() => toggleSection('cartridges')}
                className="w-full flex items-center justify-between text-left text-xs font-semibold tracking-[-0.01em] text-[#1d1d1f] dark:text-[#f5f5f7] sm:cursor-default py-1 sm:py-0"
              >
                <span>Needle Cartridges</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 sm:hidden transition-transform duration-200 ${
                    openSections.cartridges ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <ul
                className={`${
                  openSections.cartridges ? 'block' : 'hidden'
                } sm:block space-y-2.5 text-xs pt-3 sm:pt-3 text-[#86868b]`}
              >
                <li>
                  <Link
                    to="/products/$handle"
                    params={{ handle: 'papa-premium-tattoo-cartridges' }}
                    className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150"
                  >
                    Premium 316L Series
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products/$handle"
                    params={{ handle: 'papa-standard-tattoo-cartridges' }}
                    className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150"
                  >
                    Standard EO Series
                  </Link>
                </li>
                <li>
                  <Link
                    to="/collections"
                    search={{ category: 'cartridges' }}
                    className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150"
                  >
                    62 Pin Formats Matrix
                  </Link>
                </li>
                <li>
                  <Link
                    to="/collections"
                    search={{ category: 'cartridges', needle: 'liner' }}
                    className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150"
                  >
                    Liners (RL / RLT / RLH)
                  </Link>
                </li>
                <li>
                  <Link
                    to="/collections"
                    search={{ category: 'cartridges', needle: 'magnum' }}
                    className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150"
                  >
                    Curved &amp; Weaved Magnums
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Grips & Power Ecosystem */}
            <div className="border-b sm:border-b-0 border-black/[0.06] dark:border-white/[0.08] pb-4 sm:pb-0">
              <button
                type="button"
                onClick={() => toggleSection('grips')}
                className="w-full flex items-center justify-between text-left text-xs font-semibold tracking-[-0.01em] text-[#1d1d1f] dark:text-[#f5f5f7] sm:cursor-default py-1 sm:py-0"
              >
                <span>Grips &amp; Wireless</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 sm:hidden transition-transform duration-200 ${
                    openSections.grips ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <ul
                className={`${
                  openSections.grips ? 'block' : 'hidden'
                } sm:block space-y-2.5 text-xs pt-3 sm:pt-3 text-[#86868b]`}
              >
                <li>
                  <Link
                    to="/collections"
                    search={{ category: 'grips' }}
                    className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150"
                  >
                    Click Grip V2 (6061-T6)
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products/$handle"
                    params={{ handle: 'papa-adjustable-grip-v3-33-mm-black' }}
                    className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150"
                  >
                    Click Grip V3 (33 mm / 38 mm)
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products/$handle"
                    params={{ handle: 'papa-volt-battery' }}
                    className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150"
                  >
                    Papa Volt OLED Battery
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products/$handle"
                    params={{ handle: 'papa-power-bullet' }}
                    className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150"
                  >
                    Power Bullet &amp; Foot Switches
                  </Link>
                </li>
                <li>
                  <Link
                    to="/collections"
                    search={{ category: 'accessories' }}
                    className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150"
                  >
                    Studio Trays &amp; Travel Cases
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Studio Pro & Logistics */}
            <div className="pb-4 sm:pb-0">
              <button
                type="button"
                onClick={() => toggleSection('studio')}
                className="w-full flex items-center justify-between text-left text-xs font-semibold tracking-[-0.01em] text-[#1d1d1f] dark:text-[#f5f5f7] sm:cursor-default py-1 sm:py-0"
              >
                <span>Studio Logistics</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 sm:hidden transition-transform duration-200 ${
                    openSections.studio ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <ul
                className={`${
                  openSections.studio ? 'block' : 'hidden'
                } sm:block space-y-2.5 text-xs pt-3 sm:pt-3 text-[#86868b]`}
              >
                <li>
                  <Link
                    to="/distributors"
                    className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150"
                  >
                    Official Distributors
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sponsorship-artists"
                    className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150"
                  >
                    Sponsorship Resident Artists
                  </Link>
                </li>
                <li>
                  <a
                    href="https://drive.google.com/file/d/1nMPw2A9x_AwQnlFp0yew_2XNbMBKoiEf/view"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150 inline-flex items-center gap-1"
                  >
                    <span>Machine Service &amp; RMA</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150"
                  >
                    About Papa Tattoo Supply
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150"
                  >
                    Direct Contact Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. Studio Dispatch Subscription Strip */}
        <div className="mt-12 pt-8 border-t border-black/[0.06] dark:border-white/[0.08] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1 max-w-xl">
            <h3 className="text-xs font-semibold tracking-[-0.01em] text-[#1d1d1f] dark:text-[#f5f5f7]">
              Studio Dispatch &amp; Technical Bulletins
            </h3>
            <p className="text-xs text-[#86868b] leading-relaxed">
              Receive updates on new rotary releases, limited anodized runs, and studio replenishment programs.
            </p>
          </div>

          <form onSubmit={handleDispatchSubmit} className="flex-1 max-w-md space-y-2">
            <div className="flex gap-2">
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                value={dispatchEmail}
                onChange={e => {
                  setDispatchEmail(e.target.value)
                  if (dispatchResult) setDispatchResult(null)
                }}
                placeholder="artist@studio.com"
                aria-label="Email address for studio dispatch subscription"
                className="flex-1 min-w-0 px-4 py-2 text-xs font-sans rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-[#161618] text-[#1d1d1f] dark:text-[#f5f5f7] placeholder:text-[#86868b] focus:outline-hidden focus:border-[#1d1d1f] dark:focus:border-white transition-colors duration-150"
              />
              <button
                type="submit"
                disabled={dispatchLoading}
                aria-label="Subscribe to studio updates"
                className="px-5 py-2 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-xs font-semibold hover:opacity-88 active:scale-[0.97] disabled:opacity-50 transition-all duration-150 ease-[var(--ease-out-strong)] cursor-pointer shrink-0"
              >
                {dispatchLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Subscribe</span>}
              </button>
            </div>

            {dispatchError ? (
              <span role="alert" className="text-[11px] text-red-600 dark:text-red-400 block">
                {dispatchError}
              </span>
            ) : dispatchResult ? (
              <div className="text-[11px] text-emerald-800 dark:text-emerald-300 flex items-start gap-1.5 leading-snug">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>
                  {dispatchResult.delivered ? (
                    'Subscribed to Studio Updates.'
                  ) : (
                    <>
                      Ready:{' '}
                      <a href={dispatchResult.mailtoUrl} className="underline font-medium">
                        confirm subscription
                      </a>
                      .
                    </>
                  )}
                </span>
              </div>
            ) : null}
          </form>
        </div>

        {/* 4. Apple-Style Disclaimers & Footnote Annotations */}
        <div className="mt-10 pt-6 border-t border-black/[0.05] dark:border-white/[0.06] space-y-2 text-[11px] text-[#86868b] leading-relaxed">
          <p>
            1. Sterilization Protocol: All Papa needle cartridges are sterilized using validated Ethylene Oxide (EO) gas in accordance with ISO 11135:2014 and EN 556-1 standards with active chemical indicators on every blister package.
          </p>
          <p>
            2. Factory Direct Warranty: Rotary apparatuses include a 1-year limited factory warranty covering internal coreless motors and drive mechanisms against manufacturing defects.
          </p>
          <p>
            3. Studio Volume Allowance: Tiered commercial replenishment allowances of 5% (5+ boxes), 10% (10+ boxes), and 15% (20+ boxes) are calculated automatically at checkout for certified studios.
          </p>
        </div>

        {/* 5. Bottom Copyright, Legal & Region Selector Ribbon */}
        <div className="mt-8 pt-6 border-t border-black/[0.06] dark:border-white/[0.06] flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-[#86868b]">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span>Copyright &copy; {new Date().getFullYear()} {t('footer_rights')}</span>
            <span className="hidden sm:inline text-black/20 dark:text-white/20">|</span>
            <span className="text-[11px] font-mono">Precision Tattoo Engineering</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs">
            <Link
              to="/privacy-policy"
              hash="privacy"
              className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150"
            >
              Privacy Policy
            </Link>
            <Link
              to="/privacy-policy"
              hash="terms"
              className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150"
            >
              Terms of Sale
            </Link>
            <Link
              to="/privacy-policy"
              hash="quality"
              className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150"
            >
              Sterility Standards
            </Link>
            <Link
              to="/privacy-policy-cookie-restriction-mode"
              className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150"
            >
              Cookie Settings
            </Link>
            <Link
              to="/distributors"
              className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150"
            >
              Distributor Portal
            </Link>
            <div className="flex items-center gap-1.5 pl-2 sm:border-l sm:border-black/10 sm:dark:border-white/10 text-[#1d1d1f] dark:text-[#f5f5f7] font-medium text-[11px]">
              <Globe className="w-3 h-3 text-[#86868b]" />
              <span>Worldwide (USD)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
