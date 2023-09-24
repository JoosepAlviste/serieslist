import {
  type ApolloCache,
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  type NormalizedCacheObject,
} from '@apollo/client/core/index.js'
import { type FastifyRequest } from 'fastify'
import fetch from 'isomorphic-unfetch'

import { config } from '#/config'

type MakeApolloClientOptions = {
  ssr?: boolean
  initialState?: NormalizedCacheObject
  req?: FastifyRequest
}

export const makeApolloClient = ({
  ssr = false,
  initialState,
  req,
}: MakeApolloClientOptions) => {
  const cache = new InMemoryCache()
  if (initialState) {
    cache.restore(initialState)
  }

  const cookie = req?.headers.cookie

  const uri = `${ssr ? config.api.internalUrl : config.api.url}/graphql`
  const apolloClient = new ApolloClient({
    connectToDevTools: Boolean(config.development && !ssr),
    ssrMode: ssr,
    link: createHttpLink({
      uri,
      fetch: ssr ? fetch : undefined,
      credentials: 'include',
      // Pass along cookies from the client request when SSR-ing
      headers: cookie ? { cookie } : undefined,
    }),
    cache,
  })

  return apolloClient
}

/**
 * Invalidate the give cache fields after after a mutation.
 *
 * Usage example:
 * ```ts
 * const [mutate] = useMutation(graphql(`...`), {
 *   update: invalidateCacheFields(['userSeriesList']),
 * })
 * ```
 */
export const invalidateCacheFields =
  (fields: string[]) => (cache: ApolloCache<unknown>) => {
    cache.modify({
      fields: fields.reduce<Record<string, () => void>>((acc, curr) => {
        acc[curr] = () => undefined
        return acc
      }, {}),
    })
  }
