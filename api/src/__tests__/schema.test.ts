import { graphql } from '@/generated/gql/index'
import { executeOperation } from '@/test/testUtils'

describe('schema', () => {
  it('returns a hello world', async () => {
    const result = await executeOperation({
      operation: graphql(`
        query HelloQuery {
          hello
        }
      `),
    })

    expect(result.data?.hello).toEqual('hello world')
  })
})
