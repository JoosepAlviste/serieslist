import { ApolloProvider, type DocumentNode } from '@apollo/client'
import type {
  ResultOf,
  TypedDocumentNode,
  VariablesOf,
} from '@graphql-typed-document-node/core'
import { Provider as TooltipProvider } from '@radix-ui/react-tooltip'
import {
  act,
  fireEvent,
  render as baseRender,
  screen,
  type RenderOptions,
} from '@testing-library/react'
import { createMockClient, type RequestHandler } from 'mock-apollo-client'
import React, { type ReactElement } from 'react'

import {
  AuthenticatedUserProvider,
  type AuthenticatedUser,
} from '#/features/auth'
import { userFactory } from '#/features/users'
import { CurrentUserDocument } from '#/generated/gql/graphql'
import { PageContextProvider } from '#/providers/PageContextProvider'
import { ToastProvider } from '#/providers/ToastProvider'
import { type NotWorthIt, type LiterallyAnything } from '#/types/utils'
import { wait } from '#/utils/misc'

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
  requestMocks?: (readonly [DocumentNode, RequestHandler])[]

  /**
   * The currently authenticated user. If `null` is passed in, then there is no
   * user.
   */
  authenticatedUser?: AuthenticatedUser | null

  /**
   * Whether to skip the `await wait()` after rendering.
   */
  skipWaiting?: boolean
}

/**
 * A wrapper around RTL `render` for setting up mocks.
 */
export const render = async (
  ui: ReactElement,
  {
    requestMocks = [],
    authenticatedUser,
    skipWaiting = false,
    ...options
  }: Omit<RenderOptions, 'queries'> & ExtraRenderOptions = {},
) => {
  const mockClient = createMockClient({
    connectToDevTools: false,
  })

  const authenticatedUserMock = vi.fn().mockResolvedValue({
    data: {
      me:
        authenticatedUser === undefined
          ? userFactory.build({
              name: 'Test Dude',
              email: 'test@serieslist.com',
            })
          : authenticatedUser,
    },
  })
  mockClient.setRequestHandler(CurrentUserDocument, authenticatedUserMock)

  requestMocks.forEach(([documentNode, handler]) => {
    mockClient.setRequestHandler(documentNode, handler)
  })

  const utils = baseRender(
    <ApolloProvider client={mockClient}>
      <PageContextProvider
        pageContext={
          // The page context is required for some components.
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          {
            urlPathname: '',
            routeParams: {},
          } as NotWorthIt
        }
      >
        <AuthenticatedUserProvider>
          <ToastProvider>
            <TooltipProvider>{ui}</TooltipProvider>
          </ToastProvider>
        </AuthenticatedUserProvider>
      </PageContextProvider>
    </ApolloProvider>,
    options,
  )

  if (!skipWaiting) {
    await act(() => {
      return wait()
    })
  }

  return utils
}

/**
 * A helper for creating a type-safe mock resolver for Apollo.
 */
export const createMockResolver = <
  T extends TypedDocumentNode<LiterallyAnything, LiterallyAnything>,
>(
  document: T,
  mockResponse: { data: Omit<ResultOf<T>, '__typename'> },
) => {
  const handler = vi
    .fn<[VariablesOf<T>], Promise<{ data: Omit<ResultOf<T>, '__typename'> }>>()
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

/**
 * A matcher helper for querying elements by text when the text is split between
 * multiple elements.
 *
 * https://github.com/testing-library/dom-testing-library/issues/410#issuecomment-1536238708
 */
export const textContentMatcher = (textMatch: string | RegExp) => {
  const hasText =
    typeof textMatch === 'string'
      ? (node: Element) => node.textContent === textMatch
      : (node: Element) => textMatch.test(node.textContent ?? '')

  const matcher = (_content: string, node: Element | null) => {
    if (!node || !hasText(node)) {
      return false
    }

    return Array.from(node.children).every((child) => !hasText(child))
  }

  matcher.toString = () => `textContentMatcher(${String(textMatch)})`

  return matcher
}
