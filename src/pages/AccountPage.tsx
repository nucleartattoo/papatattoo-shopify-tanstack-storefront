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
  X,
  ChevronRight,
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
      <div className="min-h-[75dvh] bg-[#f5f5f7] dark:bg-black flex flex-col items-center justify-center py-24 text-[#1d1d1f] dark:text-[#f5f5f7]">
        <Loader2 className="w-6 h-6 text-[#1d1d1f] dark:text-[#f5f5f7] animate-spin mb-3" />
        <span className="text-xs font-medium tracking-wide text-[#86868b]">
          Loading studio account...
        </span>
      </div>
    )
  }

  // 2. Unauthenticated State: Apple Clean Surface Card
  if (!customer) {
    return (
      <div className="min-h-[85dvh] bg-[#f5f5f7] dark:bg-black py-12 sm:py-20 px-4 sm:px-6 text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors duration-200 flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto">
          <div className="rounded-[28px] sm:rounded-[32px] bg-white dark:bg-[#121214] shadow-sm p-6 sm:p-10 border border-black/[0.04] dark:border-white/[0.06]">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.045] dark:bg-white/[0.08] text-[11px] font-medium text-[#86868b] mb-4">
                <span>Studio Account</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-[#1d1d1f] dark:text-[#f5f5f7]">
                {authMode === 'signin' && 'Sign In'}
                {authMode === 'register' && 'Create Account'}
                {authMode === 'forgot' && 'Reset Password'}
              </h1>
              <p className="text-sm text-[#86868b] mt-2 leading-relaxed">
                {authMode === 'signin' && 'Sign in to track orders, manage addresses, and access volume benefits.'}
                {authMode === 'register' && 'Create an account for expedited checkout and parcel tracking.'}
                {authMode === 'forgot' && "Enter your email address and we'll send you a password reset link."}
              </p>
            </div>

            {/* Apple Segmented Pill Switcher */}
            {authMode !== 'forgot' && (
              <div
                role="tablist"
                aria-label="Account access"
                className="grid grid-cols-2 p-1 rounded-full bg-black/[0.05] dark:bg-white/[0.08] mb-6"
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
                  className={`py-2 rounded-full text-xs font-medium text-center active:scale-[0.98] transition-[background-color,color,transform,box-shadow] duration-150 ease-[var(--ease-out-strong)] cursor-pointer ${
                    authMode === 'signin'
                      ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-2xs'
                      : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
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
                  className={`py-2 rounded-full text-xs font-medium text-center active:scale-[0.98] transition-[background-color,color,transform,box-shadow] duration-150 ease-[var(--ease-out-strong)] cursor-pointer ${
                    authMode === 'register'
                      ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-2xs'
                      : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
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
                className="mb-5 p-3.5 rounded-2xl bg-red-500/[0.08] border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{authError}</span>
              </div>
            )}
            {authSuccess && (
              <div
                role="status"
                className="mb-5 p-3.5 rounded-2xl bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{authSuccess}</span>
              </div>
            )}

            {/* SIGN IN FORM */}
            {authMode === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label
                    htmlFor="account-signin-email"
                    className="block text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b] pointer-events-none" />
                    <input
                      id="account-signin-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-11 pr-4 h-12 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] border border-transparent focus:border-black/20 dark:focus:border-white/30 focus:bg-white dark:focus:bg-[#1c1c1e] text-sm text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#86868b] transition-[background-color,border-color] duration-150 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="account-signin-password"
                      className="text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7]"
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
                      className="text-xs font-medium text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150 cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b] pointer-events-none" />
                    <input
                      id="account-signin-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-11 pr-11 h-12 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] border border-transparent focus:border-black/20 dark:focus:border-white/30 focus:bg-white dark:focus:bg-[#1c1c1e] text-sm text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#86868b] transition-[background-color,border-color] duration-150 outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white p-1 transition-colors duration-150 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full mt-2 h-12 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-sm font-medium hover:opacity-85 active:scale-[0.98] transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 shadow-xs"
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
                      className="block text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5"
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
                      className="w-full px-4 h-12 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] border border-transparent focus:border-black/20 dark:focus:border-white/30 focus:bg-white dark:focus:bg-[#1c1c1e] text-sm text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#86868b] transition-[background-color,border-color] duration-150 outline-hidden"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="account-register-last-name"
                      className="block text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5"
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
                      className="w-full px-4 h-12 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] border border-transparent focus:border-black/20 dark:focus:border-white/30 focus:bg-white dark:focus:bg-[#1c1c1e] text-sm text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#86868b] transition-[background-color,border-color] duration-150 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="account-register-email"
                    className="block text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b] pointer-events-none" />
                    <input
                      id="account-register-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-11 pr-4 h-12 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] border border-transparent focus:border-black/20 dark:focus:border-white/30 focus:bg-white dark:focus:bg-[#1c1c1e] text-sm text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#86868b] transition-[background-color,border-color] duration-150 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="account-register-password"
                    className="block text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b] pointer-events-none" />
                    <input
                      id="account-register-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      minLength={5}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="At least 5 characters"
                      className="w-full pl-11 pr-11 h-12 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] border border-transparent focus:border-black/20 dark:focus:border-white/30 focus:bg-white dark:focus:bg-[#1c1c1e] text-sm text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#86868b] transition-[background-color,border-color] duration-150 outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white p-1 transition-colors duration-150 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full mt-2 h-12 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-sm font-medium hover:opacity-85 active:scale-[0.98] transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 shadow-xs"
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
                    className="block text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b] pointer-events-none" />
                    <input
                      id="account-recover-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-11 pr-4 h-12 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] border border-transparent focus:border-black/20 dark:focus:border-white/30 focus:bg-white dark:focus:bg-[#1c1c1e] text-sm text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#86868b] transition-[background-color,border-color] duration-150 outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full mt-2 h-12 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-sm font-medium hover:opacity-85 active:scale-[0.98] transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 shadow-xs"
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
                    className="text-xs font-medium text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150 cursor-pointer"
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

  // 3. Authenticated State: Apple Clean Portal
  const displayName =
    [customer.firstName, customer.lastName].filter(Boolean).join(' ').trim() || customer.email

  return (
    <div className="min-h-[85dvh] bg-[#f5f5f7] dark:bg-black py-10 sm:py-16 text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Account Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-8 border-b border-black/[0.05] dark:border-white/[0.08]">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-[-0.035em] text-[#1d1d1f] dark:text-[#f5f5f7]">
              Account
            </h1>
            <p className="text-sm text-[#86868b]">
              Signed in as <span className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">{displayName}</span>
              {displayName !== customer.email && (
                <span className="text-[#86868b]"> ({customer.email})</span>
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/[0.045] hover:bg-black/[0.08] dark:bg-white/[0.08] dark:hover:bg-white/[0.12] text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] active:scale-[0.98] transition-[background-color,transform] duration-150 ease-[var(--ease-out-strong)] cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-[#86868b]" />
            <span>Sign out</span>
          </button>
        </div>

        {/* Navigation Tabs - Segmented Pill Bar */}
        <div
          role="tablist"
          aria-label="Account sections"
          className="inline-flex items-center p-1 rounded-full bg-black/[0.05] dark:bg-white/[0.08] mb-8"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'orders'}
            onClick={() => setActiveTab('orders')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium active:scale-[0.98] transition-[background-color,color,transform,box-shadow] duration-150 ease-[var(--ease-out-strong)] cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-2xs'
                : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Orders</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] tabular-nums bg-black/[0.05] dark:bg-white/[0.1] text-[#86868b]">
              {orders.length}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'addresses'}
            onClick={() => setActiveTab('addresses')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium active:scale-[0.98] transition-[background-color,color,transform,box-shadow] duration-150 ease-[var(--ease-out-strong)] cursor-pointer ${
              activeTab === 'addresses'
                ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-2xs'
                : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Addresses</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] tabular-nums bg-black/[0.05] dark:bg-white/[0.1] text-[#86868b]">
              {addresses.length}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium active:scale-[0.98] transition-[background-color,color,transform,box-shadow] duration-150 ease-[var(--ease-out-strong)] cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-2xs'
                : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>
        </div>

        {/* 1. ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="rounded-[28px] bg-white dark:bg-[#121214] p-12 sm:p-16 text-center space-y-4 border border-black/[0.04] dark:border-white/[0.06] shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center mx-auto text-[#86868b]">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                  No orders yet
                </div>
                <p className="text-sm text-[#86868b] max-w-sm mx-auto leading-relaxed">
                  When you place an order, it will appear here with shipping updates and live tracking details.
                </p>
                <div className="pt-2">
                  <Link
                    to="/collections"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-xs font-medium hover:opacity-85 active:scale-[0.98] transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] shadow-xs"
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
                    className="rounded-[24px] sm:rounded-[28px] bg-white dark:bg-[#121214] p-6 sm:p-7 shadow-xs border border-black/[0.04] dark:border-white/[0.06] space-y-5"
                  >
                    {/* Order Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-black/[0.04] dark:border-white/[0.06]">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <span className="text-base font-semibold tabular-nums text-[#1d1d1f] dark:text-[#f5f5f7]">
                            Order {order.name}
                          </span>
                          <span
                            className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
                              order.fulfillmentStatus === 'FULFILLED'
                                ? 'bg-emerald-500/[0.1] text-emerald-600 dark:text-emerald-400'
                                : 'bg-amber-500/[0.1] text-amber-700 dark:text-amber-400'
                            }`}
                          >
                            {order.fulfillmentStatus || 'Unfulfilled'}
                          </span>
                          {order.financialStatus && (
                            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-[#86868b]">
                              {order.financialStatus}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#86868b]">
                          Placed on{' '}
                          {new Date(order.processedAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-base font-semibold tabular-nums whitespace-nowrap text-[#1d1d1f] dark:text-[#f5f5f7]">
                          ${parseFloat(order.totalPrice.amount).toFixed(2)} {order.totalPrice.currencyCode}
                        </div>
                        {order.statusUrl && (
                          <a
                            href={order.statusUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-medium text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150 mt-0.5"
                          >
                            <span>View order status</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Order Line Items */}
                    <div className="divide-y divide-black/[0.04] dark:divide-white/[0.06]">
                      {order.lineItems?.edges?.map((itemEdge, idx) => {
                        const item = itemEdge.node
                        return (
                          <div
                            key={idx}
                            className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              {item.variant?.image?.url ? (
                                <img
                                  src={item.variant.image.url}
                                  alt={item.title}
                                  className="w-12 h-12 object-contain rounded-2xl bg-[#f5f5f7] dark:bg-[#1a1a1c] p-1.5 shrink-0"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] dark:bg-[#1a1a1c] flex items-center justify-center text-[#86868b] shrink-0">
                                  <Package className="w-5 h-5" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7] truncate">
                                  {item.title}
                                </div>
                                {item.variant?.title && item.variant.title !== 'Default Title' && (
                                  <div className="text-xs text-[#86868b] truncate mt-0.5">
                                    {item.variant.title}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="text-right shrink-0 tabular-nums">
                              <div className="text-xs text-[#86868b]">
                                Qty: {item.quantity}
                              </div>
                              {item.variant?.price && (
                                <div className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] whitespace-nowrap mt-0.5">
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
                      <div className="pt-3 border-t border-black/[0.04] dark:border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                          <Truck className="w-4 h-4" />
                          <span>{order.successfulFulfillments[0].trackingCompany || 'Shipped'}</span>
                        </div>
                        {order.successfulFulfillments[0].trackingInfo?.[0]?.number && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[#86868b]">Tracking:</span>
                            <a
                              href={order.successfulFulfillments[0].trackingInfo[0].url || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium tabular-nums text-[#1d1d1f] dark:text-[#f5f5f7] hover:underline"
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
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-[#f5f5f7]">
                Saved Addresses
              </h2>
              <button
                type="button"
                onClick={openNewAddressModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-xs font-medium hover:opacity-85 active:scale-[0.98] transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            </div>

            {addressError && !isAddressModalOpen && (
              <div
                role="alert"
                className="p-3.5 rounded-2xl bg-red-500/[0.08] border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{addressError}</span>
              </div>
            )}

            {addresses.length === 0 ? (
              <div className="rounded-[28px] bg-white dark:bg-[#121214] p-12 sm:p-16 text-center space-y-4 border border-black/[0.04] dark:border-white/[0.06] shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center mx-auto text-[#86868b]">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                  No addresses saved
                </div>
                <p className="text-sm text-[#86868b] max-w-sm mx-auto leading-relaxed">
                  Add a studio shipping address for faster, streamlined checkout.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={openNewAddressModal}
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-xs font-medium hover:opacity-85 active:scale-[0.98] transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] cursor-pointer shadow-xs"
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
                      className={`rounded-[24px] p-6 flex flex-col justify-between transition-all duration-150 bg-white dark:bg-[#121214] shadow-xs border ${
                        isDefault
                          ? 'border-[#1d1d1f] dark:border-white/40 ring-1 ring-black/[0.06] dark:ring-white/[0.1]'
                          : 'border-black/[0.04] dark:border-white/[0.06]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-semibold text-sm text-[#1d1d1f] dark:text-[#f5f5f7]">
                            {addr.firstName} {addr.lastName}
                          </span>
                          {isDefault && (
                            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-black/[0.05] dark:bg-white/[0.1] text-[#1d1d1f] dark:text-white">
                              Default
                            </span>
                          )}
                        </div>

                        <div className="text-sm text-[#86868b] space-y-1">
                          {addr.company && (
                            <div className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
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
                            <div className="text-xs tabular-nums text-[#86868b] pt-1">
                              {addr.phone}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between text-xs">
                        {isConfirmingDelete ? (
                          <div className="flex items-center gap-2 w-full justify-between">
                            <span className="text-red-600 dark:text-red-400 font-medium">
                              Delete this address?
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setPendingDeleteAddressId(null)}
                                className="px-3 py-1 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7] active:scale-[0.98] transition-transform duration-150 cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteAddress(addr.id)}
                                className="px-3 py-1 rounded-full bg-red-600 text-white font-medium active:scale-[0.98] transition-transform duration-150 cursor-pointer"
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
                                className="inline-flex items-center gap-1.5 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors duration-150 cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setPendingDeleteAddressId(addr.id)}
                                className="inline-flex items-center gap-1.5 text-red-600 dark:text-red-400 hover:opacity-80 transition-opacity duration-150 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>

                            {!isDefault && (
                              <button
                                type="button"
                                onClick={() => handleSetDefaultAddress(addr.id)}
                                className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7] hover:underline cursor-pointer"
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
                className="p-3.5 rounded-2xl bg-red-500/[0.08] border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{profileError}</span>
              </div>
            )}
            {profileSuccess && (
              <div
                role="status"
                className="p-3.5 rounded-2xl bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{profileSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="rounded-[28px] bg-white dark:bg-[#121214] p-6 sm:p-8 shadow-xs border border-black/[0.04] dark:border-white/[0.06] space-y-5">
                <h2 className="text-base font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-[#f5f5f7]">
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="profile-first-name"
                      className="block text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5"
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
                      className="w-full px-4 h-12 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] border border-transparent focus:border-black/20 dark:focus:border-white/30 focus:bg-white dark:focus:bg-[#1c1c1e] text-sm text-[#1d1d1f] dark:text-[#f5f5f7] transition-[background-color,border-color] duration-150 outline-hidden"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="profile-last-name"
                      className="block text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5"
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
                      className="w-full px-4 h-12 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] border border-transparent focus:border-black/20 dark:focus:border-white/30 focus:bg-white dark:focus:bg-[#1c1c1e] text-sm text-[#1d1d1f] dark:text-[#f5f5f7] transition-[background-color,border-color] duration-150 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="profile-email-readonly"
                    className="block text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    id="profile-email-readonly"
                    type="email"
                    disabled
                    value={customer.email}
                    className="w-full px-4 h-12 rounded-2xl bg-black/[0.025] dark:bg-white/[0.04] text-sm text-[#86868b] cursor-not-allowed outline-hidden"
                  />
                </div>

                <div>
                  <label
                    htmlFor="profile-phone"
                    className="block text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5"
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
                    className="w-full px-4 h-12 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] border border-transparent focus:border-black/20 dark:focus:border-white/30 focus:bg-white dark:focus:bg-[#1c1c1e] text-sm tabular-nums text-[#1d1d1f] dark:text-[#f5f5f7] transition-[background-color,border-color] duration-150 outline-hidden"
                  />
                </div>
              </div>

              <div className="rounded-[28px] bg-white dark:bg-[#121214] p-6 sm:p-8 shadow-xs border border-black/[0.04] dark:border-white/[0.06] space-y-5">
                <div>
                  <h2 className="text-base font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-[#f5f5f7]">
                    Change Password
                  </h2>
                  <p className="text-xs text-[#86868b] mt-1">
                    Leave blank to keep your current password.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="profile-new-password"
                      className="block text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5"
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
                      className="w-full px-4 h-12 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] border border-transparent focus:border-black/20 dark:focus:border-white/30 focus:bg-white dark:focus:bg-[#1c1c1e] text-sm text-[#1d1d1f] dark:text-[#f5f5f7] transition-[background-color,border-color] duration-150 outline-hidden"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="profile-confirm-password"
                      className="block text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1.5"
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
                      className="w-full px-4 h-12 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] border border-transparent focus:border-black/20 dark:focus:border-white/30 focus:bg-white dark:focus:bg-[#1c1c1e] text-sm text-[#1d1d1f] dark:text-[#f5f5f7] transition-[background-color,border-color] duration-150 outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className="px-8 h-12 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-sm font-medium hover:opacity-85 active:scale-[0.98] transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 shadow-xs"
              >
                {profileLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Save Changes</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ADDRESS MODAL (Add / Edit) - Apple Glass Floating Dialog */}
      {isAddressModalOpen && (
        <div
          onClick={closeAddressModal}
          className="fixed inset-0 z-50 bg-black/40 dark:bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 ease-[var(--ease-out-strong)] motion-reduce:animate-none"
        >
          <div
            ref={addressDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-address-modal-title"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-[28px] sm:rounded-[32px] bg-white dark:bg-[#1c1c1e] shadow-2xl p-6 sm:p-8 space-y-5 outline-hidden border border-black/[0.04] dark:border-white/[0.08] animate-in zoom-in-95 fade-in duration-200 ease-[var(--ease-out-strong)] motion-reduce:animate-none"
          >
            <div className="flex items-center justify-between pb-4 border-b border-black/[0.05] dark:border-white/[0.08]">
              <h3
                id="account-address-modal-title"
                className="font-semibold text-lg tracking-[-0.02em] text-[#1d1d1f] dark:text-[#f5f5f7]"
              >
                {editingAddress ? 'Edit Address' : 'Add Address'}
              </h3>
              <button
                type="button"
                onClick={closeAddressModal}
                aria-label="Close address modal"
                className="p-2 rounded-full bg-black/[0.045] dark:bg-white/[0.08] text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white active:scale-[0.95] transition-[transform,color] duration-150 ease-[var(--ease-out-strong)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {addressError && (
              <div
                role="alert"
                className="p-3.5 rounded-2xl bg-red-500/[0.08] border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{addressError}</span>
              </div>
            )}
            {addressSuccess && (
              <div
                role="status"
                className="p-3.5 rounded-2xl bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{addressSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveAddress} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="address-first-name"
                    className="block text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1"
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
                    className="w-full px-4 h-11 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] border border-transparent focus:border-black/20 dark:focus:border-white/30 focus:bg-white dark:focus:bg-[#2c2c2e] text-sm text-[#1d1d1f] dark:text-[#f5f5f7] transition-[background-color,border-color] duration-150 outline-hidden"
                  />
                </div>
                <div>
                  <label
                    htmlFor="address-last-name"
                    className="block text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1"
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
                    className="w-full px-4 h-11 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] border border-transparent focus:border-black/20 dark:focus:border-white/30 focus:bg-white dark:focus:bg-[#2c2c2e] text-sm text-[#1d1d1f] dark:text-[#f5f5f7] transition-[background-color,border-color] duration-150 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="address-company"
                  className="block text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1"
                >
                  Company (optional)
                </label>
                <input
                  id="address-company"
                  type="text"
                  autoComplete="organization"
                  value={addressForm.company}
                  onChange={(e) => setAddressForm({ ...addressForm, company: e.target.value })}
                  className="w-full px-4 h-11 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] border border-transparent focus:border-black/20 dark:focus:border-white/30 focus:bg-white dark:focus:bg-[#2c2c2e] text-sm text-[#1d1d1f] dark:text-[#f5f5f7] transition-[background-color,border-color] duration-150 outline-hidden"
                />
              </div>

              <div>
                <label
                  htmlFor="address-line1"
                  className="block text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1"
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
                  className="w-full px-4 h-11 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] border border-transparent focus:border-black/20 dark:focus:border-white/30 focus:bg-white dark:focus:bg-[#2c2c2e] text-sm text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#86868b] transition-[background-color,border-color] duration-150 outline-hidden"
                />
              </div>

              <div>
                <label
                  htmlFor="address-line2"
                  className="block text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1"
                >
                  Apartment, suite, etc. (optional)
                </label>
                <input
                  id="address-line2"
                  type="text"
                  autoComplete="address-line2"
                  value={addressForm.address2}
                  onChange={(e) => setAddressForm({ ...addressForm, address2: e.target.value })}
                  className="w-full px-4 h-11 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] border border-transparent focus:border-black/20 dark:focus:border-white/30 focus:bg-white dark:focus:bg-[#2c2c2e] text-sm text-[#1d1d1f] dark:text-[#f5f5f7] transition-[background-color,border-color] duration-150 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label
                    htmlFor="address-city"
                    className="block text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1"
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
                    className="w-full px-4 h-11 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] border border-transparent focus:border-black/20 dark:focus:border-white/30 focus:bg-white dark:focus:bg-[#2c2c2e] text-sm text-[#1d1d1f] dark:text-[#f5f5f7] transition-[background-color,border-color] duration-150 outline-hidden"
                  />
                </div>
                <div>
                  <label
                    htmlFor="address-province"
                    className="block text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1"
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
                    className="w-full px-4 h-11 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] border border-transparent focus:border-black/20 dark:focus:border-white/30 focus:bg-white dark:focus:bg-[#2c2c2e] text-sm text-[#1d1d1f] dark:text-[#f5f5f7] transition-[background-color,border-color] duration-150 outline-hidden"
                  />
                </div>
                <div>
                  <label
                    htmlFor="address-zip"
                    className="block text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1"
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
                    className="w-full px-4 h-11 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] border border-transparent focus:border-black/20 dark:focus:border-white/30 focus:bg-white dark:focus:bg-[#2c2c2e] text-sm tabular-nums text-[#1d1d1f] dark:text-[#f5f5f7] transition-[background-color,border-color] duration-150 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="address-country"
                    className="block text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1"
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
                    className="w-full px-4 h-11 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] border border-transparent focus:border-black/20 dark:focus:border-white/30 focus:bg-white dark:focus:bg-[#2c2c2e] text-sm text-[#1d1d1f] dark:text-[#f5f5f7] transition-[background-color,border-color] duration-150 outline-hidden"
                  />
                </div>
                <div>
                  <label
                    htmlFor="address-phone"
                    className="block text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] mb-1"
                  >
                    Phone (optional)
                  </label>
                  <input
                    id="address-phone"
                    type="tel"
                    autoComplete="tel"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    className="w-full px-4 h-11 rounded-2xl bg-black/[0.045] dark:bg-white/[0.08] border border-transparent focus:border-black/20 dark:focus:border-white/30 focus:bg-white dark:focus:bg-[#2c2c2e] text-sm tabular-nums text-[#1d1d1f] dark:text-[#f5f5f7] transition-[background-color,border-color] duration-150 outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeAddressModal}
                  className="px-5 py-2.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7] font-medium active:scale-[0.98] transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addressLoading}
                  className="px-6 py-2.5 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] font-medium hover:opacity-85 active:scale-[0.98] transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] flex items-center gap-1.5 cursor-pointer disabled:opacity-40 shadow-xs"
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
