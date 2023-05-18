import { type Kysely } from 'kysely'

import { type DB } from '@/generated/db'

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable('season')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('series_id', 'integer', (col) =>
      col.references('series.id').onDelete('cascade').notNull(),
    )
    .addColumn('number', 'int2', (col) => col.notNull())
    .execute()
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable('series').execute()
}
