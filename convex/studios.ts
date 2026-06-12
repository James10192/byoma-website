import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const list = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query('studios')
      .withIndex('by_order')
      .filter((q) => q.eq(q.field('active'), true))
      .collect()
  },
})

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return ctx.db.query('studios')
      .withIndex('by_slug', (q) => q.eq('slug', slug))
      .unique()
  },
})

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query('studios').take(1)
    if (existing.length > 0) return 'already seeded'

    const studios = [
      {
        slug: 'studio-standard',
        name: 'Studio Standard',
        category: 'standard' as const,
        pricePerDay: 25000,
        description: 'Notre studio standard offre tout le confort nécessaire pour un séjour agréable à Abidjan. Idéal pour les courts comme les longs séjours, il dispose de tout l\'équipement moderne dans un cadre propre et sécurisé.',
        shortDescription: 'Confort essentiel dans un cadre propre et sécurisé',
        amenities: ['Internet WiFi', 'Table à manger', 'Lit 2 places orthopédique', 'Climatisation split', 'Cuisine équipée (ustensiles, gazinière, réfrigérateur)', 'Parking sécurisé', 'Service de ménage', 'Vigile 24h/24'],
        photos: ['/images/25k/1.jpg', '/images/25k/2.jpg', '/images/25k/3.jpg', '/images/25k/4.jpg', '/images/25k/5.jpg'],
        maxGuests: 2,
        order: 1,
        active: true,
      },
      {
        slug: 'studio-premium',
        name: 'Studio Premium',
        category: 'premium' as const,
        pricePerDay: 45000,
        description: 'Le Studio Premium élève votre séjour à Abidjan avec des finitions soignées et des équipements supplémentaires. Profitez de votre abonnement Canal+ pour vous divertir dans un espace raffiné.',
        shortDescription: 'Élégance et confort supérieur avec Canal+',
        amenities: ['Abonnement Canal+', 'Internet WiFi', 'Lit 2 places orthopédique', 'Climatisation split', 'Cuisine équipée (ustensiles, gazinière, réfrigérateur)', 'Parking sécurisé', 'Service de ménage', 'Vigile 24h/24'],
        photos: ['/images/45k/1.jpg', '/images/45k/2.jpg', '/images/45k/3.jpg', '/images/45k/4.jpg', '/images/45k/5.jpg', '/images/45k/6.jpg', '/images/45k/7.jpg'],
        maxGuests: 2,
        order: 2,
        active: true,
      },
      {
        slug: 'appartement-2-pieces-premium',
        name: 'Appartement 2 Pièces Premium',
        category: 'appartement' as const,
        pricePerDay: 60000,
        description: 'Notre appartement deux pièces premium représente le summum du confort à Les Résidences BYOMA. Avec sa baignoire, son abonnement Canal+ et ses espaces généreux, il est pensé pour ceux qui ne veulent rien sacrifier.',
        shortDescription: 'Espace et luxe avec baignoire et Canal+',
        amenities: ['Abonnement Canal+', 'Baignoire', 'Internet WiFi', 'Lit 2 places orthopédique', 'Climatisation split', 'Cuisine équipée (ustensiles, gazinière, réfrigérateur)', 'Parking sécurisé', 'Service de ménage', 'Vigile 24h/24'],
        photos: ['/images/60k/1.jpg', '/images/60k/2.jpg', '/images/60k/3.jpg', '/images/60k/4.jpg', '/images/60k/5.jpg', '/images/60k/6.jpg', '/images/60k/7.jpg'],
        maxGuests: 3,
        order: 3,
        active: true,
      },
    ]

    for (const s of studios) {
      await ctx.db.insert('studios', s)
    }
    return 'seeded'
  },
})
