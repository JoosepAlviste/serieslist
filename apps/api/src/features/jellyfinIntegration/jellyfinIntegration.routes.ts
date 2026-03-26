import type { User } from '@serieslist/core-db'
import type { AuthenticatedContext } from '@serieslist/core-graphql-server'
import type { FastifyReply, FastifyRequest } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

import { db } from '#/lib/db'
import { log } from '#/lib/logger'
import type { app as appType } from '#/server'

import { usersService } from '../users'

import * as jellyfinIntegrationService from './jellyfinIntegration.service'
import { jellyfinWebhookBodySchema } from './jellyfinIntegration.types'

const createAuthContext = ({
  currentUser,
  reply,
  req,
}: {
  currentUser: User
  reply: FastifyReply
  req: FastifyRequest
}): AuthenticatedContext => ({
  db,
  currentUser,
  waitUntil: () => {},
  params: {},
  reply,
  req,
})

export const registerJellyfinIntegrationRoutes = (app: typeof appType) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/api/jellyfin-webhook',
    {
      schema: {
        body: jellyfinWebhookBodySchema,
        headers: z.object({
          authorization: z.string(),
        }),
      },
    },
    async (req, reply) => {
      req.log.info({ request: req.body }, 'incoming jellyfin webhook request')

      const user = await usersService.findOne({
        ctx: { db },
        integrationsToken: req.headers.authorization,
      })

      if (!user) {
        log.info(
          {},
          '[jellyfin webhook] did not find user with integration token',
        )

        return
      }

      const ctx = createAuthContext({
        currentUser: user,
        req,
        reply,
      })

      await jellyfinIntegrationService.markEpisodeAsSeen({
        ctx,
        webhookBody: req.body,
      })

      return {}
    },
  )
}
