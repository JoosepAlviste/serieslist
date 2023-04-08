import { UserRef } from '@/features/users/users.schema'
import { InvalidInputError } from '@/schema/errors.schema'
import { builder } from '@/schemaBuilder'

const RegisterInput = builder.inputType('RegisterInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
    email: t.string({ required: true }),
    password: t.string({ required: true }),
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
        types: [InvalidInputError],
      },
      resolve: async (_parent, args, ctx) => {
        const { name, password, email } = args.input

        if (name.length < 1) {
          throw new InvalidInputError([
            {
              message: 'Name is required',
              field: 'name',
            },
          ])
        }

        const user = await ctx.db
          .insertInto('user')
          .values({
            name,
            email,
            password,
          })
          .returning(['id', 'name', 'email'])
          .executeTakeFirst()

        if (!user) {
          throw new Error('something went wrong!')
        }

        return user
      },
    }),
  }),
})
