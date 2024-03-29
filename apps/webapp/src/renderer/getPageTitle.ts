import type { PageContext } from 'vike/types'

export function getPageTitle(pageContext: PageContext): string {
  const title =
    // For static titles (defined in the `export { documentProps }` of the page's `.page.js`)
    pageContext.exports.documentProps?.title ??
    // For dynamic tiles (defined in the `export addContextProps()` of the page's `.page.server.js`)
    pageContext.documentProps?.title

  return title ? `${title} · Serieslist` : 'Serieslist'
}
