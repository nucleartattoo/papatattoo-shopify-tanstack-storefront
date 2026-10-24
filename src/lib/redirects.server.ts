import '@tanstack/react-start/server-only'
import redirectsMap from '../data/redirects.json'
import { isSafeRelativePath } from '../utils/sanitizeHtml'

const REDIRECT_TABLE = redirectsMap as Record<string, string>

export function lookupRedirectOnServer(pathname: string): string | null {
  if (!pathname) return null
  const rawPath = pathname
  const cleanPath = rawPath.replace(/\/$/, '') || '/'

  const target = REDIRECT_TABLE[rawPath] || REDIRECT_TABLE[cleanPath]
  if (target && isSafeRelativePath(target)) {
    return target
  }
  return null
}
