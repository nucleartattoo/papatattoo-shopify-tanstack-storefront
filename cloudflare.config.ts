import { defineConfig } from "cf/config";

export default defineConfig({
  accountId: "2f53025c1c1d3b874bec5314c2f85f36",
  worker: {
    name: "papatattoo-shopify-tanstack-storefront",
    compatibilityDate: "2026-09-25",
    observability: {
      enabled: true
    },
    entrypoint: "@tanstack/react-start/server-entry",
    workersDev: true,
    triggers: [
      { type: "fetch", pattern: "test.genetattoo.com/*", zone: "genetattoo.com" }
    ],
    domains: ["beta.genetattoo.com"]
  }
});
