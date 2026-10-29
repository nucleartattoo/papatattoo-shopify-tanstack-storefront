import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useLoaderData } from '@tanstack/react-router'
import { AtelierHeroMonolith } from '../components/home/AtelierHeroMonolith'
import { AtelierRigBuilder } from '../components/home/AtelierRigBuilder'
import { AtelierCaliperMetrology } from '../components/home/AtelierCaliperMetrology'
import { AtelierWholesaleTerminal } from '../components/home/AtelierWholesaleTerminal'
import { AtelierMasterMonograph } from '../components/home/AtelierMasterMonograph'
import { catalogQueryOptions } from '../lib/catalog.queries'
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

  return (
    <div className="w-full bg-[#08090C] text-zinc-100 font-sans overflow-x-hidden selection:bg-[#2EE6CA]/20 selection:text-[#2EE6CA]">
      {/* ============================================================ */}
      {/* ACT 1: MONUMENTAL ARCHITECTURAL HERO & 4-MODULE ANATOMY     */}
      {/* ============================================================ */}
      <AtelierHeroMonolith products={products} />

      {/* ============================================================ */}
      {/* ACT 2: STUDIO WORKBENCH OS (LIVE MODULAR RIG BUILDER)        */}
      {/* ============================================================ */}
      <AtelierRigBuilder products={products} />

      {/* ============================================================ */}
      {/* ACT 3: SURGICAL METROLOGY & LIVE PENETRATION CALIPER        */}
      {/* ============================================================ */}
      <AtelierCaliperMetrology />

      {/* ============================================================ */}
      {/* ACT 4: HIGH-VOLUME STUDIO REPLENISHMENT TERMINAL            */}
      {/* ============================================================ */}
      <AtelierWholesaleTerminal products={products} />

      {/* ============================================================ */}
      {/* ACT 5: PRO TEAM NOIR MONOGRAPH & MACHINE TUNING PRESETS     */}
      {/* ============================================================ */}
      <AtelierMasterMonograph />
    </div>
  )
}
