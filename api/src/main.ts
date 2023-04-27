import { config } from '@/config'

import { app } from './server'

await app.listen({ port: config.port })
