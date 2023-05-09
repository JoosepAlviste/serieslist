import { builder } from './schemaBuilder'

import '@/features/auth/auth.schema'
import '@/features/users/users.schema'
import '@/features/series/series.schema'
import '@/schema/errors.schema'

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: {
        name: t.arg.string(),
      },
      resolve: (_, { name }) => {
        return `hello ${name ?? 'world'}`
      },
    }),
  }),
})

export const schema = builder.toSchema()
