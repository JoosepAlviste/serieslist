import { ZodError } from 'zod'

import { UserRef } from '#/features/users'
import { UnauthorizedError } from '#/lib/errors'
import { builder } from '#/schemaBuilder'

import * as authService from './auth.service'

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
        return authService.register({ ctx, input: args.input })
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
        return authService.login({ ctx, input: args.input })
      },
    }),

    logOut: t.field({
      type: 'Boolean',
      resolve: (_parent, _args, ctx) => {
        return authService.logOut({ ctx })
      },
    }),
  }),
})

builder.queryFields((t) => ({
  me: t.authField({
    type: UserRef,
    nullable: false,
    authScopes: {
      authenticated: true,
    },
    errors: {
      types: [UnauthorizedError],
    },
    resolve: (_parent, _args, ctx) => {
      return ctx.currentUser
    },
  }),
}))
