import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  Mail,
  Send,
  CheckCircle2,
  Loader2,
  FileText,
  ExternalLink,
  Clock,
  MessageSquare,
  Copy,
  Check,
  AlertCircle,
  Wrench,
  Building2,
  PackageSearch,
  ArrowRight,
} from 'lucide-react'
import {
  submitStorefrontInquiry,
  type StorefrontInquiryResult,
} from '../lib/inquiries.functions'

type InquiryTopic = 'general' | 'order' | 'warranty' | 'wholesale'

interface TopicPreset {
  id: InquiryTopic
  label: string
  department: string
  description: string
  placeholder: string
}

const TOPIC_PRESETS: TopicPreset[] = [
  {
    id: 'order',
    label: 'Order & Tracking',
    department: 'LOGISTICS',
    description: 'Shipment tracking, commercial invoice requests, or delivery address updates.',
    placeholder:
      'Please include your Order # and let us know if you need tracking updates, invoice documentation, or dispatch assistance...',
  },
  {
    id: 'warranty',
    label: 'Machine Service / RMA',
    department: 'WARRANTY',
    description: 'Rotary motor diagnostics, stroke cam service, battery pack warranty, or RMA status.',
    placeholder:
      'Describe your machine model (e.g. Papa Pen V3 Pro), operating voltage, and issue symptoms for our repair bench...',
  },
  {
    id: 'wholesale',
    label: 'Studio & Wholesale',
    department: 'WHOLESALE',
    description: 'Multi-artist studio accounts, bulk cartridge box pricing, or regional distribution.',
    placeholder:
      'Share your studio name, location, and estimated monthly cartridge or hardware volume...',
  },
  {
    id: 'general',
    label: 'Technical Inquiry',
    department: 'TECHNICAL',
    description: 'Needle compatibility, grip sizing, voltage recommendations, or general questions.',
    placeholder:
      'Ask about cartridge membrane specs, grip compatibility, or recommended stroke length...',
  },
]

