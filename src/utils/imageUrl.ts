/**
 * Utility to resolve product image URLs.
 * Maps Shopify CDN cutout images to the locally bundled high-res transparent assets
 * to ensure 100% offline and network reliability in local dev and staging.
 */
export function formatProductImageUrl(url?: string | null): string {
  if (!url) return ''

  // Match any webp file from Shopify CDN
  const match = url.match(/\/([^/?#]+\.webp)/)
  if (match && match[1]) {
    return `/product-images/${match[1]}`
  }

  return url
}
