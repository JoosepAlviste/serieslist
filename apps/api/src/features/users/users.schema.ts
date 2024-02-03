import type { User } from '@serieslist/db'
import { builder } from '@serieslist/graphql-server'

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
