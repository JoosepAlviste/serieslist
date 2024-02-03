import { user, type User } from '@serieslist/db'
import { Factory } from 'fishery'
import { nanoid } from 'nanoid'

import { db } from './lib/db'

export const userFactory = Factory.define<User>(({ sequence, onCreate }) => {
  onCreate(async (userArgs) => {
    return db
      .insert(user)
      .values({ ...userArgs, id: undefined })
      .returning()
      .then((rows) => rows[0])
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
})
