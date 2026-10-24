import { createFileRoute, redirect } from '@tanstack/react-router'
import { productByHandleQueryOptions } from '../lib/catalog.queries'
import { ProductDetailPage } from '../pages/ProductDetailPage'

export const Route = createFileRoute('/products/$handle')({
  beforeLoad: ({ params }) => {
    if (params.handle === 'papa-pen-v2') {
      throw redirect({
        to: '/products/$handle',
        params: { handle: 'papa-pen-v2-1' },
        statusCode: 301,
      })
    }
  },
  loader: async ({ context, params }) => {
    try {
      const product = await context.queryClient.ensureQueryData(
        productByHandleQueryOptions(params.handle)
      )
      return { product }
    } catch {
      return { product: null }
    }
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product
    if (!p) {
      return {
        meta: [
          { title: 'Apparatus Specimen · Papa Tattoo Supply' },
          { name: 'description', content: 'Official Papa Tattoo precision apparatus.' },
          { name: 'robots', content: 'noindex' },
        ],
        links: [
          { rel: 'canonical', href: 'https://papatattoo.com/products' },
        ],
      }
    }
    const pageTitle = p.seo?.title || `${p.title} · Papa Tattoo Supply`
    const pageDesc = p.seo?.description || p.description?.slice(0, 160) || 'Official Papa Tattoo precision apparatus.'
    const firstImg =
      p.images?.edges?.[0]?.node?.url ||
      'https://papatattoo.com/slides/slide_2_premium_cartridges.png'
    const price = p.priceRange?.minVariantPrice?.amount || '25.00'
    const currency = p.priceRange?.minVariantPrice?.currencyCode || 'USD'

    return {
      meta: [
        { title: pageTitle },
        {
          name: 'description',
          content: pageDesc,
        },
        { property: 'og:title', content: pageTitle },
        {
          property: 'og:description',
          content: pageDesc,
        },
        { property: 'og:image', content: firstImg },
        { property: 'og:type', content: 'product' },
        { property: 'og:url', content: `https://papatattoo.com/products/${p.handle}` },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: pageTitle },
        {
          name: 'twitter:description',
          content: pageDesc,
        },
        { name: 'twitter:image', content: firstImg },
      ],
      links: [
        { rel: 'canonical', href: `https://papatattoo.com/products/${p.handle}` },
      ],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: p.title,
            image: [firstImg],
            description: pageDesc,
            sku: p.id,
            brand: {
              '@type': 'Brand',
              name: 'Papa Tattoo',
            },
            offers: {
              '@type': 'Offer',
              url: `https://papatattoo.com/products/${p.handle}`,
              priceCurrency: currency,
              price: price,
              availability: p.availableForSale
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            },
          }),
        },
      ],
    }
  },
  component: ProductDetailRoute,
})

function ProductDetailRoute() {
  const data = Route.useLoaderData()
  return <ProductDetailPage initialProduct={data?.product} />
}
