import React from 'react'
import { Link } from '@tanstack/react-router'
import {
  ShieldCheck,
  Lock,
  Cookie,
  FileCheck2,
  AlertCircle,
  Mail,
  ArrowRight,
  ExternalLink,
  FileText,
} from 'lucide-react'

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0A0C0F] text-zinc-900 dark:text-zinc-100 font-sans pb-24 transition-colors">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-[#1E232E] bg-white dark:bg-[#0E1015] py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2EE6CA]/30 bg-[#2EE6CA]/10 text-[#0d9488] dark:text-[#2EE6CA] text-xs font-mono font-bold tracking-wider uppercase">
            <Lock className="w-3.5 h-3.5" />
            <span>LEGAL & COMPLIANCE DISCLOSURES</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-950 dark:text-white">
            PRIVACY POLICY, COOKIE COMPLIANCE & TERMS OF SALE
          </h1>

          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-mono">
            LAST REVISED: MARCH 2025 · OFFICIAL PAPA TATTOO SUPPLY LEGAL PROTOCOL
          </p>
        </div>
      </section>

      {/* 2. MAIN DOCUMENT CONTENT */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Quick Jump Bar */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-[#1E232E] bg-zinc-100/70 dark:bg-[#11141B] flex flex-wrap gap-4 text-xs font-mono">
          <a href="#privacy" className="text-[#0d9488] dark:text-[#2EE6CA] hover:underline">
            1. Privacy & Data Collection
          </a>
          <span>·</span>
          <a href="#cookies" className="text-[#0d9488] dark:text-[#2EE6CA] hover:underline">
            2. Cookie Policy & Tracking
          </a>
          <span>·</span>
          <a href="#terms" className="text-[#0d9488] dark:text-[#2EE6CA] hover:underline">
            3. Terms of Commercial Sale
          </a>
          <span>·</span>
          <a href="#iso" className="text-[#0d9488] dark:text-[#2EE6CA] hover:underline">
            4. ISO 13485 & Sterilization
          </a>
          <span>·</span>
          <a href="#warranty" className="text-[#0d9488] dark:text-[#2EE6CA] hover:underline">
            5. RMA & Machine Repair
          </a>
        </div>

        {/* Section 1: Privacy */}
        <section id="privacy" className="space-y-4 scroll-mt-28">
          <div className="flex items-center gap-2 text-base font-mono font-bold uppercase text-zinc-950 dark:text-white">
            <ShieldCheck className="w-5 h-5 text-[#0d9488] dark:text-[#2EE6CA]" />
            <h2>1. PRIVACY POLICY & PERSONAL DATA INTEGRITY</h2>
          </div>
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-[#1E232E] bg-white dark:bg-[#11141B] space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
            <p>
              Papa Tattoo Supply (&quot;the Store&quot;, &quot;we&quot;, &quot;our&quot;) is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, you can be assured that it will only be used in accordance with this privacy statement.
            </p>
            <h4 className="font-mono font-bold text-xs text-zinc-900 dark:text-zinc-200 uppercase pt-2">
              Information We Collect:
            </h4>
            <ul className="list-disc list-inside space-y-1 pl-2 font-mono text-xs">
              <li>Studio name, contact person, business registration, or tattoo license details.</li>
              <li>Shipping address, billing address, phone number, and direct contact email.</li>
              <li>Transaction reference IDs and order history (payment card numbers are processed directly via PCI-DSS Level 1 tokenized gateways and are never stored on our servers).</li>
            </ul>
            <p>
              We do not sell, distribute, or lease your personal information to third parties unless required by international customs authorities to fulfill freight logistics or required by law.
            </p>
          </div>
        </section>

        {/* Section 2: Cookies */}
        <section id="cookies" className="space-y-4 scroll-mt-28">
          <div className="flex items-center gap-2 text-base font-mono font-bold uppercase text-zinc-950 dark:text-white">
            <Cookie className="w-5 h-5 text-amber-500" />
            <h2>2. COOKIE RESTRICTION MODE & SESSION STORAGE</h2>
          </div>
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-[#1E232E] bg-white dark:bg-[#11141B] space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
            <p>
              A cookie is a small file placed on your device to enable core website functionalities. In compliance with international e-privacy standards:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 font-mono text-xs">
              <li><strong>Essential Session Cookies:</strong> Retain your shopping bag contents, selected needle configurations, and authentication tokens.</li>
              <li><strong>Preference Cookies:</strong> Store your preferred dark/light visual theme and interface localization settings.</li>
            </ul>
            <p>
              You can choose to accept or decline cookies via your browser settings. Declining essential session storage may prevent certain headless checkout features from functioning correctly.
            </p>
          </div>
        </section>

        {/* Section 3: Terms of Sale */}
        <section id="terms" className="space-y-4 scroll-mt-28">
          <div className="flex items-center gap-2 text-base font-mono font-bold uppercase text-zinc-950 dark:text-white">
            <FileCheck2 className="w-5 h-5 text-[#0d9488] dark:text-[#2EE6CA]" />
            <h2>3. TERMS OF SALE & DIRECT DISPATCH</h2>
          </div>
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-[#1E232E] bg-white dark:bg-[#11141B] space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
            <p>
              By placing an order with Papa Tattoo Supply, you verify that you are a licensed tattoo practitioner, apprentice under licensed supervision, or registered tattoo studio enterprise.
            </p>
            <h4 className="font-mono font-bold text-xs text-zinc-900 dark:text-zinc-200 uppercase pt-2">
              14-Day Fault Return Policy:
            </h4>
            <p>
              Items can be returned for replacement or full refund if a genuine manufacturing fault is confirmed within 14 days from the date you received the parcel. If an incorrect item or specification was dispatched due to warehouse error, Papa Tattoo Supply will ship the correct replacement immediately and reimburse standard return shipping fees.
            </p>
          </div>
        </section>

        {/* Section 4: ISO 13485 */}
        <section id="iso" className="space-y-4 scroll-mt-28">
          <div className="flex items-center gap-2 text-base font-mono font-bold uppercase text-zinc-950 dark:text-white">
            <AlertCircle className="w-5 h-5 text-emerald-500" />
            <h2>4. ISO 13485 CLEANROOM COMPLIANCE & STERILIZATION</h2>
          </div>
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-[#1E232E] bg-white dark:bg-[#11141B] space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
            <p>
              All Papa Tattoo cartridge needles are assembled in medical cleanroom environments compliant with ISO 13485 medical apparatus standards. Each individual blister package incorporates an EO Gas sterilization indicator dot that confirms gas penetration, alongside batch-specific lot tracking numbers.
            </p>
          </div>
        </section>

        {/* Section 5: RMA & Repair */}
        <section id="warranty" className="space-y-4 scroll-mt-28">
          <div className="flex items-center gap-2 text-base font-mono font-bold uppercase text-zinc-950 dark:text-white">
            <FileText className="w-5 h-5 text-[#0d9488] dark:text-[#2EE6CA]" />
            <h2>5. OFFICIAL PAPA MACHINE REPAIR (RMA) PROTOCOL</h2>
          </div>
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-[#1E232E] bg-white dark:bg-[#11141B] space-y-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
            <p>
              If your Papa Pen, Papa Pen V2, Papa Pen V3, or Apollo Rotary machine requires factory servicing, maintenance, or calibration, please download the official factory RMA form below:
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-zinc-50 dark:bg-[#181C25] border border-zinc-200 dark:border-[#222731]">
              <div>
                <div className="font-mono font-bold text-xs text-zinc-950 dark:text-white uppercase">
                  PAPA MACHINE REPAIR FORM (OFFICIAL RMA PDF)
                </div>
                <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                  Print, fill out with machine serial code, and pack inside parcel.
                </div>
              </div>
              <a
                href="https://drive.google.com/file/d/1nMPw2A9x_AwQnlFp0yew_2XNbMBKoiEf/view"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-950 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 text-xs font-mono font-bold uppercase tracking-wider shrink-0 cursor-pointer"
              >
                <span>Download RMA PDF</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-[#1E232E] bg-zinc-100 dark:bg-[#12151B] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-sm font-mono font-bold uppercase text-zinc-950 dark:text-white">
              Questions Regarding Compliance or Orders?
            </h3>
            <p className="text-xs text-zinc-500 font-sans">
              Our direct customer support and logistics desk is available 24/7.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-950 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 text-xs font-mono font-bold uppercase tracking-wider shrink-0"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact Support</span>
          </Link>
        </div>
      </main>
    </div>
  )
}
