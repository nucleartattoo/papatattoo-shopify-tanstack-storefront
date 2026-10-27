import React, { useMemo, useState } from 'react'
import { Link, useLoaderData, useNavigate, useSearch } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ShopifyProduct, ShopifyVariant } from '../types/shopify'
import { catalogQueryOptions } from '../lib/catalog.queries'
import { isGranularCartridge, isNuclearTattooProduct } from '../lib/shopify'
import { ProductCard } from '../components/product/ProductCard'
import { HardwareModelCard } from '../components/product/HardwareLineupModules'
import { CartridgeMatrixSelector } from '../components/product/CartridgeMatrixSelector'
import { ModelViewer3D } from '../components/common/ModelViewer3D'
import { useCart } from '../context/CartContext'
import {
  getRepresentativeImage,
  groupProductsIntoModels,
  HardwareModelGroup,
} from '../lib/hardwareLineup'
import {
  ArrowUpDown,
  Box,
  ChevronRight,
  Filter,
  Grid2X2,
  Image as ImageIcon,
  Layers,
  Minus,
  Plus,
  RotateCcw,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  X,
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
  badge?: string
  match: (product: ShopifyProduct) => boolean
}

export interface CategoryDef {
  id: string
  label: string
  match: (product: ShopifyProduct) => boolean
  subcategories?: SubcategoryDef[]
}

const STORE_CATEGORIES: CategoryDef[] = [
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
        id: 'papa-pen-v3',
        label: 'Papa Pen V3',
        badge: 'FLAGSHIP',
        match: p => p.title.toLowerCase().includes('v3'),
      },
      {
        id: 'papa-pen-v2',
        label: 'Papa Pen V2',
        match: p => p.title.toLowerCase().includes('v2'),
      },
      {
        id: 'papa-pen',
        label: 'Papa Pen Classic',
        match: p => {
          const t = p.title.toLowerCase()
          return t.includes('papa pen') && !t.includes('v2') && !t.includes('v3')
        },
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
        label: 'Papa Premium Cartridges',
        badge: '316L',
        match: p =>
          p.handle === 'papa-premium-tattoo-cartridges' ||
          p.title.toLowerCase().includes('premium'),
      },
      {
        id: 'standard',
        label: 'Papa Standard Cartridges',
        match: p =>
          p.handle === 'papa-standard-tattoo-cartridges' ||
          (p.title.toLowerCase().includes('standard') &&
            p.title.toLowerCase().includes('cartridge')),
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
        label: 'Foam Grips & Finger Ledge',
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
        id: 'power-units',
        label: 'Volt Battery & Power Units',
        match: p => {
          const t = p.title.toLowerCase()
          if (t.includes('critical') || t.includes('atom')) return false
          return t.includes('power') || t.includes('bullet') || t.includes('volt') || t.includes('battery')
        },
      },
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
    ],
  },
  {
    id: 'accessories',
    label: 'Studio Accessories',
    match: p => {
      const t = p.title.toLowerCase()
      return (
        (t.includes('tray') || t.includes('case') || t.includes('holder')) &&
        !t.includes('stencil')
      )
    },
    subcategories: [
      {
        id: 'trays',
        label: 'Workstation Trays',
        match: p => p.title.toLowerCase().includes('tray'),
      },
      {
        id: 'travel-case',
        label: 'Papa Travel Case',
        match: p => p.title.toLowerCase().includes('case'),
      },
    ],
  },
  {
    id: 'stencil',
    label: 'Papa Stencil',
    match: p => p.title.toLowerCase().includes('stencil'),
  },
  {
    id: 'apparel',
    label: 'Studio Apparel',
    match: p => {
      const t = p.title.toLowerCase()
      return t.includes('hat') || t.includes('shirt') || t.includes('apron')
    },
    subcategories: [
      {
        id: 'apron',
        label: 'Artist Work Apron',
        match: p => p.title.toLowerCase().includes('apron'),
      },
      {
        id: 'hat',
        label: 'Papa Tattoo Hat',
        match: p => p.title.toLowerCase().includes('hat'),
      },
      {
        id: 'shirt',
        label: 'Papa Tattoo Shirt',
        match: p => p.title.toLowerCase().includes('shirt'),
      },
    ],
  },
]

function normalizeCategoryParam(raw?: string): string {
  if (!raw) return 'all'
  const lower = raw.toLowerCase()
  if (lower === 'needles') return 'cartridges'
  if (lower === 'studio') return 'accessories'
  return lower
}

interface StagePresentation {
  badge: string
  description: string
  pills: string[]
  imageHandles: string[]
  fallbackImage: string
  supports3D?: boolean
}

