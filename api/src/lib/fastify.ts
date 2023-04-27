import cookie, { type FastifyCookieOptions } from '@fastify/cookie'
import cors from '@fastify/cors'
import fastify, { type FastifyServerOptions } from 'fastify'

import { config } from '@/config'

const envToLogger: Record<string, FastifyServerOptions['logger']> = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  production: true,
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
