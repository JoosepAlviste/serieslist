import { type YogaInitialContext } from 'graphql-yoga'

import { type db } from '@/lib/db'

export type Context = YogaInitialContext & {
  db: typeof db
}
