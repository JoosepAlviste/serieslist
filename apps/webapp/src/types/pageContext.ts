import type { NormalizedCacheObject, ApolloClient } from '@apollo/client'

import type { AuthenticatedUser } from '#/features/auth'
import type { Theme } from '#/utils/theme'

type DocumentProps = {
  title?: string
  description?: string
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Vike {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface PageContext {
      apollo: ApolloClient<NormalizedCacheObject>
      apolloInitialState: NormalizedCacheObject
      currentUser?: AuthenticatedUser
      theme?: Theme

      documentProps?: DocumentProps

      exports: {
        documentProps?: DocumentProps
      }

      Page: (pageProps: PageProps) => JSX.Element
      pageProps?: PageProps

      abortReason: string
    }
  }
}

type PageProps = Record<string, unknown>

export {}
