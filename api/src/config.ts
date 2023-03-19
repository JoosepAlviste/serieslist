import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { config as dotenvConfig } from 'dotenv'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
dotenvConfig({
  path: path.resolve(__dirname, '..', '..', '.env'),
})

export const config = {
  port: parseInt(process.env.API_PORT ?? '4000', 10),
}
