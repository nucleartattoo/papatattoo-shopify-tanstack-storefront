import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import {
  loginCustomer,
  registerCustomer,
  getCustomerProfile,
  recoverCustomerPassword,
  CustomerProfile,
} from '../../lib/shopify'
import {
  X,
  User,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
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
  const [mode, setMode] = useState<'signin' | 'register' | 'forgot'>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  if (!isOpen) return null

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
      if (msg.toLowerCase().includes('unidentified') || msg.toLowerCase().includes('credential') || msg.toLowerCase().includes('password')) {
        setErrorMessage('Invalid credentials. If you had an account on our previous website, please click "Forgot password?" below to activate your account.')
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

      // Automatically sign in
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
      setErrorMessage(err.message || 'Account registration failed. This email may already be registered.')
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
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to request password reset.')
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#0E1015] shadow-2xl p-6 sm:p-7 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-100 dark:border-zinc-800/70">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#2EE6CA]/15 flex items-center justify-center text-[#0d9488] dark:text-[#2EE6CA]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold text-[#0d9488] dark:text-[#2EE6CA] uppercase tracking-wider">
                CUSTOMER PORTAL
              </div>
              <h3 className="text-base font-black uppercase text-zinc-950 dark:text-white tracking-tight">
                {mode === 'signin' && 'Customer Sign In'}
                {mode === 'register' && 'Create Buyer Account'}
                {mode === 'forgot' && 'Reset Password'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-zinc-200 dark:border-[#222731] text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#1A1D24] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        {mode !== 'forgot' && (
          <div className="flex rounded-xl bg-zinc-100 dark:bg-[#151821] p-1 mb-5 font-mono text-xs">
            <button
              type="button"
              onClick={() => {
                setMode('signin')
                handleResetState()
              }}
              className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                mode === 'signin'
                  ? 'bg-white dark:bg-[#222735] text-zinc-950 dark:text-[#2EE6CA] shadow-sm'
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
              className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                mode === 'register'
                  ? 'bg-white dark:bg-[#222735] text-zinc-950 dark:text-[#2EE6CA] shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Status Alerts */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 1. SIGN IN FORM */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-zinc-600 dark:text-zinc-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="artist@tattoo.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-zinc-200 dark:border-[#222731] bg-zinc-50 dark:bg-[#14171E] text-xs font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:border-[#2EE6CA]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-mono font-bold uppercase text-zinc-600 dark:text-zinc-400">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot')
                    handleResetState()
                  }}
                  className="text-[11px] font-mono text-[#0d9488] dark:text-[#2EE6CA] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-zinc-200 dark:border-[#222731] bg-zinc-50 dark:bg-[#14171E] text-xs font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:border-[#2EE6CA]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-zinc-950 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 font-mono font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer mt-2"
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
                <label className="block text-[11px] font-mono font-bold uppercase text-zinc-600 dark:text-zinc-400 mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="Alex"
                  className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-[#222731] bg-zinc-50 dark:bg-[#14171E] text-xs font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:border-[#2EE6CA]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Ink"
                  className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-[#222731] bg-zinc-50 dark:bg-[#14171E] text-xs font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:border-[#2EE6CA]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-zinc-600 dark:text-zinc-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="artist@tattoo.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-zinc-200 dark:border-[#222731] bg-zinc-50 dark:bg-[#14171E] text-xs font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:border-[#2EE6CA]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-zinc-600 dark:text-zinc-400 mb-1.5">
                Password (min 5 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={5}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-zinc-200 dark:border-[#222731] bg-zinc-50 dark:bg-[#14171E] text-xs font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:border-[#2EE6CA]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-zinc-950 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 font-mono font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer mt-2"
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
            <p className="text-xs text-zinc-500 leading-relaxed">
              Enter your registered email address below. We'll send an official Shopify link to reset your customer password.
            </p>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-zinc-600 dark:text-zinc-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="artist@tattoo.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-zinc-200 dark:border-[#222731] bg-zinc-50 dark:bg-[#14171E] text-xs font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:border-[#2EE6CA]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-zinc-950 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 font-mono font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer"
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
              className="w-full text-center text-xs font-mono text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
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
