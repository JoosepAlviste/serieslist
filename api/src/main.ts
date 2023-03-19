import { config } from '@/config.js'

import { server } from './server.js'

server.listen(config.port, () => {
  console.info(`Server is running on http://localhost:${config.port}/graphql`)
})
