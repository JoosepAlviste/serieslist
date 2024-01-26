import { type NotWorthIt } from '@serieslist/type-utils'
import { type Kysely } from 'kysely'

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
