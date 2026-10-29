import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from '@tanstack/react-router'
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
  const location = useLocation()
  const isHome = location.pathname === '/'
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
    <header className="sticky top-0 z-40 w-full border-b border-black/[0.06] dark:border-white/[0.08] apple-glass-chrome transition-colors duration-300">
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4 xl:gap-8">
        {/* Logo & Desktop Nav Menu */}
        <div className="flex items-center gap-6 xl:gap-8 shrink-0">
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
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Mobile Search Toggle (Visible on tablet & mobile) */}
          <button
            onClick={() => {
              setIsMobileSearchOpen(!isMobileSearchOpen)
              setMobileMenuOpen(false)
            }}
            className="lg:hidden p-2 rounded-full text-[#1d1d1f]/80 dark:text-[#f5f5f7]/80 hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-[transform,color,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.95] cursor-pointer"
            aria-label="Search"
            title="Search Entire Store"
          >
            <Search className="w-4.5 h-4.5" />
          </button>

          {/* 1. Language Selector */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => {
                setIsLangOpen(!isLangOpen)
                setIsAccountOpen(false)
              }}
              className="p-2 rounded-full text-[#1d1d1f]/80 dark:text-[#f5f5f7]/80 hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-[transform,color,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.95] cursor-pointer"
              title={`Language: ${locale}`}
              aria-label="Change Language"
            >
              <Globe className="w-4.5 h-4.5" />
            </button>

            {isLangOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-44 rounded-2xl border border-black/[0.06] dark:border-white/[0.1] apple-glass-popover p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 ease-[var(--ease-out-strong)]">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLocale(lang.code)
                      setIsLangOpen(false)
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl text-left transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.98] ${
                      locale === lang.code
                        ? 'bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] font-semibold'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                    }`}
                  >
                    <span>{lang.label}</span>
                    <span className="text-[11px] opacity-70">{lang.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-[#1d1d1f]/80 dark:text-[#f5f5f7]/80 hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-[transform,color,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.95] cursor-pointer"
            aria-label="Toggle Theme"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4.5 h-4.5 text-[#f5f5f7] transition-transform duration-200 ease-[var(--ease-out-strong)]" />
            ) : (
              <Moon className="w-4.5 h-4.5 text-[#1d1d1f] transition-transform duration-200 ease-[var(--ease-out-strong)]" />
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
              className="relative p-2 rounded-full text-[#1d1d1f]/80 dark:text-[#f5f5f7]/80 hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-[transform,color,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.95] cursor-pointer"
              aria-label="Customer Account"
              title={customer ? `Buyer: ${customer.firstName || customer.email}` : 'Buyer Sign In / Create Account'}
            >
              <User className="w-4.5 h-4.5" />
              {customer && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#f5f5f7] dark:ring-black" />
              )}
            </button>

            {/* Account Menu - Only shown when already logged in */}
            {isAccountOpen && customer && (
              <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-2xl border border-black/[0.06] dark:border-white/[0.1] apple-glass-popover p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 ease-[var(--ease-out-strong)] text-xs">
                <div className="p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] mb-1.5">
                  <div className="text-[11px] text-[#86868b] font-medium">
                    Studio Account
                  </div>
                  <div className="text-[#1d1d1f] dark:text-white font-semibold text-sm truncate mt-0.5">
                    {customer.firstName || 'Studio Buyer'}
                  </div>
                  <div className="text-[11px] text-[#86868b] truncate mt-0.5">
                    {customer.email}
                  </div>
                </div>

                <div className="space-y-0.5">
                  <button
                    onClick={() => {
                      navigate({ to: '/account', hash: 'orders' })
                      window.dispatchEvent(new CustomEvent('account-tab-select', { detail: 'orders' }))
                      setIsAccountOpen(false)
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[#1d1d1f] dark:text-zinc-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.98] text-left cursor-pointer"
                  >
                    <span>My Orders</span>
                    <ArrowRight className="w-3 h-3 text-[#86868b]" />
                  </button>

                  <button
                    onClick={() => {
                      navigate({ to: '/account', hash: 'addresses' })
                      window.dispatchEvent(new CustomEvent('account-tab-select', { detail: 'addresses' }))
                      setIsAccountOpen(false)
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[#1d1d1f] dark:text-zinc-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.98] text-left cursor-pointer"
                  >
                    <span>Saved Addresses</span>
                    <ArrowRight className="w-3 h-3 text-[#86868b]" />
                  </button>

                  <button
                    onClick={() => {
                      navigate({ to: '/account', hash: 'profile' })
                      window.dispatchEvent(new CustomEvent('account-tab-select', { detail: 'profile' }))
                      setIsAccountOpen(false)
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[#1d1d1f] dark:text-zinc-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.98] text-left cursor-pointer"
                  >
                    <span>Profile Settings</span>
                    <ArrowRight className="w-3 h-3 text-[#86868b]" />
                  </button>

                  <hr className="border-black/[0.06] dark:border-white/[0.08] my-1" />

                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 font-medium transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.98] cursor-pointer"
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
            className="relative p-2 rounded-full text-[#1d1d1f]/80 dark:text-[#f5f5f7]/80 hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.08] transition-[transform,color,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.95] cursor-pointer"
            aria-label="Open Cart"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-4.5 h-4.5" />
            {totalQuantity > 0 && (
              <span className="absolute top-0.5 right-0.5 flex items-center justify-center min-w-[17px] h-[17px] px-1 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-[10px] font-sans font-bold tabular-nums leading-none">
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
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/[0.04] dark:hover:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7] transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.95]"
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
