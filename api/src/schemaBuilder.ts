import SchemaBuilder from '@pothos/core'
import ErrorsPlugin from '@pothos/plugin-errors'
import TracingPlugin, {
  wrapResolver,
  isRootField,
} from '@pothos/plugin-tracing'
import ValidationPlugin from '@pothos/plugin-validation'

import { app } from './lib/fastify'
import { type Context } from './types/context'

export const builder = new SchemaBuilder<{ Context: Context }>({
  plugins: [TracingPlugin, ErrorsPlugin, ValidationPlugin],
  errorOptions: {
    defaultTypes: [],
    directResult: true,
  },
  tracing: {
    default: (config) => isRootField(config),
    wrap: (resolver, _options, config) =>
      wrapResolver(resolver, (_error, duration) => {
        if (process.env.NODE_ENV !== 'test') {
          app.log.info(
            `Executed resolver ${config.parentType}.${config.name} in ${duration}ms`,
          )
        }
      }),
  },
})
