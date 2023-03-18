import { type NormalizedCacheObject, type ApolloClient } from '@apollo/client'
import type { PageContextBuiltIn } from 'vite-plugin-ssr'
import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client/router'

export type Page = (pageProps: PageProps) => React.ReactElement
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PageProps {}

export interface PageContextCustom {
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
}

export type PageContextServer = PageContextBuiltIn<Page> & PageContextCustom
export type PageContextClient = PageContextBuiltInClient<Page> &
  PageContextCustom

export type PageContext = PageContextClient | PageContextServer
