import React, { useEffect, useMemo, useState } from 'react'
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
  Table,
  CheckCircle2,
  Sliders,
  HelpCircle,
  ChevronRight,
  Search,
} from 'lucide-react'

type CookieCategory = 'Security & Session' | 'Cart & Consent' | 'Performance Cache' | 'Localization'

interface CookieItem {
  name: string
  category: CookieCategory
  description: string
}

const COOKIE_LIST: CookieItem[] = [
  {
    name: 'FORM_KEY',
    category: 'Security & Session',
    description: 'Stores randomly generated key used to prevent forged requests.',
  },
  {
    name: 'PHPSESSID',
    category: 'Security & Session',
    description: 'Your session ID on the server.',
  },
  {
    name: 'GUEST-VIEW',
    category: 'Security & Session',
    description: 'Allows guests to view and edit their orders.',
  },
  {
    name: 'PERSISTENT_SHOPPING_CART',
    category: 'Cart & Consent',
    description: 'A link to information about your cart and viewing history, if you have asked.',
  },
  {
    name: 'SECTION-DATA-IDS',
    category: 'Cart & Consent',
    description: 'Facilitates client-side caching of customer segments, cart counts, and currency settings.',
  },
  {
    name: 'STF',
    category: 'Security & Session',
    description: 'Information on products you have emailed to friends.',
  },
  {
    name: 'STORE',
    category: 'Localization',
    description: 'The store view or language you have selected.',
  },
  {
    name: 'USER_ALLOWED_SAVE_COOKIE',
    category: 'Cart & Consent',
    description: 'Indicates whether a customer allowed to use cookies.',
  },
  {
    name: 'MAGE-CACHE-SESSID',
    category: 'Performance Cache',
    description: 'Facilitates caching of content on the browser to make pages load faster.',
  },
  {
    name: 'MAGE-CACHE-STORAGE',
    category: 'Performance Cache',
    description: 'Facilitates caching of content on the browser to make pages load faster.',
  },
  {
    name: 'MAGE-CACHE-STORAGE-SECTION-INVALIDATION',
    category: 'Performance Cache',
    description: 'Facilitates caching of content on the browser to make pages load faster.',
  },
  {
    name: 'MAGE-CACHE-TIMEOUT',
    category: 'Performance Cache',
    description: 'Facilitates caching of content on the browser to make pages load faster.',
  },
  {
    name: 'SECTION-DATA-CONFIGURE',
    category: 'Performance Cache',
    description: 'Facilitates caching of content on the browser to make pages load faster.',
  },
  {
    name: 'PRIVATE_CONTENT_VERSION',
    category: 'Performance Cache',
    description: 'Facilitates caching of content on the browser to make pages load faster.',
  },
  {
    name: 'MAGE-TRANSLATION-FILE-VERSION',
    category: 'Localization',
    description: 'Facilitates translation of content to other languages.',
  },
  {
    name: 'MAGE-TRANSLATION-STORAGE',
    category: 'Localization',
    description: 'Facilitates translation of content to other languages.',
  },
]

const DOCUMENT_SECTIONS = [
  { id: 'overview', index: '01', label: 'Privacy Overview' },
  { id: 'what-we-collect', index: '02', label: 'What We Collect' },
  { id: 'how-we-use', index: '03', label: 'How We Use Info' },
  { id: 'security', index: '04', label: 'Data & Payment Security' },
  { id: 'cookies', index: '05', label: 'How We Use Cookies' },
  { id: 'external-links', index: '06', label: 'External Website Links' },
  { id: 'controlling', index: '07', label: 'Controlling Personal Info' },
  { id: 'cookie-list', index: '08', label: 'Cookie Registry (16)' },
  { id: 'terms', index: '09', label: 'Terms of Sale & RMA' },
] as const

const COOKIE_CATEGORIES: Array<'All' | CookieCategory> = [
  'All',
  'Security & Session',
  'Cart & Consent',
  'Performance Cache',
  'Localization',
]

