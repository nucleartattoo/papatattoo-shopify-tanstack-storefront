import { defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    name: "papatattoo-shopify-tanstack-storefront",
    compatibilityDate: "2026-09-25",
    observability: {
      enabled: true
    },
    entrypoint: "@tanstack/react-start/server-entry"
  }
});
