export class UnauthorizedError extends Error {
  constructor() {
    super('Not authorized')
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Not found') {
    super(message)
  }
}
