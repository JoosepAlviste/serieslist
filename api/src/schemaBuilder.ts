import SchemaBuilder from '@pothos/core'
import TracingPlugin, {
  wrapResolver,
  isRootField,
} from '@pothos/plugin-tracing'

export const builder = new SchemaBuilder({
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
