import { builder } from './schemaBuilder'

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
