import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getProductByHandle, getProducts } from './shopify'

export const fetchStorefrontCatalog = createServerFn({ method: 'GET' }).handler(async () => {
  return await getProducts({ first: 100, language: 'EN' })
})

export const fetchStorefrontProduct = createServerFn({ method: 'GET' })
  .validator((input: { handle: string }) => ({
    handle: typeof input?.handle === 'string' ? input.handle.trim() : '',
  }))
  .handler(async ({ data }) => {
    if (!data.handle) return null
    return await getProductByHandle(data.handle)
  })

export const catalogQueryOptions = queryOptions({
  queryKey: ['shopify', 'catalog'],
  queryFn: () => fetchStorefrontCatalog(),
  staleTime: 5 * 60_000,
})

export const productByHandleQueryOptions = (handle: string) =>
  queryOptions({
    queryKey: ['shopify', 'product', handle],
    queryFn: () => fetchStorefrontProduct({ data: { handle } }),
    staleTime: 5 * 60_000,
  })
