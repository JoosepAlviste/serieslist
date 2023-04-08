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
  field: string
  message: string
}

export const InvalidInputErrorFieldRef = builder
  .objectRef<InvalidInputErrorField>('InvalidInputErrorField')
  .implement({
    fields: (t) => ({
      field: t.exposeString('field'),
      message: t.exposeString('message'),
    }),
  })

export class InvalidInputError extends Error {
  constructor(
    public fieldErrors: InvalidInputErrorField[],
    message = 'Invalid input',
  ) {
    super(message)
  }
}

builder.objectType(InvalidInputError, {
  name: 'InvalidInputError',
  interfaces: [ErrorInterfaceRef],
  fields: (t) => ({
    fieldErrors: t.field({
      type: [InvalidInputErrorFieldRef],
      resolve: (parent) => parent.fieldErrors,
    }),
  }),
})
