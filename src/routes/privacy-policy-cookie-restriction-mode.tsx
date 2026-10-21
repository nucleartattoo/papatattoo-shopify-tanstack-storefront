import { createFileRoute, redirect } from '@tanstack/react-router'
import { PrivacyPolicyPage } from '../pages/PrivacyPolicyPage'

export const Route = createFileRoute('/privacy-policy-cookie-restriction-mode')({
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
    ],
    links: [
      { rel: 'canonical', href: 'https://papatattoo.com/privacy-policy' },
    ],
  }),
  component: PrivacyPolicyPage,
})
