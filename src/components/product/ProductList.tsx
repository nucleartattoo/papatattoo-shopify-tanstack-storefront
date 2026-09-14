import React, { useState, useEffect } from 'react'
import { ShopifyProduct } from '../../types/shopify'
import { getProducts, isGranularCartridge } from '../../lib/shopify'
import { ProductCard } from './ProductCard'
import { useLocale } from '../../context/LocaleContext'
import { Filter, Search, Sparkles, Layers, SlidersHorizontal } from 'lucide-react'

interface ProductListProps {
  categoryFilter?: string
  initialSearch?: string
  initialSeries?: 'all' | 'premium' | 'standard'
}

export const ProductList: React.FC<ProductListProps> = ({
  categoryFilter = 'all',
  initialSearch = '',
  initialSeries = 'all',
}) => {
  const { locale, t } = useLocale()
  const [products, setProducts] = useState<ShopifyProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [activeTab, setActiveTab] = useState(categoryFilter)

  // Sub-series filter for Cartridges: 'all' | 'premium' | 'standard'
  const [cartridgeSeries, setCartridgeSeries] = useState<'all' | 'premium' | 'standard'>(initialSeries)

  // Needle configuration sub-filter: 'all' | 'rl' | 'rs' | 'm1' | 'm1c'
  const [needleType, setNeedleType] = useState<string>('all')

  useEffect(() => {
    setActiveTab(categoryFilter)
  }, [categoryFilter])

  useEffect(() => {
    setSearchQuery(initialSearch)
  }, [initialSearch])

  useEffect(() => {
    setCartridgeSeries(initialSeries)
  }, [initialSeries])

  useEffect(() => {
    let isMounted = true
    async function fetchCatalog() {
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
    fetchCatalog()
    return () => {
      isMounted = false
    }
  }, [locale])

  // Multi-tier filtering
  const filteredProducts = products.filter(prod => {
    // 0. Exclude raw un-consolidated single-needle cartridge SKUs unconditionally
    if (isGranularCartridge(prod)) {
      return false
    }

    const titleLower = prod.title.toLowerCase()

    // 1. Search Query
    const matchesSearch =
      titleLower.includes(searchQuery.toLowerCase()) ||
      (prod.tags && prod.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))

    if (!matchesSearch) return false

    // 2. Main Category Filter
    if (activeTab === 'grips') {
      if (!titleLower.includes('grip')) return false
    } else if (activeTab === 'machines') {
      if (!titleLower.includes('machine') && !titleLower.includes('pen') && !titleLower.includes('power') && !titleLower.includes('atom') && !titleLower.includes('critical') && !titleLower.includes('cheyenne')) return false
    } else if (activeTab === 'needles') {
      const isConsolidated =
        prod.handle === 'papa-premium-tattoo-cartridges' ||
        prod.handle === 'papa-standard-tattoo-cartridges'
      if (!isConsolidated) return false
    }

    // 3. Cartridge Sub-Series Filter (Standard vs Premium)
    if (cartridgeSeries === 'premium') {
      if (prod.handle !== 'papa-premium-tattoo-cartridges') return false
    } else if (cartridgeSeries === 'standard') {
      if (prod.handle !== 'papa-standard-tattoo-cartridges') return false
    }

    return true
  })

  // Count statistics for the badge
  const premiumCount = products.filter(p => p.handle === 'papa-premium-tattoo-cartridges').length
  const standardCount = products.filter(p => p.handle === 'papa-standard-tattoo-cartridges').length

  return (
    <section id="catalog-section" className="py-16 bg-zinc-50 dark:bg-[#090A0C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-zinc-200 dark:border-[#222731] gap-4">
          <div>
            <div className="text-[11px] font-mono font-bold tracking-widest text-[#0d9488] dark:text-[#2EE6CA] uppercase">
              // STUDIO INVENTORY SYSTEM ({products.length} APPARATUS SYNCED)
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-white uppercase tracking-tight">
              AVAILABLE GEAR & HARDWARE
            </h2>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search specs, model, finish, RL, M1..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#121419] text-xs font-mono text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-hidden focus:border-[#2EE6CA]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400 hover:text-zinc-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Primary Category Filter Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'all', label: t('filter_all'), count: products.length },
              { id: 'needles', label: t('filter_cartridges'), count: standardCount + premiumCount },
              { id: 'grips', label: t('filter_grips'), count: products.filter(p => p.title.toLowerCase().includes('grip')).length },
              { id: 'machines', label: t('filter_machines'), count: products.filter(p => p.title.toLowerCase().includes('pen') || p.title.toLowerCase().includes('machine') || p.title.toLowerCase().includes('atom')).length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  if (tab.id !== 'needles') {
                    setCartridgeSeries('all')
                    setNeedleType('all')
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-mono font-bold uppercase whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-zinc-950 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 shadow-sm'
                    : 'bg-white dark:bg-[#14171D] text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-[#222731] hover:border-zinc-400'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === tab.id ? 'bg-zinc-800 text-white dark:bg-zinc-900 dark:text-[#2EE6CA]' : 'bg-zinc-100 dark:bg-[#1B202A] text-zinc-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Specialized Cartridge Series & Configuration Bar */}
        {(activeTab === 'needles' || activeTab === 'all') && (
          <div className="mb-8 p-4 rounded-xl border border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#11141B] space-y-3">
            {/* Series Selector */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-[#1E232E]">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-500 uppercase">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#0d9488] dark:text-[#2EE6CA]" />
                <span>CARTRIDGE SERIES:</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setCartridgeSeries('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                    cartridgeSeries === 'all'
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950'
                      : 'bg-zinc-100 dark:bg-[#181C25] text-zinc-600 dark:text-zinc-400 hover:text-white'
                  }`}
                >
                  All Series ({standardCount + premiumCount})
                </button>

                {/* ⭐ Premium Cartridges Tab */}
                <button
                  onClick={() => setCartridgeSeries('premium')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                    cartridgeSeries === 'premium'
                      ? 'bg-amber-500 text-zinc-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                      : 'border border-amber-500/40 text-amber-500 hover:bg-amber-500/10'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>PAPA PREMIUM SERIES ({premiumCount})</span>
                </button>

                {/* Standard Cartridges Tab */}
                <button
                  onClick={() => setCartridgeSeries('standard')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                    cartridgeSeries === 'standard'
                      ? 'bg-zinc-900 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 shadow-sm'
                      : 'border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>STANDARD SERIES ({standardCount})</span>
                </button>
              </div>
            </div>

            {/* Needle Configuration Quick Filters (RL / RS / M1 / M1C) */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="text-zinc-500 uppercase font-semibold text-[11px] mr-1">CONFIGURATION:</span>
              {[
                { id: 'all', label: 'All Profiles' },
                { id: 'rl', label: 'Round Liner (RL)' },
                { id: 'rs', label: 'Round Shader (RS)' },
                { id: 'm1', label: 'Magnum (M1)' },
                { id: 'm1c', label: 'Curved Magnum (M1C / SEM)' },
              ].map(cfg => (
                <button
                  key={cfg.id}
                  onClick={() => setNeedleType(cfg.id)}
                  className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                    needleType === cfg.id
                      ? 'bg-teal-600 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 font-bold'
                      : 'bg-zinc-100 dark:bg-[#181C25] text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                  }`}
                >
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-6">
          <div>
            SHOWING <strong className="text-zinc-950 dark:text-[#2EE6CA]">{filteredProducts.length}</strong> APPARATUS
            {cartridgeSeries !== 'all' && (
              <span className="ml-2 px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                FILTER: {cartridgeSeries.toUpperCase()}
              </span>
            )}
          </div>
          {cartridgeSeries === 'premium' && (
            <div className="text-amber-500 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>JAPANESE 316L SURGICAL STEEL · SAFETY MEMBRANE</span>
            </div>
          )}
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
              <div
                key={n}
                className="rounded-xl border border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#12151B] p-4 animate-pulse space-y-4"
              >
                <div className="w-full aspect-square bg-zinc-200 dark:bg-[#1A1E27] rounded-lg"></div>
                <div className="h-4 bg-zinc-200 dark:bg-[#1A1E27] rounded-sm w-3/4"></div>
                <div className="h-3 bg-zinc-200 dark:bg-[#1A1E27] rounded-sm w-1/2"></div>
                <div className="h-8 bg-zinc-200 dark:bg-[#1A1E27] rounded-sm w-full mt-4"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          /* Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 border border-dashed border-zinc-300 dark:border-[#222731] rounded-2xl p-8">
            <div className="inline-flex p-3 rounded-full bg-zinc-100 dark:bg-[#1A1D25] text-zinc-500 mb-3">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200 uppercase">
              No apparatus matched criteria
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              Try switching back to "All Series" or clearing the configuration filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setActiveTab('all')
                setCartridgeSeries('all')
                setNeedleType('all')
              }}
              className="mt-4 px-4 py-2 rounded bg-zinc-900 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 text-xs font-mono font-bold uppercase"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
