import SchemaBuilder from '@pothos/core'
import DataloaderPlugin from '@pothos/plugin-dataloader'
import ErrorsPlugin from '@pothos/plugin-errors'
import ScopeAuthPlugin from '@pothos/plugin-scope-auth'
import TracingPlugin, {
  wrapResolver,
  isRootField,
} from '@pothos/plugin-tracing'
import ValidationPlugin from '@pothos/plugin-validation'

import { type AuthenticatedContext, type Context } from '../types/context'

import { UnauthorizedError } from './errors'
import { log } from './logger'

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
    wrap: (resolver, _options, config) =>
      wrapResolver(resolver, (_error, duration) => {
        if (process.env.NODE_ENV !== 'test') {
          log.info(
            `Executed resolver ${config.parentType}.${config.name} in ${duration}ms`,
          )
        }
      }),
  },
})
