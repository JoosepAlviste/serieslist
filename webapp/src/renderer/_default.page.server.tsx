import { renderToStringWithData } from '@apollo/client/react/ssr'
import React from 'react'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr'

import { CurrentUserDocument } from '@/generated/gql/graphql'
import { themeClass } from '@/styles/theme.css'

import logoUrl from './favicon.ico'
import { PageShell } from './PageShell'
import type { PageContextServer } from './types'

export const passToClient = [
  'pageProps',
  'documentProps',
  'apolloInitialState',
  'currentUser',
]

export async function render(pageContext: PageContextServer) {
  const { Page, pageProps } = pageContext
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!Page) {
    throw new Error('My render() hook expects pageContext.Page to be defined')
  }

  const tree = (
    <PageShell pageContext={pageContext}>
      <Page {...pageProps} />
    </PageShell>
  )
  const pageHtml = await renderToStringWithData(tree)

  const apolloInitialState = pageContext.apollo.extract()
  const currentUserResponse = await pageContext.apollo.query({
    query: CurrentUserDocument,
  })

  // See https://vite-plugin-ssr.com/head
  const { documentProps } = pageContext.exports
  const title = documentProps?.title ?? 'Serieslist'
  const desc = documentProps?.description ?? 'App using Vite + vite-plugin-ssr'

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${logoUrl}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <title>${title}</title>

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
      </head>
      <body class="${themeClass}">
        <div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`

  return {
    documentHtml,
    pageContext: {
      apolloInitialState,
      currentUser:
        currentUserResponse.data.me.__typename === 'User'
          ? currentUserResponse.data.me
          : undefined,
    },
  }
}
