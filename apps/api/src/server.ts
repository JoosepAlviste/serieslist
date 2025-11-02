import { useSentry } from '@envelop/sentry'
import { EnvelopArmorPlugin } from '@escape.tech/graphql-armor'
import type { Context } from '@serieslist/core-graphql-server'
import type { FastifyRequest, FastifyReply } from 'fastify'
import { createYoga } from 'graphql-yoga'

import { config } from './config'
import { authService } from './features/auth'
import { db } from './lib/db'
import { app } from './lib/fastify'
import { log } from './lib/logger'
import { schema } from './schema'

import '#/lib/initSentry'

export const yoga = createYoga<{
  req: FastifyRequest
  reply: FastifyReply
}>({
  plugins: [
    useSentry({
      includeResolverArgs: true,
      includeExecuteVariables: true,
    }),
    EnvelopArmorPlugin({
      blockFieldSuggestion: {
        enabled: config.environment === 'production',
      },
      maxDepth: {
        n: 10,
      },
    }),
  ],
  logging: {
    debug: (...args) => args.forEach(log.debug.bind(log)),
    info: (...args) => args.forEach(log.info.bind(log)),
    warn: (...args) => args.forEach(log.warn.bind(log)),
    error: (...args) => args.forEach(log.error.bind(log)),
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
  url: yoga.graphqlEndpoint,
  method: ['GET', 'POST', 'OPTIONS'],
  handler: (req, reply) =>
    yoga.handleNodeRequestAndResponse(req, reply, {
      req,
      reply,
    }),
})

export { app }
