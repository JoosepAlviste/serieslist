import { type NormalizedCacheObject, type ApolloClient } from '@apollo/client'

import { type AuthenticatedUser } from '#/features/auth'
import { type Theme } from '#/utils/theme'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Vike {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface PageContext {
      apollo: ApolloClient<NormalizedCacheObject>
      apolloInitialState: NormalizedCacheObject
      currentUser?: AuthenticatedUser
      theme?: Theme

      exports: {
        documentProps?: {
          title?: string
          description?: string
        }
      }

      Page: (pageProps: PageProps) => JSX.Element
      pageProps?: PageProps

      abortReason: string
    }
  }
}

type PageProps = Record<string, unknown>

export {}
