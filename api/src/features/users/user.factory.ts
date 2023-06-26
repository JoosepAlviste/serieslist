import { Factory } from 'fishery'
import { type Selectable } from 'kysely'
import { nanoid } from 'nanoid'

import { type User } from '@/generated/db'
import { db } from '@/lib/db'

export const userFactory = Factory.define<Selectable<User>>(
  ({ sequence, onCreate }) => {
    onCreate((user) => {
      return db
        .insertInto('user')
        .returningAll()
        .values({
          ...user,
          id: undefined,
        })
        .executeTakeFirstOrThrow()
    })

    const uid = nanoid()

    return {
      id: sequence,
      name: `Test Dude ${uid}`,
      email: `test-${uid}@test.com`,
      isAdmin: false,
      // This might be "test123"
      password: '$2a$10$oMk0jHG5BWPHJ/rXzOp0neSLxDn19Q.M/DX5dIRrVGH2.SZhYMf5S',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  },
)
