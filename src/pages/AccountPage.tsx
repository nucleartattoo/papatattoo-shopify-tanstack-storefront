import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useDialogAccessibility } from '../hooks/useDialogAccessibility'
import {
  getCustomerProfile,
  loginCustomer,
  registerCustomer,
  recoverCustomerPassword,
  createCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
  setDefaultCustomerAddress,
  updateCustomerProfile,
  logoutCustomer,
  CustomerProfile,
  CustomerAddress,
  CustomerOrder,
} from '../lib/shopify'
import {
  User,
  Package,
  MapPin,
  Shield,
  LogOut,
  ChevronRight,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShoppingBag,
  Lock,
  Mail,
  Truck,
  Box,
  Eye,
  EyeOff,
  FileText,
  ShieldCheck,
} from 'lucide-react'

const PORTAL_CAPABILITIES = [
  {
    code: 'ORD-01',
    title: 'Live Air-Freight & Order Telemetry',
    description:
      'Synchronize directly with Shopify fulfillment records for DHL/FedEx waybills, customs invoices, and line-item configurations.',
    icon: Truck,
  },
  {
    code: 'ADR-02',
    title: 'Multi-Studio Delivery Registry',
    description:
      'Store primary studio, convention booth, and guest-spot shipping addresses for rapid checkout dispatch.',
    icon: MapPin,
  },
  {
    code: 'RMA-03',
    title: 'Warranty & Batch Traceability',
    description:
      'Keep machine serial purchases and EO-sterilized needle cartridge batch records linked under one verified buyer ID.',
    icon: ShieldCheck,
  },
] as const

