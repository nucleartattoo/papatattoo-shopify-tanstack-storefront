import React, { useState, useEffect, useMemo } from 'react'
import { Link, useSearch, useNavigate, useLoaderData } from '@tanstack/react-router'
import { ShopifyProduct } from '../types/shopify'
import { getProducts, isGranularCartridge, isNuclearTattooProduct } from '../lib/shopify'
import { ProductCard } from '../components/product/ProductCard'
import { ModelViewer3D } from '../components/common/ModelViewer3D'
import { useLocale } from '../context/LocaleContext'
import {
  Filter,
  Search,
  Sparkles,
  Layers,
  SlidersHorizontal,
  ChevronRight,
  ArrowUpDown,
  RotateCcw,
  Check,
  X,
  Plus,
  Minus,
  Box,
} from 'lucide-react'

export interface CollectionSearchProps {
  category?: string
  sub?: string
  q?: string
  series?: 'all' | 'premium' | 'standard'
  needle?: string
  sort?: 'featured' | 'price-asc' | 'price-desc' | 'title-asc'
}

export interface SubcategoryDef {
  id: string
  label: string
  match: (product: ShopifyProduct) => boolean
}

export interface CategoryDef {
  id: string
  label: string
  match: (product: ShopifyProduct) => boolean
  subcategories?: SubcategoryDef[]
}

export const STORE_CATEGORIES: CategoryDef[] = [
  {
    id: 'machines',
    label: 'Papa Machines',
    match: p => {
      const t = p.title.toLowerCase()
      if (t.includes('cheyenne') || t.includes('critical')) return false
      return (
        (t.includes('pen') ||
          t.includes('machine') ||
          t.includes('apollo') ||
          t.includes('drive') ||
          t.includes('motor')) &&
        !t.includes('grip')
      )
    },
    subcategories: [
      {
        id: 'papa-pen',
        label: 'Papa Pen',
        match: p => {
          const t = p.title.toLowerCase()
          return t.includes('papa pen') && !t.includes('v2') && !t.includes('v3')
        },
      },
      {
        id: 'papa-pen-v2',
        label: 'Papa Pen V2',
        match: p => p.title.toLowerCase().includes('v2'),
      },
      {
        id: 'papa-pen-v3',
        label: 'Papa Pen V3',
        match: p => p.title.toLowerCase().includes('v3'),
      },
      {
        id: 'papa-apollo',
        label: 'Papa Apollo Rotary',
        match: p => p.title.toLowerCase().includes('apollo'),
      },
    ],
  },
  {
    id: 'cartridges',
    label: 'Papa Cartridges',
    match: p => {
      const t = p.title.toLowerCase()
      return (
        p.handle === 'papa-premium-tattoo-cartridges' ||
        p.handle === 'papa-standard-tattoo-cartridges' ||
        p.handle === 'papa-open-tip-tattoo-cartridges' ||
        (t.includes('cartridge') && !t.includes('grip') && !t.includes('tube'))
      )
    },
    subcategories: [
      {
        id: 'premium',
        label: '⭐ Papa Premium Cartridges',
        match: p => p.handle === 'papa-premium-tattoo-cartridges' || p.title.toLowerCase().includes('premium'),
      },
      {
        id: 'standard',
        label: 'Papa Standard Cartridges',
        match: p =>
          p.handle === 'papa-standard-tattoo-cartridges' ||
          (p.title.toLowerCase().includes('standard') && p.title.toLowerCase().includes('cartridge')),
      },
    ],
  },
  {
    id: 'grips',
    label: 'Cartridge Grips',
    match: p => {
      const t = p.title.toLowerCase()
      if (t.includes('cheyenne')) return false
      return t.includes('grip') || t.includes('finger ledge')
    },
    subcategories: [
      {
        id: 'adjustable-v2',
        label: 'Adjustable Click Grip V2',
        match: p => p.title.toLowerCase().includes('grip v2'),
      },
      {
        id: 'adjustable-v3',
        label: 'Adjustable Grip V3',
        match: p => p.title.toLowerCase().includes('grip v3'),
      },
      {
        id: 'adjustable-click',
        label: 'Autoclavable Click Grip',
        match: p => {
          const t = p.title.toLowerCase()
          return (
            t.includes('adjustable click grip') &&
            !t.includes('v2') &&
            !t.includes('v3')
          )
        },
      },
      {
        id: 'disposable-grips',
        label: 'Disposable Cartridge Grips',
        match: p => p.title.toLowerCase().includes('disposable'),
      },
      {
        id: 'foam-cover-grips',
        label: 'Foam Grips & Accessories',
        match: p => {
          const t = p.title.toLowerCase()
          if (t.includes('cheyenne')) return false
          return t.includes('foam') || t.includes('finger ledge')
        },
      },
    ],
  },
  {
    id: 'power',
    label: 'Papa Power Supply',
    match: p => {
      const t = p.title.toLowerCase()
      if (t.includes('critical') || t.includes('atom') || t.includes('cheyenne')) return false
      return (
        t.includes('power') ||
        t.includes('cord') ||
        t.includes('pedal') ||
        t.includes('volt') ||
        t.includes('bullet') ||
        t.includes('battery')
      )
    },
    subcategories: [
      {
        id: 'cords',
        label: 'RCA & Clip Cords',
        match: p => p.title.toLowerCase().includes('cord'),
      },
      {
        id: 'pedal',
        label: 'Papa Foot Pedal',
        match: p => p.title.toLowerCase().includes('pedal'),
      },
      {
        id: 'power-units',
        label: 'Power Supplies & Bullet',
        match: p => {
          const t = p.title.toLowerCase()
          if (t.includes('critical') || t.includes('atom')) return false
          return t.includes('power') || t.includes('bullet') || t.includes('volt')
        },
      },
    ],
  },
  {
    id: 'apparel',
    label: 'Papa Apparel',
    match: p => {
      const t = p.title.toLowerCase()
      return t.includes('hat') || t.includes('shirt') || t.includes('apron')
    },
    subcategories: [
      {
        id: 'hat',
        label: 'PAPA Tattoo Hat',
        match: p => p.title.toLowerCase().includes('hat'),
      },
      {
        id: 'shirt',
        label: 'Papa Tattoo Shirt',
        match: p => p.title.toLowerCase().includes('shirt'),
      },
    ],
  },
  {
    id: 'accessories',
    label: 'Papa Accessories',
    match: p => {
      const t = p.title.toLowerCase()
      return (t.includes('tray') || t.includes('case') || t.includes('holder')) && !t.includes('stencil')
    },
    subcategories: [
      {
        id: 'trays',
        label: 'Papa Station Trays',
        match: p => p.title.toLowerCase().includes('tray'),
      },
      {
        id: 'travel-case',
        label: 'PAPA Travel Case',
        match: p => p.title.toLowerCase().includes('case'),
      },
    ],
  },
  {
    id: 'stencil',
    label: 'Papa Stencil',
    match: p => p.title.toLowerCase().includes('stencil'),
  },
]

