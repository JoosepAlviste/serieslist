import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  type NormalizedCacheObject,
} from '@apollo/client/core/index.js'
import fetch from 'isomorphic-unfetch'

interface MakeApolloClientOptions {
  ssr?: boolean
  initialState?: NormalizedCacheObject
}

export const makeApolloClient = ({
  ssr = false,
  initialState,
}: MakeApolloClientOptions) => {
  const cache = new InMemoryCache()
  if (initialState) {
    cache.restore(initialState)
  }

  const uri = 'http://localhost:4000/graphql'
  const apolloClient = new ApolloClient({
    ssrMode: ssr,
    uri: ssr ? undefined : uri,
    link: ssr
      ? createHttpLink({
          uri,
          fetch,
        })
      : undefined,
    cache,
  })

  return apolloClient
}
