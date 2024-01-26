import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { format } from 'date-fns'

import { log } from './logger'

const dirname = fileURLToPath(new URL('.', import.meta.url))

export const generateMigration = async ({ name }: { name: string }) => {
  const filename = `${format(new Date(), "yyyy-MM-dd'T'HH-mm-ss")}-${name}.ts`
  const path = join(dirname, 'migrations', filename)

  const content = `import { type NotWorthIt } from '@serieslist/type-utils'
import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<NotWorthIt>): Promise<void> {

}

export async function down(db: Kysely<NotWorthIt>): Promise<void> {

}
`

  await writeFile(path, content)

  log.info({ path }, 'migration generated successfully')
}
