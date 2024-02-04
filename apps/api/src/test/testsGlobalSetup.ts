import { clearDatabase } from '@serieslist/core-db'

export async function setup() {
  await clearDatabase()
}
