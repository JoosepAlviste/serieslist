import { clearDatabase } from '@serieslist/db'

export async function setup() {
  await clearDatabase()
}
