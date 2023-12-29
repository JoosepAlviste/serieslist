import { type NotWorthIt } from '@serieslist/type-utils'
import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<NotWorthIt>): Promise<void> {
  await db.schema
    .createTable('series')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('imdb_id', 'varchar(15)', (col) => col.notNull().unique())
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .addColumn('poster', 'varchar(255)')
    .addColumn('start_year', 'int2', (col) => col.notNull())
    .addColumn('end_year', 'int2')
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`NOW()`).notNull(),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`NOW()`).notNull(),
    )
    .execute()
}

export async function down(db: Kysely<NotWorthIt>): Promise<void> {
  await db.schema.dropTable('series').execute()
}
