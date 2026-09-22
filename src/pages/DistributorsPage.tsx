import React, { useState } from 'react'
import {
  Globe,
  ShieldCheck,
  Building2,
  ExternalLink,
  CheckCircle2,
  Send,
  Loader2,
  PackageCheck,
  Truck,
  Award,
  BadgeCheck,
  ArrowRight,
  Layers,
  Sparkles,
} from 'lucide-react'

interface Distributor {
  id: string
  name: string
  region: string
  country: string
  flag: string
  logo: string
  url: string
  description: string
  specialty: string
  status: 'Authorized Master Partner' | 'Official Regional Distributor'
}

const OFFICIAL_DISTRIBUTORS: Distributor[] = [
  {
    id: 'nuclear-tattoo',
    name: 'Nuclear Tattoo Medical Supply',
    region: 'North America',
    country: 'United States',
    flag: '🇺🇸',
    logo: '/distributors/nuclear_tattoo.png',
    url: 'https://store.nucleartattoo.com',
    description:
      'Premier sterile medical tattoo supplier serving professional artists across North America with factory-certified apparatus.',
    specialty: 'Medical 316L Cartridges, Autoclavable Grips, Precision Rotary Pens',
    status: 'Authorized Master Partner',
  },
  {
    id: 'sd-tattoo',
    name: 'SD Tattoo Supply',
    region: 'North America (West Coast)',
    country: 'United States',
    flag: '🇺🇸',
    logo: '/distributors/sd_tattoo.jpg',
    url: 'https://www.sdtattoosupply.com/',
    description:
      'San Diego-based pro tattoo equipment depot delivering immediate studio dispatch and wholesale tier fulfillment.',
    specialty: 'Studio Hardware, Papa Pen V3 Sets, Disposable Grip Configurations',
    status: 'Authorized Master Partner',
  },
  {
    id: 'cultura-inkfest',
    name: 'Cultura Inkfest Tattoo Supply',
    region: 'Central America & Latin America',
    country: 'Panama',
    flag: '🇵🇦',
    logo: '/distributors/cultura_inkfest.png',
    url: 'https://www.instagram.com/culturainkfesttattoosupply/',
    description:
      'Official convention and studio logistics partner supplying top tattoo parlors throughout Panama and Central America.',
    specialty: 'Papa Premium Cartridges, Full Machine Sets, Expo Logistics',
    status: 'Official Regional Distributor',
  },
]

