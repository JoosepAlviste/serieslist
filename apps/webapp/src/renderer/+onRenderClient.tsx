import type { NormalizedCacheObject, ApolloClient } from '@apollo/client'
import React from 'react'
import { hydrateRoot, createRoot, type Root } from 'react-dom/client'
import type { PageContextClient } from 'vike/types'

import { CurrentUserDocument } from '#/generated/gql/graphql'
import { makeApolloClient } from '#/lib/apollo'

import { getPageTitle } from './getPageTitle'
import { PageShell } from './PageShell'

import '#/lib/initSentry'
import '#/lib/tracing'
import '#/lib/zod'

let root: Root | undefined
/**
 * Keep track of the Apollo client instance used in the client-side so that we
 * don't create a new instance on every page load.
 */
let apollo: ApolloClient<NormalizedCacheObject> | undefined

export function onRenderClient(pageContext: PageContextClient) {
  const { Page, pageProps } = pageContext

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!Page) {
    throw new Error(
      'Client-side render() hook expects pageContext.Page to be defined',
    )
  }

  // Create a new Apollo Client instance if it is not already created
  apollo = pageContext.apollo =
    apollo ??
    makeApolloClient({
      initialState: pageContext.apolloInitialState,
    })
  // Set the currentUser in the PageContext from Apollo Cache. It's probably
  // already set in the cache in case of client-side page navigation.
  // Client-side page navigation does NOT keep the pageContext.
  const currentUser = apollo.readQuery({
    query: CurrentUserDocument,
  })?.me
  pageContext.currentUser ??=
    currentUser?.__typename === 'User' ? currentUser : undefined

  const page = (
    <PageShell pageContext={pageContext}>
      <Page {...pageProps} />
    </PageShell>
  )
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const container = document.getElementById('page-view')!
  if (pageContext.isHydration) {
    root = hydrateRoot(container, page)
  } else {
    if (!root) {
      root = createRoot(container)
    }
    root.render(page)
  }
  document.title = getPageTitle(pageContext)
}
