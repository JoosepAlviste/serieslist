import cookie, { type FastifyCookieOptions } from '@fastify/cookie'
import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import fastify, { type FastifyServerOptions } from 'fastify'

import { config } from '@/config'

import { log } from './logger'

const envToLogger: Record<string, FastifyServerOptions['logger']> = {
  development: log,
  production: log,
  test: false,
}

export const app = fastify({
  logger: envToLogger[config.environment] ?? true,
})

await app.register(cookie, {
  secret: config.secretToken,
  parseOptions: {},
} as FastifyCookieOptions)

await app.register(cors, {
  credentials: true,
  origin: [config.webapp.url],
})

if (config.environment !== 'test') {
  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  })
}
