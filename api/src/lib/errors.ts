import { ZodError, type ZodIssue } from 'zod'

export const createValidationError =
  (args: Partial<Pick<ZodIssue, 'path' | 'message'>>) => () => {
    return new ZodError([
      {
        code: 'custom',
        path: ['root'],
        message: 'Something went wrong',
        ...args,
      },
    ])
  }

export class UnauthorizedError extends Error {
  constructor() {
    super('Not authorized')
  }
}
