import { ShopifyProduct } from '../types/shopify'
import { formatProductImageUrl } from '../utils/imageUrl'

export type LineupCategory = 'machines' | 'cartridges' | 'grips' | 'power' | 'gear'

export function classifyApparatusCategory(
  product: ShopifyProduct
): LineupCategory {
  const title = product.title.toLowerCase()
  const handle = product.handle.toLowerCase()

  if (
    title.includes('grip') ||
    handle.includes('grip') ||
    title.includes('finger ledge')
  ) {
    return 'grips'
  }

  if (
    title.includes('pen') ||
    title.includes('machine') ||
    title.includes('apollo') ||
    title.includes('rotary') ||
    handle.includes('pen') ||
    handle.includes('apollo')
  ) {
    return 'machines'
  }

  if (
    title.includes('cartridge') ||
    title.includes('liner') ||
    title.includes('shader') ||
    title.includes('magnum') ||
    handle.includes('cartridge')
  ) {
    return 'cartridges'
  }

  if (
    title.includes('volt') ||
    title.includes('battery') ||
    title.includes('power') ||
    title.includes('rca') ||
    title.includes('clip cord') ||
    title.includes('foot pedal') ||
    title.includes('atom') ||
    title.includes('critical')
  ) {
    return 'power'
  }

  return 'gear'
}

export interface SwatchOption {
  label: string
  product: ShopifyProduct
  swatchType: 'dot' | 'pill'
  swatchCss?: string
  available: boolean
}

export interface HardwareModelGroup {
  id: string
  category: LineupCategory
  masterTitle: string
  specLine: string
  sortPriority: number
  isFlagshipAmber?: boolean
  swatchLabelPrefix?: string
  options: SwatchOption[]
}

export interface MachineBenchmarkItem {
  handle: string
  fallbackName: string
  roleTag: string
  bestFor: string
  strokeLabel: string
  strokeMaxMm: number
  motorLabel: string
  voltageLabel: string
  weightLabel: string
  weightGrams: number
  chassisLabel: string
  supports3D?: boolean
  product?: ShopifyProduct
}

interface ColorMeta {
  label: string
  css: string
  order: number
}

const COLOR_SWATCH_MAP: Array<{ match: RegExp; meta: ColorMeta }> = [
  {
    match: /matte black/i,
    meta: { label: 'Matte Black', css: 'linear-gradient(135deg, #27272a 0%, #09090b 100%)', order: 1 },
  },
  {
    match: /\bblack\b/i,
    meta: { label: 'Jet Black', css: 'linear-gradient(135deg, #3f3f46 0%, #18181b 100%)', order: 2 },
  },
  {
    match: /gunmetal/i,
    meta: { label: 'Gunmetal', css: 'linear-gradient(135deg, #71717a 0%, #3f3f46 100%)', order: 3 },
  },
  {
    match: /stainless steel/i,
    meta: { label: '316L Stainless', css: 'linear-gradient(135deg, #fafafa 0%, #a1a1aa 55%, #e4e4e7 100%)', order: 4 },
  },
  {
    match: /\bsilver\b/i,
    meta: { label: 'Raw Silver', css: 'linear-gradient(135deg, #f4f4f5 0%, #cbd5e1 100%)', order: 5 },
  },
  {
    match: /\bblue\b/i,
    meta: { label: 'Cobalt Blue', css: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)', order: 6 },
  },
  {
    match: /\bred\b/i,
    meta: { label: 'Crimson Red', css: 'linear-gradient(135deg, #f87171 0%, #dc2626 100%)', order: 7 },
  },
  {
    match: /neon green/i,
    meta: { label: 'Neon Green', css: 'linear-gradient(135deg, #a3e635 0%, #4d7c0f 100%)', order: 8 },
  },
  {
    match: /\bgreen\b/i,
    meta: { label: 'Emerald Green', css: 'linear-gradient(135deg, #34d399 0%, #059669 100%)', order: 9 },
  },
  {
    match: /\bpink\b/i,
    meta: { label: 'Rose Pink', css: 'linear-gradient(135deg, #f472b6 0%, #db2777 100%)', order: 10 },
  },
  {
    match: /camouflage/i,
    meta: { label: 'Tactical Camo', css: 'linear-gradient(135deg, #4d7c0f 0%, #365314 50%, #78350f 100%)', order: 11 },
  },
]

