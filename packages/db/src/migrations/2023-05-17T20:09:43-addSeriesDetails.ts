import type { NotWorthIt } from '@serieslist/type-utils'
import type { Kysely } from 'kysely'

export async function up(db: Kysely<NotWorthIt>): Promise<void> {
  await db.schema
    .alterTable('series')
    .addColumn('runtime_minutes', 'int2')
    .addColumn('plot', 'text')
    .addColumn('imdb_rating', 'int2')
    .addColumn('synced_at', 'timestamptz')
    .execute()
}

export async function down(db: Kysely<NotWorthIt>): Promise<void> {
  await db.schema
    .alterTable('series')
    .dropColumn('runtime_minutes')
    .dropColumn('plot')
    .dropColumn('imdb_rating')
    .dropColumn('synced_at')
    .execute()
}