const STAGE_BY_CATEGORY: Record<string, StagePresentation> = {
  all: {
    badge: 'FULL HARDWARE ARCHIVE',
    description:
      'Complete Papa Tattoo Supply apparatus index: CNC 6061-T6 rotary machines, ratcheted click grips, 62-size 316L surgical cartridges, and regulated studio power.',
    pills: ['26 CONSOLIDATED FAMILIES', '44 HARDWARE SKUS', 'FACTORY CALIBRATED'],
    imageHandles: ['papa-pen-v3-black-full-set', 'papa-pen-v2-1'],
    fallbackImage: '/product-images/img_113_papa_pen_jet_black_1__cutout.webp',
    supports3D: true,
  },
  machines: {
    badge: 'ROTARY DRIVE SYSTEMS',
    description:
      'Direct-drive and coreless rotary pen machines machined from solid 6061-T6 aerospace billet aluminum for zero-vibration lining, whip shading, and color packing.',
    pills: ['GERMAN CORELESS MOTOR', '3.5 TO 4.5 MM STROKE', '6061-T6 BILLET'],
    imageHandles: ['papa-pen-v3-black-full-set', 'papa-pen-v2-1'],
    fallbackImage: '/product-images/img_113_papa_pen_jet_black_1__cutout.webp',
    supports3D: true,
  },
  cartridges: {
    badge: 'MEMBRANE SEALED 316L',
    description:
      'Japanese 316L surgical stainless steel needle cartridges with full-seal anti-backflow membranes across 62 RL, RLT, RLH, RS, M1, and M1C configurations.',
    pills: ['62 NEEDLE CONFIGS', 'SAFETY MEMBRANE', '100% EO GAS STERILE'],
    imageHandles: ['papa-premium-tattoo-cartridges', 'papa-standard-tattoo-cartridges'],
    fallbackImage: '/product-images/papa-premium-tattoo-cartridges-round-cutout.webp',
  },
  grips: {
    badge: 'RATCHETED CLICK CONTROL',
    description:
      'Autoclavable 6061-T6 aluminum and 316L surgical stainless steel click grips plus sterile single-use disposable grips engineered for positive depth locking.',
    pills: ['BALL-DETENT CLICK DIAL', '134°C AUTOCLAVABLE', 'UNIVERSAL FIT'],
    imageHandles: [
      'papa-adjustable-click-grip-v2-stainless-steel',
      'papa-adjustable-click-grip-v2-black',
    ],
    fallbackImage: '/product-images/img_111_papa_adjustment_grips_1__cutout.webp',
  },
  power: {
    badge: 'ZERO-RIPPLE DC POWER',
    description:
      'Cordless OLED lithium battery docks, regulated desktop power consoles, 24K gold-plated silicone RCA cords, and 360° cast-metal studio foot switches.',
    pills: ['5.0 TO 12.0 V DC', '24K GOLD RCA', 'OVERLOAD GUARD'],
    imageHandles: ['papa-volt-battery', 'papa-power-supply', 'papa-power-bullet'],
    fallbackImage: '/product-images/img_113_papa_pen_jet_black_1__cutout.webp',
  },
  accessories: {
    badge: 'PARLOR WORKSTATION',
    description:
      'Chemical-resistant magnetic workstation trays, crushproof EVA convention travel cases, and articulated studio mounts built for daily parlor hygiene.',
    pills: ['CAVICIDE RESISTANT', 'RAISED PERIMETER DECK', 'BALLISTIC EVA'],
    imageHandles: ['papa-travel-case', 'papa-tray-large'],
    fallbackImage: '/product-images/img_201_papa_travel_case_cutout.webp',
  },
  stencil: {
    badge: 'THERMAL TRANSFER LOCK',
    description:
      'High-contrast skin-safe thermal stencil transfer solution formulated to lock fine-line and realism stencils through multi-hour tattoo sessions.',
    pills: ['LONG-HOLD FORMULA', 'VEGAN & SKIN SAFE', 'AIRLESS PUMP'],
    imageHandles: ['stencilock'],
    fallbackImage: '/product-images/img_201_papa_travel_case_cutout.webp',
  },
  apparel: {
    badge: 'RESIDENT ARTIST GEAR',
    description:
      'Heavyweight cross-back studio work aprons, embroidered headwear, and breathable parlor apparel tailored for working tattooists.',
    pills: ['HEAVYWEIGHT CANVAS', 'STUDIO DURABILITY', 'OFFICIAL EMBLEM'],
    imageHandles: ['papa-apron', 'papa-tattoo-hat', 'papa-tattoo-shirt'],
    fallbackImage: '/product-images/img_201_papa_travel_case_cutout.webp',
  },
}

