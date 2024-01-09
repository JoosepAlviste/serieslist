import { watchFile } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { generate } from '@graphql-codegen/cli'

import codegenConfig from '../../codegen'

import { log } from './logger'

const dirname = fileURLToPath(new URL('.', import.meta.url))
const schemaPath = join(
  dirname,
  '..',
  '..',
  '..',
  'api',
  'src',
  'generated',
  'schema.graphql',
)

const generateGraphQLTypes = async () => {
  await generate({
    ...codegenConfig,
    silent: true,
    verbose: false,
    debug: false,
  })

  log.info('GraphQL Code Generator ran successfully!')
}

export const watchGraphQLSchema = async () => {
  await generateGraphQLTypes()

  watchFile(schemaPath, generateGraphQLTypes)
}
