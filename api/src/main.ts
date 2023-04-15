import { config } from '@/config'

import { app } from './server'

app.listen(config.port, () => {
  console.info(`Server is running on http://localhost:${config.port}/graphql`)
})
