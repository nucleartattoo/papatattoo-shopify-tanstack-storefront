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
    department: 'Logistics',
    description: 'Shipment tracking, commercial invoice requests, or delivery address updates.',
    placeholder:
      'Please include your Order # and let us know if you need tracking updates, invoice documentation, or dispatch assistance...',
  },
  {
    id: 'warranty',
    label: 'Machine Service / RMA',
    department: 'Warranty',
    description: 'Rotary motor diagnostics, stroke cam service, battery pack warranty, or RMA status.',
    placeholder:
      'Describe your machine model (e.g. Papa Pen V3), operating voltage, and issue symptoms for our repair bench...',
  },
  {
    id: 'wholesale',
    label: 'Studio & Wholesale',
    department: 'Wholesale',
    description: 'Multi-artist studio accounts, bulk cartridge box pricing, or regional distribution.',
    placeholder:
      'Share your studio name, location, and estimated monthly cartridge or hardware volume...',
  },
  {
    id: 'general',
    label: 'Technical Inquiry',
    department: 'Technical',
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
    <div className="min-h-[calc(100dvh-80px)] bg-[#f5f5f7] dark:bg-black text-[#1d1d1f] dark:text-[#f5f5f7] font-sans transition-colors duration-200 pb-24">
      {/* 1. HEADER BANNER */}
      <section className="pt-12 sm:pt-20 pb-10 sm:pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/[0.045] dark:bg-white/[0.08] text-xs font-medium text-[#86868b]">
              <MessageSquare className="w-3.5 h-3.5 text-[#86868b]" />
              <span>Studio Dispatch &amp; Technical Support Desk</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-[-0.035em] text-[#1d1d1f] dark:text-[#f5f5f7] leading-tight">
              Contact Papa Tattoo Supply
            </h1>
            <p className="text-base text-[#86868b] leading-relaxed">
              Direct factory support for working tattoo artists, studio procurement managers, and regional wholesale partners.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] active:scale-[0.97] transition-all duration-150"
            >
              <PackageSearch className="w-3.5 h-3.5 text-[#86868b]" />
              <span>Hardware Lineup</span>
            </Link>
            <Link
              to="/distributors"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] active:scale-[0.97] transition-all duration-150"
            >
              <Building2 className="w-3.5 h-3.5 text-[#86868b]" />
              <span>Wholesale &amp; Distributors</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. MAIN 2-COLUMN DISPATCH CONSOLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Channels & RMA Protocol (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-[28px] bg-white dark:bg-[#121214] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)] p-7 space-y-6">
              <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.08] pb-4">
                <h2 className="text-xs font-medium text-[#86868b]">
                  Direct Studio Channels
                </h2>
                <span className="text-xs font-semibold tabular-nums text-[#1d1d1f] dark:text-[#f5f5f7]">
                  24h SLA
                </span>
              </div>

              {/* Email + Quick Copy */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-black/[0.045] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-[#86868b]">
                      Dispatch Email
                    </div>
                    <a
                      href="mailto:papatattoosupply@gmail.com"
                      className="text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7] hover:underline transition-colors duration-150 block mt-0.5 whitespace-nowrap"
                    >
                      papatattoosupply@gmail.com
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyDirectEmail}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] active:scale-[0.97] transition-all duration-150 cursor-pointer"
                  title="Copy email address"
                >
                  {emailCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#1d1d1f] dark:text-white" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#86868b]" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Operating Hours */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-black/[0.045] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-medium text-[#86868b]">
                    Operating Hours
                  </div>
                  <div className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mt-0.5">
                    Monday to Friday · 09:00 to 18:00
                  </div>
                  <div className="text-xs text-[#86868b] mt-0.5 leading-relaxed">
                    All studio inquiries and tracking requests answered within 24 business hours.
                  </div>
                </div>
              </div>

              {/* Instagram */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-black/[0.045] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center justify-center shrink-0">
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
                  <div className="text-xs font-medium text-[#86868b]">
                    Artist Relations &amp; DM
                  </div>
                  <a
                    href="https://instagram.com/papatattoosupply"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7] hover:underline transition-colors duration-150 inline-flex items-center gap-1.5 mt-0.5"
                  >
                    <span>@papatattoosupply</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#86868b]" />
                  </a>
                </div>
              </div>
            </div>

            {/* Machine Repair / RMA Protocol Card */}
            <div className="rounded-[28px] bg-white dark:bg-[#121214] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)] p-7 space-y-4">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 text-xs font-medium text-[#86868b]">
                  <Wrench className="w-4 h-4 shrink-0 text-[#86868b]" />
                  <span>Machine Repair &amp; RMA Bench</span>
                </div>
                <span className="text-xs font-medium text-[#86868b]">PDF</span>
              </div>
              <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                Sending a Papa Pen or rotary apparatus in for stroke cam calibration or warranty motor service? Download and enclose the official RMA Repair Form inside your parcel.
              </p>
              <div className="pt-1 flex flex-wrap items-center gap-3">
                <a
                  href="https://drive.google.com/file/d/1nMPw2A9x_AwQnlFp0yew_2XNbMBKoiEf/view"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-xs font-medium hover:opacity-85 active:scale-[0.98] transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)]"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Download RMA Form (PDF)</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Dispatch Console Form (7 cols) */}
          <div className="lg:col-span-7 rounded-[32px] bg-white dark:bg-[#121214] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)] p-7 sm:p-9">
            <div className="flex items-center justify-between gap-2 pb-4 mb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#86868b]" />
                <h2 className="text-sm font-semibold tracking-[-0.01em] text-[#1d1d1f] dark:text-[#f5f5f7]">
                  Dispatch Inquiry Ticket
                </h2>
              </div>
              <span className="text-xs text-[#86868b]">
                {activePreset.department} · * Required
              </span>
            </div>

            {submissionResult ? (
              <div className="p-8 sm:p-10 rounded-[24px] bg-black/[0.03] dark:bg-white/[0.05] text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-[#1d1d1f] dark:text-white mx-auto" />
                {submissionResult.delivered ? (
                  <>
                    <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                      Inquiry Transmitted
                    </h3>
                    <p className="text-xs sm:text-sm text-[#86868b] max-w-sm mx-auto leading-relaxed">
                      Thank you, {formData.name}. Our studio support desk has received your ticket and will respond to {formData.email} within 24 hours.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                      Inquiry Formatted · Ready to Send
                    </h3>
                    <p className="text-xs sm:text-sm text-[#86868b] max-w-md mx-auto leading-relaxed">
                      Your dispatch message for{' '}
                      <strong className="text-[#1d1d1f] dark:text-white font-medium">
                        {submissionResult.recipient}
                      </strong>{' '}
                      is formatted and ready. Launch your default mail app to send directly, or copy the formatted ticket for browser webmail.
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
                        onClick={handleCopyInquiry}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] text-[#1d1d1f] dark:text-[#f5f5f7] text-xs font-medium cursor-pointer active:scale-[0.98] transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)]"
                      >
                        {copied ? (
                          <Check className="w-3.5 h-3.5 text-[#1d1d1f] dark:text-white" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-[#86868b]" />
                        )}
                        <span>{copied ? 'Copied Ticket' : 'Copy Full Message'}</span>
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
                    Edit or Send Another Message
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

                {/* Quick Topic Selector Pills */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-medium text-[#86868b]">
                    Select Inquiry Routing *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {TOPIC_PRESETS.map(preset => {
                      const isSelected = formData.topic === preset.id
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, topic: preset.id }))}
                          aria-pressed={isSelected}
                          className={`p-3 rounded-2xl text-left transition-[transform,background-color,color,box-shadow] duration-150 ease-[var(--ease-out-strong)] cursor-pointer active:scale-[0.98] ${
                            isSelected
                              ? 'bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] shadow-sm'
                              : 'bg-black/[0.045] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/[0.07] dark:hover:bg-white/[0.12]'
                          }`}
                        >
                          <div className="text-[10px] opacity-70 font-medium">{preset.department}</div>
                          <div className="font-semibold text-xs mt-0.5 leading-snug">
                            {preset.label}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                  <p className="text-xs text-[#86868b] pt-0.5">
                    {activePreset.description}
                  </p>
                </div>

                {/* Contextual Helper Banner */}
                {formData.topic === 'warranty' && (
                  <div className="p-4 rounded-2xl bg-black/[0.035] dark:bg-white/[0.05] flex items-center justify-between gap-3 text-xs">
                    <div className="text-[#86868b]">
                      <strong className="text-[#1d1d1f] dark:text-white font-medium">
                        RMA Tip:
                      </strong>{' '}
                      Include your machine serial number and operating voltage (V) in the message below.
                    </div>
                    <a
                      href="https://drive.google.com/file/d/1nMPw2A9x_AwQnlFp0yew_2XNbMBKoiEf/view"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 inline-flex items-center gap-1 font-medium text-[#1d1d1f] dark:text-[#f5f5f7] hover:underline"
                    >
                      <span>RMA PDF</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {formData.topic === 'wholesale' && (
                  <div className="p-4 rounded-2xl bg-black/[0.035] dark:bg-white/[0.05] flex items-center justify-between gap-3 text-xs">
                    <div className="text-[#86868b]">
                      Applying for regional territory distribution? You can also submit a full distributor dossier.
                    </div>
                    <Link
                      to="/distributors"
                      className="shrink-0 inline-flex items-center gap-1 font-medium text-[#1d1d1f] dark:text-[#f5f5f7] hover:underline"
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
                      className="block text-xs font-medium text-[#86868b] mb-1.5"
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
                      className="w-full px-4 py-3 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] text-sm text-[#1d1d1f] dark:text-white placeholder-[#86868b] focus:outline-hidden focus:ring-2 focus:ring-[#1d1d1f]/15 dark:focus:ring-white/20 transition-all"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-medium text-[#86868b] mb-1.5"
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
                      className="w-full px-4 py-3 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] text-sm text-[#1d1d1f] dark:text-white placeholder-[#86868b] focus:outline-hidden focus:ring-2 focus:ring-[#1d1d1f]/15 dark:focus:ring-white/20 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-topic"
                      className="block text-xs font-medium text-[#86868b] mb-1.5"
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
                      className="w-full px-4 py-3 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] text-sm text-[#1d1d1f] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#1d1d1f]/15 dark:focus:ring-white/20 transition-all"
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
                      className="block text-xs font-medium text-[#86868b] mb-1.5"
                    >
                      Order # <span className="text-[#86868b] font-normal">(Optional)</span>
                    </label>
                    <input
                      id="contact-order"
                      name="orderNumber"
                      type="text"
                      value={formData.orderNumber}
                      onChange={e => setFormData({ ...formData, orderNumber: e.target.value })}
                      placeholder="#10482"
                      className="w-full px-4 py-3 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] text-sm text-[#1d1d1f] dark:text-white placeholder-[#86868b] focus:outline-hidden focus:ring-2 focus:ring-[#1d1d1f]/15 dark:focus:ring-white/20 transition-all tabular-nums"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-medium text-[#86868b] mb-1.5"
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
                        <span>Preparing Dispatch Ticket…</span>
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
