import type { User } from '@serieslist/db'
import { builder } from '@serieslist/graphql-server'
import type { Selectable } from 'kysely'

export type UserType = Selectable<User>

export const UserRef = builder.objectRef<UserType>('User')

builder.objectType(UserRef, {
  fields: (t) => ({
    id: t.id({
      resolve: (parent) => String(parent.id),
    }),
    name: t.exposeString('name'),
    email: t.exposeString('email'),
  }),
})
