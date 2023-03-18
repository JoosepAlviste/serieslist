import { type TypedDocumentNode } from '@graphql-typed-document-node/core'
import { type ExecutionResult, print } from 'graphql'

import { yoga } from '@/server.js'

/**
 * A helper for making fully typed GraphQL requests in tests.
 *
 * https://the-guild.dev/graphql/codegen/docs/guides/api-testing
 */
export async function executeOperation<TResult, TVariables>(
  operation: TypedDocumentNode<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
): Promise<ExecutionResult<TResult>> {
  const response = await Promise.resolve(
    yoga.fetch('http://yoga/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: print(operation),
        variables: variables ?? undefined,
      }),
    }),
  )

  return (await response.json()) as ExecutionResult<TResult>
}
