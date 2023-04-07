import { UserRef } from '@/features/users/users.schema'
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
          .executeTakeFirst()

        if (!user) {
          throw new Error('something went wrong!')
        }

        return user
      },
    }),
  }),
})