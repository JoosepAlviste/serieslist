import cookie, { type FastifyCookieOptions } from '@fastify/cookie'
import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import { getLoggerByEnvironment } from '@serieslist/core-logger'
import fastify from 'fastify'

import { config } from '#/config'

import { log } from './logger'

export const app = fastify({
  logger: getLoggerByEnvironment(log),
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
