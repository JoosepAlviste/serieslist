import { randomBytes } from 'node:crypto'

import type { AuthenticatedContext } from '@serieslist/core-graphql-server'

import { config } from '#/config'
import { usersService } from '#/features/users'

import type { IntegrationSettings } from './integrationSettings.types'

const getEnvPrefix = () => {
  return {
    production: 'prod',
    test: 'test',
    development: 'dev',
  }[config.environment]
}

const generateToken = (length: number) => {
  return `serieslist_${getEnvPrefix()}_${Buffer.from(randomBytes(length)).toString('hex')}`
}

export const generateIntegrationsToken = async ({
  ctx,
}: {
  ctx: AuthenticatedContext
}) => {
  const newToken = generateToken(32)

  await usersService.updateIntegrationsToken({
    ctx,
    userId: ctx.currentUser.id,
    integrationsToken: newToken,
  })

  return newToken
}

export const getIntegrationSettings = ({
  ctx,
}: {
  ctx: AuthenticatedContext
}): IntegrationSettings => {
  return {
    integrationToken: ctx.currentUser.integrationsToken,
  }
}
