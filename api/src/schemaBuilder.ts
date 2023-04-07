import SchemaBuilder from '@pothos/core'
import TracingPlugin, {
  wrapResolver,
  isRootField,
} from '@pothos/plugin-tracing'

import { type Context } from './types/context'

export const builder = new SchemaBuilder<{ Context: Context }>({
  plugins: [TracingPlugin],
  tracing: {
    default: (config) => isRootField(config),
    wrap: (resolver, _options, config) =>
      wrapResolver(resolver, (_error, duration) => {
        if (process.env.NODE_ENV !== 'test') {
          console.log(
            `Executed resolver ${config.parentType}.${config.name} in ${duration}ms`,
          )
        }
      }),
  },
})
