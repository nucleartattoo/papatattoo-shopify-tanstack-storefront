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
    ],
  }),
  component: PapaProductsPage,
})
