import React, { useState, useEffect, useMemo } from 'react'
import { Link, useSearch, useNavigate } from '@tanstack/react-router'
import { ShopifyProduct } from '../types/shopify'
import { getProducts, isGranularCartridge, isNuclearTattooProduct } from '../lib/shopify'
import { ProductCard } from '../components/product/ProductCard'
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

  const [products, setProducts] = useState<ShopifyProduct[]>([])
  const [loading, setLoading] = useState(true)

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
  }, [locale])

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
        const normCatId = activeCategory === 'needles' ? 'cartridges' : activeCategory
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
    const norm = activeCategory === 'needles' ? 'cartridges' : activeCategory
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
    <div className="py-8 bg-zinc-50 dark:bg-[#090A0C] min-h-screen text-zinc-900 dark:text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-6">
          <Link to="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            HOME
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          <Link to="/collections" search={{ category: 'all' }} className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            CATALOG
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-zinc-900 dark:text-[#2EE6CA] font-bold uppercase">{getCategoryTitle()}</span>
        </nav>

        {/* 2. Collection Header Banner */}
        <div className="mb-8 p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#101319] relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="text-[11px] font-mono font-bold tracking-widest text-[#0d9488] dark:text-[#2EE6CA] uppercase">
              // PRODUCT CATALOG ({loading ? '...' : nonGranularProducts.length} REGISTERED IN SHOP)
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mt-1 mb-2">
              {getCategoryTitle()}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Industrial grade tattoo engineering apparatus, medical 316L needle pins, and aerospace anodized alloy systems calibrated for professional artists.
            </p>
          </div>
        </div>

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
              {/* All Products */}
              <button
                onClick={() => handleSelectCategory('all')}
                className={`w-full flex items-center justify-between py-2 px-2.5 rounded-lg text-[13px] font-mono transition-all text-left cursor-pointer ${
                  activeCategory === 'all'
                    ? 'text-[#0d9488] dark:text-[#2EE6CA] font-bold bg-[#0d9488]/8 dark:bg-[#2EE6CA]/10 pl-3 border-l-2 border-[#0d9488] dark:border-[#2EE6CA]'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/40'
                }`}
              >
                <span>All Products</span>
                <span
                  className={`text-[11px] font-mono ${
                    activeCategory === 'all'
                      ? 'text-[#0d9488] dark:text-[#2EE6CA] font-bold'
                      : 'text-zinc-400'
                  }`}
                >
                  ({loading ? '...' : nonGranularProducts.length})
                </span>
              </button>

              {/* 7 Categories with (+) Expandable Accordion for Subcategories */}
              {STORE_CATEGORIES.map(cat => {
                const normActive = activeCategory === 'needles' ? 'cartridges' : activeCategory
                const isCatActive = normActive === cat.id
                const hasSub = !!cat.subcategories && cat.subcategories.length > 0
                const isExpanded = expandedCategories.has(cat.id)
                const count = categoryCounts[cat.id] || 0

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

                      {/* Count & Toggle Expand (+) / (-) */}
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <span
                          className={`text-[11px] font-mono ${
                            isCatActive && !activeSubcategory
                              ? 'text-[#0d9488] dark:text-[#2EE6CA] font-bold'
                              : 'text-zinc-400'
                          }`}
                        >
                          ({loading ? '...' : count})
                        </span>
                        {hasSub && (
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
                        )}
                      </div>
                    </div>

                    {/* Subcategories Accordion Indented List */}
                    {hasSub && isExpanded && (
                      <div className="pl-3.5 ml-2.5 border-l-2 border-zinc-200/70 dark:border-zinc-800/80 space-y-0.5 py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                        {cat.subcategories!.map(sub => {
                          const isSubActive = isCatActive && activeSubcategory === sub.id
                          const subCount = subcategoryCounts[sub.id] || 0

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
                              <span className="text-[10px] opacity-70 shrink-0 font-mono">
                                ({loading ? '...' : subCount})
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

            {/* 3. In-Stock Availability Toggle */}
            <div className="pt-5 border-t border-zinc-200/60 dark:border-zinc-800/60">
              <label className="flex items-center justify-between cursor-pointer group select-none">
                <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
                  In Stock Only
                </span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={e => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-[#0d9488] dark:text-[#2EE6CA] focus:ring-0 accent-[#2EE6CA] cursor-pointer"
                />
              </label>
            </div>

            {/* 4. Needle Matrix Info Note */}
            {(activeCategory === 'cartridges' || activeCategory === 'needles') && (
              <div className="pt-5 border-t border-zinc-200/60 dark:border-zinc-800/60 text-[11px] font-mono text-zinc-400 leading-relaxed">
                <div className="font-bold text-zinc-500 uppercase mb-1">// MATRIX CONFIGS</div>
                <p>
                  Both master cartridge lines include 60+ unified configurations: Round Liner (RL), Round Shader (RS), Magnum (M1), and Curved Magnum (M1C) across #08, #10, #12, #14. Click a product to configure.
                </p>
              </div>
            )}
          </aside>

          {/* Right Product Grid Area */}
          <main className="flex-1 min-w-0 space-y-6">
            {/* Top Toolbar: Count & Sort Dropdown */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#11141A] gap-4">
              <div className="text-xs font-mono text-zinc-500">
                DISPLAYING {loading ? '...' : <strong className="text-zinc-950 dark:text-[#2EE6CA]">{sortedProducts.length}</strong>} APPARATUS
                {activeSeries !== 'all' && (
                  <span className="ml-2 px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold uppercase">
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
                  className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-[#222731] bg-zinc-50 dark:bg-[#161922] text-xs font-mono text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:border-[#2EE6CA]"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <div
                    key={n}
                    className="rounded-xl border border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#12151B] p-4 animate-pulse space-y-4"
                  >
                    <div className="w-full aspect-square bg-zinc-200 dark:bg-[#1A1E27] rounded-lg"></div>
                    <div className="h-4 bg-zinc-200 dark:bg-[#1A1E27] rounded-sm w-3/4"></div>
                    <div className="h-3 bg-zinc-200 dark:bg-[#1A1E27] rounded-sm w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
      </div>
    </div>
  )
}
