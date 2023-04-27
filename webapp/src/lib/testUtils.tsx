import { ApolloProvider, type DocumentNode } from '@apollo/client'
import type {
  ResultOf,
  TypedDocumentNode,
  VariablesOf,
} from '@graphql-typed-document-node/core'
import {
  fireEvent,
  render as baseRender,
  screen,
  type RenderOptions,
} from '@testing-library/react'
import { createMockClient, type RequestHandler } from 'mock-apollo-client'
import React, { type ReactElement } from 'react'
import { vi } from 'vitest'

import { type LiterallyAnything } from '@/types/utils'

type ExtraRenderOptions = {
  /**
   * Mocks for GraphQL requests
   *
   * A list of two-tuples where the first element is the GraphQL request
   * document (query or mutation) and the second element is the mock response
   * that Apollo Client should respond with.
   *
   * Use `createMockResolver` to easily create this in a type-safe manner.
   */
  requestMocks?: [DocumentNode, RequestHandler][]
}

/**
 * A wrapper around RTL `render` for setting up mocks.
 */
export const render = (
  ui: ReactElement,
  {
    requestMocks = [],
    ...options
  }: Omit<RenderOptions, 'queries'> & ExtraRenderOptions = {},
) => {
  const mockClient = createMockClient({
    connectToDevTools: false,
  })

  requestMocks.forEach(([documentNode, handler]) => {
    mockClient.setRequestHandler(documentNode, handler)
  })

  return baseRender(
    <ApolloProvider client={mockClient}>{ui}</ApolloProvider>,
    options,
  )
}

/**
 * A helper for creating a type-safe mock resolver for Apollo.
 */
export const createMockResolver = <
  T extends TypedDocumentNode<LiterallyAnything, LiterallyAnything>,
>(
  document: T,
  mockResponse: { data: ResultOf<T> },
) => {
  const handler = vi
    .fn<[VariablesOf<T>], Promise<{ data: ResultOf<T> }>>()
    .mockResolvedValue(mockResponse)

  return [document, handler] as const
}

export const fillForm = (fields: Record<string, string>) => {
  Object.entries(fields).forEach(([field, value]) => {
    fireEvent.change(screen.getByLabelText(field), {
      target: { value },
    })
  })
}
