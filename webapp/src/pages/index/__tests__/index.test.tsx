import { screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it } from 'vitest'

import { IndexPageDocument } from '@/generated/gql/graphql'
import { createMockResolver, render } from '@/lib/testUtils'

import { Page } from '../index.page'

describe('pages/index/index', () => {
  it('renders the result of a GraphQL query', async () => {
    const [doc, mockResolver] = createMockResolver(IndexPageDocument, {
      data: {
        hello: 'test',
      },
    })

    render(<Page />, {
      requestMocks: [[doc, mockResolver]],
    })

    await screen.findByText('{"hello":"test"}')
    expect(mockResolver).toHaveBeenCalledOnce()
  })
})
