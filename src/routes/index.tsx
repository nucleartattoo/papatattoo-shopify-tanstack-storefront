import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '../pages/HomePage'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      {
        title: 'Papa Tattoo Supply · Precision Tattoo Engineering & Pro Studio Apparatus',
      },
      {
        name: 'description',
        content:
          'High-grade aluminum click grips, rotary machines, and official cartridge systems engineered for professional tattoo artists and studios worldwide.',
      },
    ],
  }),
  component: HomePage,
})