export const ContactPage: React.FC = () => {
  const [submissionResult, setSubmissionResult] = useState<StorefrontInquiryResult | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [emailCopied, setEmailCopied] = useState(false)

  const [formData, setFormData] = useState<{
    name: string
    email: string
    topic: InquiryTopic
    orderNumber: string
    message: string
  }>({
    name: '',
    email: '',
    topic: 'order',
    orderNumber: '',
    message: '',
  })

  const activePreset =
    TOPIC_PRESETS.find(preset => preset.id === formData.topic) ?? TOPIC_PRESETS[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setFormLoading(true)

    try {
      const result = await submitStorefrontInquiry({
        data: {
          kind: 'contact',
          ...formData,
        },
      })
      setSubmissionResult(result)
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : 'Unable to prepare your message. Please email us directly.'
      )
    } finally {
      setFormLoading(false)
    }
  }

  const handleCopyInquiry = async () => {
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

  const handleCopyDirectEmail = async () => {
    try {
      await navigator.clipboard.writeText('papatattoosupply@gmail.com')
      setEmailCopied(true)
      setTimeout(() => setEmailCopied(false), 2000)
    } catch {
      // Ignore if clipboard blocked
    }
  }

  return (
    <div className="min-h-[calc(100dvh-80px)] bg-[#f5f4f0] dark:bg-[#20222a] text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-200 pb-20">
      {/* 1. HEADER BANNER */}
      <section className="border-b border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#22252f] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] text-[#0d5d50] dark:text-[#38e8c6] text-[11px] font-mono font-bold tracking-wider uppercase">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>STUDIO DISPATCH &amp; TECHNICAL SUPPORT DESK</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight text-zinc-950 dark:text-white leading-tight">
              CONTACT PAPA TATTOO SUPPLY
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Direct factory support for working tattoo artists, studio procurement managers, and regional wholesale partners.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-white/25 active:scale-[0.98] transition-[transform,border-color,color] duration-150 ease-[var(--ease-out-strong)]"
            >
              <PackageSearch className="w-3.5 h-3.5 text-[#0d5d50] dark:text-[#38e8c6]" />
              <span>Hardware Lineup</span>
            </Link>
            <Link
              to="/distributors"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-white/25 active:scale-[0.98] transition-[transform,border-color,color] duration-150 ease-[var(--ease-out-strong)]"
            >
              <Building2 className="w-3.5 h-3.5 text-[#0d5d50] dark:text-[#38e8c6]" />
              <span>Wholesale &amp; Distributors</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. MAIN 2-COLUMN DISPATCH CONSOLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Channels & RMA Protocol (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#22252f] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] p-6 sm:p-7 space-y-6">
              <div className="flex items-center justify-between border-b border-[#e2dfd8]/70 dark:border-white/[0.06] pb-3">
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  DIRECT STUDIO CHANNELS
                </h2>
                <span className="text-[10px] font-mono font-bold uppercase tabular-nums text-[#0d5d50] dark:text-[#38e8c6]">
                  24H SLA
                </span>
              </div>

              {/* Email + Quick Copy */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#f8f7f4] dark:bg-[#181b22] border border-[#e2dfd8] dark:border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] text-[#0d5d50] dark:text-[#38e8c6] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                      DISPATCH EMAIL
                    </div>
                    <a
                      href="mailto:papatattoosupply@gmail.com"
                      className="text-xs sm:text-[13px] font-mono font-bold text-zinc-900 dark:text-white hover:text-[#0d5d50] dark:hover:text-[#38e8c6] transition-colors duration-150 block mt-0.5 whitespace-nowrap"
                    >
                      papatattoosupply@gmail.com
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyDirectEmail}
                  className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] text-[11px] font-mono font-semibold text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-white/25 active:scale-[0.97] transition-[transform,border-color,color] duration-150 ease-[var(--ease-out-strong)] cursor-pointer"
                  title="Copy email address"
                >
                  {emailCopied ? (
                    <>
                      <Check className="w-3 h-3 text-[#0d5d50] dark:text-[#38e8c6]" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Operating Hours */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#f8f7f4] dark:bg-[#181b22] border border-[#e2dfd8] dark:border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] text-zinc-600 dark:text-zinc-400 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                    OPERATING HOURS
                  </div>
                  <div className="text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100 mt-0.5">
                    Monday to Friday · 09:00 to 18:00
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    All studio inquiries and tracking requests answered within 24 business hours.
                  </div>
                </div>
              </div>

              {/* Instagram */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#f8f7f4] dark:bg-[#181b22] border border-[#e2dfd8] dark:border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] text-zinc-700 dark:text-zinc-300 flex items-center justify-center shrink-0">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </div>
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                    ARTIST RELATIONS &amp; DM
                  </div>
                  <a
                    href="https://instagram.com/papatattoosupply"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-mono font-bold text-zinc-900 dark:text-white hover:text-[#0d5d50] dark:hover:text-[#38e8c6] transition-colors duration-150 inline-flex items-center gap-1.5 mt-0.5"
                  >
                    <span>@papatattoosupply</span>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                  </a>
                </div>
              </div>
            </div>

            {/* Machine Repair / RMA Protocol Card */}
            <div className="rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#22252f] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6] uppercase">
                  <Wrench className="w-4 h-4 shrink-0" />
                  <span>MACHINE REPAIR &amp; RMA BENCH</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">FORM PDF</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Sending a Papa Pen or rotary apparatus in for stroke cam calibration or warranty motor service? Download and enclose the official RMA Repair Form inside your parcel.
              </p>
              <div className="pt-1 flex flex-wrap items-center gap-3">
                <a
                  href="https://drive.google.com/file/d/1nMPw2A9x_AwQnlFp0yew_2XNbMBKoiEf/view"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#0d5d50] dark:hover:bg-[#2dd4b5] active:scale-[0.98] transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)]"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Download RMA Form (PDF)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Dispatch Console Form (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#22252f] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] p-6 sm:p-8">
            <div className="flex items-center justify-between gap-2 pb-4 mb-5 border-b border-[#e2dfd8]/70 dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#0d5d50] dark:text-[#38e8c6]" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-950 dark:text-white font-mono">
                  DISPATCH INQUIRY TICKET
                </h2>
              </div>
              <span className="text-[11px] text-zinc-400 font-mono">
                {activePreset.department} · * REQUIRED
              </span>
            </div>

            {submissionResult ? (
              <div className="p-6 sm:p-8 rounded-2xl border border-[#0d5d50]/30 dark:border-[#38e8c6]/30 bg-[#0d5d50]/10 dark:bg-[#38e8c6]/10 text-center space-y-4">
                <CheckCircle2 className="w-10 h-10 text-[#0d5d50] dark:text-[#38e8c6] mx-auto" />
                {submissionResult.delivered ? (
                  <>
                    <h3 className="text-base font-bold font-mono uppercase text-zinc-950 dark:text-white">
                      INQUIRY TRANSMITTED
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 max-w-sm mx-auto leading-relaxed">
                      Thank you, {formData.name}. Our studio support desk has received your ticket and will respond to {formData.email} within 24 hours.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-base font-bold font-mono uppercase text-zinc-950 dark:text-white">
                      INQUIRY FORMATTED · READY TO SEND
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 max-w-md mx-auto leading-relaxed">
                      Your dispatch message for{' '}
                      <strong className="text-zinc-900 dark:text-white">
                        {submissionResult.recipient}
                      </strong>{' '}
                      is formatted and ready. Launch your default mail app to send directly, or copy the formatted ticket for browser webmail.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                      <a
                        href={submissionResult.mailtoUrl}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 font-mono font-bold text-xs uppercase hover:bg-[#0d5d50] dark:hover:bg-[#2dd4b5] active:scale-[0.98] transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)]"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Open Mail App</span>
                      </a>
                      <button
                        type="button"
                        onClick={handleCopyInquiry}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#e2dfd8] dark:border-white/15 bg-white dark:bg-[#181b22] text-zinc-800 dark:text-zinc-100 font-mono font-bold text-xs uppercase cursor-pointer hover:border-zinc-500 active:scale-[0.98] transition-[transform,border-color,color] duration-150 ease-[var(--ease-out-strong)]"
                      >
                        {copied ? (
                          <Check className="w-3.5 h-3.5 text-[#0d5d50] dark:text-[#38e8c6]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copied ? 'Copied Ticket' : 'Copy Full Message'}</span>
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
                    Edit or Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                {formError && (
                  <div
                    role="alert"
                    className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300 text-xs"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Quick Topic Selector Pills */}
                <div className="space-y-2">
                  <label className="block text-zinc-700 dark:text-zinc-300 font-mono font-bold uppercase text-[11px] tracking-wider">
                    Select Inquiry Routing *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {TOPIC_PRESETS.map(preset => {
                      const isSelected = formData.topic === preset.id
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, topic: preset.id }))}
                          aria-pressed={isSelected}
                          className={`px-3.5 py-2.5 rounded-xl border text-left transition-[transform,background-color,border-color,color,box-shadow] duration-150 ease-[var(--ease-out-strong)] cursor-pointer active:scale-[0.98] ${
                            isSelected
                              ? 'border-zinc-950 dark:border-[#38e8c6] bg-zinc-950 text-white dark:bg-[#38e8c6]/15 dark:text-[#38e8c6] shadow-xs'
                              : 'border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-white/25'
                          }`}
                        >
                          <div className="text-[10px] font-mono opacity-70 tracking-wider">{preset.department}</div>
                          <div className="font-mono font-bold text-[11px] mt-0.5 leading-tight">
                            {preset.label}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 pt-0.5">
                    {activePreset.description}
                  </p>
                </div>

                {/* Contextual Helper Banner for RMA or Wholesale */}
                {formData.topic === 'warranty' && (
                  <div className="p-3.5 rounded-xl border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] flex items-center justify-between gap-3">
                    <div className="text-[11px] text-zinc-600 dark:text-zinc-300">
                      <strong className="font-mono uppercase text-zinc-900 dark:text-white">
                        RMA Tip:
                      </strong>{' '}
                      Include your machine serial number and operating voltage (V) in the message below.
                    </div>
                    <a
                      href="https://drive.google.com/file/d/1nMPw2A9x_AwQnlFp0yew_2XNbMBKoiEf/view"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6] hover:underline"
                    >
                      <span>RMA PDF</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {formData.topic === 'wholesale' && (
                  <div className="p-3.5 rounded-xl border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] flex items-center justify-between gap-3">
                    <div className="text-[11px] text-zinc-600 dark:text-zinc-300">
                      Applying for regional territory distribution? You can also submit a full distributor dossier.
                    </div>
                    <Link
                      to="/distributors"
                      className="shrink-0 inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6] hover:underline"
                    >
                      <span>Distributor Portal</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-zinc-700 dark:text-zinc-300 font-mono font-bold uppercase text-[11px] mb-1.5"
                    >
                      Your Name / Studio *
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Alex Hunter · Blackline Studio"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden focus:border-[#0d5d50] dark:focus:border-[#38e8c6] transition-colors duration-150"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-zinc-700 dark:text-zinc-300 font-mono font-bold uppercase text-[11px] mb-1.5"
                    >
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="artist@studio.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden focus:border-[#0d5d50] dark:focus:border-[#38e8c6] transition-colors duration-150"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-topic"
                      className="block text-zinc-700 dark:text-zinc-300 font-mono font-bold uppercase text-[11px] mb-1.5"
                    >
                      Department Category *
                    </label>
                    <select
                      id="contact-topic"
                      name="topic"
                      value={formData.topic}
                      onChange={e =>
                        setFormData({ ...formData, topic: e.target.value as InquiryTopic })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-zinc-900 dark:text-white focus:outline-hidden focus:border-[#0d5d50] dark:focus:border-[#38e8c6] transition-colors duration-150 font-mono"
                    >
                      <option value="order">Order Status &amp; Shipping</option>
                      <option value="warranty">Machine Service &amp; Warranty</option>
                      <option value="wholesale">Studio &amp; Wholesale</option>
                      <option value="general">General Technical Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-order"
                      className="block text-zinc-700 dark:text-zinc-300 font-mono font-bold uppercase text-[11px] mb-1.5"
                    >
                      Order # <span className="text-zinc-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      id="contact-order"
                      name="orderNumber"
                      type="text"
                      value={formData.orderNumber}
                      onChange={e => setFormData({ ...formData, orderNumber: e.target.value })}
                      placeholder="#10482"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden focus:border-[#0d5d50] dark:focus:border-[#38e8c6] transition-colors duration-150 font-mono tabular-nums"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-zinc-700 dark:text-zinc-300 font-mono font-bold uppercase text-[11px] mb-1.5"
                  >
                    Inquiry Details *
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder={activePreset.placeholder}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden focus:border-[#0d5d50] dark:focus:border-[#38e8c6] transition-colors duration-150 resize-y"
                  />
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="w-full py-3.5 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 font-mono font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:bg-[#0d5d50] dark:hover:bg-[#2dd4b5] active:scale-[0.98] transition-[transform,background-color,color,opacity] duration-150 ease-[var(--ease-out-strong)] disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    {formLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Preparing Dispatch Ticket...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Studio Inquiry</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
