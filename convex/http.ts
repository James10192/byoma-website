import { httpRouter } from 'convex/server'
import { httpAction } from './_generated/server'
import { createAuth } from './auth'

const http = httpRouter()

const corsHeaders = (origin: string | null) => ({
  'Access-Control-Allow-Origin': origin ?? '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
  'Access-Control-Allow-Credentials': 'true',
})

http.route({
  pathPrefix: '/api/auth/',
  method: 'GET',
  handler: httpAction(async (ctx, request) => createAuth(ctx).handler(request)),
})

http.route({
  pathPrefix: '/api/auth/',
  method: 'POST',
  handler: httpAction(async (ctx, request) => createAuth(ctx).handler(request)),
})

http.route({
  pathPrefix: '/api/auth/',
  method: 'OPTIONS',
  handler: httpAction(async (_ctx, request) =>
    new Response(null, {
      status: 204,
      headers: corsHeaders(request.headers.get('Origin')),
    }),
  ),
})

export default http
