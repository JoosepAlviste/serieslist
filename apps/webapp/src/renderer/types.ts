import { type NormalizedCacheObject, type ApolloClient } from '@apollo/client'
import type {
  PageContextBuiltIn,
  PageContextBuiltInClientWithClientRouting as PageContextBuiltInClient,
} from 'vite-plugin-ssr/types'

import { type AuthenticatedUser } from '#/features/auth'
import { type Theme } from '#/utils/theme'

export type Page = (pageProps: PageProps) => React.ReactElement
export type PageProps = Record<string, unknown>

export type PageContextCustom = {
  Page: Page
  pageProps?: PageProps
  exports: {
    documentProps?: {
      title?: string
      description?: string
    }
  }
  apollo: ApolloClient<NormalizedCacheObject>
  apolloInitialState: NormalizedCacheObject
  currentUser?: AuthenticatedUser
  redirectTo?: string
  theme?: Theme
}

export type PageContextServer = PageContextBuiltIn<Page> & PageContextCustom
export type PageContextClient = PageContextBuiltInClient<Page> &
  PageContextCustom

export type PageContext = PageContextClient | PageContextServer
