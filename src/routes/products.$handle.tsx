import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getProductByHandle } from '../lib/shopify'
import { ProductDetailPage } from '../pages/ProductDetailPage'

const fetchProduct = createServerFn({ method: 'GET' })
  .validator((d: { handle: string }) => d)
  .handler(async ({ data }) => {
    return await getProductByHandle(data.handle)
  })

export const Route = createFileRoute('/products/$handle')({
  loader: async ({ params }) => {
    try {
      const product = await fetchProduct({ data: { handle: params.handle } })
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
        ],
      }
    }
    const firstImg =
      p.images?.edges?.[0]?.node?.url ||
      'https://papatattoosupply.com/slides/slide_2_premium_cartridges.png'
    const price = p.priceRange?.minVariantPrice?.amount || '25.00'
    const currency = p.priceRange?.minVariantPrice?.currencyCode || 'USD'

    return {
      meta: [
        { title: `${p.title} · Papa Tattoo Supply` },
        {
          name: 'description',
          content: p.description?.slice(0, 160) || 'Official Papa Tattoo precision apparatus.',
        },
        { property: 'og:title', content: `${p.title} · Papa Tattoo Supply` },
        {
          property: 'og:description',
          content: p.description?.slice(0, 160) || 'Official Papa Tattoo precision apparatus.',
        },
        { property: 'og:image', content: firstImg },
        { property: 'og:type', content: 'product' },
      ],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: p.title,
            image: [firstImg],
            description:
              p.description ||
              'Precision tattoo apparatus engineered for professional studio artists.',
            sku: p.id,
            brand: {
              '@type': 'Brand',
              name: 'Papa Tattoo',
            },
            offers: {
              '@type': 'Offer',
              url: `https://papatattoosupply.com/products/${p.handle}`,
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
