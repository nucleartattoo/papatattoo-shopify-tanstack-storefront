/// <reference types="vite/client" />
import React from 'react'
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  redirect,
  useLocation,
} from '@tanstack/react-router'
import type { RouterContext } from '../router'
import { resolveRedirectTarget } from '../lib/redirects.functions'
import appCss from '../index.css?url'
import { Header } from '../components/common/Header'
import { Footer } from '../components/common/Footer'
import { CartDrawer } from '../components/cart/CartDrawer'
import { FluidInkBackground } from '../components/common/FluidInkBackground'
import { NotFound } from '../components/common/NotFound'
import { GlobalErrorFallback } from '../components/common/GlobalErrorFallback'
import { ThemeProvider } from '../context/ThemeContext'
import { LocaleProvider } from '../context/LocaleContext'
import { CartProvider } from '../context/CartContext'

function resolveHtmlLangFromHref(href: string): string {
  const match = href.match(/[?&]lang=(en|es|de|fr)\b/i)
  return match ? match[1].toLowerCase() : 'en'
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ location }) => {
    const target = await resolveRedirectTarget(location.pathname)
    if (target) {
      throw redirect({
        href: target,
        statusCode: 301,
      })
    }
  },
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
      { property: 'og:locale', content: 'en_US' },
      {
        property: 'og:title',
        content: 'Papa Tattoo Supply · Precision Tattoo Engineering & Pro Studio Apparatus',
      },
      {
        property: 'og:description',
        content:
          'High-grade aluminum click grips, rotary machines, and official cartridge systems engineered for professional tattoo artists and studios worldwide.',
      },
      {
        property: 'og:image',
        content: 'https://papatattoo.com/slides/slide_2_premium_cartridges.png',
      },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:title',
        content: 'Papa Tattoo Supply · Precision Tattoo Engineering',
      },
      {
        name: 'twitter:description',
        content:
          'High-grade aluminum click grips, rotary machines, and official cartridge systems engineered for professional tattoo artists.',
      },
      {
        name: 'twitter:image',
        content: 'https://papatattoo.com/slides/slide_2_premium_cartridges.png',
      },
      { name: 'theme-color', content: '#1c1e24', media: '(prefers-color-scheme: dark)' },
      { name: 'theme-color', content: '#f5f4f0', media: '(prefers-color-scheme: light)' },
    ],
    links: [
      { rel: 'manifest', href: '/manifest.json' },
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Montserrat:wght@700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
      },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Papa Tattoo Supply',
          url: 'https://papatattoo.com',
          logo: 'https://papatattoo.com/favicon.svg',
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
          url: 'https://papatattoo.com',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://papatattoo.com/collections?q={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        }),
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: GlobalErrorFallback,
})

function RootComponent() {
  const location = useLocation()
  const htmlLang = resolveHtmlLangFromHref(location.href)

  return (
    <RootDocument htmlLang={htmlLang}>
      <ThemeProvider>
        <LocaleProvider>
          <CartProvider>
            <div className="min-h-[100dvh] flex flex-col bg-[#f5f4f0] dark:bg-[#20222a] text-zinc-900 dark:text-zinc-100 transition-colors duration-300 relative overflow-x-hidden">
              {/* Organic Fluid Ink & Smoke Ambient Canvas */}
              <FluidInkBackground />
              <Header />
              <main className="flex-1 relative z-10">
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

function RootDocument({
  children,
  htmlLang,
}: {
  children: React.ReactNode
  htmlLang: string
}) {
  return (
    <html lang={htmlLang} suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('papa_theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="bg-zinc-50 dark:bg-[#090A0C] transition-colors duration-200 antialiased selection:bg-[#2EE6CA] selection:text-black">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
