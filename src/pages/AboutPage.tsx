import React from 'react'
import { Link } from '@tanstack/react-router'
import {
  ShieldCheck,
  Globe,
  Award,
  Truck,
  RotateCcw,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Wrench,
  CheckCircle2,
  FileText,
  Clock,
  Building2,
} from 'lucide-react'

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0A0C0F] text-zinc-900 dark:text-zinc-100 font-sans pb-24 transition-colors">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-[#1E232E] bg-white dark:bg-[#0E1015] py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(#2ee6ca_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-[#2EE6CA]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2EE6CA]/30 bg-[#2EE6CA]/10 text-[#0d9488] dark:text-[#2EE6CA] text-xs font-mono font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ORIGIN & FACTORY PHILOSOPHY</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-zinc-950 dark:text-white leading-none">
              ABOUT PAPA TATTOO <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d9488] via-[#2EE6CA] to-teal-400">
                SUPPLY & ENGINEERING
              </span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-mono leading-relaxed">
              Papa Tattoo Supply is committed to delivering world-class tattoo equipment, precision rotary apparatus, medical-grade sterilized cartridges, and pro station hardware directly to licensed tattoo studios worldwide.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 justify-center sm:justify-start">
              <Link
                to="/collections"
                search={{ category: 'all' }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-zinc-950 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 text-xs font-mono font-bold uppercase tracking-wider shadow-lg hover:shadow-[0_0_20px_rgba(46,230,202,0.3)] transition-all"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                to="/wholesale"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-zinc-300 dark:border-[#2A303C] hover:border-zinc-500 dark:hover:border-[#2ee6ca]/50 text-zinc-800 dark:text-zinc-200 text-xs font-mono font-bold uppercase tracking-wider transition-colors"
              >
                <Building2 className="w-3.5 h-3.5 text-[#0d9488] dark:text-[#2ee6ca]" />
                <span>Studio Wholesale Program</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto shrink-0">
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-[#1E232E] bg-zinc-50/50 dark:bg-[#12151B] text-center">
              <div className="text-3xl font-black font-mono text-[#0d9488] dark:text-[#2EE6CA]">2015</div>
              <div className="text-[11px] font-mono text-zinc-500 uppercase mt-1">Founding Heritage</div>
            </div>
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-[#1E232E] bg-zinc-50/50 dark:bg-[#12151B] text-center">
              <div className="text-3xl font-black font-mono text-[#0d9488] dark:text-[#2EE6CA]">60+</div>
              <div className="text-[11px] font-mono text-zinc-500 uppercase mt-1">Global Destinations</div>
            </div>
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-[#1E232E] bg-zinc-50/50 dark:bg-[#12151B] text-center">
              <div className="text-3xl font-black font-mono text-amber-500">QC</div>
              <div className="text-[11px] font-mono text-zinc-500 uppercase mt-1">Factory Tested</div>
            </div>
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-[#1E232E] bg-zinc-50/50 dark:bg-[#12151B] text-center">
              <div className="text-3xl font-black font-mono text-[#0d9488] dark:text-[#2EE6CA]">100%</div>
              <div className="text-[11px] font-mono text-zinc-500 uppercase mt-1">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHO WE ARE (ORIGINAL MANIFESTO) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="text-[11px] font-mono font-bold tracking-widest text-[#0d9488] dark:text-[#2EE6CA] uppercase flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>// DIRECT MANUFACTURER HERITAGE</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-zinc-950 dark:text-white leading-tight">
              WHO WE ARE & WHAT DRIVES US
            </h2>

            <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              <p>
                Papa Tattoo Supply is committed to providing high-quality products. We offer a full line of tattoo equipment, rotary machines, sterile cartridges, and accessories with door-to-door delivery catering specifically to the rigorous demands of professional, licensed tattoo parlors.
              </p>
              <p>
                We strive to expand globally and deliver superior, world-class instruments as a proud direct manufacturer of precision tattoo needle configurations, ergonomic grips, and high-performance wireless power units. By eliminating secondary reseller markups, we provide true wholesale pricing without ever compromising on quality assurance.
              </p>
              <p>
                We value long-term relationships with studio owners and working artists. Whether you need custom studio batch orders or dependable daily consumables, our team ensures rapid response, verified sterile batch certifications, and attentive customer service.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-[#1E232E] bg-white dark:bg-[#11141B] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#2EE6CA]/10 text-[#0d9488] dark:text-[#2EE6CA] flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-mono font-bold text-sm text-zinc-950 dark:text-white uppercase">Direct Machine Machining</h3>
              <p className="text-xs text-zinc-500 font-mono leading-relaxed">
                6061-T6 aviation alloy CNC carved chassis with custom brushless coreless motors for sub-0.01mm concentricity.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-[#1E232E] bg-white dark:bg-[#11141B] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-mono font-bold text-sm text-zinc-950 dark:text-white uppercase">Japanese 316L Needles</h3>
              <p className="text-xs text-zinc-500 font-mono leading-relaxed">
                Medical-grade stainless steel with micro-stabilizer guides and elastic silicone rebound safety membranes.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-[#1E232E] bg-white dark:bg-[#11141B] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-mono font-bold text-sm text-zinc-950 dark:text-white uppercase">100% EO Sterilized</h3>
              <p className="text-xs text-zinc-500 font-mono leading-relaxed">
                Every cartridge blister is individually gas sterilized with verifiable lot number and expiration stamping.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-[#1E232E] bg-white dark:bg-[#11141B] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-mono font-bold text-sm text-zinc-950 dark:text-white uppercase">Door-to-Door Logistics</h3>
              <p className="text-xs text-zinc-500 font-mono leading-relaxed">
                Global express courier accounts with UPS, DHL, and FedEx for expedited studio delivery worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. POLICIES & GUARANTEES */}
      <section className="bg-zinc-100/70 dark:bg-[#0E1116] border-y border-zinc-200 dark:border-[#1E232E] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="text-[11px] font-mono font-bold tracking-widest text-[#0d9488] dark:text-[#2EE6CA] uppercase">
              // STUDIO PROMISES & QUALITY ASSURANCE
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white uppercase tracking-tight">
              OUR COMMITMENT TO YOUR PARLOR
            </h2>
            <p className="text-xs font-mono text-zinc-500">
              Clear warranty standards, immediate dispatch guarantees, and complete transaction security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Guarantee 1: Shipping */}
            <div className="p-8 rounded-2xl border border-zinc-200 dark:border-[#1E232E] bg-white dark:bg-[#12151C] space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#2EE6CA]/15 text-[#0d9488] dark:text-[#2EE6CA] flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-mono font-black text-base text-zinc-950 dark:text-white uppercase">
                FAST SHIPMENT GUARANTEE
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                We make it easier for you! Studio orders are processed with priority dispatch via UPS Ground, 3 Day Select, 2nd Day Air, Next Day Air, and DHL Express. Verified tracking numbers are transmitted immediately upon shipping.
              </p>
            </div>

            {/* Guarantee 2: 14-Day Return & Replacement */}
            <div className="p-8 rounded-2xl border border-zinc-200 dark:border-[#1E232E] bg-white dark:bg-[#12151C] space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h3 className="font-mono font-black text-base text-zinc-950 dark:text-white uppercase">
                14-DAY QUALITY ASSURANCE
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                Items can be returned for exchange or full refund in the rare event of a manufacturing fault within 14 days from the date of receipt. If an incorrect specification is shipped, we immediately expedite a replacement and reimburse return shipping costs.
              </p>
            </div>

            {/* Guarantee 3: Security & Encryption */}
            <div className="p-8 rounded-2xl border border-zinc-200 dark:border-[#1E232E] bg-white dark:bg-[#12151C] space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-mono font-black text-base text-zinc-950 dark:text-white uppercase">
                ENCRYPTED DIRECT CHECKOUT
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                Security is our top priority. All transactions are protected via PCI-DSS Level 1 256-bit encrypted checkout powered by Shopify Storefront infrastructure. Your financial and commercial studio data remains fully guarded at all times.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. REPAIR & TECHNICAL RMA FORM SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="rounded-2xl border border-zinc-200 dark:border-[#1E232E] bg-white dark:bg-[#11141B] p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#0d9488] dark:text-[#2EE6CA] uppercase">
              <Wrench className="w-4 h-4" />
              <span>OFFICIAL PAPA RMA & MAINTENANCE</span>
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-zinc-950 dark:text-white">
              PAPA MACHINE REPAIR & WARRANTY SERVICE
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed max-w-xl">
              Need technical calibration, cam stroke maintenance, or factory motor diagnosis for your Papa Pen or Rotary apparatus? Download the official Papa Machine Repair RMA Form, fill in your serial code, and include it with your securely packaged parcel.
            </p>
          </div>

          <a
            href="https://drive.google.com/file/d/1nMPw2A9x_AwQnlFp0yew_2XNbMBKoiEf/view"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-zinc-950 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 text-xs font-mono font-bold uppercase tracking-wider shadow-lg hover:shadow-[0_0_20px_rgba(46,230,202,0.3)] transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Download Repair Form (PDF)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>
    </div>
  )
}
