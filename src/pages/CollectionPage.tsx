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
    if (activeCategory === 'all') return 'All Products'
    const cat = STORE_CATEGORIES.find(c => c.id === activeCategory)
    if (!cat) return 'All Products'
    if (activeSubcategory && cat.subcategories) {
      const sub = cat.subcategories.find(s => s.id === activeSubcategory)
      if (sub) {
        return `${cat.label} · ${sub.label}`
      }
    }
    return cat.label
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
    <div className="bg-[#f5f5f7] dark:bg-black min-h-[100dvh] text-[#1d1d1f] dark:text-[#f5f5f7]">
      {/* 1. Category Stage Banner — Synchronized to Active Category */}
      <section className="w-full relative overflow-hidden">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center justify-between pt-8 pb-6 sm:pt-12 sm:pb-8 gap-8 relative z-10">
          {/* Left: Breadcrumbs & Category Overview */}
          <div className="max-w-2xl space-y-3">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1 text-xs text-[#86868b]"
            >
              <Link to="/" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3 h-3 opacity-60" />
              <Link
                to="/collections"
                search={{ category: 'all' }}
                className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
              >
                Shop
              </Link>
              <ChevronRight className="w-3 h-3 opacity-60" />
              <span className="text-[#1d1d1f] dark:text-[#f5f5f7]">
                {getCategoryTitle()}
              </span>
            </nav>

            <h1 className="text-4xl sm:text-5xl font-semibold tracking-[-0.032em] leading-[1.05] text-[#1d1d1f] dark:text-[#f5f5f7]">
              {getCategoryTitle()}
            </h1>

            <p className="text-base sm:text-lg text-[#86868b] leading-relaxed max-w-xl">
              {currentStage.description}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-[#86868b]">
              {currentStage.pills.map((pill, idx) => (
                <span key={pill} className="inline-flex items-center gap-4 whitespace-nowrap">
                  {idx > 0 && <span aria-hidden="true" className="opacity-40">·</span>}
                  <span>{pill}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Right: Category-Matched Specimen Stage */}
          <div className="relative w-full lg:w-[420px] h-48 sm:h-56 shrink-0 rounded-[28px] bg-white dark:bg-[#121214] overflow-hidden flex items-center justify-center p-6 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.06)]">
            {currentStage.supports3D && (
              <div className="absolute bottom-3 right-3 z-20 flex items-center gap-0.5 p-0.5 rounded-full bg-[#f5f5f7]/90 dark:bg-[#1c1c1e]/90 backdrop-blur-md text-[11px]">
                <button
                  type="button"
                  onClick={() => setStage3DActive(false)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition-[background-color,color,transform,box-shadow] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.96] cursor-pointer ${
                    !stage3DActive
                      ? 'bg-white text-[#1d1d1f] dark:bg-[#2c2c2e] dark:text-white shadow-2xs'
                      : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStage3DActive(true)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition-[background-color,color,transform,box-shadow] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.96] cursor-pointer ${
                    stage3DActive
                      ? 'bg-white text-[#1d1d1f] dark:bg-[#2c2c2e] dark:text-white shadow-2xs'
                      : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                  }`}
                >
                  <Box className="w-3 h-3" />
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
                className="relative z-10 max-h-[85%] max-w-[85%] w-auto object-contain transition-transform duration-300 ease-[var(--ease-spring)] drop-shadow-[0_12px_22px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_14px_24px_rgba(0,0,0,0.5)]"
              />
            )}
          </div>
        </div>
      </section>

      <div className="py-8 max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2. Main Layout: Sidebar Filters + Products Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar Filter Column */}
          <aside className="w-full lg:w-68 lg:shrink-0 lg:pr-2 space-y-6">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#1d1d1f] dark:text-[#f5f5f7]" />
                <span className="text-sm font-semibold tracking-[-0.01em] text-[#1d1d1f] dark:text-[#f5f5f7]">
                  Filter
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
                  className="text-[11px] text-zinc-500 hover:text-[#1d1d1f] dark:hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
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
                className="w-full pl-8 pr-8 py-2 rounded-full border border-transparent bg-black/[0.045] dark:bg-white/[0.08] text-xs focus:bg-white dark:focus:bg-[#1c1c1e] text-[#1d1d1f] dark:text-[#f5f5f7] placeholder:text-[#86868b] focus:outline-hidden focus:border-black/15 dark:focus:border-white/20 transition-colors"
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
                className={`w-full flex items-center justify-between py-2 px-3 rounded-xl text-xs transition-[background-color,color,transform] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.98] cursor-pointer ${
                  activeCategory === 'all'
                    ? 'bg-black/[0.06] dark:bg-white/[0.1] text-[#1d1d1f] dark:text-white font-semibold'
                    : 'text-[#1d1d1f]/85 dark:text-[#f5f5f7]/85 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                }`}
              >
                <span>All Products</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md tabular-nums ${
                    activeCategory === 'all'
                      ? 'text-[#1d1d1f] dark:text-white'
                      : 'text-[#86868b]'
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
                      className={`flex items-center justify-between py-1.5 px-3 rounded-xl text-xs transition-[background-color,color] duration-150 ${
                        isCatActive && !activeSubcategory
                          ? 'bg-black/[0.06] dark:bg-white/[0.1] text-[#1d1d1f] dark:text-white font-semibold'
                          : isCatActive
                          ? 'text-[#1d1d1f] dark:text-[#f5f5f7] font-semibold bg-black/[0.05] dark:bg-white/[0.08]'
                          : 'text-[#1d1d1f]/85 dark:text-[#f5f5f7]/85 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
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
                              ? 'text-[#1d1d1f] dark:text-white'
                              : 'text-[#86868b]'
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
                      <div className="pl-3.5 ml-3 border-l border-black/[0.06] dark:border-white/10 space-y-0.5 py-1">
                        {cat.subcategories!.map(sub => {
                          const isSubActive = isCatActive && activeSubcategory === sub.id
                          const subCount = subcategoryCounts[sub.id] ?? 0

                          return (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => handleSelectSubcategory(cat.id, sub.id)}
                              className={`w-full flex items-center justify-between py-1.5 px-2.5 rounded-lg text-[11px] transition-[background-color,color,transform] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.98] text-left cursor-pointer ${
                                isSubActive
                                  ? 'text-[#1d1d1f] dark:text-[#f5f5f7] font-semibold bg-black/[0.05] dark:bg-white/[0.08]'
                                  : 'text-[#86868b] hover:text-zinc-950 dark:hover:text-zinc-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]'
                              }`}
                            >
                              <span className="truncate pr-1 flex items-center gap-1.5">
                                <span className="truncate">{sub.label}</span>
                                {sub.badge && (
                                  <span className="px-1.5 py-0.2 rounded bg-black/[0.05] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7] text-[9px] font-semibold">
                                    {sub.badge}
                                  </span>
                                )}
                              </span>
                              <span className="text-[10px] text-[#86868b] shrink-0 tabular-nums">
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
            <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
              <label className="flex items-center justify-between cursor-pointer text-xs text-[#1d1d1f] dark:text-[#f5f5f7]">
                <span>In stock only</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={e => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 accent-[#1d1d1f] dark:accent-white rounded cursor-pointer"
                />
              </label>
            </div>
          </aside>

          {/* Right Product Grid Area */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Top Toolbar: Count, View Mode Toggle (Consolidated Models vs All SKUs), & Sort */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="text-xs text-[#86868b]">
                  <strong className="font-semibold text-[#1d1d1f] dark:text-white">
                    {displayMode === 'grouped'
                      ? `${sortedModelGroups.length} models`
                      : `${sortedProducts.length} products`}
                  </strong>
                  {displayMode === 'grouped' &&
                    sortedProducts.length > sortedModelGroups.length && (
                      <span className="ml-1.5 text-[11px] text-[#86868b]">
                        ({sortedProducts.length} total finishes)
                      </span>
                    )}
                </div>

                {/* Consolidated Families vs Individual SKUs Switcher */}
                <div
                  role="group"
                  aria-label="Catalog grouping mode"
                  className="inline-flex items-center p-0.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-[11px]"
                >
                  <button
                    type="button"
                    onClick={() => setDisplayMode('grouped')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-[background-color,color,transform] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer ${
                      displayMode === 'grouped'
                        ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-2xs'
                        : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>By Model ({sortedModelGroups.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDisplayMode('skus')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-[background-color,color,transform] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer ${
                      displayMode === 'skus'
                        ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-2xs'
                        : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                    }`}
                  >
                    <Grid2X2 className="w-3.5 h-3.5" />
                    <span>All Finishes ({sortedProducts.length})</span>
                  </button>
                </div>
              </div>

              {/* Sort Order Selector */}
              <div className="flex items-center gap-2 text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#86868b]" />
                <label
                  htmlFor="collection-sort-select"
                  className="text-[#86868b]"
                >
                  Sort by
                </label>
                <select
                  id="collection-sort-select"
                  value={sortOption}
                  onChange={e => setSortOption(e.target.value)}
                  className="pl-3.5 pr-2 py-1.5 rounded-full border border-transparent bg-black/[0.05] dark:bg-white/[0.08] text-xs text-[#1d1d1f] dark:text-[#f5f5f7] focus:outline-hidden focus:border-[#1d1d1f] dark:focus:border-white"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="title-asc">Name: A–Z</option>
                </select>
              </div>
            </div>

            {/* Inline 62-Size Cartridge Matrix Workbench when viewing Cartridges */}
            {activeCategory === 'cartridges' && activeCartridgeProduct && (
              <div className="p-6 sm:p-8 rounded-[28px] bg-white dark:bg-[#121214] space-y-6 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.06)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/[0.06] dark:border-white/[0.08]">
                  <div>
                    <div className="text-xs font-medium text-[#86868b]">
                      <span>Cartridge Configurator · 62 Sizes</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-semibold tracking-[-0.022em] text-[#1d1d1f] dark:text-[#f5f5f7] mt-1">
                      Configure {matrixTier === 'premium' ? 'Papa Premium 316L' : 'Papa Standard'} boxes.
                    </h2>
                  </div>

                  <div className="inline-flex p-1 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-xs self-start">
                    <button
                      type="button"
                      onClick={() => setMatrixTier('premium')}
                      className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-[background-color,color,transform] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer ${
                        matrixTier === 'premium'
                          ? 'bg-white text-[#1d1d1f] dark:bg-[#2c2c2e] dark:text-white shadow-2xs'
                          : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
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
                      className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-[background-color,color,transform] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] cursor-pointer ${
                        matrixTier === 'standard'
                          ? 'bg-white text-[#1d1d1f] dark:bg-[#2c2c2e] dark:text-white shadow-2xs'
                          : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
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

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-black/[0.06] dark:border-white/[0.08]">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs text-[#86868b]">Selected</span>
                    <span className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                      {effectiveCartridgeVariant?.title || 'Select configuration'}
                    </span>
                    <span className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] whitespace-nowrap">
                      $
                      {parseFloat(
                        effectiveCartridgeVariant?.price.amount ||
                          activeCartridgeProduct.priceRange.minVariantPrice.amount
                      ).toFixed(2)}{' '}
                      / Box of 20
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-full bg-black/[0.05] dark:bg-white/[0.08] h-10 px-1">
                      <button
                        type="button"
                        onClick={() => setCartridgeQty(Math.max(1, cartridgeQty - 1))}
                        className="w-8 h-full text-sm text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-[color,transform] duration-150 active:scale-90 cursor-pointer"
                        aria-label="Decrease box quantity"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-semibold tabular-nums">
                        {cartridgeQty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setCartridgeQty(cartridgeQty + 1)}
                        className="w-8 h-full text-sm text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-[color,transform] duration-150 active:scale-90 cursor-pointer"
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
                      className="px-5 h-10 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] font-semibold text-xs flex items-center gap-2 hover:opacity-90 active:scale-[0.98] transition-[opacity,transform] duration-150 ease-[var(--ease-out-strong)] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>
                        {effectiveCartridgeVariant?.availableForSale === false
                          ? 'Sold Out'
                          : 'Add to Bag'}
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
                    className="rounded-[28px] bg-white dark:bg-[#121214] p-6 animate-pulse space-y-4"
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
              <div className="text-center py-20 rounded-[28px] p-8 bg-white dark:bg-[#121214]">
                <div className="inline-flex p-4 rounded-full bg-[#f5f5f7] dark:bg-white/[0.05] text-zinc-400 mb-4">
                  <Filter className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold tracking-[-0.015em] text-[#1d1d1f] dark:text-[#f5f5f7]">
                  No products match your filters
                </h3>
                <p className="text-sm text-[#86868b] mt-1.5 max-w-sm mx-auto">
                  Clear your active search filter or switch hardware categories to view all
                  available studio equipment.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-5 px-5 py-2.5 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] font-semibold text-xs transition-[opacity,transform] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.97] hover:opacity-90 cursor-pointer"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 3. Global Studio Distribution & Regulatory Standards */}
        <section className="mt-24">
          <div className="max-w-4xl mb-8 space-y-2">
            <div className="text-xs font-medium text-[#86868b]">
              Studio Standards
            </div>
            <h2 className="text-2xl sm:text-4xl font-semibold tracking-[-0.028em] text-[#1d1d1f] dark:text-[#f5f5f7]">
              Built for professional studios worldwide.
            </h2>
            <p className="text-sm sm:text-base text-[#86868b] leading-relaxed">
              Engineered exclusively for licensed tattoo studios and resident artists. All Papa
              apparatus, cartridges, and rotary systems adhere to strict international
              metallurgical and sterile batch manufacturing standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-7 rounded-[28px] bg-white dark:bg-[#121214] space-y-2.5 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)]">
              <div className="text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                Worldwide Logistics
              </div>
              <p className="text-xs text-[#86868b] leading-relaxed">
                Direct express air dispatch to tattoo studios and supply partners across 40+
                countries including the United States, Canada, United Kingdom, Germany, France,
                Italy, Spain, and Australia with dedicated customs clearance.
              </p>
              <div className="pt-1 text-[11px] font-medium text-[#86868b]">
                40+ Countries · Priority Tracking
              </div>
            </div>

            <div className="p-7 rounded-[28px] bg-white dark:bg-[#121214] space-y-2.5 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)]">
              <div className="text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                316L Surgical Metallurgy
              </div>
              <p className="text-xs text-[#86868b] leading-relaxed">
                Precision ground 316L surgical stainless steel needle pins assembled in Class
                100,000 cleanrooms. 100% individual EO Gas blister packed with verifiable batch
                sterilization indicators.
              </p>
              <div className="pt-1 text-[11px] font-medium text-[#86868b]">
                Individual EO Blister · Medical Grade PC
              </div>
            </div>

            <div className="p-7 rounded-[28px] bg-white dark:bg-[#121214] space-y-2.5 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)]">
              <div className="text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                Universal Compatibility
              </div>
              <p className="text-xs text-[#86868b] leading-relaxed">
                Standardized collar geometry engineered for flawless fitment across major rotary
                pens, wireless battery chassis, and cartridge grips (Cheyenne, Bishop, FK Irons,
                Critical).
              </p>
              <div className="pt-1 text-[11px] font-medium text-[#86868b]">
                Universal Cartridge Keyway · Zero Rattle
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
