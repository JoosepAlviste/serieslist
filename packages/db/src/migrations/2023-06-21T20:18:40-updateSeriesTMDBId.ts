import { type NotWorthIt } from '@serieslist/type-utils'
import { type Kysely } from 'kysely'

export async function up(db: Kysely<NotWorthIt>): Promise<void> {
  await db.schema
    .alterTable('series')
    .alterColumn('imdb_id', (ac) => ac.dropNotNull())
    .addColumn('tmdb_id', 'integer', (col) => col.notNull().unique())
    .alterColumn('start_year', (ac) => ac.dropNotNull())
    .execute()
  await db.schema
    .alterTable('season')
    .addColumn('tmdb_id', 'integer', (col) => col.notNull().unique())
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .execute()
  await db.schema
    .alterTable('episode')
    .alterColumn('imdb_id', (ac) => ac.dropNotNull())
    .addColumn('tmdb_id', 'integer', (col) => col.notNull().unique())
    .execute()
}

export async function down(db: Kysely<NotWorthIt>): Promise<void> {
  await db.schema
    .alterTable('series')
    .alterColumn('imdb_id', (ac) => ac.setNotNull())
    .dropColumn('tmdb_id')
    .execute()
  await db.schema
    .alterTable('season')
    .dropColumn('tmdb_id')
    .dropColumn('title')
    .execute()
  await db.schema
    .alterTable('episode')
    .alterColumn('imdb_id', (ac) => ac.setNotNull())
    .dropColumn('tmdb_id')
    .execute()
}
