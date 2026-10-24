import { createFileRoute } from '@tanstack/react-router'
import { PapaProductsPage } from '../pages/PapaProductsPage'

export const Route = createFileRoute('/products/')({
  head: () => ({
    meta: [
      {
        title: 'Papa Products · Professional Tattoo Apparatus Monograph',
      },
      {
        name: 'description',
        content:
          'Official Papa Tattoo Supply apparatus catalog. Precision cartridge needles, rotary tattoo machines, and CNC adjustable grips.',
      },
      {
        property: 'og:title',
        content: 'Papa Products · Professional Tattoo Apparatus Monograph',
      },
      {
        property: 'og:description',
        content:
          'Official Papa Tattoo Supply apparatus catalog. Precision cartridge needles, rotary tattoo machines, and CNC adjustable grips.',
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
