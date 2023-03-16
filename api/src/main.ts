import { createServer } from 'node:http'
import { createYoga } from 'graphql-yoga'
import { schema } from './schema.js'

const yoga = createYoga({ schema })

// eslint-disable-next-line @typescript-eslint/no-misused-promises
const server = createServer(yoga)

server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql')
})
