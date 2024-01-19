import { renderToStringWithData } from '@apollo/client/react/ssr'
import React from 'react'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import type { PageContextServer } from 'vike/types'

import { darkThemeClasses, lightThemeClasses } from '#/styles/theme.css'
import { THEME } from '#/utils/theme'

import { PageShell } from './PageShell'

export const passToClient = [
  'pageProps',
  'routeParams',
  'documentProps',
  'apolloInitialState',
  'currentUser',
  'theme',
]

const isProduction = process.env.NODE_ENV === 'production'

export async function render(pageContext: PageContextServer) {
  const { Page, pageProps, theme } = pageContext
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

  // See https://vike.dev/head
  const { documentProps } = pageContext.exports
  const title = documentProps?.title ?? 'Serieslist'
  const desc =
    documentProps?.description ??
    'Always know which episode to watch next. Keep track of your series and seen episodes.'

  const themeClass =
    theme == THEME.DARK
      ? darkThemeClasses.join(' ')
      : lightThemeClasses.join(' ')

  const pwaHead = isProduction
    ? `
      <link rel="manifest" href="/manifest.webmanifest">
      <script src="/registerSW.js"></script>
    `
    : ''

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en" class="${themeClass}">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon-180x180.png" sizes="180x180">
        <link rel="mask-icon" href="/maskable-icon-512x512.png" color="#FFFFFF">
        <meta name="theme-color" content="#6366f1">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <title>${title}</title>

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">

        ${dangerouslySkipEscape(pwaHead)}
      </head>
      <body>
        <div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`

  return {
    documentHtml,
    pageContext: {
      apolloInitialState,
    },
  }
}
