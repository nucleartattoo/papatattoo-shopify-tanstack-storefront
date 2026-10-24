import React from 'react'
import {
  QueryClient,
  QueryClientProvider,
  dehydrate,
  hydrate,
  type DehydratedState,
} from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export interface RouterContext {
  queryClient: QueryClient
}

export function getRouter() {
  // Fresh QueryClient per SSR request prevents cross-request state leaks on Cloudflare Workers
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
      },
    },
  })

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    dehydrate: () => ({
      queryClientState: JSON.parse(JSON.stringify(dehydrate(queryClient))) as Record<
        string,
        string | number | boolean | null
      >,
    }),
    hydrate: (dehydrated) => {
      hydrate(queryClient, dehydrated.queryClientState as unknown as DehydratedState)
    },
    Wrap: ({ children }) =>
      React.createElement(QueryClientProvider, { client: queryClient }, children),
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
