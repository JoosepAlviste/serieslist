import fastify, {
  type FastifyRequest,
  type FastifyReply,
  type FastifyServerOptions,
} from 'fastify'
import { createYoga } from 'graphql-yoga'

import { config } from './config'
import { db } from './lib/db'
import { schema } from './schema'
import { type Context } from './types/context'

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

const app = fastify({
  logger: envToLogger[config.environment] ?? true,
})

export const yoga = createYoga<{
  req: FastifyRequest
  reply: FastifyReply
}>({
  logging: {
    debug: (...args) => args.forEach((arg) => app.log.debug(arg)),
    info: (...args) => args.forEach((arg) => app.log.info(arg)),
    warn: (...args) => args.forEach((arg) => app.log.warn(arg)),
    error: (...args) => args.forEach((arg) => app.log.error(arg)),
  },
  schema,
  context: (ctx): Context => ({
    ...ctx,
    db,
  }),
})

app.route({
  url: '/graphql',
  method: ['GET', 'POST', 'OPTIONS'],
  handler: async (req, reply) => {
    const response = await yoga.handleNodeRequest(req, {
      req,
      reply,
    })
    response.headers.forEach((value, key) => {
      void reply.header(key, value)
    })

    void reply.status(response.status)
    void reply.send(response.body)

    return reply
  },
})

export { app }
