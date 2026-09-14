import React from 'react'
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router'
import { Header } from './components/common/Header'
import { Footer } from './components/common/Footer'
import { CartDrawer } from './components/cart/CartDrawer'
import { HomePage } from './pages/HomePage'
import { CollectionPage, CollectionSearchProps } from './pages/CollectionPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { WholesalePage } from './pages/WholesalePage'
import { SponsorshipArtistsPage } from './pages/SponsorshipArtistsPage'
import { ContactPage } from './pages/ContactPage'
import { DistributorsPage } from './pages/DistributorsPage'
import { AboutPage } from './pages/AboutPage'
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage'

// 1. Root Layout Route
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-[#090A0C] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  ),
})

// 2. Child Routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const collectionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/collections',
  validateSearch: (search: Record<string, unknown>): CollectionSearchProps => ({
    category: (search.category as string) || undefined,
    q: (search.q as string) || undefined,
    series: (search.series as 'all' | 'premium' | 'standard') || undefined,
    needle: (search.needle as string) || undefined,
    sort: (search.sort as 'featured' | 'price-asc' | 'price-desc' | 'title-asc') || undefined,
  }),
  component: CollectionPage,
})

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products/$handle',
  component: ProductDetailPage,
})

const wholesaleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/wholesale',
  component: WholesalePage,
})

const sponsorshipArtistsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sponsorship-artists',
  component: SponsorshipArtistsPage,
})

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
})

const distributorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/distributors',
  component: DistributorsPage,
})

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
})

const privacyPolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy-policy',
  component: PrivacyPolicyPage,
})

// 3. Route Tree & Router Instance
const routeTree = rootRoute.addChildren([
  indexRoute,
  collectionsRoute,
  productDetailRoute,
  wholesaleRoute,
  sponsorshipArtistsRoute,
  distributorsRoute,
  contactRoute,
  aboutRoute,
  privacyPolicyRoute,
])

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
})

// Register router for full TypeScript type-safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
