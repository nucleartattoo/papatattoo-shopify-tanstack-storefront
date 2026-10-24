import React, { useState, useMemo } from 'react'
import {
  Globe,
  ShieldCheck,
  Building2,
  ExternalLink,
  CheckCircle2,
  Send,
  Loader2,
  Truck,
  Award,
  BadgeCheck,
  ArrowRight,
  Layers,
  Mail,
  Copy,
  Check,
  AlertCircle,
  MapPin,
} from 'lucide-react'
import {
  submitStorefrontInquiry,
  type StorefrontInquiryResult,
} from '../lib/inquiries.functions'

type TerritoryFilter = 'ALL' | 'NORTH_AMERICA' | 'LATAM'

interface Distributor {
  id: string
  code: string
  isoCountry: string
  territoryGroup: TerritoryFilter
  name: string
  region: string
  country: string
  logo: string
  url: string
  description: string
  specialty: string
  status: 'Authorized Master Partner' | 'Official Regional Distributor'
}

const OFFICIAL_DISTRIBUTORS: Distributor[] = [
  {
    id: 'nuclear-tattoo',
    code: 'DEPOT-US-01',
    isoCountry: 'US',
    territoryGroup: 'NORTH_AMERICA',
    name: 'Nuclear Tattoo Medical Supply',
    region: 'North America',
    country: 'United States',
    logo: '/distributors/nuclear_tattoo.png',
    url: 'https://store.nucleartattoo.com',
    description:
      'Premier sterile medical tattoo supplier serving professional artists across North America with factory-certified apparatus.',
    specialty: 'Medical 316L Cartridges, Autoclavable Grips, Precision Rotary Pens',
    status: 'Authorized Master Partner',
  },
  {
    id: 'sd-tattoo',
    code: 'DEPOT-US-02',
    isoCountry: 'US',
    territoryGroup: 'NORTH_AMERICA',
    name: 'SD Tattoo Supply',
    region: 'North America (West Coast)',
    country: 'United States',
    logo: '/distributors/sd_tattoo.jpg',
    url: 'https://www.sdtattoosupply.com/',
    description:
      'San Diego-based pro tattoo equipment depot delivering immediate studio dispatch and wholesale tier fulfillment.',
    specialty: 'Studio Hardware, Papa Pen V3 Sets, Disposable Grip Configurations',
    status: 'Authorized Master Partner',
  },
  {
    id: 'cultura-inkfest',
    code: 'DEPOT-PA-01',
    isoCountry: 'PA',
    territoryGroup: 'LATAM',
    name: 'Cultura Inkfest Tattoo Supply',
    region: 'Central & Latin America',
    country: 'Panama',
    logo: '/distributors/cultura_inkfest.png',
    url: 'https://www.instagram.com/culturainkfesttattoosupply/',
    description:
      'Official convention and studio logistics partner supplying top tattoo parlors throughout Panama and Central America.',
    specialty: 'Papa Premium Cartridges, Full Machine Sets, Expo Logistics',
    status: 'Official Regional Distributor',
  },
]

const OPEN_EXPANSION_TERRITORIES = [
  { code: 'EU', label: 'European Union (DE / FR / ES / IT)', defaultVolume: '5,000 - 10,000 boxes/mo' },
  { code: 'UK', label: 'United Kingdom & Ireland', defaultVolume: '2,000 - 5,000 boxes/mo' },
  { code: 'AU', label: 'Australia & New Zealand', defaultVolume: '2,000 - 5,000 boxes/mo' },
  { code: 'CA', label: 'Canada (East & West)', defaultVolume: '2,000 - 5,000 boxes/mo' },
  { code: 'BR', label: 'South America (BR / AR / CL / CO)', defaultVolume: '5,000 - 10,000 boxes/mo' },
]