export const DistributorsPage: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setTimeout(() => {
      setFormLoading(false)
      setFormSubmitted(true)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-transparent text-zinc-900 dark:text-zinc-100 font-sans pb-24 transition-colors">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-[#e2dfd8] dark:border-white/[0.08] bg-white/60 dark:bg-[#16181e]/80 backdrop-blur-xs py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(#2ee6ca_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        <div className="absolute -top-32 right-1/4 w-96 h-96 bg-[#2EE6CA]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2EE6CA]/30 bg-[#2EE6CA]/10 text-[#0d9488] dark:text-[#2EE6CA] text-xs font-mono font-bold tracking-wider uppercase">
              <Globe className="w-3.5 h-3.5 animate-pulse" />
              <span>GLOBAL FACTORY DISTRIBUTION · AUTHORIZED WHOLESALE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-zinc-950 dark:text-white leading-none">
              PAPA TATTOO <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d9488] via-[#2EE6CA] to-teal-400">
                AUTHORIZED DISTRIBUTORS
              </span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-mono leading-relaxed">
              Official regional supply partners and certified distributors authorized to distribute authentic Papa
              Tattoo Supply hardware, needle cartridges, and precision direct-drive rotary apparatus.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 justify-center sm:justify-start">
              <a
                href="#distributor-list"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-zinc-950 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 text-xs font-mono font-bold uppercase tracking-wider shadow-lg hover:shadow-[0_0_20px_rgba(46,230,202,0.3)] transition-all cursor-pointer"
              >
                <span>View Authorized Partners</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="#apply-section"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[#e2dfd8] dark:border-white/10 hover:border-zinc-500 dark:hover:border-[#2ee6ca]/50 text-zinc-800 dark:text-zinc-200 text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-[#0d9488] dark:text-[#2ee6ca]" />
                <span>Apply for Territory Distribution</span>
              </a>
            </div>
          </div>

          {/* Stat Pillars */}
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto shrink-0">
            <div className="p-4 rounded-xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white/70 dark:bg-[#1e2028] backdrop-blur-xs text-center shadow-xs">
              <div className="text-3xl font-black font-mono text-[#0d9488] dark:text-[#2EE6CA]">60+</div>
              <div className="text-[11px] font-mono text-zinc-500 uppercase mt-1">Countries Shipped</div>
            </div>
            <div className="p-4 rounded-xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white/70 dark:bg-[#1e2028] backdrop-blur-xs text-center shadow-xs">
              <div className="text-3xl font-black font-mono text-[#0d9488] dark:text-[#2EE6CA]">100%</div>
              <div className="text-[11px] font-mono text-zinc-500 uppercase mt-1">EO Gas Certified</div>
            </div>
            <div className="p-4 rounded-xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white/70 dark:bg-[#1e2028] backdrop-blur-xs text-center shadow-xs">
              <div className="text-3xl font-black font-mono text-amber-500">QC</div>
              <div className="text-[11px] font-mono text-zinc-500 uppercase mt-1">Factory Tested</div>
            </div>
            <div className="p-4 rounded-xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white/70 dark:bg-[#1e2028] backdrop-blur-xs text-center shadow-xs">
              <div className="text-3xl font-black font-mono text-[#0d9488] dark:text-[#2EE6CA]">24H</div>
              <div className="text-[11px] font-mono text-zinc-500 uppercase mt-1">Priority Dispatch</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PARTNER DIRECTORY SECTION */}
      <section id="distributor-list" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-28">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#e2dfd8] dark:border-white/[0.08] gap-4">
          <div>
            <div className="text-[11px] font-mono font-bold tracking-widest text-[#0d9488] dark:text-[#2EE6CA] uppercase flex items-center gap-1.5">
              <BadgeCheck className="w-3.5 h-3.5" />
              <span>VERIFIED FACTORY REPRESENTATIVES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white uppercase tracking-tight">
              CURRENT OFFICIAL DISTRIBUTORS
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            AUTHENTIC PAPA WARRANTY & REPAIR VALIDATED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {OFFICIAL_DISTRIBUTORS.map(distributor => (
            <div
              key={distributor.id}
              className="group rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#1e2028] p-6 flex flex-col justify-between hover:border-zinc-400 dark:hover:border-[#2EE6CA]/50 hover:shadow-xl dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)] transition-all duration-300 relative overflow-hidden"
            >
              {/* Corner Badge */}
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#0d9488]/10 dark:bg-[#2EE6CA]/15 text-[#0d9488] dark:text-[#2EE6CA] border border-[#2EE6CA]/30">
                  <ShieldCheck className="w-3 h-3" />
                  <span>VERIFIED</span>
                </span>
              </div>

              <div>
                {/* Logo Box */}
                <div className="w-full aspect-16/10 rounded-xl bg-[#eceae4]/50 dark:bg-[#15171d] border border-[#e2dfd8]/80 dark:border-white/[0.06] flex items-center justify-center p-6 mb-6 group-hover:scale-[1.02] transition-transform">
                  <img
                    src={distributor.logo}
                    alt={distributor.name}
                    className="max-h-24 max-w-full object-contain filter dark:brightness-110 drop-shadow-md"
                  />
                </div>

                {/* Country & Region */}
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-2">
                  <span className="text-base">{distributor.flag}</span>
                  <span>{distributor.country}</span>
                  <span>·</span>
                  <span className="text-[#0d9488] dark:text-[#2EE6CA]">{distributor.region}</span>
                </div>

                {/* Name */}
                <h3 className="text-lg font-black text-zinc-950 dark:text-white uppercase tracking-tight group-hover:text-[#0d9488] dark:group-hover:text-[#2EE6CA] transition-colors">
                  {distributor.name}
                </h3>

                {/* Description */}
                <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400 mt-2.5 leading-relaxed">
                  {distributor.description}
                </p>

                {/* Specialty Pills */}
                <div className="mt-4 pt-3 border-t border-[#e2dfd8]/60 dark:border-white/[0.06] space-y-1">
                  <div className="text-[10px] font-mono uppercase text-zinc-400 font-bold">
                    PRIMARY STOCKED HARDWARE:
                  </div>
                  <div className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300">
                    {distributor.specialty}
                  </div>
                </div>
              </div>

              {/* Action Link */}
              <div className="mt-6 pt-4 border-t border-[#e2dfd8]/60 dark:border-white/[0.06]">
                <a
                  href={distributor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[#e2dfd8] dark:border-white/10 hover:border-zinc-950 dark:hover:border-[#2EE6CA] bg-zinc-50 dark:bg-white/[0.04] hover:bg-zinc-950 hover:text-white dark:hover:bg-[#2EE6CA] dark:hover:text-zinc-950 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  <span>Visit Store / Order</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. WHOLESALE & DISTRIBUTION PERKS */}
      <section className="bg-[#eceae4]/40 dark:bg-[#171920]/70 border-y border-[#e2dfd8] dark:border-white/[0.08] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <div className="text-[11px] font-mono font-bold tracking-widest text-[#0d9488] dark:text-[#2EE6CA] uppercase">
              PARTNER BENEFITS & FACTORY STANDARDS
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white uppercase tracking-tight">
              WHY PARTNER WITH PAPA TATTOO SUPPLY
            </h2>
            <p className="text-xs font-mono text-zinc-500">
              Direct factory pricing tiers and volume wholesale support for professional distribution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#1e2028] space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[#2EE6CA]/15 text-[#0d9488] dark:text-[#2EE6CA] flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-mono font-bold text-sm text-zinc-950 dark:text-white uppercase">
                DIRECT FACTORY SHIPMENT
              </h3>
              <p className="text-xs font-mono text-zinc-500 leading-relaxed">
                Direct export container and air express logistics from our manufacturing facilities to your regional warehouse.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#1e2028] space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-mono font-bold text-sm text-zinc-950 dark:text-white uppercase">
                FACTORY QUALITY CONTROL
              </h3>
              <p className="text-xs font-mono text-zinc-500 leading-relaxed">
                Rigorous multi-stage factory quality control and consistent manufacturing standards across all apparatus batches.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#1e2028] space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[#2EE6CA]/15 text-[#0d9488] dark:text-[#2EE6CA] flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-mono font-bold text-sm text-zinc-950 dark:text-white uppercase">
                TIERED VOLUME MARGINS
              </h3>
              <p className="text-xs font-mono text-zinc-500 leading-relaxed">
                Extremely competitive wholesale price structure allowing healthy retail margins and studio bulk programs.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#1e2028] space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-mono font-bold text-sm text-zinc-950 dark:text-white uppercase">
                REGIONAL PROTECTION
              </h3>
              <p className="text-xs font-mono text-zinc-500 leading-relaxed">
                Territorial partner recognition with official studio referral routing on our global store locator.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BECOME A DISTRIBUTOR APPLICATION FORM */}
      <section id="apply-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 scroll-mt-28">
        <div className="rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#1e2028] p-8 sm:p-12 shadow-xl dark:shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#0d9488] dark:text-[#2EE6CA] uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>WHOLESALE PARTNERSHIP APPLICATION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white uppercase tracking-tight">
              APPLY FOR REGIONAL DISTRIBUTION
            </h2>
            <p className="text-xs font-mono text-zinc-500">
              Submit your company credentials. Our international sales engineering team reviews all applications within 24 hours.
            </p>
          </div>

          {formSubmitted ? (
            <div className="p-8 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-center space-y-3 animate-in fade-in zoom-in-95">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-lg font-black font-mono text-zinc-950 dark:text-white uppercase">
                APPLICATION RECEIVED · UNDER REVIEW
              </h3>
              <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
                Thank you for your interest in distributing Papa Tattoo Supply apparatus. A dedicated account director will email your wholesale catalog and regional pricing sheet within 24 business hours.
              </p>
              <button
                onClick={() => setFormSubmitted(false)}
                className="mt-4 px-4 py-2 rounded-lg bg-zinc-900 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 text-xs font-mono font-bold uppercase cursor-pointer"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-bold uppercase mb-1">
                    Company / Supply Store Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. Acme Tattoo Supply Co."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2dfd8] dark:border-white/10 bg-zinc-50/80 dark:bg-white/[0.04] text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:border-[#2EE6CA]"
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-bold uppercase mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                    placeholder="Full Name"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2dfd8] dark:border-white/10 bg-zinc-50/80 dark:bg-white/[0.04] text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:border-[#2EE6CA]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-bold uppercase mb-1">
                    Business Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="wholesale@yourstore.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2dfd8] dark:border-white/10 bg-zinc-50/80 dark:bg-white/[0.04] text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:border-[#2EE6CA]"
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-bold uppercase mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2dfd8] dark:border-white/10 bg-zinc-50/80 dark:bg-white/[0.04] text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:border-[#2EE6CA]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-bold uppercase mb-1">
                    Country / Target Territory *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={e => setFormData({ ...formData, country: e.target.value })}
                    placeholder="e.g. United Kingdom, Germany, Australia..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2dfd8] dark:border-white/10 bg-zinc-50/80 dark:bg-white/[0.04] text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:border-[#2EE6CA]"
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-bold uppercase mb-1">
                    Store Website / Social Handle
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={e => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://yourstore.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2dfd8] dark:border-white/10 bg-zinc-50/80 dark:bg-white/[0.04] text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:border-[#2EE6CA]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-bold uppercase mb-1">
                    Business Model
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={e => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2dfd8] dark:border-white/10 bg-zinc-50/80 dark:bg-[#16181e] text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:border-[#2EE6CA]"
                  >
                    <option>Retail & Online Store</option>
                    <option>Physical Tattoo Supply Depot</option>
                    <option>Chain Studio Operator</option>
                    <option>Convention / Event Wholesale</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-bold uppercase mb-1">
                    Estimated Monthly Volume
                  </label>
                  <select
                    value={formData.monthlyVolume}
                    onChange={e => setFormData({ ...formData, monthlyVolume: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2dfd8] dark:border-white/10 bg-zinc-50/80 dark:bg-[#16181e] text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:border-[#2EE6CA]"
                  >
                    <option>500 - 1,500 boxes/mo</option>
                    <option>2,000 - 5,000 boxes/mo</option>
                    <option>5,000 - 10,000 boxes/mo</option>
                    <option>10,000+ boxes/mo (Container Bulk)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-700 dark:text-zinc-300 font-bold uppercase mb-1">
                  Message / Territory Notes
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your distribution channels, current needle brands stocked, or target volume..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2dfd8] dark:border-white/10 bg-zinc-50/80 dark:bg-white/[0.04] text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:border-[#2EE6CA]"
                />
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full py-3.5 rounded-lg bg-zinc-950 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(46,230,202,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {formLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>TRANSMITTING CREDENTIALS...</span>
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
