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
  hub: string
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
    hub: 'North America',
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
    hub: 'West Coast US',
    isoCountry: 'US',
    territoryGroup: 'NORTH_AMERICA',
    name: 'SD Tattoo Supply',
    region: 'West Coast Hub',
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
    hub: 'Central America',
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
    <div className="min-h-[100dvh] bg-[#f5f5f7] dark:bg-black text-[#1d1d1f] dark:text-[#f5f5f7] font-sans pb-24 transition-colors duration-200">
      {/* 1. HERO SECTION */}
      <section className="pt-12 sm:pt-20 pb-12 sm:pb-16">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/[0.045] dark:bg-white/[0.08] text-xs font-medium text-[#86868b]">
                <Globe className="w-3.5 h-3.5 text-[#86868b]" />
                <span>Global Factory Distribution · Authorized Wholesale</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-semibold tracking-[-0.035em] text-[#1d1d1f] dark:text-[#f5f5f7] leading-[1.06]">
                Papa Tattoo Authorized Distributors
              </h1>

              <p className="text-base sm:text-lg text-[#86868b] leading-relaxed max-w-2xl font-normal">
                Official regional supply depots and certified wholesale partners authorized to distribute authentic Papa Tattoo Supply rotary machines, click grips, and 316L sterile cartridge needles.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="#distributor-list"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-sm font-medium hover:opacity-85 active:scale-[0.97] transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] cursor-pointer"
                >
                  <span>View Verified Depots</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#apply-section"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7] active:scale-[0.97] transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-[#86868b]" />
                  <span>Apply for Territory Distribution</span>
                </a>
              </div>
            </div>

            {/* Stat Pillars */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="p-6 rounded-[24px] bg-white dark:bg-[#121214] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)] flex flex-col justify-between">
                <div className="text-xs font-medium text-[#86868b]">
                  Export Reach
                </div>
                <div className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] tabular-nums text-[#1d1d1f] dark:text-[#f5f5f7] mt-3">
                  60+
                </div>
                <div className="text-xs text-[#86868b] mt-1.5 font-medium">
                  Countries Shipped
                </div>
              </div>

              <div className="p-6 rounded-[24px] bg-white dark:bg-[#121214] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)] flex flex-col justify-between">
                <div className="text-xs font-medium text-[#86868b]">
                  Sterility Spec
                </div>
                <div className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] tabular-nums text-[#1d1d1f] dark:text-[#f5f5f7] mt-3">
                  100%
                </div>
                <div className="text-xs text-[#86868b] mt-1.5 font-medium">
                  EO Gas Lot Certified
                </div>
              </div>

              <div className="p-6 rounded-[24px] bg-white dark:bg-[#121214] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)] flex flex-col justify-between">
                <div className="text-xs font-medium text-[#86868b]">
                  Inspection
                </div>
                <div className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] tabular-nums text-[#1d1d1f] dark:text-[#f5f5f7] mt-3">
                  30x
                </div>
                <div className="text-xs text-[#86868b] mt-1.5 font-medium">
                  Optical Tip QC
                </div>
              </div>

              <div className="p-6 rounded-[24px] bg-white dark:bg-[#121214] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)] flex flex-col justify-between">
                <div className="text-xs font-medium text-[#86868b]">
                  Dispatch SLA
                </div>
                <div className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] tabular-nums text-[#1d1d1f] dark:text-[#f5f5f7] mt-3">
                  24h
                </div>
                <div className="text-xs text-[#86868b] mt-1.5 font-medium">
                  Priority Air &amp; Sea
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PARTNER DIRECTORY SECTION */}
      <section id="distributor-list" className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 scroll-mt-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 pb-6 border-b border-black/[0.06] dark:border-white/[0.08] gap-4">
          <div>
            <div className="text-xs font-medium text-[#86868b] flex items-center gap-1.5">
              <BadgeCheck className="w-4 h-4 text-[#86868b]" />
              <span>Verified Factory Representatives</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-[-0.025em] mt-1.5">
              Official Regional Supply Depots
            </h2>
          </div>

          {/* Region Filter Pills */}
          <div
            role="group"
            aria-label="Filter distributors by region"
            className="inline-flex items-center gap-1 p-1 rounded-full bg-black/[0.05] dark:bg-white/[0.08] self-start lg:self-auto"
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
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-[background-color,color,transform] duration-150 ease-[var(--ease-out-strong)] cursor-pointer active:scale-[0.98] ${
                    active
                      ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-2xs'
                      : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
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
              className="group rounded-[28px] bg-white dark:bg-[#121214] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)] p-7 flex flex-col justify-between hover:shadow-xl transition-[transform,box-shadow] duration-200"
            >
              <div>
                {/* Top Telemetry Bar */}
                <div className="flex items-center justify-between gap-2 mb-5">
                  <span className="px-3 py-1 rounded-full bg-black/[0.045] dark:bg-white/[0.08] text-xs font-medium text-[#86868b]">
                    {distributor.isoCountry} · {distributor.hub}
                  </span>

                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-black/[0.045] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                </div>

                {/* Logo Box */}
                <div className="w-full aspect-16/10 rounded-2xl bg-black/[0.035] dark:bg-white/[0.05] flex items-center justify-center p-6 mb-6">
                  <img
                    src={distributor.logo}
                    alt={distributor.name}
                    className="max-h-20 max-w-full object-contain filter dark:brightness-110 transition-transform duration-200 ease-[var(--ease-out-strong)] group-hover:scale-[1.03]"
                  />
                </div>

                {/* Country & Region */}
                <div className="text-xs font-medium text-[#86868b] mb-1">
                  {distributor.country} · {distributor.region}
                </div>

                <h3 className="text-lg font-semibold tracking-[-0.015em] text-[#1d1d1f] dark:text-[#f5f5f7] mb-2 leading-snug">
                  {distributor.name}
                </h3>

                <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed mb-4">
                  {distributor.description}
                </p>

                <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08]">
                  <div className="text-xs text-[#86868b]">
                    <span className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">Specialty:</span> {distributor.specialty}
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-black/[0.06] dark:border-white/[0.08]">
                <a
                  href={distributor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-xs font-medium flex items-center justify-center gap-2 hover:opacity-85 active:scale-[0.98] transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)]"
                >
                  <span>Visit Supply Depot</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Open Expansion Territories Strip */}
        <div className="mt-10 rounded-[28px] bg-white dark:bg-[#121214] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)] p-7 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 mb-5 border-b border-black/[0.06] dark:border-white/[0.08]">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#86868b]">
                <MapPin className="w-3.5 h-3.5 text-[#86868b]" />
                <span>Open Priority Territories · 2026 to 2027</span>
              </div>
              <p className="text-xs text-[#86868b]">
                Select an open regional territory below to pre-fill your wholesale distribution application.
              </p>
            </div>
            <span className="text-xs font-medium text-[#86868b]">
              Click territory to pre-fill
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {OPEN_EXPANSION_TERRITORIES.map(item => (
              <button
                key={item.code}
                type="button"
                onClick={() => handleSelectExpansionTerritory(item.label, item.defaultVolume)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/[0.045] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] active:scale-[0.98] transition-all duration-150 cursor-pointer"
              >
                <span className="px-1.5 py-0.5 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-[10px] font-semibold">
                  {item.code}
                </span>
                <span>{item.label}</span>
                <ArrowRight className="w-3 h-3 text-[#86868b]" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. WHOLESALE & DISTRIBUTION PERKS */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 space-y-1.5">
            <div className="text-xs font-medium text-[#86868b]">
              Partner Benefits &amp; Factory Standards
            </div>
            <h2 className="text-2xl sm:text-4xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-[-0.025em]">
              Why Partner with Papa Tattoo Supply
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-7 rounded-[28px] bg-white dark:bg-[#121214] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-[#1d1d1f] dark:text-[#f5f5f7] tracking-[-0.015em]">
                Direct Factory Shipment
              </h3>
              <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                Direct export container and air express logistics from our manufacturing floor to your regional warehouse.
              </p>
            </div>

            <div className="p-7 rounded-[28px] bg-white dark:bg-[#121214] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-[#1d1d1f] dark:text-[#f5f5f7] tracking-[-0.015em]">
                Batch Quality Control
              </h3>
              <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                Multi-stage optical needle inspection and EO sterilization certificates supplied with every commercial pallet.
              </p>
            </div>

            <div className="p-7 rounded-[28px] bg-white dark:bg-[#121214] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-[#1d1d1f] dark:text-[#f5f5f7] tracking-[-0.015em]">
                Tiered Volume Margins
              </h3>
              <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                Structured factory wholesale price tiers supporting sustainable retail margins and studio bulk programs.
              </p>
            </div>

            <div className="p-7 rounded-[28px] bg-white dark:bg-[#121214] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-[#1d1d1f] dark:text-[#f5f5f7] tracking-[-0.015em]">
                Territory Protection
              </h3>
              <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                Authorized partner listing on our global distributor directory with regional studio inquiry routing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BECOME A DISTRIBUTOR APPLICATION FORM */}
      <section id="apply-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 scroll-mt-24">
        <div className="rounded-[32px] bg-white dark:bg-[#121214] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)] p-8 sm:p-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 border-b border-black/[0.06] dark:border-white/[0.08] gap-4">
            <div className="space-y-1.5">
              <div className="text-xs font-medium text-[#86868b]">
                Wholesale Partnership Dossier
              </div>
              <h2 className="text-2xl sm:text-4xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-[-0.025em]">
                Apply for Regional Distribution
              </h2>
              <p className="text-xs sm:text-sm text-[#86868b]">
                Submit your company credentials. Our international sales engineering team reviews all applications within 24 hours.
              </p>
            </div>
            <span className="text-xs text-[#86868b] shrink-0">* Required</span>
          </div>

          {submissionResult ? (
            <div className="p-8 sm:p-10 rounded-[24px] bg-black/[0.03] dark:bg-white/[0.05] text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-[#1d1d1f] dark:text-white mx-auto" />
              {submissionResult.delivered ? (
                <>
                  <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                    Application Received · Under Review
                  </h3>
                  <p className="text-xs sm:text-sm text-[#86868b] max-w-md mx-auto leading-relaxed">
                    Thank you for your interest in distributing Papa Tattoo Supply apparatus. A dedicated account director will email your wholesale catalog and regional pricing sheet within 24 business hours.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                    Wholesale Application Ready to Dispatch
                  </h3>
                  <p className="text-xs sm:text-sm text-[#86868b] max-w-lg mx-auto leading-relaxed">
                    Your distributor credentials for{' '}
                    <strong className="text-[#1d1d1f] dark:text-white font-medium">
                      {submissionResult.recipient}
                    </strong>{' '}
                    are formatted and ready. Open your mail client to transmit directly, or copy the full application below for webmail.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <a
                      href={submissionResult.mailtoUrl}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-xs font-medium hover:opacity-85 active:scale-[0.98] transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)]"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Open Mail App</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyApplication}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] text-[#1d1d1f] dark:text-[#f5f5f7] text-xs font-medium cursor-pointer active:scale-[0.98] transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)]"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-[#1d1d1f] dark:text-white" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-[#86868b]" />
                      )}
                      <span>{copied ? 'Copied Application' : 'Copy Full Application'}</span>
                    </button>
                  </div>
                </>
              )}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setSubmissionResult(null)
                    setCopied(false)
                  }}
                  className="text-xs text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white underline cursor-pointer"
                >
                  Edit or Submit Another Application
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              {formError && (
                <div
                  role="alert"
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-500/10 text-red-700 dark:text-red-300 text-xs"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="dist-company"
                    className="block text-xs font-medium text-[#86868b] mb-1.5"
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
                    className="w-full px-4 py-3 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] text-sm text-[#1d1d1f] dark:text-white placeholder-[#86868b] focus:outline-hidden focus:ring-2 focus:ring-[#1d1d1f]/15 dark:focus:ring-white/20 transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="dist-contact"
                    className="block text-xs font-medium text-[#86868b] mb-1.5"
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
                    className="w-full px-4 py-3 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] text-sm text-[#1d1d1f] dark:text-white placeholder-[#86868b] focus:outline-hidden focus:ring-2 focus:ring-[#1d1d1f]/15 dark:focus:ring-white/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="dist-email"
                    className="block text-xs font-medium text-[#86868b] mb-1.5"
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
                    className="w-full px-4 py-3 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] text-sm text-[#1d1d1f] dark:text-white placeholder-[#86868b] focus:outline-hidden focus:ring-2 focus:ring-[#1d1d1f]/15 dark:focus:ring-white/20 transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="dist-phone"
                    className="block text-xs font-medium text-[#86868b] mb-1.5"
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
                    className="w-full px-4 py-3 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] text-sm text-[#1d1d1f] dark:text-white placeholder-[#86868b] focus:outline-hidden focus:ring-2 focus:ring-[#1d1d1f]/15 dark:focus:ring-white/20 transition-all tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="dist-country"
                    className="block text-xs font-medium text-[#86868b] mb-1.5"
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
                    className="w-full px-4 py-3 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] text-sm text-[#1d1d1f] dark:text-white placeholder-[#86868b] focus:outline-hidden focus:ring-2 focus:ring-[#1d1d1f]/15 dark:focus:ring-white/20 transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="dist-website"
                    className="block text-xs font-medium text-[#86868b] mb-1.5"
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
                    className="w-full px-4 py-3 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] text-sm text-[#1d1d1f] dark:text-white placeholder-[#86868b] focus:outline-hidden focus:ring-2 focus:ring-[#1d1d1f]/15 dark:focus:ring-white/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="dist-business-type"
                    className="block text-xs font-medium text-[#86868b] mb-1.5"
                  >
                    Business Model
                  </label>
                  <select
                    id="dist-business-type"
                    name="businessType"
                    value={formData.businessType}
                    onChange={e => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] text-sm text-[#1d1d1f] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#1d1d1f]/15 dark:focus:ring-white/20 transition-all"
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
                    className="block text-xs font-medium text-[#86868b] mb-1.5"
                  >
                    Estimated Monthly Volume
                  </label>
                  <select
                    id="dist-volume"
                    name="monthlyVolume"
                    value={formData.monthlyVolume}
                    onChange={e => setFormData({ ...formData, monthlyVolume: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] text-sm text-[#1d1d1f] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#1d1d1f]/15 dark:focus:ring-white/20 transition-all"
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
                  className="block text-xs font-medium text-[#86868b] mb-1.5"
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
                  className="w-full px-4 py-3 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] text-sm text-[#1d1d1f] dark:text-white placeholder-[#86868b] focus:outline-hidden focus:ring-2 focus:ring-[#1d1d1f]/15 dark:focus:ring-white/20 transition-all resize-y"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full h-12 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-sm font-medium flex items-center justify-center gap-2 hover:opacity-85 active:scale-[0.98] transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] disabled:opacity-50 cursor-pointer"
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Preparing Application…</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Distributor Application</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
