import { ZodError, type ZodFormattedError } from 'zod'

import { UnauthorizedError } from '@/lib/errors'

import { builder } from '../schemaBuilder'

export const ErrorInterfaceRef = builder
  .interfaceRef<Error>('Error')
  .implement({
    fields: (t) => ({
      message: t.exposeString('message'),
    }),
  })

builder.objectType(Error, {
  name: 'BaseError',
  interfaces: [ErrorInterfaceRef],
})

type InvalidInputErrorField = {
  path: string[]
  message: string
}

export const InvalidInputErrorFieldRef = builder
  .objectRef<InvalidInputErrorField>('InvalidInputErrorField')
  .implement({
    fields: (t) => ({
      path: t.exposeStringList('path'),
      message: t.exposeString('message'),
    }),
  })

/**
 * Format Zod validation errors into a type that's more easily expressible in
 * GraphQL.
 *
 * https://pothos-graphql.dev/docs/plugins/errors#with-validation-plugin
 */
const flattenErrors = (
  error: ZodFormattedError<unknown>,
  path: string[] = [],
): { path: string[]; message: string }[] => {
  const errors = error._errors.map((message) => ({
    path,
    message,
  }))

  Object.keys(error).forEach((key) => {
    if (key !== '_errors') {
      errors.push(
        ...flattenErrors(
          (error as Record<string, unknown>)[key] as ZodFormattedError<unknown>,
          [...path, key],
        ),
      )
    }
  })

  return errors
}

builder.objectType(ZodError, {
  name: 'InvalidInputError',
  interfaces: [ErrorInterfaceRef],
  fields: (t) => ({
    fieldErrors: t.field({
      type: [InvalidInputErrorFieldRef],
      resolve: (err) => flattenErrors(err.format()),
    }),
  }),
})

builder.objectType(UnauthorizedError, {
  name: 'UnauthorizedError',
  interfaces: [ErrorInterfaceRef],
})
