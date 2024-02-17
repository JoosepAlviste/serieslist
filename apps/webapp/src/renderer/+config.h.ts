import type { Config } from 'vike/types'

export default {
  passToClient: [
    'pageProps',
    'routeParams',
    'documentProps',
    'apolloInitialState',
    'currentUser',
    'theme',
  ],
  // Enable client-side routing
  // https://vike.dev/clientRouting
  clientRouting: true,
  hydrationCanBeAborted: true,
} satisfies Config
