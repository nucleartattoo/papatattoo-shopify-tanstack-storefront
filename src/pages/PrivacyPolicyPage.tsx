import React, { useMemo, useState } from 'react'
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
    description:
      'A link to information about your cart and viewing history, if you have asked for this.',
  },
  {
    name: 'STF',
    category: 'Cart & Consent',
    description: 'Information on products you have emailed to friends.',
  },
  {
    name: 'STORE',
    category: 'Cart & Consent',
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
    name: 'SECTION-DATA-IDS',
    category: 'Performance Cache',
    description: 'Facilitates caching of content on the browser to make pages load faster.',
  },
  {
    name: 'PRIVATE_CONTENT_VERSION',
    category: 'Performance Cache',
    description: 'Facilitates caching of content on the browser to make pages load faster.',
  },
  {
    name: 'X-MAGENTO-VARY',
    category: 'Performance Cache',
    description: 'Facilitates caching of content on the server to make pages load faster.',
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
  { id: 'overview', code: 'SEC-01', label: 'Privacy Overview' },
  { id: 'what-we-collect', code: 'SEC-02', label: 'What We Collect' },
  { id: 'how-we-use', code: 'SEC-03', label: 'How We Use Info' },
  { id: 'security', code: 'SEC-04', label: 'Data & Payment Security' },
  { id: 'cookies', code: 'SEC-05', label: 'How We Use Cookies' },
  { id: 'external-links', code: 'SEC-06', label: 'External Website Links' },
  { id: 'controlling', code: 'SEC-07', label: 'Controlling Personal Info' },
  { id: 'cookie-list', code: 'SEC-08', label: 'Cookie Registry (16)' },
  { id: 'terms', code: 'SEC-09', label: 'Terms of Sale & RMA' },
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
    <div className="min-h-[100dvh] bg-zinc-50 dark:bg-[#14161b] text-zinc-900 dark:text-zinc-100 font-sans pb-24 transition-colors">
      {/* 1. INDUSTRIAL COMPLIANCE DOSSIER HEADER */}
      <section className="border-b border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400 mb-8"
          >
            <Link to="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              HOME
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-[#0d5d50] dark:text-[#38e8c6] font-bold uppercase">
              PRIVACY, COOKIE & RMA PROTOCOL
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#0d5d50]/25 dark:border-[#38e8c6]/25 bg-[#0d5d50]/8 dark:bg-[#38e8c6]/10 text-[#0d5d50] dark:text-[#38e8c6] text-[11px] font-mono font-bold tracking-widest uppercase">
                <Lock className="w-3.5 h-3.5" />
                <span>DOC-REF: PTS-LEGAL-2026 · COMPLIANCE DISCLOSURES</span>
              </div>

              <h1 className="font-['Montserrat',sans-serif] text-3xl sm:text-5xl font-black uppercase tracking-tight leading-[1.04] text-zinc-950 dark:text-white">
                PRIVACY, COOKIE &amp; RMA POLICY.
              </h1>

              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
                Official Papa Tattoo Supply data protection standards, browser cookie restriction disclosures, EO-gas sterilization commitments, and 14-day factory RMA servicing terms.
              </p>
            </div>

            {/* Right 4-Tile Compliance Spec Matrix */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#14161b]">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  CHECKOUT VAULT
                </div>
                <div className="text-lg font-black font-mono text-zinc-950 dark:text-white mt-1">
                  PCI-DSS L1
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Encrypted billing tokens
                </div>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#14161b]">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  COOKIE REGISTRY
                </div>
                <div className="text-lg font-black font-mono text-[#0d5d50] dark:text-[#38e8c6] mt-1">
                  16 KEYS
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Session, cart &amp; cache
                </div>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#14161b]">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  FAULT RETURN WINDOW
                </div>
                <div className="text-lg font-black font-mono text-zinc-950 dark:text-white mt-1">
                  14 DAYS
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Verified factory defects
                </div>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#14161b]">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  STERILITY PROTOCOL
                </div>
                <div className="text-lg font-black font-mono text-[#0d5d50] dark:text-[#38e8c6] mt-1">
                  316L + EO
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Lot-tracked cartridges
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TWO-COLUMN INTERACTIVE DOSSIER BODY */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Sticky Left Clause Navigation & RMA Bench */}
          <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24 space-y-6">
            <div className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] p-5 shadow-xs">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 pb-3 mb-3 border-b border-zinc-200/80 dark:border-white/[0.08]">
                CLAUSE INDEX // 01–09
              </div>

              <nav aria-label="Policy clauses" className="space-y-1 font-mono text-xs">
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
                      className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                        isActive
                          ? 'bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 font-bold'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#14161b] hover:text-zinc-950 dark:hover:text-white'
                      }`}
                    >
                      <span className="truncate">{sec.label}</span>
                      <span
                        className={`text-[10px] shrink-0 ml-2 ${
                          isActive
                            ? 'text-white/80 dark:text-zinc-950/80'
                            : 'text-zinc-400 dark:text-zinc-500'
                        }`}
                      >
                        {sec.code}
                      </span>
                    </a>
                  )
                })}
              </nav>
            </div>

            {/* Quick Factory RMA Repair Card */}
            <div className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181a20] p-5 space-y-3">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-widest text-[#0d5d50] dark:text-[#38e8c6]">
                <span>FACTORY SERVICE DESK</span>
                <FileText className="w-3.5 h-3.5" />
              </div>
              <div className="font-['Montserrat',sans-serif] text-sm font-black uppercase text-zinc-950 dark:text-white">
                MACHINE RMA FORM (PDF)
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Need servicing for a Papa Pen or Rotary apparatus? Download the official factory RMA intake sheet before shipping.
              </p>
              <a
                href="https://drive.google.com/file/d/1nMPw2A9x_AwQnlFp0yew_2XNbMBKoiEf/view"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 text-xs font-mono font-bold uppercase tracking-wider hover:opacity-95 active:scale-[0.98] transition-all"
              >
                <span>Open RMA Intake PDF</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </aside>

          {/* Right Clause Cards */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-8">
            {/* Section 1: Overview */}
            <section
              id="overview"
              className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] p-6 sm:p-8 space-y-4 scroll-mt-28"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200/80 dark:border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#0d5d50] dark:text-[#38e8c6]" />
                  <h2 className="font-['Montserrat',sans-serif] text-base sm:text-lg font-black uppercase tracking-tight text-zinc-950 dark:text-white">
                    PRIVACY POLICY OVERVIEW
                  </h2>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6]">
                  SEC-01
                </span>
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
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
              className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] p-6 sm:p-8 space-y-4 scroll-mt-28"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200/80 dark:border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#0d5d50] dark:text-[#38e8c6]" />
                  <h2 className="font-['Montserrat',sans-serif] text-base sm:text-lg font-black uppercase tracking-tight text-zinc-950 dark:text-white">
                    WHAT WE COLLECT
                  </h2>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6]">
                  SEC-02
                </span>
              </div>
              <div className="space-y-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                <p>We may collect the following information:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                  <div className="p-3.5 rounded-xl bg-[#f8f7f4] dark:bg-[#14161b] border border-zinc-200/70 dark:border-white/[0.06] text-zinc-800 dark:text-zinc-200">
                    01 · Full Name &amp; Studio Identity
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#f8f7f4] dark:bg-[#14161b] border border-zinc-200/70 dark:border-white/[0.06] text-zinc-800 dark:text-zinc-200">
                    02 · Contact information including email address
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#f8f7f4] dark:bg-[#14161b] border border-zinc-200/70 dark:border-white/[0.06] text-zinc-800 dark:text-zinc-200">
                    03 · Demographic information (postcode, preferences, interests)
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#f8f7f4] dark:bg-[#14161b] border border-zinc-200/70 dark:border-white/[0.06] text-zinc-800 dark:text-zinc-200">
                    04 · Information relevant to customer surveys and/or offers
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
                    className="text-[#0d5d50] dark:text-[#38e8c6] font-mono font-bold hover:underline"
                  >
                    List of cookies we collect (SEC-08)
                  </a>{' '}
                  section below.
                </p>
              </div>
            </section>

            {/* Section 3: What We Do with the Information */}
            <section
              id="how-we-use"
              className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] p-6 sm:p-8 space-y-4 scroll-mt-28"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200/80 dark:border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <Sliders className="w-5 h-5 text-[#0d5d50] dark:text-[#38e8c6]" />
                  <h2 className="font-['Montserrat',sans-serif] text-base sm:text-lg font-black uppercase tracking-tight text-zinc-950 dark:text-white">
                    WHAT WE DO WITH THE INFORMATION WE GATHER
                  </h2>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6]">
                  SEC-03
                </span>
              </div>
              <div className="space-y-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                <p>
                  We require this information to understand your needs and provide you with a better service, and in particular for the following reasons:
                </p>
                <ul className="list-disc list-inside space-y-2 pl-2 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                  <li>Internal record keeping.</li>
                  <li>We may use the information to improve our products and services.</li>
                  <li>
                    We may periodically send promotional emails about new products, special offers or other information which we think you may find interesting using the email address which you have provided.
                  </li>
                  <li>
                    From time to time, we may also use your information to contact you for market research purposes. We may contact you by email, phone, fax or mail. We may use the information to customise the website according to your interests.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 4: Security */}
            <section
              id="security"
              className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] p-6 sm:p-8 space-y-4 scroll-mt-28"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200/80 dark:border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <Lock className="w-5 h-5 text-[#0d5d50] dark:text-[#38e8c6]" />
                  <h2 className="font-['Montserrat',sans-serif] text-base sm:text-lg font-black uppercase tracking-tight text-zinc-950 dark:text-white">
                    SECURITY
                  </h2>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6]">
                  SEC-04
                </span>
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
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
              className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] p-6 sm:p-8 space-y-4 scroll-mt-28"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200/80 dark:border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <Cookie className="w-5 h-5 text-[#0d5d50] dark:text-[#38e8c6]" />
                  <h2 className="font-['Montserrat',sans-serif] text-base sm:text-lg font-black uppercase tracking-tight text-zinc-950 dark:text-white">
                    HOW WE USE COOKIES
                  </h2>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6]">
                  SEC-05
                </span>
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
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
              className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] p-6 sm:p-8 space-y-4 scroll-mt-28"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200/80 dark:border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <ExternalLink className="w-5 h-5 text-[#0d5d50] dark:text-[#38e8c6]" />
                  <h2 className="font-['Montserrat',sans-serif] text-base sm:text-lg font-black uppercase tracking-tight text-zinc-950 dark:text-white">
                    LINKS TO OTHER WEBSITES
                  </h2>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6]">
                  SEC-06
                </span>
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                <p>
                  Our website may contain links to other websites of interest. However, once you have used these links to leave our site, you should note that we do not have any control over that other website. Therefore, we cannot be responsible for the protection and privacy of any information which you provide whilst visiting such sites and such sites are not governed by this privacy statement. You should exercise caution and look at the privacy statement applicable to the website in question.
                </p>
              </div>
            </section>

            {/* Section 7: Controlling Your Personal Information */}
            <section
              id="controlling"
              className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] p-6 sm:p-8 space-y-4 scroll-mt-28"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200/80 dark:border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-5 h-5 text-[#0d5d50] dark:text-[#38e8c6]" />
                  <h2 className="font-['Montserrat',sans-serif] text-base sm:text-lg font-black uppercase tracking-tight text-zinc-950 dark:text-white">
                    CONTROLLING YOUR PERSONAL INFORMATION
                  </h2>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6]">
                  SEC-07
                </span>
              </div>
              <div className="space-y-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                <p>
                  You may choose to restrict the collection or use of your personal information in the following ways:
                </p>
                <ul className="list-disc list-inside space-y-2 pl-2 font-mono text-xs text-zinc-700 dark:text-zinc-300">
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
                  If you believe that any information we are holding on you is incorrect or incomplete, please write to or email us as soon as possible, at the above address. We will promptly correct any information found to be incorrect.
                </p>
              </div>
            </section>

            {/* Section 8: List of Cookies We Collect (Interactive Filterable Registry) */}
            <section
              id="cookie-list"
              className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] overflow-hidden shadow-xs scroll-mt-28"
            >
              <div className="p-6 sm:p-8 border-b border-zinc-200/80 dark:border-white/[0.08] space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Table className="w-5 h-5 text-[#0d5d50] dark:text-[#38e8c6]" />
                    <h2 className="font-['Montserrat',sans-serif] text-base sm:text-lg font-black uppercase tracking-tight text-zinc-950 dark:text-white">
                      LIST OF COOKIES WE COLLECT
                    </h2>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6]">
                    SEC-08
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  The table below lists the cookies we collect and what information they store across session security, persistent cart state, browser cache, and translation storage.
                </p>

                {/* Interactive Filter Controls */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 pt-1">
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
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold uppercase transition-all cursor-pointer active:scale-[0.98] ${
                            isSelected
                              ? 'bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950'
                              : 'bg-[#f8f7f4] dark:bg-[#14161b] text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-white/[0.08] hover:text-zinc-950 dark:hover:text-white'
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
                    <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="cookie-registry-search"
                      type="search"
                      value={cookieQuery}
                      onChange={e => setCookieQuery(e.target.value)}
                      placeholder="Filter cookie key..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-xs font-mono text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#f8f7f4] dark:bg-[#14161b] border-b border-zinc-200/80 dark:border-white/[0.08] text-zinc-900 dark:text-white uppercase font-bold tracking-wider">
                    <tr>
                      <th scope="col" className="px-6 py-3.5 w-1/3">
                        Cookie Name
                      </th>
                      <th scope="col" className="px-4 py-3.5 w-44">
                        Classification
                      </th>
                      <th scope="col" className="px-6 py-3.5">
                        Cookie Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200/70 dark:divide-white/[0.06]">
                    {filteredCookies.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400"
                        >
                          No cookies match &quot;{cookieQuery}&quot;.
                        </td>
                      </tr>
                    ) : (
                      filteredCookies.map((item) => (
                        <tr
                          key={item.name}
                          className="hover:bg-zinc-50/80 dark:hover:bg-white/[0.02] transition-colors"
                        >
                          <th
                            scope="row"
                            className="px-6 py-3.5 text-zinc-950 dark:text-[#38e8c6] font-bold align-top"
                          >
                            {item.name}
                          </th>
                          <td className="px-4 py-3.5 align-top">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-zinc-100 dark:bg-[#14161b] text-zinc-600 dark:text-zinc-300 border border-zinc-200/70 dark:border-white/[0.08]">
                              {item.category}
                            </span>
                          </td>
                          <td className="px-6 py-3.5 text-zinc-600 dark:text-zinc-400 align-top font-sans">
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
              className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] p-6 sm:p-8 space-y-6 scroll-mt-28"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200/80 dark:border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <FileCheck2 className="w-5 h-5 text-[#0d5d50] dark:text-[#38e8c6]" />
                  <h2 className="font-['Montserrat',sans-serif] text-base sm:text-lg font-black uppercase tracking-tight text-zinc-950 dark:text-white">
                    COMMERCIAL SALE TERMS, STERILITY &amp; RMA PROTOCOL
                  </h2>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6]">
                  SEC-09
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 14-Day Return Policy */}
                <div className="p-5 rounded-xl border border-zinc-200/80 dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#14161b] space-y-2">
                  <h3 className="font-mono font-bold text-xs uppercase text-zinc-900 dark:text-white flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[#0d5d50] dark:text-[#38e8c6]" />
                    <span>14-Day Fault Return Policy</span>
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                    Items can be returned for replacement or full refund if a genuine manufacturing fault is confirmed within 14 days from the date you received the parcel. If an incorrect item or specification was dispatched due to warehouse error, Papa Tattoo Supply will ship the correct replacement immediately and reimburse standard return shipping fees.
                  </p>
                </div>

                {/* Quality Standards & Sterilization */}
                <div className="p-5 rounded-xl border border-zinc-200/80 dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#14161b] space-y-2">
                  <h3 className="font-mono font-bold text-xs uppercase text-zinc-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#0d5d50] dark:text-[#38e8c6]" />
                    <span>316L Stainless Steel &amp; EO Gas</span>
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                    Papa Tattoo cartridge needles are manufactured with Japanese 316L surgical stainless steel pins and sealed with safety rebound membranes. Cartridges are individually packaged with EO Gas sterilization alongside batch-specific lot tracking.
                  </p>
                </div>
              </div>

              {/* Official Factory RMA Repair PDF Form */}
              <div className="p-5 rounded-xl border border-zinc-200/80 dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#14161b] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="font-mono font-bold text-xs text-zinc-950 dark:text-white uppercase flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#0d5d50] dark:text-[#38e8c6]" />
                    <span>Official Papa Machine Repair Protocol (RMA Form)</span>
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    If your Papa Pen or Rotary apparatus requires factory servicing, print and complete the official RMA intake sheet.
                  </div>
                </div>
                <a
                  href="https://drive.google.com/file/d/1nMPw2A9x_AwQnlFp0yew_2XNbMBKoiEf/view"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 text-xs font-mono font-bold uppercase tracking-wider shrink-0 hover:opacity-95 active:scale-[0.98] transition-all"
                >
                  <span>Download RMA PDF</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </section>

            {/* Contact Support Footer Card */}
            <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181a20] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0d5d50] dark:text-[#38e8c6]">
                  COMPLIANCE &amp; LOGISTICS DESK
                </div>
                <h3 className="font-['Montserrat',sans-serif] text-base font-black uppercase text-zinc-950 dark:text-white">
                  Questions Regarding Data Privacy, Orders, or RMA?
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Route your inquiry directly to our 24/7 technical support and studio dispatch desk.
                </p>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 text-xs font-mono font-bold uppercase tracking-wider shrink-0 hover:opacity-95 active:scale-[0.98] transition-all"
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
