import type { Config } from 'drizzle-kit'

import { config } from './src/lib/config'

export default {
  schema: './src/schema/index.ts',
  out: './src/drizzle',
  driver: 'pg',
  dbCredentials: {
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.db,
  },
} satisfies Config