function isProductInStock(product: ShopifyProduct): boolean {
  const variants = product.variants?.edges?.map(e => e.node) || []
  if (variants.length > 0) {
    return variants.some(v => v.availableForSale !== false)
  }
  return product.availableForSale !== false
}

function resolveColorMeta(title: string): ColorMeta {
  for (const entry of COLOR_SWATCH_MAP) {
    if (entry.match.test(title)) {
      return entry.meta
    }
  }
  const suffix = title.split('-').pop()?.trim() || 'Standard'
  return {
    label: suffix,
    css: 'linear-gradient(135deg, #52525b 0%, #27272a 100%)',
    order: 50,
  }
}

function resolveSingleSpecLine(product: ShopifyProduct, category: LineupCategory): string {
  const h = product.handle.toLowerCase()
  const t = product.title.toLowerCase()

  if (h === 'papa-pen-v2-1' || t.includes('pen v2')) {
    return '3.5 mm Fixed Stroke · German Coreless Motor · 150 g'
  }
  if (h === 'papa-pen-jet-black') {
    return '3.5 mm Continuous Rotary · 6061-T6 Billet Chassis'
  }
  if (h === 'papa-premium-tattoo-cartridges') {
    return '62 Needle Configs · 316L Surgical Pins · Safety Membrane'
  }
  if (h === 'papa-standard-tattoo-cartridges') {
    return '62 Needle Configs · EO Gas Sterile · Box of 20'
  }
  if (h.includes('adjustable-grip-v3')) {
    return '33 mm Ergonomic Barrel · Click-Stop Dial · Autoclavable'
  }
  if (h.includes('disposable-cartridge-grip-click')) {
    return '33 mm Click-Stop Depth · EO Sterile · Box of 20'
  }
  if (h.includes('disposable-cartridge-grips')) {
    return '1" & 1.25" Ergonomic Rubber · EO Sterile · Box of 20'
  }
  if (h.includes('disposable-foam-cartridge-grip')) {
    return 'High-Density Shock Foam · EO Sterile · Box of 20'
  }
  if (h.includes('disposable-pen-grip')) {
    return 'Ergonomic Single-Use Pen Sleeve · Sterile Packaged'
  }
  if (h.includes('foam-grip-cover')) {
    return 'Vibration-Damping Memory Foam · Slip-On Sleeve'
  }
  if (h.includes('finger-ledge')) {
    return 'Tactile Indexing Rest · Precision Needle Control'
  }
  if (h.includes('volt-battery')) {
    return '5.0 to 12.0 V OLED Readout · Cordless RCA Interface'
  }
  if (h.includes('power-bullet')) {
    return 'Compact Desktop Voltage Regulator · CNC Alloy Housing'
  }
  if (h.includes('clip-cord')) {
    return 'Low-Resistance Silicone Lead · Spring-Tension Clips'
  }
  if (h.includes('foot-pedal')) {
    return '360° Non-Slip Base · Instantaneous Micro-Switch'
  }
  if (h.includes('travel-case')) {
    return 'Crushproof Hardshell · Die-Cut Apparatus Foam'
  }
  if (h.includes('stencilock')) {
    return 'Long-Wear Thermal Transfer Lock · Skin-Safe Formula'
  }
  if (h.includes('phone-holder')) {
    return 'Articulated Studio Clamp · Reference Mount'
  }
  if (h.includes('apron')) {
    return 'Heavyweight Cross-Back Canvas · Wipe-Clean Coating'
  }
  if (h.includes('shirt') || h.includes('hat')) {
    return 'Official Studio Apparel · Embroidered Emblem'
  }

  if (category === 'machines') return 'Precision Rotary Drive · Aircraft Aluminum'
  if (category === 'cartridges') return 'Medical Polycarbonate · EO Gas Sterile'
  if (category === 'grips') return 'Ergonomic Grip Interface · Precision Balance'
  if (category === 'power') return 'Clean DC Delivery · Studio Grade'
  return 'Official Papa Studio Apparatus'
}

