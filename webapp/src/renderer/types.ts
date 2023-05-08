import { type NormalizedCacheObject, type ApolloClient } from '@apollo/client'
import type { PageContextBuiltIn } from 'vite-plugin-ssr'
import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client/router'

import { type AuthenticatedUser } from '@/features/auth'

export type Page = (pageProps: PageProps) => React.ReactElement
export type PageProps = Record<string, unknown>

export type PageContextCustom = {
  Page: Page
  pageProps?: PageProps
  urlPathname: string
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
}

export type PageContextServer = PageContextBuiltIn<Page> & PageContextCustom
export type PageContextClient = PageContextBuiltInClient<Page> &
  PageContextCustom

export type PageContext = PageContextClient | PageContextServer
