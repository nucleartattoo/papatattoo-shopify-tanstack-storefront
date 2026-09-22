import React, { useEffect, useState, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { ShopifyProduct } from '../types/shopify'
import { getProducts, getProductByHandle } from '../lib/shopify'
import { ProductCard } from '../components/product/ProductCard'
import { ModelViewer3D } from '../components/common/ModelViewer3D'
import { ParallaxApparatusStage } from '../components/common/ParallaxApparatusStage'
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Box,
  Layers,
  ChevronRight,
  Search,
  CheckCircle2,
  Cpu,
  CircleDot,
  Scale,
  Sliders,
  Maximize2,
  Building2,
  Truck,
  RotateCw,
  Gauge,
  SlidersHorizontal,
} from 'lucide-react'

type CategoryFilter = 'all' | 'machines' | 'cartridges' | 'grips' | 'power' | 'gear'

interface MachineSpecComparison {
  name: string
  handle: string
  tag: string
  price: string
  stroke: string
  motor: string
  voltage: string
  weight: string
  materials: string
  image: string
  badgeColor: 'cyan' | 'amber' | 'emerald'
}

const COMPARISON_MODELS: MachineSpecComparison[] = [
  {
    name: 'PAPA PEN V2',
    handle: 'papa-pen-v2-1',
    tag: 'FLAGSHIP ROTARY',
    price: '$199.00 USD',
    stroke: '3.5mm Fixed Precision',
    motor: 'Custom German Coreless Motor',
    voltage: '5.0V – 12.6V DC',
    weight: '150g (Forward Balanced)',
    materials: '6061-T6 Aircraft Billet Aluminum',
    image: '/product-images/img_113_papa_pen_jet_black_1__cutout.webp',
    badgeColor: 'cyan',
  },
  {
    name: 'PAPA PEN V3',
    handle: 'papa-pen-v3-black-full-set',
    tag: 'MULTI-STROKE MODULAR',
    price: '$249.00 USD',
    stroke: '3.5 / 4.0 / 4.2 / 4.5mm Interchangeable',
    motor: 'High-Torque German Direct-Drive',
    voltage: '4.5V – 13.0V DC',
    weight: '168g (Anodized Ergonomic)',
    materials: 'Solid CNC Aerospace Billet',
    image: '/product-images/img_113_papa_pen_jet_black_1__cutout.webp',
    badgeColor: 'amber',
  },
  {
    name: 'PAPA APOLLO ROTARY',
    handle: 'papa-apollo-rotary-black',
    tag: 'HEAVY HITTER DIRECT-DRIVE',
    price: '$180.00 USD',
    stroke: '4.0mm Fixed Punch',
    motor: 'Precision Low-Vibration Coreless',
    voltage: '6.0V – 11.0V DC',
    weight: '142g (Ultra-Compact Form)',
    materials: 'Cast & Milled Alloy Chassis',
    image: '/product-images/img_113_papa_pen_jet_black_1__cutout.webp',
    badgeColor: 'emerald',
  },
]