export function groupProductsIntoModels(products: ShopifyProduct[]): HardwareModelGroup[] {
  const penV3: ShopifyProduct[] = []
  const apollo: ShopifyProduct[] = []
  const gripV2: ShopifyProduct[] = []
  const gripV1: ShopifyProduct[] = []
  const rcaCords: ShopifyProduct[] = []
  const trays: ShopifyProduct[] = []
  const singles: ShopifyProduct[] = []

  for (const product of products) {
    const h = product.handle.toLowerCase()
    if (h.startsWith('papa-pen-v3-')) {
      penV3.push(product)
    } else if (h.startsWith('papa-apollo-rotary-')) {
      apollo.push(product)
    } else if (h.startsWith('papa-adjustable-click-grip-v2-')) {
      gripV2.push(product)
    } else if (h.startsWith('papa-adjustable-click-grip-')) {
      gripV1.push(product)
    } else if (h.startsWith('papa-rca-cord-')) {
      rcaCords.push(product)
    } else if (h.startsWith('papa-tray-')) {
      trays.push(product)
    } else {
      singles.push(product)
    }
  }

  const groups: HardwareModelGroup[] = []

  if (penV3.length > 0) {
    const sorted = [...penV3].sort((a, b) =>
      a.handle.includes('full-set') ? -1 : b.handle.includes('full-set') ? 1 : 0
    )
    groups.push({
      id: 'family-papa-pen-v3',
      category: 'machines',
      masterTitle: 'Papa Pen V3',
      specLine: '3.5 to 4.5 mm Modular Stroke · German Direct-Drive · 168 g',
      sortPriority: 10,
      swatchLabelPrefix: 'Edition',
      options: sorted.map(p => ({
        label: p.title.toLowerCase().includes('full set') ? 'Full Set' : 'Machine Only',
        product: p,
        swatchType: 'pill',
        available: isProductInStock(p),
      })),
    })
  }

  if (apollo.length > 0) {
    const sorted = [...apollo].sort(
      (a, b) => resolveColorMeta(a.title).order - resolveColorMeta(b.title).order
    )
    groups.push({
      id: 'family-papa-apollo-rotary',
      category: 'machines',
      masterTitle: 'Papa Apollo Rotary',
      specLine: '4.0 mm Direct-Drive Punch · Ultra-Compact 142 g',
      sortPriority: 30,
      swatchLabelPrefix: 'Finish',
      options: sorted.map(p => {
        const meta = resolveColorMeta(p.title)
        return {
          label: meta.label,
          product: p,
          swatchType: 'dot',
          swatchCss: meta.css,
          available: isProductInStock(p),
        }
      }),
    })
  }

  if (gripV2.length > 0) {
    const sorted = [...gripV2].sort(
      (a, b) => resolveColorMeta(a.title).order - resolveColorMeta(b.title).order
    )
    groups.push({
      id: 'family-click-grip-v2',
      category: 'grips',
      masterTitle: 'Papa Adjustable Click Grip V2',
      specLine: 'Ratchet Depth Dial · 6061-T6 Alloy & 316L Stainless',
      sortPriority: 110,
      swatchLabelPrefix: 'Finish',
      options: sorted.map(p => {
        const meta = resolveColorMeta(p.title)
        return {
          label: meta.label,
          product: p,
          swatchType: 'dot',
          swatchCss: meta.css,
          available: isProductInStock(p),
        }
      }),
    })
  }

  if (gripV1.length > 0) {
    const sorted = [...gripV1].sort(
      (a, b) => resolveColorMeta(a.title).order - resolveColorMeta(b.title).order
    )
    groups.push({
      id: 'family-click-grip-v1',
      category: 'grips',
      masterTitle: 'Papa Adjustable Click Grip',
      specLine: 'Positive Click-Stop Projection · Autoclavable Drive',
      sortPriority: 120,
      swatchLabelPrefix: 'Finish',
      options: sorted.map(p => {
        const meta = resolveColorMeta(p.title)
        return {
          label: meta.label,
          product: p,
          swatchType: 'dot',
          swatchCss: meta.css,
          available: isProductInStock(p),
        }
      }),
    })
  }

  if (rcaCords.length > 0) {
    const sorted = [...rcaCords].sort((a, b) =>
      a.handle.includes('straight') ? -1 : b.handle.includes('straight') ? 1 : 0
    )
    groups.push({
      id: 'family-rca-cord',
      category: 'power',
      masterTitle: 'Papa Pro RCA Cord',
      specLine: 'Gold-Plated Terminal · Strain-Relief Silicone Jacket',
      sortPriority: 230,
      swatchLabelPrefix: 'Terminal',
      options: sorted.map(p => ({
        label: p.title.toLowerCase().includes('angled') ? '90° Angled' : 'Straight',
        product: p,
        swatchType: 'pill',
        available: isProductInStock(p),
      })),
    })
  }

  if (trays.length > 0) {
    const sizeOrder = (title: string) =>
      title.toLowerCase().includes('small') ? 1 : title.toLowerCase().includes('medium') ? 2 : 3
    const sorted = [...trays].sort((a, b) => sizeOrder(a.title) - sizeOrder(b.title))
    groups.push({
      id: 'family-workstation-tray',
      category: 'gear',
      masterTitle: 'Papa Studio Workstation Tray',
      specLine: 'Recessed Apparatus Deck · Chemical-Resistant Surface',
      sortPriority: 320,
      swatchLabelPrefix: 'Footprint',
      options: sorted.map(p => ({
        label: p.title.toLowerCase().includes('small')
          ? 'Small'
          : p.title.toLowerCase().includes('medium')
          ? 'Medium'
          : 'Large',
        product: p,
        swatchType: 'pill',
        available: isProductInStock(p),
      })),
    })
  }

  for (const product of singles) {
    const category = classifyApparatusCategory(product)
    const h = product.handle.toLowerCase()
    const isPremium = category === 'cartridges' && h.includes('premium')

    let sortPriority = 400
    if (h === 'papa-pen-v2-1') sortPriority = 20
    else if (h === 'papa-pen-jet-black') sortPriority = 40
    else if (category === 'machines') sortPriority = 50
    else if (isPremium) sortPriority = 60
    else if (category === 'cartridges') sortPriority = 70
    else if (h.includes('adjustable-grip-v3')) sortPriority = 100
    else if (h.includes('disposable-cartridge-grip-click')) sortPriority = 130
    else if (category === 'grips') sortPriority = 140
    else if (h.includes('volt-battery')) sortPriority = 200
    else if (h.includes('power-bullet')) sortPriority = 210
    else if (h.includes('foot-pedal')) sortPriority = 220
    else if (category === 'power') sortPriority = 240
    else if (h.includes('travel-case')) sortPriority = 300
    else if (h.includes('stencilock')) sortPriority = 310
    else sortPriority = 350

    groups.push({
      id: product.id,
      category,
      masterTitle: product.title,
      specLine: resolveSingleSpecLine(product, category),
      sortPriority,
      isFlagshipAmber: isPremium,
      options: [
        {
          label: 'Standard',
          product,
          swatchType: 'pill',
          available: isProductInStock(product),
        },
      ],
    })
  }

  return groups.sort((a, b) => a.sortPriority - b.sortPriority)
}