export const CollectionPage: React.FC = () => {
  const searchParams: CollectionSearchProps = useSearch({ strict: false })
  const navigate = useNavigate()
  const { addToCart, openCart } = useCart()

  const loaderData = useLoaderData({ strict: false }) as
    | { products?: ShopifyProduct[] }
    | undefined
  const initialProducts = loaderData?.products || []

  const { data: products = [], isLoading: loading } = useQuery({
    ...catalogQueryOptions,
    initialData: initialProducts.length > 0 ? initialProducts : undefined,
  })

  // Filter States initialized from URL query params
  const [activeCategory, setActiveCategory] = useState<string>(() =>
    normalizeCategoryParam(searchParams.category)
  )
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(
    searchParams.sub || null
  )
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.q || '')
  const [activeSeries, setActiveSeries] = useState<'all' | 'premium' | 'standard'>(
    searchParams.series || 'all'
  )
  const [sortOption, setSortOption] = useState<string>(searchParams.sort || 'featured')
  const [inStockOnly, setInStockOnly] = useState<boolean>(false)
  const [displayMode, setDisplayMode] = useState<'grouped' | 'skus'>('grouped')
  const [stage3DActive, setStage3DActive] = useState<boolean>(false)

  // Inline Cartridge Matrix Quick-Order state (active when viewing cartridges)
  const [matrixTier, setMatrixTier] = useState<'premium' | 'standard'>('premium')
  const [selectedCartridgeVariant, setSelectedCartridgeVariant] =
    useState<ShopifyVariant | null>(null)
  const [cartridgeQty, setCartridgeQty] = useState<number>(1)

  // Expandable category state for accordion
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(() => {
    const initial = new Set<string>(['machines', 'cartridges', 'grips'])
    const norm = normalizeCategoryParam(searchParams.category)
    if (norm !== 'all') {
      initial.add(norm)
    }
    return initial
  })

  // Synchronize state when URL query params change during render (zero cascading effect re-renders)
  const searchKey = `${searchParams.category || ''}|${searchParams.sub || ''}|${searchParams.q || ''}|${searchParams.series || ''}|${searchParams.sort || ''}`
  const [prevSearchKey, setPrevSearchKey] = useState(searchKey)
  if (searchKey !== prevSearchKey) {
    setPrevSearchKey(searchKey)
    const norm = normalizeCategoryParam(searchParams.category)
    setActiveCategory(norm)
    if (norm !== 'all') {
      setExpandedCategories(prev => new Set(prev).add(norm))
    }
    setStage3DActive(false)
    setActiveSubcategory(searchParams.sub || null)
    setSearchQuery(searchParams.q || '')
    if (searchParams.series) {
      setActiveSeries(searchParams.series)
      if (searchParams.series === 'premium' || searchParams.series === 'standard') {
        setMatrixTier(searchParams.series)
      }
    } else {
      setActiveSeries('all')
    }
    if (searchParams.sort) setSortOption(searchParams.sort)
  }

  const nonGranularProducts = useMemo(() => {
    return products.filter(p => !isGranularCartridge(p) && !isNuclearTattooProduct(p))
  }, [products])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: nonGranularProducts.length,
    }
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
          counts[sub.id] = nonGranularProducts.filter(
            p => cat.match(p) && sub.match(p)
          ).length
        }
      }
    }
    return counts
  }, [nonGranularProducts])

  const filteredProducts = useMemo(() => {
    return nonGranularProducts.filter(prod => {
      const titleLower = prod.title.toLowerCase()

      if (searchQuery) {
        const queryLower = searchQuery.toLowerCase()
        const matchesTitle = titleLower.includes(queryLower)
        const matchesTags =
          prod.tags && prod.tags.some(tag => tag.toLowerCase().includes(queryLower))
        if (!matchesTitle && !matchesTags) return false
      }

      if (activeCategory !== 'all') {
        const targetCat = STORE_CATEGORIES.find(c => c.id === activeCategory)
        if (targetCat) {
          if (!targetCat.match(prod)) return false

          if (activeSubcategory && targetCat.subcategories) {
            const targetSub = targetCat.subcategories.find(s => s.id === activeSubcategory)
            if (targetSub && !targetSub.match(prod)) return false
          }
        }
      }

      if (activeSeries === 'premium') {
        if (prod.handle !== 'papa-premium-tattoo-cartridges') return false
      } else if (activeSeries === 'standard') {
        if (prod.handle !== 'papa-standard-tattoo-cartridges') return false
      }

      if (inStockOnly && prod.availableForSale === false) return false

      return true
    })
  }, [
    nonGranularProducts,
    searchQuery,
    activeCategory,
    activeSubcategory,
    activeSeries,
    inStockOnly,
  ])

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts]
    if (sortOption === 'price-asc') {
      list.sort(
        (a, b) =>
          parseFloat(a.priceRange.minVariantPrice.amount) -
          parseFloat(b.priceRange.minVariantPrice.amount)
      )
    } else if (sortOption === 'price-desc') {
      list.sort(
        (a, b) =>
          parseFloat(b.priceRange.minVariantPrice.amount) -
          parseFloat(a.priceRange.minVariantPrice.amount)
      )
    } else if (sortOption === 'title-asc') {
      list.sort((a, b) => a.title.localeCompare(b.title))
    }
    return list
  }, [filteredProducts, sortOption])

  const sortedModelGroups = useMemo<HardwareModelGroup[]>(() => {
    const groups = groupProductsIntoModels(filteredProducts)
    const getMinPrice = (g: HardwareModelGroup) =>
      Math.min(
        ...g.options.map(o =>
          parseFloat(o.product.priceRange?.minVariantPrice?.amount || '0')
        )
      )

    if (sortOption === 'price-asc') {
      return [...groups].sort((a, b) => getMinPrice(a) - getMinPrice(b))
    }
    if (sortOption === 'price-desc') {
      return [...groups].sort((a, b) => getMinPrice(b) - getMinPrice(a))
    }
    if (sortOption === 'title-asc') {
      return [...groups].sort((a, b) => a.masterTitle.localeCompare(b.masterTitle))
    }
    return groups
  }, [filteredProducts, sortOption])

  const premiumCartridgeProduct = useMemo(
    () =>
      nonGranularProducts.find(p => p.handle === 'papa-premium-tattoo-cartridges') ||
      null,
    [nonGranularProducts]
  )
  const standardCartridgeProduct = useMemo(
    () =>
      nonGranularProducts.find(p => p.handle === 'papa-standard-tattoo-cartridges') ||
      null,
    [nonGranularProducts]
  )
  const activeCartridgeProduct =
    matrixTier === 'premium' ? premiumCartridgeProduct : standardCartridgeProduct

  const effectiveCartridgeVariant = useMemo(() => {
    const edges = activeCartridgeProduct?.variants?.edges
    if (!edges || edges.length === 0) return null
    if (
      selectedCartridgeVariant &&
      edges.some(e => e.node.id === selectedCartridgeVariant.id)
    ) {
      return selectedCartridgeVariant
    }
    return edges.find(e => e.node.availableForSale !== false)?.node || edges[0].node
  }, [activeCartridgeProduct, selectedCartridgeVariant])

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

  const handleSelectCategory = (catId: string) => {
    const norm = normalizeCategoryParam(catId)
    setActiveCategory(norm)
    setActiveSubcategory(null)
    setActiveSeries('all')
    if (norm !== 'all') {
      setExpandedCategories(prev => new Set(prev).add(norm))
    }
    navigate({
      to: '/collections',
      search: {
        category: norm,
        q: searchQuery || undefined,
        series: 'all',
        sort: sortOption as CollectionSearchProps['sort'],
      },
    })
  }

  const handleSelectSubcategory = (catId: string, subId: string) => {
    const norm = normalizeCategoryParam(catId)
    setActiveCategory(norm)
    setActiveSubcategory(subId)
    if (norm === 'cartridges') {
      if (subId === 'premium') {
        setActiveSeries('premium')
        setMatrixTier('premium')
      } else if (subId === 'standard') {
        setActiveSeries('standard')
        setMatrixTier('standard')
      } else {
        setActiveSeries('all')
      }
    }
    navigate({
      to: '/collections',
      search: {
        category: norm,
        sub: subId,
        q: searchQuery || undefined,
        sort: sortOption as CollectionSearchProps['sort'],
      },
    })
  }

  const handleResetFilters = () => {
    setActiveCategory('all')
    setActiveSubcategory(null)
    setSearchQuery('')
    setActiveSeries('all')
    setSortOption('featured')
    setInStockOnly(false)
    navigate({ to: '/collections', search: { category: 'all' } })
  }

  const getCategoryTitle = () => {
    if (activeCategory === 'all') return 'ALL APPARATUS & SUPPLIES'
    const cat = STORE_CATEGORIES.find(c => c.id === activeCategory)
    if (!cat) return 'ALL APPARATUS & SUPPLIES'
    if (activeSubcategory && cat.subcategories) {
      const sub = cat.subcategories.find(s => s.id === activeSubcategory)
      if (sub) {
        return `${cat.label.toUpperCase()} · ${sub.label.toUpperCase()}`
      }
    }
    return cat.label.toUpperCase()
  }

  const currentStage = STAGE_BY_CATEGORY[activeCategory] || STAGE_BY_CATEGORY.all
  const stageImageUrl = useMemo(
    () =>
      getRepresentativeImage(
        nonGranularProducts,
        currentStage.imageHandles,
        currentStage.fallbackImage
      ),
    [nonGranularProducts, currentStage]
  )

  return (
    <div className="bg-[#f5f4f0] dark:bg-[#20222a] min-h-[100dvh] text-zinc-900 dark:text-zinc-100">
      {/* 1. Category Stage Banner — Synchronized to Active Category */}
      <section className="w-full border-b border-[#e2dfd8] dark:border-white/[0.08] bg-[#eceae4]/75 dark:bg-[#181b22] relative overflow-hidden">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 min-h-[200px] sm:min-h-[220px] flex flex-col lg:flex-row lg:items-center justify-between py-6 sm:py-7 gap-6 relative z-10">
          {/* Left: Breadcrumbs & Category Overview */}
          <div className="max-w-2xl space-y-2.5">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-600 dark:text-zinc-400"
            >
              <Link to="/" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                HOME
              </Link>
              <ChevronRight className="w-3 h-3 text-zinc-400 dark:text-zinc-600" />
              <Link
                to="/collections"
                search={{ category: 'all' }}
                className="hover:text-zinc-950 dark:hover:text-white transition-colors"
              >
                COLLECTIONS
              </Link>
              <ChevronRight className="w-3 h-3 text-zinc-400 dark:text-zinc-600" />
              <span className="text-[#0d5d50] dark:text-[#38e8c6] font-bold uppercase">
                {getCategoryTitle()}
              </span>
            </nav>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-zinc-950 dark:text-white font-['Montserrat',sans-serif]">
              {getCategoryTitle()}
            </h1>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed max-w-xl">
              {currentStage.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {currentStage.pills.map((pill, idx) => (
                <span
                  key={pill}
                  className={`px-2.5 py-1 rounded-md border text-[10px] font-mono font-bold whitespace-nowrap ${
                    idx === currentStage.pills.length - 1
                      ? 'bg-[#0d5d50]/10 dark:bg-[#38e8c6]/10 border-[#0d5d50]/25 dark:border-[#38e8c6]/25 text-[#0d5d50] dark:text-[#38e8c6]'
                      : 'bg-white/85 dark:bg-white/[0.04] border-[#e2dfd8] dark:border-white/10 text-zinc-700 dark:text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'
                  }`}
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Category-Matched Specimen Stage */}
          <div className="relative w-full lg:w-96 h-44 sm:h-48 shrink-0 rounded-2xl bg-white dark:bg-[#22252f] border border-[#e2dfd8] dark:border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,232,198,0.10)_0%,transparent_70%)] pointer-events-none" />

            {currentStage.supports3D && (
              <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1 p-0.5 rounded-lg bg-[#f5f4f0]/95 dark:bg-[#14161c]/85 backdrop-blur-md border border-[#e2dfd8] dark:border-white/10 font-mono text-[10px]">
                <button
                  type="button"
                  onClick={() => setStage3DActive(false)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md font-bold transition-[background-color,color,transform] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.96] cursor-pointer ${
                    !stage3DActive
                      ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                      : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStage3DActive(true)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md font-bold transition-[background-color,color,transform] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.96] cursor-pointer ${
                    stage3DActive
                      ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                      : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                  }`}
                >
                  <Box className="w-3 h-3 text-[#0d5d50] dark:text-[#38e8c6]" />
                  <span>3D</span>
                </button>
              </div>
            )}

            {currentStage.supports3D && stage3DActive ? (
              <ModelViewer3D
                src="/models/papapenv2.glb"
                poster={stageImageUrl}
                alt={getCategoryTitle()}
                className="w-full h-full"
                autoRotate={true}
                cameraOrbit="45deg 70deg 2.2m"
              />
            ) : (
              <img
                key={`${activeCategory}-${stageImageUrl}`}
                src={stageImageUrl}
                alt={getCategoryTitle()}
                className="relative z-10 max-h-[85%] max-w-[85%] w-auto object-contain transition-transform duration-300 drop-shadow-[0_10px_20px_rgba(18,18,16,0.12)] dark:drop-shadow-[0_14px_24px_rgba(0,0,0,0.5)]"
              />
            )}
          </div>
        </div>
      </section>

      <div className="py-8 max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2. Main Layout: Sidebar Filters + Products Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar Filter Column */}
          <aside className="w-full lg:w-68 lg:shrink-0 lg:pr-6 lg:border-r lg:border-[#e2dfd8] dark:lg:border-white/[0.08] space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2dfd8] dark:border-white/[0.08]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#0d5d50] dark:text-[#38e8c6]" />
                <span className="text-xs font-mono font-black uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                  APPARATUS INDEX
                </span>
              </div>
              {(activeCategory !== 'all' ||
                activeSubcategory ||
                activeSeries !== 'all' ||
                searchQuery ||
                inStockOnly) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[11px] font-mono text-zinc-500 hover:text-[#0d5d50] dark:hover:text-[#38e8c6] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Active Search Input / Filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Filter by model or spec..."
                aria-label="Filter collection by model or specification"
                className="w-full pl-8 pr-8 py-2 rounded-xl border border-[#e2dfd8] dark:border-white/10 bg-white dark:bg-[#22252f] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] text-xs font-mono text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-hidden focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                  aria-label="Clear search filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Tree with Live Counts */}
            <div className="space-y-1">
              {/* All Apparatus Root Option */}
              <button
                type="button"
                onClick={() => handleSelectCategory('all')}
                className={`w-full flex items-center justify-between py-2 px-3 rounded-xl text-xs font-mono transition-[background-color,color,transform] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.98] cursor-pointer ${
                  activeCategory === 'all'
                    ? 'bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 font-bold'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-[#eceae4]/80 dark:hover:bg-white/[0.06]'
                }`}
              >
                <span>All Apparatus</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md tabular-nums ${
                    activeCategory === 'all'
                      ? 'bg-white/20 text-white dark:bg-black/15 dark:text-zinc-950'
                      : 'bg-zinc-200/70 dark:bg-white/[0.06] text-zinc-500 dark:text-zinc-400'
                  }`}
                >
                  {categoryCounts.all || 0}
                </span>
              </button>

              {STORE_CATEGORIES.map(cat => {
                const isCatActive = activeCategory === cat.id
                const hasSub = Boolean(cat.subcategories && cat.subcategories.length > 0)
                const isExpanded = expandedCategories.has(cat.id)
                const count = categoryCounts[cat.id] ?? 0

                return (
                  <div key={cat.id} className="space-y-0.5">
                    <div
                      className={`flex items-center justify-between py-1.5 px-3 rounded-xl text-xs font-mono transition-[background-color,color] duration-150 ${
                        isCatActive && !activeSubcategory
                          ? 'bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 font-bold'
                          : isCatActive
                          ? 'text-[#0d5d50] dark:text-[#38e8c6] font-bold bg-[#0d5d50]/10 dark:bg-[#38e8c6]/10'
                          : 'text-zinc-700 dark:text-zinc-300 hover:bg-[#eceae4]/80 dark:hover:bg-white/[0.06]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleSelectCategory(cat.id)}
                        className="flex-1 text-left flex items-center justify-between pr-2 py-0.5 cursor-pointer"
                      >
                        <span className="truncate">{cat.label}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-md tabular-nums ${
                            isCatActive && !activeSubcategory
                              ? 'bg-white/20 text-white dark:bg-black/15 dark:text-zinc-950'
                              : 'bg-zinc-200/70 dark:bg-white/[0.06] text-zinc-500 dark:text-zinc-400'
                          }`}
                        >
                          {count}
                        </span>
                      </button>

                      {hasSub && (
                        <button
                          type="button"
                          onClick={e => handleToggleExpand(cat.id, e)}
                          className="w-5 h-5 flex items-center justify-center rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                          aria-label={
                            isExpanded ? `Collapse ${cat.label}` : `Expand ${cat.label}`
                          }
                        >
                          {isExpanded ? (
                            <Minus className="w-3.5 h-3.5" />
                          ) : (
                            <Plus className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>

                    {hasSub && isExpanded && (
                      <div className="pl-3.5 ml-3 border-l border-[#e2dfd8] dark:border-white/10 space-y-0.5 py-1">
                        {cat.subcategories!.map(sub => {
                          const isSubActive = isCatActive && activeSubcategory === sub.id
                          const subCount = subcategoryCounts[sub.id] ?? 0

                          return (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => handleSelectSubcategory(cat.id, sub.id)}
                              className={`w-full flex items-center justify-between py-1.5 px-2.5 rounded-lg text-[11px] font-mono transition-[background-color,color,transform] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.98] text-left cursor-pointer ${
                                isSubActive
                                  ? 'text-[#0d5d50] dark:text-[#38e8c6] font-bold bg-[#0d5d50]/10 dark:bg-[#38e8c6]/10'
                                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200 hover:bg-[#eceae4]/60 dark:hover:bg-white/[0.04]'
                              }`}
                            >
                              <span className="truncate pr-1 flex items-center gap-1.5">
                                <span className="truncate">{sub.label}</span>
                                {sub.badge && (
                                  <span className="px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[9px] font-bold">
                                    {sub.badge}
                                  </span>
                                )}
                              </span>
                              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 shrink-0 tabular-nums">
                                {subCount}
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

            {/* In-Stock Toggle */}
            <div className="pt-4 border-t border-[#e2dfd8] dark:border-white/[0.08]">
              <label className="flex items-center justify-between cursor-pointer text-xs font-mono text-zinc-700 dark:text-zinc-300">
                <span>In-Stock Ready Only</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={e => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 accent-[#0d5d50] dark:accent-[#38e8c6] rounded cursor-pointer"
                />
              </label>
            </div>
          </aside>

          {/* Right Product Grid Area */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Top Toolbar: Count, View Mode Toggle (Consolidated Models vs All SKUs), & Sort */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#22252f] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  SHOWING{' '}
                  <strong className="text-zinc-950 dark:text-[#38e8c6]">
                    {displayMode === 'grouped'
                      ? `${sortedModelGroups.length} FAMILIES`
                      : `${sortedProducts.length} SKUS`}
                  </strong>
                  {displayMode === 'grouped' &&
                    sortedProducts.length > sortedModelGroups.length && (
                      <span className="ml-1.5 text-[11px] text-zinc-400">
                        ({sortedProducts.length} total finishes)
                      </span>
                    )}
                </div>

                {/* Consolidated Families vs Individual SKUs Switcher */}
                <div
                  role="group"
                  aria-label="Catalog grouping mode"
                  className="inline-flex items-center p-0.5 rounded-xl bg-[#f5f4f0] dark:bg-[#181b22] border border-[#e2dfd8] dark:border-white/10 font-mono text-[11px]"
                >
                  <button
                    type="button"
                    onClick={() => setDisplayMode('grouped')}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold transition-[background-color,color,transform] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer ${
                      displayMode === 'grouped'
                        ? 'bg-white dark:bg-[#282c38] text-zinc-950 dark:text-white shadow-2xs'
                        : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-[#0d5d50] dark:text-[#38e8c6]" />
                    <span>By Model ({sortedModelGroups.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDisplayMode('skus')}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold transition-[background-color,color,transform] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer ${
                      displayMode === 'skus'
                        ? 'bg-white dark:bg-[#282c38] text-zinc-950 dark:text-white shadow-2xs'
                        : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                    }`}
                  >
                    <Grid2X2 className="w-3.5 h-3.5" />
                    <span>All Finishes ({sortedProducts.length})</span>
                  </button>
                </div>
              </div>

              {/* Sort Order Selector */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
                <label
                  htmlFor="collection-sort-select"
                  className="text-zinc-500 dark:text-zinc-400"
                >
                  SORT:
                </label>
                <select
                  id="collection-sort-select"
                  value={sortOption}
                  onChange={e => setSortOption(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[#e2dfd8] dark:border-white/10 bg-[#f8f7f4] dark:bg-[#181b22] text-xs font-mono text-zinc-800 dark:text-zinc-200 focus:outline-hidden focus:border-[#0d5d50] dark:focus:border-[#38e8c6]"
                >
                  <option value="featured">Featured Engineering</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="title-asc">Apparatus Title: A-Z</option>
                </select>
              </div>
            </div>

            {/* Inline 62-Size Cartridge Matrix Workbench when viewing Cartridges */}
            {activeCategory === 'cartridges' && activeCartridgeProduct && (
              <div className="p-6 sm:p-7 rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#22252f] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e2dfd8] dark:border-white/[0.08]">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#0d5d50] dark:text-[#38e8c6]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>DIRECT STUDIO CARTRIDGE CONFIGURATOR · 62 SIZES</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-black uppercase text-zinc-950 dark:text-white font-['Montserrat',sans-serif] mt-0.5">
                      CONFIGURE {matrixTier === 'premium' ? 'PAPA PREMIUM 316L' : 'PAPA STANDARD'} BOXES
                    </h2>
                  </div>

                  <div className="inline-flex p-1 rounded-xl bg-[#f5f4f0] dark:bg-[#181b22] border border-[#e2dfd8] dark:border-white/10 font-mono text-xs self-start">
                    <button
                      type="button"
                      onClick={() => setMatrixTier('premium')}
                      className={`px-3 py-1.5 rounded-lg font-bold uppercase whitespace-nowrap transition-[background-color,color,transform] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer ${
                        matrixTier === 'premium'
                          ? 'bg-zinc-950 text-white dark:bg-amber-500 dark:text-zinc-950'
                          : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                      }`}
                    >
                      Premium 316L · $
                      {parseFloat(
                        premiumCartridgeProduct?.priceRange.minVariantPrice.amount || '25.00'
                      ).toFixed(2)}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMatrixTier('standard')}
                      className={`px-3 py-1.5 rounded-lg font-bold uppercase whitespace-nowrap transition-[background-color,color,transform] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer ${
                        matrixTier === 'standard'
                          ? 'bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950'
                          : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                      }`}
                    >
                      Standard · $
                      {parseFloat(
                        standardCartridgeProduct?.priceRange.minVariantPrice.amount || '22.00'
                      ).toFixed(2)}
                    </button>
                  </div>
                </div>

                <CartridgeMatrixSelector
                  product={activeCartridgeProduct}
                  selectedVariant={effectiveCartridgeVariant}
                  onSelectVariant={setSelectedCartridgeVariant}
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-[#e2dfd8] dark:border-white/[0.08]">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-mono text-zinc-500">SELECTED:</span>
                    <span className="text-sm font-mono font-bold text-zinc-950 dark:text-white">
                      {effectiveCartridgeVariant?.title || 'Select configuration'}
                    </span>
                    <span className="text-sm font-mono font-black text-[#0d5d50] dark:text-[#38e8c6] whitespace-nowrap">
                      $
                      {parseFloat(
                        effectiveCartridgeVariant?.price.amount ||
                          activeCartridgeProduct.priceRange.minVariantPrice.amount
                      ).toFixed(2)}{' '}
                      / Box of 20
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-[#e2dfd8] dark:border-white/10 rounded-xl bg-[#f8f7f4] dark:bg-[#181b22] h-10 px-1">
                      <button
                        type="button"
                        onClick={() => setCartridgeQty(Math.max(1, cartridgeQty - 1))}
                        className="w-8 h-full font-mono text-sm text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-[color,transform] duration-150 active:scale-90 cursor-pointer"
                        aria-label="Decrease box quantity"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-mono text-xs font-bold tabular-nums">
                        {cartridgeQty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setCartridgeQty(cartridgeQty + 1)}
                        className="w-8 h-full font-mono text-sm text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-[color,transform] duration-150 active:scale-90 cursor-pointer"
                        aria-label="Increase box quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      disabled={effectiveCartridgeVariant?.availableForSale === false}
                      onClick={() => {
                        if (!effectiveCartridgeVariant) return
                        addToCart(
                          activeCartridgeProduct,
                          effectiveCartridgeVariant,
                          cartridgeQty
                        )
                        openCart()
                      }}
                      className="px-5 h-10 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 font-mono font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:opacity-90 active:scale-[0.98] transition-[opacity,transform] duration-150 ease-[var(--ease-out-strong)] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>
                        {effectiveCartridgeVariant?.availableForSale === false
                          ? 'Config Sold Out'
                          : 'Add Boxes to Cart'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Product Cards Grid */}
            {loading && products.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <div
                    key={n}
                    className="rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#22252f] p-5 animate-pulse space-y-4"
                  >
                    <div className="w-full aspect-square bg-zinc-200 dark:bg-white/[0.05] rounded-xl" />
                    <div className="h-4 bg-zinc-200 dark:bg-white/[0.05] rounded-sm w-3/4" />
                    <div className="h-3 bg-zinc-200 dark:bg-white/[0.05] rounded-sm w-1/2" />
                  </div>
                ))}
              </div>
            ) : displayMode === 'grouped' && sortedModelGroups.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedModelGroups.map(group => (
                  <HardwareModelCard key={group.id} group={group} />
                ))}
              </div>
            ) : displayMode === 'skus' && sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-dashed border-[#e2dfd8] dark:border-white/10 rounded-2xl p-8 bg-white dark:bg-[#22252f] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                <div className="inline-flex p-4 rounded-full bg-[#f5f4f0] dark:bg-white/[0.05] text-zinc-400 mb-4">
                  <Filter className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold uppercase text-zinc-800 dark:text-zinc-200">
                  No apparatus matched your criteria
                </h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                  Clear your active search filter or switch hardware categories to view all
                  available studio equipment.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-5 px-5 py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-[#38e8c6] dark:text-zinc-950 font-mono font-bold text-xs uppercase transition-[opacity,transform] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] hover:opacity-90 cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 3. Global Studio Distribution & Regulatory Standards */}
        <section className="mt-20 pt-12 border-t border-[#e2dfd8] dark:border-white/[0.08]">
          <div className="max-w-4xl mb-8 space-y-2">
            <div className="text-[10px] font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6] uppercase tracking-widest">
              GLOBAL STUDIO SPECIFICATION · REGULATORY &amp; DISPATCH STANDARDS
            </div>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-zinc-950 dark:text-white font-['Montserrat',sans-serif]">
              PROFESSIONAL TATTOO APPARATUS &amp; WORLDWIDE DISTRIBUTION
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
              Engineered exclusively for licensed tattoo studios and resident artists. All Papa
              apparatus, cartridges, and rotary systems adhere to strict international
              metallurgical and sterile batch manufacturing standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#22252f] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] space-y-3">
              <div className="text-xs font-mono font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                WORLDWIDE STUDIO LOGISTICS
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
                Direct express air dispatch to tattoo studios and supply partners across 40+
                countries including the United States, Canada, United Kingdom, Germany, France,
                Italy, Spain, and Australia with dedicated customs clearance.
              </p>
              <div className="pt-2 text-[10px] font-mono font-bold text-[#0d5d50] dark:text-[#38e8c6]">
                40+ Countries · Priority Tracking
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#22252f] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] space-y-3">
              <div className="text-xs font-mono font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                316L SURGICAL METALLURGY
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
                Precision ground 316L surgical stainless steel needle pins assembled in Class
                100,000 cleanrooms. 100% individual EO Gas blister packed with verifiable batch
                sterilization indicators.
              </p>
              <div className="pt-2 text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">
                Individual EO Blister · Medical Grade PC
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-[#e2dfd8] dark:border-white/[0.08] bg-white dark:bg-[#22252f] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] space-y-3">
              <div className="text-xs font-mono font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                UNIVERSAL DOCK COMPATIBILITY
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
                Standardized collar geometry engineered for flawless fitment across major rotary
                pens, wireless battery chassis, and cartridge grips (Cheyenne, Bishop, FK Irons,
                Critical).
              </p>
              <div className="pt-2 text-[10px] font-mono font-bold text-zinc-500 dark:text-zinc-400">
                Universal Cartridge Keyway · Zero Rattle
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
