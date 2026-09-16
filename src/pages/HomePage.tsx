import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { HomeSlider } from '../components/home/HomeSlider'
import { FeaturedCategories } from '../components/home/FeaturedCategories'
import { HomePromoBanners } from '../components/home/HomePromoBanners'
import { StudioB2B } from '../components/studio/StudioB2B'
import { ProductCard } from '../components/product/ProductCard'
import { ShopifyProduct } from '../types/shopify'
import { getProducts } from '../lib/shopify'
import { ArrowRight, Sparkles, ShieldCheck, Zap, Layers, Cpu } from 'lucide-react'

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
    <div className="space-y-0">
      {/* 1. Large 7-Slide Master Carousel (Papa Original Site Parity) */}
      <HomeSlider />

      {/* 2. Precision Category Disciplines (Shopify & Magento 2 Parity) */}
      <FeaturedCategories
        activeCategory="all"
        onSelectCategory={(catId) => {
          navigate({ to: '/collections', search: { category: catId } })
        }}
      />

      {/* 3. Flagship Curated Apparatus */}
      <section className="py-16 sm:py-20 bg-zinc-50/60 dark:bg-[#08090C] border-b border-zinc-200/70 dark:border-zinc-800/70">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-5 border-b border-zinc-200/70 dark:border-zinc-800/70 gap-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 dark:text-white uppercase tracking-tight">
              FEATURED PRODUCTS
            </h2>
            <Link
              to="/collections"
              search={{ category: 'all' }}
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#0d9488] dark:text-[#2EE6CA] hover:underline"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white dark:bg-[#12151B] p-5 animate-pulse space-y-4">
                  <div className="w-full aspect-square bg-zinc-200 dark:bg-[#1A1E27] rounded-xl"></div>
                  <div className="h-4 bg-zinc-200 dark:bg-[#1A1E27] rounded-sm w-3/4"></div>
                  <div className="h-3 bg-zinc-200 dark:bg-[#1A1E27] rounded-sm w-1/2"></div>
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

      {/* 4. Equipment Spotlight & Promo Banners */}
      <HomePromoBanners />

      {/* 5. Studio Wholesale Section */}
      <div id="studio-section">
        <StudioB2B />
      </div>
    </div>
  )
}
