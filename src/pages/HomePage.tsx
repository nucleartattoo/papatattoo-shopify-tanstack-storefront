import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { HomeSlider } from '../components/home/HomeSlider'
import { HomePromoBanners } from '../components/home/HomePromoBanners'
import { StudioB2B } from '../components/studio/StudioB2B'
import { ProductCard } from '../components/product/ProductCard'
import { ShopifyProduct } from '../types/shopify'
import { getProducts } from '../lib/shopify'
import { ArrowRight } from 'lucide-react'

export const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const [featuredProducts, setFeaturedProducts] = useState<ShopifyProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFeatured() {
      try {
        const prods = await getProducts({ first: 40 })
        // Curate 4 distinct flagship apparatus: Premium Needles, Standard Needles, Rotary Machine, Adjustable Grip
        const pPremium = prods.find(p => p.handle === 'papa-premium-tattoo-cartridges') || prods[0]
        const pStandard = prods.find(p => p.handle === 'papa-standard-tattoo-cartridges') || prods[1]
        const pMachine = prods.find(p => p.handle === 'papa-pen-v2-1' || p.handle === 'papa-pen-jet-black' || (p.title.toLowerCase().includes('pen') && !p.title.toLowerCase().includes('grip')))
        const pGrip = prods.find(p => p.title.toLowerCase().includes('grip') && !p.title.toLowerCase().includes('pen'))

        const selected = [pPremium, pStandard, pMachine, pGrip].filter(Boolean) as ShopifyProduct[]
        if (selected.length === 4) {
          setFeaturedProducts(selected)
        } else {
          setFeaturedProducts(prods.slice(0, 4))
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadFeatured()
  }, [])

  return (
    <div className="space-y-0 art-aurora-bg">
      {/* 1. Large 7-Slide Master Carousel (Papa Original Site Parity) */}
      <HomeSlider />

      {/* 2. Equipment Spotlight & Promo Banners */}
      <HomePromoBanners />

      {/* 3. Flagship Curated Apparatus */}
      <section className="py-20 sm:py-24 bg-zinc-50/50 dark:bg-transparent border-b border-zinc-200/80 dark:border-white/[0.06] relative z-10">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-5 border-b border-zinc-200/80 dark:border-white/[0.08] gap-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-950 dark:text-white uppercase tracking-tight font-sans">
              FEATURED PRODUCTS
            </h2>
            <Link
              to="/collections"
              search={{ category: 'all' }}
              className="inline-flex items-center gap-2 text-xs font-mono font-medium uppercase text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-[#2ee6ca] transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="rounded-2xl border border-zinc-200/80 dark:border-white/[0.06] bg-white dark:bg-[#262933] p-5 animate-pulse space-y-4">
                  <div className="w-full aspect-square bg-zinc-100 dark:bg-white/[0.03] rounded-xl"></div>
                  <div className="h-4 bg-zinc-100 dark:bg-white/[0.03] rounded-sm w-3/4"></div>
                  <div className="h-3 bg-zinc-100 dark:bg-white/[0.03] rounded-sm w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Studio Wholesale Section */}
      <div id="studio-section">
        <StudioB2B />
      </div>
    </div>
  )
}
