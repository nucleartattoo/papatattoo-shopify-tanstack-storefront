import { createFileRoute } from '@tanstack/react-router'
import { DistributorsPage } from '../pages/DistributorsPage'

export const Route = createFileRoute('/distributors')({
  head: () => ({
    meta: [
      {
        title: 'Global Authorized Distributors · Papa Tattoo Supply',
      },
      {
        name: 'description',
        content:
          'Official regional logistics and authorized distributor partners for Papa Tattoo Supply across Europe, Americas, and Asia.',
      },
    ],
  }),
  component: DistributorsPage,
})
