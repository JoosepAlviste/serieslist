import { builder, UnauthorizedError } from '@serieslist/core-graphql-server'

import type { IntegrationSettings } from './integrationSettings.types'
import {
  generateIntegrationsToken,
  getIntegrationSettings,
} from './jellyfinIntegration.service'

export const IntegrationSettingsRef = builder.objectRef<IntegrationSettings>(
  'IntegrationSettings',
)

builder.objectType(IntegrationSettingsRef, {
  fields: (t) => ({
    integrationToken: t.exposeString('integrationToken', {
      nullable: true,
    }),
  }),
})

builder.queryFields((t) => ({
  integrationSettings: t.authField({
    type: IntegrationSettingsRef,
    authScopes: {
      authenticated: true,
    },
    errors: {
      types: [UnauthorizedError],
    },
    resolve: (_parent, _args, ctx) => {
      return getIntegrationSettings({ ctx })
    },
  }),
}))

builder.mutationFields((t) => ({
  generateToken: t.authField({
    type: IntegrationSettingsRef,
    authScopes: {
      authenticated: true,
    },
    errors: {
      types: [UnauthorizedError],
    },
    resolve: async (_parent, _args, ctx) => {
      return {
        integrationToken: await generateIntegrationsToken({ ctx }),
      }
    },
  }),
}))
