import { createFileRoute } from '@tanstack/react-router'
import { PrivacyPolicyPage } from '../pages/PrivacyPolicyPage'

export const Route = createFileRoute('/privacy-policy')({
  head: () => ({
    meta: [
      {
        title: 'Privacy Policy & Terms of Sale · Papa Tattoo Supply',
      },
      {
        name: 'description',
        content:
          'Official compliance disclosures, cookie notice, commercial terms of sale, and factory RMA machine repair protocol.',
      },
    ],
  }),
  component: PrivacyPolicyPage,
})
