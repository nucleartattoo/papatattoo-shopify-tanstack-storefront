import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Logo } from './Logo'
import { useTheme } from '../../context/ThemeContext'
import { useLocale, Locale } from '../../context/LocaleContext'
import { useCart } from '../../context/CartContext'
import { RadixMegaMenu } from '../navigation/RadixMegaMenu'
import { MEGA_MENU_DATA } from '../navigation/MegaMenu'
import { HeaderSearchBar } from './HeaderSearchBar'
import { Sun, Moon, ShoppingBag, Globe, Menu, X, ChevronDown, Sparkles, User, ArrowRight, Award, Mail, Search } from 'lucide-react'
import { CustomerAuthModal } from '../account/CustomerAuthModal'
import { CustomerProfile, logoutCustomer } from '../../lib/shopify'

interface HeaderProps {
  onSelectCategory?: (category: string, searchKeyword?: string, series?: 'premium' | 'standard', sub?: string) => void
}

export const Header: React.FC<HeaderProps> = ({ onSelectCategory }) => {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { locale, setLocale } = useLocale()
  const { totalQuantity, openCart } = useCart()

  const [isLangOpen, setIsLangOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'register'>('signin')
  const accountRef = useRef<HTMLDivElement>(null)
  const langRef = useRef<HTMLDivElement>(null)

  // Auto-close dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setIsAccountOpen(false)
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsAccountOpen(false)
        setIsLangOpen(false)
      }
    }

    if (isAccountOpen || isLangOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [isAccountOpen, isLangOpen])
  const [customer, setCustomer] = useState<CustomerProfile | null>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('shopify_customer_profile')
        return saved ? JSON.parse(saved) : null
      }
      return null
    } catch {
      return null
    }
  })

  useEffect(() => {
    const syncCustomer = () => {
      try {
        const saved = localStorage.getItem('shopify_customer_profile')
        setCustomer(saved ? JSON.parse(saved) : null)
      } catch {
        setCustomer(null)
      }
    }
    window.addEventListener('customer-auth-changed', syncCustomer)
    window.addEventListener('storage', syncCustomer)
    return () => {
      window.removeEventListener('customer-auth-changed', syncCustomer)
      window.removeEventListener('storage', syncCustomer)
    }
  }, [])

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openMobileAccordion, setOpenMobileAccordion] = useState<string | null>(null)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)

  const handleSignOut = () => {
    const token = localStorage.getItem('shopify_customer_token')
    if (token) {
      void logoutCustomer(token)
    }
    localStorage.removeItem('shopify_customer_token')
    localStorage.removeItem('shopify_customer_token_exp')
    localStorage.removeItem('shopify_customer_profile')
    setCustomer(null)
    setIsAccountOpen(false)
    window.dispatchEvent(new Event('customer-auth-changed'))
  }

  const languages: { code: Locale; label: string; flag: string }[] = [
    { code: 'EN', label: 'English (US)', flag: '🇺🇸' },
    { code: 'ES', label: 'Español', flag: '🇪🇸' },
    { code: 'DE', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'FR', label: 'Français', flag: '🇫🇷' },
  ]

  const handleNavClick = (id: string, query?: string, series?: 'premium' | 'standard', sub?: string) => {
    if (onSelectCategory) {
      onSelectCategory(id, query, series, sub)
    }
    navigate({ to: '/collections', search: { category: id, q: query, series, sub } })
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#e2dfd8] dark:border-white/[0.08] apple-glass-chrome transition-colors duration-300">
      {/* Top Announcement Bar */}
      <div className="hidden sm:flex items-center justify-center px-6 py-1.5 bg-[#eceae4]/85 dark:bg-[#111318]/90 border-b border-[#e2dfd8] dark:border-white/[0.05] text-[11px] font-mono tracking-[0.03em] text-[#6b6860] dark:text-zinc-300">
        <span>For Professional Studios &amp; Licensed Tattoo Artists</span>
      </div>

      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-18 flex items-center justify-between gap-4 xl:gap-8">
        {/* Logo & Desktop Nav Menu */}
        <div className="flex items-center gap-4 xl:gap-8 shrink-0">
          <Link to="/" className="cursor-pointer flex items-center transition-transform duration-150 ease-[var(--ease-out-strong)] active:scale-[0.98]" aria-label="Papa Tattoo Supply Home">
            <Logo size="md" showText={false} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center">
            <RadixMegaMenu onSelectCategory={handleNavClick} />
          </nav>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-xs xl:max-w-sm mx-2">
          <HeaderSearchBar />
        </div>

        {/* Right Action Icons: Mobile Search, Language, Theme, Account, Cart */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile Search Toggle (Visible on tablet & mobile) */}
          <button
            onClick={() => {
              setIsMobileSearchOpen(!isMobileSearchOpen)
              setMobileMenuOpen(false)
            }}
            className="lg:hidden p-2 text-zinc-600 dark:text-white/80 hover:text-zinc-950 dark:hover:text-[#38e8c6] transition-[transform,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.95] cursor-pointer"
            aria-label="Search"
            title="Search Entire Store"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* 1. Language Selector */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => {
                setIsLangOpen(!isLangOpen)
                setIsAccountOpen(false)
              }}
              className="p-2 text-zinc-600 dark:text-white/80 hover:text-zinc-950 dark:hover:text-[#38e8c6] transition-[transform,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.95] cursor-pointer"
              title={`Language: ${locale}`}
              aria-label="Change Language"
            >
              <Globe className="w-5.5 h-5.5 sm:w-6 sm:h-6" />
            </button>

            {isLangOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-44 rounded-2xl border border-[#e2dfd8] dark:border-white/[0.1] apple-glass-popover p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 ease-[var(--ease-out-strong)]">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLocale(lang.code)
                      setIsLangOpen(false)
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl text-left transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.98] font-mono ${
                      locale === lang.code
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.06]'
                    }`}
                  >
                    <span>{lang.label}</span>
                    <span className="text-[11px] opacity-80">{lang.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 text-zinc-600 dark:text-white/80 hover:text-zinc-950 dark:hover:text-amber-400 transition-[transform,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.95] cursor-pointer"
            aria-label="Toggle Theme"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-5.5 h-5.5 sm:w-6 sm:h-6 text-amber-400 transition-transform duration-200 ease-[var(--ease-out-strong)] hover:rotate-45" />
            ) : (
              <Moon className="w-5.5 h-5.5 sm:w-6 sm:h-6 text-zinc-700 transition-transform duration-200 ease-[var(--ease-out-strong)] hover:-rotate-12" />
            )}
          </button>

          {/* 3. Customer Account Menu */}
          <div ref={accountRef} className="relative">
            <button
              onClick={() => {
                if (customer) {
                  setIsAccountOpen(!isAccountOpen)
                  setIsLangOpen(false)
                } else {
                  setAuthModalMode('signin')
                  setIsAuthModalOpen(true)
                  setIsAccountOpen(false)
                  setIsLangOpen(false)
                }
              }}
              className="relative p-2 text-zinc-600 dark:text-white/80 hover:text-zinc-950 dark:hover:text-[#38e8c6] transition-[transform,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.95] cursor-pointer"
              aria-label="Customer Account"
              title={customer ? `Buyer: ${customer.firstName || customer.email}` : 'Buyer Sign In / Create Account'}
            >
              <User className="w-5.5 h-5.5 sm:w-6 sm:h-6" />
              {customer && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#38e8c6] ring-2 ring-[#f5f4f0] dark:ring-[#16181f]" />
              )}
            </button>

            {/* Account Menu - Only shown when already logged in */}
            {isAccountOpen && customer && (
              <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-2xl border border-[#e2dfd8] dark:border-white/[0.1] apple-glass-popover p-3 z-50 animate-in fade-in zoom-in-95 duration-150 ease-[var(--ease-out-strong)] text-xs font-mono">
                <div className="p-3 rounded-xl bg-[#f5f4f0] dark:bg-[#22252f] border border-[#e2dfd8] dark:border-white/[0.06] mb-2">
                  <div className="text-[10px] text-[#0d5d50] dark:text-[#38e8c6] font-bold uppercase tracking-wider">
                    Verified Studio Account
                  </div>
                  <div className="text-zinc-950 dark:text-white font-bold text-sm truncate mt-0.5">
                    {customer.firstName || 'Studio Buyer'}
                  </div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                    {customer.email}
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      navigate({ to: '/account', hash: 'orders' })
                      window.dispatchEvent(new CustomEvent('account-tab-select', { detail: 'orders' }))
                      setIsAccountOpen(false)
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-[#f5f4f0] dark:hover:bg-white/[0.06] hover:text-[#0d5d50] dark:hover:text-[#38e8c6] transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.98] text-left cursor-pointer"
                  >
                    <span>My Orders</span>
                    <ArrowRight className="w-3 h-3 text-zinc-400" />
                  </button>

                  <button
                    onClick={() => {
                      navigate({ to: '/account', hash: 'addresses' })
                      window.dispatchEvent(new CustomEvent('account-tab-select', { detail: 'addresses' }))
                      setIsAccountOpen(false)
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-[#f5f4f0] dark:hover:bg-white/[0.06] hover:text-[#0d5d50] dark:hover:text-[#38e8c6] transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.98] text-left cursor-pointer"
                  >
                    <span>Saved Addresses</span>
                    <ArrowRight className="w-3 h-3 text-zinc-400" />
                  </button>

                  <button
                    onClick={() => {
                      navigate({ to: '/account', hash: 'profile' })
                      window.dispatchEvent(new CustomEvent('account-tab-select', { detail: 'profile' }))
                      setIsAccountOpen(false)
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-[#f5f4f0] dark:hover:bg-white/[0.06] hover:text-[#0d5d50] dark:hover:text-[#38e8c6] transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.98] text-left cursor-pointer"
                  >
                    <span>Profile Settings</span>
                    <ArrowRight className="w-3 h-3 text-zinc-400" />
                  </button>

                  <hr className="border-[#e2dfd8] dark:border-white/[0.08] my-1" />

                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 font-bold transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.98] cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 4. Cart Trigger */}
          <button
            onClick={openCart}
            className="relative p-2 text-zinc-700 dark:text-white/90 hover:text-zinc-950 dark:hover:text-[#38e8c6] transition-[transform,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.95] cursor-pointer"
            aria-label="Open Cart"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5.5 h-5.5 sm:w-6 sm:h-6" />
            {totalQuantity > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[19px] h-[19px] px-1 rounded-full bg-[#38e8c6] text-zinc-950 text-[10px] font-mono font-black leading-none shadow-2xs">
                {totalQuantity}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen)
              setIsMobileSearchOpen(false)
            }}
            aria-label={mobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-[#e2dfd8] dark:border-white/[0.09] text-zinc-700 dark:text-zinc-300 transition-[transform,border-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.95]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Expandable Instant Search Bar */}
      {isMobileSearchOpen && (
        <div className="lg:hidden px-4 py-3 border-b border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#0C0E13] shadow-lg animate-in fade-in slide-in-from-top-2">
          <HeaderSearchBar isMobile onCloseMobile={() => setIsMobileSearchOpen(false)} />
        </div>
      )}

      {/* Mobile Menu Dropdown with Complete Categories Accordion */}
      {mobileMenuOpen && (
        <div className="lg:hidden max-h-[80vh] overflow-y-auto border-b border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#0C0E13] px-4 py-4 space-y-3">
          {/* Mobile Drawer Search Bar */}
          <div className="pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <HeaderSearchBar isMobile onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest">
              Categories
            </span>
            <button
              onClick={() => {
                navigate({ to: '/collections', search: { category: 'all' } })
                setMobileMenuOpen(false)
              }}
              className="text-[11px] font-mono font-bold text-[#0d9488] dark:text-[#2ee6ca] hover:underline"
            >
              All Products →
            </button>
          </div>

          {MEGA_MENU_DATA.map(col => {
            const isExpanded = openMobileAccordion === col.id
            return (
              <div key={col.id} className="rounded-lg border border-zinc-200 dark:border-[#1E232E] overflow-hidden">
                <button
                  onClick={() => setOpenMobileAccordion(isExpanded ? null : col.id)}
                  className="w-full flex items-center justify-between p-3 bg-zinc-50 dark:bg-[#12151B] text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase text-zinc-900 dark:text-white">
                      {col.title}
                    </span>
                    {col.badge && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                        {col.badge}
                      </span>
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                {isExpanded && (
                  <div className="p-3 bg-white dark:bg-[#0F1116] space-y-2 border-t border-zinc-100 dark:border-[#1A1D24] text-xs font-mono">
                    <button
                      onClick={() => handleNavClick(col.categoryId)}
                      className="w-full text-left py-1 text-[#0d9488] dark:text-[#2ee6ca] font-bold"
                    >
                      View All in {col.title} →
                    </button>
                    {col.subcategories.map((sub, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (sub.handle) {
                            navigate({ to: '/products/$handle', params: { handle: sub.handle } })
                            setMobileMenuOpen(false)
                          } else {
                            handleNavClick(col.categoryId, sub.query, sub.series, sub.subId)
                          }
                        }}
                        className={`w-full text-left py-1.5 px-2 rounded flex items-center justify-between ${
                          sub.series === 'premium'
                            ? 'text-amber-500 font-bold bg-amber-500/10'
                            : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <span>{sub.label}</span>
                        {sub.series === 'premium' && <Sparkles className="w-3 h-3 text-amber-500" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {/* Mobile Direct Links: Artists & Contact */}
          <div className="pt-2 space-y-1.5 border-t border-zinc-200 dark:border-[#1E232E]">
            <button
              onClick={() => {
                navigate({ to: '/sponsorship-artists' })
                setMobileMenuOpen(false)
              }}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-[#12151B] border border-zinc-200 dark:border-[#1E232E] text-xs font-mono font-bold uppercase text-zinc-900 dark:text-white hover:text-[#0d9488] dark:hover:text-[#2ee6ca]"
            >
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#0d9488] dark:text-[#2ee6ca]" />
                <span>Sponsorship Artists</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            <button
              onClick={() => {
                navigate({ to: '/contact' })
                setMobileMenuOpen(false)
              }}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-[#12151B] border border-zinc-200 dark:border-[#1E232E] text-xs font-mono font-bold uppercase text-zinc-900 dark:text-white hover:text-[#0d9488] dark:hover:text-[#2ee6ca]"
            >
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#0d9488] dark:text-[#2ee6ca]" />
                <span>Contact</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
            </button>
          </div>
        </div>
      )}

      {/* In-App Customer Registration & Sign In Modal */}
      <CustomerAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onAuthSuccess={profile => {
          setCustomer(profile)
          setIsAuthModalOpen(false)
          navigate({ to: '/account' })
        }}
      />
    </header>
  )
}
