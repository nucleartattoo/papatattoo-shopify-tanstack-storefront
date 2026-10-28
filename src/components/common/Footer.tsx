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
    <footer className="border-t border-black/[0.06] dark:border-white/[0.08] bg-[#f5f5f7] dark:bg-[#0a0a0c] text-[#86868b] font-sans transition-colors duration-200">
      {/* Top Banner - Restrained Borderless Apple-style Pillars */}
      <div className="border-b border-black/[0.06] dark:border-white/[0.06] py-10">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-xs">
          <div className="flex items-start gap-3">
            <Cpu className="w-4 h-4 text-[#1d1d1f] dark:text-[#f5f5f7] mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-[-0.01em]">6061-T6 Aircraft Alloy</div>
              <div className="text-[#86868b] text-xs mt-0.5 leading-relaxed">Ultra-light zero-fatigue machine grips</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-[#1d1d1f] dark:text-[#f5f5f7] mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-[-0.01em]">Autoclavable Core</div>
              <div className="text-[#86868b] text-xs mt-0.5 leading-relaxed">Engineered for high-temp medical sterilization</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Globe className="w-4 h-4 text-[#1d1d1f] dark:text-[#f5f5f7] mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-[-0.01em]">40+ Countries Dispatch</div>
              <div className="text-[#86868b] text-xs mt-0.5 leading-relaxed">Priority air freight &amp; studio delivery worldwide</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <BadgeCheck className="w-4 h-4 text-[#1d1d1f] dark:text-[#f5f5f7] mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-[-0.01em]">100% EO Gas Certified</div>
              <div className="text-[#86868b] text-xs mt-0.5 leading-relaxed">Individual blister batch sterility guarantee</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand & Mission */}
          <div className="md:col-span-5 space-y-4">
            <Logo size="lg" />
            <p className="text-xs text-[#86868b] max-w-sm leading-relaxed">
              {t('footer_tagline')}
            </p>

            {/* Direct Contacts */}
            <div className="pt-1 space-y-2 text-xs">
              <a
                href="mailto:papatattoosupply@gmail.com"
                className="inline-flex items-center gap-2 text-[#1d1d1f]/80 dark:text-[#f5f5f7]/80 hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150"
              >
                <Mail className="w-3.5 h-3.5 text-[#86868b]" />
                <span>papatattoosupply@gmail.com</span>
              </a>

              <div>
                <a
                  href="https://instagram.com/papatattoosupply"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#1d1d1f]/80 dark:text-[#f5f5f7]/80 hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150"
                >
                  <svg className="w-3.5 h-3.5 text-[#86868b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            <h4 className="text-xs font-semibold tracking-[-0.01em] text-[#1d1d1f] dark:text-[#f5f5f7]">
              Products
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  to="/collections"
                  search={{ category: 'grips' }}
                  className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150"
                >
                  Cartridge Grips
                </Link>
              </li>
              <li>
                <Link
                  to="/collections"
                  search={{ category: 'machines' }}
                  className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150"
                >
                  Rotary Machines
                </Link>
              </li>
              <li>
                <Link
                  to="/collections"
                  search={{ category: 'cartridges' }}
                  className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150"
                >
                  Needle Cartridges
                </Link>
              </li>
              <li>
                <Link
                  to="/collections"
                  search={{ category: 'power' }}
                  className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150"
                >
                  Wireless Power
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="hover:opacity-75 transition-opacity duration-150 inline-flex items-center gap-1 text-[#1d1d1f] dark:text-[#f5f5f7] font-medium pt-0.5"
                >
                  <span>All Products</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Studio Program */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold tracking-[-0.01em] text-[#1d1d1f] dark:text-[#f5f5f7]">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/about" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150">
                  About Papa Tattoo
                </Link>
              </li>
              <li>
                <Link to="/distributors" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150">
                  Official Distributors
                </Link>
              </li>
              <li>
                <Link to="/sponsorship-artists" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150">
                  Sponsorship Artists
                </Link>
              </li>
              <li>
                <a
                  href="https://drive.google.com/file/d/1nMPw2A9x_AwQnlFp0yew_2XNbMBKoiEf/view"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150 inline-flex items-center gap-1"
                >
                  <span>Machine Service (RMA)</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / Studio Dispatch Alert */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold tracking-[-0.01em] text-[#1d1d1f] dark:text-[#f5f5f7]">
              Studio Updates
            </h4>
            <p className="text-xs text-[#86868b] leading-relaxed">
              Receive notifications on new hardware releases, limited anodized finishes, and studio volume programs.
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
                  className="flex-1 min-w-0 px-4 py-2 text-xs font-sans rounded-full border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#161618] text-[#1d1d1f] dark:text-[#f5f5f7] placeholder:text-[#86868b] focus:outline-hidden focus:border-[#1d1d1f] dark:focus:border-white transition-colors duration-150"
                />
                <button
                  type="submit"
                  disabled={dispatchLoading}
                  aria-label="Subscribe to studio updates"
                  className="px-4 py-2 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-xs font-medium hover:opacity-85 active:scale-[0.97] disabled:opacity-50 transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] cursor-pointer shrink-0"
                >
                  {dispatchLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Join</span>}
                </button>
              </div>
              {dispatchError ? (
                <span role="alert" className="text-[11px] text-red-600 dark:text-red-400 block">
                  {dispatchError}
                </span>
              ) : dispatchResult ? (
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400 flex items-start gap-1.5 leading-snug">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>
                    {dispatchResult.delivered ? (
                      'Subscribed to Studio Updates.'
                    ) : (
                      <>
                        Ready:{' '}
                        <a href={dispatchResult.mailtoUrl} className="underline font-medium">
                          confirm subscription
                        </a>
                        .
                      </>
                    )}
                  </span>
                </div>
              ) : null}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-black/[0.06] dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#86868b]">
          <div>© {new Date().getFullYear()} {t('footer_rights')}</div>
          <div className="flex flex-wrap items-center gap-6">
            <Link to="/about" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150">
              About
            </Link>
            <Link to="/distributors" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150">
              Distributors
            </Link>
            <Link to="/sponsorship-artists" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150">
              Artists
            </Link>
            <Link to="/privacy-policy" hash="privacy" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150">
              Privacy Policy
            </Link>
            <Link to="/privacy-policy" hash="terms" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150">
              Terms of Sale
            </Link>
            <Link to="/privacy-policy" hash="quality" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150">
              Quality Standards
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
