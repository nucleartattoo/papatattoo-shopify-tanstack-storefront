import { createFileRoute } from '@tanstack/react-router'
import { WholesalePage } from '../pages/WholesalePage'

export const Route = createFileRoute('/wholesale')({
  head: () => ({
    meta: [
      {
        title: 'Studio Wholesale & Commercial Pricing · Papa Tattoo Supply',
      },
      {
        name: 'description',
        content:
          'Tiered studio bulk pricing, verified parlor allocation, and factory direct distribution for licensed tattoo artists.',
      },
    ],
  }),
  component: WholesalePage,
})
