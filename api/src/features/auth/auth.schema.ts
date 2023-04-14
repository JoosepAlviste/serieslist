import { ZodError } from 'zod'

import { UserRef, type UserType } from '@/features/users/users.schema'
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

export type AuthPayload = {
  user: UserType
  accessToken: string
  refreshToken: string
}

const AuthPayloadRef = builder.objectRef<AuthPayload>('AuthPayload').implement({
  fields: (t) => ({
    user: t.field({
      type: UserRef,
      nullable: false,
      resolve: (parent) => parent.user,
    }),
    accessToken: t.exposeString('accessToken'),
    refreshToken: t.exposeString('refreshToken'),
  }),
})

builder.mutationType({
  fields: (t) => ({
    register: t.field({
      type: AuthPayloadRef,
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
      type: AuthPayloadRef,
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
