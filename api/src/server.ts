import { createServer } from 'http'

import { createYoga } from 'graphql-yoga'

import { db } from './lib/db'
import { schema } from './schema'
import { type Context } from './types/context'

export const yoga = createYoga({
  schema,
  context: (): Context => ({
    db,
  }),
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
export const server = createServer(yoga)