export const PapaProductsPage: React.FC = () => {
  const [allProducts, setAllProducts] = useState<ShopifyProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showComparison, setShowComparison] = useState(false)
  const [interactive3DView, setInteractive3DView] = useState(false)

  // Core flagship featured master products
  const [premiumCartridge, setPremiumCartridge] = useState<ShopifyProduct | null>(null)
  const [standardCartridge, setStandardCartridge] = useState<ShopifyProduct | null>(null)

  useEffect(() => {
    async function loadCatalog() {
      try {
        const [catalog, pPremium, pStandard] = await Promise.all([
          getProducts({ first: 100 }),
          getProductByHandle('papa-premium-tattoo-cartridges'),
          getProductByHandle('papa-standard-tattoo-cartridges'),
        ])

        setAllProducts(catalog || [])
        if (pPremium) setPremiumCartridge(pPremium)
        if (pStandard) setStandardCartridge(pStandard)
      } catch (err) {
        console.error('Failed to load products catalog:', err)
      } finally {
        setLoading(false)
      }
    }
    loadCatalog()
  }, [])

  // Categorize products
  const categorizedProducts = useMemo(() => {
    const machinesList: ShopifyProduct[] = []
    const cartridgesList: ShopifyProduct[] = []
    const gripsList: ShopifyProduct[] = []
    const powerList: ShopifyProduct[] = []
    const gearList: ShopifyProduct[] = []

    allProducts.forEach(p => {
      const title = p.title.toLowerCase()
      const handle = p.handle.toLowerCase()

      if (title.includes('grip') || handle.includes('grip')) {
        gripsList.push(p)
      } else if (
        title.includes('pen') ||
        title.includes('machine') ||
        title.includes('apollo') ||
        handle.includes('pen') ||
        handle.includes('apollo')
      ) {
        machinesList.push(p)
      } else if (
        title.includes('volt') ||
        title.includes('battery') ||
        title.includes('power') ||
        title.includes('atom') ||
        title.includes('critical')
      ) {
        powerList.push(p)
      } else if (
        title.includes('case') ||
        title.includes('pedal') ||
        title.includes('cord') ||
        title.includes('tray')
      ) {
        gearList.push(p)
      } else if (
        title.includes('cartridge') ||
        title.includes('liner') ||
        title.includes('shader') ||
        title.includes('magnum')
      ) {
        cartridgesList.push(p)
      } else {
        gearList.push(p)
      }
    })

    return {
      machines: machinesList,
      cartridges: cartridgesList,
      grips: gripsList,
      power: powerList,
      gear: gearList,
    }
  }, [allProducts])

  // Filtered view by active tab and search query
  const displayedProducts = useMemo(() => {
    let list: ShopifyProduct[] = []
    if (activeCategory === 'all') {
      list = allProducts
    } else if (activeCategory === 'machines') {
      list = categorizedProducts.machines
    } else if (activeCategory === 'cartridges') {
      list = categorizedProducts.cartridges
    } else if (activeCategory === 'grips') {
      list = categorizedProducts.grips
    } else if (activeCategory === 'power') {
      list = categorizedProducts.power
    } else if (activeCategory === 'gear') {
      list = categorizedProducts.gear
    }

    if (!searchQuery.trim()) return list

    const q = searchQuery.toLowerCase().trim()
    return list.filter(p => {
      return (
        p.title.toLowerCase().includes(q) ||
        p.handle.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      )
    })
  }, [activeCategory, allProducts, categorizedProducts, searchQuery])

  const categoryCounts = {
    all: allProducts.length,
    machines: categorizedProducts.machines.length,
    cartridges: categorizedProducts.cartridges.length,
    grips: categorizedProducts.grips.length,
    power: categorizedProducts.power.length,
    gear: categorizedProducts.gear.length,
  }

  return (
    <div className="min-h-screen bg-transparent text-zinc-900 dark:text-zinc-100 font-sans pb-36 select-none transition-colors">
      {/* ============================================================ */}
      {/* 1. MONUMENTAL APPARATUS CATALOG HEADER */}
      {/* ============================================================ */}
      <section className="relative pt-20 pb-12 sm:pt-28 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#e2dfd8] dark:border-white/[0.08]">
        {/* Background Architectural Typographic Monument */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[16vw] font-black uppercase tracking-tighter text-zinc-950/[0.035] dark:text-white/[0.03] pointer-events-none select-none whitespace-nowrap font-['Montserrat',sans-serif] z-0"
        >
          APPARATUS
        </div>

        {/* Ambient Radial Spotlight */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1000px] h-[350px] sm:h-[450px] bg-[radial-gradient(circle,rgba(56,232,198,0.16)_0%,transparent_65%)] pointer-events-none z-0" />

        <div className="max-w-5xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] text-[10px] font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6] uppercase tracking-widest backdrop-blur-md shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0d5d50] dark:bg-[#38e8c6] animate-pulse" />
            <span>PAPA TATTOO CORP // HARDWARE ARSENAL MONOGRAPH</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-zinc-950 dark:text-white font-['Montserrat',sans-serif] leading-none">
            PRECISION APPARATUS CATALOG
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-sans max-w-2xl mx-auto leading-relaxed">
            Continuous-drive rotary machines, Japanese 316L needle metallurgy, and CNC 6061 aerospace alloy interfaces. Engineered for high-volume resident studios and international convention tours.
          </p>

          {/* Quick Metrics Ticker */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-mono text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0d5d50] dark:text-[#38e8c6]" />
              <span>100% EO Gas Sterile</span>
            </div>
            <span className="text-zinc-300 dark:text-zinc-700">·</span>
            <div className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-[#0d5d50] dark:text-[#38e8c6]" />
              <span>German Coreless Motors</span>
            </div>
            <span className="text-zinc-300 dark:text-zinc-700">·</span>
            <div className="flex items-center gap-2">
              <Gauge className="w-3.5 h-3.5 text-[#0d5d50] dark:text-[#38e8c6]" />
              <span>62 Needle Configurations</span>
            </div>
            <span className="text-zinc-300 dark:text-zinc-700">·</span>
            <div className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-[#0d5d50] dark:text-[#38e8c6]" />
              <span>40+ Countries Priority Shipped</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. STICKY SWISS GLASSMORPHIC MATRIX FILTER BAR */}
      {/* ============================================================ */}
      <div className="sticky top-16 lg:top-18 z-30 w-full border-b border-[#e2dfd8]/80 dark:border-white/[0.08] bg-[#f5f4f0]/95 dark:bg-[#16181e]/90 backdrop-blur-xl transition-all duration-300 shadow-xs">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'all', label: 'All Apparatus', count: categoryCounts.all },
              { id: 'machines', label: 'Rotary Machines', count: categoryCounts.machines },
              { id: 'cartridges', label: 'Needles & Cartridges', count: categoryCounts.cartridges },
              { id: 'grips', label: 'Click Grips', count: categoryCounts.grips },
              { id: 'power', label: 'Wireless Power', count: categoryCounts.power },
              { id: 'gear', label: 'Studio Hardware', count: categoryCounts.gear },
            ].map(cat => {
              const isActive = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as CategoryFilter)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-zinc-950 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-white/[0.05]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive
                        ? 'bg-white/20 dark:bg-black/20 text-current'
                        : 'bg-zinc-200 dark:bg-white/[0.08] text-zinc-500'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Right Controls: Comparison Toggle & Realtime Search */}
          <div className="flex items-center gap-2.5">
            {/* Realtime Search Input */}
            <div className="relative flex-1 md:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Filter by model / spec..."
                className="w-full pl-8.5 pr-3 py-1.5 text-xs font-mono rounded-full border border-[#e2dfd8] dark:border-white/10 bg-white dark:bg-white/[0.04] text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:border-[#2EE6CA]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
                >
                  CLEAR
                </button>
              )}
            </div>

            {/* Comparison Studio Toggle */}
            <button
              onClick={() => setShowComparison(!showComparison)}
              className={`px-3 py-1.5 rounded-full border text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                showComparison
                  ? 'border-[#0d5d50] dark:border-[#2ee6ca] bg-[#0d5d50]/10 dark:bg-[#2ee6ca]/15 text-[#0d5d50] dark:text-[#2ee6ca]'
                  : 'border-[#e2dfd8] dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-white/25 bg-white dark:bg-white/[0.04]'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{showComparison ? 'Close Comparison' : 'Compare Machines'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-16">
        {/* ============================================================ */}
        {/* 3. INTERACTIVE MACHINE COMPARISON STUDIO (EXPANDABLE) */}
        {/* ============================================================ */}
        {showComparison && (
          <section className="rounded-3xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white/90 dark:bg-[#1a1c24] p-6 sm:p-10 shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e2dfd8] dark:border-white/[0.08]">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6] uppercase">
                  <Scale className="w-3.5 h-3.5" />
                  <span>MACHINE BENCHMARK STUDIO · SIDE-BY-SIDE</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-zinc-950 dark:text-white uppercase tracking-tight mt-1 font-['Montserrat',sans-serif]">
                  PAPA FLAGSHIP APPARATUS COMPARISON
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInteractive3DView(!interactive3DView)}
                  className="px-3.5 py-1.5 rounded-full border border-zinc-200 dark:border-white/15 bg-zinc-50 dark:bg-white/[0.05] text-xs font-mono font-bold text-zinc-700 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-[#2ee6ca] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>{interactive3DView ? 'Show Photos' : 'Interactive 3D Stage'}</span>
                </button>
              </div>
            </div>

            {/* 3D Model Stage in Comparison */}
            {interactive3DView && (
              <div className="my-6 p-4 rounded-2xl border border-zinc-200/80 dark:border-white/[0.06] bg-zinc-50/70 dark:bg-[#15171d] flex flex-col items-center justify-center relative min-h-[360px]">
                <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-mono text-[#38e8c6]">
                  PAPA PEN V2 · 3D ORTHOGRAPHIC SPECIMEN
                </div>
                <ModelViewer3D
                  src="/models/papapenv2.glb"
                  poster="/product-images/img_113_papa_pen_jet_black_1__cutout.webp"
                  alt="Papa Pen V2 3D Model"
                  className="w-full h-[320px]"
                  cameraOrbit="35deg 82deg 2.0m"
                  fieldOfView="28deg"
                  autoRotate={true}
                />
              </div>
            )}

            {/* 3-Column Comparison Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
              {COMPARISON_MODELS.map(m => (
                <div
                  key={m.name}
                  className="rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f5f4f0]/60 dark:bg-[#16181e] p-6 flex flex-col justify-between space-y-6 hover:border-zinc-400 dark:hover:border-white/20 transition-all shadow-xs"
                >
                  <div className="space-y-4">
                    {/* Header Badge */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 uppercase">
                        {m.tag}
                      </span>
                      <span className="text-xs font-mono font-black text-zinc-950 dark:text-white">
                        {m.price}
                      </span>
                    </div>

                    {/* Image */}
                    <div className="w-full aspect-16/10 rounded-xl bg-white dark:bg-[#1f222b] border border-[#e2dfd8]/80 dark:border-white/[0.06] flex items-center justify-center p-4">
                      <img
                        src={m.image}
                        alt={m.name}
                        className="max-h-32 w-auto object-contain drop-shadow-md"
                      />
                    </div>

                    {/* Model Name */}
                    <h3 className="text-xl font-black uppercase text-zinc-950 dark:text-white font-['Montserrat',sans-serif]">
                      {m.name}
                    </h3>

                    {/* Spec Key-Value List */}
                    <div className="space-y-2.5 pt-2 border-t border-[#e2dfd8]/80 dark:border-white/[0.06] text-xs font-mono">
                      <div>
                        <div className="text-[10px] text-zinc-400 uppercase">Stroke Configuration</div>
                        <div className="font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{m.stroke}</div>
                      </div>

                      <div>
                        <div className="text-[10px] text-zinc-400 uppercase">Motor Architecture</div>
                        <div className="font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{m.motor}</div>
                      </div>

                      <div>
                        <div className="text-[10px] text-zinc-400 uppercase">Voltage Range</div>
                        <div className="font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{m.voltage}</div>
                      </div>

                      <div>
                        <div className="text-[10px] text-zinc-400 uppercase">Chassis Metallurgy</div>
                        <div className="font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{m.materials}</div>
                      </div>

                      <div>
                        <div className="text-[10px] text-zinc-400 uppercase">Operating Weight</div>
                        <div className="font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{m.weight}</div>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/products/$handle"
                    params={{ handle: m.handle }}
                    className="w-full py-3 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                  >
                    <span>View Machine Specs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* 4. MASTER HARDWARE CATALOG GRID */}
        {/* ============================================================ */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#e2dfd8] dark:border-white/[0.08]">
            <div>
              <div className="text-[11px] font-mono font-bold tracking-widest text-[#0d5d50] dark:text-[#38e8c6] uppercase">
                CERTIFIED FACTORY INVENTORY · SHOPIFY BACKED
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white uppercase tracking-tight font-['Montserrat',sans-serif]">
                {activeCategory === 'all'
                  ? 'ALL INSTRUMENTS & APPARATUS'
                  : activeCategory === 'machines'
                  ? 'CONTINUOUS-DRIVE ROTARY MACHINES'
                  : activeCategory === 'cartridges'
                  ? 'MICRON NEEDLE CARTRIDGE SYSTEMS'
                  : activeCategory === 'grips'
                  ? 'AEROSPACE CNC CLICK GRIPS'
                  : activeCategory === 'power'
                  ? 'WIRELESS POWER & BATTERY SYSTEMS'
                  : 'STUDIO HARDWARE & CASES'}
              </h2>
            </div>

            <div className="text-xs font-mono text-zinc-500">
              SHOWING {displayedProducts.length} APPARATUS CONFIGURATIONS
            </div>
          </div>

          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3 text-zinc-400 font-mono text-xs">
              <Box className="w-8 h-8 text-[#0d5d50] dark:text-[#38e8c6] animate-pulse" />
              <span>SYNCHRONIZING FACTORY INVENTORY...</span>
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="py-20 text-center space-y-4 rounded-3xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.02] p-8">
              <Box className="w-12 h-12 text-zinc-400 mx-auto" />
              <h3 className="text-lg font-black uppercase text-zinc-950 dark:text-white font-mono">
                NO APPARATUS MATCHED YOUR FILTER
              </h3>
              <p className="text-xs font-mono text-zinc-500 max-w-sm mx-auto">
                No items matched "{searchQuery}". Try clearing search keywords or switching category filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setActiveCategory('all')
                }}
                className="px-5 py-2 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-mono font-bold uppercase cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
              {displayedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* ============================================================ */}
        {/* 5. CINEMATIC MASTER SECTORS SHOWCASE */}
        {/* ============================================================ */}
        <section className="pt-12 space-y-20 border-t border-[#e2dfd8] dark:border-white/[0.08]">
          {/* Sector 1: Cartridge Metallurgy */}
          <div className="rounded-3xl border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f5f4f0]/60 dark:bg-[#16181e] p-8 sm:p-14 overflow-hidden relative shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/10 text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>SECTOR 01 // MICRON NEEDLE METALLURGY</span>
                </div>

                <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-950 dark:text-white font-['Montserrat',sans-serif]">
                  SURGICAL 316L NEEDLE CARTRIDGES
                </h3>

                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                  Medical-grade polycarbonate cartridge bodies with flexible internal safety membranes. Precision ground Japanese surgical pins eliminate ink spit and needle wobble across all 62 standard and premium configurations.
                </p>

                <div className="grid grid-cols-3 gap-4 py-3 border-y border-[#e2dfd8]/80 dark:border-white/[0.06] text-center font-mono text-xs">
                  <div>
                    <div className="text-base font-black text-zinc-950 dark:text-white">62 SIZES</div>
                    <div className="text-[10px] text-zinc-400 uppercase">RL · RS · M1 · M1C</div>
                  </div>
                  <div>
                    <div className="text-base font-black text-zinc-950 dark:text-white">EO GAS</div>
                    <div className="text-[10px] text-zinc-400 uppercase">Batch Sterile</div>
                  </div>
                  <div>
                    <div className="text-base font-black text-zinc-950 dark:text-white">20 PCS</div>
                    <div className="text-[10px] text-zinc-400 uppercase">Per Box</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    to="/products/$handle"
                    params={{ handle: 'papa-premium-tattoo-cartridges' }}
                    className="px-6 py-3 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:opacity-90 transition-all shadow-xs"
                  >
                    <span>PAPA PREMIUM SERIES</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    to="/products/$handle"
                    params={{ handle: 'papa-standard-tattoo-cartridges' }}
                    className="px-6 py-3 rounded-full border border-zinc-300 dark:border-white/15 text-zinc-800 dark:text-zinc-200 text-xs font-mono font-bold uppercase tracking-wider hover:bg-zinc-200/50 dark:hover:bg-white/[0.05] transition-colors"
                  >
                    <span>STANDARD SERIES</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6 flex items-center justify-center">
                <ParallaxApparatusStage
                  imageSrc="/product-images/papa-premium-tattoo-cartridges-round-cutout.webp"
                  alt="Papa Premium Cartridge"
                  accentColor="amber"
                  baseRotation={-6}
                  priorityTag="JAPANESE 316L SURGICAL ALLOY"
                />
              </div>
            </div>
          </div>

          {/* Sector 2: CNC 6061 Click Grips */}
          <div className="rounded-3xl border border-[#e2dfd8] dark:border-white/[0.08] bg-[#f5f4f0]/60 dark:bg-[#16181e] p-8 sm:p-14 overflow-hidden relative shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 order-2 lg:order-1 flex items-center justify-center">
                <ParallaxApparatusStage
                  imageSrc="/product-images/img_111_papa_adjustment_grips_1__cutout.webp"
                  alt="Papa Click Grip"
                  accentColor="emerald"
                  baseRotation={5}
                  priorityTag="CLICK-STOP NEEDLE PROJECTION"
                />
              </div>

              <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#0d5d50]/20 dark:border-[#38e8c6]/20 bg-[#38e8c6]/10 text-[10px] font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6] uppercase tracking-widest">
                  <Box className="w-3.5 h-3.5" />
                  <span>SECTOR 02 // CNC 6061-T6 ERGONOMIC INTERFACE</span>
                </div>

                <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-950 dark:text-white font-['Montserrat',sans-serif]">
                  PRECISION CLICK ADJUSTABLE GRIPS
                </h3>

                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                  Solid aerospace billet aluminum with non-slip knurled geometry. Features positive click-stop needle depth dial, 100% autoclavable internal stainless steel drive shaft, and forward-biased ergonomics.
                </p>

                <div className="grid grid-cols-3 gap-4 py-3 border-y border-[#e2dfd8]/80 dark:border-white/[0.06] text-center font-mono text-xs">
                  <div>
                    <div className="text-base font-black text-zinc-950 dark:text-white">6061-T6</div>
                    <div className="text-[10px] text-zinc-400 uppercase">Anodized Alloy</div>
                  </div>
                  <div>
                    <div className="text-base font-black text-zinc-950 dark:text-white">CLICK-STOP</div>
                    <div className="text-[10px] text-zinc-400 uppercase">Needle Dial</div>
                  </div>
                  <div>
                    <div className="text-base font-black text-zinc-950 dark:text-white">AUTOCLAVE</div>
                    <div className="text-[10px] text-zinc-400 uppercase">100% Safe</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    to="/collections"
                    search={{ category: 'grips' }}
                    className="px-6 py-3 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:opacity-90 transition-all shadow-xs"
                  >
                    <span>EXPLORE ALL GRIP SIZES</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 6. STUDIO & B2B DIRECT FACTORY PROCUREMENT STRIP */}
        {/* ============================================================ */}
        <div className="rounded-3xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white/80 dark:bg-[#1e2028] p-8 sm:p-12 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6] uppercase">
              <Building2 className="w-4 h-4" />
              <span>DIRECT STUDIO PROCUREMENT PROGRAM</span>
            </div>
            <h3 className="text-2xl font-black uppercase text-zinc-950 dark:text-white font-['Montserrat',sans-serif]">
              ORDERING FOR PARLORS &amp; ACADEMIES?
            </h3>
            <p className="text-xs font-mono text-zinc-500 leading-relaxed">
              Unlock tiered volume discounts up to 35%, factory-direct custom needle blister printing, and dedicated account management.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/wholesale"
              className="px-6 py-3.5 rounded-full bg-zinc-950 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 font-mono font-bold text-xs uppercase tracking-wider shadow-md hover:opacity-90 transition-opacity"
            >
              Launch Bulk Calculator
            </Link>
            <Link
              to="/distributors"
              className="px-6 py-3.5 rounded-full border border-zinc-300 dark:border-white/15 text-zinc-800 dark:text-zinc-200 font-mono font-bold text-xs uppercase tracking-wider hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-colors"
            >
              Authorized Distributors
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
