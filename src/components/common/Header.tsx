import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Logo } from './Logo'
import { useTheme } from '../../context/ThemeContext'
import { useLocale, Locale } from '../../context/LocaleContext'
import { useCart } from '../../context/CartContext'
import { RadixMegaMenu } from '../navigation/RadixMegaMenu'
import { MEGA_MENU_DATA } from '../navigation/MegaMenu'
import { HeaderSearchBar } from './HeaderSearchBar'
import { Sun, Moon, ShoppingBag, Globe, Menu, X, ShieldCheck, ChevronDown, Sparkles, User, ArrowRight, Award, Mail, Info, Search } from 'lucide-react'
import { CustomerAuthModal } from '../account/CustomerAuthModal'
import { CustomerProfile } from '../../lib/shopify'

interface HeaderProps {
  onSelectCategory?: (category: string, searchKeyword?: string, series?: 'premium' | 'standard', sub?: string) => void
}

export const Header: React.FC<HeaderProps> = ({ onSelectCategory }) => {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { locale, setLocale, t } = useLocale()
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openMobileAccordion, setOpenMobileAccordion] = useState<string | null>(null)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)

  const handleSignOut = () => {
    localStorage.removeItem('shopify_customer_token')
    localStorage.removeItem('shopify_customer_token_exp')
    localStorage.removeItem('shopify_customer_profile')
    setCustomer(null)
    setIsAccountOpen(false)
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
    <header className="sticky top-0 z-40 w-full border-b border-[#e2dfd8] dark:border-white/[0.08] bg-[#f5f4f0]/90 dark:bg-[#1c1e24]/85 backdrop-blur-xl transition-colors duration-300">
      {/* Top Announcement Bar - Concrete & Raw Paper Accent */}
      <div className="hidden sm:flex items-center justify-center px-6 py-1.5 bg-[#eceae4] dark:bg-[#15171d] border-b border-[#e2dfd8] dark:border-white/[0.05] text-[11px] font-mono text-[#6b6860] dark:text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0d5d50] dark:bg-[#2ee6ca]" />
          <span>For Professionals Only!</span>
        </div>
      </div>

      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-18 flex items-center justify-between gap-4 xl:gap-8">
        {/* Logo & Desktop Nav Menu */}
        <div className="flex items-center gap-4 xl:gap-8 shrink-0">
          <Link to="/" className="cursor-pointer flex items-center" aria-label="Papa Tattoo Supply Home">
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
            className="lg:hidden p-2 text-zinc-600 dark:text-white/80 hover:text-zinc-950 dark:hover:text-[#2ee6ca] transition-colors cursor-pointer"
            aria-label="Search"
            title="Search Entire Store"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* 1. Language Selector (Pure Icon, No Border/Background, Enlarged) */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => {
                setIsLangOpen(!isLangOpen)
                setIsAccountOpen(false)
              }}
              className="p-2 text-zinc-600 dark:text-white/80 hover:text-zinc-950 dark:hover:text-[#2ee6ca] transition-colors cursor-pointer"
              title={`Language: ${locale}`}
              aria-label="Change Language"
            >
              <Globe className="w-5.5 h-5.5 sm:w-6 sm:h-6" />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-xl shadow-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#16181e] p-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLocale(lang.code)
                      setIsLangOpen(false)
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-md text-left transition-colors font-mono ${
                      locale === lang.code
                        ? 'bg-zinc-100 dark:bg-white/[0.1] text-zinc-950 dark:text-[#2ee6ca] font-bold'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/[0.05]'
                    }`}
                  >
                    <span>{lang.label}</span>
                    <span>{lang.flag}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Theme Toggle Button (Pure Icon, No Border/Background, Enlarged) */}
          <button
            onClick={toggleTheme}
            className="p-2 text-zinc-600 dark:text-white/80 hover:text-zinc-950 dark:hover:text-amber-400 transition-colors cursor-pointer"
            aria-label="Toggle Theme"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-5.5 h-5.5 sm:w-6 sm:h-6 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-5.5 h-5.5 sm:w-6 sm:h-6 text-zinc-700 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* 3. Customer Account Menu (Pure Icon, No Border/Background, Enlarged) */}
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
              className="relative p-2 text-zinc-600 dark:text-white/80 hover:text-zinc-950 dark:hover:text-[#2ee6ca] transition-colors cursor-pointer"
              aria-label="Customer Account"
              title={customer ? `Buyer: ${customer.firstName || customer.email}` : 'Buyer Sign In / Create Account'}
            >
              <User className="w-5.5 h-5.5 sm:w-6 sm:h-6" />
              {customer && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2ee6ca] ring-2 ring-white dark:ring-[#16181e]" />
              )}
            </button>

            {/* Account Menu - Only shown when already logged in */}
            {isAccountOpen && customer && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#16181e] p-3 z-50 animate-in fade-in slide-in-from-top-1 text-xs font-mono">
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-[#14171E] border border-zinc-100 dark:border-zinc-800/70 mb-2">
                  <div className="text-[10px] text-[#0d9488] dark:text-[#2ee6ca] font-bold uppercase tracking-wider">
                    REGISTERED BUYER
                  </div>
                  <div className="text-zinc-950 dark:text-white font-bold text-sm truncate mt-0.5">
                    Hello, {customer.firstName || 'Shopper'} 👋
                  </div>
                  <div className="text-[11px] text-zinc-500 truncate mt-0.5">
                    {customer.email}
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      navigate({ to: '/account' })
                      setIsAccountOpen(false)
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#1A1E27] hover:text-[#0d9488] dark:hover:text-[#2ee6ca] transition-colors text-left cursor-pointer"
                  >
                    <span>Customer Dashboard</span>
                    <ArrowRight className="w-3 h-3 text-zinc-400" />
                  </button>

                  <button
                    onClick={() => {
                      navigate({ to: '/account' })
                      setIsAccountOpen(false)
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#1A1E27] hover:text-[#0d9488] dark:hover:text-[#2ee6ca] transition-colors text-left cursor-pointer"
                  >
                    <span>My Orders & Tracking</span>
                    <ArrowRight className="w-3 h-3 text-zinc-400" />
                  </button>

                  <button
                    onClick={() => {
                      navigate({ to: '/account' })
                      setIsAccountOpen(false)
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#1A1E27] hover:text-[#0d9488] dark:hover:text-[#2ee6ca] transition-colors text-left cursor-pointer"
                  >
                    <span>Saved Addresses</span>
                    <ArrowRight className="w-3 h-3 text-zinc-400" />
                  </button>

                  <button
                    onClick={() => {
                      navigate({ to: '/wholesale' })
                      setIsAccountOpen(false)
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-[#0d9488] dark:text-[#2ee6ca] font-bold hover:bg-zinc-100 dark:hover:bg-[#1A1E27] transition-colors text-left cursor-pointer"
                  >
                    <span>Studio Wholesale Portal</span>
                  </button>

                  <hr className="border-zinc-100 dark:border-white/[0.08] my-1" />

                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 font-bold transition-colors cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 4. Cart Trigger (Pure Icon, No Border/Background, Enlarged) */}
          <button
            onClick={openCart}
            className="relative p-2 text-zinc-700 dark:text-white/90 hover:text-zinc-950 dark:hover:text-[#2ee6ca] transition-colors cursor-pointer"
            aria-label="Open Cart"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5.5 h-5.5 sm:w-6 sm:h-6" />
            {totalQuantity > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[19px] h-[19px] px-1 rounded-full bg-[#2ee6ca] text-zinc-950 text-[10px] font-mono font-black leading-none shadow-sm">
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
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-[#222731] text-zinc-700 dark:text-zinc-300"
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
                navigate({ to: '/about' })
                setMobileMenuOpen(false)
              }}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-[#12151B] border border-zinc-200 dark:border-[#1E232E] text-xs font-mono font-bold uppercase text-zinc-900 dark:text-white hover:text-[#0d9488] dark:hover:text-[#2ee6ca]"
            >
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[#0d9488] dark:text-[#2ee6ca]" />
                <span>About Papa Tattoo</span>
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

          <button
            onClick={() => {
              navigate({ to: '/wholesale' })
              setMobileMenuOpen(false)
            }}
            className="w-full py-2.5 rounded-lg bg-zinc-900 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 font-mono font-bold text-xs uppercase text-center mt-2"
          >
            Studio Wholesale Inquiries
          </button>
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
