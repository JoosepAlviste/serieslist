import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { printSchema } from 'graphql'

import { schema } from '#/schema'

import { log } from './logger'

export const generateSchema = async () => {
  const fileData = printSchema(schema)

  const dirname = fileURLToPath(new URL('.', import.meta.url))
  const destination = join(dirname, '..', 'generated', 'schema.graphql')

  await writeFile(destination, fileData)

  log.info('Schema generated successfully!')
}
