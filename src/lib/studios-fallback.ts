import type { StudioSummary } from '../components/studios/studio-card'

/**
 * Contenu vitrine statique des 3 résidences (miroir du seed Convex).
 * Sert au rendu SSR / premier paint pour un affichage instantané et le SEO ;
 * les données Convex temps réel prennent le relais dès qu'elles sont chargées.
 * À synchroniser si le catalogue change dans convex/studios.ts.
 */
export const FALLBACK_STUDIOS: StudioSummary[] = [
  {
    slug: 'studio-standard',
    name: 'Studio Standard',
    shortDescription: 'Confort essentiel dans un cadre propre et sécurisé.',
    category: 'standard',
    pricePerDay: 25000,
    photos: ['/images/25k/1.jpg'],
    maxGuests: 2,
  },
  {
    slug: 'studio-premium',
    name: 'Studio Premium',
    shortDescription: 'Élégance et confort supérieur, avec Canal+.',
    category: 'premium',
    pricePerDay: 45000,
    photos: ['/images/45k/1.jpg'],
    maxGuests: 2,
  },
  {
    slug: 'appartement-2-pieces-premium',
    name: 'Appartement 2 Pièces Premium',
    shortDescription: 'Espace et luxe, avec baignoire et Canal+.',
    category: 'appartement',
    pricePerDay: 60000,
    photos: ['/images/60k/1.jpg'],
    maxGuests: 3,
  },
]
