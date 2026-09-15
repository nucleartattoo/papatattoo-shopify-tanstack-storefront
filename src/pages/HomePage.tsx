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
        // Pick a balanced set of flagship products: 2 premium needles, 1 machine, 1 grip
        const premium = prods.filter(p => p.title.toLowerCase().includes('premium')).slice(0, 2)
        const machines = prods.filter(p => p.title.toLowerCase().includes('pen') || p.title.toLowerCase().includes('machine')).slice(0, 1)
        const grips = prods.filter(p => p.title.toLowerCase().includes('grip')).slice(0, 1)

        const selected = [...premium, ...machines, ...grips]
        if (selected.length < 4) {
          setFeaturedProducts(prods.slice(0, 4))
        } else {
          setFeaturedProducts(selected)
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

      {/* 3. Flagship Curated Apparatus (Mall Highlight Section) */}
      <section className="py-16 bg-zinc-50 dark:bg-[#090A0C] border-b border-zinc-200 dark:border-[#222731]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-zinc-200 dark:border-[#1E232E] gap-4">
            <div>
              <div className="text-[11px] font-mono font-bold tracking-widest text-[#0d9488] dark:text-[#2EE6CA] uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>// FLAGSHIP APPARATUS SHOWCASE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white uppercase tracking-tight">
                STUDIO ESSENTIALS & BESTSELLERS
              </h2>
            </div>
            <Link
              to="/collections"
              search={{ category: 'all' }}
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#0d9488] dark:text-[#2EE6CA] hover:underline"
            >
              <span>Explore All Catalog Apparatus</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="rounded-xl border border-zinc-200 dark:border-[#222731] bg-white dark:bg-[#12151B] p-4 animate-pulse space-y-4">
                  <div className="w-full aspect-square bg-zinc-200 dark:bg-[#1A1E27] rounded-lg"></div>
                  <div className="h-4 bg-zinc-200 dark:bg-[#1A1E27] rounded-sm w-3/4"></div>
                  <div className="h-3 bg-zinc-200 dark:bg-[#1A1E27] rounded-sm w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Equipment Engineering Spotlight & Modular Hardware Banners */}
      <HomePromoBanners />

      {/* 5. Technical Quality Standards (B2B Authority Banner) */}
      <section className="py-12 bg-zinc-100 dark:bg-[#0E1116] border-b border-zinc-200 dark:border-[#1C2028]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-zinc-200 dark:border-[#1E232E] bg-white dark:bg-[#13161D]">
              <ShieldCheck className="w-8 h-8 text-[#0d9488] dark:text-[#2EE6CA] mb-3" />
              <h3 className="text-sm font-mono font-black uppercase text-zinc-900 dark:text-white">
                FACTORY QUALITY CONTROL
              </h3>
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                Direct factory manufacturing quality assurance. Multi-point inspection across rotary pens, cartridge systems, and studio hardware.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-zinc-200 dark:border-[#1E232E] bg-white dark:bg-[#13161D]">
              <Layers className="w-8 h-8 text-amber-500 mb-3" />
              <h3 className="text-sm font-mono font-black uppercase text-zinc-900 dark:text-white">
                JAPANESE 316L SURGICAL ALLOY
              </h3>
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                Razor-sharp needle pins engineered from genuine Japanese 316L surgical stainless steel with micro-stabilized rebound membranes.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-zinc-200 dark:border-[#1E232E] bg-white dark:bg-[#13161D]">
              <Cpu className="w-8 h-8 text-[#0d9488] dark:text-[#2EE6CA] mb-3" />
              <h3 className="text-sm font-mono font-black uppercase text-zinc-900 dark:text-white">
                DIRECT DRIVE ZERO VIBRATION
              </h3>
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                Brushless DC custom coreless motors delivering constant torque with sub-0.01mm concentricity tolerance for ultra-clean lines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Studio Wholesale Section */}
      <div id="studio-section">
        <StudioB2B />
      </div>
    </div>
  )
}
