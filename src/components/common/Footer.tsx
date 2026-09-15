import React from 'react'
import { Link } from '@tanstack/react-router'
import { Logo } from './Logo'
import { useLocale } from '../../context/LocaleContext'
import { Mail, Globe, ShieldCheck, Cpu, ArrowUpRight } from 'lucide-react'

export const Footer: React.FC = () => {
  const { t } = useLocale()

  return (
    <footer className="border-t border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#07080A] text-zinc-600 dark:text-zinc-400 font-sans transition-colors duration-200">
      {/* Top Banner */}
      <div className="border-b border-zinc-200 dark:border-[#1C202A] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6 text-xs font-mono">
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5 text-[#0d9488] dark:text-[#2EE6CA] shrink-0" />
            <div>
              <div className="font-bold text-zinc-950 dark:text-white uppercase">6061-T6 AIRCRAFT ALLOY</div>
              <div className="text-zinc-500">Ultra-light zero-fatigue machine grips</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#0d9488] dark:text-[#2EE6CA] shrink-0" />
            <div>
              <div className="font-bold text-zinc-950 dark:text-white uppercase">AUTOCLAVABLE CORE</div>
              <div className="text-zinc-500">Resistant to high-temp medical sterilization</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-[#0d9488] dark:text-[#2EE6CA] shrink-0" />
            <div>
              <div className="font-bold text-zinc-950 dark:text-white uppercase">WORLDWIDE DISTRIBUTION</div>
              <div className="text-zinc-500">Priority logistics to parlors across 60+ countries</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <div>
              <div className="font-bold text-zinc-950 dark:text-white uppercase">SHOPIFY POWERED</div>
              <div className="text-zinc-500">Direct Storefront Headless Edge Speed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
                className="flex items-center gap-2.5 text-zinc-600 dark:text-zinc-300 hover:text-[#0d9488] dark:hover:text-[#2EE6CA] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#0d9488] dark:text-[#2EE6CA]" />
                <span>papatattoosupply@gmail.com</span>
              </a>

              <a
                href="https://www.papatattoo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-zinc-600 dark:text-zinc-300 hover:text-[#0d9488] dark:hover:text-[#2EE6CA] transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-[#0d9488] dark:text-[#2EE6CA]" />
                <span>www.papatattoo.com</span>
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-zinc-600 dark:text-zinc-300 hover:text-[#0d9488] dark:hover:text-[#2EE6CA] transition-colors"
              >
                <svg className="w-3.5 h-3.5 text-[#0d9488] dark:text-[#2EE6CA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
                <span>Papa Tattoo Supply</span>
              </a>

              <a
                href="https://instagram.com/papatattoosupply"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-zinc-600 dark:text-zinc-300 hover:text-[#0d9488] dark:hover:text-[#2EE6CA] transition-colors"
              >
                <svg className="w-3.5 h-3.5 text-[#0d9488] dark:text-[#2EE6CA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
                <span>@papatattoosupply</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-950 dark:text-white">
              EQUIPMENT
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#catalog-section" className="hover:text-zinc-950 dark:hover:text-[#2EE6CA] transition-colors">
                  Adjustable Grips
                </a>
              </li>
              <li>
                <a href="#catalog-section" className="hover:text-zinc-950 dark:hover:text-[#2EE6CA] transition-colors">
                  Rotary Machines
                </a>
              </li>
              <li>
                <a href="#catalog-section" className="hover:text-zinc-950 dark:hover:text-[#2EE6CA] transition-colors">
                  Cartridge Needles
                </a>
              </li>
              <li>
                <a href="#catalog-section" className="hover:text-zinc-950 dark:hover:text-[#2EE6CA] transition-colors">
                  Wireless Battery Packs
                </a>
              </li>
            </ul>
          </div>

          {/* Studio Program */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-950 dark:text-white">
              STUDIO & PRO
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-zinc-950 dark:hover:text-[#2EE6CA] transition-colors">
                  About Papa Tattoo
                </Link>
              </li>
              <li>
                <Link to="/wholesale" className="hover:text-zinc-950 dark:hover:text-[#2EE6CA] transition-colors">
                  Wholesale Inquiries
                </Link>
              </li>
              <li>
                <Link to="/sponsorship-artists" className="hover:text-zinc-950 dark:hover:text-[#2EE6CA] transition-colors">
                  Sponsorship Artists
                </Link>
              </li>
              <li>
                <Link to="/distributors" className="hover:text-zinc-950 dark:hover:text-[#2EE6CA] transition-colors">
                  Official Distributors
                </Link>
              </li>
              <li>
                <a
                  href="https://drive.google.com/file/d/1nMPw2A9x_AwQnlFp0yew_2XNbMBKoiEf/view"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-950 dark:hover:text-[#2EE6CA] transition-colors flex items-center gap-1 text-[#0d9488] dark:text-[#2EE6CA] font-medium"
                >
                  <span>Machine Repair (RMA)</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <Link to="/contact" className="hover:text-zinc-950 dark:hover:text-[#2EE6CA] transition-colors">
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
            <p className="text-xs text-zinc-500 leading-relaxed">
              Subscribe for new batch drops, limited anodized runs, and studio volume announcements.
            </p>
            <form onSubmit={e => e.preventDefault()} className="space-y-2">
              <div className="flex gap-1.5">
                <input
                  type="email"
                  placeholder="artist@studio.com"
                  className="flex-1 px-3 py-2 text-xs font-mono rounded-lg border border-zinc-200 dark:border-[#222731] bg-zinc-50 dark:bg-[#11141B] text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:border-[#2EE6CA]"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-lg bg-zinc-950 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 text-xs font-mono font-bold uppercase"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono block">Zero spam. Professional releases only.</span>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-[#1C202A] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-zinc-500">
          <div>© {new Date().getFullYear()} {t('footer_rights')}</div>
          <div className="flex flex-wrap items-center gap-6">
            <Link to="/about" className="hover:text-zinc-950 dark:hover:text-[#2EE6CA] transition-colors">
              ABOUT US
            </Link>
            <Link to="/distributors" className="hover:text-zinc-950 dark:hover:text-[#2EE6CA] transition-colors">
              DISTRIBUTORS
            </Link>
            <Link to="/privacy-policy" hash="privacy" className="hover:text-zinc-950 dark:hover:text-[#2EE6CA] transition-colors">
              PRIVACY DISCLOSURE
            </Link>
            <Link to="/privacy-policy" hash="terms" className="hover:text-zinc-950 dark:hover:text-[#2EE6CA] transition-colors">
              TERMS OF SALE
            </Link>
            <Link to="/privacy-policy" hash="quality" className="hover:text-zinc-950 dark:hover:text-[#2EE6CA] transition-colors">
              QUALITY STANDARDS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
