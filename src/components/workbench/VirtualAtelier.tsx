import React, { useState, useEffect, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { ModelViewer3D } from '../common/ModelViewer3D'
import { useCart } from '../../context/CartContext'
import { ShopifyProduct, ShopifyVariant } from '../../types/shopify'
import { getProductByHandle } from '../../lib/shopify'
import {
  Sliders,
  RotateCw,
  Box,
  Sparkles,
  Zap,
  ShoppingBag,
  Volume2,
  VolumeX,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Activity,
} from 'lucide-react'

interface CartridgeOption {
  id: string
  name: string
  handle: string
  series: 'premium' | 'standard'
  color: string
  image: string
  spec: string
  badge: string
}

const CARTRIDGE_OPTIONS: CartridgeOption[] = [
  {
    id: 'premium-round',
    name: 'Papa Premium Round Liner',
    handle: 'papa-premium-tattoo-cartridges',
    series: 'premium',
    color: '#e6b366',
    image: '/product-images/papa-premium-tattoo-cartridges-round-cutout.webp',
    spec: '316L Surgical Steel · #12 0.35mm',
    badge: 'PREMIUM GOLD',
  },
  {
    id: 'standard-round',
    name: 'Papa Standard Round Liner',
    handle: 'papa-standard-tattoo-cartridges',
    series: 'standard',
    color: '#38e8c6',
    image: '/product-images/papa-standard-tattoo-cartridges-round-cutout.webp',
    spec: 'Medical PC Shell · Membrane Sealed',
    badge: 'TITANIUM CYAN',
  },
  {
    id: 'open-tip-mag',
    name: 'Papa Open-Tip Magnum',
    handle: 'papa-open-tip-tattoo-cartridges',
    series: 'standard',
    color: '#a5aab8',
    image: '/product-images/papa-open-tip-tattoo-cartridges-cutout.webp',
    spec: 'Open Reservoir · Saturated Shading',
    badge: 'MAGNUM SATURATION',
  },
]

export const VirtualAtelier: React.FC = () => {
  const { addToCart, openCart } = useCart()

  // Hardware State
  const [selectedCartridge, setSelectedCartridge] = useState<CartridgeOption>(CARTRIDGE_OPTIONS[0])
  const [needleDepth, setNeedleDepth] = useState<number>(3.5)
  const [voltage, setVoltage] = useState<number>(8.5)
  const [isActuating, setIsActuating] = useState<boolean>(false)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false)
  const [cameraView, setCameraView] = useState<'overview' | 'dock' | 'motor'>('overview')
  const [isSnapping, setIsSnapping] = useState<boolean>(false)

  // Real Shopify Product References for one-click add to cart
  const [penProduct, setPenProduct] = useState<ShopifyProduct | null>(null)
  const [cartridgeProduct, setCartridgeProduct] = useState<ShopifyProduct | null>(null)

  // Web Audio Synthesizer for Motor Vibration Sound
  const audioCtxRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)

  // Calculate live motor RPM from voltage
  // Custom German Motor: ~850 RPM per volt
  const calculatedRPM = Math.round(voltage * 850)
  const calculatedHertz = Math.round(calculatedRPM / 60)

  // Fetch real Shopify products
  useEffect(() => {
    async function loadProducts() {
      try {
        const [pen, cart] = await Promise.all([
          getProductByHandle('papa-pen-v2-1'),
          getProductByHandle(selectedCartridge.handle),
        ])
        if (pen) setPenProduct(pen)
        if (cart) setCartridgeProduct(cart)
      } catch (err) {
        console.error('Failed to load workbench products:', err)
      }
    }
    loadProducts()
  }, [selectedCartridge.handle])

  // Handle Audio Synthesis for Motor Testing
  useEffect(() => {
    if (isActuating && soundEnabled) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtx()
        }
        const ctx = audioCtxRef.current
        if (ctx.state === 'suspended') {
          ctx.resume()
        }

        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        // Low frequency hum matching machine frequency (e.g. ~110-160Hz)
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(calculatedHertz, ctx.currentTime)

        // Soft, non-intrusive volume
        gain.gain.setValueAtTime(0.04, ctx.currentTime)

        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()

        oscillatorRef.current = osc
        gainNodeRef.current = gain
      } catch (e) {
        console.warn('Web Audio not supported or blocked:', e)
      }
    } else {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop()
          oscillatorRef.current.disconnect()
        } catch {}
        oscillatorRef.current = null
      }
    }

    return () => {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop()
          oscillatorRef.current.disconnect()
        } catch {}
        oscillatorRef.current = null
      }
    }
  }, [isActuating, soundEnabled, calculatedHertz])

  // Snap-in animation trigger when changing cartridge
  const handleSelectCartridge = (opt: CartridgeOption) => {
    setSelectedCartridge(opt)
    setIsSnapping(true)
    setTimeout(() => setIsSnapping(false), 800)
  }

  // Camera presets
  const getCameraOrbit = () => {
    switch (cameraView) {
      case 'dock':
        return '45deg 85deg 1.8m'
      case 'motor':
        return '-45deg 55deg 1.8m'
      default:
        return '45deg 70deg 2.2m'
    }
  }

  // Add machine to cart
  const handleAddMachineToCart = () => {
    if (penProduct && penProduct.variants?.edges?.[0]?.node) {
      addToCart(penProduct, penProduct.variants.edges[0].node, 1)
      openCart()
    }
  }

  // Pricing calculation
  const penPrice = penProduct ? parseFloat(penProduct.priceRange?.minVariantPrice?.amount || '199') : 199

  return (
    <div className="relative w-full rounded-3xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#20222a]/80 backdrop-blur-xl p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl transition-colors duration-300 group/workbench">
      {/* Ambient Radial Spotlight */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_40%_40%,rgba(56,232,198,0.12)_0%,transparent_70%)] pointer-events-none" />

      {/* Top Header & Mode Indicators */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-8 border-b border-zinc-200/80 dark:border-white/[0.08] gap-4 relative z-10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200/80 dark:border-white/[0.1] bg-zinc-50 dark:bg-white/[0.04] text-[10px] font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6] uppercase tracking-widest">
            <Cpu className="w-3 h-3 text-[#0d5d50] dark:text-[#38e8c6]" />
            <span>PAPA INTERACTIVE WORKBENCH · VIRTUAL ATELIER</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-zinc-950 dark:text-white font-['Montserrat',sans-serif]">
            CUSTOMIZE YOUR APPARATUS
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans">
            Snap in official needle cartridges, calibrate millimeter stroke projection, and simulate continuous German motor actuation.
          </p>
        </div>

        {/* Live Frequency & Audio Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono font-medium transition-colors cursor-pointer ${
              soundEnabled
                ? 'border-[#0d5d50] dark:border-[#38e8c6] text-[#0d5d50] dark:text-[#38e8c6] bg-[#38e8c6]/10'
                : 'border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
            }`}
            title={soundEnabled ? 'Motor Sound Enabled' : 'Enable Machine Hum Simulator'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{soundEnabled ? 'AUDIO ON' : 'AUDIO OFF'}</span>
          </button>

          <div className="px-3.5 py-1.5 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.04] font-mono text-xs font-bold text-zinc-950 dark:text-white">
            <span className="text-[#0d5d50] dark:text-[#38e8c6]">{calculatedHertz} HZ</span> · {calculatedRPM} RPM
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        {/* Left / Center 3D Apparatus Workbench Stage */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
          <div className="relative w-full h-[380px] sm:h-[460px] lg:h-[500px] rounded-3xl bg-zinc-100/70 dark:bg-[#15171e]/70 border border-zinc-200/80 dark:border-white/[0.08] overflow-hidden flex items-center justify-center group/stage shadow-inner">
            {/* Volumetric Studio Lighting Halo */}
            <div
              className="absolute inset-0 transition-opacity duration-700 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 65% 55% at 50% 45%, ${selectedCartridge.color}22 0%, transparent 70%)`,
              }}
            />

            {/* Swiss Precision Datum Markings */}
            <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-1.5 font-mono text-[9px] text-zinc-500/70 dark:text-zinc-400/60 pointer-events-none uppercase tracking-widest">
              <span className="text-[#38e8c6]">+</span>
              <span>WORKBENCH // DOCK 01</span>
            </div>

            <div className="absolute top-3.5 right-3.5 z-20 font-mono text-[9px] text-zinc-500/70 dark:text-zinc-400/60 pointer-events-none uppercase tracking-widest">
              TOLERANCE ±0.005mm
            </div>

            {/* Floating Live 3D Model */}
            <ModelViewer3D
              src="/models/papapenv2.glb"
              poster="/product-images/img_113_papa_pen_jet_black_1__cutout.webp"
              alt="Papa Pen V2 Precision Machine"
              className="w-full h-full"
              autoRotate={!isActuating}
              cameraOrbit={getCameraOrbit()}
            />

            {/* Snap-In Cartridge Holographic Preview Badge */}
            <div
              className={`absolute top-12 left-4 z-20 flex items-center gap-2.5 p-2 rounded-2xl bg-white/95 dark:bg-[#262933]/95 border border-zinc-200 dark:border-white/15 backdrop-blur-md shadow-xl transition-all duration-500 ${
                isSnapping ? 'scale-105 ring-2 ring-[#38e8c6]' : 'scale-100'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-[#1c1e24] p-1 flex items-center justify-center shrink-0">
                <img
                  src={selectedCartridge.image}
                  alt={selectedCartridge.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="pr-2">
                <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#0d5d50] dark:text-[#38e8c6]">
                  SNAPPED IN DOCK
                </div>
                <div className="text-xs font-bold text-zinc-950 dark:text-white font-sans truncate max-w-[140px]">
                  {selectedCartridge.name}
                </div>
              </div>
            </div>

            {/* Bottom Left Camera Presets Bar */}
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1 p-1 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md border border-zinc-200/80 dark:border-white/[0.1] font-mono text-[10px]">
              <button
                type="button"
                onClick={() => setCameraView('overview')}
                className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                  cameraView === 'overview'
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                OVERVIEW
              </button>
              <button
                type="button"
                onClick={() => setCameraView('dock')}
                className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                  cameraView === 'dock'
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                NEEDLE DOCK
              </button>
              <button
                type="button"
                onClick={() => setCameraView('motor')}
                className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                  cameraView === 'motor'
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                MOTOR CHASSIS
              </button>
            </div>

            {/* Pedestal Ground Shadow */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-3/4 max-w-sm h-6 bg-black/60 dark:bg-black/80 blur-xl rounded-[100%] pointer-events-none" />
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1/2 max-w-xs h-2.5 blur-md rounded-[100%] pointer-events-none transition-colors duration-500"
              style={{ backgroundColor: `${selectedCartridge.color}33` }}
            />
          </div>
        </div>

        {/* Right / Workbench Controls & Parameter Tuning Panel */}
        <div className="lg:col-span-5 space-y-7 py-2">
          {/* 1. Snap-in Cartridge Selection Slots */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                01 // COMPATIBLE CARTRIDGE DOCK DEMO
              </span>
              <span className="text-[10px] font-mono text-[#0d5d50] dark:text-[#38e8c6]">
                TEST 3D SNAP-IN FITMENT
              </span>
            </div>

            <div className="space-y-2.5">
              {CARTRIDGE_OPTIONS.map((opt) => {
                const isSelected = selectedCartridge.id === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectCartridge(opt)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 text-left cursor-pointer ${
                      isSelected
                        ? 'border-[#0d5d50] dark:border-[#38e8c6] bg-zinc-100/80 dark:bg-white/[0.08] shadow-sm'
                        : 'border-zinc-200/80 dark:border-white/[0.08] bg-zinc-50/50 dark:bg-white/[0.02] hover:border-zinc-300 dark:hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#1c1e24] p-1 border border-zinc-200/60 dark:border-white/10 flex items-center justify-center shrink-0">
                        <img src={opt.image} alt={opt.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-zinc-950 dark:text-white font-sans truncate">
                          {opt.name}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 truncate">
                          {opt.spec}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300">
                        {opt.badge}
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'border-[#0d5d50] dark:border-[#38e8c6] bg-[#0d5d50] dark:bg-[#38e8c6]'
                            : 'border-zinc-300 dark:border-white/20'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-zinc-950" />}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Direct Gateway to Precision 62-Size Needle Matrix */}
            <Link
              to="/products/$handle"
              params={{ handle: selectedCartridge.handle }}
              className="w-full flex items-center justify-between p-3 rounded-2xl border border-zinc-200/80 dark:border-white/[0.1] bg-zinc-100/60 dark:bg-white/[0.04] hover:border-[#0d5d50] dark:hover:border-[#38e8c6] text-xs font-mono text-zinc-800 dark:text-zinc-200 transition-colors group/mat"
            >
              <span className="flex items-center gap-2 font-bold text-[#0d5d50] dark:text-[#38e8c6]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Select exact needle size from 62 configurations</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/mat:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* 2. Millimeter Stroke Protrusion Dial */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                02 // NEEDLE PROJECTION DEPTH
              </span>
              <span className="text-sm font-black font-mono text-zinc-950 dark:text-white">
                {needleDepth.toFixed(1)} mm
              </span>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min="0.0"
                max="4.2"
                step="0.1"
                value={needleDepth}
                onChange={(e) => setNeedleDepth(parseFloat(e.target.value))}
                className="w-full h-2 rounded-lg bg-zinc-200 dark:bg-white/10 accent-[#0d5d50] dark:accent-[#38e8c6] cursor-pointer"
              />
              <div className="flex justify-between text-[9px] font-mono text-zinc-400">
                <span>0.0mm (Flush)</span>
                <span className="font-bold text-[#0d5d50] dark:text-[#38e8c6]">3.5mm (Standard Stroke)</span>
                <span>4.2mm (Deep Pack)</span>
              </div>
            </div>
          </div>

          {/* 3. Voltage Dial & Actuation Testing */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                03 // VOLTAGE &amp; MOTOR SIMULATOR
              </span>
              <span className="text-sm font-black font-mono text-[#0d5d50] dark:text-[#38e8c6]">
                {voltage.toFixed(1)} V
              </span>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min="6.0"
                max="12.6"
                step="0.1"
                value={voltage}
                onChange={(e) => setVoltage(parseFloat(e.target.value))}
                className="w-full h-2 rounded-lg bg-zinc-200 dark:bg-white/10 accent-[#0d5d50] dark:accent-[#38e8c6] cursor-pointer"
              />
              <div className="flex justify-between text-[9px] font-mono text-zinc-400">
                <span>6.0V (Stippling)</span>
                <span>8.5V (Linework)</span>
                <span>12.6V (Solid Fill)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsActuating(!isActuating)}
              className={`w-full py-2.5 rounded-xl border font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isActuating
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 animate-pulse'
                  : 'border-zinc-300 dark:border-white/15 text-zinc-700 dark:text-zinc-300 hover:border-zinc-500 dark:hover:border-white/30'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{isActuating ? 'MOTOR RUNNING · TEST ACTIVE' : 'TEST MOTOR ACTUATION'}</span>
            </button>
          </div>

          {/* 4. Machine Hardware Purchase & Direct Cart Action */}
          <div className="pt-4 border-t border-zinc-200/80 dark:border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block">
                  APPARATUS PRICE
                </span>
                <span className="text-2xl font-black font-mono text-zinc-950 dark:text-white">
                  ${penPrice.toFixed(2)} USD
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-[#0d5d50] dark:text-[#38e8c6] font-bold block">
                  PAPA PEN V2 ROTARY MACHINE
                </span>
                <span className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400">
                  GERMAN MOTOR · 3.5MM FIXED STROKE · 1-YEAR WARRANTY
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddMachineToCart}
              className="w-full py-4 px-6 rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-xl cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>ADD PAPA PEN V2 TO CART — ${penPrice.toFixed(2)} USD</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
              <span>Looking for Needle Boxes?</span>
              <Link
                to="/collections"
                search={{ category: 'cartridges' }}
                className="text-[#0d5d50] dark:text-[#38e8c6] font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>Browse 62 Needle Sizes in Matrix</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
