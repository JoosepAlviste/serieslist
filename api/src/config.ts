import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { config as dotenvConfig } from 'dotenv'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
dotenvConfig({
  path: path.resolve(__dirname, '..', '..', '.env'),
})

type Environment = 'development' | 'test' | 'production'

/* eslint-disable @typescript-eslint/no-non-null-assertion */
export const config = {
  environment: (process.env.NODE_ENV ?? 'production') as Environment,

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

  webapp: {
    host: process.env.APP_HOST!,
    url: process.env.APP_URL!,
  },

  tmdb: {
    url: 'https://api.themoviedb.org',
    apiToken: process.env.TMDB_API_TOKEN!,
  },
}
