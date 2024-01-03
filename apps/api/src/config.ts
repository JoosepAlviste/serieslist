import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { config as dotenvConfig } from 'dotenv'
import { expand } from 'dotenv-expand'

const dirname = fileURLToPath(new URL('.', import.meta.url))
const env = dotenvConfig({
  path: path.resolve(dirname, '..', '..', '..', '.env'),
})
expand(env)

type Environment = 'development' | 'test' | 'production'

const environment = (process.env.NODE_ENV ?? 'production') as Environment

/* eslint-disable @typescript-eslint/no-non-null-assertion */
export const config = {
  environment,
  isProduction: environment === 'production',

  port: parseInt(process.env.API_PORT ?? '4000', 10),

  secretToken: process.env.SECRET_TOKEN!,

  debug: {
    logSqlQueries: process.env.API_LOG_SQL_QUERIES === 'true',
  },

  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT!, 10),
    db: process.env.DB_DB,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },

  redis: {
    host: process.env.REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT!),
    password: process.env.REDIS_PASSWORD!,
  },

  webapp: {
    host: process.env.APP_HOST!,
    url: process.env.APP_URL!,
  },

  tmdb: {
    url: process.env.TMDB_URL!,
    apiToken: process.env.TMDB_API_TOKEN!,
  },

  sentry: {
    enabled: process.env.NODE_ENV === 'production',
    dsn: process.env.API_SENTRY_DSN!,
  },
}
