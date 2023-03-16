import { createYoga } from 'graphql-yoga'
import { createServer } from 'http'
import { schema } from './schema.js'

export const yoga = createYoga({ schema })

// eslint-disable-next-line @typescript-eslint/no-misused-promises
export const server = createServer(yoga)
