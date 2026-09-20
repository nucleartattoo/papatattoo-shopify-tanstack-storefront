import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, Link } from '@tanstack/react-router'
import { ChevronDown, ArrowRight, LayoutGrid, Award, Mail, X } from 'lucide-react'
import { MEGA_MENU_DATA } from './MegaMenu'
import { formatProductImageUrl } from '../../utils/imageUrl'

interface RadixMegaMenuProps {
  onSelectCategory: (
    categoryId: string,
    query?: string,
    series?: 'premium' | 'standard',
    sub?: string
  ) => void
}

export const RadixMegaMenu: React.FC<RadixMegaMenuProps> = ({ onSelectCategory }) => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 200)
  }

  const handleProductsClick = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setIsOpen(false)
    navigate({ to: '/products' })
  }

  const handleSelect = (
    categoryId: string,
    query?: string,
    series?: 'premium' | 'standard',
    sub?: string
  ) => {
    onSelectCategory(categoryId, query, series, sub)
    setIsOpen(false)
  }

  // Support ESC key & click outside to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        const dropdown = document.getElementById('papa-megamenu-dropdown')
        if (dropdown && dropdown.contains(e.target as Node)) return
        setIsOpen(false)
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        window.removeEventListener('keydown', handleKeyDown)
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen])

  return (
    <div
      ref={menuRef}
      className="relative z-50 flex items-center"
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center gap-1.5 xl:gap-3 font-['Montserrat',sans-serif] text-[13.5px] xl:text-[16px] font-black uppercase tracking-tight [-webkit-text-stroke:0.35px_currentColor]">
        {/* 1. PAPA PRODUCTS Link: Native Anchor with Pointer Hand, Hover to open, Click to navigate */}
        <Link
          to="/products"
          onClick={() => setIsOpen(false)}
          onMouseEnter={handleMouseEnter}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg uppercase tracking-tight transition-colors cursor-pointer select-none ${
            isOpen
              ? 'text-zinc-950 dark:text-white bg-zinc-100 dark:bg-white/[0.12]'
              : 'text-zinc-950 dark:text-white hover:text-zinc-950 dark:hover:text-[#2ee6ca] hover:bg-zinc-100/70 dark:hover:bg-white/[0.06]'
          }`}
        >
          <span>PAPA PRODUCTS</span>
          <ChevronDown className={`w-3.5 h-3.5 xl:w-4 xl:h-4 transition-transform duration-200 opacity-80 ${isOpen ? 'rotate-180' : ''}`} />
        </Link>

        {/* 2. ARTISTS Link */}
        <Link
          to="/sponsorship-artists"
          onClick={() => setIsOpen(false)}
          className="px-3 py-2 rounded-lg uppercase tracking-tight text-zinc-950 dark:text-white hover:text-zinc-950 dark:hover:text-[#2ee6ca] hover:bg-zinc-100/70 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
        >
          <span>ARTISTS</span>
        </Link>

        {/* 3. DISTRIBUTORS Link */}
        <Link
          to="/distributors"
          onClick={() => setIsOpen(false)}
          className="px-3 py-2 rounded-lg uppercase tracking-tight text-zinc-950 dark:text-white hover:text-zinc-950 dark:hover:text-[#2ee6ca] hover:bg-zinc-100/70 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
        >
          <span>DISTRIBUTORS</span>
        </Link>

        {/* 4. ABOUT Link */}
        <Link
          to="/about"
          onClick={() => setIsOpen(false)}
          className="px-3 py-2 rounded-lg uppercase tracking-tight text-zinc-950 dark:text-white hover:text-zinc-950 dark:hover:text-[#2ee6ca] hover:bg-zinc-100/70 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
        >
          <span>ABOUT</span>
        </Link>

        {/* 5. CONTACT Link */}
        <Link
          to="/contact"
          onClick={() => setIsOpen(false)}
          className="px-3 py-2 rounded-lg uppercase tracking-tight text-zinc-950 dark:text-white hover:text-zinc-950 dark:hover:text-[#2ee6ca] hover:bg-zinc-100/70 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
        >
          <span>CONTACT</span>
        </Link>
      </div>

      {/* Fullscreen Portal Overlay & Dropdown (Mounted below the header so the header links remain 100% unobstructed) */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-x-0 top-16 lg:top-[72px] bottom-0 z-30 flex flex-col pointer-events-auto"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Minimalist Mega Menu Dropdown Panel */}
          <div
            id="papa-megamenu-dropdown"
            className="w-full bg-white dark:bg-[#0A0C10] border-b border-zinc-200 dark:border-zinc-800 shadow-2xl max-h-[calc(100vh-80px)] overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150 relative z-10"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Top Sub-Bar */}
            <div className="w-full border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-[#0C0F14]/70 px-4 sm:px-6 lg:px-8 py-3">
              <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto flex items-center justify-between">
                <span className="text-xs font-mono font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">
                  Categories
                </span>

                <div className="flex items-center gap-5">
                  <button
                    type="button"
                    onClick={() => {
                      navigate({ to: '/collections', search: { category: 'all' } })
                      setIsOpen(false)
                    }}
                    className="text-xs font-mono font-medium text-zinc-600 dark:text-zinc-300 hover:text-[#0d9488] dark:hover:text-[#2EE6CA] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>All Products</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <span className="text-zinc-300 dark:text-zinc-700">|</span>

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="text-xs font-mono text-zinc-400 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                    title="Close (ESC)"
                  >
                    <span>Close</span>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 7 Square Image Columns Grid */}
            <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 xl:gap-6">
                {MEGA_MENU_DATA.map(col => (
                  <div key={col.id} className="flex flex-col">
                    {/* Square Product Image */}
                    <button
                      type="button"
                      onClick={() => handleSelect(col.categoryId)}
                      className="group/img w-full aspect-square rounded-xl bg-zinc-50 dark:bg-[#11141B] border border-zinc-200/80 dark:border-zinc-800/80 p-3 flex items-center justify-center overflow-hidden hover:border-zinc-400 dark:hover:border-[#2ee6ca]/50 transition-all cursor-pointer shadow-xs"
                    >
                      <img
                        src={formatProductImageUrl(col.image)}
                        alt={col.title}
                        className="w-full h-full object-contain transition-transform duration-300 group-hover/img:scale-110"
                        loading="lazy"
                      />
                    </button>

                    {/* Clean Category Title with Fixed Baseline Height */}
                    <button
                      type="button"
                      onClick={() => handleSelect(col.categoryId)}
                      className="text-left w-full mt-3 block group/title"
                    >
                      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 group-hover/title:text-[#0d9488] dark:group-hover/title:text-[#2EE6CA] transition-colors leading-tight min-h-[2rem] flex items-center">
                        {col.title}
                      </h3>
                    </button>

                    {/* Concise Subcategories */}
                    <ul className="mt-2 space-y-1.5 text-xs font-mono">
                      {col.subcategories.map((sub, sIdx) => (
                        <li key={sIdx}>
                          <button
                            type="button"
                            onClick={() => {
                              if (sub.handle) {
                                navigate({
                                  to: '/products/$handle',
                                  params: { handle: sub.handle },
                                })
                                setIsOpen(false)
                              } else {
                                handleSelect(
                                  col.categoryId,
                                  sub.query,
                                  sub.series,
                                  sub.subId
                                )
                              }
                            }}
                            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-[#2ee6ca] py-0.5 block text-left transition-colors cursor-pointer w-full leading-snug break-words"
                          >
                            {sub.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Backdrop Dimmer (click to close) */}
          <div
            className="flex-1 bg-black/40 dark:bg-black/60 backdrop-blur-xs cursor-pointer animate-in fade-in duration-150"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        </div>,
        document.body
      )}
    </div>
  )
}
