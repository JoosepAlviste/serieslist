import { config } from '#/config'

import { generateSchema } from './lib/writeGraphQLSchema'
import { app } from './server'

await app.listen({ port: config.port, host: '0.0.0.0' })

if (process.env.NODE_ENV === 'development') {
  // This should be only run in development and tree shaken in production
  await generateSchema()
}
