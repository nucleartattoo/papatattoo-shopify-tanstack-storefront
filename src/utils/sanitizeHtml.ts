const ALLOWED_TAGS = new Set([
  'A', 'B', 'BLOCKQUOTE', 'BR', 'CODE', 'DIV', 'EM',
  'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
  'HR', 'I', 'IMG', 'LI', 'OL', 'P', 'PRE', 'S', 'SPAN',
  'STRONG', 'SUB', 'SUP', 'TABLE', 'TBODY', 'TD', 'TH', 'THEAD', 'TR', 'U', 'UL',
])

const VOID_TAGS = new Set(['BR', 'HR', 'IMG'])

const DROP_WITH_CHILDREN = new Set([
  'SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'FORM',
  'SVG', 'MATH', 'NOSCRIPT', 'TEMPLATE', 'TEXTAREA', 'TITLE', 'XMP', 'HEAD',
])

const AUTO_CLOSE_P_BEFORE = new Set([
  'BLOCKQUOTE', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
  'HR', 'OL', 'P', 'PRE', 'TABLE', 'UL',
])

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  ndash: '–',
  mdash: '—',
  bull: '•',
  middot: '·',
  deg: '°',
  plusmn: '±',
  times: '×',
  divide: '÷',
  trade: '™',
  reg: '®',
  copy: '©',
  euro: '€',
  pound: '£',
  yen: '¥',
}

function decodeHtmlEntities(input: string): string {
  if (!input || !input.includes('&')) return input
  return input.replace(/&(?:#(\d{1,7})|#x([0-9a-fA-F]{1,6})|([a-zA-Z][a-zA-Z0-9]{1,7}));?/g, (match, dec, hex, named) => {
    if (dec !== undefined || hex !== undefined) {
      const code = dec !== undefined ? parseInt(dec, 10) : parseInt(hex, 16)
      if (
        Number.isNaN(code) ||
        code > 0x10ffff ||
        (code >= 0xd800 && code <= 0xdfff) ||
        (code < 0x20 && code !== 0x09 && code !== 0x0a && code !== 0x0d) ||
        code === 0x7f
      ) {
        return ''
      }
      try {
        return String.fromCodePoint(code)
      } catch {
        return ''
      }
    }
    if (named !== undefined) {
      const key = named.toLowerCase()
      if (Object.prototype.hasOwnProperty.call(NAMED_ENTITIES, key)) {
        return NAMED_ENTITIES[key]
      }
    }
    return match
  })
}

function escapeHtmlText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function stripControlAndSpace(value: string): string {
  let out = ''
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i)
    if (code > 0x20 && code !== 0x7f) {
      out += value[i]
    }
  }
  return out
}

function hasControlChars(value: string): boolean {
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i)
    if (code <= 0x1f || code === 0x7f) return true
  }
  return false
}

export function isSafeRelativePath(path: string): boolean {
  if (!path) return false
  const trimmed = path.trim()
  return (
    trimmed.startsWith('/') &&
    !trimmed.startsWith('//') &&
    !trimmed.includes('\\') &&
    !hasControlChars(trimmed)
  )
}

export function isSafeUrl(
  value: string,
  allowedProtocols: ReadonlyArray<string> = ['http:', 'https:', 'mailto:']
): boolean {
  if (!value) return false
  const trimmed = value.trim()
  if (!trimmed) return false

  const compact = stripControlAndSpace(trimmed)
  if (!compact) return false

  if (compact.startsWith('#')) {
    return !hasControlChars(trimmed)
  }

  if (compact.startsWith('/')) {
    return isSafeRelativePath(trimmed)
  }

  try {
    const url = new URL(compact)
    return allowedProtocols.includes(url.protocol.toLowerCase())
  } catch {
    return false
  }
}

export function isSafeCheckoutUrl(urlValue: string, configuredStoreDomain?: string): boolean {
  if (!urlValue) return false
  try {
    const parsed = new URL(urlValue.trim())
    if (parsed.protocol !== 'https:') return false
    const host = parsed.hostname.toLowerCase()
    if (!host) return false
    if (
      host === 'papatattoo.com' ||
      host.endsWith('.papatattoo.com') ||
      host.endsWith('.myshopify.com') ||
      host === 'shop.app' ||
      host.endsWith('.shop.app') ||
      host.endsWith('.shopify.com')
    ) {
      return true
    }
    if (configuredStoreDomain) {
      const cleanDomain = configuredStoreDomain.trim().toLowerCase().replace(/^https?:\/\//, '').split('/')[0]
      if (cleanDomain && host === cleanDomain) return true
    }
    return false
  } catch {
    return false
  }
}

const ESCAPED_TAG_RE = /&(?:amp;)?lt;\/?(?:p|div|span|strong|em|b|i|u|s|ul|ol|li|br|hr|h[1-6]|table|thead|tbody|tr|th|td|blockquote|pre|code|sub|sup|a|img)\b/i

function unescapeLegacyEntities(text: string): string {
  return text
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;|&apos;/gi, "'")
    .replace(/&amp;/gi, '&')
}

