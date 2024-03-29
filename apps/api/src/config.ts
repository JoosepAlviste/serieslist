import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { config as dotenvConfig } from 'dotenv'

const dirname = fileURLToPath(new URL('.', import.meta.url))
dotenvConfig({
  path: path.resolve(dirname, '..', '..', '..', '.env'),
})

type Environment = 'development' | 'test' | 'production'

const environment = (process.env.NODE_ENV ?? 'production') as Environment

/* eslint-disable @typescript-eslint/no-non-null-assertion */
export const config = {
  environment,
  isProduction: environment === 'production',

  port: parseInt(process.env.API_PORT ?? '4000', 10),

  secretToken: process.env.SECRET_TOKEN!,

  webapp: {
    host: process.env.APP_HOST!,
    url: process.env.APP_URL!,
  },

  sentry: {
    enabled: process.env.NODE_ENV === 'production',
    dsn: process.env.API_SENTRY_DSN!,
  },
}