export const PrivacyPolicyPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview')
  const [selectedCategory, setSelectedCategory] = useState<'All' | CookieCategory>('All')
  const [cookieQuery, setCookieQuery] = useState('')

  useEffect(() => {
    const syncHashSection = () => {
      const rawHash = window.location.hash.replace(/^#/, '').trim()
      if (!rawHash) return
      const mappedSection =
        rawHash === 'privacy'
          ? 'overview'
          : rawHash === 'quality'
          ? 'terms'
          : rawHash
      if (DOCUMENT_SECTIONS.some(s => s.id === mappedSection)) {
        setActiveSection(mappedSection)
      }
      const targetEl =
        document.getElementById(rawHash) ||
        document.getElementById(mappedSection)
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    syncHashSection()
    window.addEventListener('hashchange', syncHashSection)
    return () => window.removeEventListener('hashchange', syncHashSection)
  }, [])

  const filteredCookies = useMemo(() => {
    const q = cookieQuery.trim().toLowerCase()
    return COOKIE_LIST.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [selectedCategory, cookieQuery])

  return (
    <div className="min-h-[100dvh] bg-[#f5f5f7] dark:bg-black text-[#1d1d1f] dark:text-[#f5f5f7] font-sans pb-24 transition-colors duration-200">
      {/* 1. HERO COMPLIANCE SPEC & OVERVIEW */}
      <section className="pt-12 sm:pt-20 pb-12 sm:pb-16">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-[#86868b] mb-8"
          >
            <Link to="/" className="hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors duration-150">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-[#86868b]" />
            <span className="text-[#1d1d1f] dark:text-[#f5f5f7] font-medium">
              Privacy, Cookies &amp; Terms
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/[0.045] dark:bg-white/[0.08] text-xs font-medium text-[#86868b]">
                <Lock className="w-3.5 h-3.5" />
                <span>Compliance &amp; RMA Disclosures</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-semibold tracking-[-0.035em] text-[#1d1d1f] dark:text-[#f5f5f7] leading-[1.06]">
                Privacy, Cookie &amp; RMA Policy
              </h1>

              <p className="text-base sm:text-lg text-[#86868b] max-w-2xl leading-relaxed">
                Official Papa Tattoo Supply data protection standards, browser cookie disclosures, EO-gas sterilization certifications, and 14-day factory RMA servicing terms.
              </p>
            </div>

            {/* Right 4-Tile Compliance Spec Matrix */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
              <div className="p-5 rounded-[22px] bg-white dark:bg-[#121214] shadow-xs border border-black/[0.04] dark:border-white/[0.06]">
                <div className="text-[11px] font-medium text-[#86868b] uppercase tracking-wide">
                  Checkout Vault
                </div>
                <div className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mt-1.5 tabular-nums">
                  PCI-DSS L1
                </div>
                <div className="text-xs text-[#86868b] mt-1">
                  Encrypted billing tokens
                </div>
              </div>

              <div className="p-5 rounded-[22px] bg-white dark:bg-[#121214] shadow-xs border border-black/[0.04] dark:border-white/[0.06]">
                <div className="text-[11px] font-medium text-[#86868b] uppercase tracking-wide">
                  Cookie Registry
                </div>
                <div className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mt-1.5 tabular-nums">
                  16 Keys
                </div>
                <div className="text-xs text-[#86868b] mt-1">
                  Session, cart &amp; cache
                </div>
              </div>

              <div className="p-5 rounded-[22px] bg-white dark:bg-[#121214] shadow-xs border border-black/[0.04] dark:border-white/[0.06]">
                <div className="text-[11px] font-medium text-[#86868b] uppercase tracking-wide">
                  Return Window
                </div>
                <div className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mt-1.5 tabular-nums">
                  14 Days
                </div>
                <div className="text-xs text-[#86868b] mt-1">
                  Verified factory defects
                </div>
              </div>

              <div className="p-5 rounded-[22px] bg-white dark:bg-[#121214] shadow-xs border border-black/[0.04] dark:border-white/[0.06]">
                <div className="text-[11px] font-medium text-[#86868b] uppercase tracking-wide">
                  Sterility Standard
                </div>
                <div className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mt-1.5 tabular-nums">
                  316L + EO
                </div>
                <div className="text-xs text-[#86868b] mt-1">
                  Lot-tracked cartridges
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TWO-COLUMN INTERACTIVE DOSSIER BODY */}
      <main className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Sticky Left Clause Navigation & RMA Bench */}
          <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24 space-y-5">
            <div className="rounded-[28px] bg-white dark:bg-[#121214] shadow-xs border border-black/[0.04] dark:border-white/[0.06] p-5">
              <div className="flex items-center justify-between text-xs font-medium text-[#86868b] pb-3 mb-2 border-b border-black/[0.04] dark:border-white/[0.06]">
                <span>Policy Clause Index</span>
                <span className="tabular-nums">09</span>
              </div>

              <nav aria-label="Policy clauses" className="space-y-1 text-xs">
                {DOCUMENT_SECTIONS.map(sec => {
                  const isActive = activeSection === sec.id
                  return (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      onClick={(e) => {
                        e.preventDefault()
                        setActiveSection(sec.id)
                        document.getElementById(sec.id)?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start',
                        })
                      }}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl active:scale-[0.98] transition-[background-color,color,transform] duration-150 ease-[var(--ease-out-strong)] ${
                        isActive
                          ? 'bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] font-medium shadow-2xs'
                          : 'text-[#86868b] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:text-[#1d1d1f] dark:hover:text-white'
                      }`}
                    >
                      <span className="truncate">{sec.label}</span>
                      <span
                        className={`text-[11px] tabular-nums shrink-0 ml-2 ${
                          isActive
                            ? 'text-white/80 dark:text-[#1d1d1f]/80'
                            : 'text-[#86868b]'
                        }`}
                      >
                        {sec.index}
                      </span>
                    </a>
                  )
                })}
              </nav>
            </div>

            {/* Quick Factory RMA Repair Card */}
            <div className="rounded-[28px] bg-white dark:bg-[#121214] shadow-xs border border-black/[0.04] dark:border-white/[0.06] p-6 space-y-3.5">
              <div className="flex items-center justify-between text-xs font-medium text-[#86868b]">
                <span>Factory Service Desk</span>
                <FileText className="w-3.5 h-3.5" />
              </div>
              <div className="text-sm font-semibold tracking-[-0.01em] text-[#1d1d1f] dark:text-[#f5f5f7]">
                Machine RMA Form (PDF)
              </div>
              <p className="text-xs text-[#86868b] leading-relaxed">
                Need servicing for a Papa Pen or Rotary apparatus? Download the official factory RMA intake sheet before shipping.
              </p>
              <a
                href="https://drive.google.com/file/d/1nMPw2A9x_AwQnlFp0yew_2XNbMBKoiEf/view"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-xs font-medium hover:opacity-85 active:scale-[0.98] transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] shadow-xs"
              >
                <span>Open RMA Intake PDF</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </aside>

          {/* Right Clause Cards */}
          <div id="privacy" className="lg:col-span-8 xl:col-span-9 space-y-6 scroll-mt-28">
            {/* Section 1: Overview */}
            <section
              id="overview"
              className="rounded-[28px] bg-white dark:bg-[#121214] shadow-xs border border-black/[0.04] dark:border-white/[0.06] p-6 sm:p-8 space-y-4 scroll-mt-28"
            >
              <div className="flex items-center justify-between pb-4 border-b border-black/[0.04] dark:border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#1d1d1f] dark:text-[#f5f5f7]" />
                  <h2 className="text-lg sm:text-xl font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-[#f5f5f7]">
                    Privacy Policy Overview
                  </h2>
                </div>
                <span className="text-xs font-mono tabular-nums text-[#86868b]">
                  01
                </span>
              </div>
              <div className="space-y-3 text-sm text-[#86868b] leading-relaxed">
                <p>
                  This privacy policy sets out how this website (hereafter &quot;the Store&quot;) uses and protects any information that you give the Store while using this website. The Store is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, then you can be assured that it will only be used in accordance with this privacy statement.
                </p>
                <p>
                  The Store may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you are happy with any changes.
                </p>
              </div>
            </section>

            {/* Section 2: What We Collect */}
            <section
              id="what-we-collect"
              className="rounded-[28px] bg-white dark:bg-[#121214] shadow-xs border border-black/[0.04] dark:border-white/[0.06] p-6 sm:p-8 space-y-5 scroll-mt-28"
            >
              <div className="flex items-center justify-between pb-4 border-b border-black/[0.04] dark:border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#1d1d1f] dark:text-[#f5f5f7]" />
                  <h2 className="text-lg sm:text-xl font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-[#f5f5f7]">
                    What We Collect
                  </h2>
                </div>
                <span className="text-xs font-mono tabular-nums text-[#86868b]">
                  02
                </span>
              </div>
              <div className="space-y-4 text-sm text-[#86868b] leading-relaxed">
                <p>We may collect the following information:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className="p-4 rounded-2xl bg-[#f5f5f7] dark:bg-[#18181b] text-[#1d1d1f] dark:text-[#f5f5f7]">
                    Full Name &amp; Studio Identity
                  </div>
                  <div className="p-4 rounded-2xl bg-[#f5f5f7] dark:bg-[#18181b] text-[#1d1d1f] dark:text-[#f5f5f7]">
                    Contact information including email address
                  </div>
                  <div className="p-4 rounded-2xl bg-[#f5f5f7] dark:bg-[#18181b] text-[#1d1d1f] dark:text-[#f5f5f7]">
                    Demographic information (postcode, preferences, interests)
                  </div>
                  <div className="p-4 rounded-2xl bg-[#f5f5f7] dark:bg-[#18181b] text-[#1d1d1f] dark:text-[#f5f5f7]">
                    Information relevant to customer surveys and/or offers
                  </div>
                </div>
                <p className="text-xs pt-1">
                  For the exhaustive list of cookies we collect see the{' '}
                  <a
                    href="#cookie-list"
                    onClick={(e) => {
                      e.preventDefault()
                      setActiveSection('cookie-list')
                      document.getElementById('cookie-list')?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                      })
                    }}
                    className="text-[#1d1d1f] dark:text-white font-medium underline"
                  >
                    List of cookies we collect
                  </a>{' '}
                  section below.
                </p>
              </div>
            </section>

            {/* Section 3: What We Do with the Information */}
            <section
              id="how-we-use"
              className="rounded-[28px] bg-white dark:bg-[#121214] shadow-xs border border-black/[0.04] dark:border-white/[0.06] p-6 sm:p-8 space-y-4 scroll-mt-28"
            >
              <div className="flex items-center justify-between pb-4 border-b border-black/[0.04] dark:border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <Sliders className="w-5 h-5 text-[#1d1d1f] dark:text-[#f5f5f7]" />
                  <h2 className="text-lg sm:text-xl font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-[#f5f5f7]">
                    What We Do with the Information We Gather
                  </h2>
                </div>
                <span className="text-xs font-mono tabular-nums text-[#86868b]">
                  03
                </span>
              </div>
              <div className="space-y-4 text-sm text-[#86868b] leading-relaxed">
                <p>
                  We require this information to understand your needs and provide you with a better service, and in particular for the following reasons:
                </p>
                <ul className="list-disc list-inside space-y-2 pl-2 text-xs sm:text-sm text-[#1d1d1f] dark:text-[#f5f5f7]">
                  <li>Internal record keeping.</li>
                  <li>We may use the information to improve our products and services.</li>
                  <li>
                    We may periodically send promotional emails about new products, special offers or other information which we think you may find interesting using the email address which you have provided.
                  </li>
                  <li>
                    From time to time, we may also use your information to contact you for market research purposes. We may contact you by email or phone. We may use the information to customise the website according to your interests.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 4: Security */}
            <section
              id="security"
              className="rounded-[28px] bg-white dark:bg-[#121214] shadow-xs border border-black/[0.04] dark:border-white/[0.06] p-6 sm:p-8 space-y-4 scroll-mt-28"
            >
              <div className="flex items-center justify-between pb-4 border-b border-black/[0.04] dark:border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-[#1d1d1f] dark:text-[#f5f5f7]" />
                  <h2 className="text-lg sm:text-xl font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-[#f5f5f7]">
                    Security
                  </h2>
                </div>
                <span className="text-xs font-mono tabular-nums text-[#86868b]">
                  04
                </span>
              </div>
              <div className="space-y-3 text-sm text-[#86868b] leading-relaxed">
                <p>
                  We are committed to ensuring that your information is secure. In order to prevent unauthorised access or disclosure, we have put in place suitable physical, electronic and managerial procedures to safeguard and secure the information we collect online.
                </p>
                <p>
                  All online payment transactions and sensitive billing tokens are encrypted directly via Level 1 PCI-DSS compliant payment vaults, and are never exposed or retained in raw format on our web servers.
                </p>
              </div>
            </section>

            {/* Section 5: How We Use Cookies */}
            <section
              id="cookies"
              className="rounded-[28px] bg-white dark:bg-[#121214] shadow-xs border border-black/[0.04] dark:border-white/[0.06] p-6 sm:p-8 space-y-4 scroll-mt-28"
            >
              <div className="flex items-center justify-between pb-4 border-b border-black/[0.04] dark:border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <Cookie className="w-5 h-5 text-[#1d1d1f] dark:text-[#f5f5f7]" />
                  <h2 className="text-lg sm:text-xl font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-[#f5f5f7]">
                    How We Use Cookies
                  </h2>
                </div>
                <span className="text-xs font-mono tabular-nums text-[#86868b]">
                  05
                </span>
              </div>
              <div className="space-y-3 text-sm text-[#86868b] leading-relaxed">
                <p>
                  A cookie is a small file which asks permission to be placed on your computer&apos;s hard drive. Once you agree, the file is added and the cookie helps analyse web traffic or lets you know when you visit a particular site. Cookies allow web applications to respond to you as an individual. The web application can tailor its operations to your needs, likes and dislikes by gathering and remembering information about your preferences.
                </p>
                <p>
                  We use traffic log cookies to identify which pages are being used. This helps us analyse data about web page traffic and improve our website in order to tailor it to customer needs. We only use this information for statistical analysis purposes and then the data is removed from the system.
                </p>
                <p>
                  Overall, cookies help us provide you with a better website, by enabling us to monitor which pages you find useful and which you do not. A cookie in no way gives us access to your computer or any information about you, other than the data you choose to share with us.
                </p>
                <p>
                  You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. This may prevent you from taking full advantage of the website.
                </p>
              </div>
            </section>

            {/* Section 6: Links to Other Websites */}
            <section
              id="external-links"
              className="rounded-[28px] bg-white dark:bg-[#121214] shadow-xs border border-black/[0.04] dark:border-white/[0.06] p-6 sm:p-8 space-y-4 scroll-mt-28"
            >
              <div className="flex items-center justify-between pb-4 border-b border-black/[0.04] dark:border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-5 h-5 text-[#1d1d1f] dark:text-[#f5f5f7]" />
                  <h2 className="text-lg sm:text-xl font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-[#f5f5f7]">
                    Links to Other Websites
                  </h2>
                </div>
                <span className="text-xs font-mono tabular-nums text-[#86868b]">
                  06
                </span>
              </div>
              <div className="space-y-3 text-sm text-[#86868b] leading-relaxed">
                <p>
                  Our website may contain links to other websites of interest. However, once you have used these links to leave our site, you should note that we do not have any control over that other website. Therefore, we cannot be responsible for the protection and privacy of any information which you provide whilst visiting such sites and such sites are not governed by this privacy statement. You should exercise caution and look at the privacy statement applicable to the website in question.
                </p>
              </div>
            </section>

            {/* Section 7: Controlling Your Personal Information */}
            <section
              id="controlling"
              className="rounded-[28px] bg-white dark:bg-[#121214] shadow-xs border border-black/[0.04] dark:border-white/[0.06] p-6 sm:p-8 space-y-4 scroll-mt-28"
            >
              <div className="flex items-center justify-between pb-4 border-b border-black/[0.04] dark:border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-[#1d1d1f] dark:text-[#f5f5f7]" />
                  <h2 className="text-lg sm:text-xl font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-[#f5f5f7]">
                    Controlling Your Personal Information
                  </h2>
                </div>
                <span className="text-xs font-mono tabular-nums text-[#86868b]">
                  07
                </span>
              </div>
              <div className="space-y-4 text-sm text-[#86868b] leading-relaxed">
                <p>
                  You may choose to restrict the collection or use of your personal information in the following ways:
                </p>
                <ul className="list-disc list-inside space-y-2 pl-2 text-xs sm:text-sm text-[#1d1d1f] dark:text-[#f5f5f7]">
                  <li>
                    Whenever you are asked to fill in a form on the website, look for the box that you can click to indicate that you do not want the information to be used by anybody for direct marketing purposes.
                  </li>
                  <li>
                    If you have previously agreed to us using your personal information for direct marketing purposes, you may change your mind at any time by letting us know using our Contact Us information.
                  </li>
                </ul>
                <p>
                  We will not sell, distribute or lease your personal information to third parties unless we have your permission or are required by law to do so. We may use your personal information to send you promotional information about third parties which we think you may find interesting if you tell us that you wish this to happen.
                </p>
                <p>
                  You may request details of personal information which we hold about you under the Data Protection Act 1998. A small fee will be payable. If you would like a copy of the information held on you please email us this request using our Contact Us information.
                </p>
                <p>
                  If you believe that any information we are holding on you is incorrect or incomplete, please write to or email us as soon as possible. We will promptly correct any information found to be incorrect.
                </p>
              </div>
            </section>

            {/* Section 8: List of Cookies We Collect (Interactive Filterable Registry) */}
            <section
              id="cookie-list"
              className="rounded-[28px] bg-white dark:bg-[#121214] shadow-xs border border-black/[0.04] dark:border-white/[0.06] overflow-hidden scroll-mt-28"
            >
              <div className="p-6 sm:p-8 border-b border-black/[0.04] dark:border-white/[0.06] space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Table className="w-5 h-5 text-[#1d1d1f] dark:text-[#f5f5f7]" />
                    <h2 className="text-lg sm:text-xl font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-[#f5f5f7]">
                      List of Cookies We Collect
                    </h2>
                  </div>
                  <span className="text-xs font-mono tabular-nums text-[#86868b]">
                    08
                  </span>
                </div>

                <p className="text-sm text-[#86868b]">
                  The table below lists the cookies we collect and what information they store across session security, persistent cart state, browser cache, and translation storage.
                </p>

                {/* Interactive Segmented Filter Controls & Search */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pt-1">
                  <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter cookies by category">
                    {COOKIE_CATEGORIES.map(category => {
                      const count =
                        category === 'All'
                          ? COOKIE_LIST.length
                          : COOKIE_LIST.filter(c => c.category === category).length
                      const isSelected = selectedCategory === category
                      return (
                        <button
                          key={category}
                          type="button"
                          onClick={() => setSelectedCategory(category)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer active:scale-[0.98] transition-[background-color,color,transform,box-shadow] duration-150 ease-[var(--ease-out-strong)] ${
                            isSelected
                              ? 'bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] shadow-xs'
                              : 'bg-black/[0.045] dark:bg-white/[0.08] text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                          }`}
                        >
                          {category} ({count})
                        </button>
                      )
                    })}
                  </div>

                  <div className="relative w-full sm:w-72 xl:w-64 shrink-0">
                    <label htmlFor="cookie-registry-search" className="sr-only">
                      Search cookie name or purpose
                    </label>
                    <Search className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="cookie-registry-search"
                      type="search"
                      value={cookieQuery}
                      onChange={e => setCookieQuery(e.target.value)}
                      placeholder="Filter cookies..."
                      className="w-full pl-10 pr-4 h-10 rounded-full bg-black/[0.045] dark:bg-white/[0.08] text-xs text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#86868b] outline-hidden focus:bg-white dark:focus:bg-[#1c1c1e] transition-colors duration-150"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/[0.02] dark:bg-white/[0.03] border-b border-black/[0.04] dark:border-white/[0.06] text-[#86868b] font-medium uppercase tracking-wider">
                    <tr>
                      <th scope="col" className="px-6 py-4 w-1/3">
                        Cookie Name
                      </th>
                      <th scope="col" className="px-4 py-4 w-44">
                        Classification
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.06]">
                    {filteredCookies.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-6 py-10 text-center text-[#86868b]"
                        >
                          No cookies match &quot;{cookieQuery}&quot;.
                        </td>
                      </tr>
                    ) : (
                      filteredCookies.map((item) => (
                        <tr
                          key={item.name}
                          className="hover:bg-black/[0.015] dark:hover:bg-white/[0.02] transition-colors duration-150"
                        >
                          <th
                            scope="row"
                            className="px-6 py-4 text-[#1d1d1f] dark:text-[#f5f5f7] font-mono font-medium align-top"
                          >
                            {item.name}
                          </th>
                          <td className="px-4 py-4 align-top">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-black/[0.04] dark:bg-white/[0.08] text-[#86868b]">
                              {item.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[#86868b] align-top font-normal leading-relaxed">
                            {item.description}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 9: Commercial Terms & RMA Protocols */}
            <section
              id="terms"
              className="rounded-[28px] bg-white dark:bg-[#121214] shadow-xs border border-black/[0.04] dark:border-white/[0.06] p-6 sm:p-8 space-y-6 scroll-mt-28"
            >
              <div className="flex items-center justify-between pb-4 border-b border-black/[0.04] dark:border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <FileCheck2 className="w-5 h-5 text-[#1d1d1f] dark:text-[#f5f5f7]" />
                  <h2 className="text-lg sm:text-xl font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-[#f5f5f7]">
                    Commercial Sale Terms, Sterility &amp; RMA Protocol
                  </h2>
                </div>
                <span className="text-xs font-mono tabular-nums text-[#86868b]">
                  09
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 14-Day Return Policy */}
                <div className="p-6 rounded-[22px] bg-[#f5f5f7] dark:bg-[#18181b] space-y-2">
                  <h3 className="font-semibold text-sm text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[#86868b]" />
                    <span>14-Day Fault Return Policy</span>
                  </h3>
                  <p className="text-xs text-[#86868b] leading-relaxed">
                    Items can be returned for replacement or full refund if a genuine manufacturing fault is confirmed within 14 days from the date you received the parcel. If an incorrect item was dispatched due to warehouse error, Papa Tattoo Supply will ship the correct replacement immediately and reimburse standard return shipping fees.
                  </p>
                </div>

                {/* Quality Standards & Sterilization */}
                <div
                  id="quality"
                  className="p-6 rounded-[22px] bg-[#f5f5f7] dark:bg-[#18181b] space-y-2 scroll-mt-28"
                >
                  <h3 className="font-semibold text-sm text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#86868b]" />
                    <span>316L Stainless Steel &amp; EO Gas</span>
                  </h3>
                  <p className="text-xs text-[#86868b] leading-relaxed">
                    Papa Tattoo cartridge needles are manufactured with Japanese 316L surgical stainless steel pins and sealed with safety rebound membranes. Cartridges are individually packaged with EO Gas sterilization alongside batch-specific lot tracking.
                  </p>
                </div>
              </div>

              {/* Official Factory RMA Repair PDF Form */}
              <div className="p-6 rounded-[22px] bg-[#f5f5f7] dark:bg-[#18181b] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-sm text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#86868b]" />
                    <span>Official Papa Machine Repair Protocol (RMA Form)</span>
                  </div>
                  <div className="text-xs text-[#86868b] mt-1">
                    If your Papa Pen or Rotary apparatus requires factory servicing, print and complete the official RMA intake sheet.
                  </div>
                </div>
                <a
                  href="https://drive.google.com/file/d/1nMPw2A9x_AwQnlFp0yew_2XNbMBKoiEf/view"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-xs font-medium shrink-0 hover:opacity-85 active:scale-[0.98] transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] shadow-xs"
                >
                  <span>Download RMA PDF</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </section>

            {/* Contact Support Footer Card */}
            <div className="p-6 sm:p-8 rounded-[28px] bg-white dark:bg-[#121214] shadow-xs border border-black/[0.04] dark:border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <div className="text-xs font-medium text-[#86868b]">
                  Compliance &amp; Logistics Desk
                </div>
                <h3 className="text-lg sm:text-xl font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-[#f5f5f7]">
                  Questions Regarding Data Privacy, Orders, or RMA?
                </h3>
                <p className="text-xs sm:text-sm text-[#86868b]">
                  Route your inquiry directly to our 24/7 technical support and studio dispatch desk.
                </p>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-xs font-medium shrink-0 hover:opacity-85 active:scale-[0.98] transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] shadow-xs"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact Support</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
