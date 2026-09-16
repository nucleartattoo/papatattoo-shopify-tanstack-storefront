/// <reference types="vite/client" />
import React from 'react'
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import appCss from '../index.css?url'
import { Header } from '../components/common/Header'
import { Footer } from '../components/common/Footer'
import { CartDrawer } from '../components/cart/CartDrawer'
import { ThemeProvider } from '../context/ThemeContext'
import { LocaleProvider } from '../context/LocaleContext'
import { CartProvider } from '../context/CartContext'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      {
        title: 'Papa Tattoo Supply · Precision Tattoo Engineering & Pro Studio Apparatus',
      },
      {
        name: 'description',
        content:
          'High-grade aluminum click grips, rotary machines, and official cartridge systems engineered for professional tattoo artists and studios worldwide.',
      },
      { property: 'og:site_name', content: 'Papa Tattoo Supply' },
      { property: 'og:type', content: 'website' },
      {
        property: 'og:title',
        content: 'Papa Tattoo Supply · Precision Tattoo Engineering & Pro Studio Apparatus',
      },
      {
        property: 'og:description',
        content:
          'High-grade aluminum click grips, rotary machines, and official cartridge systems engineered for professional tattoo artists and studios worldwide.',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap',
      },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Papa Tattoo Supply',
          url: 'https://papatattoosupply.com',
          logo: 'https://papatattoosupply.com/favicon.svg',
          description:
            'Professional tattoo engineering company specializing in rotary machines, precision adjustable grips, and sterile cartridge needles.',
          brand: {
            '@type': 'Brand',
            name: 'Papa Tattoo',
          },
        }),
      },
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Papa Tattoo Supply',
          url: 'https://papatattoosupply.com',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://papatattoosupply.com/collections?q={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        }),
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <ThemeProvider>
        <LocaleProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-[#090A0C] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
              <Header />
              <main className="flex-1">
                <Outlet />
              </main>
              <Footer />
              <CartDrawer />
            </div>
          </CartProvider>
        </LocaleProvider>
      </ThemeProvider>
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('papa_theme');
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-zinc-50 dark:bg-[#090A0C] transition-colors duration-200 antialiased selection:bg-[#2EE6CA] selection:text-black">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
