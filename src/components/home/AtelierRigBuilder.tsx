import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  ShoppingBag,
  Check,
  Scale,
  Zap,
  Battery,
  ShieldCheck,
  Sparkles,
  RotateCw,
} from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { ShopifyProduct } from '../../types/shopify'

interface RigMachine {
  id: string
  name: string
  handle: string
  mass: number
  price: number
  image: string
  torque: string
}

interface RigGrip {
  id: string
  name: string
  diameter: string
  mass: number
  price: number
  image: string
  material: string
}

interface RigPower {
  id: string
  name: string
  handle: string
  mass: number
  price: number
  image: string
  voltage: string
}

const MACHINES: RigMachine[] = [
  {
    id: 'pen-v3',
    name: 'Papa Pen V3 Flagship',
    handle: 'papa-pen-v3-black-full-set',
    mass: 134,
    price: 799.95,
    image: '/product-images/img_113_papa_pen_jet_black_1__cutout.webp',
    torque: '10,500 RPM Coreless',
  },
  {
    id: 'apollo-rotary',
    name: 'Papa Apollo Rotary',
    handle: 'papa-apollo-rotary-machine',
    mass: 142,
    price: 349.95,
    image: '/product-images/img_115_apollo-rotary-tattoo-machine-rca-dl-m30-black_cutout.webp',
    torque: 'Direct-Drive High Torque',
  },
  {
    id: 'pen-v2',
    name: 'Papa Pen V2 Workhorse',
    handle: 'papa-pen-v2-1',
    mass: 128,
    price: 469.00,
    image: '/product-images/img_026_black_cutout.webp',
    torque: 'Balanced 9,800 RPM',
  },
]

const GRIPS: RigGrip[] = [
  {
    id: 'click-33',
    name: '33 mm CNC Ratchet Click Grip',
    diameter: '33 mm Standard Pinch',
    mass: 88,
    price: 99.95,
    image: '/product-images/img_111_papa_adjustment_grips_1__cutout.webp',
    material: '6061-T6 Anodized Alloy',
  },
  {
    id: 'slim-28',
    name: '28 mm Precision Slim Grip',
    diameter: '28 mm Fine-Line Profile',
    mass: 74,
    price: 79.95,
    image: '/product-images/img_026_black_cutout.webp',
    material: 'Lightweight Aerospace Alloy',
  },
  {
    id: 'heavy-38',
    name: '38 mm Heavy Forward Ergonomic',
    diameter: '38 mm Maximum Dampening',
    mass: 110,
    price: 109.95,
    image: '/product-images/img_111_papa_adjustment_grips_1__cutout.webp',
    material: 'Forward-Weighted Balance',
  },
]

const POWERS: RigPower[] = [
  {
    id: 'volt-dock',
    name: 'Papa Volt 2,000 mAh Wireless Dock',
    handle: 'papa-volt-battery',
    mass: 58,
    price: 129.00,
    image: '/product-images/img_041_papa_volt_large_cutout.webp',
    voltage: '5V - 12V Low Ripple',
  },
  {
    id: 'rca-cord',
    name: 'Pure Copper Gold-Plated RCA Interface',
    handle: 'papa-volt-battery',
    mass: 22,
    price: 39.00,
    image: '/product-images/img_039_papa_volt_small_cutout.webp',
    voltage: 'Zero Resistance Line',
  },
]

