import { createAuthClient } from 'better-auth/react'
import { convexClient } from '@convex-dev/better-auth/client/plugins'

const convexSiteUrl =
  (import.meta.env.VITE_CONVEX_SITE_URL as string | undefined) ?? 'http://localhost:9999'

export const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
  fetchOptions: {
    customFetchImpl: async (url, init) => {
      const proxyUrl = url.toString().replace(convexSiteUrl, '')
      return fetch(proxyUrl, init)
    },
  },
  plugins: [convexClient()],
})

export const { signIn, signOut, useSession } = authClient
