import React, { useState } from 'react'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Send,
  MessageSquare,
  Building2,
  CheckCircle2,
  Loader2,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  Headphones,
  FileText,
  ExternalLink,
} from 'lucide-react'

export const ContactPage: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studio: '',
    topic: 'wholesale',
    orderNumber: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setTimeout(() => {
      setFormLoading(false)
      setFormSubmitted(true)
    }, 1000)
  }

  const faqs = [
    {
      q: 'How fast does international dispatch and shipping take?',
      a: 'All orders placed before 14:00 (GMT+8) ship same business day directly from our central sterile logistics hub. Typical express delivery via DHL Express / FedEx International takes 3-5 business days to North America and Europe.',
    },
    {
      q: 'What is the manufacturer warranty on Papa Pen rotary machines?',
      a: 'All Papa Pen machines (Papa Pen, V2, V3) include a comprehensive 1-Year Direct Factory Replacement Warranty covering the custom brushless core motor, internal eccentric bearings, and electrical RCA connector.',
    },
    {
      q: 'How do I access Studio Wholesale pricing and volume discounts?',
      a: 'Licensed tattoo studios and high-volume artists ordering 30+ cartridge boxes or multiple machines qualify for 30% to 50% wholesale discounts. You can submit an inquiry below or register directly via our Studio Wholesale Portal.',
    },
    {
      q: 'How do I submit my Papa machine for factory warranty repair / RMA?',
      a: 'Download the official Papa Machine Repair RMA Form (PDF), fill out your machine model, serial number, and failure symptoms, and include it inside your securely packaged shipment. Address the package to our authorized repair depot. We inspect, service, and calibrate machines within 48 hours of receipt.',
    },
    {
      q: 'Are sterilization reports and membrane certificates available?',
      a: 'Yes. Every individual blister pack of Papa Premium and Standard Cartridges is sterilized via Medical EO Gas and features an active chemical indicator dot plus verifiable sterilization batch/lot records compliant with ISO 13485 and CE standards.',
    },
  ]

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0A0C0F] text-zinc-900 dark:text-zinc-100 font-sans pb-24 transition-colors">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-[#1E232E] bg-white dark:bg-[#0E1015] py-16 sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(#2ee6ca_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2EE6CA]/30 bg-[#2EE6CA]/10 text-[#0d9488] dark:text-[#2EE6CA] text-xs font-mono font-bold tracking-wider uppercase mb-4">
            <Headphones className="w-3.5 h-3.5" />
            <span>DIRECT FACTORY SUPPORT & GLOBAL LOGISTICS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-zinc-950 dark:text-white">
            CONTACT{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d9488] to-[#2EE6CA]">
              PAPA TATTOO SUPPLY
            </span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-mono leading-relaxed">
            Direct communication channels for licensed tattoo artists, studio owners, and global distributors.
            Our technical support team and wholesale account directors reply within 12 hours.
          </p>
        </div>
      </section>

      {/* 2. DIRECT CONTACT CHANNELS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Studio Wholesale */}
          <div className="rounded-2xl border border-zinc-200 dark:border-[#1E232E] bg-white dark:bg-[#101319] p-5 shadow-lg flex flex-col justify-between hover:border-[#2EE6CA]/50 transition-all">
            <div>
              <div className="w-9 h-9 rounded-xl bg-[#2EE6CA]/15 text-[#0d9488] dark:text-[#2EE6CA] flex items-center justify-center mb-3">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-bold">
                STUDIO & WHOLESALE
              </div>
              <h3 className="text-sm font-black uppercase text-zinc-950 dark:text-white mt-0.5">
                Studio Accounts
              </h3>
              <p className="text-xs text-zinc-500 font-mono mt-1.5 leading-relaxed">
                Bulk tier discounts, recurring cartridge auto-shipments & tax-exempt orders.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-[#1E232E] text-xs font-mono">
              <a
                href="mailto:wholesale@papatattoosupply.com"
                className="text-[#0d9488] dark:text-[#2EE6CA] font-bold hover:underline truncate block"
              >
                wholesale@papatattoosupply.com
              </a>
            </div>
          </div>

          {/* Card 2: Tech & Warranty */}
          <div className="rounded-2xl border border-zinc-200 dark:border-[#1E232E] bg-white dark:bg-[#101319] p-5 shadow-lg flex flex-col justify-between hover:border-[#2EE6CA]/50 transition-all">
            <div>
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center mb-3">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-bold">
                ENGINEERING SERVICE
              </div>
              <h3 className="text-sm font-black uppercase text-zinc-950 dark:text-white mt-0.5">
                Machine Warranty
              </h3>
              <p className="text-xs text-zinc-500 font-mono mt-1.5 leading-relaxed">
                Papa Pen motor recalibration, custom stroke adjustments & parts replacement.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-[#1E232E] text-xs font-mono space-y-1.5">
              <a
                href="mailto:service@papatattoosupply.com"
                className="text-[#0d9488] dark:text-[#2EE6CA] font-bold hover:underline truncate block"
              >
                service@papatattoosupply.com
              </a>
              <a
                href="https://drive.google.com/file/d/1nMPw2A9x_AwQnlFp0yew_2XNbMBKoiEf/view"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-zinc-500 hover:text-[#0d9488] dark:hover:text-[#2EE6CA] flex items-center gap-1 font-bold"
              >
                <FileText className="w-3 h-3 text-amber-500 shrink-0" />
                <span>Download RMA Form (PDF)</span>
                <ExternalLink className="w-2.5 h-2.5 shrink-0" />
              </a>
            </div>
          </div>

          {/* Card 3: Orders & Logistics */}
          <div className="rounded-2xl border border-zinc-200 dark:border-[#1E232E] bg-white dark:bg-[#101319] p-5 shadow-lg flex flex-col justify-between hover:border-[#2EE6CA]/50 transition-all">
            <div>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center mb-3">
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-bold">
                GLOBAL LOGISTICS
              </div>
              <h3 className="text-sm font-black uppercase text-zinc-950 dark:text-white mt-0.5">
                Order Tracking & Customs
              </h3>
              <p className="text-xs text-zinc-500 font-mono mt-1.5 leading-relaxed">
                Same-day express dispatch assistance & international customs support.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-[#1E232E] text-xs font-mono">
              <a
                href="mailto:orders@papatattoosupply.com"
                className="text-[#0d9488] dark:text-[#2EE6CA] font-bold hover:underline truncate block"
              >
                orders@papatattoosupply.com
              </a>
            </div>
          </div>

          {/* Card 4: Factory Cleanroom HQ */}
          <div className="rounded-2xl border border-zinc-200 dark:border-[#1E232E] bg-white dark:bg-[#101319] p-5 shadow-lg flex flex-col justify-between hover:border-[#2EE6CA]/50 transition-all">
            <div>
              <div className="w-9 h-9 rounded-xl bg-zinc-200 dark:bg-[#1A1E27] text-zinc-700 dark:text-zinc-300 flex items-center justify-center mb-3">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-bold">
                CENTRAL HUB
              </div>
              <h3 className="text-sm font-black uppercase text-zinc-950 dark:text-white mt-0.5">
                Manufacturing Center
              </h3>
              <p className="text-xs text-zinc-500 font-mono mt-1.5 leading-relaxed">
                ISO 13485 cleanroom needle assembly & precision CNC machining center.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-[#1E232E] text-[11px] font-mono text-zinc-500">
              Shenzhen · Hong Kong Logistics Hub
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN FORM & QUICK FAQ GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#0E1015] shadow-xl p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-[#0d9488] dark:text-[#2EE6CA]" />
                <span className="text-xs font-mono font-bold text-[#0d9488] dark:text-[#2EE6CA] uppercase tracking-wider">
                  // DIRECT MESSAGE
                </span>
              </div>
              <h2 className="text-2xl font-black uppercase text-zinc-950 dark:text-white">
                SEND AN OFFICIAL INQUIRY
              </h2>
              <p className="text-xs text-zinc-500 font-mono mt-1 mb-6">
                Fill out the transmission form below. Our response team monitors this feed continuously.
              </p>

              {formSubmitted ? (
                <div className="p-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h3 className="text-xl font-black uppercase text-zinc-950 dark:text-white">
                    Transmission Received
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-mono max-w-md mx-auto leading-relaxed">
                    Thank you, {formData.name}. Your ticket has been logged with reference code #PAP-
                    {Math.floor(100000 + Math.random() * 900000)}. We will reply to {formData.email} within 12 hours.
                  </p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="px-5 py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 font-mono font-bold text-xs uppercase"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-600 dark:text-zinc-400 font-bold uppercase mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Alex Hunter"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-[#222731] bg-zinc-50 dark:bg-[#14171E] text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden focus:border-[#2EE6CA]"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-600 dark:text-zinc-400 font-bold uppercase mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="artist@studio.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-[#222731] bg-zinc-50 dark:bg-[#14171E] text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden focus:border-[#2EE6CA]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-600 dark:text-zinc-400 font-bold uppercase mb-1">
                        Studio / Company Name
                      </label>
                      <input
                        type="text"
                        value={formData.studio}
                        onChange={e => setFormData({ ...formData, studio: e.target.value })}
                        placeholder="Obsidian Tattoo Collective"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-[#222731] bg-zinc-50 dark:bg-[#14171E] text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden focus:border-[#2EE6CA]"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-600 dark:text-zinc-400 font-bold uppercase mb-1">
                        Topic of Inquiry *
                      </label>
                      <select
                        value={formData.topic}
                        onChange={e => setFormData({ ...formData, topic: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-[#222731] bg-zinc-50 dark:bg-[#14171E] text-zinc-900 dark:text-white focus:outline-hidden focus:border-[#2EE6CA]"
                      >
                        <option value="wholesale">Studio Wholesale / Volume Tier Pricing</option>
                        <option value="warranty">Papa Pen Machine Service & Warranty</option>
                        <option value="order">Order Tracking / Customs Assistance</option>
                        <option value="oem">Custom Needle Grouping / OEM Contract</option>
                        <option value="general">General Product Question</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 font-bold uppercase mb-1">
                      Order Number (if applicable)
                    </label>
                    <input
                      type="text"
                      value={formData.orderNumber}
                      onChange={e => setFormData({ ...formData, orderNumber: e.target.value })}
                      placeholder="#PAP-10482"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-[#222731] bg-zinc-50 dark:bg-[#14171E] text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden focus:border-[#2EE6CA]"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 font-bold uppercase mb-1">
                      Message / Specifications *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please provide details regarding your machine issue, needle cartridge requirements, or studio wholesale requests..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-[#222731] bg-zinc-50 dark:bg-[#14171E] text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden focus:border-[#2EE6CA]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="w-full py-3.5 rounded-xl bg-zinc-950 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer shadow-lg"
                    >
                      {formLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Dispatching Inquiry...</span>
                        </>
                      ) : (
                        <>
                          <span>Transmit Official Inquiry</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right: FAQs & Direct Assistance (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* FAQ Block */}
            <div className="rounded-3xl border border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#0E1015] p-6 sm:p-7 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="w-4 h-4 text-[#0d9488] dark:text-[#2EE6CA]" />
                <h3 className="text-sm font-black uppercase text-zinc-950 dark:text-white font-mono">
                  FREQUENTLY ASKED QUESTIONS
                </h3>
              </div>

              <div className="space-y-3 font-mono">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx
                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-zinc-100 dark:border-[#1E232E] bg-zinc-50 dark:bg-[#12151B] overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full text-left p-3.5 text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center justify-between gap-2"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform ${
                            isOpen ? 'rotate-180 text-[#2EE6CA]' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="p-3.5 pt-0 text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-200/50 dark:border-[#1A1D24] mt-1">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick Live Contact Box */}
            <div className="rounded-2xl border border-[#2EE6CA]/30 bg-gradient-to-br from-[#2EE6CA]/10 via-transparent to-transparent p-6 font-mono text-xs space-y-3">
              <div className="flex items-center gap-2 text-[#0d9488] dark:text-[#2EE6CA] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#2EE6CA] animate-pulse" />
                <span>ACTIVE OPERATIONAL HOURS</span>
              </div>
              <div className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-xs">
                Monday – Friday: 08:30 – 21:00 (GMT+8)<br />
                Saturday: 09:00 – 17:00 (GMT+8)<br />
                Sunday: Closed for factory sterilization cycle
              </div>
              <div className="pt-2">
                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-bold text-[#0d9488] dark:text-[#2EE6CA] hover:underline"
                >
                  <span>Need urgent convention emergency dispatch?</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
