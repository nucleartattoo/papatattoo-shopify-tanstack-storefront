import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
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
  Sparkles,
  Lock,
  Mail,
  Truck,
  Building,
  Phone,
  Box,
} from 'lucide-react'

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
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [authSuccess, setAuthSuccess] = useState<string | null>(null)

  // Address Modal & Form States
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
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
          // Check cached profile if available before clearing
          const cached = typeof window !== 'undefined' ? localStorage.getItem('shopify_customer_profile') : null
          if (cached) {
            try {
              const parsed = JSON.parse(cached)
              if (parsed && parsed.email) {
                setCustomer(parsed)
                setProfileForm({
                  firstName: parsed.firstName || '',
                  lastName: parsed.lastName || '',
                  phone: parsed.phone || '',
                })
                setLoading(false)
                return
              }
            } catch {}
          }
          // Token expired or invalid
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
      setAuthSuccess('Sign in successful! Welcome back.')
    } catch (err: any) {
      setAuthError(err.message || 'Invalid email or password.')
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
      setAuthSuccess('Account created! Signing you in...')
      // Automatically log in
      const tokenObj = await loginCustomer(email.trim(), password)
      localStorage.setItem('shopify_customer_token', tokenObj.accessToken)
      localStorage.setItem('shopify_customer_token_exp', tokenObj.expiresAt)
      setToken(tokenObj.accessToken)
      const profile = await getCustomerProfile(tokenObj.accessToken)
      if (profile) {
        setCustomer(profile)
      }
    } catch (err: any) {
      setAuthError(err.message || 'Failed to create account. Please check your information.')
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
      setAuthSuccess('Password reset link sent! Check your inbox.')
    } catch (err: any) {
      setAuthError(err.message || 'Failed to send recovery email.')
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
        setAddressSuccess('Address updated successfully.')
      } else {
        await createCustomerAddress(token, addressForm)
        setAddressSuccess('New address created.')
      }

      // Refresh customer data
      const updated = await getCustomerProfile(token)
      if (updated) setCustomer(updated)
      setTimeout(() => setIsAddressModalOpen(false), 800)
    } catch (err: any) {
      setAddressError(err.message || 'Failed to save address. You may update addresses via Shopify Portal.')
    } finally {
      setAddressLoading(false)
    }
  }

  // Delete Address Handler
  const handleDeleteAddress = async (addressId: string) => {
    if (!token) return
    if (!window.confirm('Are you sure you want to remove this address?')) return

    try {
      await deleteCustomerAddress(token, addressId)
      const updated = await getCustomerProfile(token)
      if (updated) setCustomer(updated)
    } catch (err: any) {
      alert(err.message || 'Could not delete address.')
    }
  }

  // Set Default Address Handler
  const handleSetDefaultAddress = async (addressId: string) => {
    if (!token) return
    try {
      await setDefaultCustomerAddress(token, addressId)
      const updated = await getCustomerProfile(token)
      if (updated) setCustomer(updated)
    } catch (err: any) {
      alert(err.message || 'Could not update default address.')
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
      const updateData: any = {
        firstName: profileForm.firstName.trim(),
        lastName: profileForm.lastName.trim(),
      }
      if (profileForm.phone.trim()) {
        updateData.phone = profileForm.phone.trim()
      }
      if (newPassword) {
        updateData.password = newPassword
      }

      const res = await updateCustomerProfile(token, updateData)
      if (res.newToken) {
        setToken(res.newToken)
        localStorage.setItem('shopify_customer_token', res.newToken)
      }
      const updated = await getCustomerProfile(res.newToken || token)
      if (updated) setCustomer(updated)

      setProfileSuccess('Profile updated successfully.')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setProfileError(err.message || 'Failed to update profile.')
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
      <div className="min-h-screen bg-zinc-50 dark:bg-[#060709] flex flex-col items-center justify-center py-24 text-zinc-900 dark:text-white">
        <Loader2 className="w-8 h-8 text-[#00f0ff] animate-spin mb-4" />
        <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
          CONNECTING TO SHOPIFY CUSTOMER PORTAL...
        </span>
      </div>
    )
  }

  // 2. Unauthenticated State: Cyber Terminal Login / Register
  if (!customer) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#060709] py-12 sm:py-20 text-zinc-900 dark:text-zinc-100 relative overflow-hidden">
        {/* Ambient Grid & Radiance */}
        <div className="absolute inset-0 sacred-grid-bg opacity-15 pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#00f0ff]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-md mx-auto px-4 sm:px-6 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-8">
            <Link to="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              HOME
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-[#0d9488] dark:text-[#00f0ff] font-bold uppercase">
              BUYER ACCOUNT
            </span>
          </nav>

          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0a0d14] p-7 shadow-2xl hud-corner-bracket">
            {/* Terminal Header */}
            <div className="text-center pb-6 border-b border-zinc-100 dark:border-zinc-800/70">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-600/30 dark:border-[#00f0ff]/30 bg-teal-500/10 dark:bg-[#00f0ff]/10 text-teal-700 dark:text-[#00f0ff] text-[10px] font-mono font-bold uppercase tracking-widest mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0d9488] dark:bg-[#00f0ff] animate-pulse" />
                <span>SHOPIFY BUYER PORTAL</span>
              </div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-zinc-950 dark:text-white font-sans">
                {authMode === 'signin' && 'BUYER SIGN IN'}
                {authMode === 'register' && 'CREATE ACCOUNT'}
                {authMode === 'forgot' && 'RESET PASSWORD'}
              </h1>
              <p className="text-xs text-zinc-500 mt-1 font-sans">
                Access order tracking, wholesale allocations, and saved delivery addresses.
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex border-b border-zinc-100 dark:border-zinc-800/70 my-6 font-mono text-xs">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin')
                  setAuthError(null)
                  setAuthSuccess(null)
                }}
                className={`flex-1 pb-2.5 font-bold uppercase tracking-wider text-center border-b-2 transition-colors cursor-pointer ${
                  authMode === 'signin'
                    ? 'border-[#00f0ff] text-[#0d9488] dark:text-[#00f0ff]'
                    : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register')
                  setAuthError(null)
                  setAuthSuccess(null)
                }}
                className={`flex-1 pb-2.5 font-bold uppercase tracking-wider text-center border-b-2 transition-colors cursor-pointer ${
                  authMode === 'register'
                    ? 'border-[#00f0ff] text-[#0d9488] dark:text-[#00f0ff]'
                    : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                }`}
              >
                Register
              </button>
            </div>

            {/* Error / Success Alerts */}
            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}
            {authSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authSuccess}</span>
              </div>
            )}

            {/* SIGN IN FORM */}
            {authMode === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="artist@studio.com"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#07090e] text-sm text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#00f0ff] font-mono transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setAuthMode('forgot')}
                      className="text-[11px] font-mono text-[#0d9488] dark:text-[#00f0ff] hover:underline"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#07090e] text-sm text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#00f0ff] font-mono transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full mt-2 py-3 rounded-xl bg-zinc-950 text-white dark:bg-[#00f0ff] dark:text-zinc-950 font-mono text-xs font-bold uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      placeholder="Alex"
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#07090e] text-sm text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#00f0ff] font-mono transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      placeholder="Rider"
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#07090e] text-sm text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#00f0ff] font-mono transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="artist@studio.com"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#07090e] text-sm text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#00f0ff] font-mono transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                    Password (Min 8 Characters)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#07090e] text-sm text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#00f0ff] font-mono transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full mt-2 py-3 rounded-xl bg-zinc-950 text-white dark:bg-[#00f0ff] dark:text-zinc-950 font-mono text-xs font-bold uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {authLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Register Pro Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* FORGOT PASSWORD FORM */}
            {authMode === 'forgot' && (
              <form onSubmit={handleRecoverPassword} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                    Account Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="artist@studio.com"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#07090e] text-sm text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#00f0ff] font-mono transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full mt-2 py-3 rounded-xl bg-zinc-950 text-white dark:bg-[#00f0ff] dark:text-zinc-950 font-mono text-xs font-bold uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {authLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Send Recovery Email</span>
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setAuthMode('signin')}
                    className="text-xs font-mono text-zinc-500 hover:text-zinc-950 dark:hover:text-white"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    )
  }

  // 3. Authenticated State: Full Cyber Buyer Dashboard
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#060709] py-8 sm:py-12 text-zinc-900 dark:text-zinc-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Quick Actions */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <nav className="flex items-center gap-2 text-xs font-mono text-zinc-500">
            <Link to="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              HOME
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-[#0d9488] dark:text-[#00f0ff] font-bold uppercase">
              BUYER DASHBOARD
            </span>
          </nav>

          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-red-500 hover:text-red-400 uppercase tracking-wider transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar: Navigation & Identity Terminal */}
          <div className="lg:col-span-3 space-y-6">
            <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0a0d14] p-5 shadow-sm hud-corner-bracket">
              {/* Buyer Avatar & Identifier */}
              <div className="flex items-center gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800/70">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-[#121620] border border-teal-500/30 dark:border-[#00f0ff]/40 flex items-center justify-center text-teal-600 dark:text-[#00f0ff] font-mono text-lg font-black shrink-0">
                  {customer.firstName?.[0] || customer.email[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-sm text-zinc-950 dark:text-white truncate">
                    {customer.firstName} {customer.lastName}
                  </div>
                  <div className="text-[11px] font-mono text-zinc-500 truncate">
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
                      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Navigation Menu */}
              <nav className="mt-4 space-y-1 font-mono text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'overview'
                      ? 'bg-zinc-950 text-white dark:bg-[#00f0ff] dark:text-zinc-950 shadow-md'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#12151e]'
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
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-zinc-950 text-white dark:bg-[#00f0ff] dark:text-zinc-950 shadow-md'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#12151e]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Package className="w-4 h-4" />
                    <span>Orders & Tracking</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    {orders.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'addresses'
                      ? 'bg-zinc-950 text-white dark:bg-[#00f0ff] dark:text-zinc-950 shadow-md'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#12151e]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4" />
                    <span>Saved Addresses</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    {addresses.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-zinc-950 text-white dark:bg-[#00f0ff] dark:text-zinc-950 shadow-md'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#12151e]'
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
            <div className="p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-[#090b10] space-y-2">
              <div className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                COMMERCIAL ACCESS
              </div>
              <div className="text-sm font-black uppercase text-zinc-950 dark:text-white font-sans">
                STUDIO INVOICING & BULK
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed font-sans">
                Direct batch orders, regional distributor accounts, and custom invoice terms.
              </p>
              <Link
                to="/wholesale"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#0d9488] dark:text-[#00f0ff] hover:underline pt-1"
              >
                <span>Wholesale Portal</span>
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
                  <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0a0d14] p-5 hud-corner-bracket">
                    <div className="flex items-center justify-between text-zinc-500 font-mono text-[11px] uppercase">
                      <span>Total Orders</span>
                      <Package className="w-4 h-4 text-[#00f0ff]" />
                    </div>
                    <div className="text-3xl font-black font-mono text-zinc-950 dark:text-white mt-2">
                      {orders.length}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">Processed via Shopify</div>
                  </div>

                  <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0a0d14] p-5 hud-corner-bracket">
                    <div className="flex items-center justify-between text-zinc-500 font-mono text-[11px] uppercase">
                      <span>Default Destination</span>
                      <MapPin className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="text-base font-bold font-sans text-zinc-950 dark:text-white mt-2 truncate">
                      {customer.defaultAddress?.city
                        ? `${customer.defaultAddress.city}, ${customer.defaultAddress.country}`
                        : 'No Address Set'}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">
                      {addresses.length} saved addresses
                    </div>
                  </div>

                  <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0a0d14] p-5 hud-corner-bracket">
                    <div className="flex items-center justify-between text-zinc-500 font-mono text-[11px] uppercase">
                      <span>Saved Addresses</span>
                      <MapPin className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="text-3xl font-black font-mono text-zinc-950 dark:text-white mt-2">
                      {addresses.length}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">Shipping destinations</div>
                  </div>
                </div>

                {/* Recent Orders Showcase */}
                <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0a0d14] p-6 shadow-sm">
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800/70">
                    <h3 className="font-bold text-base uppercase tracking-tight text-zinc-950 dark:text-white font-sans">
                      Recent Orders
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-mono font-bold text-[#0d9488] dark:text-[#00f0ff] hover:underline"
                    >
                      View All ({orders.length}) →
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-12 space-y-3">
                      <ShoppingBag className="w-8 h-8 text-zinc-400 mx-auto" />
                      <div className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                        No orders recorded yet.
                      </div>
                      <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                        Explore our needle cartridges and CNC machined apparatus to place your first order.
                      </p>
                      <Link
                        to="/collections"
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-zinc-950 text-white dark:bg-[#00f0ff] dark:text-zinc-950 font-mono text-xs font-bold uppercase tracking-wider mt-2"
                      >
                        <span>Browse Catalog</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800/70">
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
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                                }`}
                              >
                                {order.fulfillmentStatus || 'UNFULFILLED'}
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                                {order.financialStatus}
                              </span>
                            </div>
                            <div className="text-xs text-zinc-500 mt-1 font-mono">
                              {new Date(order.processedAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="font-mono font-extrabold text-sm text-zinc-950 dark:text-[#00f0ff]">
                              ${parseFloat(order.totalPrice.amount).toFixed(2)} {order.totalPrice.currencyCode}
                            </span>
                            {order.statusUrl && (
                              <a
                                href={order.statusUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 hover:text-[#00f0ff] transition-colors"
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
                <div className="flex items-center justify-between pb-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tight text-zinc-950 dark:text-white font-sans">
                      Orders & Logistics Tracking
                    </h2>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Live status, dispatch notifications, and line-item details from Shopify.
                    </p>
                  </div>
                </div>

                {orders.length === 0 ? (
                  <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0a0d14] p-12 text-center space-y-3">
                    <Box className="w-10 h-10 text-zinc-400 mx-auto" />
                    <div className="text-base font-bold text-zinc-950 dark:text-white">
                      No Orders Recorded
                    </div>
                    <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                      All orders placed with this email address will automatically synchronize and display here with live courier tracking.
                    </p>
                    <Link
                      to="/collections"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-[#00f0ff] dark:text-zinc-950 font-mono text-xs font-bold uppercase tracking-wider mt-2"
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
                        className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0a0d14] p-6 shadow-sm space-y-4 hud-corner-bracket"
                      >
                        {/* Order Top Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800/70">
                          <div>
                            <div className="flex items-center gap-2.5">
                              <span className="text-base font-black font-mono text-zinc-950 dark:text-white">
                                {order.name}
                              </span>
                              <span
                                className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                                  order.fulfillmentStatus === 'FULFILLED'
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                                }`}
                              >
                                {order.fulfillmentStatus || 'UNFULFILLED'}
                              </span>
                              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                                {order.financialStatus}
                              </span>
                            </div>
                            <div className="text-xs text-zinc-500 mt-1 font-mono">
                              Date: {new Date(order.processedAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-lg font-black font-mono text-zinc-950 dark:text-[#00f0ff]">
                              ${parseFloat(order.totalPrice.amount).toFixed(2)} {order.totalPrice.currencyCode}
                            </div>
                            {order.statusUrl && (
                              <a
                                href={order.statusUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#0d9488] dark:text-[#00f0ff] hover:underline mt-0.5"
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
                                className="flex items-center justify-between gap-4 p-3 rounded-xl bg-zinc-50 dark:bg-[#07090e] border border-zinc-100 dark:border-zinc-800/60"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  {item.variant?.image?.url ? (
                                    <img
                                      src={item.variant.image.url}
                                      alt={item.title}
                                      className="w-12 h-12 object-contain rounded-lg bg-white dark:bg-[#0c0f18] p-1 border border-zinc-200 dark:border-zinc-800 shrink-0"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0 font-mono text-xs">
                                      <Package className="w-5 h-5" />
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <div className="text-xs font-bold text-zinc-950 dark:text-zinc-100 truncate">
                                      {item.title}
                                    </div>
                                    {item.variant?.title && item.variant.title !== 'Default Title' && (
                                      <div className="text-[11px] font-mono text-zinc-500 truncate">
                                        Configuration: {item.variant.title}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="text-right shrink-0 font-mono">
                                  <div className="text-xs font-bold text-zinc-950 dark:text-white">
                                    Qty: {item.quantity}
                                  </div>
                                  {item.variant?.price && (
                                    <div className="text-[11px] text-zinc-500">
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
                          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/70 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                              <Truck className="w-4 h-4" />
                              <span>Carrier: {order.successfulFulfillments[0].trackingCompany || 'Express Air'}</span>
                            </div>
                            {order.successfulFulfillments[0].trackingInfo?.[0]?.number && (
                              <div className="flex items-center gap-2">
                                <span className="text-zinc-500">Tracking:</span>
                                <a
                                  href={order.successfulFulfillments[0].trackingInfo[0].url || '#'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-bold text-[#0d9488] dark:text-[#00f0ff] hover:underline"
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
                <div className="flex items-center justify-between pb-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tight text-zinc-950 dark:text-white font-sans">
                      Saved Shipping Addresses
                    </h2>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Manage studio delivery destinations for faster one-click checkout.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={openNewAddressModal}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-950 text-white dark:bg-[#00f0ff] dark:text-zinc-950 font-mono text-xs font-bold uppercase tracking-wider hover:shadow-[0_0_15px_rgba(0,240,255,0.35)] transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Address</span>
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0a0d14] p-12 text-center space-y-3">
                    <MapPin className="w-10 h-10 text-zinc-400 mx-auto" />
                    <div className="text-base font-bold text-zinc-950 dark:text-white">
                      No Saved Addresses
                    </div>
                    <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                      Save your studio or warehouse address for accelerated dispatch and customs documentation.
                    </p>
                    <button
                      type="button"
                      onClick={openNewAddressModal}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-[#00f0ff] dark:text-zinc-950 font-mono text-xs font-bold uppercase tracking-wider mt-2 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add First Address</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map(addr => {
                      const isDefault = addr.id === defaultAddressId
                      return (
                        <div
                          key={addr.id}
                          className={`rounded-2xl border p-5 flex flex-col justify-between transition-all hud-corner-bracket ${
                            isDefault
                              ? 'border-teal-600/50 dark:border-[#00f0ff] bg-white dark:bg-[#0d1018] shadow-md dark:shadow-[0_0_20px_rgba(0,240,255,0.12)]'
                              : 'border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0a0d14]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-bold text-sm text-zinc-950 dark:text-white font-sans">
                                {addr.firstName} {addr.lastName}
                              </span>
                              {isDefault && (
                                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-[#00f0ff] border border-teal-500/30">
                                  DEFAULT DESTINATION
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
                              <div className="font-mono text-zinc-500">{addr.country}</div>
                              {addr.phone && (
                                <div className="font-mono text-zinc-500 pt-1">
                                  Tel: {addr.phone}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/70 flex items-center justify-between font-mono text-xs">
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => openEditAddressModal(addr)}
                                className="inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-[#00f0ff] transition-colors cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteAddress(addr.id)}
                                className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>

                            {!isDefault && (
                              <button
                                type="button"
                                onClick={() => handleSetDefaultAddress(addr.id)}
                                className="text-[11px] font-bold text-[#0d9488] dark:text-[#00f0ff] hover:underline cursor-pointer"
                              >
                                Set As Default
                              </button>
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
                <div className="pb-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
                  <h2 className="text-xl font-black uppercase tracking-tight text-zinc-950 dark:text-white font-sans">
                    Profile & Account Credentials
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Update your artist profile credentials and Shopify account password.
                  </p>
                </div>

                {profileError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{profileError}</span>
                  </div>
                )}
                {profileSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{profileSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Basic Information */}
                  <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0a0d14] p-6 space-y-4 hud-corner-bracket">
                    <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-zinc-950 dark:text-white">
                      Basic Credentials
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                          First Name
                        </label>
                        <input
                          type="text"
                          required
                          value={profileForm.firstName}
                          onChange={e => setProfileForm({ ...profileForm, firstName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#07090e] text-sm text-zinc-950 dark:text-white font-mono focus:outline-none focus:border-[#00f0ff]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                          Last Name
                        </label>
                        <input
                          type="text"
                          required
                          value={profileForm.lastName}
                          onChange={e => setProfileForm({ ...profileForm, lastName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#07090e] text-sm text-zinc-950 dark:text-white font-mono focus:outline-none focus:border-[#00f0ff]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                        Account Email (Managed via Shopify)
                      </label>
                      <input
                        type="email"
                        disabled
                        value={customer.email}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-[#07090e]/60 text-sm text-zinc-500 font-mono cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#07090e] text-sm text-zinc-950 dark:text-white font-mono focus:outline-none focus:border-[#00f0ff]"
                      />
                    </div>
                  </div>

                  {/* Password Change */}
                  <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0a0d14] p-6 space-y-4 hud-corner-bracket">
                    <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-zinc-950 dark:text-white">
                      Update Security Password
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Leave blank if you do not want to alter your current password.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                          New Password
                        </label>
                        <input
                          type="password"
                          minLength={8}
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          placeholder="Min 8 characters"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#07090e] text-sm text-zinc-950 dark:text-white font-mono focus:outline-none focus:border-[#00f0ff]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          minLength={8}
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#07090e] text-sm text-zinc-950 dark:text-white font-mono focus:outline-none focus:border-[#00f0ff]"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="px-6 py-3 rounded-xl bg-zinc-950 text-white dark:bg-[#00f0ff] dark:text-zinc-950 font-mono text-xs font-bold uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0d14] p-6 shadow-2xl space-y-4 hud-corner-bracket">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/70">
              <h3 className="font-bold text-base uppercase tracking-tight text-zinc-950 dark:text-white font-sans">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-950 dark:hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {addressError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{addressError}</span>
              </div>
            )}
            {addressSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{addressSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveAddress} className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.firstName}
                    onChange={e => setAddressForm({ ...addressForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#07090e] text-zinc-950 dark:text-white focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.lastName}
                    onChange={e => setAddressForm({ ...addressForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#07090e] text-zinc-950 dark:text-white focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1">
                  Studio / Company (Optional)
                </label>
                <input
                  type="text"
                  value={addressForm.company}
                  onChange={e => setAddressForm({ ...addressForm, company: e.target.value })}
                  placeholder="Iron Ink Tattoo Studio"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#07090e] text-zinc-950 dark:text-white focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.address1}
                  onChange={e => setAddressForm({ ...addressForm, address1: e.target.value })}
                  placeholder="123 Main St"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#07090e] text-zinc-950 dark:text-white focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1">
                  Suite / Unit / Studio # (Optional)
                </label>
                <input
                  type="text"
                  value={addressForm.address2}
                  onChange={e => setAddressForm({ ...addressForm, address2: e.target.value })}
                  placeholder="Suite 4B"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#07090e] text-zinc-950 dark:text-white focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={e => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#07090e] text-zinc-950 dark:text-white focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1">
                    State / Prov
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.province}
                    onChange={e => setAddressForm({ ...addressForm, province: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#07090e] text-zinc-950 dark:text-white focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.zip}
                    onChange={e => setAddressForm({ ...addressForm, zip: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#07090e] text-zinc-950 dark:text-white focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.country}
                    onChange={e => setAddressForm({ ...addressForm, country: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#07090e] text-zinc-950 dark:text-white focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1">
                    Phone (For Courier)
                  </label>
                  <input
                    type="tel"
                    value={addressForm.phone}
                    onChange={e => setAddressForm({ ...addressForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#07090e] text-zinc-950 dark:text-white focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addressLoading}
                  className="px-5 py-2 rounded-xl bg-zinc-950 text-white dark:bg-[#00f0ff] dark:text-zinc-950 font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
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
