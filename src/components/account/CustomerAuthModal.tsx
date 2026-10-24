import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  loginCustomer,
  registerCustomer,
  getCustomerProfile,
  recoverCustomerPassword,
  CustomerProfile,
} from '../../lib/shopify'
import { useDialogAccessibility } from '../../hooks/useDialogAccessibility'
import {
  X,
  User,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react'

interface CustomerAuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'signin' | 'register'
  onAuthSuccess?: (customer: CustomerProfile) => void
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  onAuthSuccess,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null)
  const initialInputRef = useRef<HTMLInputElement>(null)
  const [mode, setMode] = useState<'signin' | 'register' | 'forgot'>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode)
      setErrorMessage(null)
      setSuccessMessage(null)
    }
  }, [isOpen, initialMode])

  useDialogAccessibility({
    isOpen,
    onClose,
    dialogRef,
    initialFocusRef: initialInputRef,
  })

  if (!isOpen || typeof document === 'undefined') return null

  const handleResetState = () => {
    setErrorMessage(null)
    setSuccessMessage(null)
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const tokenObj = await loginCustomer(email.trim(), password)
      localStorage.setItem('shopify_customer_token', tokenObj.accessToken)
      localStorage.setItem('shopify_customer_token_exp', tokenObj.expiresAt)

      const fetchedProfile = await getCustomerProfile(tokenObj.accessToken)
      const profile: CustomerProfile = fetchedProfile || {
        id: 'customer',
        email: email.trim(),
        firstName: '',
        lastName: '',
      }

      localStorage.setItem('shopify_customer_profile', JSON.stringify(profile))
      if (onAuthSuccess) {
        onAuthSuccess(profile)
      }

      setSuccessMessage('Sign in successful! Welcome back.')
      setTimeout(() => {
        handleResetState()
        onClose()
      }, 600)
    } catch (err: any) {
      const msg = err.message || ''
      if (
        msg.toLowerCase().includes('unidentified') ||
        msg.toLowerCase().includes('credential') ||
        msg.toLowerCase().includes('password')
      ) {
        setErrorMessage(
          'Invalid credentials. If you had an account on our previous website, please click "Forgot password?" below to activate your account.'
        )
      } else {
        setErrorMessage(msg || 'Failed to sign in. Please verify your email and password.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    if (password.length < 5) {
      setErrorMessage('Password must be at least 5 characters.')
      setLoading(false)
      return
    }

    try {
      await registerCustomer(firstName.trim(), lastName.trim(), email.trim(), password)
      setSuccessMessage('Account created successfully! Signing in...')

      const tokenObj = await loginCustomer(email.trim(), password)
      localStorage.setItem('shopify_customer_token', tokenObj.accessToken)

      const profile = await getCustomerProfile(tokenObj.accessToken)
      if (profile) {
        localStorage.setItem('shopify_customer_profile', JSON.stringify(profile))
        if (onAuthSuccess) {
          onAuthSuccess(profile)
        }
      }

      setTimeout(() => {
        onClose()
      }, 1200)
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Account registration failed. This email may already be registered.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      await recoverCustomerPassword(email.trim())
      setSuccessMessage('Password reset email dispatched! Please check your inbox.')
    } catch {
      setErrorMessage('Failed to request password reset.')
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200 motion-reduce:animate-none"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="customer-auth-modal-title"
        tabIndex={-1}
        className="relative w-full max-w-md rounded-2xl border border-zinc-200/80 dark:border-white/[0.1] bg-white dark:bg-[#1c1e24] shadow-2xl p-6 sm:p-7 overflow-hidden outline-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-200/80 dark:border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0d5d50]/10 dark:bg-[#38e8c6]/12 border border-[#0d5d50]/20 dark:border-[#38e8c6]/25 flex items-center justify-center text-[#0d5d50] dark:text-[#38e8c6]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6] uppercase tracking-wider">
                STUDIO BUYER PORTAL
              </div>
              <h3
                id="customer-auth-modal-title"
                className="font-['Montserrat',sans-serif] text-base font-black uppercase text-zinc-950 dark:text-white tracking-tight"
              >
                {mode === 'signin' && 'Customer Sign In'}
                {mode === 'register' && 'Create Buyer Account'}
                {mode === 'forgot' && 'Reset Password'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close authentication modal"
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-zinc-200 dark:border-white/[0.1] text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#14161b] active:scale-95 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        {mode !== 'forgot' && (
          <div className="flex rounded-xl bg-zinc-100 dark:bg-[#14161b] border border-zinc-200/70 dark:border-white/[0.06] p-1 mb-5 font-mono text-xs">
            <button
              type="button"
              onClick={() => {
                setMode('signin')
                handleResetState()
              }}
              className={`flex-1 py-2 rounded-lg font-bold transition-colors cursor-pointer ${
                mode === 'signin'
                  ? 'bg-white dark:bg-[#1c1e24] text-zinc-950 dark:text-[#38e8c6] shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register')
                handleResetState()
              }}
              className={`flex-1 py-2 rounded-lg font-bold transition-colors cursor-pointer ${
                mode === 'register'
                  ? 'bg-white dark:bg-[#1c1e24] text-zinc-950 dark:text-[#38e8c6] shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Status Alerts */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-4 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 text-xs flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="mb-4 p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs flex items-start gap-2"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 1. SIGN IN FORM */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label
                htmlFor="auth-signin-email"
                className="block text-[11px] font-mono font-bold uppercase text-zinc-600 dark:text-zinc-400 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={initialInputRef}
                  id="auth-signin-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="artist@tattoo.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-xs font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="auth-signin-password"
                  className="block text-[11px] font-mono font-bold uppercase text-zinc-600 dark:text-zinc-400"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot')
                    handleResetState()
                  }}
                  className="text-[11px] font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6] hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="auth-signin-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-xs font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 font-mono font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In To Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* 2. CREATE ACCOUNT FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="auth-register-first-name"
                  className="block text-[11px] font-mono font-bold uppercase text-zinc-600 dark:text-zinc-400 mb-1.5"
                >
                  First Name
                </label>
                <input
                  ref={initialInputRef}
                  id="auth-register-first-name"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Alex"
                  className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-xs font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                />
              </div>
              <div>
                <label
                  htmlFor="auth-register-last-name"
                  className="block text-[11px] font-mono font-bold uppercase text-zinc-600 dark:text-zinc-400 mb-1.5"
                >
                  Last Name
                </label>
                <input
                  id="auth-register-last-name"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Ink"
                  className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-xs font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="auth-register-email"
                className="block text-[11px] font-mono font-bold uppercase text-zinc-600 dark:text-zinc-400 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="auth-register-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="artist@tattoo.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-xs font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="auth-register-password"
                className="block text-[11px] font-mono font-bold uppercase text-zinc-600 dark:text-zinc-400 mb-1.5"
              >
                Password (min 5 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="auth-register-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={5}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-xs font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 font-mono font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <span>Create Free Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* 3. FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgot} className="space-y-4">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Enter your registered email address below. We&apos;ll send an official Shopify link to
              reset your customer password.
            </p>

            <div>
              <label
                htmlFor="auth-forgot-email"
                className="block text-[11px] font-mono font-bold uppercase text-zinc-600 dark:text-zinc-400 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={initialInputRef}
                  id="auth-forgot-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="artist@tattoo.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-zinc-200 dark:border-white/[0.1] bg-zinc-50 dark:bg-[#14161b] text-xs font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 font-mono font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Instructions...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Email</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('signin')
                handleResetState()
              }}
              className="w-full text-center text-xs font-mono text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
            >
              ← Back to Sign In
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body
  )
}
