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
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShoppingBag,
  Lock,
  Mail,
  Truck,
  Eye,
  EyeOff,
} from 'lucide-react'

function notifyCustomerAuthChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('customer-auth-changed'))
  }
}

export const AccountPage: React.FC = () => {
  const navigate = useNavigate()
  const skipNextTokenFetchRef = useRef(false)

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
  const [loading, setLoading] = useState<boolean>(() => {
    return typeof window !== 'undefined' && Boolean(localStorage.getItem('shopify_customer_token')) && !localStorage.getItem('shopify_customer_profile')
  })
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '')
      if (hash === 'orders' || hash === 'addresses' || hash === 'profile') {
        return hash
      }
    }
    return 'orders'
  })

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
    firstName: customer?.firstName || '',
    lastName: customer?.lastName || '',
    phone: customer?.phone || '',
  })
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)

  // Sync auth state when signed in/out from Header modal or another tab
  useEffect(() => {
    const syncFromStorage = () => {
      const nextToken = localStorage.getItem('shopify_customer_token')
      const cachedProfile = localStorage.getItem('shopify_customer_profile')
      setToken(nextToken)
      if (cachedProfile) {
        try {
          const parsed = JSON.parse(cachedProfile) as CustomerProfile
          setCustomer(parsed)
          setProfileForm({
            firstName: parsed.firstName || '',
            lastName: parsed.lastName || '',
            phone: parsed.phone || '',
          })
        } catch {
          setCustomer(null)
        }
      } else if (!nextToken) {
        setCustomer(null)
      }
    }

    const handleTabSelect = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (detail === 'orders' || detail === 'addresses' || detail === 'profile') {
        setActiveTab(detail)
      }
    }

    window.addEventListener('customer-auth-changed', syncFromStorage)
    window.addEventListener('storage', syncFromStorage)
    window.addEventListener('account-tab-select', handleTabSelect)
    return () => {
      window.removeEventListener('customer-auth-changed', syncFromStorage)
      window.removeEventListener('storage', syncFromStorage)
      window.removeEventListener('account-tab-select', handleTabSelect)
    }
  }, [])

  // Fetch customer profile when token is available
  useEffect(() => {
    async function loadCustomer() {
      if (!token) {
        setLoading(false)
        return
      }

      if (skipNextTokenFetchRef.current) {
        skipNextTokenFetchRef.current = false
        setLoading(false)
        return
      }

      if (!customer) {
        setLoading(true)
      }
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
          notifyCustomerAuthChanged()
        } else {
          localStorage.removeItem('shopify_customer_token')
          localStorage.removeItem('shopify_customer_token_exp')
          localStorage.removeItem('shopify_customer_profile')
          setToken(null)
          setCustomer(null)
          notifyCustomerAuthChanged()
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
      const normalizedEmail = email.trim()
      const tokenObj = await loginCustomer(normalizedEmail, password)
      localStorage.setItem('shopify_customer_token', tokenObj.accessToken)
      localStorage.setItem('shopify_customer_token_exp', tokenObj.expiresAt)

      const fetchedProfile = await getCustomerProfile(tokenObj.accessToken)
      const resolvedProfile: CustomerProfile = fetchedProfile || {
        id: 'customer',
        email: normalizedEmail,
        firstName: '',
        lastName: '',
      }

      localStorage.setItem('shopify_customer_profile', JSON.stringify(resolvedProfile))
      skipNextTokenFetchRef.current = true
      setCustomer(resolvedProfile)
      setProfileForm({
        firstName: resolvedProfile.firstName || '',
        lastName: resolvedProfile.lastName || '',
        phone: resolvedProfile.phone || '',
      })
      setToken(tokenObj.accessToken)
      setPassword('')
      notifyCustomerAuthChanged()
    } catch (err: any) {
      const msg = err?.message || ''
      if (
        msg.toLowerCase().includes('unidentified') ||
        msg.toLowerCase().includes('credential') ||
        msg.toLowerCase().includes('password')
      ) {
        setAuthError(
          'Incorrect email or password. If you had an account on our previous site, use "Forgot password?" to set a new password.'
        )
      } else {
        setAuthError(msg || 'Incorrect email or password.')
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
      const normalizedEmail = email.trim()
      const trimmedFirst = firstName.trim()
      const trimmedLast = lastName.trim()
      await registerCustomer(trimmedFirst, trimmedLast, normalizedEmail, password)

      const tokenObj = await loginCustomer(normalizedEmail, password)
      localStorage.setItem('shopify_customer_token', tokenObj.accessToken)
      localStorage.setItem('shopify_customer_token_exp', tokenObj.expiresAt)

      const fetchedProfile = await getCustomerProfile(tokenObj.accessToken)
      const resolvedProfile: CustomerProfile = fetchedProfile || {
        id: 'customer',
        email: normalizedEmail,
        firstName: trimmedFirst,
        lastName: trimmedLast,
      }

      localStorage.setItem('shopify_customer_profile', JSON.stringify(resolvedProfile))
      skipNextTokenFetchRef.current = true
      setCustomer(resolvedProfile)
      setProfileForm({
        firstName: resolvedProfile.firstName || '',
        lastName: resolvedProfile.lastName || '',
        phone: resolvedProfile.phone || '',
      })
      setToken(tokenObj.accessToken)
      setPassword('')
      notifyCustomerAuthChanged()
    } catch (err: any) {
      setAuthError(err?.message || 'Could not create account. Please check your details and try again.')
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
      setAuthSuccess('Password reset instructions have been sent to your email.')
    } catch {
      setAuthError('Could not send reset email. Please check the email address.')
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
    notifyCustomerAuthChanged()
    navigate({ to: '/account' })
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
        setAddressSuccess('Address saved.')
      }

      const updated = await getCustomerProfile(token)
      if (updated) {
        setCustomer(updated)
        localStorage.setItem('shopify_customer_profile', JSON.stringify(updated))
        notifyCustomerAuthChanged()
      }
      setTimeout(() => setIsAddressModalOpen(false), 500)
    } catch (err: any) {
      setAddressError(err?.message || 'Failed to save address. Please check all required fields.')
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
        notifyCustomerAuthChanged()
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
        notifyCustomerAuthChanged()
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
        skipNextTokenFetchRef.current = true
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
        notifyCustomerAuthChanged()
      }

      setProfileSuccess('Your profile has been updated.')
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

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-[70dvh] bg-zinc-50 dark:bg-[#14161b] flex flex-col items-center justify-center py-24 text-zinc-900 dark:text-white">
        <Loader2 className="w-6 h-6 text-[#0d5d50] dark:text-[#38e8c6] animate-spin mb-3" />
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          Loading your account...
        </span>
      </div>
    )
  }

  // 2. Unauthenticated State: Clean, Centered Sign In / Create Account Card
  if (!customer) {
    return (
      <div className="min-h-[80dvh] bg-zinc-50 dark:bg-[#14161b] py-12 sm:py-20 px-4 sm:px-6 text-zinc-900 dark:text-zinc-100 transition-colors flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto">
          <div className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] p-6 sm:p-8 shadow-sm">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
                {authMode === 'signin' && 'Sign In'}
                {authMode === 'register' && 'Create Account'}
                {authMode === 'forgot' && 'Reset Password'}
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
                {authMode === 'signin' && 'Sign in to view your orders and manage your addresses.'}
                {authMode === 'register' && 'Create an account for faster checkout and order tracking.'}
                {authMode === 'forgot' && "Enter your email and we'll send you a password reset link."}
              </p>
            </div>

            {/* Mode Switcher Tabs (Sign In / Create Account) */}
            {authMode !== 'forgot' && (
              <div
                role="tablist"
                aria-label="Account access"
                className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-zinc-100 dark:bg-[#14161b] border border-zinc-200/70 dark:border-white/[0.06] mb-6 text-xs font-medium"
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
                  className={`py-2 rounded-lg text-center transition-all cursor-pointer ${
                    authMode === 'signin'
                      ? 'bg-white dark:bg-[#1c1e24] text-zinc-950 dark:text-white font-semibold shadow-xs'
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
                  className={`py-2 rounded-lg text-center transition-all cursor-pointer ${
                    authMode === 'register'
                      ? 'bg-white dark:bg-[#1c1e24] text-zinc-950 dark:text-white font-semibold shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

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
                    className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
                  >
                    Email
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
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-sm text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="account-signin-password"
                      className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
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
                      className="text-xs font-medium text-[#0d5d50] dark:text-[#38e8c6] hover:underline cursor-pointer"
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
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-sm text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6] transition-colors"
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
                  className="w-full mt-2 py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 text-sm font-semibold hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {authLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Sign In</span>
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
                      className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
                    >
                      First name
                    </label>
                    <input
                      id="account-register-first-name"
                      type="text"
                      autoComplete="given-name"
                      required
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      placeholder="First name"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-sm text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6] transition-colors"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="account-register-last-name"
                      className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
                    >
                      Last name
                    </label>
                    <input
                      id="account-register-last-name"
                      type="text"
                      autoComplete="family-name"
                      required
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      placeholder="Last name"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-sm text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="account-register-email"
                    className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
                  >
                    Email
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
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-sm text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="account-register-password"
                    className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                    <input
                      id="account-register-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      minLength={5}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="At least 5 characters"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-sm text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6] transition-colors"
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
                  className="w-full mt-2 py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 text-sm font-semibold hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {authLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Create Account</span>
                </button>
              </form>
            )}

            {/* FORGOT PASSWORD FORM */}
            {authMode === 'forgot' && (
              <form onSubmit={handleRecoverPassword} className="space-y-4">
                <div>
                  <label
                    htmlFor="account-recover-email"
                    className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
                  >
                    Email
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
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-sm text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6] transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full mt-2 py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 text-sm font-semibold hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {authLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Send Reset Link</span>
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin')
                      setAuthError(null)
                      setAuthSuccess(null)
                    }}
                    className="text-xs font-medium text-zinc-500 hover:text-zinc-950 dark:hover:text-white cursor-pointer"
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

  // 3. Authenticated State: Clean My Account Page
  const displayName =
    [customer.firstName, customer.lastName].filter(Boolean).join(' ').trim() || customer.email

  return (
    <div className="min-h-[80dvh] bg-zinc-50 dark:bg-[#14161b] py-8 sm:py-12 text-zinc-900 dark:text-zinc-100 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Account Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-zinc-200/80 dark:border-white/[0.08]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
              My Account
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Signed in as <span className="font-medium text-zinc-800 dark:text-zinc-200">{displayName}</span>
              {displayName !== customer.email && (
                <span className="text-zinc-400 dark:text-zinc-500"> ({customer.email})</span>
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.1] bg-white dark:bg-[#1c1e24] text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-400 hover:border-red-500/30 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div
          role="tablist"
          aria-label="Account sections"
          className="flex items-center gap-2 border-b border-zinc-200/80 dark:border-white/[0.08] mb-8"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'orders'}
            onClick={() => setActiveTab('orders')}
            className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-[#0d5d50] dark:border-[#38e8c6] text-zinc-950 dark:text-white'
                : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Orders</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-zinc-100 dark:bg-[#1c1e24] text-zinc-600 dark:text-zinc-400">
              {orders.length}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'addresses'}
            onClick={() => setActiveTab('addresses')}
            className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'addresses'
                ? 'border-[#0d5d50] dark:border-[#38e8c6] text-zinc-950 dark:text-white'
                : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Addresses</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-zinc-100 dark:bg-[#1c1e24] text-zinc-600 dark:text-zinc-400">
              {addresses.length}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
            className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-[#0d5d50] dark:border-[#38e8c6] text-zinc-950 dark:text-white'
                : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>
        </div>

        {/* 1. ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] p-12 text-center space-y-3">
                <ShoppingBag className="w-8 h-8 text-zinc-400 mx-auto" />
                <div className="text-base font-semibold text-zinc-950 dark:text-white">
                  No orders yet
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                  When you place an order, it will appear here with order details and tracking links.
                </p>
                <div className="pt-2">
                  <Link
                    to="/collections"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 text-xs font-semibold hover:opacity-95 transition-all"
                  >
                    <span>Start Shopping</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] p-5 sm:p-6 shadow-xs space-y-4"
                  >
                    {/* Order Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-200/80 dark:border-white/[0.08]">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-base font-bold text-zinc-950 dark:text-white">
                            Order {order.name}
                          </span>
                          <span
                            className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                              order.fulfillmentStatus === 'FULFILLED'
                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                            }`}
                          >
                            {order.fulfillmentStatus || 'Unfulfilled'}
                          </span>
                          {order.financialStatus && (
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-[#14161b] text-zinc-600 dark:text-zinc-400">
                              {order.financialStatus}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                          Placed on{' '}
                          {new Date(order.processedAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-base font-bold text-zinc-950 dark:text-white">
                          ${parseFloat(order.totalPrice.amount).toFixed(2)} {order.totalPrice.currencyCode}
                        </div>
                        {order.statusUrl && (
                          <a
                            href={order.statusUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-medium text-[#0d5d50] dark:text-[#38e8c6] hover:underline mt-0.5"
                          >
                            <span>View order status</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Order Line Items */}
                    <div className="divide-y divide-zinc-200/60 dark:divide-white/[0.06]">
                      {order.lineItems?.edges?.map((itemEdge, idx) => {
                        const item = itemEdge.node
                        return (
                          <div
                            key={idx}
                            className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {item.variant?.image?.url ? (
                                <img
                                  src={item.variant.image.url}
                                  alt={item.title}
                                  className="w-12 h-12 object-contain rounded-lg bg-zinc-50 dark:bg-[#14161b] p-1 border border-zinc-200/80 dark:border-white/[0.08] shrink-0"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-[#14161b] flex items-center justify-center text-zinc-400 shrink-0">
                                  <Package className="w-5 h-5" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-zinc-950 dark:text-zinc-100 truncate">
                                  {item.title}
                                </div>
                                {item.variant?.title && item.variant.title !== 'Default Title' && (
                                  <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                                    {item.variant.title}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                Qty: {item.quantity}
                              </div>
                              {item.variant?.price && (
                                <div className="text-sm font-medium text-zinc-950 dark:text-white">
                                  ${parseFloat(item.variant.price.amount).toFixed(2)}
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Tracking Info */}
                    {order.successfulFulfillments && order.successfulFulfillments.length > 0 && (
                      <div className="pt-3 border-t border-zinc-200/80 dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-medium">
                          <Truck className="w-4 h-4" />
                          <span>{order.successfulFulfillments[0].trackingCompany || 'Shipped'}</span>
                        </div>
                        {order.successfulFulfillments[0].trackingInfo?.[0]?.number && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-zinc-500 dark:text-zinc-400">Tracking:</span>
                            <a
                              href={order.successfulFulfillments[0].trackingInfo[0].url || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-[#0d5d50] dark:text-[#38e8c6] hover:underline"
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

        {/* 2. ADDRESSES TAB */}
        {activeTab === 'addresses' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">
                Saved Addresses
              </h2>
              <button
                type="button"
                onClick={openNewAddressModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 text-xs font-semibold hover:opacity-95 transition-all cursor-pointer"
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
                <MapPin className="w-8 h-8 text-zinc-400 mx-auto" />
                <div className="text-base font-semibold text-zinc-950 dark:text-white">
                  No addresses saved
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                  Add a shipping address for faster checkout.
                </p>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={openNewAddressModal}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 text-xs font-semibold hover:opacity-95 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Address</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map(addr => {
                  const isDefault = addr.id === defaultAddressId
                  const isConfirmingDelete = pendingDeleteAddressId === addr.id
                  return (
                    <div
                      key={addr.id}
                      className={`rounded-2xl border p-5 flex flex-col justify-between transition-all bg-white dark:bg-[#1c1e24] ${
                        isDefault
                          ? 'border-[#0d5d50] dark:border-[#38e8c6]'
                          : 'border-zinc-200/80 dark:border-white/[0.08]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="font-semibold text-sm text-zinc-950 dark:text-white">
                            {addr.firstName} {addr.lastName}
                          </span>
                          {isDefault && (
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#0d5d50]/10 dark:bg-[#38e8c6]/10 text-[#0d5d50] dark:text-[#38e8c6]">
                              Default
                            </span>
                          )}
                        </div>

                        <div className="text-sm text-zinc-600 dark:text-zinc-400 space-y-0.5">
                          {addr.company && (
                            <div className="font-medium text-zinc-800 dark:text-zinc-200">
                              {addr.company}
                            </div>
                          )}
                          <div>{addr.address1}</div>
                          {addr.address2 && <div>{addr.address2}</div>}
                          <div>
                            {[addr.city, addr.province, addr.zip].filter(Boolean).join(', ')}
                          </div>
                          <div>{addr.country}</div>
                          {addr.phone && (
                            <div className="text-xs text-zinc-500 dark:text-zinc-400 pt-1">
                              {addr.phone}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-zinc-200/80 dark:border-white/[0.08] flex items-center justify-between text-xs">
                        {isConfirmingDelete ? (
                          <div className="flex items-center gap-2 w-full justify-between">
                            <span className="text-red-600 dark:text-red-400 font-medium">
                              Delete this address?
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setPendingDeleteAddressId(null)}
                                className="px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-white/[0.1] text-zinc-600 dark:text-zinc-300 cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteAddress(addr.id)}
                                className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-medium cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-4">
                              <button
                                type="button"
                                onClick={() => openEditAddressModal(addr)}
                                className="inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
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
                                className="font-medium text-[#0d5d50] dark:text-[#38e8c6] hover:underline cursor-pointer"
                              >
                                Set as default
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

        {/* 3. PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl space-y-6">
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
              <div className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] p-6 space-y-4">
                <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="profile-first-name"
                      className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
                    >
                      First name
                    </label>
                    <input
                      id="profile-first-name"
                      type="text"
                      autoComplete="given-name"
                      required
                      value={profileForm.firstName}
                      onChange={e => setProfileForm({ ...profileForm, firstName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="profile-last-name"
                      className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
                    >
                      Last name
                    </label>
                    <input
                      id="profile-last-name"
                      type="text"
                      autoComplete="family-name"
                      required
                      value={profileForm.lastName}
                      onChange={e => setProfileForm({ ...profileForm, lastName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="profile-email-readonly"
                    className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    id="profile-email-readonly"
                    type="email"
                    disabled
                    value={customer.email}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-zinc-100 dark:bg-[#14161b]/60 text-sm text-zinc-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label
                    htmlFor="profile-phone"
                    className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
                  >
                    Phone (optional)
                  </label>
                  <input
                    id="profile-phone"
                    type="tel"
                    autoComplete="tel"
                    value={profileForm.phone}
                    onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] p-6 space-y-4">
                <div>
                  <h2 className="text-base font-semibold text-zinc-950 dark:text-white">
                    Change Password
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Leave blank to keep your current password.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="profile-new-password"
                      className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
                    >
                      New password
                    </label>
                    <input
                      id="profile-new-password"
                      type="password"
                      autoComplete="new-password"
                      minLength={5}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="New password"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="profile-confirm-password"
                      className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
                    >
                      Confirm new password
                    </label>
                    <input
                      id="profile-confirm-password"
                      type="password"
                      autoComplete="new-password"
                      minLength={5}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className="px-6 py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 text-sm font-semibold hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {profileLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Save Changes</span>
              </button>
            </form>
          </div>
        )}
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
                className="font-semibold text-base text-zinc-950 dark:text-white"
              >
                {editingAddress ? 'Edit Address' : 'Add Address'}
              </h3>
              <button
                type="button"
                onClick={closeAddressModal}
                aria-label="Close address modal"
                className="text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-all p-1 cursor-pointer"
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

            <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="address-first-name"
                    className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                  >
                    First name
                  </label>
                  <input
                    ref={addressFirstInputRef}
                    id="address-first-name"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={addressForm.firstName}
                    onChange={(e) => setAddressForm({ ...addressForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="address-last-name"
                    className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                  >
                    Last name
                  </label>
                  <input
                    id="address-last-name"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={addressForm.lastName}
                    onChange={(e) => setAddressForm({ ...addressForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="address-company"
                  className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                >
                  Company (optional)
                </label>
                <input
                  id="address-company"
                  type="text"
                  autoComplete="organization"
                  value={addressForm.company}
                  onChange={(e) => setAddressForm({ ...addressForm, company: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                />
              </div>

              <div>
                <label
                  htmlFor="address-line1"
                  className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                >
                  Address
                </label>
                <input
                  id="address-line1"
                  type="text"
                  autoComplete="address-line1"
                  required
                  value={addressForm.address1}
                  onChange={(e) => setAddressForm({ ...addressForm, address1: e.target.value })}
                  placeholder="Street address"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                />
              </div>

              <div>
                <label
                  htmlFor="address-line2"
                  className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                >
                  Apartment, suite, etc. (optional)
                </label>
                <input
                  id="address-line2"
                  type="text"
                  autoComplete="address-line2"
                  value={addressForm.address2}
                  onChange={(e) => setAddressForm({ ...addressForm, address2: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label
                    htmlFor="address-city"
                    className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1"
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
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="address-province"
                    className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                  >
                    State / Province
                  </label>
                  <input
                    id="address-province"
                    type="text"
                    autoComplete="address-level1"
                    required
                    value={addressForm.province}
                    onChange={(e) => setAddressForm({ ...addressForm, province: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="address-zip"
                    className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                  >
                    Postal code
                  </label>
                  <input
                    id="address-zip"
                    type="text"
                    autoComplete="postal-code"
                    required
                    value={addressForm.zip}
                    onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="address-country"
                    className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1"
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
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="address-phone"
                    className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                  >
                    Phone (optional)
                  </label>
                  <input
                    id="address-phone"
                    type="tel"
                    autoComplete="tel"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeAddressModal}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-white/[0.12] text-zinc-600 dark:text-zinc-300 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addressLoading}
                  className="px-5 py-2 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
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
