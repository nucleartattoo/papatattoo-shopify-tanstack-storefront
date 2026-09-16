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
    ],
  }),
  component: ContactPage,
})
