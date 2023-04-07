import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { config as dotenvConfig } from 'dotenv'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
dotenvConfig({
  path: path.resolve(__dirname, '..', '..', '.env'),
})

/* eslint-disable @typescript-eslint/no-non-null-assertion */
export const config = {
  port: parseInt(process.env.API_PORT ?? '4000', 10),

  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT!, 10),
    db: process.env.DB_DB,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
}
