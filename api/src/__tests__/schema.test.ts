import { describe, it, expect } from 'vitest'
import { parse } from 'graphql'
import { executor } from '@/test/testUtils'

describe('schema', () => {
  it('returns a hello world', async () => {
    const result = await executor({
      document: parse(/* GraphQL */ `
        query {
          hello
        }
      `),
    })

    expect((result as { data: { hello: string } }).data.hello).toBe('world')
  })
})
