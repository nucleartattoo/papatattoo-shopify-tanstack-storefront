import { createFileRoute } from '@tanstack/react-router'
import { PrivacyPolicyPage } from '../pages/PrivacyPolicyPage'

export const Route = createFileRoute('/privacy-policy')({
  head: () => ({
    meta: [
      {
        title: 'Privacy and Cookie Policy · Papa Tattoo Supply',
      },
      {
        name: 'description',
        content:
          'Official compliance disclosures, cookie notice, commercial terms of sale, and factory RMA machine repair protocol.',
      },
      { property: 'og:title', content: 'Privacy and Cookie Policy · Papa Tattoo Supply' },
      {
        property: 'og:description',
        content:
          'Official compliance disclosures, cookie notice, commercial terms of sale, and factory RMA machine repair protocol.',
      },
      { property: 'og:url', content: 'https://papatattoosupply.com/privacy-policy' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Privacy and Cookie Policy · Papa Tattoo Supply' },
    ],
    links: [
      { rel: 'canonical', href: 'https://papatattoosupply.com/privacy-policy' },
    ],
  }),
  component: PrivacyPolicyPage,
})
