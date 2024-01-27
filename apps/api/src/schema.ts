import { builder } from '@serieslist/graphql-server'

import '#/features/auth/auth.schema'
import '#/features/users/users.schema'
import '#/features/series/series.schema'
import '#/features/seriesProgress/seriesProgress.schema'
import '#/schema/errors.schema'
import '#/schema/scalars.schema'

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