export function buildLiveMachineBenchmarks(products: ShopifyProduct[]): MachineBenchmarkItem[] {
  const byHandle = new Map(products.map(p => [p.handle.toLowerCase(), p]))

  const specs: Omit<MachineBenchmarkItem, 'product'>[] = [
    {
      handle: 'papa-pen-v3-black-full-set',
      fallbackName: 'Papa Pen V3 (Full Set)',
      roleTag: 'Modular Flagship',
      bestFor: 'All-round lining, whip shading & solid packing',
      strokeLabel: '3.5 / 4.0 / 4.2 / 4.5 mm',
      strokeMaxMm: 4.5,
      motorLabel: 'German Direct-Drive',
      voltageLabel: '4.5 to 13.0 V DC',
      weightLabel: '168 g balanced',
      weightGrams: 168,
      chassisLabel: 'CNC 6061-T6 Billet',
    },
    {
      handle: 'papa-pen-v2-1',
      fallbackName: 'Papa Pen V2',
      roleTag: 'Benchmark Rotary',
      bestFor: 'Zero-vibration fine line & smooth black-and-grey',
      strokeLabel: '3.5 mm Fixed Precision',
      strokeMaxMm: 3.5,
      motorLabel: 'German Coreless Motor',
      voltageLabel: '5.0 to 12.6 V DC',
      weightLabel: '150 g forward-biased',
      weightGrams: 150,
      chassisLabel: '6061-T6 Aircraft Billet',
      supports3D: true,
    },
    {
      handle: 'papa-pen-jet-black',
      fallbackName: 'Papa Pen · Jet Black',
      roleTag: 'Studio Classic',
      bestFor: 'Daily resident sessions & crisp traditional work',
      strokeLabel: '3.5 mm Continuous Rotary',
      strokeMaxMm: 3.5,
      motorLabel: 'Precision Coreless Rotary',
      voltageLabel: '5.0 to 12.0 V DC',
      weightLabel: '148 g ergonomic',
      weightGrams: 148,
      chassisLabel: 'Anodized Billet Aluminum',
    },
    {
      handle: 'papa-apollo-rotary-black',
      fallbackName: 'Papa Apollo Rotary',
      roleTag: 'Direct-Drive',
      bestFor: 'High-saturation color packing & bold linework',
      strokeLabel: '4.0 mm Direct Punch',
      strokeMaxMm: 4.0,
      motorLabel: 'Low-Vibration Direct-Drive',
      voltageLabel: '6.0 to 11.0 V DC',
      weightLabel: '142 g ultra-compact',
      weightGrams: 142,
      chassisLabel: 'Milled Alloy Chassis',
    },
  ]

  return specs.map(spec => ({
    ...spec,
    product: byHandle.get(spec.handle),
  }))
}

