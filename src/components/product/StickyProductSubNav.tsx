import React from 'react'
import { ShoppingBag, Check } from 'lucide-react'

export type PdpSectionId = 'overview' | 'engineering' | 'specs' | 'service'

interface StickyProductSubNavProps {
  title: string
  specLine?: string
  price: number
  currency: string
  unitLabel?: string
  activeSection: PdpSectionId
  onSelectSection: (sectionId: PdpSectionId) => void
  onAddToCart: () => void
  isAvailable: boolean
  isAddedAnimation: boolean
}

const SECTION_LINKS: Array<{ id: PdpSectionId; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'specs', label: 'Tech Specs' },
  { id: 'service', label: 'Warranty & Service' },
]

export const StickyProductSubNav: React.FC<StickyProductSubNavProps> = ({
  title,
  specLine,
  price,
  currency,
  unitLabel,
  activeSection,
  onSelectSection,
  onAddToCart,
  isAvailable,
  isAddedAnimation,
}) => {
  return (
    <nav
      aria-label="Product Sub-Navigation"
      className="sticky top-14 z-30 w-full apple-glass-chrome border-b border-black/[0.06] dark:border-white/[0.08] transition-colors duration-200"
    >
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-12 sm:h-13 flex items-center justify-between gap-4">
          {/* Left: Product Name & Category Badge */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => onSelectSection('overview')}
              className="text-left truncate font-semibold text-sm sm:text-base text-[#1d1d1f] dark:text-[#f5f5f7] hover:opacity-80 transition-opacity cursor-pointer"
            >
              {title}
            </button>
            {specLine && (
              <span className="hidden xl:inline-block text-xs text-[#86868b] truncate max-w-xs border-l border-black/10 dark:border-white/10 pl-3">
                {specLine}
              </span>
            )}
          </div>

          {/* Center: In-Page Section Anchor Tabs (Desktop) */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-full bg-black/[0.03] dark:bg-white/[0.05]">
            {SECTION_LINKS.map(tab => {
              const isActive = activeSection === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelectSection(tab.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-[transform,background-color,color,box-shadow] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-[#1d1d1f] dark:bg-[#2c2c2e] dark:text-white shadow-2xs font-semibold'
                      : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Right: Real-time Price & Add to Bag Action */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <span className="text-sm sm:text-base font-semibold tracking-[-0.02em] tabular-nums text-[#1d1d1f] dark:text-[#f5f5f7]">
                ${price.toFixed(2)}
              </span>
              <span className="hidden sm:inline text-[11px] text-[#86868b] ml-1">
                {currency} {unitLabel ? `· ${unitLabel}` : ''}
              </span>
            </div>

            {isAvailable ? (
              <button
                type="button"
                onClick={onAddToCart}
                className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] text-xs font-medium inline-flex items-center gap-1.5 hover:opacity-88 active:scale-[0.97] transition-[transform,opacity] duration-150 ease-[var(--ease-out-strong)] cursor-pointer"
              >
                {isAddedAnimation ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-black/[0.05] text-[#86868b] dark:bg-white/[0.08] text-xs font-medium cursor-not-allowed"
              >
                Sold Out
              </button>
            )}
          </div>
        </div>

        {/* Mobile Horizontal Micro-Tabs */}
        <div className="md:hidden flex items-center gap-2 overflow-x-auto no-scrollbar py-1.5 border-t border-black/[0.04] dark:border-white/[0.06]">
          {SECTION_LINKS.map(tab => {
            const isActive = activeSection === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectSection(tab.id)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-black/[0.08] dark:bg-white/[0.12] text-[#1d1d1f] dark:text-white font-semibold'
                    : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
