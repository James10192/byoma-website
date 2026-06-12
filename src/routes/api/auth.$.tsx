import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: ({ request }: { request: Request }) => {
        const convexSiteUrl = process.env.VITE_CONVEX_SITE_URL ?? process.env.CONVEX_SITE_URL ?? ''
        const url = request.url.replace(new URL(request.url).origin, convexSiteUrl)
        return fetch(url, { method: 'GET', headers: request.headers })
      },
      POST: async ({ request }: { request: Request }) => {
        const convexSiteUrl = process.env.VITE_CONVEX_SITE_URL ?? process.env.CONVEX_SITE_URL ?? ''
        const url = request.url.replace(new URL(request.url).origin, convexSiteUrl)
        return fetch(url, { method: 'POST', headers: request.headers, body: request.body })
      },
    },
  },
})
