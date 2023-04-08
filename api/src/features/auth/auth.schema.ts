import { ZodError } from 'zod'

import { UserRef } from '@/features/users/users.schema'
import { builder } from '@/schemaBuilder'

const RegisterInput = builder.inputType('RegisterInput', {
  fields: (t) => ({
    name: t.string({
      required: true,
      validate: {
        minLength: 2,
      },
    }),
    email: t.string({
      required: true,
      validate: {
        email: true,
      },
    }),
    password: t.string({
      required: true,
      validate: {
        minLength: 7,
      },
    }),
  }),
})

builder.mutationType({
  fields: (t) => ({
    register: t.field({
      type: UserRef,
      args: {
        input: t.arg({ type: RegisterInput, required: true }),
      },
      errors: {
        types: [ZodError],
      },
      resolve: async (_parent, args, ctx) => {
        const { name, password, email } = args.input

        const user = await ctx.db
          .insertInto('user')
          .values({
            name,
            email,
            password,
          })
          .returning(['id', 'name', 'email'])
          .executeTakeFirstOrThrow()

        return user
      },
    }),
  }),
})