export const DistributorsPage: React.FC = () => {
  const [territoryFilter, setTerritoryFilter] = useState<TerritoryFilter>('ALL')
  const [submissionResult, setSubmissionResult] = useState<StorefrontInquiryResult | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    country: '',
    businessType: 'Retail & Online Store',
    monthlyVolume: '2,000 - 5,000 boxes/mo',
    message: '',
  })

  const filteredDistributors = useMemo(() => {
    if (territoryFilter === 'ALL') return OFFICIAL_DISTRIBUTORS
    return OFFICIAL_DISTRIBUTORS.filter(d => d.territoryGroup === territoryFilter)
  }, [territoryFilter])

  const handleSelectExpansionTerritory = (territoryLabel: string, defaultVolume: string) => {
    setFormData(prev => ({
      ...prev,
      country: territoryLabel,
      monthlyVolume: defaultVolume,
    }))
    setSubmissionResult(null)
    const el = document.getElementById('apply-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setFormLoading(true)

    try {
      const result = await submitStorefrontInquiry({
        data: {
          kind: 'distributor',
          ...formData,
        },
      })
      setSubmissionResult(result)
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : 'Unable to prepare your wholesale application. Please email papatattoosupply@gmail.com directly.'
      )
    } finally {
      setFormLoading(false)
    }
  }

  const handleCopyApplication = async () => {
    if (!submissionResult) return
    const text = `To: ${submissionResult.recipient}\nSubject: ${submissionResult.subject}\n\n${submissionResult.bodyText}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Clipboard may be unavailable in restricted contexts
    }
  }

  return (
    <div className="min-h-[100dvh] bg-zinc-50 dark:bg-[#14161b] text-zinc-900 dark:text-zinc-100 font-sans pb-24 transition-colors">
      {/* 1. HERO SECTION — GLOBAL FACTORY DISTRIBUTION */}
      <section className="border-b border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200/80 dark:border-white/10 bg-[#f8f7f4] dark:bg-[#14161b] text-[#0d5d50] dark:text-[#38e8c6] text-[11px] font-mono font-bold tracking-wider uppercase">
                <Globe className="w-3.5 h-3.5" />
                <span>GLOBAL FACTORY DISTRIBUTION · AUTHORIZED WHOLESALE</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-['Montserrat',sans-serif] font-black uppercase tracking-tight text-zinc-950 dark:text-white leading-[1.06]">
                PAPA TATTOO AUTHORIZED DISTRIBUTORS
              </h1>

              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed max-w-2xl">
                Official regional supply depots and certified wholesale partners authorized to distribute authentic Papa Tattoo Supply rotary machines, click grips, and 316L sterile cartridge needles.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="#distributor-list"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#0d5d50] dark:hover:bg-[#2dd4b5] active:scale-[0.98] transition-all cursor-pointer shadow-xs"
                >
                  <span>View Verified Depots</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>

                <a
                  href="#apply-section"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-[#f8f7f4] dark:bg-[#14161b] hover:border-zinc-400 dark:hover:border-white/25 text-zinc-800 dark:text-zinc-200 text-xs font-mono font-bold uppercase tracking-wider active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5 text-[#0d5d50] dark:text-[#38e8c6]" />
                  <span>Apply for Territory Distribution</span>
                </a>
              </div>
            </div>

            {/* Stat Pillars */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
              <div className="p-5 rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#14161b]">
                <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                  EXPORT REACH
                </div>
                <div className="text-3xl font-black font-mono text-zinc-950 dark:text-white mt-2">
                  60+
                </div>
                <div className="text-[11px] font-mono text-[#0d5d50] dark:text-[#38e8c6] mt-1">
                  Countries Shipped
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#14161b]">
                <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                  STERILITY SPEC
                </div>
                <div className="text-3xl font-black font-mono text-zinc-950 dark:text-white mt-2">
                  100%
                </div>
                <div className="text-[11px] font-mono text-[#0d5d50] dark:text-[#38e8c6] mt-1">
                  EO Gas Lot Certified
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#14161b]">
                <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                  INSPECTION
                </div>
                <div className="text-3xl font-black font-mono text-zinc-950 dark:text-white mt-2">
                  30x
                </div>
                <div className="text-[11px] font-mono text-[#0d5d50] dark:text-[#38e8c6] mt-1">
                  Optical Tip QC
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#14161b]">
                <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                  DISPATCH SLA
                </div>
                <div className="text-3xl font-black font-mono text-zinc-950 dark:text-white mt-2">
                  24H
                </div>
                <div className="text-[11px] font-mono text-[#0d5d50] dark:text-[#38e8c6] mt-1">
                  Priority Air &amp; Sea
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PARTNER DIRECTORY SECTION */}
      <section id="distributor-list" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 scroll-mt-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 pb-5 border-b border-zinc-200/80 dark:border-white/[0.08] gap-4">
          <div>
            <div className="text-[11px] font-mono font-bold tracking-widest text-[#0d5d50] dark:text-[#38e8c6] uppercase flex items-center gap-1.5">
              <BadgeCheck className="w-3.5 h-3.5" />
              <span>VERIFIED FACTORY REPRESENTATIVES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-['Montserrat',sans-serif] font-black text-zinc-950 dark:text-white uppercase tracking-tight mt-1">
              OFFICIAL REGIONAL SUPPLY DEPOTS
            </h2>
          </div>

          {/* Region Filter Pills */}
          <div
            role="group"
            aria-label="Filter distributors by region"
            className="flex flex-wrap items-center gap-2"
          >
            {[
              { id: 'ALL' as TerritoryFilter, label: `All Regions (${OFFICIAL_DISTRIBUTORS.length})` },
              { id: 'NORTH_AMERICA' as TerritoryFilter, label: 'North America (2)' },
              { id: 'LATAM' as TerritoryFilter, label: 'Central & Latin America (1)' },
            ].map(tab => {
              const active = territoryFilter === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTerritoryFilter(tab.id)}
                  aria-pressed={active}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer active:scale-[0.98] ${
                    active
                      ? 'bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950'
                      : 'bg-white dark:bg-[#1c1e24] text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-white/10 hover:border-zinc-400'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredDistributors.map(distributor => (
            <article
              key={distributor.id}
              className="group rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] p-6 flex flex-col justify-between hover:border-zinc-400 dark:hover:border-white/25 transition-colors duration-200"
            >
              <div>
                {/* Top Telemetry Bar */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-2.5 py-1 rounded-md bg-[#f8f7f4] dark:bg-[#14161b] border border-zinc-200/70 dark:border-white/10 text-[10px] font-mono font-bold text-zinc-700 dark:text-zinc-300 uppercase">
                    {distributor.isoCountry} · {distributor.code}
                  </span>

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#0d5d50]/10 dark:bg-[#38e8c6]/15 text-[#0d5d50] dark:text-[#38e8c6]">
                    <ShieldCheck className="w-3 h-3" />
                    <span>VERIFIED</span>
                  </span>
                </div>

                {/* Logo Box */}
                <div className="w-full aspect-16/10 rounded-xl bg-[#f8f7f4] dark:bg-[#14161b] border border-zinc-200/70 dark:border-white/[0.06] flex items-center justify-center p-6 mb-5">
                  <img
                    src={distributor.logo}
                    alt={distributor.name}
                    className="max-h-24 max-w-full object-contain filter dark:brightness-110"
                  />
                </div>

                {/* Country & Region */}
                <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-1.5">
                  <span>{distributor.country}</span>
                  <span>·</span>
                  <span className="text-[#0d5d50] dark:text-[#38e8c6]">{distributor.region}</span>
                </div>

                {/* Name */}
                <h3 className="text-lg font-['Montserrat',sans-serif] font-black text-zinc-950 dark:text-white uppercase tracking-tight">
                  {distributor.name}
                </h3>

                <div className="text-[11px] font-mono text-zinc-400 mt-0.5">
                  {distributor.status}
                </div>

                {/* Description */}
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-3 leading-relaxed">
                  {distributor.description}
                </p>

                {/* Specialty Hardware */}
                <div className="mt-4 pt-3.5 border-t border-zinc-100 dark:border-white/[0.06] space-y-1">
                  <div className="text-[10px] font-mono uppercase text-zinc-400 font-bold">
                    PRIMARY STOCKED HARDWARE
                  </div>
                  <div className="text-xs font-mono font-semibold text-zinc-800 dark:text-zinc-200">
                    {distributor.specialty}
                  </div>
                </div>
              </div>

              {/* Action Link */}
              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-white/[0.06]">
                <a
                  href={distributor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 hover:bg-[#0d5d50] dark:hover:bg-[#2dd4b5] text-xs font-mono font-bold uppercase tracking-wider active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>Visit Partner Store</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Open Expansion Territories Strip */}
        <div className="mt-8 rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-4 border-b border-zinc-100 dark:border-white/[0.06]">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase text-[#0d5d50] dark:text-[#38e8c6]">
                <MapPin className="w-3.5 h-3.5" />
                <span>OPEN PRIORITY TERRITORIES FOR 2026–2027</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Select an open regional territory below to pre-fill your wholesale distribution application.
              </p>
            </div>
            <span className="text-[11px] font-mono text-zinc-400 uppercase">
              CLICK TO PRE-FILL APPLICATION
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {OPEN_EXPANSION_TERRITORIES.map(item => (
              <button
                key={item.code}
                type="button"
                onClick={() => handleSelectExpansionTerritory(item.label, item.defaultVolume)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-[#f8f7f4] dark:bg-[#14161b] hover:border-zinc-950 dark:hover:border-[#38e8c6] text-xs font-mono text-zinc-800 dark:text-zinc-200 active:scale-[0.98] transition-all cursor-pointer"
              >
                <span className="px-1.5 py-0.5 rounded bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 text-[10px] font-bold">
                  {item.code}
                </span>
                <span className="font-semibold">{item.label}</span>
                <ArrowRight className="w-3 h-3 text-zinc-400" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. WHOLESALE & DISTRIBUTION PERKS */}
      <section className="bg-[#f8f7f4] dark:bg-[#181a20] border-y border-zinc-200/80 dark:border-white/[0.08] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 space-y-1">
            <div className="text-[11px] font-mono font-bold tracking-widest text-[#0d5d50] dark:text-[#38e8c6] uppercase">
              PARTNER BENEFITS &amp; FACTORY STANDARDS
            </div>
            <h2 className="text-2xl sm:text-3xl font-['Montserrat',sans-serif] font-black text-zinc-950 dark:text-white uppercase tracking-tight">
              WHY PARTNER WITH PAPA TATTOO SUPPLY
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#f8f7f4] dark:bg-[#14161b] border border-zinc-200/70 dark:border-white/10 text-[#0d5d50] dark:text-[#38e8c6] flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-mono font-bold text-sm text-zinc-950 dark:text-white uppercase">
                DIRECT FACTORY SHIPMENT
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Direct export container and air express logistics from our manufacturing floor to your regional warehouse.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#f8f7f4] dark:bg-[#14161b] border border-zinc-200/70 dark:border-white/10 text-[#0d5d50] dark:text-[#38e8c6] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-mono font-bold text-sm text-zinc-950 dark:text-white uppercase">
                BATCH QUALITY CONTROL
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Multi-stage optical needle inspection and EO sterilization certificates supplied with every commercial pallet.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#f8f7f4] dark:bg-[#14161b] border border-zinc-200/70 dark:border-white/10 text-[#0d5d50] dark:text-[#38e8c6] flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-mono font-bold text-sm text-zinc-950 dark:text-white uppercase">
                TIERED VOLUME MARGINS
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Structured factory wholesale price tiers supporting sustainable retail margins and studio bulk programs.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#f8f7f4] dark:bg-[#14161b] border border-zinc-200/70 dark:border-white/10 text-[#0d5d50] dark:text-[#38e8c6] flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-mono font-bold text-sm text-zinc-950 dark:text-white uppercase">
                TERRITORY PROTECTION
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Authorized partner listing on our global distributor directory with regional studio inquiry routing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BECOME A DISTRIBUTOR APPLICATION FORM */}
      <section id="apply-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 scroll-mt-24">
        <div className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] p-7 sm:p-10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 border-b border-zinc-100 dark:border-white/[0.06] gap-4">
            <div className="space-y-1.5">
              <div className="text-[11px] font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6] uppercase tracking-wider">
                WHOLESALE PARTNERSHIP DOSSIER
              </div>
              <h2 className="text-2xl sm:text-3xl font-['Montserrat',sans-serif] font-black text-zinc-950 dark:text-white uppercase tracking-tight">
                APPLY FOR REGIONAL DISTRIBUTION
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Submit your company credentials. Our international sales engineering team reviews all applications within 24 hours.
              </p>
            </div>
            <span className="text-[11px] font-mono text-zinc-400 shrink-0">* REQUIRED</span>
          </div>

          {submissionResult ? (
            <div className="p-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              {submissionResult.delivered ? (
                <>
                  <h3 className="text-lg font-black font-mono text-zinc-950 dark:text-white uppercase">
                    APPLICATION RECEIVED · UNDER REVIEW
                  </h3>
                  <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
                    Thank you for your interest in distributing Papa Tattoo Supply apparatus. A dedicated account director will email your wholesale catalog and regional pricing sheet within 24 business hours.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-black font-mono text-zinc-950 dark:text-white uppercase">
                    WHOLESALE APPLICATION READY TO DISPATCH
                  </h3>
                  <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
                    Your distributor credentials for{' '}
                    <strong className="text-zinc-900 dark:text-white">
                      {submissionResult.recipient}
                    </strong>{' '}
                    are formatted and ready. Open your mail client to transmit directly, or copy the full application below for webmail.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                    <a
                      href={submissionResult.mailtoUrl}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 text-xs font-mono font-bold uppercase hover:opacity-90 active:scale-[0.98] transition-all"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Open Mail App</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyApplication}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-white/15 bg-white dark:bg-[#14161b] text-zinc-800 dark:text-zinc-100 text-xs font-mono font-bold uppercase cursor-pointer hover:border-zinc-500 active:scale-[0.98] transition-all"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copied ? 'Copied Application' : 'Copy Full Application'}</span>
                    </button>
                  </div>
                </>
              )}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSubmissionResult(null)
                    setCopied(false)
                  }}
                  className="text-xs font-mono text-zinc-600 dark:text-zinc-300 underline hover:text-zinc-950 dark:hover:text-white cursor-pointer"
                >
                  Edit or Submit Another Application
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs font-mono">
              {formError && (
                <div
                  role="alert"
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300 text-xs"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="dist-company"
                    className="block text-zinc-700 dark:text-zinc-300 font-bold uppercase text-[11px] mb-1.5"
                  >
                    Company / Supply Store Name *
                  </label>
                  <input
                    id="dist-company"
                    name="companyName"
                    type="text"
                    autoComplete="organization"
                    required
                    value={formData.companyName}
                    onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. Acme Tattoo Supply Co."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-[#f8f7f4] dark:bg-[#14161b] text-zinc-900 dark:text-white focus:outline-hidden focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="dist-contact"
                    className="block text-zinc-700 dark:text-zinc-300 font-bold uppercase text-[11px] mb-1.5"
                  >
                    Contact Person Name *
                  </label>
                  <input
                    id="dist-contact"
                    name="contactName"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.contactName}
                    onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                    placeholder="Full Name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-[#f8f7f4] dark:bg-[#14161b] text-zinc-900 dark:text-white focus:outline-hidden focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="dist-email"
                    className="block text-zinc-700 dark:text-zinc-300 font-bold uppercase text-[11px] mb-1.5"
                  >
                    Business Email *
                  </label>
                  <input
                    id="dist-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="wholesale@yourstore.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-[#f8f7f4] dark:bg-[#14161b] text-zinc-900 dark:text-white focus:outline-hidden focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="dist-phone"
                    className="block text-zinc-700 dark:text-zinc-300 font-bold uppercase text-[11px] mb-1.5"
                  >
                    Phone / WhatsApp *
                  </label>
                  <input
                    id="dist-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-[#f8f7f4] dark:bg-[#14161b] text-zinc-900 dark:text-white focus:outline-hidden focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="dist-country"
                    className="block text-zinc-700 dark:text-zinc-300 font-bold uppercase text-[11px] mb-1.5"
                  >
                    Country / Target Territory *
                  </label>
                  <input
                    id="dist-country"
                    name="country"
                    type="text"
                    autoComplete="country-name"
                    required
                    value={formData.country}
                    onChange={e => setFormData({ ...formData, country: e.target.value })}
                    placeholder="e.g. United Kingdom, Germany, Australia..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-[#f8f7f4] dark:bg-[#14161b] text-zinc-900 dark:text-white focus:outline-hidden focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="dist-website"
                    className="block text-zinc-700 dark:text-zinc-300 font-bold uppercase text-[11px] mb-1.5"
                  >
                    Store Website / Social Handle
                  </label>
                  <input
                    id="dist-website"
                    name="website"
                    type="url"
                    autoComplete="url"
                    value={formData.website}
                    onChange={e => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://yourstore.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-[#f8f7f4] dark:bg-[#14161b] text-zinc-900 dark:text-white focus:outline-hidden focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="dist-business-type"
                    className="block text-zinc-700 dark:text-zinc-300 font-bold uppercase text-[11px] mb-1.5"
                  >
                    Business Model
                  </label>
                  <select
                    id="dist-business-type"
                    name="businessType"
                    value={formData.businessType}
                    onChange={e => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-[#f8f7f4] dark:bg-[#14161b] text-zinc-900 dark:text-white focus:outline-hidden focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                  >
                    <option>Retail &amp; Online Store</option>
                    <option>Physical Tattoo Supply Depot</option>
                    <option>Chain Studio Operator</option>
                    <option>Convention / Event Wholesale</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="dist-volume"
                    className="block text-zinc-700 dark:text-zinc-300 font-bold uppercase text-[11px] mb-1.5"
                  >
                    Estimated Monthly Volume
                  </label>
                  <select
                    id="dist-volume"
                    name="monthlyVolume"
                    value={formData.monthlyVolume}
                    onChange={e => setFormData({ ...formData, monthlyVolume: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-[#f8f7f4] dark:bg-[#14161b] text-zinc-900 dark:text-white focus:outline-hidden focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                  >
                    <option>500 - 1,500 boxes/mo</option>
                    <option>2,000 - 5,000 boxes/mo</option>
                    <option>5,000 - 10,000 boxes/mo</option>
                    <option>10,000+ boxes/mo (Container Bulk)</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="dist-message"
                  className="block text-zinc-700 dark:text-zinc-300 font-bold uppercase text-[11px] mb-1.5"
                >
                  Message / Territory Notes
                </label>
                <textarea
                  id="dist-message"
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your distribution channels, current needle brands stocked, or target volume..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-[#f8f7f4] dark:bg-[#14161b] text-zinc-900 dark:text-white focus:outline-hidden focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                />
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full py-3.5 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 font-bold text-xs uppercase tracking-wider hover:bg-[#0d5d50] dark:hover:bg-[#2dd4b5] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {formLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>PREPARING APPLICATION...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>SUBMIT DISTRIBUTOR APPLICATION</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
