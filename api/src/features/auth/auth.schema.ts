import { ZodError } from 'zod'

import { UserRef } from '@/features/users/users.schema'
import { builder } from '@/schemaBuilder'

import { login, register } from './auth.service'

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

const LoginInput = builder.inputType('LoginInput', {
  fields: (t) => ({
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
      resolve: (_parent, args, ctx) => {
        return register(ctx)(args.input)
      },
    }),

    login: t.field({
      type: UserRef,
      args: {
        input: t.arg({ type: LoginInput, required: true }),
      },
      errors: {
        types: [ZodError],
      },
      resolve: (_parent, args, ctx) => {
        return login(ctx)(args.input)
      },
    }),
  }),
})

builder.queryFields((t) => ({
  me: t.field({
    type: UserRef,
    nullable: true,
    resolve: (_parent, _args, ctx) => {
      return ctx.currentUser
    },
  }),
}))
