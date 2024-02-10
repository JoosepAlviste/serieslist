import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import { userFactory } from '@serieslist/core-db-factories'
import type { Context } from '@serieslist/core-graphql-server'
import { createContext } from '@serieslist/core-graphql-server/test'
import { type ExecutionResult, print } from 'graphql'
import { createYoga } from 'graphql-yoga'

import { schema } from '#/schema'

/**
 * A helper for making fully typed GraphQL requests in tests.
 *
 * https://the-guild.dev/graphql/codegen/docs/guides/api-testing
 */
export async function executeOperation<TResult, TVariables>(
  params: {
    operation: TypedDocumentNode<TResult, TVariables>
    /**
     * The authenticated user. Set to `null` to be logged out. If undefined, a new
     * user will be created.
     */
    user?: Context['currentUser'] | null
  } & (TVariables extends Record<string, never>
    ? unknown
    : // Only add the variables field if there are any. Setting to `undefined`
      // still requires giving the key.
      { variables: TVariables }),
): Promise<ExecutionResult<TResult>> {
  const { operation, user } = params

  const authenticatedUser =
    user === undefined ? await userFactory.create() : user

  // create a separate Yoga instance for tests so that we can customize the ctx
  const yoga = createYoga({
    schema,
    context: (ctx) =>
      createContext({
        ctx,
        currentUser: authenticatedUser ?? undefined,
      }),
  })

  const response = await Promise.resolve(
    yoga.fetch('http://yoga/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: print(operation),
        variables: 'variables' in params ? params.variables : undefined,
      }),
    }),
  )

  return (await response.json()) as ExecutionResult<TResult>
}

const graphqlErrors = [
  'BaseError',
  'InvalidInputError',
  'UnauthorizedError',
  'NotFoundError',
] as const
type GraphqlErrors = (typeof graphqlErrors)[number]

/**
 * If the returned data is an error, throw an exception. Otherwise, return the
 * data with the correct type set.
 *
 * This is necessary when the API returns unions with errors in responses as
 * otherwise, we'd need to add a bunch of `if` statements in tests to satisfy
 * TypeScript.
 *
 * @example
 * ```ts
 * const result = await executeOperation(graphql(`...`))
 * // result.data.query type is User | InvalidInputError
 *
 * const resultUser = await checkErrors(result.data.query)
 * // If the result was InvalidInputError, an exception is thrown
 * // resultUser is typed as User
 *
 * // No type error below!
 * expect(resultUser.id).toBeTruthy()
 * ```
 */
export const checkErrors = <T extends { __typename: string | GraphqlErrors }>(
  result: T | undefined,
) => {
  if (!result) {
    throw new Error('Expected result to not be undefined.')
  }

  graphqlErrors.forEach((error) => {
    if (result.__typename === error) {
      throw new Error(
        `Expected to not receive a ${error}: ${JSON.stringify(result)}.`,
      )
    }
  })

  return result as Exclude<T, { __typename: GraphqlErrors }>
}

/**
 * Similarly to `checkErrors`, this function allows extracting an error from the
 * GraphQL response in tests so that it has the correct type.
 */
export const expectErrors = <
  ErrorKey extends GraphqlErrors,
  T extends { __typename: ErrorKey | string },
>(
  result: T | undefined,
) => {
  if (!result) {
    throw new Error('Expected result to not be undefined.')
  }

  const error = graphqlErrors.find((e) => result.__typename === e)
  if (!error) {
    throw new Error(`Expected to have an error, got ${JSON.stringify(result)}.`)
  }

  return result as Extract<T, { __typename: ErrorKey }>
}
