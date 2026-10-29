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
  buildLiveMachineBenchmarks,
  getRepresentativeImage,
  groupProductsIntoModels,
  HardwareModelGroup,
} from '../lib/hardwareLineup'
import {
  HardwareFamilyNav,
  HARDWARE_FAMILIES,
} from '../components/catalog/HardwareFamilyNav'
import {
  HardwareTelemetryFilterBar,
  TelemetryFilterValues,
  SubcategoryPill,
} from '../components/catalog/HardwareTelemetryFilterBar'
import { HardwareCompareDrawer } from '../components/catalog/HardwareCompareDrawer'
import {
  ChevronRight,
  Filter,
  Image as ImageIcon,
  RotateCw,
  ShoppingBag,
  Sparkles,
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
    label: 'Rotary Machines',
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
        badge: 'CORELESS',
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
        badge: 'DIRECT',
        match: p => p.title.toLowerCase().includes('apollo'),
      },
    ],
  },
  {
    id: 'cartridges',
    label: 'Needle Cartridges',
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
        label: 'Papa Premium 316L',
        badge: 'SURGICAL',
        match: p =>
          p.handle === 'papa-premium-tattoo-cartridges' ||
          p.title.toLowerCase().includes('premium'),
      },
      {
        id: 'standard',
        label: 'Papa Standard EO',
        badge: 'STERILE',
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
        badge: '6061-T6',
        match: p => p.title.toLowerCase().includes('grip v2'),
      },
      {
        id: 'adjustable-v3',
        label: 'Adjustable Grip V3',
        badge: '33 MM',
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
        label: 'Disposable Grips',
        badge: 'SINGLE-USE',
        match: p => p.title.toLowerCase().includes('disposable'),
      },
      {
        id: 'foam-cover-grips',
        label: 'Foam & Finger Ledge',
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
    label: 'Wireless Power & Drive',
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
        label: 'Volt Battery & Docks',
        badge: 'OLED',
        match: p => {
          const t = p.title.toLowerCase()
          if (t.includes('critical') || t.includes('atom')) return false
          return t.includes('power') || t.includes('bullet') || t.includes('volt') || t.includes('battery')
        },
      },
      {
        id: 'cords',
        label: 'Gold-Plated RCA Cords',
        badge: '24K RCA',
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
    label: 'Studio Workstation',
    match: p => {
      const t = p.title.toLowerCase()
      return (
        (t.includes('tray') || t.includes('case') || t.includes('holder') || t.includes('stencil') || t.includes('hat') || t.includes('shirt') || t.includes('apron'))
      )
    },
    subcategories: [
      {
        id: 'trays',
        label: 'Workstation Trays',
        badge: 'HYGIENIC',
        match: p => p.title.toLowerCase().includes('tray'),
      },
      {
        id: 'travel-case',
        label: 'Papa Travel Case',
        badge: 'EVA HARDSHELL',
        match: p => p.title.toLowerCase().includes('case'),
      },
      {
        id: 'stencil',
        label: 'Stencil Solution',
        match: p => p.title.toLowerCase().includes('stencil'),
      },
      {
        id: 'apparel',
        label: 'Studio Apparel',
        match: p => p.title.toLowerCase().includes('hat') || p.title.toLowerCase().includes('shirt') || p.title.toLowerCase().includes('apron'),
      },
    ],
  },
]

