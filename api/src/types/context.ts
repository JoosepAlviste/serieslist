import { type db } from '@/lib/db'

export type Context = {
  db: typeof db
}
