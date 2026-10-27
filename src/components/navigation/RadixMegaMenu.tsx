import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, Link } from '@tanstack/react-router'
import { ChevronDown, ArrowRight, X } from 'lucide-react'
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
      <div className="flex items-center gap-1 xl:gap-2 font-['Montserrat',sans-serif] text-[13px] xl:text-sm font-black uppercase tracking-tight">
        {/* 1. PAPA PRODUCTS Link: Native Anchor with Pointer Hand, Hover to open, Click to navigate */}
        <Link
          to="/products"
          onClick={() => setIsOpen(false)}
          onMouseEnter={handleMouseEnter}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl uppercase tracking-tight transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer select-none ${
            isOpen
              ? 'text-zinc-950 dark:text-white bg-[#eceae4] dark:bg-white/[0.1]'
              : 'text-zinc-950 dark:text-white hover:text-[#0d5d50] dark:hover:text-[#38e8c6] hover:bg-[#eceae4]/70 dark:hover:bg-white/[0.06]'
          }`}
        >
          <span>PAPA PRODUCTS</span>
          <ChevronDown className={`w-3.5 h-3.5 xl:w-4 xl:h-4 transition-transform duration-200 ease-[var(--ease-out-strong)] opacity-80 ${isOpen ? 'rotate-180' : ''}`} />
        </Link>

        {/* 2. ARTISTS Link */}
        <Link
          to="/sponsorship-artists"
          onClick={() => setIsOpen(false)}
          className="px-3 py-2 rounded-xl uppercase tracking-tight text-zinc-950 dark:text-white hover:text-[#0d5d50] dark:hover:text-[#38e8c6] hover:bg-[#eceae4]/70 dark:hover:bg-white/[0.06] transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer"
        >
          <span>ARTISTS</span>
        </Link>

        {/* 3. CONTACT Link */}
        <Link
          to="/contact"
          onClick={() => setIsOpen(false)}
          className="px-3 py-2 rounded-xl uppercase tracking-tight text-zinc-950 dark:text-white hover:text-[#0d5d50] dark:hover:text-[#38e8c6] hover:bg-[#eceae4]/70 dark:hover:bg-white/[0.06] transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer"
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
            className="origin-top w-full bg-[#f8f7f4] dark:bg-[#14161d] border-b border-[#e2dfd8] dark:border-white/[0.08] shadow-[0_24px_60px_-16px_rgba(18,18,16,0.18)] dark:shadow-[0_28px_70px_-16px_rgba(0,0,0,0.8)] max-h-[calc(100dvh-80px)] overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150 ease-[var(--ease-out-strong)] motion-reduce:animate-none relative z-10"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Top Sub-Bar */}
            <div className="w-full border-b border-[#e2dfd8] dark:border-white/[0.06] bg-[#eceae4]/70 dark:bg-[#181b22]/80 px-4 sm:px-6 lg:px-8 py-3">
              <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-zinc-500 dark:text-zinc-400">
                  Hardware &amp; Sterile Apparatus Catalog
                </span>

                <div className="flex items-center gap-5">
                  <button
                    type="button"
                    onClick={() => {
                      navigate({ to: '/collections', search: { category: 'all' } })
                      setIsOpen(false)
                    }}
                    className="text-xs font-mono font-semibold text-zinc-700 dark:text-zinc-200 hover:text-[#0d5d50] dark:hover:text-[#38e8c6] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>All Products</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <span className="text-zinc-300 dark:text-zinc-700">|</span>

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="text-xs font-mono text-zinc-500 hover:text-zinc-950 dark:hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
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
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 xl:gap-5">
                {MEGA_MENU_DATA.map(col => (
                  <div key={col.id} className="flex flex-col">
                    {/* Square Product Image */}
                    <button
                      type="button"
                      onClick={() => handleSelect(col.categoryId)}
                      className="group/img w-full aspect-square rounded-2xl bg-white dark:bg-[#1a1d24] border border-[#e2dfd8] dark:border-white/[0.08] p-3.5 flex items-center justify-center overflow-hidden hover:border-zinc-400 dark:hover:border-[#38e8c6]/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-[transform,border-color,box-shadow] duration-200 ease-[var(--ease-out-strong)] active:scale-[0.98] cursor-pointer"
                    >
                      <img
                        src={formatProductImageUrl(col.image)}
                        alt={col.title}
                        className="w-full h-full object-contain transition-transform duration-200 ease-[var(--ease-out-strong)] group-hover/img:scale-[1.06]"
                        loading="lazy"
                      />
                    </button>

                    {/* Clean Category Title with Fixed Baseline Height */}
                    <button
                      type="button"
                      onClick={() => handleSelect(col.categoryId)}
                      className="text-left w-full mt-3 block group/title"
                    >
                      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-zinc-100 group-hover/title:text-[#0d5d50] dark:group-hover/title:text-[#38e8c6] transition-colors leading-tight min-h-[2rem] flex items-center">
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
