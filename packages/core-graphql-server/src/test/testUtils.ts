import type { NotWorthIt } from '@serieslist/util-types'
import type { YogaInitialContext } from 'graphql-yoga'

import { db } from '../lib/db'
import type { AuthenticatedContext, Context } from '../types/context'

export const createContext = <T extends Context['currentUser']>({
  ctx = {},
  currentUser,
}: {
  ctx?: Partial<YogaInitialContext>
  currentUser?: T
} = {}): T extends undefined ? Context : AuthenticatedContext =>
  ({
    params: {},
    // We can't really create the Fastify request and reply objects on their
    // own, so we only mock the fields that we need from them
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    req: null as NotWorthIt,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    reply: {
      setCookie: vi.fn(),
    } as NotWorthIt,
    ...ctx,
    db,
    currentUser,
  } as T extends undefined ? Context : AuthenticatedContext)
