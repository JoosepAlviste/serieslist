import type { User } from '@serieslist/core-db'
import { builder } from '@serieslist/core-graphql-server'

export const UserRef = builder.objectRef<User>('User')

builder.objectType(UserRef, {
  fields: (t) => ({
    id: t.id({
      resolve: (parent) => String(parent.id),
    }),
    name: t.exposeString('name'),
    email: t.exposeString('email'),
  }),
})
