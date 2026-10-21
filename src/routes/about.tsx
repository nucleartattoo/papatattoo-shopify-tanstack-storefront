import { createFileRoute } from '@tanstack/react-router'
import { AboutPage } from '../pages/AboutPage'

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      {
        title: 'Precision Tattoo Engineering Heritage · Papa Tattoo Supply',
      },
      {
        name: 'description',
        content:
          'Our history of aerospace-grade CNC machining, Japanese 316L needle design, and dedication to professional tattoo artists.',
      },
      { property: 'og:title', content: 'Precision Tattoo Engineering Heritage · Papa Tattoo Supply' },
      {
        property: 'og:description',
        content:
          'Aerospace-grade CNC machining, Japanese 316L needle design, and dedication to professional tattoo artists.',
      },
      { property: 'og:url', content: 'https://papatattoo.com/about' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Engineering Heritage · Papa Tattoo Supply' },
      {
        name: 'twitter:description',
        content:
          'Precision CNC machining and sterile cartridge needle craftsmanship for professional studios.',
      },
    ],
    links: [
      { rel: 'canonical', href: 'https://papatattoo.com/about' },
    ],
  }),
  component: AboutPage,
})
