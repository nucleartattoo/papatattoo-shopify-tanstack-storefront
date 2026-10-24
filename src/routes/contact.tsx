import { createFileRoute } from '@tanstack/react-router'
import { ContactPage } from '../pages/ContactPage'

export const Route = createFileRoute('/contact')({
  head: () => ({
    meta: [
      {
        title: 'Contact Logistics & Studio Support · Papa Tattoo Supply',
      },
      {
        name: 'description',
        content:
          'Get in touch with Papa Tattoo Supply for direct studio inquiries, order fulfillment, and technical support.',
      },
      {
        property: 'og:title',
        content: 'Contact Logistics & Studio Support · Papa Tattoo Supply',
      },
      {
        property: 'og:description',
        content:
          'Get in touch with Papa Tattoo Supply for direct studio inquiries, order fulfillment, and technical support.',
      },
      { property: 'og:url', content: 'https://papatattoo.com/contact' },
      { property: 'og:type', content: 'website' },
    ],
    links: [
      { rel: 'canonical', href: 'https://papatattoo.com/contact' },
    ],
  }),
  component: ContactPage,
})
