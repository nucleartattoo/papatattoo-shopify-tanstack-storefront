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
      { property: 'og:title', content: 'Sponsored Tattoo Artists & Pro Team · Papa Tattoo Supply' },
      {
        property: 'og:description',
        content:
          'Meet the world-class international tattoo artists and studio residents creating mastery with Papa Tattoo apparatus.',
      },
      { property: 'og:url', content: 'https://papatattoosupply.com/sponsorship-artists' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Official Pro Team & Sponsored Artists · Papa Tattoo Supply' },
      {
        name: 'twitter:description',
        content:
          'World-class tattoo artists creating mastery with Papa Tattoo rotary pens and needle cartridges.',
      },
    ],
    links: [
      { rel: 'canonical', href: 'https://papatattoosupply.com/sponsorship-artists' },
    ],
  }),
  component: SponsorshipArtistsPage,
})
