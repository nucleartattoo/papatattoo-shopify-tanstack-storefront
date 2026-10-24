import dns from 'node:dns'
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// Ensure Node SSR and server functions resolve Shopify domain accurately in local dev environments
try {
  const originalLookup = dns.lookup
  dns.setServers(['223.5.5.5', '8.8.8.8', '1.1.1.1'])
  ;(dns as any).lookup = function (hostname: any, options: any, callback: any) {
    if (typeof options === 'function') {
      callback = options
      options = {}
    }
    if (typeof hostname === 'string' && hostname.includes('shopify.com')) {
      dns.resolve4(hostname, (err, addrs) => {
        if (!err && addrs && addrs.length) {
          if (options && options.all) {
            return callback(null, addrs.map((a) => ({ address: a, family: 4 })))
          }
          return callback(null, addrs[0], 4)
        }
        return originalLookup(hostname, options, callback)
      })
    } else {
      return originalLookup(hostname, options, callback)
    }
  }
} catch {}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tanstackStart(),
    viteReact(),
    tailwindcss(),
  ],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@tanstack/react-query'],
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react/') || id.includes('react-dom/')) {
              return 'vendor-react'
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons'
            }
            if (id.includes('@radix-ui')) {
              return 'vendor-radix'
            }
          }
        },
      },
    },
  },
})