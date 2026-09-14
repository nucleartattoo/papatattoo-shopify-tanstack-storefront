import React, { useState } from 'react'
import {
  Mail,
  Send,
  CheckCircle2,
  Loader2,
  FileText,
  ExternalLink,
  Clock,
  MessageSquare,
} from 'lucide-react'

export const ContactPage: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'general',
    orderNumber: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setTimeout(() => {
      setFormLoading(false)
      setFormSubmitted(true)
    }, 800)
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-zinc-50 dark:bg-[#0A0C0F] text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-200 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 1. Cohesive Left-Aligned Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border border-[#0d9488]/30 dark:border-[#2EE6CA]/30 bg-[#0d9488]/10 dark:bg-[#2EE6CA]/10 text-[#0d9488] dark:text-[#2EE6CA] text-[11px] font-mono font-bold tracking-wider uppercase mb-2">
            SUPPORT &amp; SERVICE
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-950 dark:text-white">
            CONTACT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d9488] to-[#2EE6CA]">US</span>
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 max-w-xl">
            Direct communication for artists and studio accounts. Reach out directly or send us a message below.
          </p>
        </div>

        {/* 2. Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Direct Contact Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#0E1015] p-6 shadow-xs space-y-5">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-100 dark:border-[#1A1D24] pb-2">
                Direct Channels
              </h2>

              {/* Email */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#0d9488]/10 dark:bg-[#2EE6CA]/10 text-[#0d9488] dark:text-[#2EE6CA] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide">Email</div>
                  <a
                    href="mailto:papatattoosupply@gmail.com"
                    className="text-sm font-semibold text-zinc-900 dark:text-white hover:text-[#0d9488] dark:hover:text-[#2EE6CA] transition-colors truncate block mt-0.5"
                  >
                    papatattoosupply@gmail.com
                  </a>
                </div>
              </div>

              {/* Response Hours */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-[#181C24] text-zinc-600 dark:text-zinc-400 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide">Studio Hours</div>
                  <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">
                    Mon – Fri: 09:00 – 18:00
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    Replies typically within 24 business hours.
                  </div>
                </div>
              </div>

              {/* Instagram */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </div>
                <div>
                  <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide">Official Instagram</div>
                  <a
                    href="https://instagram.com/papatattoosupply"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-zinc-900 dark:text-white hover:text-[#0d9488] dark:hover:text-[#2EE6CA] transition-colors inline-flex items-center gap-1.5 mt-0.5"
                  >
                    <span>@papatattoosupply</span>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                  </a>
                </div>
              </div>
            </div>

            {/* Machine Repair / RMA Card */}
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 p-5 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-700 dark:text-amber-400 uppercase">
                <FileText className="w-4 h-4 shrink-0" />
                <span>Machine Repair (RMA)</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Need motor maintenance or warranty service for your Papa Pen? Download and enclose the official RMA form with your shipment.
              </p>
              <div className="pt-1">
                <a
                  href="https://drive.google.com/file/d/1nMPw2A9x_AwQnlFp0yew_2XNbMBKoiEf/view"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                >
                  <span>Download RMA Form (PDF)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl border border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#0E1015] p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between gap-2 pb-4 mb-5 border-b border-zinc-100 dark:border-[#1A1D24]">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#0d9488] dark:text-[#2EE6CA]" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-950 dark:text-white font-mono">
                  Send a Message
                </h2>
              </div>
              <span className="text-[11px] text-zinc-400 font-mono">
                * Required
              </span>
            </div>

            {formSubmitted ? (
              <div className="py-12 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                  Message Sent
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 max-w-sm mx-auto leading-relaxed">
                  Thank you, {formData.name}. We have received your inquiry and will respond to {formData.email} shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFormSubmitted(false)
                    setFormData({ name: '', email: '', topic: 'general', orderNumber: '', message: '' })
                  }}
                  className="px-4 py-2 rounded-lg bg-zinc-950 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 font-semibold text-xs uppercase cursor-pointer hover:opacity-90 transition-opacity"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Alex Hunter"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 dark:border-[#222731] bg-zinc-50 dark:bg-[#14171E] text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden focus:border-[#0d9488] dark:focus:border-[#2EE6CA] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="artist@studio.com"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 dark:border-[#222731] bg-zinc-50 dark:bg-[#14171E] text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden focus:border-[#0d9488] dark:focus:border-[#2EE6CA] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1.5">
                      Topic of Inquiry *
                    </label>
                    <select
                      value={formData.topic}
                      onChange={e => setFormData({ ...formData, topic: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 dark:border-[#222731] bg-zinc-50 dark:bg-[#14171E] text-zinc-900 dark:text-white focus:outline-hidden focus:border-[#0d9488] dark:focus:border-[#2EE6CA] transition-colors"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Status &amp; Shipping</option>
                      <option value="warranty">Machine Service &amp; Warranty</option>
                      <option value="wholesale">Studio &amp; Wholesale</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1.5">
                      Order # <span className="text-zinc-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.orderNumber}
                      onChange={e => setFormData({ ...formData, orderNumber: e.target.value })}
                      placeholder="#10482"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 dark:border-[#222731] bg-zinc-50 dark:bg-[#14171E] text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden focus:border-[#0d9488] dark:focus:border-[#2EE6CA] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1.5">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we help you today?"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 dark:border-[#222731] bg-zinc-50 dark:bg-[#14171E] text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden focus:border-[#0d9488] dark:focus:border-[#2EE6CA] transition-colors resize-y"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="w-full py-3 rounded-xl bg-zinc-950 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:bg-zinc-800 dark:hover:bg-[#26cbb1] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    {formLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
