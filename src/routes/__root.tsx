import '../react-global'
import { useEffect, useState } from 'react'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useLocation,
  useRouteContext,
} from '@tanstack/react-router'
import { ConvexProvider } from 'convex/react'
import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react'
import type { QueryClient } from '@tanstack/react-query'
import type { ConvexQueryClient } from '@convex-dev/react-query'
import appCss from '../styles/app.css?url'
import { SiteHeader } from '../components/layout/site-header'
import { SiteFooter } from '../components/layout/site-footer'
import { authClient } from '../lib/auth/auth-client'
import { isAdminPath } from '../lib/paths'

const SITE = {
  url: 'https://byoma-residences.vercel.app',
  name: 'Les Résidences BYOMA',
  title: 'Les Résidences BYOMA — Studios et Appartements Meublés à Abidjan',
  description:
    'Studios et appartements meublés haut de gamme à Cocody Angré, Abidjan. Courts et longs séjours dans un cadre propre, calme et sécurisé. Réservation en ligne disponible.',
}

interface RouterContext {
  queryClient: QueryClient
  convexQueryClient: ConvexQueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      { title: SITE.title },
      { name: 'description', content: SITE.description },
      { name: 'theme-color', content: '#15120B' },
      { name: 'format-detection', content: 'telephone=no' },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'fr_CI' },
      { property: 'og:site_name', content: SITE.name },
      { property: 'og:title', content: SITE.title },
      { property: 'og:description', content: SITE.description },
      { property: 'og:url', content: SITE.url },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LodgingBusiness',
          name: 'Les Résidences BYOMA',
          url: SITE.url,
          telephone: '+2250700255295',
          email: 'lesresidencesbyoma@byoma.ci',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Angré Djomi, derrière la pharmacie St Ambroise',
            addressLocality: 'Abidjan',
            addressRegion: 'Cocody',
            addressCountry: 'CI',
          },
        }),
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  const context = useRouteContext({ from: Route.id })
  return (
    <ConvexProviders client={context.convexQueryClient.convexClient}>
      <RootDocument>
        <Outlet />
      </RootDocument>
    </ConvexProviders>
  )
}

/**
 * Au SSR et au premier rendu client (hydratation), on utilise un ConvexProvider
 * simple, sûr pour le SSR : il ne déclenche pas les hooks Better Auth qui
 * cassent le rendu serveur (« more than one copy of React »). Une fois monté
 * côté client, on bascule sur le provider authentifié pour que les requêtes
 * admin disposent du jeton (ctx.auth). Aucun DOM n'est émis par ces providers,
 * donc pas de divergence d'hydratation.
 */
function ConvexProviders({
  client,
  children,
}: {
  client: React.ComponentProps<typeof ConvexProvider>['client']
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <ConvexProvider client={client}>{children}</ConvexProvider>
  }
  return (
    <ConvexBetterAuthProvider client={client} authClient={authClient}>
      {children}
    </ConvexBetterAuthProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const isAdmin = isAdminPath(location.pathname)
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        <a href="#main" className="skip-link">Aller au contenu</a>
        {!isAdmin && <SiteHeader />}
        <main id="main">
          {children}
        </main>
        {!isAdmin && <SiteFooter />}
        <Scripts />
      </body>
    </html>
  )
}
