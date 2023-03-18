import { describe, it, expect } from 'vitest'

import { graphql } from '@/generated/gql/index.js'
import { executeOperation } from '@/test/testUtils.js'

describe('schema', () => {
  it('returns a hello world', async () => {
    const result = await executeOperation(
      graphql(`
        query HelloQuery {
          hello
        }
      `),
    )

    expect(result.data?.hello).toEqual('world')
  })
})
