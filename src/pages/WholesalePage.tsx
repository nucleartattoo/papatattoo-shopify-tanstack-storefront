import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  ChevronRight,
  ShieldCheck,
  Truck,
  Percent,
  Award,
  Sparkles,
  CheckCircle2,
  Calculator,
  Send,
  Loader2,
  Building2,
  ExternalLink,
  Mail,
  Box,
  Layers,
  ArrowRight,
} from 'lucide-react'

export const WholesalePage: React.FC = () => {
  // Volume Calculator State
  const [cartridgeBoxes, setCartridgeBoxes] = useState<number>(60)
  const [machineUnits, setMachineUnits] = useState<number>(3)
  const [gripUnits, setGripUnits] = useState<number>(8)

  // Calculate Wholesale Discount Tier
  let discountTier = '15% Off'
  let tierLevel = 'Tier 1 · Studio Wholesale'
  let discountPercent = 0.15
  if (cartridgeBoxes >= 100) {
    discountTier = '35% Off'
    tierLevel = 'Tier 3 · Master Partner'
    discountPercent = 0.35
  } else if (cartridgeBoxes >= 50) {
    discountTier = '25% Off'
    tierLevel = 'Tier 2 · Pro Studio'
    discountPercent = 0.25
  }

  // Estimated standard values
  const retailEstimate = cartridgeBoxes * 32 + machineUnits * 380 + gripUnits * 65
  const wholesaleEstimate = Math.round(retailEstimate * (1 - discountPercent))
  const estimatedSavings = retailEstimate - wholesaleEstimate
  const freeShipping = wholesaleEstimate >= 1200

  // Inquiry Form State
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [referenceId, setReferenceId] = useState('')

  const [formData, setFormData] = useState({
    studioName: '',
    contactName: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    website: '',
    hardwareFocus: 'All Apparatus (Cartridges + Machines)',
    orderCadence: 'Monthly Scheduled Restock',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setTimeout(() => {
      setFormLoading(false)
      const randomRef = `PP-B2B-${Math.floor(100000 + Math.random() * 900000)}`
      setReferenceId(randomRef)
      setFormSubmitted(true)
    }, 900)
  }

  const applyCalculatorToForm = () => {
    setFormData(prev => ({
      ...prev,
      message: `${prev.message ? prev.message + '\n' : ''}[Simulated Volume Tier: ${tierLevel} (${discountTier}) | Needles: ${cartridgeBoxes} boxes, Machines: ${machineUnits} units, Grips: ${gripUnits} units]`,
    }))
    const formElement = document.getElementById('wholesale-inquiry-form')
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="py-8 bg-transparent min-h-screen text-zinc-900 dark:text-zinc-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-mono text-zinc-500">
          <Link to="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            HOME
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-zinc-900 dark:text-[#2EE6CA] font-bold uppercase">
            STUDIO WHOLESALE & PROCUREMENT
          </span>
        </nav>

        {/* Hero Header */}
        <div className="border-b border-[#e2dfd8] dark:border-white/[0.08] pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2EE6CA]/30 bg-[#2EE6CA]/10 text-[#0d9488] dark:text-[#2EE6CA] text-xs font-mono font-bold tracking-wider uppercase mb-4">
            <Building2 className="w-3.5 h-3.5 animate-pulse" />
            <span>DIRECT FACTORY WHOLESALE · PROFESSIONAL STUDIOS ONLY</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-zinc-950 dark:text-white">
            PAPA TATTOO <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d9488] via-[#2EE6CA] to-teal-400">
              STUDIO & WHOLESALE SUPPLY
            </span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-mono max-w-2xl leading-relaxed">
            Eliminating secondary reseller markups. We engineer, autoclave-certify, and directly dispatch authentic Papa Tattoo Supply hardware, needle cartridges, and wireless rotary systems to tattoo studios worldwide.
          </p>
        </div>

        {/* 4 Value Proposition Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white/80 dark:bg-[#1e2028] shadow-xs">
            <Percent className="w-6 h-6 text-[#0d9488] dark:text-[#2EE6CA] mb-2" />
            <div className="text-xs font-mono font-bold uppercase text-zinc-900 dark:text-white">
              TIERED STUDIO MARGINS
            </div>
            <div className="text-[11px] font-mono text-zinc-500 mt-1">
              Up to 35% discount on bulk cartridge orders and hardware sets.
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white/80 dark:bg-[#1e2028] shadow-xs">
            <Truck className="w-6 h-6 text-amber-500 mb-2" />
            <div className="text-xs font-mono font-bold uppercase text-zinc-900 dark:text-white">
              PRIORITY AIR FREIGHT
            </div>
            <div className="text-[11px] font-mono text-zinc-500 mt-1">
              Expedited express transit with factory-direct customs documentation.
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white/80 dark:bg-[#1e2028] shadow-xs">
            <ShieldCheck className="w-6 h-6 text-[#0d9488] dark:text-[#2EE6CA] mb-2" />
            <div className="text-xs font-mono font-bold uppercase text-zinc-900 dark:text-white">
              100% EO GAS STERILE
            </div>
            <div className="text-[11px] font-mono text-zinc-500 mt-1">
              Individual medical blister batch certified for clinical safety.
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white/80 dark:bg-[#1e2028] shadow-xs">
            <Award className="w-6 h-6 text-purple-500 mb-2" />
            <div className="text-xs font-mono font-bold uppercase text-zinc-900 dark:text-white">
              FACTORY DIRECT RMA
            </div>
            <div className="text-[11px] font-mono text-zinc-500 mt-1">
              1-Year official manufacturer warranty with rapid machine replacement.
            </div>
          </div>
        </div>

        {/* Dynamic Studio Volume Tier Calculator */}
        <div className="rounded-3xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white/90 dark:bg-[#1a1c24] p-6 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#e2dfd8]/80 dark:border-white/[0.06]">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#0d9488] dark:text-[#2EE6CA] uppercase">
                <Calculator className="w-4 h-4" />
                <span>WHOLESALE VOLUME TIER ESTIMATOR</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white uppercase tracking-tight mt-1">
                STUDIO BULK DISCOUNT CALCULATOR
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-[#0d9488]/10 dark:bg-[#2EE6CA]/15 text-[#0d9488] dark:text-[#2EE6CA] border border-[#2EE6CA]/30">
                {tierLevel}
              </span>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                {discountTier}
              </span>
            </div>
          </div>

          {/* Calculator Sliders & Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
            {/* Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* Slider 1: Cartridge Boxes */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200 uppercase">
                    Needle Cartridges (Boxes of 20)
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-white/[0.08] font-bold text-[#0d9488] dark:text-[#2EE6CA]">
                    {cartridgeBoxes} boxes
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="300"
                  step="5"
                  value={cartridgeBoxes}
                  onChange={e => setCartridgeBoxes(Number(e.target.value))}
                  className="w-full accent-[#0d9488] dark:accent-[#2EE6CA] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                  <span>10 boxes (Studio Trial)</span>
                  <span>50 boxes (25% Tier)</span>
                  <span>100+ boxes (35% Tier)</span>
                </div>
              </div>

              {/* Slider 2: Rotary Machines */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200 uppercase">
                    Precision Rotary Machines (Papa Pen / Apollo)
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-white/[0.08] font-bold text-[#0d9488] dark:text-[#2EE6CA]">
                    {machineUnits} units
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={machineUnits}
                  onChange={e => setMachineUnits(Number(e.target.value))}
                  className="w-full accent-[#0d9488] dark:accent-[#2EE6CA] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                  <span>0 units</span>
                  <span>5 units (Studio Expansion)</span>
                  <span>20 units (Fleet Allocation)</span>
                </div>
              </div>

              {/* Slider 3: Grips */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200 uppercase">
                    Autoclavable Click Grips & Wireless Power
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-white/[0.08] font-bold text-[#0d9488] dark:text-[#2EE6CA]">
                    {gripUnits} units
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  value={gripUnits}
                  onChange={e => setGripUnits(Number(e.target.value))}
                  className="w-full accent-[#0d9488] dark:accent-[#2EE6CA] cursor-pointer"
                />
              </div>
            </div>

            {/* Live Financial Projection Box */}
            <div className="lg:col-span-5 rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-[#eceae4]/50 dark:bg-[#15171e] p-6 flex flex-col justify-between space-y-5">
              <div className="space-y-4 font-mono text-xs">
                <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  ESTIMATED COMMERCIAL SAVINGS
                </div>

                <div className="flex justify-between pb-2 border-b border-[#e2dfd8] dark:border-white/[0.06]">
                  <span className="text-zinc-500">Standard Catalog Total:</span>
                  <span className="text-zinc-700 dark:text-zinc-300 font-bold line-through">
                    ${retailEstimate.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between pb-2 border-b border-[#e2dfd8] dark:border-white/[0.06]">
                  <span className="text-zinc-500">Wholesale Volume Rate:</span>
                  <span className="text-[#0d9488] dark:text-[#2EE6CA] font-bold">
                    -${estimatedSavings.toLocaleString()} ({discountTier})
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm pt-1">
                  <span className="font-bold text-zinc-900 dark:text-white uppercase">
                    Estimated Invoice:
                  </span>
                  <span className="text-xl sm:text-2xl font-black font-mono text-zinc-950 dark:text-white">
                    ${wholesaleEstimate.toLocaleString()}
                  </span>
                </div>

                {/* Freight status */}
                <div className="pt-2">
                  {freeShipping ? (
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>UNLOCKED: Free DHL/FedEx International Air Express</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-zinc-500 text-xs">
                      <Truck className="w-4 h-4" />
                      <span>Add ${(1200 - wholesaleEstimate).toLocaleString()} more to unlock Free Air Express</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={applyCalculatorToForm}
                className="w-full py-3 rounded-xl bg-zinc-950 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 font-mono font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Apply Volume to Inquiry Form</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Studio Wholesale Application Form */}
        <section id="wholesale-inquiry-form" className="max-w-4xl mx-auto scroll-mt-24">
          <div className="rounded-3xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#1e2028] p-8 sm:p-12 shadow-xl dark:shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
            <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#0d9488] dark:text-[#2EE6CA] uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>COMMERCIAL DISPATCH FORM</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white uppercase tracking-tight">
                SUBMIT STUDIO WHOLESALE INQUIRY
              </h2>
              <p className="text-xs font-mono text-zinc-500">
                Direct communication with our central manufacturing team. Inquiries are processed with custom pro-forma invoices within 12-24 business hours.
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-8 sm:p-12 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-center space-y-4 animate-in fade-in zoom-in-95">
                <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-xl font-black font-mono text-zinc-950 dark:text-white uppercase">
                    INQUIRY TRANSMITTED SUCCESSFULLY
                  </h3>
                  <div className="text-xs font-mono text-[#0d9488] dark:text-[#2EE6CA] font-bold">
                    OFFICIAL DISPATCH REF: {referenceId}
                  </div>
                </div>
                <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                  Thank you for registering your studio with Papa Tattoo Supply. Our factory wholesale liaison will review your target volume, generate your studio tiered pricing sheet, and contact you via email/WhatsApp shortly.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="px-5 py-2.5 rounded-xl bg-zinc-900 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 text-xs font-mono font-bold uppercase cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    Submit Another Inquiry
                  </button>
                  <Link
                    to="/products"
                    className="px-5 py-2.5 rounded-xl border border-zinc-300 dark:border-white/20 text-xs font-mono font-bold uppercase hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-colors"
                  >
                    Browse Apparatus Catalog
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-300 font-bold uppercase mb-1">
                      Studio / Parlor / Business Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.studioName}
                      onChange={e => setFormData({ ...formData, studioName: e.target.value })}
                      placeholder="e.g. Iron Ink Tattoo Collective"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dfd8] dark:border-white/10 bg-zinc-50/80 dark:bg-white/[0.04] text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:border-[#2EE6CA]"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-300 font-bold uppercase mb-1">
                      Contact Person / Lead Artist *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contactName}
                      onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                      placeholder="Full Name"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dfd8] dark:border-white/10 bg-zinc-50/80 dark:bg-white/[0.04] text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:border-[#2EE6CA]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-300 font-bold uppercase mb-1">
                      Business Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="orders@ironinktattoo.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dfd8] dark:border-white/10 bg-zinc-50/80 dark:bg-white/[0.04] text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:border-[#2EE6CA]"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-300 font-bold uppercase mb-1">
                      WhatsApp / Phone (with Country Code) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 019-2834"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dfd8] dark:border-white/10 bg-zinc-50/80 dark:bg-white/[0.04] text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:border-[#2EE6CA]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-300 font-bold uppercase mb-1">
                      Country & City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.country}
                      onChange={e => setFormData({ ...formData, country: e.target.value })}
                      placeholder="e.g. Germany, Berlin"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dfd8] dark:border-white/10 bg-zinc-50/80 dark:bg-white/[0.04] text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:border-[#2EE6CA]"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-300 font-bold uppercase mb-1">
                      Studio Instagram / Website
                    </label>
                    <input
                      type="text"
                      value={formData.website}
                      onChange={e => setFormData({ ...formData, website: e.target.value })}
                      placeholder="@yourstudiotattoo / https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dfd8] dark:border-white/10 bg-zinc-50/80 dark:bg-white/[0.04] text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:border-[#2EE6CA]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-300 font-bold uppercase mb-1">
                      Primary Apparatus Focus
                    </label>
                    <select
                      value={formData.hardwareFocus}
                      onChange={e => setFormData({ ...formData, hardwareFocus: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dfd8] dark:border-white/10 bg-zinc-50/80 dark:bg-[#16181e] text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:border-[#2EE6CA]"
                    >
                      <option>All Apparatus (Cartridges + Machines + Grips)</option>
                      <option>Papa Needle Cartridges (Premium & Standard)</option>
                      <option>Papa Rotary Machines & Battery Systems</option>
                      <option>6061-T6 Autoclavable Click Grips</option>
                      <option>Custom OEM Blister Packaging Project</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-700 dark:text-zinc-300 font-bold uppercase mb-1">
                      Expected Order Cadence
                    </label>
                    <select
                      value={formData.orderCadence}
                      onChange={e => setFormData({ ...formData, orderCadence: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dfd8] dark:border-white/10 bg-zinc-50/80 dark:bg-[#16181e] text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:border-[#2EE6CA]"
                    >
                      <option>Monthly Scheduled Restock</option>
                      <option>Bi-Weekly Rapid Studio Allocation</option>
                      <option>Quarterly Bulk Container Shipment</option>
                      <option>One-Time Studio Setup / Convention Stock</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-700 dark:text-zinc-300 font-bold uppercase mb-1">
                    Specific Configurations / Notes
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="List required needle sizes (e.g. 1203RL, 1007CM), desired machine strokes (3.5mm / 4.0mm), or tax/reseller exemption details..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2dfd8] dark:border-white/10 bg-zinc-50/80 dark:bg-white/[0.04] text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:border-[#2EE6CA]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full py-4 rounded-xl bg-zinc-950 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_24px_rgba(46,230,202,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>DISPATCHING PRO-FORMA INQUIRY...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>SUBMIT STUDIO WHOLESALE APPLICATION</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Direct Channels Strip */}
        <div className="rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white/80 dark:bg-[#1e2028] p-7 flex flex-wrap items-center justify-between gap-6 shadow-xs">
          <div>
            <div className="text-xs font-mono font-bold text-zinc-950 dark:text-zinc-200 uppercase tracking-wider">
              NEED URGENT FACTORY QUOTATION?
            </div>
            <div className="text-xs text-zinc-500 mt-1 font-mono">
              Direct liaison communication for immediate convention logistics or custom OEM inquiries.
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
            <a
              href="mailto:papatattoosupply@gmail.com"
              className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-[#2ee6ca] transition-colors"
            >
              <Mail className="w-4 h-4 text-[#0d9488] dark:text-[#2ee6ca]" />
              <span>papatattoosupply@gmail.com</span>
            </a>

            <a
              href="https://instagram.com/papatattoosupply"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-[#2ee6ca] transition-colors"
            >
              <svg className="w-4 h-4 text-[#0d9488] dark:text-[#2ee6ca]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
              <span>@papatattoosupply</span>
            </a>

            <a
              href="https://www.papatattoo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-[#2ee6ca] transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-[#0d9488] dark:text-[#2ee6ca]" />
              <span>www.papatattoo.com</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
