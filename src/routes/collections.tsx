import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getProducts } from '../lib/shopify'
import { CollectionPage, CollectionSearchProps } from '../pages/CollectionPage'

const fetchCatalog = createServerFn({ method: 'GET' }).handler(async () => {
  return await getProducts({ first: 100, language: 'EN' })
})

export const Route = createFileRoute('/collections')({
  validateSearch: (search: Record<string, unknown>): CollectionSearchProps => ({
    category: (search.category as string) || undefined,
    sub: (search.sub as string) || undefined,
    q: (search.q as string) || undefined,
    series: (search.series as 'all' | 'premium' | 'standard') || undefined,
    needle: (search.needle as string) || undefined,
    sort: (search.sort as 'featured' | 'price-asc' | 'price-desc' | 'title-asc') || undefined,
  }),
  loader: async () => {
    try {
      const items = await fetchCatalog()
      return { products: items }
    } catch {
      return { products: [] }
    }
  },
  head: () => ({
    meta: [
      {
        title: 'Catalog & Apparatus · Papa Tattoo Supply',
      },
      {
        name: 'description',
        content:
          'Browse precision rotary machines, click grips, needle cartridges, and studio apparatus engineered for professional tattoo artists.',
      },
      { property: 'og:title', content: 'Catalog & Apparatus · Papa Tattoo Supply' },
      {
        property: 'og:description',
        content:
          'Browse precision rotary machines, click grips, needle cartridges, and studio apparatus engineered for professional tattoo artists.',
      },
    ],
  }),
  component: CollectionPage,
})
