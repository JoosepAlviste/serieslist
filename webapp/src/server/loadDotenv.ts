import path from 'node:path'

import { config } from 'dotenv'
import { expand } from 'dotenv-expand'

import { root } from './root.js'

const env = config({
  path: path.resolve(root, '..', '.env'),
})
expand(env)
