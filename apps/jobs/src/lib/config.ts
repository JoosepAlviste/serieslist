import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { config as dotenvConfig } from 'dotenv'

const dirname = fileURLToPath(new URL('.', import.meta.url))
dotenvConfig({
  path: path.resolve(dirname, '..', '..', '..', '..', '.env'),
})

type Environment = 'development' | 'test' | 'production'

const environment = (process.env.NODE_ENV ?? 'production') as Environment

/* eslint-disable @typescript-eslint/no-non-null-assertion */
export const config = {
  redis: {
    host: process.env.REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT!),
    password: process.env.REDIS_PASSWORD!,
  },

  tracing: {
    enabled: environment === 'production',
  },
}
