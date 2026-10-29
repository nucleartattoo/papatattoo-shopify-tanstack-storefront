import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useLoaderData } from '@tanstack/react-router'
import { CleanroomHero } from '../components/home/CleanroomHero'
import { CleanroomHardwareLineup } from '../components/home/CleanroomHardwareLineup'
import { CleanroomNeedleMatrix } from '../components/home/CleanroomNeedleMatrix'
import { CleanroomPowerAndGrip } from '../components/home/CleanroomPowerAndGrip'
import { CleanroomProTeam } from '../components/home/CleanroomProTeam'
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
    <div className="w-full bg-white dark:bg-[#000000] text-[#1d1d1f] dark:text-[#f5f5f7] font-sans overflow-x-hidden selection:bg-black/10 dark:selection:bg-white/20">
      {/* ============================================================ */}
      {/* ACT 1: CLEANROOM SCULPTURE HERO & FINISH SELECTION           */}
      {/* ============================================================ */}
      <CleanroomHero products={products} />

      {/* ============================================================ */}
      {/* ACT 2: FOUR-TIER HARDWARE LINEUP EXHIBIT                     */}
      {/* ============================================================ */}
      <CleanroomHardwareLineup />

      {/* ============================================================ */}
      {/* ACT 3: JAPANESE 316L SURGICAL METALLURGY SPECIMEN STAGE     */}
      {/* ============================================================ */}
      <CleanroomNeedleMatrix />

      {/* ============================================================ */}
      {/* ACT 4: CORDLESS POWER & CNC RATCHET CLICK GRIPS              */}
      {/* ============================================================ */}
      <CleanroomPowerAndGrip />

      {/* ============================================================ */}
      {/* ACT 5: RESIDENT PRO TEAM & ACCREDITED SERVICE GUARANTEES    */}
      {/* ============================================================ */}
      <CleanroomProTeam />
    </div>
  )
}
