import { ZodError } from 'zod'

import { UserRef } from '@/features/users/users.schema'
import { builder } from '@/schemaBuilder'

import { register } from './auth.service'

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
        return register(ctx)(args.input)
      },
    }),
  }),
})
