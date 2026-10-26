import { bindings, defineConfig, triggers } from "cf/config";

export default defineConfig((ctx) => ({
  accountId: "2f53025c1c1d3b874bec5314c2f85f36",
  worker: {
    name: "papatattoo-shopify-tanstack-storefront",
    compatibilityDate: "2026-09-25",
    compatibilityFlags: ["nodejs_compat"],
    observability: {
      enabled: true,
      headSamplingRate: 1,
    },
    entrypoint: "@tanstack/react-start/server-entry",
    workersDev: true,
    triggers: [
      triggers.fetch({ pattern: "test.papatattoo.com/*", zone: "papatattoo.com" }),
    ],
    domains: ["test.papatattoo.com"],
    env: {
      VITE_SHOPIFY_STORE_DOMAIN: bindings.text("ftff5p-yr.myshopify.com"),
      VITE_SHOPIFY_STOREFRONT_PUBLIC_TOKEN: bindings.text("7cfda415ab91273e91e6e7b69f9789cf"),
      VITE_SHOPIFY_STOREFRONT_API_VERSION: bindings.text("2025-01"),
      SHOPIFY_STORE_DOMAIN: bindings.text("ftff5p-yr.myshopify.com"),
      SHOPIFY_API_VERSION: bindings.text("2025-01"),
      INQUIRY_RECIPIENT_EMAIL: bindings.text("papatattoosupply@gmail.com"),
      ...(ctx.mode === "development"
        ? {
            SHOPIFY_ADMIN_ACCESS_TOKEN: bindings.secret(),
            RESEND_API_KEY: bindings.secret(),
            INQUIRY_WEBHOOK_URL: bindings.secret(),
          }
        : {}),
    },
  },
}));