function normalizeRawHtml(raw: string): string {
  if (!raw) return ''
  let text = raw.trim()

  // Unwrap outer Magento PageBuilder container if present
  const openPbMatch = text.match(/^<div\s+[^>]*data-content-type=["']html["'][^>]*>/i)
  if (openPbMatch && /<\/div>\s*$/i.test(text)) {
    text = text.slice(openPbMatch[0].length).replace(/<\/div>\s*$/i, '').trim()
  }

  // Unescape up to 2 levels if Magento PageBuilder stored entity-encoded HTML tags.
  // Security invariant: all unescaped output is unconditionally tokenized and reconstructed
  // by the strict allowlist parser below on BOTH SSR and CSR.
  if (ESCAPED_TAG_RE.test(text)) {
    text = unescapeLegacyEntities(text)
    if (ESCAPED_TAG_RE.test(text)) {
      text = unescapeLegacyEntities(text)
    }
  }

  return text.trim()
}

interface ParsedOpeningTag {
  tagName: string
  attrs: Map<string, string>
  selfClosing: boolean
  endIndex: number
}

function parseOpeningTag(html: string, startIndex: number): ParsedOpeningTag | null {
  const len = html.length
  let i = startIndex + 1 // skip '<'

  const nameStart = i
  while (i < len) {
    const ch = html[i]
    if (
      (ch >= 'a' && ch <= 'z') ||
      (ch >= 'A' && ch <= 'Z') ||
      (ch >= '0' && ch <= '9') ||
      ch === '-' ||
      ch === ':'
    ) {
      i++
    } else {
      break
    }
  }

  if (i === nameStart) return null
  const tagName = html.slice(nameStart, i).toUpperCase()
  const attrs = new Map<string, string>()
  let selfClosing = false

  while (i < len) {
    // Skip whitespace
    while (i < len && /\s/.test(html[i])) i++
    if (i >= len) return null // Unclosed tag at EOF

    if (html[i] === '>') {
      return { tagName, attrs, selfClosing, endIndex: i + 1 }
    }

    if (html[i] === '/') {
      i++
      while (i < len && /\s/.test(html[i])) i++
      if (i < len && html[i] === '>') {
        return { tagName, attrs, selfClosing: true, endIndex: i + 1 }
      }
      // Stray '/' inside tag (e.g. <img/onerror=...>); continue scanning attributes
      continue
    }

    // Parse attribute name
    const attrStart = i
    while (i < len && !/[\s=/>"'`]/.test(html[i])) i++
    if (i === attrStart) {
      // Skip unexpected quote/backtick character inside tag
      i++
      continue
    }
    const attrName = html.slice(attrStart, i).toLowerCase()

    while (i < len && /\s/.test(html[i])) i++

    let attrValue = ''
    if (i < len && html[i] === '=') {
      i++ // skip '='
      while (i < len && /\s/.test(html[i])) i++
      if (i < len) {
        const quote = html[i]
        if (quote === '"' || quote === "'") {
          i++
          const valStart = i
          while (i < len && html[i] !== quote) i++
          attrValue = html.slice(valStart, i)
          if (i < len && html[i] === quote) i++
        } else {
          const valStart = i
          while (i < len && !/[\s>]/.test(html[i])) i++
          attrValue = html.slice(valStart, i)
        }
      }
    }

    if (!attrs.has(attrName)) {
      attrs.set(attrName, decodeHtmlEntities(attrValue))
    }
  }

  return null
}

function findMatchingDropClose(html: string, fromIndex: number, tagName: string): number {
  const closePattern = new RegExp(`<\\/\\s*${tagName}\\b[^>]*>`, 'gi')
  closePattern.lastIndex = fromIndex
  const match = closePattern.exec(html)
  if (!match) return html.length
  return match.index + match[0].length
}

function serializeSanitizedOpenTag(tagName: string, attrs: Map<string, string>): string | null {
  const safeAttrs: string[] = []

  if (tagName === 'A') {
    const href = attrs.get('href')
    if (href && isSafeUrl(href, ['http:', 'https:', 'mailto:'])) {
      safeAttrs.push(`href="${escapeHtmlAttr(href.trim())}"`)
    }
    const title = attrs.get('title')
    if (title) {
      safeAttrs.push(`title="${escapeHtmlAttr(title)}"`)
    }
    if (safeAttrs.some(a => a.startsWith('href='))) {
      safeAttrs.push('rel="noopener noreferrer"')
    }
  } else if (tagName === 'IMG') {
    const src = attrs.get('src')
    if (!src || !isSafeUrl(src, ['http:', 'https:']) || src.trim().startsWith('#')) {
      // Drop <img> without a valid safe image URL
      return null
    }
    safeAttrs.push(`src="${escapeHtmlAttr(src.trim())}"`)
    const alt = attrs.get('alt') ?? ''
    safeAttrs.push(`alt="${escapeHtmlAttr(alt)}"`)
    const title = attrs.get('title')
    if (title) {
      safeAttrs.push(`title="${escapeHtmlAttr(title)}"`)
    }
    const width = attrs.get('width')?.trim()
    if (width && /^[1-9]\d{0,3}$/.test(width)) {
      safeAttrs.push(`width="${width}"`)
    }
    const height = attrs.get('height')?.trim()
    if (height && /^[1-9]\d{0,3}$/.test(height)) {
      safeAttrs.push(`height="${height}"`)
    }
    const loading = attrs.get('loading')?.trim().toLowerCase()
    safeAttrs.push(`loading="${loading === 'eager' ? 'eager' : 'lazy'}"`)
  } else if (tagName === 'TD' || tagName === 'TH') {
    const colspan = attrs.get('colspan')?.trim()
    if (colspan && /^[1-9]\d{0,2}$/.test(colspan)) {
      safeAttrs.push(`colspan="${colspan}"`)
    }
    const rowspan = attrs.get('rowspan')?.trim()
    if (rowspan && /^[1-9]\d{0,2}$/.test(rowspan)) {
      safeAttrs.push(`rowspan="${rowspan}"`)
    }
  }

  const lower = tagName.toLowerCase()
  return safeAttrs.length > 0 ? `<${lower} ${safeAttrs.join(' ')}>` : `<${lower}>`
}

/**
 * Pure isomorphic allowlist HTML sanitizer.
 * Produces byte-for-byte identical output on Cloudflare Workers SSR, Node SSR, and Browser CSR,
 * eliminating SSR regex bypasses and React hydration mismatches.
 */
export function sanitizeProductHtml(html: string): string {
  if (!html) return ''
  const normalized = normalizeRawHtml(html)
  if (!normalized) return ''

  const output: string[] = []
  const openStack: string[] = []
  const len = normalized.length
  let i = 0

  const closeTagOnStack = (targetTag: string) => {
    const idx = openStack.lastIndexOf(targetTag)
    if (idx === -1) return
    while (openStack.length > idx) {
      const top = openStack.pop()!
      output.push(`</${top.toLowerCase()}>`)
    }
  }

  while (i < len) {
    const lt = normalized.indexOf('<', i)
    if (lt === -1) {
      const text = decodeHtmlEntities(normalized.slice(i))
      if (text) output.push(escapeHtmlText(text))
      break
    }

    if (lt > i) {
      const text = decodeHtmlEntities(normalized.slice(i, lt))
      if (text) output.push(escapeHtmlText(text))
    }

    // HTML comment <!-- ... -->
    if (normalized.startsWith('<!--', lt)) {
      const commentEnd = normalized.indexOf('-->', lt + 4)
      i = commentEnd === -1 ? len : commentEnd + 3
      continue
    }

    // Declaration / doctype / processing instruction <!...> or <?...>
    const nextChar = normalized[lt + 1]
    if (nextChar === '!' || nextChar === '?') {
      const declEnd = normalized.indexOf('>', lt + 2)
      i = declEnd === -1 ? len : declEnd + 1
      continue
    }

    // Closing tag </tag...>
    if (nextChar === '/') {
      const closeMatch = normalized.slice(lt).match(/^<\/\s*([a-zA-Z][a-zA-Z0-9:-]*)[^>]*>/)
      if (closeMatch) {
        const closingName = closeMatch[1].toUpperCase()
        if (ALLOWED_TAGS.has(closingName) && !VOID_TAGS.has(closingName)) {
          closeTagOnStack(closingName)
        }
        i = lt + closeMatch[0].length
        continue
      }
      // Malformed '</...' without '>' or valid tag name: skip to '>' or escape '<'
      const gt = normalized.indexOf('>', lt + 2)
      if (gt === -1) {
        output.push('&lt;')
        i = lt + 1
      } else {
        i = gt + 1
      }
      continue
    }

    // Opening tag <tag ...>
    if (nextChar && ((nextChar >= 'a' && nextChar <= 'z') || (nextChar >= 'A' && nextChar <= 'Z'))) {
      const parsed = parseOpeningTag(normalized, lt)
      if (!parsed) {
        // Unclosed '<tag...' at EOF — drop trailing broken fragment safely
        break
      }

      i = parsed.endIndex
      const { tagName, attrs, selfClosing } = parsed

      if (DROP_WITH_CHILDREN.has(tagName)) {
        if (!selfClosing && tagName !== 'EMBED') {
          i = findMatchingDropClose(normalized, i, tagName)
        }
        continue
      }

      if (!ALLOWED_TAGS.has(tagName)) {
        // Unwrap unknown/disallowed container tag while keeping safe inner text/children
        continue
      }

      if (AUTO_CLOSE_P_BEFORE.has(tagName) && openStack.includes('P')) {
        closeTagOnStack('P')
      }

      const serialized = serializeSanitizedOpenTag(tagName, attrs)
      if (serialized === null) {
        continue
      }

      output.push(serialized)
      if (!VOID_TAGS.has(tagName) && !selfClosing) {
        openStack.push(tagName)
      }
      continue
    }

    // Bare '<' (e.g. "tolerance < 0.02mm")
    output.push('&lt;')
    i = lt + 1
  }

  while (openStack.length > 0) {
    const top = openStack.pop()!
    output.push(`</${top.toLowerCase()}>`)
  }

  return output.join('')
}
