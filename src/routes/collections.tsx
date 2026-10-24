import { createFileRoute } from '@tanstack/react-router'
import { catalogQueryOptions } from '../lib/catalog.queries'
import { CollectionPage, CollectionSearchProps } from '../pages/CollectionPage'

export const Route = createFileRoute('/collections')({
  validateSearch: (search: Record<string, unknown>): CollectionSearchProps => ({
    category: (search.category as string) || undefined,
    sub: (search.sub as string) || undefined,
    q: (search.q as string) || undefined,
    series: (search.series as 'all' | 'premium' | 'standard') || undefined,
    needle: (search.needle as string) || undefined,
    sort: (search.sort as 'featured' | 'price-asc' | 'price-desc' | 'title-asc') || undefined,
  }),
  loader: async ({ context }) => {
    try {
      const items = await context.queryClient.ensureQueryData(catalogQueryOptions)
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
      { property: 'og:url', content: 'https://papatattoo.com/collections' },
      { property: 'og:type', content: 'website' },
    ],
    links: [
      { rel: 'canonical', href: 'https://papatattoo.com/collections' },
    ],
  }),
  component: CollectionPage,
})
