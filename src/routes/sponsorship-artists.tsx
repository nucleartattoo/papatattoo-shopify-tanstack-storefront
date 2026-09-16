import { createFileRoute } from '@tanstack/react-router'
import { SponsorshipArtistsPage } from '../pages/SponsorshipArtistsPage'

export const Route = createFileRoute('/sponsorship-artists')({
  head: () => ({
    meta: [
      {
        title: 'Sponsored Tattoo Artists & Pro Team · Papa Tattoo Supply',
      },
      {
        name: 'description',
        content:
          'Meet the world-class international tattoo artists and studio residents creating mastery with Papa Tattoo apparatus.',
      },
    ],
  }),
  component: SponsorshipArtistsPage,
})
