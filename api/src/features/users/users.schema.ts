import type { User } from '@/generated/db'
import { builder } from '@/schemaBuilder'

export type UserType = Pick<User, 'name' | 'email'> & {
  id: number
}

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
