import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const checkAvailability = query({
  args: {
    studioId: v.id('studios'),
    checkIn: v.string(),
    checkOut: v.string(),
  },
  handler: async (ctx, { studioId, checkIn, checkOut }) => {
    const conflicts = await ctx.db
      .query('reservations')
      .withIndex('by_studio', (q) => q.eq('studioId', studioId))
      .filter((q) =>
        q.and(
          q.neq(q.field('status'), 'refused'),
          q.neq(q.field('status'), 'cancelled'),
          q.lt(q.field('checkIn'), checkOut),
          q.gt(q.field('checkOut'), checkIn),
        ),
      )
      .collect()

    const blocked = await ctx.db
      .query('blockedPeriods')
      .withIndex('by_studio', (q) => q.eq('studioId', studioId))
      .filter((q) =>
        q.and(
          q.lt(q.field('startDate'), checkOut),
          q.gt(q.field('endDate'), checkIn),
        ),
      )
      .collect()

    return { available: conflicts.length === 0 && blocked.length === 0 }
  },
})

export const getBookedDates = query({
  args: { studioId: v.id('studios') },
  handler: async (ctx, { studioId }) => {
    const reservations = await ctx.db
      .query('reservations')
      .withIndex('by_studio', (q) => q.eq('studioId', studioId))
      .filter((q) =>
        q.and(
          q.neq(q.field('status'), 'refused'),
          q.neq(q.field('status'), 'cancelled'),
        ),
      )
      .collect()

    const blocked = await ctx.db
      .query('blockedPeriods')
      .withIndex('by_studio', (q) => q.eq('studioId', studioId))
      .collect()

    return {
      reservations: reservations.map((r) => ({ checkIn: r.checkIn, checkOut: r.checkOut, status: r.status })),
      blocked: blocked.map((b) => ({ startDate: b.startDate, endDate: b.endDate })),
    }
  },
})

export const create = mutation({
  args: {
    studioId: v.id('studios'),
    clientName: v.string(),
    clientPhone: v.string(),
    clientEmail: v.optional(v.string()),
    checkIn: v.string(),
    checkOut: v.string(),
    totalDays: v.number(),
    totalPrice: v.number(),
    clientMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const conflicts = await ctx.db
      .query('reservations')
      .withIndex('by_studio', (q) => q.eq('studioId', args.studioId))
      .filter((q) =>
        q.and(
          q.neq(q.field('status'), 'refused'),
          q.neq(q.field('status'), 'cancelled'),
          q.lt(q.field('checkIn'), args.checkOut),
          q.gt(q.field('checkOut'), args.checkIn),
        ),
      )
      .collect()

    if (conflicts.length > 0) {
      throw new Error('Ces dates ne sont plus disponibles.')
    }

    const now = Date.now()
    return ctx.db.insert('reservations', {
      ...args,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const listAll = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, { status }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Non autorisé')

    let q = ctx.db.query('reservations').withIndex('by_created')
    const results = await q.order('desc').collect()

    if (status) {
      return results.filter((r) => r.status === status)
    }
    return results
  },
})

export const updateStatus = mutation({
  args: {
    id: v.id('reservations'),
    status: v.union(
      v.literal('confirmed'),
      v.literal('refused'),
      v.literal('cancelled'),
    ),
    adminNotes: v.optional(v.string()),
  },
  handler: async (ctx, { id, status, adminNotes }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Non autorisé')

    await ctx.db.patch(id, { status, adminNotes, updatedAt: Date.now() })
  },
})

export const blockPeriod = mutation({
  args: {
    studioId: v.id('studios'),
    startDate: v.string(),
    endDate: v.string(),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Non autorisé')

    return ctx.db.insert('blockedPeriods', { ...args, createdAt: Date.now() })
  },
})

export const unblockPeriod = mutation({
  args: { id: v.id('blockedPeriods') },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Non autorisé')

    await ctx.db.delete(id)
  },
})

export const getBlockedPeriods = query({
  args: { studioId: v.optional(v.id('studios')) },
  handler: async (ctx, { studioId }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Non autorisé')

    if (studioId) {
      return ctx.db
        .query('blockedPeriods')
        .withIndex('by_studio', (q) => q.eq('studioId', studioId))
        .collect()
    }
    return ctx.db.query('blockedPeriods').collect()
  },
})