export const CollectionPage: React.FC = () => {
  const { t, locale } = useLocale()
  const searchParams: CollectionSearchProps = useSearch({ strict: false })
  const navigate = useNavigate()

  const loaderData = useLoaderData({ strict: false }) as
    | { products?: ShopifyProduct[] }
    | undefined
  const initialProducts = loaderData?.products || []

  const [products, setProducts] = useState<ShopifyProduct[]>(initialProducts)
  const [loading, setLoading] = useState(initialProducts.length === 0)

  // Filter States initialized from URL query params
  const [activeCategory, setActiveCategory] = useState<string>(searchParams.category || 'all')
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(searchParams.sub || null)
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.q || '')
  const [activeSeries, setActiveSeries] = useState<'all' | 'premium' | 'standard'>(
    searchParams.series || 'all'
  )
  const [needleProfile, setNeedleProfile] = useState<string>(searchParams.needle || 'all')
  const [sortOption, setSortOption] = useState<string>(searchParams.sort || 'featured')
  const [inStockOnly, setInStockOnly] = useState<boolean>(false)

  // Expandable category state for accordion
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(() => {
    const initial = new Set<string>()
    if (searchParams.category && searchParams.category !== 'all') {
      const norm = searchParams.category === 'needles' ? 'cartridges' : searchParams.category
      initial.add(norm)
    }
    return initial
  })

  // Synchronize state when URL query params change
  useEffect(() => {
    if (searchParams.category) {
      setActiveCategory(searchParams.category)
      const norm = searchParams.category === 'needles' ? 'cartridges' : searchParams.category
      if (norm !== 'all') {
        setExpandedCategories(prev => new Set(prev).add(norm))
      }
    }
    if (searchParams.sub !== undefined) setActiveSubcategory(searchParams.sub || null)
    if (searchParams.q !== undefined) setSearchQuery(searchParams.q)
    if (searchParams.series) setActiveSeries(searchParams.series)
    if (searchParams.needle) setNeedleProfile(searchParams.needle)
    if (searchParams.sort) setSortOption(searchParams.sort)
  }, [searchParams.category, searchParams.sub, searchParams.q, searchParams.series, searchParams.needle, searchParams.sort])

  // Fetch full unified catalog
  useEffect(() => {
    let isMounted = true
    async function loadCatalog() {
      if (initialProducts.length > 0 && locale === 'EN') return
      setLoading(true)
      try {
        const items = await getProducts({ first: 100, language: locale })
        if (isMounted) {
          setProducts(items)
        }
      } catch (err) {
        console.error(err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadCatalog()
    return () => {
      isMounted = false
    }
  }, [locale, initialProducts.length])

  // Non-granular products list for counting and filtering (excluding Nuclear Tattoo items)
  const nonGranularProducts = useMemo(() => {
    return products.filter(p => !isGranularCartridge(p) && !isNuclearTattooProduct(p))
  }, [products])

  // Precompute category & subcategory counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const cat of STORE_CATEGORIES) {
      counts[cat.id] = nonGranularProducts.filter(p => cat.match(p)).length
    }
    return counts
  }, [nonGranularProducts])

  const subcategoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const cat of STORE_CATEGORIES) {
      if (cat.subcategories) {
        for (const sub of cat.subcategories) {
          counts[sub.id] = nonGranularProducts.filter(p => cat.match(p) && sub.match(p)).length
        }
      }
    }
    return counts
  }, [nonGranularProducts])

  // Multi-tier filtering
  const filteredProducts = useMemo(() => {
    return products.filter(prod => {
      const titleLower = prod.title.toLowerCase()

      // 0. Exclude raw un-consolidated single-needle cartridge SKUs and Nuclear Tattoo products unconditionally
      if (isGranularCartridge(prod) || isNuclearTattooProduct(prod)) {
        return false
      }

      // 1. Text Search
      if (searchQuery) {
        const queryLower = searchQuery.toLowerCase()
        const matchesTitle = titleLower.includes(queryLower)
        const matchesTags = prod.tags && prod.tags.some(tag => tag.toLowerCase().includes(queryLower))
        if (!matchesTitle && !matchesTags) return false
      }

      // 2. Category & Subcategory Discipline
      if (activeCategory !== 'all') {
        const normCatId = activeCategory === 'needles' ? 'cartridges' : activeCategory === 'studio' ? 'accessories' : activeCategory
        const targetCat = STORE_CATEGORIES.find(c => c.id === normCatId)
        if (targetCat) {
          if (!targetCat.match(prod)) return false

          if (activeSubcategory && targetCat.subcategories) {
            const targetSub = targetCat.subcategories.find(s => s.id === activeSubcategory)
            if (targetSub && !targetSub.match(prod)) return false
          }
        }
      }

      // 3. Cartridge Sub-Series (Standard vs Premium)
      if (activeSeries === 'premium') {
        if (prod.handle !== 'papa-premium-tattoo-cartridges') return false
      } else if (activeSeries === 'standard') {
        if (prod.handle !== 'papa-standard-tattoo-cartridges') return false
      }

      // 4. In-stock filter
      if (inStockOnly && prod.availableForSale === false) return false

      return true
    })
  }, [products, searchQuery, activeCategory, activeSubcategory, activeSeries, inStockOnly])

  // Sorting
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts]
    if (sortOption === 'price-asc') {
      list.sort((a, b) => parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount))
    } else if (sortOption === 'price-desc') {
      list.sort((a, b) => parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount))
    } else if (sortOption === 'title-asc') {
      list.sort((a, b) => a.title.localeCompare(b.title))
    }
    return list
  }, [filteredProducts, sortOption])

  // Accordion toggle expand handler
  const handleToggleExpand = (catId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(catId)) {
        next.delete(catId)
      } else {
        next.add(catId)
      }
      return next
    })
  }

  // Select Category
  const handleSelectCategory = (catId: string) => {
    setActiveCategory(catId)
    setActiveSubcategory(null)
    setActiveSeries('all')
    if (catId !== 'all') {
      const norm = catId === 'needles' ? 'cartridges' : catId
      setExpandedCategories(prev => new Set(prev).add(norm))
    }
    navigate({
      to: '/collections',
      search: {
        category: catId,
        q: searchQuery || undefined,
        series: 'all',
        sort: sortOption as any,
      },
    })
  }

  // Select Subcategory
  const handleSelectSubcategory = (catId: string, subId: string) => {
    setActiveCategory(catId)
    setActiveSubcategory(subId)
    if (catId === 'cartridges' || catId === 'needles') {
      if (subId === 'premium') setActiveSeries('premium')
      else if (subId === 'standard') setActiveSeries('standard')
      else setActiveSeries('all')
    }
    navigate({
      to: '/collections',
      search: {
        category: catId,
        sub: subId,
        q: searchQuery || undefined,
        sort: sortOption as any,
      },
    })
  }

  const handleResetFilters = () => {
    setActiveCategory('all')
    setActiveSubcategory(null)
    setSearchQuery('')
    setActiveSeries('all')
    setNeedleProfile('all')
    setSortOption('featured')
    setInStockOnly(false)
    navigate({ to: '/collections', search: { category: 'all' } })
  }

  const getCategoryTitle = () => {
    if (activeCategory === 'all') return 'ALL APPARATUS & SUPPLIES'
    const norm = activeCategory === 'needles' ? 'cartridges' : activeCategory === 'studio' ? 'accessories' : activeCategory
    const cat = STORE_CATEGORIES.find(c => c.id === norm)
    if (!cat) return 'ALL APPARATUS & SUPPLIES'
    if (activeSubcategory && cat.subcategories) {
      const sub = cat.subcategories.find(s => s.id === activeSubcategory)
      if (sub) {
        return `${cat.label.toUpperCase()} · ${sub.label.replace('⭐ ', '').toUpperCase()}`
      }
    }
    return cat.label.toUpperCase()
  }

  return (
    <div className="bg-zinc-50 dark:bg-[#20222a] min-h-screen text-zinc-900 dark:text-zinc-100 art-aurora-bg">
      {/* 1. Top Ultra-Wide Full-Screen Panoramic Stage (Compact Golden Height) */}
      <section className="w-full border-b border-zinc-200/80 dark:border-white/[0.08] bg-[#eceae4] dark:bg-[#15171d] relative overflow-hidden">
        {/* Ambient Movie-Grade Studio Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(46,230,202,0.1)_0%,transparent_65%)] pointer-events-none" />

        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 h-full min-h-[200px] sm:min-h-[220px] lg:min-h-[240px] flex flex-col lg:flex-row lg:items-center justify-between py-6 sm:py-7 gap-6 relative z-10">
          {/* Left: Breadcrumbs & Punchy Typography */}
          <div className="max-w-2xl space-y-2">
            {/* Compact Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
              <Link to="/" className="hover:text-white transition-colors">
                HOME
              </Link>
              <ChevronRight className="w-3 h-3 text-zinc-600" />
              <Link to="/collections" search={{ category: 'all' }} className="hover:text-white transition-colors">
                CATALOG
              </Link>
              <ChevronRight className="w-3 h-3 text-zinc-600" />
              <span className="text-[#2ee6ca] font-bold uppercase">{getCategoryTitle()}</span>
            </nav>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white font-['Montserrat',sans-serif]">
              {getCategoryTitle()}
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed line-clamp-2 max-w-xl">
              Industrial grade tattoo engineering apparatus, medical 316L needle pins, and aerospace anodized alloy systems calibrated for professional artists.
            </p>

            {/* Architectural Technical Specs Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.08] text-[10px] font-mono text-zinc-300">
                AEROSPACE ALLOY
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.08] text-[10px] font-mono text-zinc-300">
                316L SURGICAL STEEL
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.08] text-[10px] font-mono text-[#2ee6ca]">
                CALIBRATED TOLERANCE
              </span>
            </div>
          </div>

          {/* Right: Compact 3D Interactive Stage / High-Res Apparatus Visual */}
          <div className="relative w-full lg:w-96 h-40 sm:h-48 lg:h-52 shrink-0 rounded-xl bg-zinc-900/40 border border-white/[0.08] overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(46,230,202,0.15)_0%,transparent_70%)] pointer-events-none" />

            {activeCategory === 'machines' ? (
              <>
                <ModelViewer3D
                  src="/models/papapenv2.glb"
                  poster="/product-images/img_113_papa_pen_jet_black_1__cutout.webp"
                  alt="Papa Pen V2 Precision Machine"
                  className="w-full h-full"
                  autoRotate={true}
                  cameraOrbit="45deg 70deg 2.2m"
                />
                {/* Top-Left 3D Indicator Badge */}
                <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-white text-[10px] font-mono font-medium pointer-events-none shadow-md">
                  <Box className="w-3 h-3 text-[#2ee6ca]" />
                  <span>3D ROTATE</span>
                </div>
              </>
            ) : activeCategory === 'cartridges' ? (
              <div className="relative w-full h-full flex items-center justify-center p-4">
                <img
                  src="/product-images/papa-premium-tattoo-cartridges-round-cutout.webp"
                  alt="Papa Cartridges Precision Needle"
                  className="max-h-[90%] w-auto object-contain drop-shadow-[0_16px_28px_rgba(0,0,0,0.8)] scale-110"
                />
                <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-white text-[10px] font-mono font-medium pointer-events-none shadow-md">
                  MEMBRANE SEALED
                </div>
              </div>
            ) : activeCategory === 'grips' ? (
              <div className="relative w-full h-full flex items-center justify-center p-4">
                <img
                  src="/product-images/img_111_papa_adjustment_grips_1__cutout.webp"
                  alt="Papa Adjustable Grip"
                  className="max-h-[90%] w-auto object-contain drop-shadow-[0_16px_28px_rgba(0,0,0,0.8)] scale-110"
                />
                <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-white text-[10px] font-mono font-medium pointer-events-none shadow-md">
                  CNC ADJUSTABLE
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center p-4">
                <img
                  src="/product-images/img_201_papa_travel_case_cutout.webp"
                  alt="Papa Travel Case"
                  className="max-h-[90%] w-auto object-contain drop-shadow-[0_16px_28px_rgba(0,0,0,0.8)] scale-110"
                />
                <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-white text-[10px] font-mono font-medium pointer-events-none shadow-md">
                  STUDIO GEAR
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="py-8 max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* 3. Main Layout: Sidebar Filters + Products Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar Filter Column - Open Minimalist Architecture */}
          <aside className="w-full lg:w-64 lg:shrink-0 lg:pr-6 lg:border-r lg:border-zinc-200/70 dark:lg:border-zinc-800/70 space-y-6">
            {/* 1. Header Toolbar with Filter Title & Reset */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200/80 dark:border-zinc-800/80">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#0d9488] dark:text-[#2EE6CA]" />
                <span className="text-xs font-mono font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                  CATEGORIES
                </span>
              </div>
              {(activeCategory !== 'all' || activeSubcategory || activeSeries !== 'all' || searchQuery || inStockOnly) && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] font-mono text-zinc-400 hover:text-[#0d9488] dark:hover:text-[#2EE6CA] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Active Search Badge (when search is triggered from global Header search bar) */}
            {searchQuery && (
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs font-mono">
                <div className="flex items-center gap-1.5 truncate">
                  <Search className="w-3.5 h-3.5 text-[#0d9488] dark:text-[#2EE6CA] shrink-0" />
                  <span className="text-zinc-500">Query:</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate">"{searchQuery}"</span>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    navigate({ to: '/collections', search: { category: activeCategory } })
                  }}
                  className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                  title="Clear search query"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* 2. 7 Original Categories Accordion Tree */}
            <div className="space-y-1">
              {/* 7 Categories with (+) Expandable Accordion for Subcategories */}
              {STORE_CATEGORIES.map(cat => {
                const normActive = activeCategory === 'needles' ? 'cartridges' : activeCategory
                const isCatActive = normActive === cat.id
                const hasSub = !!cat.subcategories && cat.subcategories.length > 0
                const isExpanded = expandedCategories.has(cat.id)

                return (
                  <div key={cat.id} className="space-y-0.5">
                    <div
                      className={`flex items-center justify-between py-1.5 px-2.5 rounded-lg text-[13px] font-mono transition-all text-left ${
                        isCatActive && !activeSubcategory
                          ? 'text-[#0d9488] dark:text-[#2EE6CA] font-bold bg-[#0d9488]/8 dark:bg-[#2EE6CA]/10 pl-3 border-l-2 border-[#0d9488] dark:border-[#2EE6CA]'
                          : isCatActive
                          ? 'text-[#0d9488] dark:text-[#2EE6CA] font-semibold bg-zinc-100/50 dark:bg-zinc-800/20'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/40'
                      }`}
                    >
                      {/* Category Clickable Title */}
                      <button
                        onClick={() => handleSelectCategory(cat.id)}
                        className="flex-1 text-left whitespace-nowrap cursor-pointer py-0.5"
                      >
                        <span>{cat.label}</span>
                      </button>

                      {/* Toggle Expand (+) / (-) */}
                      {hasSub && (
                        <div className="flex items-center shrink-0 ml-2">
                          <button
                            type="button"
                            onClick={e => handleToggleExpand(cat.id, e)}
                            className="w-5 h-5 flex items-center justify-center rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700/80 text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
                            title={isExpanded ? 'Collapse subcategories' : 'Expand subcategories'}
                          >
                            {isExpanded ? (
                              <Minus className="w-3.5 h-3.5 text-[#0d9488] dark:text-[#2EE6CA]" />
                            ) : (
                              <Plus className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Subcategories Accordion Indented List */}
                    {hasSub && isExpanded && (
                      <div className="pl-3.5 ml-2.5 border-l-2 border-zinc-200/70 dark:border-zinc-800/80 space-y-0.5 py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                        {cat.subcategories!.map(sub => {
                          const isSubActive = isCatActive && activeSubcategory === sub.id

                          return (
                            <button
                              key={sub.id}
                              onClick={() => handleSelectSubcategory(cat.id, sub.id)}
                              className={`w-full flex items-center justify-between py-1.5 px-2 rounded-md text-xs font-mono transition-all text-left cursor-pointer ${
                                isSubActive
                                  ? 'text-[#0d9488] dark:text-[#2EE6CA] font-bold bg-[#0d9488]/10 dark:bg-[#2EE6CA]/10'
                                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/30'
                              }`}
                            >
                              <span className="truncate pr-1 flex items-center gap-1.5">
                                <span
                                  className={`w-1 h-1 rounded-full ${
                                    isSubActive
                                      ? 'bg-[#0d9488] dark:bg-[#2EE6CA]'
                                      : 'bg-zinc-400 dark:bg-zinc-600'
                                  }`}
                                ></span>
                                <span>{sub.label}</span>
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* 3. Needle Matrix Info Note */}
            {(activeCategory === 'cartridges' || activeCategory === 'needles') && (
              <div className="pt-5 border-t border-zinc-200/60 dark:border-zinc-800/60 text-[11px] font-mono text-zinc-400 leading-relaxed">
                <div className="font-bold text-zinc-500 uppercase mb-1">CARTRIDGE CONFIGURATIONS</div>
                <p>
                  Both master cartridge lines include 60+ unified configurations: Round Liner (RL), Round Shader (RS), Magnum (M1), and Curved Magnum (M1C) across #08, #10, #12, #14. Click a product to configure.
                </p>
              </div>
            )}
          </aside>

          {/* Right Product Grid Area */}
          <main className="flex-1 min-w-0 space-y-6">
            {/* Top Toolbar: Count & Sort Dropdown */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white dark:bg-[#11141A] gap-4">
              <div className="text-xs font-mono text-zinc-500">
                DISPLAYING {loading ? '...' : <strong className="text-zinc-950 dark:text-[#2EE6CA]">{sortedProducts.length}</strong>} APPARATUS
                {activeSeries !== 'all' && (
                  <span className="ml-2 px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold uppercase">
                    {activeSeries}
                  </span>
                )}
              </div>

              {/* Sort Order Selector */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-zinc-400">SORT BY:</span>
                <select
                  value={sortOption}
                  onChange={e => setSortOption(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-[#161922] text-xs font-mono text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:border-[#2EE6CA]"
                >
                  <option value="featured">Featured Apparatus</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="title-asc">Apparatus Title: A-Z</option>
                </select>
              </div>
            </div>

            {/* Product Cards Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 xl:gap-8">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                  <div
                    key={n}
                    className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white dark:bg-[#12151B] p-5 animate-pulse space-y-4"
                  >
                    <div className="w-full aspect-square bg-zinc-200 dark:bg-[#1A1E27] rounded-xl"></div>
                    <div className="h-4 bg-zinc-200 dark:bg-[#1A1E27] rounded-sm w-3/4"></div>
                    <div className="h-3 bg-zinc-200 dark:bg-[#1A1E27] rounded-sm w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 xl:gap-8">
                {sortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-dashed border-zinc-300 dark:border-[#222731] rounded-2xl p-8 bg-white dark:bg-[#0C0E12]">
                <div className="inline-flex p-4 rounded-full bg-zinc-100 dark:bg-[#1A1D25] text-zinc-400 mb-4">
                  <Filter className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold uppercase text-zinc-800 dark:text-zinc-200">
                  No apparatus matched your criteria
                </h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                  Try clearing your search query or switching needle configuration profiles.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-5 px-5 py-2.5 rounded-lg bg-zinc-950 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 font-mono font-bold text-xs uppercase transition-opacity hover:opacity-90"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>
        </div>

        {/* 4. Bottom SEO & Global Studio GEO Distribution Monograph */}
        <section className="mt-20 pt-12 border-t border-zinc-200/80 dark:border-white/[0.08]">
          <div className="max-w-4xl mb-8 space-y-2">
            <div className="text-[10px] font-mono font-medium text-[#0d9488] dark:text-[#2ee6ca] uppercase tracking-widest">
              GLOBAL STUDIO SPECIFICATION · REGULATORY &amp; DISPATCH STANDARDS
            </div>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-zinc-950 dark:text-white font-['Montserrat',sans-serif]">
              PROFESSIONAL TATTOO APPARATUS &amp; WORLDWIDE DISTRIBUTION
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
              Engineered exclusively for licensed tattoo studios and resident artists. All Papa apparatus, cartridges, and rotary systems adhere to strict international metallurgical and sterile batch manufacturing standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* GEO & Dispatch Pillar */}
            <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#16181e] space-y-3">
              <div className="text-xs font-mono font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                WORLDWIDE STUDIO LOGISTICS
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
                Direct express air dispatch to tattoo studios and supply partners across 40+ countries including the United States, Canada, United Kingdom, Germany, France, Italy, Spain, and Australia with dedicated customs clearance.
              </p>
              <div className="pt-2 text-[10px] font-mono text-[#0d9488] dark:text-[#2ee6ca]">
                40+ Countries · Priority Tracking
              </div>
            </div>

            {/* Metallurgy & Sterility Pillar */}
            <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#16181e] space-y-3">
              <div className="text-xs font-mono font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                316L SURGICAL METALLURGY
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
                Precision ground 316L surgical stainless steel needle pins assembled in Class 100,000 cleanrooms. 100% individual EO Gas blister packed with verifiable batch sterilization indicators.
              </p>
              <div className="pt-2 text-[10px] font-mono text-amber-500">
                Individual EO Blister · Medical Grade PC
              </div>
            </div>

            {/* Machine & Battery Compatibility */}
            <div className="p-6 rounded-2xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#16181e] space-y-3">
              <div className="text-xs font-mono font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                UNIVERSAL DOCK COMPATIBILITY
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
                Standardized collar geometry engineered for flawless fitment across major rotary pens, wireless battery chassis, and cartridge grips (Cheyenne, Bishop, FK Irons, Critical).
              </p>
              <div className="pt-2 text-[10px] font-mono text-zinc-400">
                Universal Cartridge Keyway · Zero Rattle
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
