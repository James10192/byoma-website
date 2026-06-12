# BYOMA — Résidences meublées

Site vitrine et moteur de réservation pour des résidences meublées (studios) à louer à la journée.
Catalogue public, fiches détaillées avec galerie, calendrier de disponibilités en temps réel, et back-office admin pour gérer réservations et disponibilités.

## Stack

- **TanStack Start** (React 19, SSR via Nitro) + **Vite**
- **Convex** — base de données temps réel (catalogue, réservations, disponibilités)
- **Better Auth** (`@convex-dev/better-auth`) — authentification admin, store unique sur Convex
- **Tailwind CSS v4** — thème éditorial (Fraunces + Hanken Grotesk, palette espresso / ivoire / doré)
- **GSAP** + `@gsap/react` — couche de mouvement (révélations au scroll, parallaxe desktop, cascades), SSR-safe et `prefers-reduced-motion`

## Développement

```bash
pnpm install
pnpm dev          # serveur de dev
pnpm build        # build de production (sortie Nitro)
npx convex dev    # backend Convex en local
```

### Variables d'environnement

Copier les variables Convex / Better Auth dans `.env.local` (non versionné) :

- `VITE_CONVEX_URL`, `VITE_CONVEX_SITE_URL`
- `BETTER_AUTH_SECRET`, `SITE_URL` (côté Convex)

## Architecture

- Moteur anti-chevauchement : une réservation ne peut recouvrir une plage déjà occupée (vérification de disponibilité côté Convex).
- Pages publiques (`/`, `/studios`, `/studios/$slug`) en SSR ; back-office (`/admin/*`) protégé par Better Auth.
