import type { User, createDbConnection } from '@serieslist/core-db'
import type { FastifyReply, FastifyRequest } from 'fastify'
import type { YogaInitialContext } from 'graphql-yoga'

export type Context = Omit<YogaInitialContext, 'request'> & {
  db: ReturnType<typeof createDbConnection>['db']
  req: FastifyRequest
  reply: FastifyReply
  currentUser?: User
}

export type AuthenticatedContext = Omit<Context, 'currentUser'> & {
  currentUser: NonNullable<Context['currentUser']>
}

/**
 * Context requiring only the database connection to be there.
 */
export type DBContext = Pick<Context, 'db'>
