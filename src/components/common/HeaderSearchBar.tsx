import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Search, X, ArrowRight, Sparkles, Command, CornerDownLeft } from 'lucide-react'
import { catalogQueryOptions } from '../../lib/catalog.queries'
import { useLocale } from '../../context/LocaleContext'

interface HeaderSearchBarProps {
  className?: string
  placeholder?: string
  onCloseMobile?: () => void
  isMobile?: boolean
}

const POPULAR_SEARCHES = [
  'Papa Pen V3',
  'Needle Cartridges',
  'Adjustable Grips',
  'Rotary Machines',
  'Wireless Battery',
  'Travel Case',
]

export const HeaderSearchBar: React.FC<HeaderSearchBarProps> = ({
  className = '',
  placeholder,
  onCloseMobile,
  isMobile = false,
}) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { t: _t } = useLocale()

  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 1. Lazy TanStack Query catalog subscription (only fetches when search opens or reuses SSR cache)
  const { data: catalog = [] } = useQuery({
    ...catalogQueryOptions,
    enabled: isOpen,
  })

  const warmCatalogCache = () => {
    void queryClient.prefetchQuery(catalogQueryOptions)
  }

  // 2. Global Hotkey Listener: ⌘K or / to focus search, Escape to close
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        inputRef.current?.blur()
        return
      }

      // Don't trigger if user is already typing in an input, textarea or contenteditable
      const target = e.target as HTMLElement
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setIsOpen(true)
      } else if (e.key === '/' && !isInput) {
        e.preventDefault()
        inputRef.current?.focus()
        setIsOpen(true)
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [])

  // 3. Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 4. Live Filtered Suggestions
  const searchResults = useMemo(() => {
    const cleanQ = query.trim().toLowerCase()
    if (!cleanQ) return []

    return catalog
      .filter(item => {
        const titleMatch = item.title.toLowerCase().includes(cleanQ)
        const descMatch = (item.description || '').toLowerCase().includes(cleanQ)
        const tagMatch = item.tags && item.tags.some(tag => tag.toLowerCase().includes(cleanQ))
        return titleMatch || descMatch || tagMatch
      })
      .slice(0, 6)
  }, [catalog, query])

  // 5. Submit handler
  const handleSearchSubmit = (searchTerm?: string) => {
    const term = ((searchTerm ?? query) || inputRef.current?.value || '').trim()
    if (!term) return

    setIsOpen(false)
    inputRef.current?.blur()
    if (onCloseMobile) onCloseMobile()

    navigate({
      to: '/collections',
      search: { q: term, category: 'all' },
    })
  }

  // 6. Direct product click
  const handleProductSelect = (handle: string) => {
    setIsOpen(false)
    inputRef.current?.blur()
    if (onCloseMobile) onCloseMobile()

    navigate({
      to: '/products/$handle',
      params: { handle },
    })
  }

  // 7. Keyboard Navigation (Arrows & Enter)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
      return
    }

    if (!isOpen) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev > -1 ? prev - 1 : -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        handleProductSelect(searchResults[selectedIndex].handle)
      } else {
        handleSearchSubmit()
      }
    }
  }

  const defaultPlaceholder =
    placeholder || 'Search entire store here...'

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Bar */}
      <form
        onSubmit={e => {
          e.preventDefault()
          handleSearchSubmit()
        }}
        className="relative flex items-center"
      >
        {/* Left Magnifying Glass Icon */}
        <div className="absolute left-3.5 flex items-center pointer-events-none text-[#86868b]">
          <Search className="w-3.5 h-3.5" />
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          aria-label="Search store apparatus"
          onMouseEnter={warmCatalogCache}
          onChange={e => {
            setQuery(e.target.value)
            setSelectedIndex(-1)
            if (!isOpen) setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={defaultPlaceholder}
          className="w-full h-9 pl-9 pr-10 text-xs font-sans rounded-full border border-transparent bg-black/[0.045] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7] placeholder:text-[#86868b] focus:outline-hidden focus:bg-white dark:focus:bg-[#1c1c1e] focus:border-black/15 dark:focus:border-white/20 transition-all duration-150"
          autoComplete="off"
          spellCheck="false"
        />

        {/* Right Action Widgets: Clear button & Hotkey indicator */}
        <div className="absolute right-3 flex items-center gap-1.5">
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setSelectedIndex(-1)
                inputRef.current?.focus()
              }}
              className="p-0.5 rounded-full text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Clear search query"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            !isMobile && (
              <kbd className="hidden xl:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-sans text-[#86868b] rounded-md bg-black/[0.04] dark:bg-white/[0.06] pointer-events-none select-none">
                <Command className="w-2.5 h-2.5" />
                <span>K</span>
              </kbd>
            )
          )}
        </div>
      </form>

      {/* Live Suggestions Dropdown (Autocomplete — anchored to input origin with translucent material §7, §12) */}
      {isOpen && (
        <div className="origin-top absolute top-full left-0 right-0 mt-2 rounded-2xl border border-zinc-200/80 dark:border-white/[0.1] apple-glass-popover overflow-hidden z-50 text-xs animate-in fade-in zoom-in-95 duration-150 ease-[var(--ease-out-strong)]">
          {/* Case A: Query is Empty - Popular Searches & Quick Categories */}
          {query.trim().length === 0 && (
            <div className="p-4 space-y-4 font-mono">
              <div>
                <div className="text-[10px] font-bold text-[#0d9488] dark:text-[#2EE6CA] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>TRENDING APPARATUS SEARCHES</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_SEARCHES.map(item => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleSearchSubmit(item)}
                      className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-[#161922] hover:bg-zinc-200 dark:hover:bg-[#1E2330] text-zinc-700 dark:text-zinc-300 text-[11px] transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] flex items-center gap-1.5"
                    >
                      <Search className="w-2.5 h-2.5 text-zinc-400" />
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-100 dark:border-[#1E232E]">
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  DISCIPLINE SHORTCUTS
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false)
                      if (onCloseMobile) onCloseMobile()
                      navigate({ to: '/collections', search: { category: 'needles' } })
                    }}
                    className="p-2 rounded-lg bg-zinc-50 dark:bg-[#12151C] hover:bg-zinc-100 dark:hover:bg-[#1A1E27] text-left text-zinc-700 dark:text-zinc-300 transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.98] flex items-center justify-between"
                  >
                    <span>Needle Cartridges</span>
                    <span className="text-[#0d9488] dark:text-[#2EE6CA]">→</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false)
                      if (onCloseMobile) onCloseMobile()
                      navigate({ to: '/collections', search: { category: 'grips' } })
                    }}
                    className="p-2 rounded-lg bg-zinc-50 dark:bg-[#12151C] hover:bg-zinc-100 dark:hover:bg-[#1A1E27] text-left text-zinc-700 dark:text-zinc-300 transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.98] flex items-center justify-between"
                  >
                    <span>Adjustable Grips</span>
                    <span className="text-[#0d9488] dark:text-[#2EE6CA]">→</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false)
                      if (onCloseMobile) onCloseMobile()
                      navigate({ to: '/collections', search: { category: 'machines' } })
                    }}
                    className="p-2 rounded-lg bg-zinc-50 dark:bg-[#12151C] hover:bg-zinc-100 dark:hover:bg-[#1A1E27] text-left text-zinc-700 dark:text-zinc-300 transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.98] flex items-center justify-between"
                  >
                    <span>Rotary Machines</span>
                    <span className="text-[#0d9488] dark:text-[#2EE6CA]">→</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false)
                      if (onCloseMobile) onCloseMobile()
                      navigate({ to: '/collections', search: { category: 'all' } })
                    }}
                    className="p-2 rounded-lg bg-zinc-50 dark:bg-[#12151C] hover:bg-zinc-100 dark:hover:bg-[#1A1E27] text-left text-zinc-700 dark:text-zinc-300 transition-[transform,background-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.98] flex items-center justify-between"
                  >
                    <span>All Products (392)</span>
                    <span className="text-[#0d9488] dark:text-[#2EE6CA]">→</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Case B: User has typed a Query */}
          {query.trim().length > 0 && (
            <div>
              {/* Header result count */}
              <div className="px-4 py-2 bg-zinc-50 dark:bg-[#12151C] border-b border-zinc-100 dark:border-[#1A1E27] flex items-center justify-between font-mono text-[11px] text-zinc-500">
                <span>
                  SUGGESTED PRODUCTS ({searchResults.length})
                </span>
                <span className="text-[10px] text-zinc-400">
                  Press <CornerDownLeft className="inline w-2.5 h-2.5" /> to search catalog
                </span>
              </div>

              {/* Matching products list */}
              {searchResults.length > 0 ? (
                <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100 dark:divide-[#1A1E27]">
                  {searchResults.map((prod, index) => {
                    const isSelected = selectedIndex === index
                    const imageUrl = prod.images?.edges?.[0]?.node?.url || '/promos/papapenfullstack.jpeg'
                    const price = prod.priceRange?.minVariantPrice?.amount
                      ? `$${parseFloat(prod.priceRange.minVariantPrice.amount).toFixed(2)}`
                      : '$28.00'

                    return (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => handleProductSelect(prod.handle)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full p-3 flex items-center gap-3 text-left transition-colors ${
                          isSelected
                            ? 'bg-zinc-100 dark:bg-[#181D26]'
                            : 'hover:bg-zinc-50 dark:hover:bg-[#141720]'
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className="w-11 h-11 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200 dark:border-zinc-700/50">
                          <img
                            src={imageUrl}
                            alt={prod.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/slides/slide_2_premium_cartridges.png'
                            }}
                          />
                        </div>

                        {/* Title & Info */}
                        <div className="flex-1 min-w-0 font-mono">
                          <div className="text-xs font-bold text-zinc-950 dark:text-white truncate">
                            {prod.title}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-0.5">
                            <span className="text-[#0d9488] dark:text-[#2EE6CA] font-bold">
                              {price} USD
                            </span>
                            <span>·</span>
                            <span className="text-emerald-500 font-medium">In Stock</span>
                            {prod.tags && prod.tags.length > 0 && (
                              <>
                                <span>·</span>
                                <span className="uppercase text-[9px] px-1 py-0.2 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 truncate max-w-[100px]">
                                  {prod.tags[0]}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Arrow */}
                        <ArrowRight className="w-4 h-4 text-zinc-400 shrink-0" />
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="p-6 text-center font-mono space-y-2">
                  <div className="text-zinc-500 text-xs">
                    No instant apparatus found for &quot;<span className="text-zinc-900 dark:text-white font-bold">{query}</span>&quot;
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSearchSubmit()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-[#1A1E27] text-zinc-800 dark:text-zinc-200 text-xs font-bold hover:text-[#0d9488] dark:hover:text-[#2EE6CA]"
                  >
                    <span>Search Full 392-Item Catalog</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Bottom "View all results" Footer Bar */}
              <div className="p-3 bg-zinc-50 dark:bg-[#12151C] border-t border-zinc-100 dark:border-[#1A1E27] flex items-center justify-between font-mono">
                <button
                  type="button"
                  onClick={() => handleSearchSubmit()}
                  className="w-full py-2 px-3 rounded-xl bg-zinc-950 text-white dark:bg-[#2EE6CA] dark:text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>View All Results For &quot;{query}&quot;</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
