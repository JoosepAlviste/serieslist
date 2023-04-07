import { config } from '@/config'

import { server } from './server'

server.listen(config.port, () => {
  console.info(`Server is running on http://localhost:${config.port}/graphql`)
})
