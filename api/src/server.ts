import { type FastifyRequest, type FastifyReply } from 'fastify'
import { createYoga } from 'graphql-yoga'

import { authService } from './features/auth'
import { db } from './lib/db'
import { app } from './lib/fastify'
import { schema } from './schema'
import { type Context } from './types/context'

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
  context: async (ctx): Promise<Context> => {
    const context = {
      ...ctx,
      db,
    }

    const currentUser = await authService.getAuthenticatedUserAndRefreshTokens({
      ctx: context,
    })

    return {
      ...context,
      currentUser,
    }
  },
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
