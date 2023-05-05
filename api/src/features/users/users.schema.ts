import { type Selectable } from 'kysely'

import type { User } from '@/generated/db'
import { builder } from '@/schemaBuilder'

export type UserType = Pick<Selectable<User>, 'id' | 'name' | 'email'>

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
