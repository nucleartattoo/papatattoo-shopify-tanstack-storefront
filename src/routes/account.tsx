import { createFileRoute } from '@tanstack/react-router'
import { AccountPage } from '../pages/AccountPage'

export const Route = createFileRoute('/account')({
  head: () => ({
    meta: [
      {
        title: 'Customer Dashboard & Orders · Papa Tattoo Supply',
      },
      {
        name: 'description',
        content:
          'Access your Papa Tattoo customer account, live order tracking, and saved delivery addresses.',
      },
    ],
  }),
  component: AccountPage,
})
