import type { NotWorthIt } from '@serieslist/type-utils'
import type { Kysely } from 'kysely'

export async function up(db: Kysely<NotWorthIt>): Promise<void> {
  await db.schema
    .createTable('episode')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('imdb_id', 'varchar(15)', (col) => col.notNull().unique())
    .addColumn('season_id', 'integer', (col) =>
      col.references('season.id').onDelete('cascade').notNull(),
    )
    .addColumn('number', 'int2', (col) => col.notNull())
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .addColumn('released_at', 'date')
    .addColumn('imdb_rating', 'decimal')
    .execute()
}

export async function down(db: Kysely<NotWorthIt>): Promise<void> {
  await db.schema.dropTable('episode').execute()
}
