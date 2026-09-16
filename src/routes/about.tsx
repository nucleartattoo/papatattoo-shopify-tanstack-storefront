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
    ],
  }),
  component: AboutPage,
})
