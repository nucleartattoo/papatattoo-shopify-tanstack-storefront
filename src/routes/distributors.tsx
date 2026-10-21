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
      { property: 'og:title', content: 'Global Authorized Distributors · Papa Tattoo Supply' },
      {
        property: 'og:description',
        content:
          'Official regional logistics and authorized distributor partners for Papa Tattoo Supply across Europe, Americas, and Asia.',
      },
      { property: 'og:url', content: 'https://papatattoo.com/distributors' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Authorized Global Distributors · Papa Tattoo Supply' },
      {
        name: 'twitter:description',
        content:
          'Official logistics and authorized distributors for Papa Tattoo equipment across North & Latin America.',
      },
    ],
    links: [
      { rel: 'canonical', href: 'https://papatattoo.com/distributors' },
    ],
  }),
  component: DistributorsPage,
})
