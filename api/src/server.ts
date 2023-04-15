import express from 'express'
import { createYoga } from 'graphql-yoga'

import { db } from './lib/db'
import { schema } from './schema'
import { type Context } from './types/context'

export const yoga = createYoga({
  schema,
  context: (ctx): Context => ({
    ...ctx,
    db,
  }),
})

const app = express()
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.use('/graphql', yoga)

export { app }
