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
  Table,
  CheckCircle2,
  Sliders,
  HelpCircle,
} from 'lucide-react'

interface CookieItem {
  name: string
  description: string
}

const COOKIE_LIST: CookieItem[] = [
  { name: 'FORM_KEY', description: 'Stores randomly generated key used to prevent forged requests.' },
  { name: 'PHPSESSID', description: 'Your session ID on the server.' },
  { name: 'GUEST-VIEW', description: 'Allows guests to view and edit their orders.' },
  { name: 'PERSISTENT_SHOPPING_CART', description: 'A link to information about your cart and viewing history, if you have asked for this.' },
  { name: 'STF', description: 'Information on products you have emailed to friends.' },
  { name: 'STORE', description: 'The store view or language you have selected.' },
  { name: 'USER_ALLOWED_SAVE_COOKIE', description: 'Indicates whether a customer allowed to use cookies.' },
  { name: 'MAGE-CACHE-SESSID', description: 'Facilitates caching of content on the browser to make pages load faster.' },
  { name: 'MAGE-CACHE-STORAGE', description: 'Facilitates caching of content on the browser to make pages load faster.' },
  { name: 'MAGE-CACHE-STORAGE-SECTION-INVALIDATION', description: 'Facilitates caching of content on the browser to make pages load faster.' },
  { name: 'MAGE-CACHE-TIMEOUT', description: 'Facilitates caching of content on the browser to make pages load faster.' },
  { name: 'SECTION-DATA-IDS', description: 'Facilitates caching of content on the browser to make pages load faster.' },
  { name: 'PRIVATE_CONTENT_VERSION', description: 'Facilitates caching of content on the browser to make pages load faster.' },
  { name: 'X-MAGENTO-VARY', description: 'Facilitates caching of content on the server to make pages load faster.' },
  { name: 'MAGE-TRANSLATION-FILE-VERSION', description: 'Facilitates translation of content to other languages.' },
  { name: 'MAGE-TRANSLATION-STORAGE', description: 'Facilitates translation of content to other languages.' },
]

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
            PRIVACY AND COOKIE POLICY
          </h1>

          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-mono">
            OFFICIAL PAPA TATTOO SUPPLY COMPLIANCE & LEGAL PROTOCOL · PRIVACY & COOKIE RESTRICTION MODE
          </p>
        </div>
      </section>

      {/* 2. MAIN DOCUMENT CONTENT */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Quick Navigation Anchor Bar */}
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-[#1E232E] bg-zinc-100/70 dark:bg-[#11141B] flex flex-wrap gap-x-4 gap-y-2 text-xs font-mono">
          <a href="#overview" className="text-[#0d9488] dark:text-[#2EE6CA] hover:underline">
            Overview
          </a>
          <span>·</span>
          <a href="#what-we-collect" className="text-[#0d9488] dark:text-[#2EE6CA] hover:underline">
            What We Collect
          </a>
          <span>·</span>
          <a href="#how-we-use" className="text-[#0d9488] dark:text-[#2EE6CA] hover:underline">
            How We Use Info
          </a>
          <span>·</span>
          <a href="#security" className="text-[#0d9488] dark:text-[#2EE6CA] hover:underline">
            Security
          </a>
          <span>·</span>
          <a href="#cookies" className="text-[#0d9488] dark:text-[#2EE6CA] hover:underline">
            How We Use Cookies
          </a>
          <span>·</span>
          <a href="#controlling" className="text-[#0d9488] dark:text-[#2EE6CA] hover:underline">
            Controlling Info
          </a>
          <span>·</span>
          <a href="#cookie-list" className="text-[#0d9488] dark:text-[#2EE6CA] hover:underline font-bold">
            List of Cookies We Collect
          </a>
          <span>·</span>
          <a href="#terms" className="text-[#0d9488] dark:text-[#2EE6CA] hover:underline">
            Terms of Sale & RMA
          </a>
        </div>

        {/* Section 1: Overview */}
        <section id="overview" className="space-y-4 scroll-mt-28">
          <div className="flex items-center gap-2 text-base font-mono font-bold uppercase text-zinc-950 dark:text-white">
            <ShieldCheck className="w-5 h-5 text-[#0d9488] dark:text-[#2EE6CA]" />
            <h2>PRIVACY POLICY OVERVIEW</h2>
          </div>
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-[#1E232E] bg-white dark:bg-[#11141B] space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
            <p>
              This privacy policy sets out how this website (hereafter &quot;the Store&quot;) uses and protects any information that you give the Store while using this website. The Store is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, then you can be assured that it will only be used in accordance with this privacy statement.
            </p>
            <p>
              The Store may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you are happy with any changes.
            </p>
          </div>
        </section>

        {/* Section 2: What We Collect */}
        <section id="what-we-collect" className="space-y-4 scroll-mt-28">
          <div className="flex items-center gap-2 text-base font-mono font-bold uppercase text-zinc-950 dark:text-white">
            <CheckCircle2 className="w-5 h-5 text-[#0d9488] dark:text-[#2EE6CA]" />
            <h2>WHAT WE COLLECT</h2>
          </div>
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-[#1E232E] bg-white dark:bg-[#11141B] space-y-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
            <p>We may collect the following information:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 font-mono text-xs">
              <li>Name</li>
              <li>Contact information including email address</li>
              <li>Demographic information such as postcode, preferences and interests</li>
              <li>Other information relevant to customer surveys and/or offers</li>
            </ul>
            <p className="text-xs pt-1">
              For the exhaustive list of cookies we collect see the{' '}
              <a href="#cookie-list" className="text-[#0d9488] dark:text-[#2EE6CA] font-bold hover:underline">
                List of cookies we collect
              </a>{' '}
              section below.
            </p>
          </div>
        </section>

        {/* Section 3: What We Do with the Information */}
        <section id="how-we-use" className="space-y-4 scroll-mt-28">
          <div className="flex items-center gap-2 text-base font-mono font-bold uppercase text-zinc-950 dark:text-white">
            <Sliders className="w-5 h-5 text-[#0d9488] dark:text-[#2EE6CA]" />
            <h2>WHAT WE DO WITH THE INFORMATION WE GATHER</h2>
          </div>
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-[#1E232E] bg-white dark:bg-[#11141B] space-y-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
            <p>
              We require this information to understand your needs and provide you with a better service, and in particular for the following reasons:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 font-mono text-xs">
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
        <section id="security" className="space-y-4 scroll-mt-28">
          <div className="flex items-center gap-2 text-base font-mono font-bold uppercase text-zinc-950 dark:text-white">
            <Lock className="w-5 h-5 text-[#0d9488] dark:text-[#2EE6CA]" />
            <h2>SECURITY</h2>
          </div>
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-[#1E232E] bg-white dark:bg-[#11141B] space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
            <p>
              We are committed to ensuring that your information is secure. In order to prevent unauthorised access or disclosure, we have put in place suitable physical, electronic and managerial procedures to safeguard and secure the information we collect online.
            </p>
            <p>
              All online payment transactions and sensitive billing tokens are encrypted directly via Level 1 PCI-DSS compliant payment vaults, and are never exposed or retained in raw format on our web servers.
            </p>
          </div>
        </section>

        {/* Section 5: How We Use Cookies */}
        <section id="cookies" className="space-y-4 scroll-mt-28">
          <div className="flex items-center gap-2 text-base font-mono font-bold uppercase text-zinc-950 dark:text-white">
            <Cookie className="w-5 h-5 text-amber-500" />
            <h2>HOW WE USE COOKIES</h2>
          </div>
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-[#1E232E] bg-white dark:bg-[#11141B] space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
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
        <section id="external-links" className="space-y-4 scroll-mt-28">
          <div className="flex items-center gap-2 text-base font-mono font-bold uppercase text-zinc-950 dark:text-white">
            <ExternalLink className="w-5 h-5 text-[#0d9488] dark:text-[#2EE6CA]" />
            <h2>LINKS TO OTHER WEBSITES</h2>
          </div>
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-[#1E232E] bg-white dark:bg-[#11141B] space-y-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
            <p>
              Our website may contain links to other websites of interest. However, once you have used these links to leave our site, you should note that we do not have any control over that other website. Therefore, we cannot be responsible for the protection and privacy of any information which you provide whilst visiting such sites and such sites are not governed by this privacy statement. You should exercise caution and look at the privacy statement applicable to the website in question.
            </p>
          </div>
        </section>

        {/* Section 7: Controlling Your Personal Information */}
        <section id="controlling" className="space-y-4 scroll-mt-28">
          <div className="flex items-center gap-2 text-base font-mono font-bold uppercase text-zinc-950 dark:text-white">
            <HelpCircle className="w-5 h-5 text-[#0d9488] dark:text-[#2EE6CA]" />
            <h2>CONTROLLING YOUR PERSONAL INFORMATION</h2>
          </div>
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-[#1E232E] bg-white dark:bg-[#11141B] space-y-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
            <p>You may choose to restrict the collection or use of your personal information in the following ways:</p>
            <ul className="list-disc list-inside space-y-2 pl-2 font-mono text-xs">
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

        {/* Section 8: List of Cookies We Collect (The Complete Original Table) */}
        <section id="cookie-list" className="space-y-4 scroll-mt-28">
          <div className="flex items-center gap-2 text-base font-mono font-bold uppercase text-zinc-950 dark:text-white">
            <Table className="w-5 h-5 text-[#0d9488] dark:text-[#2EE6CA]" />
            <h2>LIST OF COOKIES WE COLLECT</h2>
          </div>
          <div className="rounded-xl border border-zinc-200 dark:border-[#1E232E] bg-white dark:bg-[#11141B] overflow-hidden shadow-sm">
            <div className="p-6 border-b border-zinc-100 dark:border-[#1E232E] text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              <p>The table below lists the cookies we collect and what information they store.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-zinc-50 dark:bg-[#161922] border-b border-zinc-200 dark:border-[#1E232E] text-zinc-900 dark:text-white uppercase font-bold tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-3.5 w-1/3">
                      Cookie Name
                    </th>
                    <th scope="col" className="px-6 py-3.5">
                      Cookie Description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-white/[0.05]">
                  {COOKIE_LIST.map((item) => (
                    <tr
                      key={item.name}
                      className="hover:bg-zinc-50/70 dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <th
                        scope="row"
                        className="px-6 py-3 text-zinc-950 dark:text-[#2EE6CA] font-bold align-top"
                      >
                        {item.name}
                      </th>
                      <td className="px-6 py-3 text-zinc-600 dark:text-zinc-400 align-top">
                        {item.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 9: Commercial Terms & RMA Protocols */}
        <section id="terms" className="space-y-6 scroll-mt-28 pt-4 border-t border-zinc-200 dark:border-[#1E232E]">
          <div className="flex items-center gap-2 text-base font-mono font-bold uppercase text-zinc-950 dark:text-white">
            <FileCheck2 className="w-5 h-5 text-[#0d9488] dark:text-[#2EE6CA]" />
            <h2>COMMERCIAL SALE TERMS, STERILITY & RMA PROTOCOL</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 14-Day Return Policy */}
            <div className="p-6 rounded-xl border border-zinc-200 dark:border-[#1E232E] bg-white dark:bg-[#11141B] space-y-2">
              <h3 className="font-mono font-bold text-xs uppercase text-zinc-900 dark:text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-emerald-500" />
                <span>14-Day Fault Return Policy</span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                Items can be returned for replacement or full refund if a genuine manufacturing fault is confirmed within 14 days from the date you received the parcel. If an incorrect item or specification was dispatched due to warehouse error, Papa Tattoo Supply will ship the correct replacement immediately and reimburse standard return shipping fees.
              </p>
            </div>

            {/* Quality Standards & Sterilization */}
            <div className="p-6 rounded-xl border border-zinc-200 dark:border-[#1E232E] bg-white dark:bg-[#11141B] space-y-2">
              <h3 className="font-mono font-bold text-xs uppercase text-zinc-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0d9488] dark:text-[#2EE6CA]" />
                <span>316L Stainless Steel & EO Gas</span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                Papa Tattoo cartridge needles are manufactured with Japanese 316L surgical stainless steel pins and sealed with safety rebound membranes. Cartridges are individually packaged with EO Gas sterilization alongside batch-specific lot tracking.
              </p>
            </div>
          </div>

          {/* Official Factory RMA Repair PDF Form */}
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-[#1E232E] bg-white dark:bg-[#11141B] space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="font-mono font-bold text-xs text-zinc-950 dark:text-white uppercase flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#0d9488] dark:text-[#2EE6CA]" />
                  <span>Official Papa Machine Repair Protocol (RMA Form)</span>
                </div>
                <div className="text-[11px] text-zinc-500 font-mono mt-1">
                  If your Papa Pen or Rotary apparatus requires factory servicing, please print and fill out the official RMA form.
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

        {/* Contact Support Footer Card */}
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
