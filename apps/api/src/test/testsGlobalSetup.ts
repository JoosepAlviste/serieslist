import { clearDatabase } from './clearDatabase'

export async function setup() {
  await clearDatabase()
}
