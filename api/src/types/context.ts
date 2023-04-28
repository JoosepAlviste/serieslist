import { type FastifyReply, type FastifyRequest } from 'fastify'
import { type YogaInitialContext } from 'graphql-yoga'
import { type Selectable } from 'kysely'

import { type User } from '@/generated/db'
import { type db } from '@/lib/db'

export type Context = Omit<YogaInitialContext, 'request'> & {
  db: typeof db
  req: FastifyRequest
  reply: FastifyReply
  currentUser?: Selectable<User>
}
