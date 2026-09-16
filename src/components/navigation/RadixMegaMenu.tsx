import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from '@tanstack/react-router'
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
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        window.removeEventListener('keydown', handleKeyDown)
        document.removeEventListener('mousedown', handleClickOutside)
        document.body.style.overflow = prevOverflow
      }
    }
  }, [isOpen])

  return (
    <div ref={menuRef} className="relative z-50 flex items-center">
      <div className="flex items-center gap-1 xl:gap-2 font-mono text-xs xl:text-[13px] font-bold uppercase tracking-wider">
        {/* 1. Products Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(prev => !prev)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
            isOpen
              ? 'text-zinc-950 dark:text-[#2EE6CA] bg-zinc-100 dark:bg-zinc-800/60'
              : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100/70 dark:hover:bg-zinc-800/40'
          }`}
        >
          <span>Products</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 opacity-60 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* 2. Artists Link */}
        <button
          type="button"
          onClick={() => {
            navigate({ to: '/sponsorship-artists' })
            setIsOpen(false)
          }}
          className="px-3 py-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100/70 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer"
        >
          <span>Artists</span>
        </button>

        {/* 3. Distributors Link */}
        <button
          type="button"
          onClick={() => {
            navigate({ to: '/distributors' })
            setIsOpen(false)
          }}
          className="px-3 py-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100/70 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer"
        >
          <span>Distributors</span>
        </button>

        {/* 4. About Link */}
        <button
          type="button"
          onClick={() => {
            navigate({ to: '/about' })
            setIsOpen(false)
          }}
          className="px-3 py-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100/70 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer"
        >
          <span>About</span>
        </button>

        {/* 5. Contact Link */}
        <button
          type="button"
          onClick={() => {
            navigate({ to: '/contact' })
            setIsOpen(false)
          }}
          className="px-3 py-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100/70 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer"
        >
          <span>Contact</span>
        </button>
      </div>

      {/* Fullscreen Portal Overlay & Dropdown (Mounted directly on body to avoid header backdrop-blur positioning traps) */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] flex flex-col pointer-events-auto">
          {/* Top spacer to align directly below the header (header is 98px on desktop, ~76px on tablet) */}
          <div className="h-[72px] sm:h-[76px] lg:h-[98px] pointer-events-none" />

          {/* Minimalist Mega Menu Dropdown Panel */}
          <div
            id="papa-megamenu-dropdown"
            className="w-full bg-white dark:bg-[#0A0C10] border-b border-zinc-200 dark:border-zinc-800 shadow-2xl max-h-[calc(100vh-110px)] overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150 relative z-10"
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
