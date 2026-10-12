/**
 * Utility to resolve product image URLs.
 * Maps Shopify CDN cutout images to the locally bundled high-res transparent assets
 * to ensure 100% offline and network reliability in local dev and staging.
 */
const SHOPIFY_DUPLICATE_SUFFIX = /_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(?=\.webp$)/i

export function formatProductImageUrl(url?: string | null): string {
  if (!url) return ''

  // Match any webp file from Shopify CDN
  const match = url.match(/\/([^/?#]+\.webp)/)
  if (match && match[1]) {
    // Shopify appends a UUID when a filename already exists. Local assets keep the original name.
    const filename = match[1].replace(SHOPIFY_DUPLICATE_SUFFIX, '')
    return `/product-images/${filename}`
  }

  return url
}
