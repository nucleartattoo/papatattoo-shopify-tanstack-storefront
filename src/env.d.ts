/// <reference types="vite/client" />
import type { InferEnv, UnwrapConfig } from 'cf/config'
import type cloudflareConfig from '../cloudflare.config'

type ResolvedCloudflareConfig = UnwrapConfig<typeof cloudflareConfig>
type ResolvedWorkerConfig = UnwrapConfig<ResolvedCloudflareConfig['worker']>

export type WorkerEnv = InferEnv<ResolvedWorkerConfig>

interface ImportMetaEnv {
  readonly VITE_SHOPIFY_STORE_DOMAIN?: string
  readonly VITE_SHOPIFY_STOREFRONT_PUBLIC_TOKEN?: string
  readonly VITE_SHOPIFY_STOREFRONT_API_VERSION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