export function getRepresentativeImage(
  products: ShopifyProduct[],
  preferredHandles: string[],
  fallbackPath: string
): string {
  for (const handle of preferredHandles) {
    const match = products.find(p => p.handle.toLowerCase() === handle.toLowerCase())
    const url = match?.images?.edges?.[0]?.node?.url
    if (url) return formatProductImageUrl(url)
  }
  return fallbackPath
}

export function findModelGroupForProduct(
  products: ShopifyProduct[],
  handle: string
): HardwareModelGroup | null {
  if (!handle || products.length === 0) return null
  const groups = groupProductsIntoModels(products)
  const target = handle.toLowerCase()
  return (
    groups.find(group =>
      group.options.some(opt => opt.product.handle.toLowerCase() === target)
    ) || null
  )
}

export function hasMeaningfulHtmlText(html?: string | null): boolean {
  if (!html) return false
  const stripped = html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return stripped.length >= 24
}

export interface HardwareTechnicalProfile {
  eyebrow: string
  headline: string
  summaryParagraphs: string[]
  highlights: string[]
  specs: Array<{ label: string; value: string }>
}

export function getHardwareTechnicalProfile(product: ShopifyProduct): HardwareTechnicalProfile {
  const category = classifyApparatusCategory(product)
  const titleLower = product.title.toLowerCase()
  const handleLower = product.handle.toLowerCase()

  if (category === 'machines') {
    const isV3 = handleLower.includes('v3') || titleLower.includes('v3')
    const isV2 = handleLower.includes('v2') || titleLower.includes('v2')
    const isApollo = handleLower.includes('apollo') || titleLower.includes('apollo')

    return {
      eyebrow: 'ROTARY DRIVE ARCHITECTURE · FACTORY CALIBRATED',
      headline: isV3
        ? 'Modular Multi-Stroke Continuous Rotary System'
        : isApollo
        ? 'Compact Direct-Drive Rotary Architecture'
        : 'Precision Coreless Direct-Drive Rotary Pen',
      summaryParagraphs: [
        isV3
          ? 'The Papa Pen V3 is our flagship modular rotary platform, machined from solid 6061-T6 aerospace aluminum billet and driven by a high-torque German direct-drive motor. Engineered for seamless transition between crisp single-pass lining, whip shading, and dense color saturation.'
          : isApollo
          ? 'The Papa Apollo Rotary packs a 4.0 mm direct-drive punch into an ultra-compact 142 g anodized alloy chassis. Designed for artists who demand immediate torque response and zero bogging when driving large magnum groupings.'
          : 'Machined from solid 6061-T6 aircraft aluminum and powered by a custom German coreless motor, the Papa Pen delivers a balanced 3.5 mm stroke with near-zero lateral vibration across multi-hour studio sessions.',
        'Every machine chassis undergoes individual concentricity inspection, motor run-in testing, and acoustic dampening verification prior to factory dispatch.',
      ],
      highlights: [
        isV3 ? '3.5 - 4.5 mm Modular Stroke' : isApollo ? '4.0 mm Direct Stroke' : '3.5 mm Precision Stroke',
        'German Coreless Motor',
        'Gold-Plated RCA Interface',
      ],
      specs: [
        {
          label: 'CHASSIS METALLURGY',
          value: 'CNC 6061-T6 Aerospace Aluminum · Type-III Hard Anodized',
        },
        {
          label: 'MOTOR & DRIVE SYSTEM',
          value: isV3
            ? 'High-Torque German Brushless Direct-Drive'
            : isApollo
            ? 'Compact High-Punch Direct-Drive Rotary'
            : 'Custom German Coreless Continuous Drive',
        },
        {
          label: 'STROKE CONFIGURATION',
          value: isV3
            ? '3.5 mm / 4.0 mm / 4.2 mm / 4.5 mm Modular'
            : isApollo
            ? '4.0 mm Direct Cam'
            : '3.5 mm All-Rounder Fixed Cam',
        },
        {
          label: 'OPERATING VOLTAGE',
          value: isV3
            ? '4.5 V - 13.0 V DC (6.5 - 9.5 V Optimal)'
            : isV2
            ? '5.0 V - 12.6 V DC'
            : '5.0 V - 12.0 V DC',
        },
        {
          label: 'NET MASS & BALANCE',
          value: isV3
            ? '168 g · Forward-Weighted Ergonomic Center'
            : isApollo
            ? '142 g · Compact Low-Center Profile'
            : '150 g · Zero-Fatigue Pen Geometry',
        },
        {
          label: 'TERMINAL & COMPATIBILITY',
          value: 'Recessed Gold-Plated RCA · Universal Cartridge Keyway',
        },
      ],
    }
  }

  if (category === 'cartridges') {
    const isPremium = titleLower.includes('premium') || handleLower.includes('premium')
    return {
      eyebrow: 'MICRON NEEDLE METALLURGY · CLASS 100,000 CLEANROOM',
      headline: isPremium
        ? 'Japanese 316L Surgical Needle Matrix with Safety Membrane'
        : 'Medical-Grade Sterile Membrane Cartridge System',
      summaryParagraphs: [
        isPremium
          ? 'Papa Premium Tattoo Cartridges pair Japanese 316L surgical stainless steel pins with an internal micro-stabilizer guide that eliminates lateral needle whip during high-precision linework and smooth realism gradients.'
          : 'Papa Standard Tattoo Cartridges are engineered for reliable daily studio performance across 62 configurations, featuring optical-grade polycarbonate tips for unobstructed ink flow visibility.',
        'Each cartridge incorporates a medical-grade silicone rebound membrane that prevents ink and blood backflow into your machine motor or grip stem, and is individually EO Gas blister-sterilized in boxes of 20.',
      ],
      highlights: [
        isPremium ? 'Japanese 316L Surgical Steel' : '316L Surgical Stainless Pins',
        'Anti-Backflow Safety Membrane',
        'Box of 20 · EO Gas Sterile',
      ],
      specs: [
        {
          label: 'PIN METALLURGY',
          value: isPremium
            ? 'Japanese 316L Surgical Stainless Steel · Electrolytic Polish'
            : 'Medical-Grade 316L Surgical Stainless Steel',
        },
        {
          label: 'MEMBRANE ARCHITECTURE',
          value: 'Full-Seal Silicone Elastomer Anti-Backflow Diaphragm',
        },
        {
          label: 'HOUSING MATERIAL',
          value: 'Optical-Grade Medical Polycarbonate · Zero-Friction Tip',
        },
        {
          label: 'AVAILABLE CONFIGURATIONS',
          value: '62 Sizes · RL, RLT, RLH, RS, M1, M1C (#08 / #10 / #12 / #14)',
        },
        {
          label: 'STERILIZATION PROTOCOL',
          value: '100% Ethylene Oxide (EO) Gas · Individual Blister Indicator',
        },
        {
          label: 'UNIVERSAL COLLAR FITMENT',
          value: 'Fits Papa, Cheyenne, Bishop, FK Irons & All Twist-Lock Grips',
        },
      ],
    }
  }

  if (category === 'grips') {
    const isStainless = titleLower.includes('stainless')
    const isDisposable = titleLower.includes('disposable') || titleLower.includes('foam')
    const isLedge = titleLower.includes('ledge')

    return {
      eyebrow: isDisposable
        ? 'STERILE SINGLE-USE ERGONOMICS · STUDIO HYGIENE'
        : 'CNC PROJECTION CONTROL · AUTOCLAVABLE BILLET',
      headline: isDisposable
        ? 'High-Traction Sterile Disposable Cartridge Grip Assembly'
        : isStainless
        ? 'Heavyweight 316L Surgical Stainless Steel Click Grip'
        : 'CNC 6061-T6 Anodized Ratcheted Click-Stop Cartridge Grip',
      summaryParagraphs: [
        isDisposable
          ? 'Engineered for zero cross-contamination and maximum finger cushioning, Papa disposable and foam grip systems dampen high-frequency machine vibration while maintaining positive needle depth control.'
          : isStainless
          ? 'Machined from solid 316L surgical stainless steel for artists who prefer substantial front-weighted counterbalance. Features our precision ball-detent click system for tactile millimeter needle depth adjustment.'
          : 'CNC-turned from solid 6061-T6 aerospace aluminum billet, the Papa Adjustable Click Grip locks your needle hang in crisp, audible click-stop increments so projection never drifts mid-session.',
        isDisposable
          ? 'Individually EO Gas sterilized in blister packs with included drive bars for immediate out-of-box setup.'
          : 'Fully disassemble-free steam autoclave compatible up to 134 °C (273 °F) and resistant to clinical surface disinfectants.',
      ],
      highlights: [
        isDisposable
          ? 'EO Gas Sterile · Box of 20'
          : isStainless
          ? 'Solid 316L Surgical Stainless'
          : 'CNC 6061-T6 Aircraft Billet',
        isLedge ? 'Ergonomic Finger Index Ledge' : 'Positive Click-Stop Depth Collar',
        isDisposable ? 'Anti-Slip Santoprene Cushion' : '100% Steam Autoclavable',
      ],
      specs: [
        {
          label: 'BARREL MATERIAL',
          value: isDisposable
            ? 'Medical-Grade Santoprene Overmold & ABS Core'
            : isStainless
            ? 'Solid 316L Surgical Stainless Steel · Mirror/Satin Finish'
            : 'CNC 6061-T6 Aerospace Aluminum · Anodized Finish',
        },
        {
          label: 'DEPTH ADJUSTMENT',
          value: isDisposable
            ? 'Fixed Calibrated Needle Projection'
            : '0 - 4.5 mm Ratcheted Ball-Detent Click Collar',
        },
        {
          label: 'STERILIZATION RATING',
          value: isDisposable
            ? '100% EO Gas Sterilized · Single-Use Box of 20'
            : 'Steam Autoclave Safe (134 °C / 273 °F) & Cold Ultrasonic',
        },
        {
          label: 'BARREL DIAMETER',
          value: isLedge ? '32 mm Tapered Finger-Ledge Profile' : '30 - 32 mm Knurled Ergonomic Contour',
        },
        {
          label: 'DRIVE BAR & MOUNT',
          value: 'Includes Stainless Plunger Drive Bar · Universal Backstem Collet',
        },
        {
          label: 'CARTRIDGE INTERFACE',
          value: 'Universal Twist-Lock Keyway · Zero Tip Play',
        },
      ],
    }
  }

  if (category === 'power') {
    const isBattery = handleLower.includes('volt') || titleLower.includes('battery')
    const isCord = handleLower.includes('cord') || titleLower.includes('cord')
    const isPedal = handleLower.includes('pedal') || titleLower.includes('pedal')

    return {
      eyebrow: 'REGULATED DC TELEMETRY · ZERO-RIPPLE OUTPUT',
      headline: isBattery
        ? 'Cord-Free Regulated Lithium-Polymer RCA Battery Dock'
        : isCord
        ? 'Low-Resistance Gold-Plated Silicone RCA Apparatus Cord'
        : isPedal
        ? '360° Omnidirectional Cast-Metal Studio Foot Switch'
        : 'Microprocessor-Regulated Digital Tattoo Power Console',
      summaryParagraphs: [
        isBattery
          ? 'The Papa Volt Wireless Battery Dock eliminates clip-cord drag with a balanced 2,000 mAh high-discharge lithium cell that plugs directly into any RCA rotary machine, delivering up to 8 hours of rock-steady voltage.'
          : isCord
          ? 'Constructed with oxygen-free copper conductors and 24K gold-plated RCA terminals inside a hyper-flexible silicone jacket that resists tangling and alcohol wipe degradation.'
          : isPedal
          ? 'Weighted cast-metal 360° foot switch engineered for instant, zero-deadzone contact from any approach angle on the studio floor.'
          : 'Precision DC power supply engineered to maintain flat, ripple-free voltage output under heavy magnum load without motor sag.',
        'Every power component is load-tested across 4.5 V - 13.0 V DC to guarantee clean current delivery and overload protection.',
      ],
      highlights: [
        isBattery ? '2,000 mAh · 8h Runtime' : isCord ? '24K Gold-Plated RCA' : 'Zero-Ripple DC Output',
        isBattery ? '5.0 - 12.0 V Digital OLED' : isPedal ? '360° Weighted Actuation' : 'Overload & Short Protection',
        'Universal Studio Fitment',
      ],
      specs: [
        {
          label: 'PRIMARY ARCHITECTURE',
          value: isBattery
            ? '2,000 mAh High-Rate Lithium-Polymer Pack'
            : isCord
            ? 'High-Strand Oxygen-Free Copper (OFC) Core'
            : isPedal
            ? '360° Omnidirectional Copper Contact Ring'
            : 'Microprocessor-Controlled Buck/Boost DC Regulator',
        },
        {
          label: 'VOLTAGE / RATING',
          value: isBattery
            ? '5.0 V - 12.0 V DC (0.1 V Precision Step)'
            : isCord
            ? 'Low-Impedance < 0.05 Ω Signal Path'
            : '4.5 V - 16.0 V DC Continuous Load Rated',
        },
        {
          label: 'CONNECTOR TERMINAL',
          value: isPedal
            ? 'Standard 1/4" (6.35 mm) Mono Phono Plug'
            : 'Gold-Plated Precision RCA Terminal',
        },
        {
          label: 'HOUSING & JACKET',
          value: isCord
            ? 'Medical-Grade Soft Silicone · Strain-Relief Collar'
            : 'CNC Anodized Alloy & Impact-Resistant Polycarbonate',
        },
        {
          label: 'CHARGING / INPUT',
          value: isBattery ? 'USB-C Fast Charge (1.5h Full Cycle)' : '100-240 V AC Universal Studio Input',
        },
        {
          label: 'SAFETY PROTECTION',
          value: 'Short-Circuit, Over-Current & Thermal Cutoff Guard',
        },
      ],
    }
  }

  // Studio Gear / Trays / Cases / Stencil / Apparel
  const isTray = handleLower.includes('tray') || titleLower.includes('tray')
  const isCase = handleLower.includes('case') || titleLower.includes('case')
  const isStencil = handleLower.includes('stencil') || titleLower.includes('stencil')

  return {
    eyebrow: 'PRO PARLOR WORKSTATION · STUDIO INFRASTRUCTURE',
    headline: isTray
      ? 'Chemical-Resistant Studio Workstation Instrument Tray'
      : isCase
      ? 'Ballistic EVA Multi-Machine Travel & Convention Case'
      : isStencil
      ? 'High-Definition Long-Hold Thermal Stencil Transfer Gel'
      : 'Professional Studio Apparatus & Parlor Equipment',
    summaryParagraphs: [
      isTray
        ? 'Designed to organize rotary machines, ink caps, needle cartridges, and wash bottles on a raised-lip deck that prevents accidental instrument roll-off during active tattooing.'
        : isCase
        ? 'Built for traveling convention artists and resident setups, featuring a crush-resistant EVA ballistic shell and custom high-density foam compartments for machines, batteries, grips, and cords.'
        : isStencil
        ? 'Formulated for crisp, high-contrast purple/carbon stencil transfers that lock onto prepped skin within minutes and resist wiping through multi-hour lining and shading passes.'
        : 'Authentic Papa Tattoo Supply studio gear built for daily parlor durability, barrier-film compatibility, and clean workstation organization.',
      'Tested in working tattoo studios for resistance to Cavicide, isopropyl alcohol, and green soap sanitization routines.',
    ],
    highlights: [
      isTray ? 'Raised Anti-Roll Perimeter' : isCase ? 'Crush-Resistant EVA Shell' : 'Studio-Tested Durability',
      'Cavicide & Alcohol Safe',
      'Direct Parlor Dispatch',
    ],
    specs: [
      {
        label: 'CONSTRUCTION MATERIAL',
        value: isTray
          ? 'High-Impact Chemical-Resistant Polymer Deck'
          : isCase
          ? '1680D Ballistic Nylon & Rigid Molded EVA Core'
          : isStencil
          ? 'Vegan, Non-Toxic Skin-Safe Transfer Emulsion'
          : 'Heavyweight Studio-Grade Textile / Composite',
      },
      {
        label: 'SANITATION COMPATIBILITY',
        value: isStencil
          ? 'Hygienic Airless Pump Dispenser · Zero Cross-Contamination'
          : 'Resistant to Isopropyl Alcohol, Cavicide & Barrier Film',
      },
      {
        label: 'PRIMARY APPLICATION',
        value: isTray
          ? 'Magnetic / Arm-Mount & Countertop Workstation Organization'
          : isCase
          ? '2-4 Machines, Power Units, Cords & Cartridge Storage'
          : 'Professional Tattoo Parlor Daily Operations',
      },
      {
        label: 'QUALITY STANDARD',
        value: 'Papa Tattoo Factory QC Verified',
      },
    ],
  }
}

