import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Logo } from './Logo'
import { useLocale } from '../../context/LocaleContext'
import { Mail, Globe, ShieldCheck, Cpu, ArrowUpRight, BadgeCheck, Loader2, CheckCircle2 } from 'lucide-react'
import {
  submitStorefrontInquiry,
  type StorefrontInquiryResult,
} from '../../lib/inquiries.functions'

export const Footer: React.FC = () => {
  const { t } = useLocale()
  const [dispatchEmail, setDispatchEmail] = useState('')
  const [dispatchLoading, setDispatchLoading] = useState(false)
  const [dispatchError, setDispatchError] = useState<string | null>(null)
  const [dispatchResult, setDispatchResult] = useState<StorefrontInquiryResult | null>(null)

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
    <footer className="border-t border-[#e2dfd8] dark:border-white/[0.08] bg-[#f5f4f0] dark:bg-[#181b22] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] text-[#6b6860] dark:text-zinc-400 font-sans transition-colors duration-200">
      {/* Top Banner - Buyer Trust & Engineering Standards */}
      <div className="border-b border-[#e2dfd8]/80 dark:border-white/[0.06] py-8">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-mono">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#22252f] border border-[#e2dfd8] dark:border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] flex items-center justify-center shrink-0">
              <Cpu className="w-4 h-4 text-[#0d5d50] dark:text-[#38e8c6]" />
            </div>
            <div>
              <div className="font-bold text-zinc-950 dark:text-white uppercase tracking-tight">6061-T6 AIRCRAFT ALLOY</div>
              <div className="text-zinc-500 dark:text-zinc-400 text-[11px] font-sans mt-0.5">Ultra-light zero-fatigue machine grips</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#22252f] border border-[#e2dfd8] dark:border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#0d5d50] dark:text-[#38e8c6]" />
            </div>
            <div>
              <div className="font-bold text-zinc-950 dark:text-white uppercase tracking-tight">AUTOCLAVABLE CORE</div>
              <div className="text-zinc-500 dark:text-zinc-400 text-[11px] font-sans mt-0.5">Resistant to high-temp medical sterilization</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#22252f] border border-[#e2dfd8] dark:border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4 text-[#0d5d50] dark:text-[#38e8c6]" />
            </div>
            <div>
              <div className="font-bold text-zinc-950 dark:text-white uppercase tracking-tight">40+ NATIONS LOGISTICS</div>
              <div className="text-zinc-500 dark:text-zinc-400 text-[11px] font-sans mt-0.5">Priority air freight &amp; parlor dispatch worldwide</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#22252f] border border-[#e2dfd8] dark:border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] flex items-center justify-center shrink-0">
              <BadgeCheck className="w-4 h-4 text-[#0d5d50] dark:text-[#38e8c6]" />
            </div>
            <div>
              <div className="font-bold text-zinc-950 dark:text-white uppercase tracking-tight">100% EO GAS CERTIFIED</div>
              <div className="text-zinc-500 dark:text-zinc-400 text-[11px] font-sans mt-0.5">Individual blister batch sterility guarantee</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand & Mission */}
          <div className="md:col-span-5 space-y-4">
            <Logo size="lg" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed">
              {t('footer_tagline')}
            </p>

            {/* Direct Contacts From Logo */}
            <div className="pt-2 space-y-2 text-xs font-mono">
              <a
                href="mailto:papatattoosupply@gmail.com"
                className="inline-flex items-center gap-2.5 text-zinc-600 dark:text-zinc-300 hover:text-[#0d5d50] dark:hover:text-[#38e8c6] transition-colors duration-150"
              >
                <Mail className="w-3.5 h-3.5 text-[#0d5d50] dark:text-[#38e8c6]" />
                <span>papatattoosupply@gmail.com</span>
              </a>

              <div>
                <a
                  href="https://instagram.com/papatattoosupply"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-zinc-600 dark:text-zinc-300 hover:text-[#0d5d50] dark:hover:text-[#38e8c6] transition-colors duration-150"
                >
                  <svg className="w-3.5 h-3.5 text-[#0d5d50] dark:text-[#38e8c6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                  <span>@papatattoosupply</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-950 dark:text-white">
              EQUIPMENT
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/collections"
                  search={{ category: 'grips' }}
                  className="hover:text-zinc-950 dark:hover:text-[#38e8c6] transition-colors duration-150"
                >
                  Cartridge Grips
                </Link>
              </li>
              <li>
                <Link
                  to="/collections"
                  search={{ category: 'machines' }}
                  className="hover:text-zinc-950 dark:hover:text-[#38e8c6] transition-colors duration-150"
                >
                  Rotary Machines
                </Link>
              </li>
              <li>
                <Link
                  to="/collections"
                  search={{ category: 'cartridges' }}
                  className="hover:text-zinc-950 dark:hover:text-[#38e8c6] transition-colors duration-150"
                >
                  Needle Cartridges
                </Link>
              </li>
              <li>
                <Link
                  to="/collections"
                  search={{ category: 'power' }}
                  className="hover:text-zinc-950 dark:hover:text-[#38e8c6] transition-colors duration-150"
                >
                  Wireless Power Supplies
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="hover:text-zinc-950 dark:hover:text-[#38e8c6] transition-colors duration-150 inline-flex items-center gap-1 text-[#0d5d50] dark:text-[#38e8c6] font-medium pt-1"
                >
                  <span>All Apparatus Index</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Studio Program */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-950 dark:text-white">
              COMPANY &amp; PRO
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-zinc-950 dark:hover:text-[#38e8c6] transition-colors duration-150">
                  About Papa Tattoo
                </Link>
              </li>
              <li>
                <Link to="/distributors" className="hover:text-zinc-950 dark:hover:text-[#38e8c6] transition-colors duration-150">
                  Official Distributors
                </Link>
              </li>
              <li>
                <Link to="/sponsorship-artists" className="hover:text-zinc-950 dark:hover:text-[#38e8c6] transition-colors duration-150">
                  Sponsorship Artists
                </Link>
              </li>
              <li>
                <a
                  href="https://drive.google.com/file/d/1nMPw2A9x_AwQnlFp0yew_2XNbMBKoiEf/view"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-950 dark:hover:text-[#38e8c6] transition-colors duration-150 inline-flex items-center gap-1 text-[#0d5d50] dark:text-[#38e8c6] font-medium"
                >
                  <span>Machine Repair (RMA)</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <Link to="/contact" className="hover:text-zinc-950 dark:hover:text-[#38e8c6] transition-colors duration-150">
                  Direct Factory Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / Studio Dispatch Alert */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-950 dark:text-white">
              TECHNICAL DISPATCH
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Subscribe for new batch drops, limited anodized runs, and studio volume announcements.
            </p>
            <form onSubmit={handleDispatchSubmit} className="space-y-2">
              <div className="flex gap-1.5">
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
                  aria-label="Email address for dispatch subscription"
                  className="flex-1 min-w-0 px-3.5 py-2.5 text-xs font-mono rounded-xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#22252f] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-[#0d5d50] dark:focus:border-[#38e8c6] transition-colors duration-150"
                />
                <button
                  type="submit"
                  disabled={dispatchLoading}
                  aria-label="Subscribe to technical dispatch"
                  className="px-3.5 py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 text-xs font-mono font-bold uppercase hover:bg-[#0d5d50] dark:hover:bg-[#2dd4b5] active:scale-[0.97] disabled:opacity-50 transition-[transform,background-color,color,opacity] duration-150 ease-[var(--ease-out-strong)] cursor-pointer shrink-0"
                >
                  {dispatchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUpRight className="w-4 h-4" />}
                </button>
              </div>
              {dispatchError ? (
                <span role="alert" className="text-[11px] text-red-600 dark:text-red-400 font-mono block">
                  {dispatchError}
                </span>
              ) : dispatchResult ? (
                <div className="text-[11px] font-mono text-[#0d5d50] dark:text-[#38e8c6] flex items-start gap-1.5 leading-snug">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>
                    {dispatchResult.delivered ? (
                      'Subscribed to Technical Dispatch.'
                    ) : (
                      <>
                        Ready:{' '}
                        <a href={dispatchResult.mailtoUrl} className="underline font-bold">
                          send confirmation email to {dispatchResult.recipient}
                        </a>
                        .
                      </>
                    )}
                  </span>
                </div>
              ) : (
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono block">
                  Zero spam. Professional releases only.
                </span>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#e2dfd8]/80 dark:border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-zinc-500">
          <div>© {new Date().getFullYear()} {t('footer_rights')}</div>
          <div className="flex flex-wrap items-center gap-6">
            <Link to="/about" className="hover:text-zinc-950 dark:hover:text-[#38e8c6] transition-colors duration-150">
              ABOUT US
            </Link>
            <Link to="/distributors" className="hover:text-zinc-950 dark:hover:text-[#38e8c6] transition-colors duration-150">
              DISTRIBUTORS
            </Link>
            <Link to="/sponsorship-artists" className="hover:text-zinc-950 dark:hover:text-[#38e8c6] transition-colors duration-150">
              ARTISTS
            </Link>
            <Link to="/privacy-policy" hash="privacy" className="hover:text-zinc-950 dark:hover:text-[#38e8c6] transition-colors duration-150">
              PRIVACY DISCLOSURE
            </Link>
            <Link to="/privacy-policy" hash="terms" className="hover:text-zinc-950 dark:hover:text-[#38e8c6] transition-colors duration-150">
              TERMS OF SALE
            </Link>
            <Link to="/privacy-policy" hash="quality" className="hover:text-zinc-950 dark:hover:text-[#38e8c6] transition-colors duration-150">
              QUALITY STANDARDS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
