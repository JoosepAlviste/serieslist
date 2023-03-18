import React from 'react'
import { hydrateRoot, createRoot, type Root } from 'react-dom/client'

import { getPageTitle } from './getPageTitle'
import { PageShell } from './PageShell'
import type { PageContextClient } from './types'

let root: Root | undefined

export function render(pageContext: PageContextClient) {
  const { Page, pageProps } = pageContext

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!Page) {
    throw new Error(
      'Client-side render() hook expects pageContext.Page to be defined',
    )
  }

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

// Enable client-side routing
// https://vite-plugin-ssr.com/clientRouting
export const clientRouting = true
export const hydrationCanBeAborted = true
