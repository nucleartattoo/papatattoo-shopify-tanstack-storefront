import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '../pages/HomePage'
import { productByHandleQueryOptions } from '../lib/catalog.queries'
import type { Locale } from '../context/LocaleContext'

export interface HomeSearchParams {
  lang?: Locale
}

function parseSearchLang(raw: unknown): Locale | undefined {
  if (typeof raw !== 'string') return undefined
  const upper = raw.trim().toUpperCase()
  if (upper === 'EN' || upper === 'ES' || upper === 'DE' || upper === 'FR') {
    return upper
  }
  return undefined
}

const OG_LOCALE_BY_LANG: Record<Locale, string> = {
  EN: 'en_US',
  ES: 'es_ES',
  DE: 'de_DE',
  FR: 'fr_FR',
}

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): HomeSearchParams => {
    const lang = parseSearchLang(search.lang)
    return lang ? { lang } : {}
  },
  loaderDeps: ({ search }) => ({ lang: search.lang }),
  loader: ({ context, deps }) => {
    void context.queryClient.prefetchQuery(productByHandleQueryOptions('papa-pen-v2-1'))
    return { lang: deps.lang }
  },
  head: ({ loaderData }) => {
    const activeLang = loaderData?.lang
    const canonicalHref =
      activeLang && activeLang !== 'EN'
        ? `https://papatattoo.com/?lang=${activeLang}`
        : 'https://papatattoo.com/'
    const ogLocale = activeLang ? OG_LOCALE_BY_LANG[activeLang] : 'en_US'

    return {
      meta: [
        {
          title: 'Papa Tattoo Supply · Precision Tattoo Engineering & Pro Studio Apparatus',
        },
        {
          name: 'description',
          content:
            'High-grade aluminum click grips, rotary machines, and official cartridge systems engineered for professional tattoo artists and studios worldwide.',
        },
        { property: 'og:url', content: canonicalHref },
        { property: 'og:locale', content: ogLocale },
      ],
      links: [
        { rel: 'canonical', href: canonicalHref },
        { rel: 'alternate', hrefLang: 'en', href: 'https://papatattoo.com/' },
        { rel: 'alternate', hrefLang: 'es', href: 'https://papatattoo.com/?lang=ES' },
        { rel: 'alternate', hrefLang: 'de', href: 'https://papatattoo.com/?lang=DE' },
        { rel: 'alternate', hrefLang: 'fr', href: 'https://papatattoo.com/?lang=FR' },
        { rel: 'alternate', hrefLang: 'x-default', href: 'https://papatattoo.com/' },
      ],
    }
  },
  component: HomePage,
})
