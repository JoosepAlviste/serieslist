import SchemaBuilder from '@pothos/core'
import DataloaderPlugin from '@pothos/plugin-dataloader'
import ErrorsPlugin from '@pothos/plugin-errors'
import ScopeAuthPlugin from '@pothos/plugin-scope-auth'
import TracingPlugin, { isRootField } from '@pothos/plugin-tracing'
import ValidationPlugin from '@pothos/plugin-validation'
import { createOpenTelemetryWrapper } from '@pothos/tracing-opentelemetry'

import type { AuthenticatedContext, Context } from '../types/context'

import { UnauthorizedError } from './errors'
import { tracer } from './tracer'

const createSpan = createOpenTelemetryWrapper(tracer, {
  includeSource: true,
})

export const builder = new SchemaBuilder<{
  Context: Context
  AuthScopes: {
    authenticated: boolean
    admin: boolean
  }
  AuthContexts: {
    authenticated: AuthenticatedContext
    admin: AuthenticatedContext
  }
  Scalars: {
    Date: {
      Input: string
      Output: string
    }
  }
}>({
  plugins: [
    TracingPlugin,
    ErrorsPlugin,
    ScopeAuthPlugin,
    DataloaderPlugin,
    ValidationPlugin,
  ],
  authScopes: (context) => ({
    authenticated: !!context.currentUser,
    admin: !!context.currentUser?.isAdmin,
  }),
  scopeAuthOptions: {
    unauthorizedError: () => new UnauthorizedError(),
  },
  errorOptions: {
    defaultTypes: [],
    directResult: true,
  },
  tracing: {
    default: (config) => isRootField(config),
    wrap: (resolver, options) => createSpan(resolver, options),
  },
})
