const ALLOWED_TAGS = new Set([
  'A', 'B', 'BLOCKQUOTE', 'BR', 'CODE', 'DIV', 'EM', 'H1', 'H2', 'H3', 'H4',
  'HR', 'I', 'LI', 'OL', 'P', 'PRE', 'S', 'SPAN', 'STRONG', 'SUB', 'SUP',
  'TABLE', 'TBODY', 'TD', 'TH', 'THEAD', 'TR', 'U', 'UL',
])

const DROP_WITH_CHILDREN = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'FORM'])

const ALLOWED_ATTRIBUTES: Record<string, Set<string>> = {
  A: new Set(['href', 'title']),
  TD: new Set(['colspan', 'rowspan']),
  TH: new Set(['colspan', 'rowspan']),
}

function isSafeUrl(value: string): boolean {
  const trimmed = value.trim()
  if (trimmed.startsWith('#') || trimmed.startsWith('/')) return true
  try {
    const url = new URL(trimmed, 'https://example.invalid')
    return url.protocol === 'http:' || url.protocol === 'https:' || url.protocol === 'mailto:'
  } catch {
    return false
  }
}

function normalizeRawHtml(raw: string): string {
  if (!raw) return ''
  let text = raw

  // Extract inner HTML if wrapped by Magento PageBuilder container
  const pbMatch = text.match(/<div\s+data-content-type=["']html["'][^>]*>([\s\S]*?)<\/div>/i)
  if (pbMatch) {
    text = pbMatch[1].trim()
  }

  // Unescape HTML entities if it contains escaped HTML tags like &lt;p&gt; or &lt;br
  if (/&lt;[a-z/]/i.test(text)) {
    text = text
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&')

    // Double unescape for nested encoding (e.g. &amp;amp;)
    if (/&lt;[a-z/]/i.test(text)) {
      text = text
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, '&')
    }
  }

  return text.trim()
}

function basicSsrSanitize(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/\son\w+=\w+/gi, '')
}

export function sanitizeProductHtml(html: string): string {
  if (!html) return ''
  const normalized = normalizeRawHtml(html)
  if (!normalized) return ''

  if (typeof DOMParser === 'undefined') {
    return basicSsrSanitize(normalized)
  }

  const document = new DOMParser().parseFromString(normalized, 'text/html')

  const clean = (node: Node) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType !== 1) continue
      const element = child as Element

      if (DROP_WITH_CHILDREN.has(element.tagName)) {
        element.remove()
        continue
      }

      if (!ALLOWED_TAGS.has(element.tagName)) {
        element.replaceWith(...Array.from(element.childNodes))
        continue
      }

      for (const attribute of Array.from(element.attributes)) {
        const allowed = ALLOWED_ATTRIBUTES[element.tagName]
        const name = attribute.name.toLowerCase()
        if (!allowed?.has(name) || name.startsWith('on') || !isSafeUrl(attribute.value)) {
          element.removeAttribute(attribute.name)
        }
      }

      if (element.tagName === 'A') {
        element.setAttribute('rel', 'noopener noreferrer')
      }

      clean(element)
    }
  }

  clean(document.body)
  return document.body.innerHTML
}