export const AccountPage: React.FC = () => {
  const navigate = useNavigate()

  // Authentication & Profile States
  const [token, setToken] = useState<string | null>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('shopify_customer_token') : null
  })
  const [customer, setCustomer] = useState<CustomerProfile | null>(() => {
    try {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('shopify_customer_profile')
        return cached ? JSON.parse(cached) : null
      }
      return null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'addresses' | 'profile'>('overview')

  // Auth Form States (when not logged in)
  const [authMode, setAuthMode] = useState<'signin' | 'register' | 'forgot'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [authSuccess, setAuthSuccess] = useState<string | null>(null)

  // Address Modal & Form States
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [pendingDeleteAddressId, setPendingDeleteAddressId] = useState<string | null>(null)
  const addressDialogRef = useRef<HTMLDivElement>(null)
  const addressFirstInputRef = useRef<HTMLInputElement>(null)
  const closeAddressModal = useCallback(() => setIsAddressModalOpen(false), [])

  useDialogAccessibility({
    isOpen: isAddressModalOpen,
    onClose: closeAddressModal,
    dialogRef: addressDialogRef,
    initialFocusRef: addressFirstInputRef,
  })
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(null)
  const [addressForm, setAddressForm] = useState({
    firstName: '',
    lastName: '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    province: '',
    zip: '',
    country: 'United States',
    phone: '',
  })
  const [addressLoading, setAddressLoading] = useState(false)
  const [addressError, setAddressError] = useState<string | null>(null)
  const [addressSuccess, setAddressSuccess] = useState<string | null>(null)

  // Profile Edit Form States
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  })
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)

  // Fetch customer profile when token is available
  useEffect(() => {
    async function loadCustomer() {
      if (!token) {
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const profile = await getCustomerProfile(token)
        if (profile) {
          setCustomer(profile)
          setProfileForm({
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            phone: profile.phone || '',
          })
          localStorage.setItem('shopify_customer_profile', JSON.stringify(profile))
        } else {
          // A null profile means the token is missing or rejected. Do not
          // restore cached orders, addresses, phone, or tracking data.
          localStorage.removeItem('shopify_customer_token')
          localStorage.removeItem('shopify_customer_token_exp')
          localStorage.removeItem('shopify_customer_profile')
          setToken(null)
          setCustomer(null)
        }
      } catch (err) {
        console.error('Error fetching customer profile:', err)
      } finally {
        setLoading(false)
      }
    }

    loadCustomer()
  }, [token])

  // Sign In Handler
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError(null)
    setAuthSuccess(null)

    try {
      const tokenObj = await loginCustomer(email.trim(), password)
      localStorage.setItem('shopify_customer_token', tokenObj.accessToken)
      localStorage.setItem('shopify_customer_token_exp', tokenObj.expiresAt)
      setToken(tokenObj.accessToken)

      const profile = await getCustomerProfile(tokenObj.accessToken)
      if (profile) {
        setCustomer(profile)
        localStorage.setItem('shopify_customer_profile', JSON.stringify(profile))
      }
      setAuthSuccess('Sign in successful. Loading your studio account...')
    } catch (err: any) {
      const msg = err?.message || ''
      if (
        msg.toLowerCase().includes('unidentified') ||
        msg.toLowerCase().includes('credential') ||
        msg.toLowerCase().includes('password')
      ) {
        setAuthError(
          'Invalid email or password. If you registered on our previous website, switch to "Reset Password" to activate your migrated Shopify account.'
        )
      } else {
        setAuthError(msg || 'Invalid email or password.')
      }
    } finally {
      setAuthLoading(false)
    }
  }

  // Register Handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError(null)
    setAuthSuccess(null)

    try {
      await registerCustomer(firstName.trim(), lastName.trim(), email.trim(), password)
      setAuthSuccess('Account created. Signing you in...')
      const tokenObj = await loginCustomer(email.trim(), password)
      localStorage.setItem('shopify_customer_token', tokenObj.accessToken)
      localStorage.setItem('shopify_customer_token_exp', tokenObj.expiresAt)
      setToken(tokenObj.accessToken)
      const profile = await getCustomerProfile(tokenObj.accessToken)
      if (profile) {
        setCustomer(profile)
        localStorage.setItem('shopify_customer_profile', JSON.stringify(profile))
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Failed to create account. Please check your information.')
    } finally {
      setAuthLoading(false)
    }
  }

  // Password Recovery Handler
  const handleRecoverPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError(null)
    setAuthSuccess(null)

    try {
      await recoverCustomerPassword(email.trim())
      setAuthSuccess('Password recovery link sent. Check your email inbox.')
    } catch {
      setAuthError('Failed to send recovery email. Please verify your email address.')
    } finally {
      setAuthLoading(false)
    }
  }

  // Sign Out Handler
  const handleSignOut = async () => {
    if (token) {
      await logoutCustomer(token)
    }
    localStorage.removeItem('shopify_customer_token')
    localStorage.removeItem('shopify_customer_token_exp')
    localStorage.removeItem('shopify_customer_profile')
    setToken(null)
    setCustomer(null)
    navigate({ to: '/' })
  }

  // Address Modal Open/Close
  const openNewAddressModal = () => {
    setEditingAddress(null)
    setAddressForm({
      firstName: customer?.firstName || '',
      lastName: customer?.lastName || '',
      company: '',
      address1: '',
      address2: '',
      city: '',
      province: '',
      zip: '',
      country: 'United States',
      phone: customer?.phone || '',
    })
    setAddressError(null)
    setAddressSuccess(null)
    setIsAddressModalOpen(true)
  }

  const openEditAddressModal = (addr: CustomerAddress) => {
    setEditingAddress(addr)
    setAddressForm({
      firstName: addr.firstName || '',
      lastName: addr.lastName || '',
      company: addr.company || '',
      address1: addr.address1 || '',
      address2: addr.address2 || '',
      city: addr.city || '',
      province: addr.province || '',
      zip: addr.zip || '',
      country: addr.country || 'United States',
      phone: addr.phone || '',
    })
    setAddressError(null)
    setAddressSuccess(null)
    setIsAddressModalOpen(true)
  }

  // Save Address Handler (Create or Update)
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    setAddressLoading(true)
    setAddressError(null)
    setAddressSuccess(null)

    try {
      if (editingAddress) {
        await updateCustomerAddress(token, editingAddress.id, addressForm)
        setAddressSuccess('Address updated.')
      } else {
        await createCustomerAddress(token, addressForm)
        setAddressSuccess('New address saved.')
      }

      const updated = await getCustomerProfile(token)
      if (updated) {
        setCustomer(updated)
        localStorage.setItem('shopify_customer_profile', JSON.stringify(updated))
      }
      setTimeout(() => setIsAddressModalOpen(false), 700)
    } catch (err: any) {
      setAddressError(err?.message || 'Failed to save address. Please verify all required fields.')
    } finally {
      setAddressLoading(false)
    }
  }

  // Delete Address Handler
  const handleDeleteAddress = async (addressId: string) => {
    if (!token) return

    try {
      await deleteCustomerAddress(token, addressId)
      setPendingDeleteAddressId(null)
      const updated = await getCustomerProfile(token)
      if (updated) {
        setCustomer(updated)
        localStorage.setItem('shopify_customer_profile', JSON.stringify(updated))
      }
    } catch (err: any) {
      setAddressError(err?.message || 'Could not delete address.')
    }
  }

  // Set Default Address Handler
  const handleSetDefaultAddress = async (addressId: string) => {
    if (!token) return
    try {
      await setDefaultCustomerAddress(token, addressId)
      const updated = await getCustomerProfile(token)
      if (updated) {
        setCustomer(updated)
        localStorage.setItem('shopify_customer_profile', JSON.stringify(updated))
      }
    } catch (err: any) {
      setAddressError(err?.message || 'Could not update default address.')
    }
  }

  // Update Profile & Password Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    setProfileLoading(true)
    setProfileError(null)
    setProfileSuccess(null)

    if (newPassword && newPassword !== confirmPassword) {
      setProfileError('Passwords do not match.')
      setProfileLoading(false)
      return
    }

    try {
      const updateData: {
        firstName: string
        lastName: string
        phone?: string
        password?: string
      } = {
        firstName: profileForm.firstName.trim(),
        lastName: profileForm.lastName.trim(),
      }
      if (profileForm.phone.trim()) {
        updateData.phone = profileForm.phone.trim()
      }
      if (newPassword) {
        updateData.password = newPassword
      }

      const presentedToken = token
      const res = await updateCustomerProfile(presentedToken, updateData)
      const nextToken = res.newToken || presentedToken
      if (res.newToken) {
        setToken(res.newToken)
        localStorage.setItem('shopify_customer_token', res.newToken)
        if (updateData.password) {
          await logoutCustomer(presentedToken)
        }
      }
      const updated = await getCustomerProfile(nextToken)
      if (updated) {
        setCustomer(updated)
        localStorage.setItem('shopify_customer_profile', JSON.stringify(updated))
      }

      setProfileSuccess('Profile credentials updated.')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setProfileError(err?.message || 'Failed to update profile.')
    } finally {
      setProfileLoading(false)
    }
  }

  const orders: CustomerOrder[] = customer?.orders?.edges?.map(e => e.node) || []
  const addresses: CustomerAddress[] = customer?.addresses?.edges?.map(e => e.node) || []
  const defaultAddressId = customer?.defaultAddress?.id
  const customerTags = customer?.tags || []

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-zinc-50 dark:bg-[#14161b] flex flex-col items-center justify-center py-24 text-zinc-900 dark:text-white">
        <Loader2 className="w-7 h-7 text-[#0d5d50] dark:text-[#38e8c6] animate-spin mb-3.5" />
        <span className="font-mono text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          SYNCHRONIZING SHOPIFY BUYER SESSION...
        </span>
      </div>
    )
  }

  // 2. Unauthenticated State: Asymmetric Swiss Industrial Buyer Console
  if (!customer) {
    return (
      <div className="min-h-[100dvh] bg-zinc-50 dark:bg-[#14161b] py-10 sm:py-16 text-zinc-900 dark:text-zinc-100 transition-colors">
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
              BUYER ACCOUNT CONSOLE
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Studio Account Dossier & Capabilities */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#0d5d50]/25 dark:border-[#38e8c6]/25 bg-[#0d5d50]/8 dark:bg-[#38e8c6]/10 text-[#0d5d50] dark:text-[#38e8c6] text-[11px] font-mono font-bold uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0d5d50] dark:bg-[#38e8c6]" />
                  <span>SHOPIFY STOREFRONT API · DIRECT STUDIO PORTAL</span>
                </div>

                <h1 className="font-['Montserrat',sans-serif] text-3xl sm:text-5xl font-black uppercase tracking-tight leading-[1.04] text-zinc-950 dark:text-white">
                  ARTIST & STUDIO ACCOUNT CONSOLE.
                </h1>

                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed font-sans">
                  Manage verified studio shipping destinations, inspect live DHL/FedEx air-freight tracking numbers, and review historical needle cartridge and rotary machine orders.
                </p>
              </div>

              {/* 3-Tile Capability Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {PORTAL_CAPABILITIES.map(item => {
                  const IconComponent = item.icon
                  return (
                    <div
                      key={item.code}
                      className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] p-5 flex flex-col justify-between space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0d5d50] dark:text-[#38e8c6]">
                          {item.code}
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-[#f8f7f4] dark:bg-[#181a20] border border-zinc-200/70 dark:border-white/[0.06] flex items-center justify-center text-zinc-700 dark:text-zinc-300">
                          <IconComponent className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <h2 className="text-xs font-bold uppercase tracking-tight text-zinc-950 dark:text-white font-sans">
                          {item.title}
                        </h2>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Legacy Account Migration & B2B Strip */}
              <div className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181a20] p-5 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200/80 dark:border-white/[0.08]">
                  <div>
                    <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0d5d50] dark:text-[#38e8c6]">
                      MIGRATED ACCOUNT PROTOCOL
                    </div>
                    <h2 className="text-sm font-bold uppercase text-zinc-950 dark:text-white mt-0.5">
                      Registered on our previous website?
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('forgot')
                      setAuthError(null)
                      setAuthSuccess(null)
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-zinc-300 dark:border-white/[0.12] bg-white dark:bg-[#1c1e24] text-xs font-mono font-bold uppercase text-zinc-900 dark:text-white hover:border-[#0d5d50] dark:hover:border-[#38e8c6] active:scale-[0.98] transition-all cursor-pointer shrink-0"
                  >
                    <span>Activate via Password Reset</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Existing customer emails from the legacy Papa Tattoo storefront have been migrated to our encrypted Shopify vault. Request a one-time password reset link using your original email address to restore access.
                </p>

                <div className="pt-1 flex flex-wrap items-center gap-4 text-xs font-mono">
                  <Link
                    to="/collections"
                    className="inline-flex items-center gap-1.5 font-bold text-[#0d5d50] dark:text-[#38e8c6] hover:underline"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Browse Hardware Catalog</span>
                  </Link>
                  <Link
                    to="/distributors"
                    className="inline-flex items-center gap-1.5 font-bold text-zinc-700 dark:text-zinc-300 hover:text-[#0d5d50] dark:hover:text-[#38e8c6] transition-colors"
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>Authorized Regional Depots</span>
                  </Link>
                  <Link
                    to="/privacy-policy"
                    className="inline-flex items-center gap-1.5 font-bold text-zinc-700 dark:text-zinc-300 hover:text-[#0d5d50] dark:hover:text-[#38e8c6] transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>RMA & Privacy Protocol</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Authentication Terminal */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] p-6 sm:p-8 shadow-sm">
                {/* Terminal Header */}
                <div className="pb-5 border-b border-zinc-200/80 dark:border-white/[0.08]">
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mb-1.5">
                    <span>AUTH-GATEWAY // TLS 1.3</span>
                    <span className="text-[#0d5d50] dark:text-[#38e8c6] font-bold">ONLINE</span>
                  </div>
                  <h2 className="font-['Montserrat',sans-serif] text-xl sm:text-2xl font-black uppercase tracking-tight text-zinc-950 dark:text-white">
                    {authMode === 'signin' && 'Buyer Sign In'}
                    {authMode === 'register' && 'Create Studio Account'}
                    {authMode === 'forgot' && 'Recover Password'}
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    {authMode === 'signin' &&
                      'Enter your registered email and password to open your buyer dashboard.'}
                    {authMode === 'register' &&
                      'Register a direct buyer profile for instant order tracking and studio address storage.'}
                    {authMode === 'forgot' &&
                      'Receive an official Shopify password recovery link in your email inbox.'}
                  </p>
                </div>

                {/* Mode Switcher Tabs */}
                <div
                  role="tablist"
                  aria-label="Authentication mode"
                  className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-zinc-100 dark:bg-[#14161b] border border-zinc-200/70 dark:border-white/[0.06] my-6 font-mono text-xs"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={authMode === 'signin'}
                    onClick={() => {
                      setAuthMode('signin')
                      setAuthError(null)
                      setAuthSuccess(null)
                    }}
                    className={`py-2 rounded-lg font-bold uppercase tracking-wider text-center transition-all cursor-pointer active:scale-[0.98] ${
                      authMode === 'signin'
                        ? 'bg-white dark:bg-[#1c1e24] text-zinc-950 dark:text-[#38e8c6] shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={authMode === 'register'}
                    onClick={() => {
                      setAuthMode('register')
                      setAuthError(null)
                      setAuthSuccess(null)
                    }}
                    className={`py-2 rounded-lg font-bold uppercase tracking-wider text-center transition-all cursor-pointer active:scale-[0.98] ${
                      authMode === 'register'
                        ? 'bg-white dark:bg-[#1c1e24] text-zinc-950 dark:text-[#38e8c6] shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    Register
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={authMode === 'forgot'}
                    onClick={() => {
                      setAuthMode('forgot')
                      setAuthError(null)
                      setAuthSuccess(null)
                    }}
                    className={`py-2 rounded-lg font-bold uppercase tracking-wider text-center transition-all cursor-pointer active:scale-[0.98] ${
                      authMode === 'forgot'
                        ? 'bg-white dark:bg-[#1c1e24] text-zinc-950 dark:text-[#38e8c6] shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    Recover
                  </button>
                </div>

                {/* Error / Success Alerts */}
                {authError && (
                  <div
                    role="alert"
                    className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-start gap-2.5"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{authError}</span>
                  </div>
                )}
                {authSuccess && (
                  <div
                    role="status"
                    className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{authSuccess}</span>
                  </div>
                )}

                {/* SIGN IN FORM */}
                {authMode === 'signin' && (
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                      <label
                        htmlFor="account-signin-email"
                        className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                        <input
                          id="account-signin-email"
                          type="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="artist@studio.com"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-sm text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6] font-mono transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label
                          htmlFor="account-signin-password"
                          className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400"
                        >
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode('forgot')
                            setAuthError(null)
                            setAuthSuccess(null)
                          }}
                          className="text-[11px] font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6] hover:underline cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                        <input
                          id="account-signin-password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          required
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-sm text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6] font-mono transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(prev => !prev)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1 cursor-pointer"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full mt-2 py-3 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 font-mono text-xs font-bold uppercase tracking-wider hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {authLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                      <span>Sign In To Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {/* REGISTER FORM */}
                {authMode === 'register' && (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="account-register-first-name"
                          className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5"
                        >
                          First Name
                        </label>
                        <input
                          id="account-register-first-name"
                          type="text"
                          autoComplete="given-name"
                          required
                          value={firstName}
                          onChange={e => setFirstName(e.target.value)}
                          placeholder="Alex"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-sm text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6] font-mono transition-colors"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="account-register-last-name"
                          className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5"
                        >
                          Last Name
                        </label>
                        <input
                          id="account-register-last-name"
                          type="text"
                          autoComplete="family-name"
                          required
                          value={lastName}
                          onChange={e => setLastName(e.target.value)}
                          placeholder="Rider"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-sm text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6] font-mono transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="account-register-email"
                        className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                        <input
                          id="account-register-email"
                          type="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="artist@studio.com"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-sm text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6] font-mono transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="account-register-password"
                        className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5"
                      >
                        Password (Min 8 Characters)
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                        <input
                          id="account-register-password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          required
                          minLength={8}
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-sm text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6] font-mono transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(prev => !prev)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1 cursor-pointer"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full mt-2 py-3 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 font-mono text-xs font-bold uppercase tracking-wider hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {authLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                      <span>Create Studio Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {/* FORGOT PASSWORD FORM */}
                {authMode === 'forgot' && (
                  <form onSubmit={handleRecoverPassword} className="space-y-4">
                    <div>
                      <label
                        htmlFor="account-recover-email"
                        className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5"
                      >
                        Registered Account Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                        <input
                          id="account-recover-email"
                          type="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="artist@studio.com"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-sm text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6] font-mono transition-colors"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full mt-2 py-3 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 font-mono text-xs font-bold uppercase tracking-wider hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {authLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                      <span>Send Recovery Link</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('signin')
                          setAuthError(null)
                          setAuthSuccess(null)
                        }}
                        className="text-xs font-mono text-zinc-500 hover:text-zinc-950 dark:hover:text-white cursor-pointer"
                      >
                        ← Back to Sign In
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 3. Authenticated State: Full Studio Buyer Dashboard
  return (
    <div className="min-h-[100dvh] bg-zinc-50 dark:bg-[#14161b] py-8 sm:py-12 text-zinc-900 dark:text-zinc-100 relative transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Quick Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-zinc-200/80 dark:border-white/[0.08]">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400"
          >
            <Link to="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              HOME
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-[#0d5d50] dark:text-[#38e8c6] font-bold uppercase">
              BUYER DASHBOARD
            </span>
          </nav>

          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/25 bg-red-500/5 text-xs font-mono font-bold text-red-600 dark:text-red-400 hover:bg-red-500/10 active:scale-[0.98] uppercase tracking-wider transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar: Navigation & Identity Terminal */}
          <div className="lg:col-span-3 space-y-6">
            <div className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] p-5 shadow-xs">
              {/* Buyer Avatar & Identifier */}
              <div className="flex items-center gap-3 pb-4 border-b border-zinc-200/80 dark:border-white/[0.08]">
                <div className="w-12 h-12 rounded-xl bg-[#f8f7f4] dark:bg-[#14161b] border border-[#0d5d50]/30 dark:border-[#38e8c6]/40 flex items-center justify-center text-[#0d5d50] dark:text-[#38e8c6] font-mono text-lg font-black shrink-0">
                  {customer.firstName?.[0] || customer.email[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-sm text-zinc-950 dark:text-white truncate">
                    {customer.firstName} {customer.lastName}
                  </div>
                  <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 truncate">
                    {customer.email}
                  </div>
                </div>
              </div>

              {/* Customer Tags if present in Shopify */}
              {customerTags.length > 0 && (
                <div className="pt-3 pb-2 flex flex-wrap gap-1.5">
                  {customerTags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-zinc-100 dark:bg-[#14161b] text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-white/[0.08]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Navigation Menu */}
              <nav aria-label="Account sections" className="mt-4 space-y-1 font-mono text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer active:scale-[0.98] ${
                    activeTab === 'overview'
                      ? 'bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#14161b]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4" />
                    <span>Overview</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-70" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer active:scale-[0.98] ${
                    activeTab === 'orders'
                      ? 'bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#14161b]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Package className="w-4 h-4" />
                    <span>Orders & Tracking</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] ${
                      activeTab === 'orders'
                        ? 'bg-white/20 text-white dark:bg-zinc-950/20 dark:text-zinc-950'
                        : 'bg-zinc-200 dark:bg-[#14161b] text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {orders.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer active:scale-[0.98] ${
                    activeTab === 'addresses'
                      ? 'bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#14161b]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4" />
                    <span>Saved Addresses</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] ${
                      activeTab === 'addresses'
                        ? 'bg-white/20 text-white dark:bg-zinc-950/20 dark:text-zinc-950'
                        : 'bg-zinc-200 dark:bg-[#14161b] text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {addresses.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer active:scale-[0.98] ${
                    activeTab === 'profile'
                      ? 'bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#14161b]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-4 h-4" />
                    <span>Security & Profile</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-70" />
                </button>
              </nav>
            </div>

            {/* Wholesale Allocation Quick Link */}
            <div className="p-5 rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-[#f8f7f4] dark:bg-[#181a20] space-y-2">
              <div className="text-[11px] font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6] uppercase tracking-wider">
                COMMERCIAL ACCESS
              </div>
              <div className="text-sm font-black uppercase text-zinc-950 dark:text-white font-['Montserrat',sans-serif]">
                STUDIO INVOICING & BULK
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans">
                Direct batch orders, regional distributor accounts, and custom invoice terms.
              </p>
              <Link
                to="/distributors"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6] hover:underline pt-1"
              >
                <span>Authorized Distributors</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Main Content Panel */}
          <div className="lg:col-span-9">
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Metric Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] p-5">
                    <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 font-mono text-[11px] uppercase">
                      <span>Total Orders</span>
                      <Package className="w-4 h-4 text-[#0d5d50] dark:text-[#38e8c6]" />
                    </div>
                    <div className="text-3xl font-black font-mono text-zinc-950 dark:text-white mt-2">
                      {orders.length}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      Synchronized via Shopify
                    </div>
                  </div>

                  <div className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] p-5">
                    <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 font-mono text-[11px] uppercase">
                      <span>Default Destination</span>
                      <MapPin className="w-4 h-4 text-[#0d5d50] dark:text-[#38e8c6]" />
                    </div>
                    <div className="text-base font-bold font-sans text-zinc-950 dark:text-white mt-2 truncate">
                      {customer.defaultAddress?.city
                        ? `${customer.defaultAddress.city}, ${customer.defaultAddress.country}`
                        : 'No Default Set'}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      {addresses.length} saved studio addresses
                    </div>
                  </div>

                  <div className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] p-5">
                    <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 font-mono text-[11px] uppercase">
                      <span>Saved Addresses</span>
                      <MapPin className="w-4 h-4 text-[#0d5d50] dark:text-[#38e8c6]" />
                    </div>
                    <div className="text-3xl font-black font-mono text-zinc-950 dark:text-white mt-2">
                      {addresses.length}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      Verified shipping locations
                    </div>
                  </div>
                </div>

                {/* Recent Orders Showcase */}
                <div className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] p-6 shadow-xs">
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-200/80 dark:border-white/[0.08]">
                    <h2 className="font-['Montserrat',sans-serif] font-black text-base uppercase tracking-tight text-zinc-950 dark:text-white">
                      Recent Orders
                    </h2>
                    <button
                      type="button"
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6] hover:underline cursor-pointer"
                    >
                      View All ({orders.length})
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-12 space-y-3">
                      <ShoppingBag className="w-8 h-8 text-zinc-400 mx-auto" />
                      <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                        No orders recorded yet
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                        Explore our EO-sterilized needle cartridges and CNC machined rotary apparatus to place your first studio order.
                      </p>
                      <Link
                        to="/collections"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 font-mono text-xs font-bold uppercase tracking-wider mt-2 active:scale-[0.98] transition-all"
                      >
                        <span>Browse Catalog</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-zinc-200/70 dark:divide-white/[0.06]">
                      {orders.slice(0, 3).map(order => (
                        <div key={order.id} className="py-4 flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2.5">
                              <span className="font-mono font-bold text-sm text-zinc-950 dark:text-white">
                                {order.name}
                              </span>
                              <span
                                className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                                  order.fulfillmentStatus === 'FULFILLED'
                                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                                    : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                                }`}
                              >
                                {order.fulfillmentStatus || 'UNFULFILLED'}
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-[#14161b] text-zinc-600 dark:text-zinc-400">
                                {order.financialStatus}
                              </span>
                            </div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-mono">
                              {new Date(order.processedAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="font-mono font-extrabold text-sm text-zinc-950 dark:text-[#38e8c6]">
                              ${parseFloat(order.totalPrice.amount).toFixed(2)} {order.totalPrice.currencyCode}
                            </span>
                            {order.statusUrl && (
                              <a
                                href={order.statusUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-mono font-bold text-zinc-600 dark:text-zinc-300 hover:text-[#0d5d50] dark:hover:text-[#38e8c6] transition-colors"
                              >
                                <span>Track</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. ORDERS & TRACKING TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-200/80 dark:border-white/[0.08]">
                  <div>
                    <h2 className="font-['Montserrat',sans-serif] text-xl font-black uppercase tracking-tight text-zinc-950 dark:text-white">
                      Orders & Logistics Tracking
                    </h2>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Live status, air-freight dispatch notifications, and line-item details from Shopify.
                    </p>
                  </div>
                </div>

                {orders.length === 0 ? (
                  <div className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] p-12 text-center space-y-3">
                    <Box className="w-10 h-10 text-zinc-400 mx-auto" />
                    <div className="text-base font-bold text-zinc-950 dark:text-white">
                      No Orders Recorded
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                      All orders placed with this email address will automatically synchronize and display here with live courier tracking.
                    </p>
                    <Link
                      to="/collections"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 font-mono text-xs font-bold uppercase tracking-wider mt-2 active:scale-[0.98] transition-all"
                    >
                      <span>Shop Apparatus Catalog</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div
                        key={order.id}
                        className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] p-6 shadow-xs space-y-4"
                      >
                        {/* Order Top Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-200/80 dark:border-white/[0.08]">
                          <div>
                            <div className="flex items-center gap-2.5">
                              <span className="text-base font-black font-mono text-zinc-950 dark:text-white">
                                {order.name}
                              </span>
                              <span
                                className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                                  order.fulfillmentStatus === 'FULFILLED'
                                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                                    : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                                }`}
                              >
                                {order.fulfillmentStatus || 'UNFULFILLED'}
                              </span>
                              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-zinc-100 dark:bg-[#14161b] text-zinc-600 dark:text-zinc-400">
                                {order.financialStatus}
                              </span>
                            </div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-mono">
                              Date: {new Date(order.processedAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-lg font-black font-mono text-zinc-950 dark:text-[#38e8c6]">
                              ${parseFloat(order.totalPrice.amount).toFixed(2)} {order.totalPrice.currencyCode}
                            </div>
                            {order.statusUrl && (
                              <a
                                href={order.statusUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6] hover:underline mt-0.5"
                              >
                                <span>Official Tracking & Receipt</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-3">
                          {order.lineItems?.edges?.map((itemEdge, idx) => {
                            const item = itemEdge.node
                            return (
                              <div
                                key={idx}
                                className="flex items-center justify-between gap-4 p-3 rounded-xl bg-zinc-50 dark:bg-[#14161b] border border-zinc-200/70 dark:border-white/[0.06]"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  {item.variant?.image?.url ? (
                                    <img
                                      src={item.variant.image.url}
                                      alt={item.title}
                                      className="w-12 h-12 object-contain rounded-lg bg-white dark:bg-[#1c1e24] p-1 border border-zinc-200/80 dark:border-white/[0.08] shrink-0"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 rounded-lg bg-zinc-200 dark:bg-[#1c1e24] flex items-center justify-center text-zinc-400 shrink-0 font-mono text-xs">
                                      <Package className="w-5 h-5" />
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <div className="text-xs font-bold text-zinc-950 dark:text-zinc-100 truncate">
                                      {item.title}
                                    </div>
                                    {item.variant?.title && item.variant.title !== 'Default Title' && (
                                      <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 truncate">
                                        Spec: {item.variant.title}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="text-right shrink-0 font-mono">
                                  <div className="text-xs font-bold text-zinc-950 dark:text-white">
                                    Qty: {item.quantity}
                                  </div>
                                  {item.variant?.price && (
                                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                                      ${parseFloat(item.variant.price.amount).toFixed(2)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>

                        {/* Courier Tracking Section if available */}
                        {order.successfulFulfillments && order.successfulFulfillments.length > 0 && (
                          <div className="pt-3 border-t border-zinc-200/80 dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold">
                              <Truck className="w-4 h-4" />
                              <span>Carrier: {order.successfulFulfillments[0].trackingCompany || 'Express Air'}</span>
                            </div>
                            {order.successfulFulfillments[0].trackingInfo?.[0]?.number && (
                              <div className="flex items-center gap-2">
                                <span className="text-zinc-500 dark:text-zinc-400">Waybill:</span>
                                <a
                                  href={order.successfulFulfillments[0].trackingInfo[0].url || '#'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-bold text-[#0d5d50] dark:text-[#38e8c6] hover:underline"
                                >
                                  {order.successfulFulfillments[0].trackingInfo[0].number}
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. SAVED ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-200/80 dark:border-white/[0.08]">
                  <div>
                    <h2 className="font-['Montserrat',sans-serif] text-xl font-black uppercase tracking-tight text-zinc-950 dark:text-white">
                      Saved Shipping Addresses
                    </h2>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Manage studio delivery destinations for faster checkout dispatch.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={openNewAddressModal}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 font-mono text-xs font-bold uppercase tracking-wider hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Address</span>
                  </button>
                </div>

                {addressError && !isAddressModalOpen && (
                  <div
                    role="alert"
                    className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-start gap-2"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{addressError}</span>
                  </div>
                )}

                {addresses.length === 0 ? (
                  <div className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] p-12 text-center space-y-3">
                    <MapPin className="w-10 h-10 text-zinc-400 mx-auto" />
                    <div className="text-base font-bold text-zinc-950 dark:text-white">
                      No Saved Addresses
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                      Save your studio or warehouse address for accelerated dispatch and customs documentation.
                    </p>
                    <button
                      type="button"
                      onClick={openNewAddressModal}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 font-mono text-xs font-bold uppercase tracking-wider mt-2 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add First Address</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map(addr => {
                      const isDefault = addr.id === defaultAddressId
                      const isConfirmingDelete = pendingDeleteAddressId === addr.id
                      return (
                        <div
                          key={addr.id}
                          className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                            isDefault
                              ? 'border-[#0d5d50] dark:border-[#38e8c6] bg-white dark:bg-[#1c1e24] shadow-xs'
                              : 'border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-bold text-sm text-zinc-950 dark:text-white font-sans">
                                {addr.firstName} {addr.lastName}
                              </span>
                              {isDefault && (
                                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#0d5d50]/10 dark:bg-[#38e8c6]/10 text-[#0d5d50] dark:text-[#38e8c6] border border-[#0d5d50]/25 dark:border-[#38e8c6]/30">
                                  DEFAULT STUDIO
                                </span>
                              )}
                            </div>

                            <div className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1 font-sans">
                              {addr.company && (
                                <div className="font-bold text-zinc-900 dark:text-zinc-200">
                                  {addr.company}
                                </div>
                              )}
                              <div>{addr.address1}</div>
                              {addr.address2 && <div>{addr.address2}</div>}
                              <div>
                                {addr.city}, {addr.province} {addr.zip}
                              </div>
                              <div className="font-mono text-zinc-500 dark:text-zinc-400">{addr.country}</div>
                              {addr.phone && (
                                <div className="font-mono text-zinc-500 dark:text-zinc-400 pt-1">
                                  Tel: {addr.phone}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-5 pt-4 border-t border-zinc-200/80 dark:border-white/[0.08] flex items-center justify-between font-mono text-xs">
                            {isConfirmingDelete ? (
                              <div className="flex items-center gap-2 w-full justify-between">
                                <span className="text-[11px] text-red-600 dark:text-red-400 font-bold">
                                  Remove this address?
                                </span>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setPendingDeleteAddressId(null)}
                                    className="px-2.5 py-1 rounded border border-zinc-200 dark:border-white/[0.1] text-zinc-600 dark:text-zinc-300 text-[11px] cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteAddress(addr.id)}
                                    className="px-2.5 py-1 rounded bg-red-600 text-white text-[11px] font-bold cursor-pointer"
                                  >
                                    Confirm
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center gap-3">
                                  <button
                                    type="button"
                                    onClick={() => openEditAddressModal(addr)}
                                    className="inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-[#38e8c6] transition-colors cursor-pointer"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setPendingDeleteAddressId(addr.id)}
                                    className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 hover:opacity-80 transition-opacity cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete</span>
                                  </button>
                                </div>

                                {!isDefault && (
                                  <button
                                    type="button"
                                    onClick={() => handleSetDefaultAddress(addr.id)}
                                    className="text-[11px] font-bold text-[#0d5d50] dark:text-[#38e8c6] hover:underline cursor-pointer"
                                  >
                                    Set As Default
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 4. PROFILE & SECURITY TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-zinc-200/80 dark:border-white/[0.08]">
                  <h2 className="font-['Montserrat',sans-serif] text-xl font-black uppercase tracking-tight text-zinc-950 dark:text-white">
                    Profile & Account Credentials
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Update your artist profile credentials and Shopify account password.
                  </p>
                </div>

                {profileError && (
                  <div
                    role="alert"
                    className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-start gap-2"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{profileError}</span>
                  </div>
                )}
                {profileSuccess && (
                  <div
                    role="status"
                    className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{profileSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Basic Information */}
                  <div className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] p-6 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-zinc-950 dark:text-white">
                      Basic Credentials
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="profile-first-name"
                          className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5"
                        >
                          First Name
                        </label>
                        <input
                          id="profile-first-name"
                          type="text"
                          autoComplete="given-name"
                          required
                          value={profileForm.firstName}
                          onChange={e => setProfileForm({ ...profileForm, firstName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-sm text-zinc-950 dark:text-white font-mono focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="profile-last-name"
                          className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5"
                        >
                          Last Name
                        </label>
                        <input
                          id="profile-last-name"
                          type="text"
                          autoComplete="family-name"
                          required
                          value={profileForm.lastName}
                          onChange={e => setProfileForm({ ...profileForm, lastName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-sm text-zinc-950 dark:text-white font-mono focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="profile-email-readonly"
                        className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5"
                      >
                        Account Email (Managed via Shopify)
                      </label>
                      <input
                        id="profile-email-readonly"
                        type="email"
                        disabled
                        value={customer.email}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-zinc-100 dark:bg-[#14161b]/60 text-sm text-zinc-500 font-mono cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="profile-phone"
                        className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5"
                      >
                        Phone Number (Optional)
                      </label>
                      <input
                        id="profile-phone"
                        type="tel"
                        autoComplete="tel"
                        value={profileForm.phone}
                        onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-sm text-zinc-950 dark:text-white font-mono focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                      />
                    </div>
                  </div>

                  {/* Password Change */}
                  <div className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] p-6 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-zinc-950 dark:text-white">
                      Update Security Password
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Leave blank if you do not want to alter your current password.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="profile-new-password"
                          className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5"
                        >
                          New Password
                        </label>
                        <input
                          id="profile-new-password"
                          type="password"
                          autoComplete="new-password"
                          minLength={8}
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          placeholder="Min 8 characters"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-sm text-zinc-950 dark:text-white font-mono focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="profile-confirm-password"
                          className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5"
                        >
                          Confirm New Password
                        </label>
                        <input
                          id="profile-confirm-password"
                          type="password"
                          autoComplete="new-password"
                          minLength={8}
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-sm text-zinc-950 dark:text-white font-mono focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="px-6 py-3 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 font-mono text-xs font-bold uppercase tracking-wider hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {profileLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>Save Profile Changes</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ADDRESS MODAL (Add / Edit) */}
      {isAddressModalOpen && (
        <div
          onClick={closeAddressModal}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in motion-reduce:animate-none"
        >
          <div
            ref={addressDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-address-modal-title"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-zinc-200/80 dark:border-white/[0.1] bg-white dark:bg-[#1c1e24] p-6 shadow-2xl space-y-4 outline-hidden"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200/80 dark:border-white/[0.08]">
              <h3
                id="account-address-modal-title"
                className="font-['Montserrat',sans-serif] font-black text-base uppercase tracking-tight text-zinc-950 dark:text-white"
              >
                {editingAddress ? 'Edit Studio Address' : 'Add Studio Address'}
              </h3>
              <button
                type="button"
                onClick={closeAddressModal}
                aria-label="Close address modal"
                className="text-zinc-400 hover:text-zinc-950 dark:hover:text-white active:scale-95 transition-all p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {addressError && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{addressError}</span>
              </div>
            )}
            {addressSuccess && (
              <div
                role="status"
                className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs flex items-start gap-2"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{addressSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveAddress} className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="address-first-name"
                    className="block text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-400 mb-1"
                  >
                    First Name
                  </label>
                  <input
                    ref={addressFirstInputRef}
                    id="address-first-name"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={addressForm.firstName}
                    onChange={(e) => setAddressForm({ ...addressForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-zinc-950 dark:text-white focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="address-last-name"
                    className="block text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-400 mb-1"
                  >
                    Last Name
                  </label>
                  <input
                    id="address-last-name"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={addressForm.lastName}
                    onChange={(e) => setAddressForm({ ...addressForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-zinc-950 dark:text-white focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="address-company"
                  className="block text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-400 mb-1"
                >
                  Studio / Company (Optional)
                </label>
                <input
                  id="address-company"
                  type="text"
                  autoComplete="organization"
                  value={addressForm.company}
                  onChange={(e) => setAddressForm({ ...addressForm, company: e.target.value })}
                  placeholder="Iron Ink Tattoo Studio"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-zinc-950 dark:text-white focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                />
              </div>

              <div>
                <label
                  htmlFor="address-line1"
                  className="block text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-400 mb-1"
                >
                  Street Address
                </label>
                <input
                  id="address-line1"
                  type="text"
                  autoComplete="address-line1"
                  required
                  value={addressForm.address1}
                  onChange={(e) => setAddressForm({ ...addressForm, address1: e.target.value })}
                  placeholder="123 Main St"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-zinc-950 dark:text-white focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                />
              </div>

              <div>
                <label
                  htmlFor="address-line2"
                  className="block text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-400 mb-1"
                >
                  Suite / Unit / Studio # (Optional)
                </label>
                <input
                  id="address-line2"
                  type="text"
                  autoComplete="address-line2"
                  value={addressForm.address2}
                  onChange={(e) => setAddressForm({ ...addressForm, address2: e.target.value })}
                  placeholder="Suite 4B"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-zinc-950 dark:text-white focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label
                    htmlFor="address-city"
                    className="block text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-400 mb-1"
                  >
                    City
                  </label>
                  <input
                    id="address-city"
                    type="text"
                    autoComplete="address-level2"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-zinc-950 dark:text-white focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="address-province"
                    className="block text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-400 mb-1"
                  >
                    State / Prov
                  </label>
                  <input
                    id="address-province"
                    type="text"
                    autoComplete="address-level1"
                    required
                    value={addressForm.province}
                    onChange={(e) => setAddressForm({ ...addressForm, province: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-zinc-950 dark:text-white focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="address-zip"
                    className="block text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-400 mb-1"
                  >
                    Postal Code
                  </label>
                  <input
                    id="address-zip"
                    type="text"
                    autoComplete="postal-code"
                    required
                    value={addressForm.zip}
                    onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-zinc-950 dark:text-white focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="address-country"
                    className="block text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-400 mb-1"
                  >
                    Country
                  </label>
                  <input
                    id="address-country"
                    type="text"
                    autoComplete="country-name"
                    required
                    value={addressForm.country}
                    onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-zinc-950 dark:text-white focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="address-phone"
                    className="block text-[10px] font-bold uppercase text-zinc-500 dark:text-zinc-400 mb-1"
                  >
                    Phone (For Courier)
                  </label>
                  <input
                    id="address-phone"
                    type="tel"
                    autoComplete="tel"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-zinc-950 dark:text-white focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeAddressModal}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.12] text-zinc-600 dark:text-zinc-300 font-bold uppercase active:scale-95 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addressLoading}
                  className="px-5 py-2 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 font-bold uppercase tracking-wider flex items-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                >
                  {addressLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Address</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
