import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  type NormalizedCacheObject,
} from '@apollo/client/core/index.js'
import { type Request } from 'express'
import fetch from 'isomorphic-unfetch'

import { config } from '@/config'

type MakeApolloClientOptions = {
  ssr?: boolean
  initialState?: NormalizedCacheObject
  req?: Request
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

  const cookie = req?.header('Cookie')

  const uri = `${config.api.url}/graphql`
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
