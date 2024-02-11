import path from 'node:path'

import { config } from 'dotenv'

import { root } from './root.js'

config({
  path: path.resolve(root, '../..', '.env'),
})
