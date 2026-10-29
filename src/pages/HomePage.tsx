import React, { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useLoaderData } from '@tanstack/react-router'
import { FullpageHeroSlider } from '../components/home/FullpageHeroSlider'
import { HardwareArchitectureStory } from '../components/home/HardwareArchitectureStory'
import { AtelierApparatusRack } from '../components/home/AtelierApparatusRack'
import { AtelierNeedleChamber } from '../components/home/AtelierNeedleChamber'
import { AtelierDualMonoliths } from '../components/home/AtelierDualMonoliths'
import { AtelierProTeamLedger } from '../components/home/AtelierProTeamLedger'
import { catalogQueryOptions } from '../lib/catalog.queries'
import { groupProductsIntoModels } from '../lib/hardwareLineup'
import { ShopifyProduct } from '../types/shopify'

const EMPTY_PRODUCTS: ShopifyProduct[] = []

export const HomePage: React.FC = () => {
  const loaderData = useLoaderData({ strict: false }) as
    | { products?: ShopifyProduct[] }
    | undefined
  const loaderProducts = loaderData?.products

  const { data: queryProducts } = useQuery({
    ...catalogQueryOptions,
    ...(loaderProducts && loaderProducts.length > 0
      ? { initialData: loaderProducts }
      : {}),
  })
  const products = queryProducts ?? loaderProducts ?? EMPTY_PRODUCTS

  // Consolidated model groups for the catalog
  const allModelGroups = useMemo(
    () => groupProductsIntoModels(products),
    [products]
  )

  // Featured consolidated models for the interactive showroom strip
  const featuredModels = useMemo(() => {
    const allGroups = allModelGroups
    const targetIds = [
      'family-papa-pen-v3',
      'family-click-grip-v2',
      'family-papa-apollo-rotary',
    ]
    const picked = targetIds
      .map(id => allGroups.find(g => g.id === id))
      .filter((g): g is NonNullable<typeof g> => Boolean(g))

    const premiumCartridge = allGroups.find(g =>
      g.options.some(o => o.product.handle === 'papa-premium-tattoo-cartridges')
    )
    if (premiumCartridge) {
      picked.splice(1, 0, premiumCartridge)
    }
    if (picked.length < 4) {
      for (const g of allGroups) {
        if (!picked.some(p => p.id === g.id)) {
          picked.push(g)
          if (picked.length >= 4) break
        }
      }
    }
    return picked.slice(0, 4)
  }, [allModelGroups])

  return (
    <div className="w-full bg-[#08090C] text-zinc-100 font-sans overflow-x-hidden selection:bg-[#2EE6CA]/20 selection:text-[#2EE6CA]">
      {/* ============================================================ */}
      {/* ACT 1: DARK ATELIER HERO SLIDER (GRAND MONOLITH SCULPTURE)  */}
      {/* ============================================================ */}
      <FullpageHeroSlider products={products} />

      {/* ============================================================ */}
      {/* ACT 2: ARCHITECTURE & PRECISION ENGINEERING STORY            */}
      {/* ============================================================ */}
      <HardwareArchitectureStory />

      {/* ============================================================ */}
      {/* ACT 3: ATELIER APPARATUS RACK (PRECISION RECESSED VAULT)     */}
      {/* ============================================================ */}
      {featuredModels.length > 0 && (
        <AtelierApparatusRack groups={featuredModels} />
      )}

      {/* ============================================================ */}
      {/* ACT 4: JAPANESE 316L SURGICAL METALLURGY SPECIMEN CHAMBER    */}
      {/* ============================================================ */}
      <AtelierNeedleChamber />

      {/* ============================================================ */}
      {/* ACT 5: DUAL MONOLITHS (PAPA VOLT & CNC CLICK GRIPS)          */}
      {/* ============================================================ */}
      <AtelierDualMonoliths />

      {/* ============================================================ */}
      {/* ACT 6: PRO TEAM NOIR ROSTER & GLOBAL STUDIO LEDGER           */}
      {/* ============================================================ */}
      <AtelierProTeamLedger />
    </div>
  )
}
