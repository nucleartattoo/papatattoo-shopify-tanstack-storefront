import { createIsomorphicFn, createServerFn } from '@tanstack/react-start'
import { isSafeRelativePath } from '../utils/sanitizeHtml'

const KNOWN_CLIENT_ROUTES = new Set([
  '/',
  '/collections',
  '/products',
  '/about',
  '/distributors',
  '/sponsorship-artists',
  '/contact',
  '/privacy-policy',
  '/privacy-policy-cookie-restriction-mode',
  '/account',
])

const CLIENT_HANDLE_ALIASES: Record<string, string> = {
  '/products/papa-pen-v2': '/products/papa-pen-v2-1',
}

export const fetchRedirectTarget = createServerFn({ method: 'GET' })
  .validator((input: { pathname: string }) => ({
    pathname: typeof input?.pathname === 'string' ? input.pathname.slice(0, 512) : '/',
  }))
  .handler(async ({ data }): Promise<string | null> => {
    const { lookupRedirectOnServer } = await import('./redirects.server')
    return lookupRedirectOnServer(data.pathname)
  })

export const resolveRedirectTarget = createIsomorphicFn()
  .server(async (pathname: string): Promise<string | null> => {
    const { lookupRedirectOnServer } = await import('./redirects.server')
    return lookupRedirectOnServer(pathname)
  })
  .client(async (pathname: string): Promise<string | null> => {
    const cleanPath = pathname.replace(/\/$/, '') || '/'
    const directAlias = CLIENT_HANDLE_ALIASES[cleanPath]
    if (directAlias && isSafeRelativePath(directAlias)) {
      return directAlias
    }
    if (KNOWN_CLIENT_ROUTES.has(cleanPath) || cleanPath.startsWith('/products/')) {
      return null
    }
    const target = await fetchRedirectTarget({ data: { pathname } })
    return target && isSafeRelativePath(target) ? target : null
  })
