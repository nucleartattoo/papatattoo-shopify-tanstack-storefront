import React, { useState, useEffect, useMemo } from 'react'
import { Link, useSearch, useNavigate } from '@tanstack/react-router'
import { ShopifyProduct } from '../types/shopify'
import { getProducts, isGranularCartridge } from '../lib/shopify'
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
} from 'lucide-react'

export interface CollectionSearchProps {
  category?: string
  q?: string
  series?: 'all' | 'premium' | 'standard'
  needle?: string
  sort?: 'featured' | 'price-asc' | 'price-desc' | 'title-asc'
}

export const CollectionPage: React.FC = () => {
  const { t, locale } = useLocale()
  const searchParams: CollectionSearchProps = useSearch({ strict: false })
  const navigate = useNavigate()

  const [products, setProducts] = useState<ShopifyProduct[]>([])
  const [loading, setLoading] = useState(true)

  // Filter States initialized from URL query params
  const [activeCategory, setActiveCategory] = useState<string>(searchParams.category || 'all')
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.q || '')
  const [activeSeries, setActiveSeries] = useState<'all' | 'premium' | 'standard'>(
    searchParams.series || 'all'
  )
  const [needleProfile, setNeedleProfile] = useState<string>(searchParams.needle || 'all')
  const [sortOption, setSortOption] = useState<string>(searchParams.sort || 'featured')
  const [inStockOnly, setInStockOnly] = useState<boolean>(false)

  // Synchronize state when URL query params change
  useEffect(() => {
    if (searchParams.category) setActiveCategory(searchParams.category)
    if (searchParams.q !== undefined) setSearchQuery(searchParams.q)
    if (searchParams.series) setActiveSeries(searchParams.series)
    if (searchParams.needle) setNeedleProfile(searchParams.needle)
    if (searchParams.sort) setSortOption(searchParams.sort)
  }, [searchParams.category, searchParams.q, searchParams.series, searchParams.needle, searchParams.sort])

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

  // Multi-tier filtering
  const filteredProducts = useMemo(() => {
    return products.filter(prod => {
      const titleLower = prod.title.toLowerCase()

      // 0. Exclude raw un-consolidated single-needle cartridge SKUs unconditionally
      if (isGranularCartridge(prod)) {
        return false
      }

      // 1. Text Search
      if (searchQuery) {
        const queryLower = searchQuery.toLowerCase()
        const matchesTitle = titleLower.includes(queryLower)
        const matchesTags = prod.tags && prod.tags.some(tag => tag.toLowerCase().includes(queryLower))
        if (!matchesTitle && !matchesTags) return false
      }

      // 2. Category Discipline
      if (activeCategory === 'grips') {
        if (!titleLower.includes('grip')) return false
      } else if (activeCategory === 'machines') {
        if (
          !titleLower.includes('machine') &&
          !titleLower.includes('pen') &&
          !titleLower.includes('power') &&
          !titleLower.includes('atom') &&
          !titleLower.includes('critical') &&
          !titleLower.includes('cheyenne')
        )
          return false
      } else if (activeCategory === 'needles') {
        // Needle Cartridges strictly only show the 2 master consolidated products
        const isConsolidatedCartridge =
          prod.handle === 'papa-premium-tattoo-cartridges' ||
          prod.handle === 'papa-standard-tattoo-cartridges'
        if (!isConsolidatedCartridge) return false
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
  }, [products, searchQuery, activeCategory, activeSeries, inStockOnly])

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

  // Statistics
  const premiumCount = products.filter(p => p.handle === 'papa-premium-tattoo-cartridges').length
  const standardCount = products.filter(p => p.handle === 'papa-standard-tattoo-cartridges').length
  const gripsCount = products.filter(p => p.title.toLowerCase().includes('grip')).length
  const machinesCount = products.filter(p => p.title.toLowerCase().includes('pen') || p.title.toLowerCase().includes('machine') || p.title.toLowerCase().includes('atom')).length

  const handleResetFilters = () => {
    setActiveCategory('all')
    setSearchQuery('')
    setActiveSeries('all')
    setNeedleProfile('all')
    setSortOption('featured')
    setInStockOnly(false)
    navigate({ to: '/collections', search: { category: 'all' } })
  }

  const getCategoryTitle = () => {
    switch (activeCategory) {
      case 'needles':
        return 'PAPA NEEDLE CARTRIDGES'
      case 'machines':
        return 'ROTARY TATTOO MACHINES'
      case 'grips':
        return 'CARTRIDGE CLICK GRIPS'
      default:
        return 'ALL APPARATUS & SUPPLIES'
    }
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
              // PRODUCT CATALOG ({products.length} REGISTERED IN SHOP)
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar Filter Column */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Quick Search */}
            <div className="rounded-xl border border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#11141A] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold uppercase text-zinc-400">SEARCH GEAR</span>
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-[10px] font-mono text-zinc-400 hover:text-white">
                    CLEAR
                  </button>
                )}
              </div>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="SKU, Pen, M1, RL..."
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-zinc-200 dark:border-[#222731] bg-zinc-50 dark:bg-[#161922] text-xs font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:border-[#2EE6CA]"
                />
              </div>
            </div>

            {/* Disciplines Selection */}
            <div className="rounded-xl border border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#11141A] p-4 space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-zinc-400 block mb-3">
                PRODUCT CATEGORIES
              </span>
              {[
                { id: 'all', label: 'All Products', count: products.length },
                { id: 'needles', label: 'Needle Cartridges', count: standardCount + premiumCount },
                { id: 'grips', label: 'Cartridge Grips', count: gripsCount },
                { id: 'machines', label: 'Rotary Machines', count: machinesCount },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id)
                    if (cat.id !== 'needles') {
                      setActiveSeries('all')
                      setNeedleProfile('all')
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                    activeCategory === cat.id
                      ? 'bg-zinc-900 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#181C25]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="text-[10px] opacity-80">{cat.count}</span>
                </button>
              ))}
            </div>

            {/* Cartridge Series Filter */}
            {(activeCategory === 'needles' || activeCategory === 'all') && (
              <div className="rounded-xl border border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#11141A] p-4 space-y-2">
                <span className="text-xs font-mono font-bold uppercase text-zinc-400 flex items-center justify-between mb-3">
                  <span>NEEDLE SERIES</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                </span>

                <button
                  onClick={() => setActiveSeries('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                    activeSeries === 'all'
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#181C25]'
                  }`}
                >
                  All Series ({standardCount + premiumCount})
                </button>

                <button
                  onClick={() => setActiveSeries('premium')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono font-bold flex items-center justify-between transition-all ${
                    activeSeries === 'premium'
                      ? 'bg-amber-500 text-zinc-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                      : 'border border-amber-500/40 text-amber-500 hover:bg-amber-500/10'
                  }`}
                >
                  <span>⭐ PAPA PREMIUM</span>
                  <span>({premiumCount})</span>
                </button>

                <button
                  onClick={() => setActiveSeries('standard')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono font-bold flex items-center justify-between transition-all ${
                    activeSeries === 'standard'
                      ? 'bg-zinc-900 text-white dark:bg-[#2EE6CA] dark:text-zinc-950'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-[#181C25]'
                  }`}
                >
                  <span>STANDARD SERIES</span>
                  <span>({standardCount})</span>
                </button>
              </div>
            )}

            {/* Needle Matrix Guide */}
            {activeCategory === 'needles' && (
              <div className="rounded-xl border border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#11141A] p-4 space-y-2 text-xs font-mono">
                <span className="font-bold uppercase text-zinc-400 block">
                  INTEGRATED MATRIX SPECS
                </span>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Both master cartridge lines include 60+ unified configurations: Round Liner (RL), Round Shader (RS), Magnum (M1), and Curved Magnum (M1C) across #08, #10, #12, #14. Click a product to customize.
                </p>
              </div>
            )}

            {/* Reset Filter Button */}
            <button
              onClick={handleResetFilters}
              className="w-full py-2.5 rounded-xl border border-zinc-200 dark:border-[#222731] hover:border-zinc-400 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white text-xs font-mono font-bold uppercase flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </aside>

          {/* Right Product Grid Area */}
          <main className="lg:col-span-3 space-y-6">
            {/* Top Toolbar: Count & Sort Dropdown */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#11141A] gap-4">
              <div className="text-xs font-mono text-zinc-500">
                DISPLAYING <strong className="text-zinc-950 dark:text-[#2EE6CA]">{sortedProducts.length}</strong> APPARATUS
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
