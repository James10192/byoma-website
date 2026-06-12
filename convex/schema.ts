import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  admins: defineTable({
    authId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_authId', ['authId'])
    .index('by_email', ['email']),

  studios: defineTable({
    slug: v.string(),
    name: v.string(),
    category: v.union(
      v.literal('standard'),
      v.literal('premium'),
      v.literal('appartement'),
    ),
    pricePerDay: v.number(),
    description: v.string(),
    shortDescription: v.string(),
    amenities: v.array(v.string()),
    photos: v.array(v.string()),
    maxGuests: v.number(),
    order: v.number(),
    active: v.boolean(),
  })
    .index('by_slug', ['slug'])
    .index('by_category', ['category'])
    .index('by_order', ['order']),

  reservations: defineTable({
    studioId: v.id('studios'),
    clientName: v.string(),
    clientPhone: v.string(),
    clientEmail: v.optional(v.string()),
    checkIn: v.string(),
    checkOut: v.string(),
    totalDays: v.number(),
    totalPrice: v.number(),
    status: v.union(
      v.literal('pending'),
      v.literal('confirmed'),
      v.literal('refused'),
      v.literal('cancelled'),
    ),
    adminNotes: v.optional(v.string()),
    clientMessage: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_studio', ['studioId'])
    .index('by_status', ['status'])
    .index('by_checkin', ['checkIn'])
    .index('by_created', ['createdAt']),

  blockedPeriods: defineTable({
    studioId: v.id('studios'),
    startDate: v.string(),
    endDate: v.string(),
    reason: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_studio', ['studioId'])
    .index('by_studio_dates', ['studioId', 'startDate']),
})