function normalizeCategoryParam(raw?: string): string {
  if (!raw) return 'all'
  const lower = raw.toLowerCase()
  if (lower === 'needles') return 'cartridges'
  if (lower === 'studio' || lower === 'gear') return 'accessories'
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
      'Consolidated Papa Tattoo Supply apparatus index: CNC 6061-T6 rotary machines, ratcheted click grips, 62-size 316L surgical cartridges, and regulated studio power.',
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
    fallbackImage: '/product-images/img_041_papa_volt_large_cutout.webp',
  },
  accessories: {
    badge: 'PARLOR WORKSTATION',
    description:
      'Chemical-resistant magnetic workstation trays, crushproof EVA convention travel cases, and skin-safe thermal stencil lock solutions built for parlor hygiene.',
    pills: ['CAVICIDE RESISTANT', 'RAISED PERIMETER DECK', 'BALLISTIC EVA'],
    imageHandles: ['papa-travel-case', 'papa-tray-large'],
    fallbackImage: '/product-images/img_021_papa_v3_full_case-2_1_cutout.webp',
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
  const [sortOption, setSortOption] = useState<string>(searchParams.sort || 'featured')
  const [displayMode, setDisplayMode] = useState<'grouped' | 'skus'>('grouped')
  const [stage3DActive, setStage3DActive] = useState<boolean>(false)
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false)

  // Hardware Telemetry Filters
  const [telemetry, setTelemetry] = useState<TelemetryFilterValues>({
    stroke: null,
    motor: null,
    metallurgy: null,
    series: (searchParams.series as 'all' | 'premium' | 'standard') || 'all',
    needleGroup: null,
    inStockOnly: false,
  })

  // Inline Cartridge Matrix Quick-Order state (active when viewing cartridges)
  const [matrixTier, setMatrixTier] = useState<'premium' | 'standard'>('premium')
  const [selectedCartridgeVariant, setSelectedCartridgeVariant] =
    useState<ShopifyVariant | null>(null)
  const [cartridgeQty, setCartridgeQty] = useState<number>(1)

  // Synchronize state when URL query params change
  const searchKey = `${searchParams.category || ''}|${searchParams.sub || ''}|${searchParams.q || ''}|${searchParams.series || ''}|${searchParams.sort || ''}`
  const [prevSearchKey, setPrevSearchKey] = useState(searchKey)
  if (searchKey !== prevSearchKey) {
    setPrevSearchKey(searchKey)
    const norm = normalizeCategoryParam(searchParams.category)
    setActiveCategory(norm)
    setStage3DActive(false)
    setActiveSubcategory(searchParams.sub || null)
    setSearchQuery(searchParams.q || '')
    if (searchParams.series) {
      setTelemetry(prev => ({
        ...prev,
        series: searchParams.series as 'all' | 'premium' | 'standard',
      }))
      if (searchParams.series === 'premium' || searchParams.series === 'standard') {
        setMatrixTier(searchParams.series)
      }
    }
    if (searchParams.sort) setSortOption(searchParams.sort)
  }

  const nonGranularProducts = useMemo(() => {
    return products.filter(p => !isGranularCartridge(p) && !isNuclearTattooProduct(p))
  }, [products])

  // Pre-calculate live machine benchmark data for comparison drawer
  const machineBenchmarks = useMemo(
    () => buildLiveMachineBenchmarks(products),
    [products]
  )

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: nonGranularProducts.length,
    }
    for (const cat of STORE_CATEGORIES) {
      counts[cat.id] = nonGranularProducts.filter(p => cat.match(p)).length
    }
    return counts
  }, [nonGranularProducts])

  // Telemetry-aware Filter Function
  const filteredProducts = useMemo(() => {
    return nonGranularProducts.filter(prod => {
      const titleLower = prod.title.toLowerCase()
      const descLower = (prod.description || '').toLowerCase()
      const handleLower = prod.handle.toLowerCase()
      const tagsLower = (prod.tags || []).map(t => t.toLowerCase())

      // 1. Text Query Filter
      if (searchQuery.trim()) {
        const qLower = searchQuery.trim().toLowerCase()
        const matchesQuery =
          titleLower.includes(qLower) ||
          descLower.includes(qLower) ||
          handleLower.includes(qLower) ||
          tagsLower.some(t => t.includes(qLower))
        if (!matchesQuery) return false
      }

      // 2. Category & Subcategory Filter
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

      // 3. Telemetry: Stroke Length
      if (telemetry.stroke) {
        if (telemetry.stroke === '3.5') {
          const is35 =
            titleLower.includes('3.5') ||
            descLower.includes('3.5 mm') ||
            handleLower.includes('v2') ||
            handleLower.includes('jet-black')
          if (!is35) return false
        } else if (telemetry.stroke === '4.0') {
          const is40 =
            titleLower.includes('4.0') ||
            titleLower.includes('apollo') ||
            descLower.includes('4.0 mm') ||
            handleLower.includes('apollo')
          if (!is40) return false
        } else if (telemetry.stroke === '4.5') {
          const is45 =
            titleLower.includes('4.5') ||
            titleLower.includes('v3') ||
            descLower.includes('4.5 mm') ||
            handleLower.includes('v3')
          if (!is45) return false
        }
      }

      // 4. Telemetry: Motor Architecture
      if (telemetry.motor) {
        if (telemetry.motor === 'coreless') {
          const isCoreless =
            descLower.includes('coreless') ||
            handleLower.includes('v2') ||
            handleLower.includes('jet-black')
          if (!isCoreless) return false
        } else if (telemetry.motor === 'direct') {
          const isDirect =
            descLower.includes('direct') ||
            handleLower.includes('v3') ||
            handleLower.includes('apollo')
          if (!isDirect) return false
        }
      }

      // 5. Telemetry: Metallurgy
      if (telemetry.metallurgy) {
        if (telemetry.metallurgy === '6061') {
          const is6061 =
            descLower.includes('6061') ||
            titleLower.includes('alloy') ||
            titleLower.includes('aluminum') ||
            handleLower.includes('v2') ||
            handleLower.includes('v3')
          if (!is6061) return false
        } else if (telemetry.metallurgy === '316l') {
          const is316 =
            titleLower.includes('stainless') ||
            titleLower.includes('316') ||
            descLower.includes('316l') ||
            handleLower.includes('cartridge')
          if (!is316) return false
        } else if (telemetry.metallurgy === 'disposable') {
          const isDisp =
            titleLower.includes('disposable') || descLower.includes('disposable')
          if (!isDisp) return false
        }
      }

      // 6. Telemetry: Series
      if (telemetry.series === 'premium') {
        if (prod.handle !== 'papa-premium-tattoo-cartridges') return false
      } else if (telemetry.series === 'standard') {
        if (prod.handle !== 'papa-standard-tattoo-cartridges') return false
      }

      // 7. Telemetry: Needle Geometry Group
      if (telemetry.needleGroup) {
        if (telemetry.needleGroup === 'liner') {
          const isLiner =
            titleLower.includes('liner') ||
            descLower.includes('round liner') ||
            tagsLower.some(t => t.includes('liner') || t.includes('rl'))
          if (!isLiner) return false
        } else if (telemetry.needleGroup === 'shader') {
          const isShader =
            titleLower.includes('shader') ||
            descLower.includes('round shader') ||
            tagsLower.some(t => t.includes('shader') || t.includes('rs'))
          if (!isShader) return false
        } else if (telemetry.needleGroup === 'magnum') {
          const isMag =
            titleLower.includes('magnum') ||
            descLower.includes('curved magnum') ||
            tagsLower.some(t => t.includes('magnum') || t.includes('m1'))
          if (!isMag) return false
        }
      }

      // 8. In-stock Only Filter
      if (telemetry.inStockOnly && prod.availableForSale === false) return false

      return true
    })
  }, [
    nonGranularProducts,
    searchQuery,
    activeCategory,
    activeSubcategory,
    telemetry,
  ])

  // Sorting
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

  // Consolidated Model Groups
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

  // Cartridge Workbench Products
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

  // Navigation handlers
  const handleSelectCategory = (catId: string) => {
    const norm = normalizeCategoryParam(catId)
    setActiveCategory(norm)
    setActiveSubcategory(null)
    setTelemetry(prev => ({
      ...prev,
      stroke: null,
      motor: null,
      metallurgy: null,
      series: 'all',
      needleGroup: null,
    }))
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

  const handleSelectSubcategory = (subId: string | null) => {
    setActiveSubcategory(subId)
    if (activeCategory === 'cartridges') {
      if (subId === 'premium') {
        setTelemetry(prev => ({ ...prev, series: 'premium' }))
        setMatrixTier('premium')
      } else if (subId === 'standard') {
        setTelemetry(prev => ({ ...prev, series: 'standard' }))
        setMatrixTier('standard')
      } else {
        setTelemetry(prev => ({ ...prev, series: 'all' }))
      }
    }
    navigate({
      to: '/collections',
      search: {
        category: activeCategory,
        sub: subId || undefined,
        q: searchQuery || undefined,
        sort: sortOption as CollectionSearchProps['sort'],
      },
    })
  }

  const handleResetFilters = () => {
    setActiveCategory('all')
    setActiveSubcategory(null)
    setSearchQuery('')
    setSortOption('featured')
    setTelemetry({
      stroke: null,
      motor: null,
      metallurgy: null,
      series: 'all',
      needleGroup: null,
      inStockOnly: false,
    })
    navigate({ to: '/collections', search: { category: 'all' } })
  }

  const hasActiveFilters =
    activeCategory !== 'all' ||
    Boolean(activeSubcategory) ||
    Boolean(searchQuery.trim()) ||
    Boolean(telemetry.stroke) ||
    Boolean(telemetry.motor) ||
    Boolean(telemetry.metallurgy) ||
    telemetry.series !== 'all' ||
    Boolean(telemetry.needleGroup) ||
    telemetry.inStockOnly

  const currentCategoryDef = STORE_CATEGORIES.find(c => c.id === activeCategory)
  const subcategoryPills: SubcategoryPill[] = currentCategoryDef?.subcategories
    ? currentCategoryDef.subcategories.map(sub => ({
        id: sub.id,
        label: sub.label,
        badge: sub.badge,
      }))
    : []

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

  const getCategoryTitle = () => {
    if (activeCategory === 'all') return 'All Hardware Apparatus'
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

  const canCompare =
    activeCategory === 'machines' ||
    activeCategory === 'all' ||
    sortedModelGroups.some(g => g.category === 'machines')

  return (
    <div className="bg-[#f5f5f7] dark:bg-black min-h-[100dvh] text-[#1d1d1f] dark:text-[#f5f5f7]">
      {/* 1. Apple-Style Hardware Family Navigation Strip */}
      <section className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <HardwareFamilyNav
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          categoryCounts={categoryCounts}
          products={nonGranularProducts}
        />
      </section>

      {/* 2. Category Stage Banner */}
      <section className="w-full relative overflow-hidden">
        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center justify-between pt-6 pb-6 sm:pt-8 sm:pb-8 gap-6 sm:gap-8 relative z-10">
          {/* Left: Breadcrumbs & Overview */}
          <div className="max-w-2xl space-y-3">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-xs text-[#86868b]"
            >
              <Link
                to="/"
                className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
              >
                Home
              </Link>
              <ChevronRight className="w-3 h-3 opacity-60" />
              <button
                type="button"
                onClick={() => handleSelectCategory('all')}
                className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors cursor-pointer"
              >
                Catalog
              </button>
              <ChevronRight className="w-3 h-3 opacity-60" />
              <span className="text-[#1d1d1f] dark:text-[#f5f5f7] font-medium">
                {getCategoryTitle()}
              </span>
            </nav>

            <h1 className="text-3xl sm:text-5xl font-semibold tracking-[-0.032em] leading-[1.05] text-[#1d1d1f] dark:text-[#f5f5f7]">
              {getCategoryTitle()}
            </h1>

            <p className="text-sm sm:text-base text-[#86868b] leading-relaxed max-w-xl">
              {currentStage.description}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-[#86868b]">
              {currentStage.pills.map((pill, idx) => (
                <span
                  key={pill}
                  className="inline-flex items-center gap-4 whitespace-nowrap"
                >
                  {idx > 0 && (
                    <span aria-hidden="true" className="opacity-40">
                      ·
                    </span>
                  )}
                  <span>{pill}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Right: Specimen Showcase Card */}
          <div className="relative w-full lg:w-[380px] h-44 sm:h-52 shrink-0 rounded-[28px] bg-white dark:bg-[#121214] border border-black/[0.04] dark:border-white/[0.06] overflow-hidden flex items-center justify-center p-5 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.06)]">
            {currentStage.supports3D && (
              <div className="absolute bottom-3 right-3 z-20 flex items-center gap-0.5 p-0.5 rounded-full bg-[#f5f5f7]/90 dark:bg-[#1c1c1e]/90 backdrop-blur-md text-[11px]">
                <button
                  type="button"
                  onClick={() => setStage3DActive(false)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition-[background-color,color,box-shadow] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.96] cursor-pointer ${
                    !stage3DActive
                      ? 'bg-white text-[#1d1d1f] dark:bg-[#2c2c2e] dark:text-white shadow-2xs font-semibold'
                      : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStage3DActive(true)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition-[background-color,color,box-shadow] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.96] cursor-pointer ${
                    stage3DActive
                      ? 'bg-white text-[#1d1d1f] dark:bg-[#2c2c2e] dark:text-white shadow-2xs font-semibold'
                      : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                  }`}
                >
                  <RotateCw className="w-3 h-3" />
                  <span>3D</span>
                </button>
              </div>
            )}

            {stage3DActive ? (
              <ModelViewer3D
                src="/3d-models/papa-pen-v2.glb"
                alt={getCategoryTitle()}
                className="w-full h-full relative z-10"
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

      {/* 3. Docked Technical Telemetry Filter Bar */}
      <HardwareTelemetryFilterBar
        activeCategory={activeCategory}
        subcategories={subcategoryPills}
        activeSubcategory={activeSubcategory}
        onSelectSubcategory={handleSelectSubcategory}
        telemetry={telemetry}
        onChangeTelemetry={patch => setTelemetry(prev => ({ ...prev, ...patch }))}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        displayMode={displayMode}
        onChangeDisplayMode={setDisplayMode}
        sortOption={sortOption}
        onChangeSort={setSortOption}
        totalCount={nonGranularProducts.length}
        filteredCount={
          displayMode === 'grouped'
            ? sortedModelGroups.length
            : sortedProducts.length
        }
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        onOpenCompare={() => setIsCompareOpen(true)}
        showCompareButton={canCompare}
      />

      {/* 4. Full-Width Catalog Grid & Workbench Area */}
      <main className="py-8 max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Inline 62-Size Cartridge Matrix Configurator when viewing Cartridges */}
        {activeCategory === 'cartridges' && activeCartridgeProduct && (
          <div className="p-6 sm:p-8 rounded-[28px] bg-white dark:bg-[#121214] border border-black/[0.04] dark:border-white/[0.06] space-y-6 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.06)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div>
                <div className="text-xs font-medium text-[#86868b] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Cartridge Configurator · 62 Needle Geometries</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold tracking-[-0.022em] text-[#1d1d1f] dark:text-[#f5f5f7] mt-1">
                  Configure {matrixTier === 'premium' ? 'Papa Premium 316L' : 'Papa Standard'} boxes.
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to="/products/$handle"
                  params={{ handle: activeCartridgeProduct.handle }}
                  hash="replenishment"
                  className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-500/20 transition-colors"
                >
                  Open Studio Replenishment Matrix ›
                </Link>

                <div className="inline-flex p-1 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-xs">
                  <button
                    type="button"
                    onClick={() => setMatrixTier('premium')}
                    className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-[background-color,color] duration-150 cursor-pointer ${
                      matrixTier === 'premium'
                        ? 'bg-white text-[#1d1d1f] dark:bg-[#2c2c2e] dark:text-white shadow-2xs font-semibold'
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
                    className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-[background-color,color] duration-150 cursor-pointer ${
                      matrixTier === 'standard'
                        ? 'bg-white text-[#1d1d1f] dark:bg-[#2c2c2e] dark:text-white shadow-2xs font-semibold'
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
                    className="w-8 h-full text-sm text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
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
                    className="w-8 h-full text-sm text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
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
                  className="px-5 h-10 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] font-semibold text-xs flex items-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
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

        {/* Product Cards Grid: Full-Width 4-Column Layout */}
        {loading && products.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedModelGroups.map(group => (
              <HardwareModelCard key={group.id} group={group} />
            ))}
          </div>
        ) : displayMode === 'skus' && sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-[28px] p-8 bg-white dark:bg-[#121214] border border-black/[0.04] dark:border-white/[0.06]">
            <div className="inline-flex p-4 rounded-full bg-[#f5f5f7] dark:bg-white/[0.05] text-zinc-400 mb-4">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold tracking-[-0.015em] text-[#1d1d1f] dark:text-[#f5f5f7]">
              No products match your telemetry criteria
            </h3>
            <p className="text-sm text-[#86868b] mt-1.5 max-w-sm mx-auto">
              Clear your active stroke, alloy, or search filter to explore the complete Papa Tattoo
              hardware archive.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-5 px-5 py-2.5 rounded-full bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] font-semibold text-xs transition-opacity hover:opacity-90 active:scale-[0.97] cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* 5. Global Studio Distribution & Regulatory Standards */}
        <section className="mt-24 pt-12 border-t border-black/[0.06] dark:border-white/[0.08]">
          <div className="max-w-4xl mb-8 space-y-2">
            <div className="text-xs font-mono font-semibold text-[#86868b] uppercase tracking-wider">
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
            <div className="p-7 rounded-[28px] bg-white dark:bg-[#121214] border border-black/[0.04] dark:border-white/[0.06] space-y-2.5 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)]">
              <div className="text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                Worldwide Express Logistics
              </div>
              <p className="text-xs text-[#86868b] leading-relaxed">
                Direct express air dispatch to tattoo studios and supply partners across 40+
                countries including the United States, Canada, United Kingdom, Germany, France,
                Italy, Spain, and Australia with priority customs tracking.
              </p>
              <div className="pt-1 text-[11px] font-mono text-[#86868b]">
                40+ Countries · Priority Tracking
              </div>
            </div>

            <div className="p-7 rounded-[28px] bg-white dark:bg-[#121214] border border-black/[0.04] dark:border-white/[0.06] space-y-2.5 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)]">
              <div className="text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                Japanese 316L Surgical Metallurgy
              </div>
              <p className="text-xs text-[#86868b] leading-relaxed">
                Precision ground 316L surgical stainless steel needle pins assembled in Class
                100,000 cleanrooms. 100% individual EO Gas blister packed with verifiable batch
                sterilization indicators.
              </p>
              <div className="pt-1 text-[11px] font-mono text-[#86868b]">
                Individual EO Blister · Medical Grade PC
              </div>
            </div>

            <div className="p-7 rounded-[28px] bg-white dark:bg-[#121214] border border-black/[0.04] dark:border-white/[0.06] space-y-2.5 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.05)]">
              <div className="text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                Universal Collar Fitment
              </div>
              <p className="text-xs text-[#86868b] leading-relaxed">
                Standardized collar geometry engineered for flawless fitment across major rotary
                pens, wireless battery chassis, and cartridge grips (Cheyenne, Bishop, FK Irons,
                Critical).
              </p>
              <div className="pt-1 text-[11px] font-mono text-[#86868b]">
                Universal Cartridge Keyway · Zero Rattle
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 6. Hardware Benchmark Comparison Drawer */}
      <HardwareCompareDrawer
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        benchmarks={machineBenchmarks}
      />
    </div>
  )
}
