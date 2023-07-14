import { type Kysely } from 'kysely'

import { type NotWorthIt } from '@/types/utils'

export async function up(db: Kysely<NotWorthIt>): Promise<void> {
  await db.schema
    .alterTable('series')
    .alterColumn('imdb_rating', (ac) => ac.setDataType('decimal'))
    .execute()
}

export async function down(db: Kysely<NotWorthIt>): Promise<void> {
  await db.schema
    .alterTable('series')
    .alterColumn('imdb_rating', (ac) => ac.setDataType('int2'))
    .execute()
}
