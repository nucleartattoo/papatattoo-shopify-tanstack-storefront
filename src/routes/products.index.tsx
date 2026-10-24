import { createFileRoute } from '@tanstack/react-router'
import { catalogQueryOptions } from '../lib/catalog.queries'
import { PapaProductsPage, ProductsSearchParams } from '../pages/PapaProductsPage'

const VALID_CATEGORIES = new Set(['all', 'machines', 'cartridges', 'grips', 'power', 'gear'])

export const Route = createFileRoute('/products/')({
  validateSearch: (search: Record<string, unknown>): ProductsSearchParams => {
    const rawCat = typeof search.category === 'string' ? search.category.toLowerCase() : undefined
    const category =
      rawCat && VALID_CATEGORIES.has(rawCat)
        ? (rawCat as ProductsSearchParams['category'])
        : undefined
    const view =
      search.view === 'sheet' || search.view === 'lineup'
        ? search.view
        : undefined
    const compare =
      search.compare === true ||
      search.compare === 1 ||
      search.compare === '1' ||
      search.compare === 'true'
        ? true
        : undefined
    const q = typeof search.q === 'string' && search.q.trim() ? search.q.trim() : undefined

    return {
      ...(category && category !== 'all' ? { category } : {}),
      ...(view && view !== 'lineup' ? { view } : {}),
      ...(compare ? { compare: true } : {}),
      ...(q ? { q } : {}),
    }
  },
  loader: async ({ context }) => {
    try {
      const products = await context.queryClient.ensureQueryData(catalogQueryOptions)
      return { products }
    } catch {
      return { products: [] }
    }
  },
  head: () => ({
    meta: [
      {
        title: 'Hardware Lineup & Apparatus · Papa Tattoo Supply',
      },
      {
        name: 'description',
        content:
          'Official Papa Tattoo Supply hardware lineup. Compare rotary tattoo machines, 316L surgical needle cartridges, CNC 6061-T6 click grips, and wireless power systems.',
      },
      {
        property: 'og:title',
        content: 'Hardware Lineup & Apparatus · Papa Tattoo Supply',
      },
      {
        property: 'og:description',
        content:
          'Official Papa Tattoo Supply hardware lineup. Compare rotary tattoo machines, 316L surgical needle cartridges, CNC 6061-T6 click grips, and wireless power systems.',
      },
      { property: 'og:url', content: 'https://papatattoo.com/products' },
      { property: 'og:type', content: 'website' },
    ],
    links: [
      { rel: 'canonical', href: 'https://papatattoo.com/products' },
    ],
  }),
  component: PapaProductsPage,
})
