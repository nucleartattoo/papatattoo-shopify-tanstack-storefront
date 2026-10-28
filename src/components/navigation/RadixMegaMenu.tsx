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
      <div className="flex items-center gap-1 xl:gap-1.5 font-sans text-[13px] font-medium tracking-[-0.01em]">
        {/* 1. Products Link: Native Anchor with Pointer Hand, Hover to open, Click to navigate */}
        <Link
          to="/products"
          onClick={() => setIsOpen(false)}
          onMouseEnter={handleMouseEnter}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer select-none ${
            isOpen
              ? 'text-[#1d1d1f] dark:text-white bg-black/[0.06] dark:bg-white/[0.1]'
              : 'text-[#1d1d1f]/80 dark:text-[#f5f5f7]/80 hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
          }`}
        >
          <span>Products</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ease-[var(--ease-out-strong)] opacity-65 ${isOpen ? 'rotate-180' : ''}`} />
        </Link>

        {/* 2. Artists Link */}
        <Link
          to="/sponsorship-artists"
          onClick={() => setIsOpen(false)}
          className="px-3 py-1.5 rounded-full text-[#1d1d1f]/80 dark:text-[#f5f5f7]/80 hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer"
        >
          <span>Artists</span>
        </Link>

        {/* 3. About Link */}
        <Link
          to="/about"
          onClick={() => setIsOpen(false)}
          className="px-3 py-1.5 rounded-full text-[#1d1d1f]/80 dark:text-[#f5f5f7]/80 hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer"
        >
          <span>About</span>
        </Link>

        {/* 4. Contact Link */}
        <Link
          to="/contact"
          onClick={() => setIsOpen(false)}
          className="px-3 py-1.5 rounded-full text-[#1d1d1f]/80 dark:text-[#f5f5f7]/80 hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-[transform,background-color,color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer"
        >
          <span>Support</span>
        </Link>
      </div>

      {/* Fullscreen Portal Overlay & Dropdown (Mounted below the header so the header links remain 100% unobstructed) */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-x-0 top-14 bottom-0 z-30 flex flex-col pointer-events-auto"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Minimalist Mega Menu Dropdown Panel */}
          <div
            id="papa-megamenu-dropdown"
            className="origin-top w-full apple-glass-sheet border-b border-black/[0.06] dark:border-white/[0.08] shadow-[0_24px_60px_-16px_rgba(0,0,0,0.12)] dark:shadow-[0_28px_70px_-16px_rgba(0,0,0,0.8)] max-h-[calc(100dvh-56px)] overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150 ease-[var(--ease-out-strong)] motion-reduce:animate-none relative z-10"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* 7 Square Image Columns Grid */}
            <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-medium text-[#86868b]">
                  Explore Lineup
                </span>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      navigate({ to: '/collections', search: { category: 'all' } })
                      setIsOpen(false)
                    }}
                    className="text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7] hover:opacity-70 flex items-center gap-1 transition-opacity cursor-pointer"
                  >
                    <span>All Products</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="text-xs text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                    title="Close (ESC)"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 xl:gap-5">
                {MEGA_MENU_DATA.map(col => (
                  <div key={col.id} className="flex flex-col">
                    {/* Square Product Image */}
                    <button
                      type="button"
                      onClick={() => handleSelect(col.categoryId)}
                      className="group/img w-full aspect-square rounded-2xl bg-white dark:bg-[#1c1c1e] p-3.5 flex items-center justify-center overflow-hidden transition-[transform,background-color] duration-200 ease-[var(--ease-out-strong)] active:scale-[0.98] cursor-pointer"
                    >
                      <img
                        src={formatProductImageUrl(col.image)}
                        alt={col.title}
                        className="w-full h-full object-contain transition-transform duration-200 ease-[var(--ease-out-strong)] group-hover/img:scale-[1.05]"
                        loading="lazy"
                      />
                    </button>

                    {/* Clean Category Title */}
                    <button
                      type="button"
                      onClick={() => handleSelect(col.categoryId)}
                      className="text-left w-full mt-3 block group/title"
                    >
                      <h3 className="text-[13px] font-semibold tracking-[-0.01em] text-[#1d1d1f] dark:text-[#f5f5f7] group-hover/title:opacity-70 transition-opacity leading-snug">
                        {col.title}
                      </h3>
                    </button>

                    {/* Concise Subcategories */}
                    <ul className="mt-1.5 space-y-1 text-xs">
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
                            className="text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white py-0.5 block text-left transition-colors cursor-pointer w-full leading-snug break-words"
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
            className="flex-1 bg-black/25 dark:bg-black/55 backdrop-blur-xs cursor-pointer animate-in fade-in duration-150"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        </div>,
        document.body
      )}
    </div>
  )
}