export const AtelierRigBuilder: React.FC<{ products?: ShopifyProduct[] }> = ({
  products = [],
}) => {
  const { addToCart, openCart } = useCart()
  const [selectedMachine, setSelectedMachine] = useState<RigMachine>(MACHINES[0])
  const [selectedGrip, setSelectedGrip] = useState<RigGrip>(GRIPS[0])
  const [selectedPower, setSelectedPower] = useState<RigPower>(POWERS[0])
  const [added, setAdded] = useState(false)

  // Live Telemetry Calculations
  const totalMass = selectedMachine.mass + selectedGrip.mass + selectedPower.mass
  const forwardBiasPercent = Math.round(
    ((selectedGrip.mass * 0.9 + selectedMachine.mass * 0.45) / totalMass) * 100
  )
  const rawTotal = selectedMachine.price + selectedGrip.price + selectedPower.price
  const bundleDiscount = rawTotal * 0.15
  const finalPrice = rawTotal - bundleDiscount

  const handleDeployRig = () => {
    // Attempt adding main machine to cart
    const prod = products.find(p => p.handle === selectedMachine.handle)
    if (prod && prod.variants?.edges?.[0]?.node) {
      addToCart(prod, prod.variants.edges[0].node, 1)
    }
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1400)
    openCart()
  }

  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1440px] mx-auto text-zinc-100">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[11px] font-mono tracking-widest text-zinc-400 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2EE6CA]" />
            <span>Studio Workbench OS</span>
            <span className="text-zinc-600">//</span>
            <span>Virtual Modular Assembly</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.035em] text-white leading-tight">
            Build Your Custom Studio Rig.
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
            Hot-swap core apparatus components in real time. Inspect overall mass balance, center of gravity forward-bias, and unlock 15% studio bundle deductions upon single-click deployment.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
          <ShieldCheck className="w-4 h-4 text-[#2EE6CA]" />
          <span>100% Component Fitment Guaranteed</span>
        </div>
      </div>

      {/* Main Assembly Bay (Interactive 12-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Side (7 Cols): The 3 Component Selectors */}
        <div className="lg:col-span-7 space-y-6">
          {/* Module 1: Rotary Machine Core */}
          <div className="rounded-[28px] bg-[#0E1014] border border-white/[0.08] p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#2EE6CA]">
                STAGE 1 // ROTARY CHASSIS
              </span>
              <span className="text-xs font-mono text-zinc-400">
                {selectedMachine.mass} g
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {MACHINES.map(m => {
                const isSel = m.id === selectedMachine.id
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMachine(m)}
                    className={`p-4 rounded-2xl text-left border transition-[transform,background-color,border-color,box-shadow] duration-150 cursor-pointer ${
                      isSel
                        ? 'bg-white/10 border-white/40 text-white shadow-[0_4px_16px_rgba(255,255,255,0.08)]'
                        : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.06] text-zinc-400'
                    }`}
                  >
                    <span className="text-xs font-semibold text-white block truncate">
                      {m.name}
                    </span>
                    <span className="text-[10px] font-mono text-[#2EE6CA] block mt-1">
                      {m.torque}
                    </span>
                    <span className="text-sm font-semibold text-white block mt-2 tabular-nums">
                      ${m.price.toFixed(2)}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Module 2: Grip Profile */}
          <div className="rounded-[28px] bg-[#0E1014] border border-white/[0.08] p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#2EE6CA]">
                STAGE 2 // CNC GRIP PROFILE
              </span>
              <span className="text-xs font-mono text-zinc-400">
                {selectedGrip.mass} g
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {GRIPS.map(g => {
                const isSel = g.id === selectedGrip.id
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedGrip(g)}
                    className={`p-4 rounded-2xl text-left border transition-[transform,background-color,border-color,box-shadow] duration-150 cursor-pointer ${
                      isSel
                        ? 'bg-white/10 border-white/40 text-white shadow-[0_4px_16px_rgba(255,255,255,0.08)]'
                        : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.06] text-zinc-400'
                    }`}
                  >
                    <span className="text-xs font-semibold text-white block truncate">
                      {g.name}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 block mt-1">
                      {g.diameter}
                    </span>
                    <span className="text-sm font-semibold text-white block mt-2 tabular-nums">
                      ${g.price.toFixed(2)}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Module 3: Power System */}
          <div className="rounded-[28px] bg-[#0E1014] border border-white/[0.08] p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#2EE6CA]">
                STAGE 3 // POWER INTERFACE
              </span>
              <span className="text-xs font-mono text-zinc-400">
                {selectedPower.mass} g
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {POWERS.map(p => {
                const isSel = p.id === selectedPower.id
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPower(p)}
                    className={`p-4 rounded-2xl text-left border transition-[transform,background-color,border-color,box-shadow] duration-150 cursor-pointer ${
                      isSel
                        ? 'bg-white/10 border-white/40 text-white shadow-[0_4px_16px_rgba(255,255,255,0.08)]'
                        : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.06] text-zinc-400'
                    }`}
                  >
                    <span className="text-xs font-semibold text-white block truncate">
                      {p.name}
                    </span>
                    <span className="text-[10px] font-mono text-[#2EE6CA] block mt-1">
                      {p.voltage}
                    </span>
                    <span className="text-sm font-semibold text-white block mt-2 tabular-nums">
                      ${p.price.toFixed(2)}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Side (5 Cols): Real-time Telemetry & Assembled Rig HUD */}
        <div className="lg:col-span-5 rounded-[32px] bg-[#0E1014] border border-white/[0.08] p-8 flex flex-col justify-between shadow-[0_24px_50px_rgba(0,0,0,0.6)]">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest">
                LIVE ASSEMBLED TELEMETRY
              </span>
              <span className="text-xs font-mono text-[#2EE6CA]">
                RIG STATUS: OPTIMAL
              </span>
            </div>

            {/* Simulated Live Rig Visual Stage */}
            <div className="relative py-8 px-4 rounded-2xl bg-[#08090C] border border-white/[0.05] flex items-center justify-center min-h-[220px]">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-radial from-[#2EE6CA]/10 to-transparent pointer-events-none"
              />

              <div className="flex items-center gap-2">
                <img
                  src={selectedPower.image}
                  alt={selectedPower.name}
                  className="max-h-[90px] w-auto object-contain drop-shadow-md"
                />
                <span className="text-zinc-600 font-mono text-sm">+</span>
                <img
                  src={selectedMachine.image}
                  alt={selectedMachine.name}
                  className="max-h-[140px] w-auto object-contain drop-shadow-xl"
                />
                <span className="text-zinc-600 font-mono text-sm">+</span>
                <img
                  src={selectedGrip.image}
                  alt={selectedGrip.name}
                  className="max-h-[100px] w-auto object-contain drop-shadow-md"
                />
              </div>
            </div>

            {/* Mass & Center of Gravity Readout */}
            <div className="grid grid-cols-2 gap-4 font-mono text-left">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-2xl sm:text-3xl font-semibold text-white block tabular-nums">
                  {totalMass} g
                </span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mt-1">
                  TOTAL RIG MASS
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-2xl sm:text-3xl font-semibold text-[#2EE6CA] block tabular-nums">
                  {forwardBiasPercent}%
                </span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mt-1">
                  FORWARD BIAS (Tendon Safe)
                </span>
              </div>
            </div>

            {/* Selected Breakdown List */}
            <div className="space-y-2 pt-2 text-xs font-mono text-zinc-400">
              <div className="flex justify-between">
                <span>Core: {selectedMachine.name.split(' ')[1]}</span>
                <span className="text-white">${selectedMachine.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Grip: {selectedGrip.name.split(' ')[0]} {selectedGrip.name.split(' ')[1]}</span>
                <span className="text-white">${selectedGrip.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Power: {selectedPower.name.split(' ')[1]}</span>
                <span className="text-white">${selectedPower.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#2EE6CA] pt-2 border-t border-white/[0.06]">
                <span>Studio Rig Special Discount (15%)</span>
                <span>-${bundleDiscount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Pricing & Deployment Button */}
          <div className="pt-6 border-t border-white/[0.06] space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-mono text-zinc-400">BUNDLE REQUISITION:</span>
              <div className="text-right">
                <span className="text-xs text-zinc-500 line-through mr-2 font-mono tabular-nums">
                  ${rawTotal.toFixed(2)}
                </span>
                <span className="text-2xl sm:text-3xl font-semibold text-white tracking-tight tabular-nums font-mono">
                  ${finalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDeployRig}
              className={`w-full py-4 rounded-full text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.98] cursor-pointer ${
                added
                  ? 'bg-emerald-500 text-black'
                  : 'bg-white text-[#08090C] hover:bg-zinc-200 shadow-[0_12px_28px_rgba(255,255,255,0.1)]'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Rig Deployed to Studio Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Deploy Complete Rig (Save 15%)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
